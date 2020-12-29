<?php

namespace FoF\Taxonomies\Extenders;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Database\AbstractModel;
use Flarum\Event\GetApiRelationship;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Foundation\ValidationException;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TaxonomyRepository;
use FoF\Taxonomies\Serializers\TermSerializer;
use FoF\Taxonomies\Taxonomy;
use FoF\Taxonomies\Term;
use FoF\Transliterator\Transliterator;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class TaxonomizeModel implements ExtenderInterface
{
    use AssertPermissionTrait;

    protected $type;
    protected $serializer;
    protected $savingEvent;
    protected $savingEventModelCallback;
    protected $validateNonExistingCallback;
    protected $includeInControllers;

    /**
     * @param string $type The type value of the taxonomy for this model
     * @param string $serializer The ::class of the serializer we want to connect Terms to
     * @param string $savingEvent The ::class of the event for saving the model we connect Terms to
     * @param callable $savingEventModelCallback A callback that receives the saving event and returns the eloquent model
     */
    public function __construct(string $type, string $serializer, string $savingEvent, callable $savingEventModelCallback)
    {
        $this->type = $type;
        $this->serializer = $serializer;
        $this->savingEvent = $savingEvent;
        $this->savingEventModelCallback = $savingEventModelCallback;
    }

    /**
     * Add a ::class controller to the list of controllers that should include the terms by default
     * @param string $controller
     * @return $this
     */
    public function includeInController(string $controller)
    {
        $this->includeInControllers[] = $controller;

        return $this;
    }

    /**
     * Registers a callback that receives the saving event and determines whether missing terms should be validated
     * @param callable $callback
     * @return $this
     */
    public function validateNonExistingCallback(callable $callback)
    {
        $this->validateNonExistingCallback = $callback;

        return $this;
    }

    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Serializing::class, [$this, 'serializing']);
        $container['events']->listen(GetApiRelationship::class, [$this, 'relationship']);
        $container['events']->listen(WillGetData::class, [$this, 'includes']);
        $container['events']->listen($this->savingEvent, [$this, 'saving']);
    }

    public function serializing(Serializing $event)
    {
        if ($event->isSerializer($this->serializer)) {
            $event->attributes['fofCanEditTaxonomies'] = $event->actor->can('editTaxonomy', $event->model);

            if ($event->actor->cannot('seeTaxonomy', $event->model)) {
                $event->model->setRelation('taxonomyTerms', null);
            }
        }
    }

    public function relationship(GetApiRelationship $event)
    {
        if ($event->isRelationship($this->serializer, 'taxonomyTerms')) {
            return $event->serializer->hasMany($event->model, TermSerializer::class, 'taxonomyTerms');
        }
    }

    public function includes(WillGetData $event)
    {
        foreach ($this->includeInControllers as $controller) {
            if ($event->isController($controller)) {
                $event->addInclude([
                    'taxonomyTerms',
                    'taxonomyTerms.taxonomy',
                ]);
                return;
            }
        }
    }

    /**
     * @param \Flarum\User\Event\Saving|\Flarum\Discussion\Event\Saving $event
     * @throws ValidationException
     */
    public function saving($event)
    {
        /**
         * @var $model AbstractModel
         */
        $model = call_user_func($this->savingEventModelCallback, $event);

        /**
         * @var $repository TaxonomyRepository
         */
        $repository = app(TaxonomyRepository::class);

        /**
         * @var $validatorFactory Factory
         */
        $validatorFactory = app(Factory::class);

        $alreadyValidatedMinimums = [];

        $taxonomiesData = Arr::get($event->data, 'relationships.taxonomies.data', []);

        if (count($taxonomiesData)) {
            $this->assertCan($event->actor, 'editTaxonomy', $model);
        }

        foreach ($taxonomiesData as $taxonomyData) {
            $taxonomy = $repository->findIdOrFail(Arr::get($taxonomyData, 'id'), $this->type);

            $termIds = [];
            $customTerms = [];

            foreach (Arr::get($taxonomyData, 'relationships.terms.data', []) as $termData) {
                $id = Arr::get($termData, 'id');

                if ($id) {
                    $termIds[] = $id;
                } else {
                    $customTerms[] = Arr::get($termData, 'attributes.name');
                }
            }

            $terms = $taxonomy->terms()->whereIn('id', $termIds)->get();

            $key = 'term_count_' . $taxonomy->slug;
            $rules = ['numeric'];

            if ($taxonomy->min_terms) {
                $rules[] = 'min:' . $taxonomy->min_terms;
            }

            if ($taxonomy->max_terms) {
                $rules[] = 'max:' . $taxonomy->max_terms;
            }

            $validator = $validatorFactory->make(
                [$key => $terms->count() + count($customTerms)],
                [$key => $rules]
            );

            if ($validator->fails()) {
                throw new ValidationException([], ['taxonomyTerms' => $validator->getMessageBag()->first($key)]);
            }

            $alreadyValidatedMinimums[] = $taxonomy->id;

            foreach ($customTerms as $customTerm) {
                $key = 'term_name_' . $taxonomy->slug;

                $validation = 'string';

                if (in_array($taxonomy->custom_value_validation, ['alpha_num', 'alpha_dash'])) {
                    $validation = $taxonomy->custom_value_validation;
                }

                if (Str::startsWith($taxonomy->custom_value_validation, '/')) {
                    $validation = 'regex:' . $taxonomy->custom_value_validation;
                }

                $validator = $validatorFactory->make(
                    [$key => $customTerm],
                    [$key => $validation]
                );

                if ($validator->fails()) {
                    throw new ValidationException([], ['taxonomyTerms' => $validator->getMessageBag()->first($key)]);
                }
            }

            $newTermIds = $terms->pluck('id')->all();

            foreach ($customTerms as $customTerm) {
                /**
                 * @var $existingTermWithSameName Term
                 */
                $existingTermWithSameName = $taxonomy->terms()->where('name', $customTerm)->first();

                // It's possible somebody else created a term with the same name in the meantime
                // If that's the case, we re-use the existing term
                // This also prevents malicious creation of the exact same term multiple times
                if ($existingTermWithSameName) {
                    $newTermIds[] = $existingTermWithSameName->id;

                    continue;
                }

                $slug = null;

                switch ($taxonomy->custom_value_slugger) {
                    case 'alpha_dash':
                        $slug = Str::slug($customTerm);
                        break;
                    case 'transliterator':
                        if (!class_exists(Transliterator::class)) {
                            throw new \Exception('You need to install the FriendsOfFlarum Transliterator extension for this option');
                        }
                        $slug = Transliterator::transliterate($customTerm);
                        break;
                    // case random
                    default:
                        $slug = Str::random();
                }

                $suffix = '';

                // Try to find a unique slug by using an incremental suffix if necessary
                while (true) {
                    $testSlug = $slug . $suffix;

                    if (!$taxonomy->terms()->where('slug', $testSlug)->exists()) {
                        break;
                    }

                    $suffix = !$suffix ? 2 : ($suffix + 1);
                }

                $term = new Term();
                $term->taxonomy()->associate($taxonomy);
                $term->name = $customTerm;
                $term->slug = $slug . $suffix;
                $term->save();

                $newTermIds[] = $term->id;
            }

            $model->afterSave(function (AbstractModel $model) use ($taxonomy, $newTermIds) {
                // Implementation similar to $relationship->sync(), but taxonomy-aware

                $currentTermIds = $model->taxonomyTerms()->where('taxonomy_id', $taxonomy->id)->pluck('id')->all();

                $detach = array_diff($currentTermIds, $newTermIds);
                if (count($detach) > 0) {
                    $model->taxonomyTerms()->detach($detach);
                }

                $attach = array_diff($newTermIds, $currentTermIds);
                if (count($attach) > 0) {
                    $model->taxonomyTerms()->attach($attach);
                }
            });
        }

        // Enforce min_terms for taxonomies that were omitted from payload
        if (
            $this->validateNonExistingCallback &&
            call_user_func($this->validateNonExistingCallback, $event) &&
            $event->actor->can('editTaxonomy', $model)
        ) {
            $omittedTaxonomiesWithRequiredMinimums = Taxonomy::query()
                ->where('type', $this->type)
                ->whereNotIn('id', $alreadyValidatedMinimums)
                ->where('min_terms', '>', 0)
                ->get();

            foreach ($omittedTaxonomiesWithRequiredMinimums as $taxonomy) {
                $key = 'term_count_' . $taxonomy->slug;

                $validator = $validatorFactory->make(
                    [$key => 0],
                    [$key => ['numeric', 'min:' . $taxonomy->min_terms]]
                );

                if ($validator->fails()) {
                    throw new ValidationException([], ['taxonomyTerms' => $validator->getMessageBag()->first($key)]);
                }
            }
        }
    }
}

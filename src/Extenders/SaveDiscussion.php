<?php

namespace FoF\Taxonomies\Extenders;

use Flarum\Discussion\Event\Saving;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Foundation\ValidationException;
use FoF\Taxonomies\Taxonomy;
use FoF\Taxonomies\Term;
use FoF\Transliterator\Transliterator;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SaveDiscussion implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Saving::class, [$this, 'saving']);
    }

    public function saving(Saving $event)
    {
        $discussion = $event->discussion;

        /**
         * @var $validatorFactory Factory
         */
        $validatorFactory = app(Factory::class);

        foreach (Arr::get($event->data, 'relationships.taxonomies.data', []) as $taxonomyData) {
            /**
             * @var $taxonomy Taxonomy
             */
            $taxonomy = Taxonomy::whereVisibleTo($event->actor)->findOrFail(Arr::get($taxonomyData, 'id'));

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

            // TODO: check if a term already exists with that exact name
            foreach ($customTerms as $customTerm) {
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

            $discussion->afterSave(function ($discussion) use ($newTermIds) {
                $discussion->taxonomyTerms()->sync($newTermIds);
            });
        }
    }
}

<?php


namespace FoF\Taxonomies\Extenders;

use Flarum\Api\Controller\ShowForumController;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Event\WillSerializeData;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\GetApiRelationship;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use FoF\Taxonomies\Repositories\TaxonomyRepository;
use FoF\Taxonomies\Serializers\TaxonomySerializer;
use FoF\Taxonomies\Taxonomy;
use Illuminate\Contracts\Container\Container;

class ForumAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(GetApiRelationship::class, [$this, 'relationship']);
        $container['events']->listen(WillGetData::class, [$this, 'includes']);
        $container['events']->listen(WillSerializeData::class, [$this, 'serialize']);
    }

    public function relationship(GetApiRelationship $event)
    {
        if ($event->isRelationship(ForumSerializer::class, 'taxonomies')) {
            return $event->serializer->hasMany($event->model, TaxonomySerializer::class, 'taxonomies');
        }
    }

    public function includes(WillGetData $event)
    {
        if ($event->isController(ShowForumController::class)) {
            $event->addInclude([
                'taxonomies',
            ]);
        }
    }

    public function serialize(WillSerializeData $event)
    {
        if ($event->isController(ShowForumController::class)) {
            if ($event->actor->can('canSeeAllTaxonomies', Taxonomy::class)) {
                /**
                 * @var $taxonomies TaxonomyRepository
                 */
                $taxonomies = app(TaxonomyRepository::class);

                $event->data['taxonomies'] = $taxonomies->all();
            } else {
                $event->data['taxonomies'] = [];
            }
        }
    }
}

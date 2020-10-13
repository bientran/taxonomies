<?php

namespace FoF\Taxonomies\Extenders;

use Flarum\Api\Controller;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Event\GetApiRelationship;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use FoF\Taxonomies\Serializers\TermSerializer;
use Illuminate\Contracts\Container\Container;

class DiscussionAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Serializing::class, [$this, 'serializing']);
        $container['events']->listen(GetApiRelationship::class, [$this, 'relationship']);
        $container['events']->listen(WillGetData::class, [$this, 'includes']);
    }

    public function serializing(Serializing $event)
    {
        if ($event->isSerializer(DiscussionSerializer::class)) {
            $event->attributes['fofCanEditTaxonomies'] = $event->actor->can('editTaxonomy', $event->model);

            if ($event->actor->cannot('seeTaxonomy', $event->model)) {
                $event->model->setRelation('taxonomyTerms', null);
            }
        }
    }

    public function relationship(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'taxonomyTerms')) {
            return $event->serializer->hasMany($event->model, TermSerializer::class, 'taxonomyTerms');
        }
    }

    public function includes(WillGetData $event)
    {
        if ($event->isController(Controller\ListDiscussionsController::class)
            || $event->isController(Controller\ShowDiscussionController::class)
            || $event->isController(Controller\CreateDiscussionController::class)
            || $event->isController(Controller\UpdateDiscussionController::class)) {
            $event->addInclude([
                'taxonomyTerms',
                'taxonomyTerms.taxonomy',
            ]);
        }
    }
}

<?php

namespace FoF\Taxonomies;

use Flarum\Api\Controller;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving as DiscussionSaving;
use Flarum\Event\ConfigureDiscussionGambits;
use Flarum\Event\ConfigureUserGambits;
use Flarum\Extend;
use Flarum\User\Event\Saving as UserSaving;
use Flarum\User\User;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/admin.less'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Routes('api'))
        ->post('/fof-taxonomies/order', 'fof-taxonomies.taxonomies.order', Controllers\TaxonomyOrderController::class)
        ->get('/fof-taxonomies', 'fof-taxonomies.taxonomies.index', Controllers\TaxonomyIndexController::class)
        ->post('/fof-taxonomies', 'fof-taxonomies.taxonomies.store', Controllers\TaxonomyStoreController::class)
        ->patch('/fof-taxonomies/{id:[0-9]+}', 'fof-taxonomies.taxonomies.update', Controllers\TaxonomyUpdateController::class)
        ->delete('/fof-taxonomies/{id:[0-9]+}', 'fof-taxonomies.taxonomies.delete', Controllers\TaxonomyDeleteController::class)
        ->get('/fof-taxonomies/{id:[0-9]+}/terms', 'fof-taxonomies.terms.index', Controllers\TermIndexController::class)
        ->post('/fof-taxonomies/{id:[0-9]+}/terms', 'fof-taxonomies.terms.store', Controllers\TermStoreController::class)
        ->post('/fof-taxonomies/{id:[0-9]+}/terms/order', 'fof-taxonomies.terms.order', Controllers\TermOrderController::class)
        ->patch('/fof-taxonomy-terms/{id:[0-9]+}', 'fof-taxonomies.terms.update', Controllers\TermUpdateController::class)
        ->delete('/fof-taxonomy-terms/{id:[0-9]+}', 'fof-taxonomies.terms.delete', Controllers\TermDeleteController::class),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Model(Discussion::class))
        ->belongsToMany('taxonomyTerms', Term::class, 'fof_discussion_taxonomy_term', 'discussion_id', 'term_id'),
    (new Extend\Model(User::class))
        ->belongsToMany('taxonomyTerms', Term::class, 'fof_taxonomy_term_user', 'user_id', 'term_id'),

    (new Extend\Middleware('forum'))
        ->add(StickyIndexParamsMiddleware::class),

    (new Extenders\TaxonomizeModel(
        'discussions',
        DiscussionSerializer::class,
        DiscussionSaving::class,
        function (DiscussionSaving $event) {
            return $event->discussion;
        }
    ))
        ->includeInController(Controller\ListDiscussionsController::class)
        ->includeInController(Controller\ShowDiscussionController::class)
        ->includeInController(Controller\CreateDiscussionController::class)
        ->includeInController(Controller\UpdateDiscussionController::class)
        ->validateNonExistingCallback(function (DiscussionSaving $event) {
            return !$event->discussion->exists && $event->actor->hasPermission('discussion.editOwnTaxonomy');
        }),

    (new Extenders\TaxonomizeModel(
        'users',
        UserSerializer::class,
        UserSaving::class,
        function (UserSaving $event) {
            return $event->user;
        }
    ))
        ->includeInController(Controller\ListUsersController::class)
        ->includeInController(Controller\ShowUserController::class)
        ->includeInController(Controller\CreateUserController::class)
        ->includeInController(Controller\UpdateUserController::class),

    new Extenders\ForumAttributes(),

    function (Dispatcher $events) {
        $events->listen(ConfigureDiscussionGambits::class, function (ConfigureDiscussionGambits $event) {
            $event->gambits->add(Gambits\DiscussionTaxonomyGambit::class);
        });
        $events->listen(ConfigureUserGambits::class, function (ConfigureUserGambits $event) {
            $event->gambits->add(Gambits\UserTaxonomyGambit::class);
        });

        $events->subscribe(Access\DiscussionPolicy::class);
        $events->subscribe(Access\TaxonomyPolicy::class);
        $events->subscribe(Access\UserPolicy::class);
    },
];

<?php

namespace FoF\Taxonomies\Access;

use Flarum\Tags\Tag;
use Flarum\User\AbstractPolicy;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class TagPolicy extends AbstractPolicy
{
    protected $model = Tag::class;

    public function find(User $actor, Builder $query)
    {
        // Hide taxonomy-tags from the list of tags
        // We need to keep them visible to admins otherwise it becomes impossible to edit them via the admin
        if (!$actor->isAdmin()) {
            $query->whereNull('fof_taxonomy_id');
        }
    }
}

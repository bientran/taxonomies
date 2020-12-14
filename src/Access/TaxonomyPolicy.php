<?php

namespace FoF\Taxonomies\Access;

use Flarum\User\AbstractPolicy;
use Flarum\User\User;
use FoF\Taxonomies\Taxonomy;

class TaxonomyPolicy extends AbstractPolicy
{
    protected $model = Taxonomy::class;

    public function canSeeAllTaxonomies(User $actor)
    {
        // For now, it's all or nothing. If you are allowed to see or edit anything, we expose the full list of existing taxonomies
        return $actor->hasPermission('discussion.seeOwnTaxonomy') ||
            $actor->hasPermission('discussion.editOwnTaxonomy') ||
            $actor->hasPermission('user.seeOwnTaxonomy') ||
            $actor->hasPermission('user.editOwnTaxonomy');
    }

    public function searchDiscussions(User $actor, Taxonomy $taxonomy)
    {
        return $taxonomy->type === 'discussions' && $this->canSeeAllTaxonomies($actor);
    }

    public function searchUsers(User $actor, Taxonomy $taxonomy)
    {
        return $taxonomy->type === 'users' && $this->canSeeAllTaxonomies($actor);
    }

    public function listTerms(User $actor, Taxonomy $taxonomy)
    {
        return $this->canSeeAllTaxonomies($actor);
    }

    public function listTags(User $actor, Taxonomy $taxonomy)
    {
        return $this->listTerms($actor, $taxonomy);
    }
}

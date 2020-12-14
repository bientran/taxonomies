<?php

namespace FoF\Taxonomies\Access;

use Flarum\User\AbstractPolicy;
use Flarum\User\User;

class UserPolicy extends AbstractPolicy
{
    protected $model = User::class;

    public function seeTaxonomy(User $actor, User $user)
    {
        if ($user->id === $actor->id && $actor->hasPermission('user.seeOwnTaxonomy')) {
            return true;
        }

        return $actor->hasPermission('user.seeAnyTaxonomy');
    }

    public function editTaxonomy(User $actor, User $user)
    {
        if ($user->id === $actor->id && $actor->hasPermission('user.editOwnTaxonomy')) {
            return true;
        }

        return $actor->hasPermission('user.editAnyTaxonomy');
    }
}

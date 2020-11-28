<?php

namespace FoF\Taxonomies\Access;

use Flarum\User\AbstractPolicy;
use Flarum\User\User;

class UserPolicy extends AbstractPolicy
{
    protected $model = User::class;

    public function seeTaxonomy(User $actor, User $user)
    {
        if ($user->id === $actor->id && $actor->can('user.seeOwnTaxonomy', $user)) {
            return true;
        }

        return $actor->can('user.seeAnyTaxonomy', $user);
    }

    public function editTaxonomy(User $actor, User $user)
    {
        if ($user->id === $actor->id && $actor->can('user.editOwnTaxonomy', $user)) {
            return true;
        }

        return $actor->can('user.editAnyTaxonomy', $user);
    }
}

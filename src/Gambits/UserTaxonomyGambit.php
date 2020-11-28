<?php

namespace FoF\Taxonomies\Gambits;

use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\AbstractSearch;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TaxonomyRepository;
use Illuminate\Database\Query\Builder;

class UserTaxonomyGambit extends AbstractRegexGambit
{
    use AssertPermissionTrait;

    protected $pattern = 'taxonomy:(.+):(.+)';

    protected function conditions(AbstractSearch $search, array $matches, $negate)
    {
        $taxonomySlug = trim($matches[1], '"');
        $termSlugs = explode(',', trim($matches[2], '"'));

        /**
         * @var $repository TaxonomyRepository
         */
        $repository = app(TaxonomyRepository::class);

        $taxonomy = $repository->findSlugOrFail($taxonomySlug, 'users');

        $this->assertCan($search->getActor(), 'searchUsers', $taxonomy);

        $termIdsMap = $taxonomy->terms()
            ->whereIn('slug', $termSlugs)
            ->pluck('id', 'slug');

        $search->getQuery()->where(function (Builder $query) use ($termSlugs, $termIdsMap, $negate) {
            foreach ($termSlugs as $slug) {
                if ($slug === 'untagged') {
                    $query->whereIn('users.id', function (Builder $query) {
                        $query->select('user_id')
                            ->from('fof_taxonomy_term_user');
                    }, 'or', !$negate);
                } else {
                    $id = $termIdsMap->get($slug);

                    $query->whereIn('users.id', function (Builder $query) use ($id) {
                        $query->select('user_id')
                            ->from('fof_taxonomy_term_user')
                            ->where('term_id', $id);
                    }, 'or', $negate);
                }
            }
        });
    }
}

<?php

namespace FoF\Taxonomies\Gambits;

use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\AbstractSearch;
use FoF\Taxonomies\Term;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;

class TaxonomyGambit extends AbstractRegexGambit
{
    protected $pattern = 'taxonomy:(.+):(.+)';

    protected function conditions(AbstractSearch $search, array $matches, $negate)
    {
        $taxonomySlug = trim($matches[1], '"');
        $termSlugs = explode(',', trim($matches[2], '"'));

        $termIdsMap = Term::query()
            ->whereIn('slug', $termSlugs)
            ->whereHas('taxonomy', function (EloquentBuilder $query) use ($taxonomySlug) {
                $query->where('slug', $taxonomySlug);
            })->pluck('id', 'slug');

        $search->getQuery()->where(function (Builder $query) use ($termSlugs, $termIdsMap, $negate) {
            foreach ($termSlugs as $slug) {
                if ($slug === 'untagged') {
                    $query->whereIn('discussions.id', function (Builder $query) {
                        $query->select('discussion_id')
                            ->from('fof_discussion_taxonomy_term');
                    }, 'or', !$negate);
                } else {
                    $id = $termIdsMap->get($slug);

                    $query->whereIn('discussions.id', function (Builder $query) use ($id) {
                        $query->select('discussion_id')
                            ->from('fof_discussion_taxonomy_term')
                            ->where('term_id', $id);
                    }, 'or', $negate);
                }
            }
        });
    }
}

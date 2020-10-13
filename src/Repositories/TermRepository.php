<?php

namespace FoF\Taxonomies\Repositories;

use Flarum\Foundation\ValidationException;
use FoF\Taxonomies\Taxonomy;
use FoF\Taxonomies\Term;
use FoF\Taxonomies\Validators\TermValidator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class TermRepository
{
    protected $term;
    protected $validator;

    public function __construct(Term $term, TermValidator $validator)
    {
        $this->term = $term;
        $this->validator = $validator;
    }

    protected function query(): Builder
    {
        return $this->term->newQuery()->orderBy('order', 'desc');
    }

    /**
     * @param $id
     * @return Model|Term
     */
    public function findOrFail($id): Term
    {
        return $this->term->newQuery()->findOrFail($id);
    }

    /**
     * @param Taxonomy $taxonomy
     * @return Collection|Term[]
     */
    public function all(Taxonomy $taxonomy): Collection
    {
        return $this->query()
            ->where('taxonomy_id', $taxonomy->id)
            ->get();
    }

    public function store(Taxonomy $taxonomy, array $attributes): Term
    {
        if ($taxonomy->tag_based) {
            throw new ValidationException([
                // TODO: translation
                'tag_based' => 'This taxonomy is tag-based. Terms cannot be created',
            ]);
        }

        $this->validator->taxonomyId = $taxonomy->id;
        $this->validator->assertValid($attributes);

        $term = new Term($attributes);
        $term->taxonomy()->associate($taxonomy);
        $term->save();

        return $term;
    }

    public function update(Term $term, array $attributes): Term
    {
        $this->validator->taxonomyId = $term->taxonomy_id;
        $this->validator->ignore = $term;
        $this->validator->assertValid($attributes);

        $term->fill($attributes);
        $term->save();

        return $term;
    }

    public function delete(Term $term)
    {
        $term->delete();
    }

    public function sorting(array $sorting)
    {
        foreach ($sorting as $i => $fieldId) {
            $this->term
                ->newQuery()
                ->where('id', $fieldId)
                ->update(['sort' => $i]);
        }
    }
}

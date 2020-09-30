<?php


namespace FoF\Taxonomies\Repositories;

use FoF\Taxonomies\Taxonomy;
use FoF\Taxonomies\Validators\TaxonomyValidator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class TaxonomyRepository
{
    protected $taxonomy;
    protected $validator;

    public function __construct(Taxonomy $taxonomy, TaxonomyValidator $validator)
    {
        $this->taxonomy = $taxonomy;
        $this->validator = $validator;
    }

    protected function query(): Builder
    {
        return $this->taxonomy->newQuery()->orderBy('order', 'desc');
    }

    /**
     * @param $id
     * @return Model|Taxonomy
     */
    public function findOrFail($id): Taxonomy
    {
        return $this->taxonomy->newQuery()->findOrFail($id);
    }

    /**
     * @return Collection|Taxonomy[]
     */
    public function all(): Collection
    {
        return $this->query()->get();
    }

    public function store(array $attributes): Taxonomy
    {
        $this->validator->assertValid($attributes);

        $taxonomy = new Taxonomy($attributes);
        $taxonomy->save();

        return $taxonomy;
    }

    public function update(Taxonomy $taxonomy, array $attributes): Taxonomy
    {
        $this->validator->ignore = $taxonomy;
        $this->validator->assertValid($attributes);

        $taxonomy->fill($attributes);
        $taxonomy->save();

        return $taxonomy;
    }

    public function delete(Taxonomy $taxonomy)
    {
        $taxonomy->delete();
    }

    public function sorting(array $sorting)
    {
        foreach ($sorting as $i => $fieldId) {
            $this->taxonomy
                ->newQuery()
                ->where('id', $fieldId)
                ->update(['sort' => $i]);
        }
    }
}

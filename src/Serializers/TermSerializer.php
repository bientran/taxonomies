<?php

namespace FoF\Taxonomies\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use FoF\Taxonomies\Term;

class TermSerializer extends AbstractSerializer
{
    protected $type = 'fof-taxonomy-terms';

    /**
     * @param Term $term
     * @return array
     */
    protected function getDefaultAttributes($term)
    {
        $attributes = [
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
            'color' => $term->color,
            'icon' => $term->icon,
            'order' => $term->order,
        ];

        if ($this->actor->isAdmin()) {
            $attributes += [
                'createdAt' => $this->formatDate($term->created_at),
            ];
        }

        return $attributes;
    }

    public function taxonomy($term)
    {
        return $this->hasOne($term, TaxonomySerializer::class);
    }
}

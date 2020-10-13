<?php

namespace FoF\Taxonomies\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use FoF\Taxonomies\Taxonomy;

class TaxonomySerializer extends AbstractSerializer
{
    protected $type = 'fof-taxonomies';

    /**
     * @param Taxonomy $taxonomy
     * @return array
     */
    protected function getDefaultAttributes($taxonomy)
    {
        $attributes = [
            'name' => $taxonomy->name,
            'slug' => $taxonomy->slug,
            'description' => $taxonomy->description,
            'color' => $taxonomy->color,
            'icon' => $taxonomy->icon,
            'order' => $taxonomy->order,
            'showLabel' => $taxonomy->show_label,
            'showFilter' => $taxonomy->show_filter,
            'allowCustomValues' => $taxonomy->allow_custom_values,
            'customValueValidation' => $taxonomy->custom_value_validation,
            'minTerms' => $taxonomy->min_terms,
            'maxTerms' => $taxonomy->max_terms,
            'canSearchDiscussions' => $this->actor->can('searchDiscussions', $taxonomy),
        ];

        if ($this->actor->isAdmin()) {
            $attributes += [
                'customValueSlugger' => $taxonomy->custom_value_slugger,
                'createdAt' => $this->formatDate($taxonomy->created_at),
            ];
        }

        return $attributes;
    }
}

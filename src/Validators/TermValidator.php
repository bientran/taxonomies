<?php


namespace FoF\Taxonomies\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;

class TermValidator extends AbstractValidator
{
    public $taxonomyId;
    public $ignore;

    protected function getRules()
    {
        return [
            'name' => 'required|string|min:1|max:255',
            'slug' => [
                'required',
                'alpha_dash',
                'min:1',
                'max:255',
                Rule::unique('fof_taxonomy_terms', 'slug')
                    ->where('taxonomy_id', $this->taxonomyId)
                    ->ignore($this->ignore),
            ],
            'description' => 'nullable|string|min:1|max:65535',
            'color' => 'nullable|string|min:3|max:255',
            'icon' => 'nullable|string|min:3|max:255',
        ];
    }
}

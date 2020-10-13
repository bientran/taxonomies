<?php

namespace FoF\Taxonomies\Validators;

use Flarum\Foundation\AbstractValidator;

class OrderValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'order' => 'nullable|array',
        ];
    }
}

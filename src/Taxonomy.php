<?php

namespace FoF\Taxonomies;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string $color
 * @property string $icon
 * @property int $order
 * @property bool $show_label
 * @property bool $show_filter
 * @property bool $allow_custom_values
 * @property string $custom_value_validation
 * @property string $custom_value_slugger
 * @property int $min_terms
 * @property int $max_terms
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Taxonomy extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = 'fof_taxonomies';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'show_label',
        'show_filter',
        'allow_custom_values',
        'custom_value_validation',
        'custom_value_slugger',
        'min_terms',
        'max_terms',
    ];

    protected $casts = [
        'order' => 'int',
        'show_label' => 'bool',
        'show_filter' => 'bool',
        'allow_custom_values' => 'bool',
        'min_terms' => 'int',
        'max_terms' => 'int',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function terms()
    {
        return $this->hasMany(Term::class);
    }
}

<?php

namespace FoF\Taxonomies;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;

/**
 * @property int $id
 * @property int $taxonomy_id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string $color
 * @property string $icon
 * @property int $order
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Term extends AbstractModel
{
    protected $table = 'fof_taxonomy_terms';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
    ];

    protected $casts = [
        'order' => 'int',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function taxonomy()
    {
        return $this->belongsTo(Taxonomy::class);
    }
}

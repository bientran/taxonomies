<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('fof_taxonomies', function (Blueprint $table) {
            $table->string('type')->default('discussions');
            $table->dropUnique(['slug']);
            $table->unique(['type', 'slug']);
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('fof_taxonomies', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->unique('slug');
        });
    }
];

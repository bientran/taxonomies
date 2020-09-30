<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('tags')) {
            return;
        }

        $schema->table('tags', function (Blueprint $table) {
            $table->unsignedInteger('fof_taxonomy_id')->nullable();

            $table->foreign('fof_taxonomy_id')->references('id')->on('fof_taxonomies')->onDelete('set null');
        });
    },
    'down' => function (Builder $schema) {
        if (!$schema->hasTable('tags') || !$schema->hasColumns('tags', ['fof_taxonomy_id'])) {
            return;
        }

        $schema->table('tags', function (Blueprint $table) {
            $table->dropForeign(['fof_taxonomy_id']);

            $table->dropColumn('fof_taxonomy_id');
        });
    }
];

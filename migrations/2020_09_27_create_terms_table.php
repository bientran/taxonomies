<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('fof_taxonomy_terms', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('taxonomy_id');
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('color')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('order');
            $table->timestamps();

            $table->unique(['taxonomy_id', 'slug']);

            $table->foreign('taxonomy_id')->references('id')->on('fof_taxonomies')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('fof_taxonomy_terms');
    },
];

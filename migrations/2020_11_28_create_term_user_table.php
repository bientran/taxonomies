<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('fof_taxonomy_term_user', function (Blueprint $table) {
            $table->unsignedInteger('term_id');
            $table->unsignedInteger('user_id');
            $table->timestamps();

            $table->primary(['term_id', 'user_id']);

            $table->foreign('term_id')->references('id')->on('fof_taxonomy_terms')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('fof_taxonomy_term_user');
    },
];

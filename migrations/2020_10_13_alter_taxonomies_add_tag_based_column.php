<?php

use Flarum\Database\Migration;

return Migration::addColumns('fof_taxonomies', [
    'tag_based' => ['boolean', 'default' => false],
    'manual_terms_order' => ['boolean', 'default' => false],
]);

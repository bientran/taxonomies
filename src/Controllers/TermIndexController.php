<?php

namespace FoF\Taxonomies\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TaxonomyRepository;
use FoF\Taxonomies\Repositories\TermRepository;
use FoF\Taxonomies\Serializers\TermSerializer;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TermIndexController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = TermSerializer::class;

    protected $taxonomies;
    protected $terms;

    public function __construct(TaxonomyRepository $taxonomies, TermRepository $terms)
    {
        $this->taxonomies = $taxonomies;
        $this->terms = $terms;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->taxonomies->findOrFail($id);

        return $this->terms->all($taxonomy);
    }
}

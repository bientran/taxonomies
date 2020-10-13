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

    // TODO: implement pagination in frontend
    public $maxLimit = 200;
    public $limit = 200;

    public function __construct(TaxonomyRepository $taxonomies, TermRepository $terms)
    {
        $this->taxonomies = $taxonomies;
        $this->terms = $terms;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->taxonomies->findOrFail($id);

        $this->assertCan($request->getAttribute('actor'), 'listTerms', $taxonomy);

        return $this->terms->all($taxonomy);
    }
}

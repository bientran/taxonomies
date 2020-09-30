<?php

namespace FoF\Taxonomies\Controllers;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TermRepository;
use FoF\Taxonomies\Serializers\TermSerializer;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TermUpdateController extends AbstractShowController
{
    use AssertPermissionTrait;

    public $serializer = TermSerializer::class;

    protected $repository;

    public function __construct(TermRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $id = Arr::get($request->getQueryParams(), 'id');

        $term = $this->repository->findOrFail($id);

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        return $this->repository->update($term, $attributes);
    }
}

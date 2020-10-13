<?php

namespace FoF\Taxonomies\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TaxonomyRepository;
use FoF\Taxonomies\Serializers\TaxonomySerializer;
use FoF\Taxonomies\Validators\OrderValidator;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TaxonomyOrderController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = TaxonomySerializer::class;

    protected $validator;
    protected $repository;

    public function __construct(OrderValidator $validator, TaxonomyRepository $repository)
    {
        $this->validator = $validator;
        $this->repository = $repository;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $attributes = $request->getParsedBody();

        $this->validator->assertValid($attributes);

        $order = Arr::get($attributes, 'order') ?: [];

        $this->repository->sorting($order);

        // Return updated order values
        return $this->repository->all();
    }
}

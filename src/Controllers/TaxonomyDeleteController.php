<?php

namespace FoF\Taxonomies\Controllers;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TaxonomyRepository;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class TaxonomyDeleteController extends AbstractDeleteController
{
    use AssertPermissionTrait;

    protected $repository;

    public function __construct(TaxonomyRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function delete(ServerRequestInterface $request)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->repository->findOrFail($id);

        $this->repository->delete($taxonomy);
    }
}

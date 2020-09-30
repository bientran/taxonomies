<?php

namespace FoF\Taxonomies\Controllers;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TermRepository;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class TermDeleteController extends AbstractDeleteController
{
    use AssertPermissionTrait;

    protected $repository;

    public function __construct(TermRepository $repository)
    {
        $this->repository = $repository;
    }

    protected function delete(ServerRequestInterface $request)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $id = Arr::get($request->getQueryParams(), 'id');

        $term = $this->repository->findOrFail($id);

        $this->repository->delete($term);
    }
}

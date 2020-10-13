<?php

namespace FoF\Taxonomies\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TaxonomyRepository;
use FoF\Taxonomies\Repositories\TermRepository;
use FoF\Taxonomies\Serializers\TermSerializer;
use FoF\Taxonomies\Validators\OrderValidator;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TermOrderController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = TermSerializer::class;

    protected $validator;
    protected $taxonomies;
    protected $terms;

    public function __construct(OrderValidator $validator, TaxonomyRepository $taxonomies, TermRepository $terms)
    {
        $this->validator = $validator;
        $this->taxonomies = $taxonomies;
        $this->terms = $terms;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->taxonomies->findOrFail($id);

        $attributes = $request->getParsedBody();

        $this->validator->assertValid($attributes);

        $order = Arr::get($attributes, 'order') ?: [];

        $this->terms->sorting($taxonomy, $order);

        // Return updated order values
        return $this->terms->all($taxonomy);
    }
}

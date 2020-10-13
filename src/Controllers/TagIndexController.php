<?php

namespace FoF\Taxonomies\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Extension\ExtensionManager;
use Flarum\Tag\Tag;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\User\AssertPermissionTrait;
use FoF\Taxonomies\Repositories\TaxonomyRepository;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class TagIndexController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = TagSerializer::class;

    protected $taxonomies;
    protected $extensions;

    public function __construct(TaxonomyRepository $taxonomies, ExtensionManager $extensions)
    {
        $this->taxonomies = $taxonomies;
        $this->extensions = $extensions;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        if (!$this->extensions->isEnabled('flarum-tags')) {
            return new JsonResponse([
                'error' => 'Tags extension not enabled',
            ], 400);
        }

        $id = Arr::get($request->getQueryParams(), 'id');

        $taxonomy = $this->taxonomies->findOrFail($id);

        $this->assertCan($request->getAttribute('actor'), 'listTags', $taxonomy);

        return Tag::whereVisibleTo($request->getAttribute('actor'))
            ->where('fof_taxonomy_id', $taxonomy->id)
            ->get();
    }
}

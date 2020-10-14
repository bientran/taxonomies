<?php

namespace FoF\Taxonomies;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class StickyIndexParamsMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $path = $request->getUri()->getPath();

        // Only do this on pages we know will render a discussion list
        if ($path !== '/' && $path !== '/index' && $path !== '/following' && !Str::startsWith($path, '/t/')) {
            return $handler->handle($request);
        }

        $queryParams = $request->getQueryParams();

        // We don't check those known parameters against taxonomy slugs
        // Doing this allows us to skip a database request if no other parameter is present
        // Also replacing those parameters would most certainly break something
        $possibleTaxonomyParams = array_except(array_keys($queryParams), [
            'sort',
            'q',
            'page',
            'slug', // Will be part of the query params when showing a tag page
        ]);

        if (count($possibleTaxonomyParams)) {
            $q = Arr::get($queryParams, 'q', '');

            /**
             * @var $taxonomies Taxonomy[]
             */
            $taxonomies = Taxonomy::query()
                ->whereIn('slug', $possibleTaxonomyParams)
                ->where('show_filter', true)
                ->get();

            foreach ($taxonomies as $taxonomy) {
                $q = "$q taxonomy:{$taxonomy->slug}:" . Arr::pull($queryParams, $taxonomy->slug);
            }

            $queryParams['q'] = $q;
        }

        return $handler->handle($request->withQueryParams($queryParams));
    }
}

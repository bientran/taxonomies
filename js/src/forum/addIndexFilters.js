import app from 'flarum/app';
import {extend} from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import DiscussionList from 'flarum/components/DiscussionList';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import TaxonomyDropdown from './components/TaxonomyDropdown';

/* global m */

export default function () {
    extend(IndexPage.prototype, 'viewItems', function (items) {
        sortTaxonomies(app.store.all('fof-taxonomies')).forEach(taxonomy => {
            if (!taxonomy.canSearchDiscussions() || !taxonomy.showFilter()) {
                return;
            }

            items.add('taxonomy-' + taxonomy.slug(), TaxonomyDropdown.component({
                taxonomy,
                activeTermSlug: this.params()[taxonomy.slug()],
                onchange: term => {
                    const params = this.params();

                    const currentFilterForTaxonomy = params[taxonomy.slug()];

                    if (term.slug() === currentFilterForTaxonomy) {
                        delete params[taxonomy.slug()];
                    } else {
                        params[taxonomy.slug()] = term.slug();
                    }

                    m.route(app.route(this.props.routeName, params));
                },
            }));
        });
    });

    extend(IndexPage.prototype, 'stickyParams', function (params) {
        sortTaxonomies(app.store.all('fof-taxonomies')).filter(t => t.canSearchDiscussions() && t.showFilter()).forEach(taxonomy => {
            params[taxonomy.slug()] = m.route.param(taxonomy.slug());
        });
    });

    extend(DiscussionList.prototype, 'requestParams', function (params) {
        // Include the taxonomies when navigating to the discussion list
        // Same includes are pre-loaded in DiscussionAttributes.php
        params.include.push('taxonomyTerms', 'taxonomyTerms.taxonomy');

        sortTaxonomies(app.store.all('fof-taxonomies')).filter(t => t => t.canSearchDiscussions() && t.showFilter()).forEach(taxonomy => {
            const filterTermSlug = this.props.params[taxonomy.slug()];

            if (filterTermSlug) {
                params.filter.q = (params.filter.q || '') + ' taxonomy:' + taxonomy.slug() + ':' + filterTermSlug;
            }
        });
    });
}

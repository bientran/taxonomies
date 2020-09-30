import app from 'flarum/app';
import {extend} from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import DiscussionList from 'flarum/components/DiscussionList';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import TaxonomyDropdown from './components/TaxonomyDropdown';

let taxonomyFilterTerms = [];

export default function () {
    extend(IndexPage.prototype, 'viewItems', items => {
        sortTaxonomies(app.store.all('fof-taxonomies')).forEach(taxonomy => {
            if (!taxonomy.showFilter()) {
                return;
            }

            items.add(taxonomy.uniqueKey(), TaxonomyDropdown.component({
                taxonomy,
                term: taxonomyFilterTerms.find(term => {
                    return term.taxonomy() === taxonomy;
                }),
                onchange: term => {
                    const index = taxonomyFilterTerms.indexOf(term);

                    if (index === -1) {
                        // Remove any other term from that taxonomy
                        taxonomyFilterTerms = taxonomyFilterTerms.filter(existingTerm => {
                            return existingTerm.taxonomy() !== term.taxonomy();
                        });

                        taxonomyFilterTerms.push(term);
                    } else {
                        taxonomyFilterTerms.splice(index, 1);
                    }

                    app.cache.discussionList.refresh();
                },
            }));
        });
    });

    extend(DiscussionList.prototype, 'requestParams', function (params) {
        taxonomyFilterTerms.forEach(term => {
            params.filter.q = (params.filter.q || '') + ' taxonomy:' + term.taxonomy().slug() + ':' + term.slug();
        });
    });
}

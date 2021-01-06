import UserPage from 'flarum/components/UserPage';
import sortTaxonomies from '../../common/utils/sortTaxonomies';
import termsLabel from '../../common/helpers/termsLabel';

/* global m */

export default class UserTaxonomyPage extends UserPage {
    init() {
        super.init();

        this.loadUser(m.route.param('username'));
    }

    content() {
        const terms = this.user.taxonomyTerms();

        if (!terms || !terms.length) {
            return null;
        }

        const taxonomies = [];

        terms.forEach(term => {
            const taxonomy = term.taxonomy();

            if (taxonomies.indexOf(taxonomy) === -1) {
                taxonomies.push(taxonomy);
            }
        });

        return sortTaxonomies(taxonomies).map(taxonomy => [
            m('h2', taxonomy.name()),
            termsLabel(terms.filter(term => term.taxonomy() === taxonomy), {userLink: true})
        ]);
    }
}

import extract from 'flarum/utils/extract';
import termLabel from './termLabel';
import sortTerms from '../utils/sortTerms';

/* global m */

export default function tagsLabel(terms, attrs = {}) {
    const children = [];
    const discussionLink = extract(attrs, 'discussionLink');
    const userLink = extract(attrs, 'userLink');

    attrs.className = 'TaxonomiesLabel ' + (attrs.className || '');

    if (terms) {
        let taxonomy = extract(attrs, 'taxonomy');

        if (!taxonomy) {
            taxonomy = terms[0].taxonomy();
        }

        if (taxonomy) {
            attrs['data-slug'] = taxonomy.slug();

            if (taxonomy.showLabel()) {
                children.push(termLabel(taxonomy, {
                    className: 'TaxonomyParentLabel',
                }));
            }
        }

        sortTerms(terms).forEach(tag => {
            if (tag || terms.length === 1) {
                children.push(termLabel(tag, {discussionLink, userLink}));
            }
        });
    } else {
        children.push(termLabel());
    }

    return m('span', attrs, children);
}

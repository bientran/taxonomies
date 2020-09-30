import {extend} from 'flarum/extend';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import DiscussionHero from 'flarum/components/DiscussionHero';
import termsLabel from '../common/helpers/termsLabel';

export default function () {
    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
        const terms = this.props.discussion.taxonomyTerms();

        if (terms && terms.length) {
            items.add('taxonomies', termsLabel(terms), 10);
        }
    });

    extend(DiscussionHero.prototype, 'items', function (items) {
        const terms = this.props.discussion.taxonomyTerms();

        if (terms && terms.length) {
            items.add('taxonomies', termsLabel(terms, {link: true}), 5);
        }
    });
}

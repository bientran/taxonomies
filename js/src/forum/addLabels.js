import {extend} from 'flarum/extend';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import DiscussionHero from 'flarum/components/DiscussionHero';
import labelsFromMultipleTaxonomiesList from '../common/helpers/labelsFromMultipleTaxonomiesList';

export default function () {
    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
        const terms = this.props.discussion.taxonomyTerms();

        if (terms && terms.length) {
            items.add('taxonomies', labelsFromMultipleTaxonomiesList(terms), 10);
        }
    });

    extend(DiscussionHero.prototype, 'items', function (items) {
        const terms = this.props.discussion.taxonomyTerms();

        if (terms && terms.length) {
            items.add('taxonomies', labelsFromMultipleTaxonomiesList(terms, {link: true}), 5);
        }
    });
}

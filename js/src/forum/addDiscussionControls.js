import app from 'flarum/app';
import {extend} from 'flarum/extend';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import Button from 'flarum/components/Button';
import ChooseTaxonomyTermsModal from './components/ChooseTaxonomyTermsModal';
import sortTaxonomies from '../common/utils/sortTaxonomies';

export default function () {
    extend(DiscussionControls, 'moderationControls', function (items, discussion) {
        sortTaxonomies(app.store.all('fof-taxonomies')).forEach(taxonomy => {
            // TODO: permission
            items.add('taxonomy' + taxonomy.id(), Button.component({
                icon: 'fas fa-tag',
                onclick: () => app.modal.show(new ChooseTaxonomyTermsModal({
                    discussion,
                    taxonomy,
                })),
            }, app.translator.trans('fof-taxonomies.forum.discussion.edit', {
                taxonomy: taxonomy.name(),
            })));
        });
    });
}

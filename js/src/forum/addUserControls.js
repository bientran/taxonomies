import app from 'flarum/app';
import {extend} from 'flarum/extend';
import UserControls from 'flarum/utils/UserControls';
import Button from 'flarum/components/Button';
import ChooseTaxonomyTermsModal from './components/ChooseTaxonomyTermsModal';
import sortTaxonomies from '../common/utils/sortTaxonomies';

export default function () {
    extend(UserControls, 'userControls', function (items, user) {
        if (!user.attribute('fofCanEditTaxonomies')) {
            return;
        }

        sortTaxonomies(app.forum.taxonomies()).forEach(taxonomy => {
            if (taxonomy.type() !== 'users') {
                return;
            }

            items.add('taxonomy-' + taxonomy.slug(), Button.component({
                icon: 'fas fa-tag',
                onclick: () => app.modal.show(new ChooseTaxonomyTermsModal({
                    resource: user,
                    taxonomy,
                })),
            }, app.translator.trans('fof-taxonomies.forum.user.edit', {
                taxonomy: taxonomy.name(),
            })));
        });
    });
}

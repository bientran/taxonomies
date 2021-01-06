import app from 'flarum/app';
import {extend} from 'flarum/extend';
import UserControls from 'flarum/utils/UserControls';
import Button from 'flarum/components/Button';
import UserPage from 'flarum/components/UserPage';
import LinkButton from 'flarum/components/LinkButton';
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

    extend(UserPage.prototype, 'navItems', function (items) {
        const userTaxonomiesExist = sortTaxonomies(app.forum.taxonomies()).some(taxonomy => {
            return taxonomy.type() === 'users';
        });

        if (!userTaxonomiesExist) {
            return;
        }

        items.add(
            'taxonomies',
            LinkButton.component({
                href: app.route.fofTaxonomiesUser(this.user),
                icon: 'fas fa-tags',
            }, app.translator.trans('fof-taxonomies.forum.user.nav')),
            120
        );

    });
}

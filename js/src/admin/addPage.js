import {extend} from 'flarum/extend';
import app from 'flarum/app';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import AdminNav from 'flarum/components/AdminNav';
import TaxonomiesPage from './components/TaxonomiesPage';

/* global m */

export default function () {
    app.routes['fof-taxonomies'] = {
        path: '/taxonomies',
        component: TaxonomiesPage.component(),
    };

    app.extensionSettings['fof-taxonomies'] = () => m.route(app.route('fof-taxonomies'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('fof-taxonomies', AdminLinkButton.component({
            href: app.route('fof-taxonomies'),
            icon: 'fas fa-tags',
            description: app.translator.trans('fof-taxonomies.admin.menu.description'),
        }, app.translator.trans('fof-taxonomies.admin.menu.title')));
    });
}

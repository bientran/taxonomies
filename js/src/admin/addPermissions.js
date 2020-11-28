import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import ItemList from 'flarum/utils/ItemList';

const translationPrefix = 'fof-taxonomies.admin.permissions.';

export default function () {
    extend(PermissionGrid.prototype, 'permissionItems', permissionGroups => {
        const items = new ItemList();

        items.add('seeOwnDiscussion', {
            icon: 'fas fa-eye',
            label: app.translator.trans(translationPrefix + 'seeOwnDiscussion'),
            permission: 'discussion.seeOwnTaxonomy',
        });

        items.add('seeAnyDiscussion', {
            icon: 'fas fa-eye',
            label: app.translator.trans(translationPrefix + 'seeAnyDiscussion'),
            permission: 'discussion.seeAnyTaxonomy',
            allowGuest: true,
        });

        items.add('editOwnDiscussion', {
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'editOwnDiscussion'),
            permission: 'discussion.editOwnTaxonomy',
        });

        items.add('editAnyDiscussion', {
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'editAnyDiscussion'),
            permission: 'discussion.editAnyTaxonomy',
        });

        items.add('seeOwnUser', {
            icon: 'fas fa-eye',
            label: app.translator.trans(translationPrefix + 'seeOwnUser'),
            permission: 'user.seeOwnTaxonomy',
        });

        items.add('seeAnyUser', {
            icon: 'fas fa-eye',
            label: app.translator.trans(translationPrefix + 'seeAnyUser'),
            permission: 'user.seeAnyTaxonomy',
            allowGuest: true,
        });

        items.add('editOwnUser', {
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'editOwnUser'),
            permission: 'user.editOwnTaxonomy',
        });

        items.add('editAnyUser', {
            icon: 'fas fa-tag',
            label: app.translator.trans(translationPrefix + 'editAnyUser'),
            permission: 'user.editAnyTaxonomy',
        });

        permissionGroups.add('taxonomies', {
            label: app.translator.trans(translationPrefix + 'heading'),
            children: items.toArray()
        });
    });
}

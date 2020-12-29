import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import PermissionDropdown from 'flarum/components/PermissionDropdown';
import Button from 'flarum/components/Button';
import ItemList from 'flarum/utils/ItemList';

const translationPrefix = 'fof-taxonomies.admin.permissions.';

// Since not activated / supended users are considered guests, we allow a guest option on some settings
// However showing "Everyone"/"Members" is just confusing, so we will alter the labels on those permissions
const PERMISSIONS_WHERE_EVERYONE_MEANS_DISABLED_USERS = [
    'user.seeOwnTaxonomy',
    'user.editOwnTaxonomy',
];

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
            allowGuest: true,
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
            allowGuest: true,
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

    extend(PermissionDropdown.prototype, 'view', function (vdom) {
        if (PERMISSIONS_WHERE_EVERYONE_MEANS_DISABLED_USERS.indexOf(this.props.permission) === -1) {
            return;
        }

        // Loops through <ul> children
        vdom.children[1].children.forEach(vdom => {
            console.log(vdom);
            // Checks we are in <li> <Button> <icon>
            if (
                vdom.tag !== 'li' ||
                vdom.children[0].component !== Button ||
                !vdom.children[0].props.children ||
                vdom.children[0].props.children.length !== 3
            ) {
                return;
            }

            const {icon} = vdom.children[0].props.children[0].props;

            if (icon === 'fas fa-globe') {
                vdom.children[0].props.children[2] = [
                    app.translator.trans(translationPrefix + 'ownDisabledEveryone'),
                ];
            }

            if (icon === 'fas fa-user') {
                vdom.children[0].props.children[2] = [
                    app.translator.trans(translationPrefix + 'ownDisabledMembers'),
                ];
            }
        });
    });
}

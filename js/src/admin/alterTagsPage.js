import app from 'flarum/app';
import {extend} from 'flarum/extend';
import Button from 'flarum/components/Button';
import TagsPage from 'flarum/tags/components/TagsPage';
import EditTagModal from 'flarum/tags/components/EditTagModal';
import tagIcon from 'flarum/tags/helpers/tagIcon';

/* global m */

// Based on Flarum Tags' tagItem function that is not exported
function tagItem(tag) {
    return m('li', {
        'data-id': tag.id(),
        style: {color: tag.color()},
    }, [
        m('.TagListItem-info', [
            tagIcon(tag),
            m('span.TagListItem-name', tag.name()),
            Button.component({
                className: 'Button Button--link',
                icon: 'fas fa-pencil-alt',
                onclick: () => app.modal.show(new EditTagModal({tag})),
            }),
        ])
    ]);
}

export default function () {
    extend(TagsPage.prototype, 'view', function (vdom) {
        vdom.children.forEach(vdom => {
            if (!vdom || !vdom.attrs || vdom.attrs.className !== 'TagsPage-list') {
                return;
            }

            vdom.children.forEach(vdom => {
                if (!vdom || !vdom.attrs || vdom.attrs.className !== 'container') {
                    return;
                }

                vdom.children.push(m('.TagGroup', [
                    m('label', 'New group'),//TODO
                    m('ul.TagList', app.store.all('tags')
                        .filter(tag => tag.position() === null)
                        .sort((a, b) => a.name().localeCompare(b.name()))
                        .map(tagItem)),
                ]));
            });
        });
    });
}

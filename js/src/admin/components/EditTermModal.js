import app from 'flarum/app';
import extractText from 'flarum/utils/extractText';
import {slug} from 'flarum/utils/string';
import AbstractEditModal from './AbstractEditModal';

/* global m */

export default class EditTermModal extends AbstractEditModal {
    init() {
        super.init();

        const {term} = this.props;

        this.name = term ? term.name() : '';
        this.slug = term ? term.slug() : '';
        this.description = term ? term.description() : '';
        this.color = term ? term.color() : '';
        this.icon = term ? term.icon() : '';
        this.dirty = false;
    }

    translationPrefix() {
        return 'fof-taxonomies.admin.edit-term.';
    }

    isNew() {
        return !this.props.term;
    }

    form() {
        return [
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.name')),
                m('input.FormControl', {
                    type: 'text',
                    value: this.name,
                    oninput: event => {
                        this.name = event.target.value;
                        this.slug = slug(event.target.value);
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.slug')),
                m('input.FormControl', {
                    type: 'text',
                    value: this.slug,
                    oninput: event => {
                        this.slug = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.description')),
                m('textarea.FormControl', {
                    value: this.description,
                    oninput: event => {
                        this.description = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.color')),
                m('input.FormControl', {
                    type: 'text',
                    value: this.color,
                    oninput: event => {
                        this.color = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.icon')),
                m('.helpText', app.translator.trans(this.translationPrefix() + 'field.iconDescription', {
                    a: m('a', {
                        href: 'https://fontawesome.com/icons?m=free',
                        tabindex: -1,
                    }),
                })),
                m('input.FormControl', {
                    type: 'text',
                    value: this.icon,
                    oninput: event => {
                        this.icon = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
        ];
    }

    ondelete() {
        if (!confirm(extractText(app.translator.trans(this.translationPrefix() + 'deleteConfirmation', {
            name: this.props.term.name(),
        })))) {
            return;
        }

        this.loading = true;

        this.props.term.delete({
            errorHandler: this.onerror.bind(this),
        }).then(() => {
            app.modal.close();

            if (this.props.ondelete) {
                this.props.ondelete();
            }
        }, () => {
            this.loaded();
        });
    }

    onsubmit(event) {
        event.preventDefault();

        this.loading = true;

        const record = this.props.term || app.store.createRecord('fof-taxonomy-terms');

        const options = {
            errorHandler: this.onerror.bind(this),
        };

        if (this.isNew()) {
            options.url = app.forum.attribute('apiUrl') + this.props.taxonomy.apiEndpoint() + '/terms';
        }

        record.save({
            name: this.name,
            slug: this.slug,
            description: this.description,
            color: this.color,
            icon: this.icon,
        }, options).then(() => {
            app.modal.close();

            if (this.props.onsave) {
                this.props.onsave(record);
            }
        }, () => {
            this.loaded();
        });
    }
}

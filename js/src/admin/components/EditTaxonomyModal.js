import app from 'flarum/app';
import extractText from 'flarum/utils/extractText';
import {slug} from 'flarum/utils/string';
import AbstractEditModal from './AbstractEditModal';

/* global m */

export default class EditTaxonomyModal extends AbstractEditModal {
    init() {
        super.init();

        const {taxonomy} = this.props;

        this.name = taxonomy ? taxonomy.name() : '';
        this.slug = taxonomy ? taxonomy.slug() : '';
        this.description = taxonomy ? taxonomy.description() : '';
        this.color = taxonomy ? taxonomy.color() : '';
        this.icon = taxonomy ? taxonomy.icon() : '';
        this.showLabel = taxonomy ? taxonomy.showLabel() : false;
        this.showFilter = taxonomy ? taxonomy.showFilter() : false;
        this.allowCustomValues = taxonomy ? taxonomy.allowCustomValues() : false;
        this.minTerms = taxonomy ? taxonomy.minTerms() : '';
        this.maxTerms = taxonomy ? taxonomy.maxTerms() : '';
    }

    translationPrefix() {
        return 'fof-taxonomies.admin.edit-taxonomy.';
    }

    isNew() {
        return !this.props.taxonomy;
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
                m('input.FormControl', {
                    type: 'text',
                    value: this.icon,
                    oninput: event => {
                        this.icon = event.target.value;
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', [
                    m('input', {
                        type: 'checkbox',
                        checked: this.showLabel,
                        onchange: () => {
                            this.showLabel = !this.showLabel;
                            this.dirty = true;
                        },
                    }),
                    ' ',
                    app.translator.trans(this.translationPrefix() + 'field.showLabel'),
                ]),
            ]),
            m('.Form-group', [
                m('label', [
                    m('input', {
                        type: 'checkbox',
                        checked: this.showFilter,
                        onchange: () => {
                            this.showFilter = !this.showFilter;
                            this.dirty = true;
                        },
                    }),
                    ' ',
                    app.translator.trans(this.translationPrefix() + 'field.showFilter'),
                ]),
            ]),
            m('.Form-group', [
                m('label', [
                    m('input', {
                        type: 'checkbox',
                        checked: this.allowCustomValues,
                        onchange: () => {
                            this.allowCustomValues = !this.allowCustomValues;
                            this.dirty = true;
                        },
                    }),
                    ' ',
                    app.translator.trans(this.translationPrefix() + 'field.allowCustomValues'),
                ]),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.minTerms')),
                m('input.FormControl', {
                    type: 'number',
                    min: 0,
                    step: 1,
                    value: this.minTerms,
                    oninput: event => {
                        this.minTerms = parseInt(event.target.value) || '';
                        this.dirty = true;
                    },
                }),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans(this.translationPrefix() + 'field.maxTerms')),
                m('input.FormControl', {
                    type: 'number',
                    min: 0,
                    step: 1,
                    value: this.maxTerms,
                    oninput: event => {
                        this.maxTerms = parseInt(event.target.value) || '';
                        this.dirty = true;
                    },
                }),
            ]),
        ];
    }

    ondelete() {
        if (!confirm(extractText(app.translator.trans(this.translationPrefix() + 'deleteConfirmation', {
            name: this.props.taxonomy.name(),
        })))) {
            return;
        }

        this.loading = true;

        this.props.taxonomy.delete({
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

    onsubmit() {
        this.loading = true;

        const record = this.props.taxonomy || app.store.createRecord('fof-taxonomies');

        record.save({
            name: this.name,
            slug: this.slug,
            description: this.description,
            color: this.color,
            icon: this.icon,
            show_label: this.showLabel,
            show_filter: this.showFilter,
            allow_custom_values: this.allowCustomValues,
            min_terms: this.minTerms,
            max_terms: this.maxTerms,
        }, {
            errorHandler: this.onerror.bind(this),
        }).then(() => {
            app.modal.close();

            if (this.props.onsave) {
                this.props.onsave(record);
            }
        }, () => {
            this.loaded();
        });
    }
}

import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

const translationPrefix = 'fof-taxonomies.admin.edit-taxonomy.';

/* global m */

export default class AbstractEditModal extends Modal {
    className() {
        return 'Modal--small TaxonomyEditModal';
    }

    /**
     * @abstract
     */
    translationPrefix() {
        return '';
    }

    /**
     * @abstract
     */
    isNew() {
        return true;
    }

    title() {
        return app.translator.trans(this.translationPrefix() + 'title.' + (this.isNew() ? 'new' : 'edit'));
    }

    init() {
        super.init();

        this.dirty = false;
    }

    /**
     * @abstract
     */
    form() {
        return [];
    }

    content() {
        return m('.Modal-body', [
            this.form(),
            m('.FormGroup', [
                Button.component({
                    type: 'submit',
                    className: 'Button Button--primary',
                    loading: this.loading,
                    disabled: !this.dirty,
                }, app.translator.trans(this.translationPrefix() + 'submit.' + (this.isNew() ? 'new' : 'edit'))),
                ' ',
                this.isNew() ? null : Button.component({
                    className: 'Button Button--link TaxonomyEditModal-delete',
                    children: app.translator.trans(translationPrefix + 'delete'),
                    loading: this.loading,
                    onclick: this.ondelete.bind(this),
                }),
            ]),
        ]);
    }

    /**
     * @abstract
     */
    ondelete() {
        //
    }
}

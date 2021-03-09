import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import DiscussionPage from 'flarum/components/DiscussionPage';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import highlight from 'flarum/helpers/highlight';
import classList from 'flarum/utils/classList';
import ItemList from 'flarum/utils/ItemList';
import extractText from 'flarum/utils/extractText';
import KeyboardNavigatable from 'flarum/utils/KeyboardNavigatable';

import termLabel from '../../common/helpers/termLabel';
import taxonomyIcon from '../../common/helpers/taxonomyIcon';
import termToIdentifier from '../../common/utils/termToIdentifier';

/* global m */

/**
 * Comparing objects directly is unreliable because we will be creating some new records as well
 * So we use this method to do a proper deep check
 */
function isSameTerm(a, b) {
    if (a.data.type !== b.data.type) {
        return false;
    }

    // If both have an ID and it's different
    if (a.id() && b.id()) {
        return a.id() === b.id();
    }

    // If only one has an ID, it's different
    if (!a.id() !== !b.id()) {
        return false;
    }

    // If both don't have an ID, it's a new value and we compare the name
    return a.name() === b.name();
}

/**
 * Based on Flarum's TagDiscussionModal
 */
export default class ChooseTaxonomyTermsModal extends Modal {
    init() {
        super.init();

        this.availableTerms = null; // List of models
        this.selectedTerms = []; // List of models
        this.searchFilter = '';
        this.activeListIndex = 0;
        this.inputIsFocused = false;
        this.saving = false;

        if (this.props.selectedTerms) {
            this.props.selectedTerms.forEach(this.addTerm.bind(this));
        } else if (this.props.resource) {
            this.props.resource.taxonomyTerms().forEach(term => {
                if (term.taxonomy().id() === this.props.taxonomy.id()) {
                    this.addTerm(term);
                }
            });
        }

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + this.props.taxonomy.apiEndpoint() + '/terms',
        }).then(result => {
            this.availableTerms = app.store.pushPayload(result);

            m.redraw();
        });

        this.navigator = new KeyboardNavigatable();
        this.navigator
            .onUp(() => this.setIndex(this.activeListIndex - 1, true))
            .onDown(() => this.setIndex(this.activeListIndex + 1, true))
            .onSelect(this.select.bind(this))
            .onRemove(() => {
                if (!this.selectedTerms.length) {
                    return;
                }

                this.toggleTerm(this.selectedTerms[this.selectedTerms.length - 1]);
            })
            .when(event => {
                // We want to allow selecting with space because it's a common way to select
                // However this interferes with the ability to enter spaces
                // So we will have space act as select, but only if nothing is typed yet
                if (event.key === ' ' && this.searchFilter === '') {
                    event.preventDefault();
                    this.select(event);

                    return false;
                }

                return true;
            });
    }

    indexInSelectedTerms(term) {
        return this.selectedTerms.findIndex(t => isSameTerm(t, term));
    }

    addTerm(term) {
        this.selectedTerms.push(term);
    }

    removeTerm(term) {
        const index = this.indexInSelectedTerms(term);

        if (index !== -1) {
            this.selectedTerms.splice(index, 1);
        }
    }

    className() {
        return 'ChooseTaxonomyTermsModal';
    }

    title() {
        return this.props.resource
            ? app.translator.trans('fof-taxonomies.forum.modal.title.edit', {
                taxonomy: this.props.taxonomy.name(),
                title: m('em', this.props.resource.title ? this.props.resource.title() : this.props.resource.displayName()),
            })
            : app.translator.trans('fof-taxonomies.forum.modal.title.new', {
                taxonomy: this.props.taxonomy.name(),
            });
    }

    getInstruction() {
        const count = this.selectedTerms.length;

        if (this.props.taxonomy.minTerms() && count < this.props.taxonomy.minTerms()) {
            const remaining = this.props.taxonomy.minTerms() - count;
            return app.translator.transChoice('fof-taxonomies.forum.modal.placeholder', remaining, {remaining});
        } else if (count === 0) {
            return app.translator.trans('fof-taxonomies.forum.modal.placeholderOptional');
        }

        return '';
    }

    filteredAvailableTerms() {
        let availableTerms = this.availableTerms === null ? [] : this.availableTerms;
        const filter = this.searchFilter.toLowerCase();

        if (filter) {
            availableTerms = availableTerms.filter(term => term.name().substr(0, filter.length).toLowerCase() === filter);

            if (
                this.props.taxonomy.allowCustomValues() &&
                !availableTerms.some(term => term.name().toLowerCase() === filter)
            ) {
                const validation = this.props.taxonomy.customValueValidation();
                let regex = null;

                if (validation === 'alpha_num') {
                    regex = /^[a-z0-9]$/i;
                } else if (validation === 'alpha_dash') {
                    regex = /^[a-z0-9_-]$/i;
                } else if (validation.indexOf('/') === 0) {
                    const parts = validation.split('/');
                    if (parts.length === 3) {
                        regex = new RegExp(parts[1], parts[2]);
                    }
                }

                if (!regex || regex.test(this.searchFilter)) {
                    availableTerms.push(app.store.createRecord('fof-taxonomy-terms', {
                        attributes: {
                            name: this.searchFilter,
                        },
                    }));
                }
            }
        }

        if (this.props.taxonomy.maxTerms() && this.selectedTerms.length >= this.props.taxonomy.maxTerms()) {
            availableTerms = [];
        }

        return availableTerms;
    }

    content() {
        return [
            this.viewForm(),
            this.listAvailableTerms(this.filteredAvailableTerms()),
        ];
    }

    viewForm() {
        const description = this.props.taxonomy.description();

        return m('.Modal-body', [
            description ? m('p', description) : null,
            m('.ChooseTaxonomyTermsModal-form', this.formItems().toArray()),
        ]);
    }

    formItems() {
        const items = new ItemList();

        items.add('input', m('.ChooseTaxonomyTermsModal-form-input', m('.TermsInput.FormControl', {
            className: this.inputIsFocused ? 'focus' : '',
        }, this.inputItems().toArray())), 20);

        items.add('submit', m('.ChooseTaxonomyTermsModal-form-submit.App-primaryControl', Button.component({
            type: 'submit',
            className: 'Button Button--primary',
            disabled: this.props.taxonomy.minTerms() && this.selectedTerms.length < this.props.taxonomy.minTerms(),
            icon: 'fas fa-check',
            loading: this.saving,
        }, app.translator.trans('fof-taxonomies.forum.modal.submit'))), 10);

        return items;
    }

    inputItems() {
        const items = new ItemList();

        items.add('selected', this.selectedTerms.map(term => {
            return m('span.TermsInput-term', {
                onclick: () => {
                    this.toggleTerm(term);
                    this.onready();
                },
            }, termLabel(term));
        }), 20);

        items.add('control', m('input.FormControl', {
            placeholder: extractText(this.getInstruction()),
            value: this.searchFilter,
            oninput: event => {
                this.searchFilter = event.target.value;
                this.activeListIndex = 0;
            },
            onkeydown: this.navigator.navigate.bind(this.navigator),
            // Use local methods so that other extensions can extend behaviour
            onfocus: this.oninputfocus.bind(this),
            onblur: this.oninputblur.bind(this),
        }), 10);

        return items;
    }

    oninputfocus() {
        this.inputIsFocused = true;
    }

    oninputblur() {
        this.inputIsFocused = false;
    }

    listAvailableTerms(terms) {
        return m('.Modal-footer', this.availableTerms === null ?
            LoadingIndicator.component() :
            m('ul.ChooseTaxonomyTermsModal-list.SelectTermList', {
                className: terms.some(term => term.description()) ? 'SelectTermList--with-descriptions' : '',
            }, terms.map(this.listAvailableTerm.bind(this)))
        );
    }

    listAvailableTerm(term, index) {
        return m('li.SelectTermListItem', {
            'data-index': index,
            className: classList({
                colored: !!term.color(),
                selected: this.indexInSelectedTerms(term) !== -1,
                active: this.activeListIndex === index,
            }),
            style: {color: term.color()},
            onmouseover: () => this.activeListIndex = index,
            onclick: this.toggleTerm.bind(this, term),
        }, [
            taxonomyIcon(term),
            m('span.SelectTermListItem-name', term.exists ? highlight(term.name(), this.searchFilter) : app.translator.trans('fof-taxonomies.forum.modal.custom', {
                value: m('em', term.name()),
            })),
            term.description() ? m('span.SelectTermListItem-description', term.description()) : '',
        ]);
    }

    toggleTerm(term) {
        const index = this.indexInSelectedTerms(term);

        if (index !== -1) {
            this.removeTerm(term);
        } else {
            this.addTerm(term);
        }

        if (this.searchFilter) {
            this.searchFilter = '';
            this.activeListIndex = 0;
        }

        // Defer re-focusing to next browser draw
        setTimeout(() => {
            this.onready();
        });
    }

    select(e) {
        const $element = this.getDomElement(this.activeListIndex);

        // If nothing matches, the user probably typed text that doesn't match anything
        // In that case we don't want to submit just yet, but we will delete the text
        // so that typing enter multiple times does end up submitting
        if (!$element.length) {
            this.searchFilter = '';
            return;
        }

        // Ctrl + Enter submits the selection, just Enter completes the current entry
        if (e.metaKey || e.ctrlKey || $element.is('.selected')) {
            if (this.selectedTerms.length) {
                this.$('form').submit();
            }
        } else {
            $element[0].dispatchEvent(new Event('click'));
        }
    }

    getDomElement(index) {
        return this.$(`.SelectTermListItem[data-index="${index}"]`);
    }

    setIndex(index, scrollToItem) {
        const $dropdown = this.$('.ChooseTaxonomyTermsModal-list');

        const indexLength = this.$('.SelectTermListItem').length;

        if (index < 0) {
            index = indexLength - 1;
        } else if (index >= indexLength) {
            index = 0;
        }

        const $item = this.getDomElement(index);
        this.activeListIndex = index;

        m.redraw();

        if (scrollToItem) {
            const dropdownScroll = $dropdown.scrollTop();
            const dropdownTop = $dropdown.offset().top;
            const dropdownBottom = dropdownTop + $dropdown.outerHeight();
            const itemTop = $item.offset().top;
            const itemBottom = itemTop + $item.outerHeight();

            let scrollTop;
            if (itemTop < dropdownTop) {
                scrollTop = dropdownScroll - dropdownTop + itemTop - parseInt($dropdown.css('padding-top'), 10);
            } else if (itemBottom > dropdownBottom) {
                scrollTop = dropdownScroll - dropdownBottom + itemBottom + parseInt($dropdown.css('padding-bottom'), 10);
            }

            if (typeof scrollTop !== 'undefined') {
                $dropdown.stop(true).animate({scrollTop}, 100);
            }
        }
    }

    onsubmit(event) {
        event.preventDefault();

        if (this.props.resource) {
            this.saveResource();

            // Do not run the normal code - it might close the modal even if an error occurred
            return;
        }

        if (this.props.onsubmit) this.props.onsubmit(this.selectedTerms);

        app.modal.close();

        m.redraw.strategy('none');
    }

    saveResource() {
        this.saving = true;

        this.props.resource.save({
            relationships: {
                taxonomies: [
                    {
                        verbatim: true, // Flarum workaround, handled in addComposerControls
                        type: 'fof-taxonomies',
                        id: this.props.taxonomy.id(),
                        relationships: {
                            terms: {
                                data: this.selectedTerms.map(termToIdentifier),
                            },
                        },
                    },
                ],
            },
        }).then(this.onsaved.bind(this), this.onerror.bind(this));
    }

    onsaved() {
        if (app.current instanceof DiscussionPage) {
            app.current.stream.update();
        }
        this.saving = false;
        m.redraw();

        app.modal.close();
    }

    onerror() {
        this.saving = false;
        m.redraw();
    }
}

import app from 'flarum/app';
import Modal from 'flarum/components/Modal';
import DiscussionPage from 'flarum/components/DiscussionPage';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import highlight from 'flarum/helpers/highlight';
import classList from 'flarum/utils/classList';
import extractText from 'flarum/utils/extractText';
import KeyboardNavigatable from 'flarum/utils/KeyboardNavigatable';

import termLabel from '../../common/helpers/termLabel';
import taxonomyIcon from '../../common/helpers/taxonomyIcon';
import sortTerms from '../../common/utils/sortTerms';
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

        if (this.props.selectedTerms) {
            this.props.selectedTerms.forEach(this.addTerm.bind(this));
        } else if (this.props.discussion) {
            this.props.discussion.taxonomyTerms().forEach(term => {
                if (term.taxonomy().id() === this.props.taxonomy.id()) {
                    this.addTerm(term);
                }
            });
        }

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + this.props.taxonomy.apiEndpoint() + '/terms',
        }).then(result => {
            this.availableTerms = sortTerms(app.store.pushPayload(result));

            m.redraw();
        });

        this.navigator = new KeyboardNavigatable();
        this.navigator
            .onUp(() => this.setIndex(this.activeListIndex - 1, true))
            .onDown(() => this.setIndex(this.activeListIndex + 1, true))
            .onSelect(this.select.bind(this))
            .onRemove(() => this.selectedTerms.splice(this.selectedTerms.length - 1, 1));
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
        return 'TagDiscussionModal';//TODO
    }

    title() {
        return this.props.discussion
            ? app.translator.trans('fof-taxonomies.forum.modal.title.edit', {
                taxonomy: this.props.taxonomy.name(),
                title: m('em', this.props.discussion.title()),
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
        }

        return '';
    }

    content() {
        let availableTerms = this.availableTerms === null ? [] : this.availableTerms;
        const filter = this.searchFilter.toLowerCase();

        if (filter) {
            availableTerms = availableTerms.filter(term => term.name().substr(0, filter.length).toLowerCase() === filter);

            if (
                this.props.taxonomy.allowCustomValues() &&
                !availableTerms.some(term => term.name().toLowerCase() === filter)
            ) {
                availableTerms.push(app.store.createRecord('fof-taxonomy-terms', {
                    attributes: {
                        name: this.searchFilter,
                    },
                }));
            }
        }

        if (this.props.taxonomy.maxTerms() && this.selectedTerms.length >= this.props.taxonomy.maxTerms()) {
            availableTerms = [];
        }

        return [
            m('.Modal-body', m('.TagDiscussionModal-form', [
                m('.TagDiscussionModal-form-input', m('.TagsInput.FormControl', {
                    className: this.inputIsFocused ? 'focus' : '',
                }, [
                    m('span.TagsInput-selected', this.selectedTerms.map(term => {
                        return m('span.TagsInput-tag', {
                            onclick: () => {
                                this.removeTerm(term);
                                this.onready();
                            },
                        }, termLabel(term));
                    })),
                    m('input.FormControl', {
                        placeholder: extractText(this.getInstruction()),
                        value: this.searchFilter,
                        oninput: event => {
                            this.searchFilter = event.target.value;
                            this.activeListIndex = 0;
                        },
                        onkeydown: this.navigator.navigate.bind(this.navigator),
                        onfocus: () => this.inputIsFocused = true,
                        onblur: () => this.inputIsFocused = false,
                    }),
                ])),
                m('.TagDiscussionModal-form-submit.App-primaryControl', Button.component({

                    type: 'submit',
                    className: 'Button Button--primary',
                    disabled: this.props.taxonomy.minTerms() && this.selectedTerms.length < this.props.taxonomy.minTerms(),
                    icon: 'fas fa-check',
                }, app.translator.trans('flarum-tags.forum.choose_tags.submit_button'))),//TODO
            ])),
            m('.Modal-footer', this.availableTerms === null ? LoadingIndicator.component() : m('ul.TagDiscussionModal-list.SelectTagList', availableTerms
                .map((term, index) => m('li', {
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
                    m('span.SelectTagListItem-name', term.exists ? highlight(term.name(), filter) : app.translator.trans('fof-taxonomies.forum.modal.custom', {
                        value: m('em', term.name()),
                    })),
                    term.description() ? m('span.SelectTagListItem-description', term.description()) : '',
                ])))),
        ];
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

        this.onready();
    }

    select(e) {
        const $element = this.getDomElement(this.activeListIndex);

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
        return this.$(`li[data-index="${index}"]`);
    }

    setIndex(index, scrollToItem) {
        const $dropdown = this.$('.TagDiscussionModal-list');

        const indexLength = this.$('.TagDiscussionModal-list > li').length;

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

        if (this.props.discussion) {
            this.props.discussion.save({
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
            }).then(() => {
                if (app.current instanceof DiscussionPage) {
                    app.current.stream.update();
                }
                m.redraw();
            });
        }

        if (this.props.onsubmit) this.props.onsubmit(this.selectedTerms);

        app.modal.close();

        m.redraw.strategy('none');
    }
}
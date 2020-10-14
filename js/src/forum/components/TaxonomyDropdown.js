import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import Dropdown from 'flarum/components/Dropdown';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

/* global m */

export default class TaxonomyDropdown extends Component {
    init() {
        this.termsInitialized = false;
        this.terms = null;

        // If a term is active while the component inits, we're probably loading a page with pre-loaded filters
        // We could retrieve the term from the store if it is present on discussion results
        // But it's unreliable since a page with no results wouldn't have it but we want to show the term in the dropdown
        if (this.props.activeTermSlug) {
            this.loadTerms();
        }
    }

    loadTerms() {
        if (this.termsInitialized) {
            return;
        }

        this.termsInitialized = true;

        app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + this.props.taxonomy.apiEndpoint() + '/terms',
        }).then(result => {
            this.terms = app.store.pushPayload(result);

            this.terms.forEach(term => {
                term.pushData({
                    relationships: {
                        taxonomy: this.props.taxonomy,
                    },
                });
            });

            m.redraw();
        });
    }

    view() {
        let activeTerm = this.terms && this.terms.find(t => t.slug() === this.props.activeTermSlug);

        return Dropdown.component({
            buttonClassName: 'Button',
            label: this.props.taxonomy.name() + (activeTerm ? ': ' + activeTerm.name() : ''),
            onshow: () => {
                this.loadTerms();
            },
        }, this.terms === null ? [
            LoadingIndicator.component(),
        ] : this.terms.map(term => {
            const active = this.props.activeTermSlug === term.slug();

            return Button.component({
                icon: active ? 'fas fa-check' : true,
                onclick: () => this.props.onchange(term),
                active, // Remove after https://github.com/flarum/core/issues/2265
            }, term.name());
        }));
    }
}

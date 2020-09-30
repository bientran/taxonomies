import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import Dropdown from 'flarum/components/Dropdown';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import sortTerms from '../../common/utils/sortTerms';

/* global m */

export default class TaxonomyDropdown extends Component {
    init() {
        this.termsInitialized = false;
        this.terms = null;
    }

    view() {
        const {taxonomy} = this.props;

        return Dropdown.component({
            buttonClassName: 'Button',
            label: taxonomy.name() + (this.props.term ? ': ' + this.props.term.name() : ''),
            onshow: () => {
                if (!this.termsInitialized) {
                    this.termsInitialized = true;
                }

                app.request({
                    method: 'GET',
                    url: app.forum.attribute('apiUrl') + taxonomy.apiEndpoint() + '/terms',
                }).then(result => {
                    this.terms = sortTerms(app.store.pushPayload(result));

                    this.terms.forEach(term => {
                        term.pushData({
                            relationships: {
                                taxonomy,
                            },
                        });
                    });

                    m.redraw();
                });
            },
        }, this.terms === null ? [
            LoadingIndicator.component(),
        ] : this.terms.map(term => {
            const active = this.props.term === term;

            return Button.component({
                icon: active ? 'fas fa-check' : true,
                onclick: () => this.props.onchange(term),
                active, // Remove after https://github.com/flarum/core/issues/2265
            }, term.name());
        }));
    }
}

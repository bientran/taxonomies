import app from 'flarum/app';
import {extend, override} from 'flarum/extend';
import DiscussionComposer from 'flarum/components/DiscussionComposer';
import Model from 'flarum/Model';
import ChooseTaxonomyTermsModal from './components/ChooseTaxonomyTermsModal';
import termsLabel from '../common/helpers/termsLabel';
import sortTaxonomies from '../common/utils/sortTaxonomies';
import termToIdentifier from '../common/utils/termToIdentifier';

/* global m */

export default function () {
    extend(DiscussionComposer.prototype, 'headerItems', function (items) {
        sortTaxonomies(app.store.all('fof-taxonomies')).forEach(taxonomy => {
            items.add(taxonomy.uniqueKey(), m('a.DiscussionComposer-changeTaxonomies', {
                    onclick: () => {
                        app.modal.show(new ChooseTaxonomyTermsModal({
                            taxonomy,
                            selectedTerms: (this[taxonomy.uniqueKey()] || []).slice(0),
                            onsubmit: terms => {
                                this[taxonomy.uniqueKey()] = terms;
                                this.$('textarea').focus();
                            },
                        }));
                    },
                }, this[taxonomy.uniqueKey()] && this[taxonomy.uniqueKey()].length
                ? termsLabel(this[taxonomy.uniqueKey()], {
                    taxonomy,
                })
                : m('span.TaxonomyLabel.untagged', app.translator.trans('fof-taxonomies.forum.composer.choose', {
                    taxonomy: taxonomy.name(),
                }))
            ), 10);
        });
    });

    override(DiscussionComposer.prototype, 'onsubmit', function (original) {
        let callback = original;

        //TODO: this will show the popups backwards I think
        sortTaxonomies(app.store.all('fof-taxonomies')).forEach(taxonomy => {
            const count = (this[taxonomy.uniqueKey()] || []).length;

            if (taxonomy.minTerms() && count < taxonomy.minTerms()) {
                callback = () => {
                    app.modal.show(new ChooseTaxonomyTermsModal({
                        taxonomy,
                        selectedTags: (this[taxonomy.uniqueKey()] || []).slice(0),
                        onsubmit: terms => {
                            this[taxonomy.uniqueKey()] = terms;
                            callback();
                        },
                    }));
                };
            }
        });

        callback();
    });

    extend(DiscussionComposer.prototype, 'data', function (data) {
        const taxonomyData = [];

        // We put all term IDs from all taxonomies together for the request
        app.store.all('fof-taxonomies').forEach(taxonomy => {
            if (this[taxonomy.uniqueKey()] && this[taxonomy.uniqueKey()].length) {
                taxonomyData.push({
                    verbatim: true, // Flarum workaround, see below
                    type: 'fof-taxonomies',
                    id: taxonomy.id(),
                    relationships: {
                        terms: {
                            data: this[taxonomy.uniqueKey()].map(termToIdentifier),
                        },
                    },
                });
            }
        });

        data.relationships = data.relationships || {};
        data.relationships.taxonomies = taxonomyData;
    });

    /**
     * The way Flarum parses relationships inside of the save() method prevents us from saving data alongside the relation
     * To work around this, we override this method that will allow us to pass down raw objects directly in the model during save
     */
    override(Model, 'getIdentifier', function (original, model) {
        if (model.verbatim) {
            delete model.verbatim;

            return model;
        }

        return original(model);
    });
}

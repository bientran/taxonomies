import app from 'flarum/app';
import Model from 'flarum/Model';
import Tag from 'flarum/tags/models/Tag';
import Taxonomy from './models/Taxonomy';
import Term from './models/Term';

export default function () {
    app.store.models['fof-taxonomies'] = Taxonomy;
    app.store.models['fof-taxonomy-terms'] = Term;

    if (Tag) {
        Tag.prototype.taxonomy = Model.hasOne('taxonomy');
    }
}

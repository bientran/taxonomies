import app from 'flarum/app';
import Taxonomy from './models/Taxonomy';
import Term from './models/Term';

export default function () {
    app.store.models['fof-taxonomies'] = Taxonomy;
    app.store.models['fof-taxonomy-terms'] = Term;
}

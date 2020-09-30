import app from 'flarum/app';
import Discussion from 'flarum/models/Discussion';
import Model from 'flarum/Model';
import addComposerControls from './addComposerControls';
import addDiscussionControls from './addDiscussionControls';
import addIndexFilters from './addIndexFilters';
import addLabels from './addLabels';
import addModels from '../common/addModels';

app.initializers.add('fof-taxonomies', () => {
    addComposerControls();
    addDiscussionControls();
    addIndexFilters();
    addLabels();
    addModels();

    Discussion.prototype.taxonomyTerms = Model.hasMany('taxonomyTerms');
});

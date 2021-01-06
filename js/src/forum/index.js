import app from 'flarum/app';
import Discussion from 'flarum/models/Discussion';
import Forum from 'flarum/models/Forum';
import User from 'flarum/models/User';
import Model from 'flarum/Model';
import addComposerControls from './addComposerControls';
import addDiscussionControls from './addDiscussionControls';
import addIndexFilters from './addIndexFilters';
import addLabels from './addLabels';
import addPages from './addPages';
import addUserControls from './addUserControls';
import addModels from '../common/addModels';
import addUserDirectorySearchType from './addUserDirectorySearchType';

export * from './components';
export * from '../common/helpers';
export * from '../common/models';
export * from '../common/utils';

app.initializers.add('fof-taxonomies', () => {
    addComposerControls();
    addDiscussionControls();
    addIndexFilters();
    addLabels();
    addPages();
    addUserControls();
    addModels();
    addUserDirectorySearchType();

    Forum.prototype.taxonomies = Model.hasMany('taxonomies');
    Discussion.prototype.taxonomyTerms = Model.hasMany('taxonomyTerms');
    User.prototype.taxonomyTerms = Model.hasMany('taxonomyTerms');
});

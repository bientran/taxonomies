import app from 'flarum/app';
import addPage from './addPage';
import addPermissions from './addPermissions';
import addModels from '../common/addModels';

export * from './components';
export * from '../common/helpers';
export * from '../common/models';
export * from '../common/utils';

app.initializers.add('fof-taxonomies', () => {
    addPage();
    addPermissions();
    addModels();
});

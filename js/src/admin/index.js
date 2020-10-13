import app from 'flarum/app';
import addPage from './addPage';
import addPermissions from './addPermissions';
import addModels from '../common/addModels';

app.initializers.add('fof-taxonomies', () => {
    addPage();
    addPermissions();
    addModels();
});

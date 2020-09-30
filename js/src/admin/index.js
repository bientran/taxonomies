import app from 'flarum/app';
import addPage from './addPage';
import addModels from '../common/addModels';

app.initializers.add('fof-taxonomies', () => {
    addPage();
    addModels();
});

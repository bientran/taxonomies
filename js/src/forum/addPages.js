import app from 'flarum/app';
import UserTaxonomyPage from './components/UserTaxonomyPage';

export default function () {
    app.routes.fofTaxonomiesUser = {
        path: '/u/:username/taxonomies',
        component: UserTaxonomyPage.component(),
    };

    app.route.fofTaxonomiesUser = user => {
        return app.route('fofTaxonomiesUser', {
            username: user.username(),
        });
    };
}

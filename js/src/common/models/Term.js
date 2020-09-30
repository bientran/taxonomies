import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Term extends mixin(Model, {
    name: Model.attribute('name'),
    slug: Model.attribute('slug'),
    description: Model.attribute('description'),
    color: Model.attribute('color'),
    icon: Model.attribute('icon'),
    order: Model.attribute('order'),
    createdAt: Model.attribute('createdAt', Model.transformDate),

    taxonomy: Model.hasOne('taxonomy'),
}) {
    //
}

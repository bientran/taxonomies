import Model from 'flarum/Model';
import computed from 'flarum/utils/computed';
import mixin from 'flarum/utils/mixin';

export default class Taxonomy extends mixin(Model, {
    name: Model.attribute('name'),
    slug: Model.attribute('slug'),
    description: Model.attribute('description'),
    color: Model.attribute('color'),
    icon: Model.attribute('icon'),
    order: Model.attribute('order'),
    showLabel: Model.attribute('showLabel'),
    showFilter: Model.attribute('showFilter'),
    allowCustomValues: Model.attribute('allowCustomValues'),
    minTerms: Model.attribute('minTerms'),
    maxTerms: Model.attribute('maxTerms'),
    createdAt: Model.attribute('createdAt', Model.transformDate),

    uniqueKey: computed('id', id => 'taxonomy' + id),
}) {
    //
}

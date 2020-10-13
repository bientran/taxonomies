import Model from 'flarum/Model';
import computed from 'flarum/utils/computed';

export default class Taxonomy extends Model {
    name = Model.attribute('name');
    slug = Model.attribute('slug');
    description = Model.attribute('description');
    color = Model.attribute('color');
    icon = Model.attribute('icon');
    order = Model.attribute('order');
    showLabel = Model.attribute('showLabel');
    showFilter = Model.attribute('showFilter');
    allowCustomValues = Model.attribute('allowCustomValues');
    customValueValidation = Model.attribute('customValueValidation');
    customValueSlugger = Model.attribute('customValueSlugger');
    minTerms = Model.attribute('minTerms');
    maxTerms = Model.attribute('maxTerms');
    createdAt = Model.attribute('createdAt', Model.transformDate);
    canSearchDiscussions = Model.attribute('canSearchDiscussions');

    uniqueKey = computed('id', id => 'taxonomy' + id);
}

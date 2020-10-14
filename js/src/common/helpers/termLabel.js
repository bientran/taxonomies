import app from 'flarum/app';
import extract from 'flarum/utils/extract';
import taxonomyIcon from './taxonomyIcon';

/* global m */

export default function termLabel(term, attrs = {}) {
    attrs.style = attrs.style || {};
    attrs.className = 'TaxonomyLabel ' + (attrs.className || '');

    const link = extract(attrs, 'link');
    const tagText = term ? term.name() : app.translator.trans('flarum-tags.lib.deleted_tag_text');

    if (term) {
        const color = term.color();
        if (color) {
            attrs.style.backgroundColor = attrs.style.color = color;
            attrs.className += ' colored';
        }

        if (link && term.taxonomy()) {
            attrs.title = term.description() || '';
            attrs.href = app.route('index', {[term.taxonomy().slug()]: term.slug()});
            attrs.config = m.route;
        }
    } else {
        attrs.className += ' untagged';
    }

    return m((link ? 'a' : 'span'), attrs, m('span.TaxonomyLabel-text', [
        term && term.icon() && taxonomyIcon(term, {}, {useColor: false}),
        ' ' + tagText,
    ]));
}

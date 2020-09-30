import classList from 'flarum/utils/classList';

/* global m */

export default function taxonomyIcon(term, attrs = {}, settings = {}) {
    const hasIcon = term && term.icon();
    const {useColor = true} = settings;

    attrs.className = classList([
        attrs.className,
        'icon',
        hasIcon ? term.icon() : 'TaxonomyIcon',
    ]);

    if (term) {
        attrs.style = attrs.style || {};

        if (hasIcon) {
            attrs.style.color = useColor ? term.color() : '';
        } else {
            attrs.style.backgroundColor = term.color();
        }
    } else {
        attrs.className += ' untagged';
    }

    return hasIcon ? m('i', attrs) : m('span', attrs);
}

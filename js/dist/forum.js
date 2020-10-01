module.exports=function(t){var e={};function o(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,o),a.l=!0,a.exports}return o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)o.d(n,a,function(e){return t[e]}.bind(null,a));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=32)}([function(t,e){t.exports=flarum.core.compat.app},function(t,e){t.exports=flarum.core.compat.Model},function(t,e,o){"use strict";function n(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}o.d(e,"a",(function(){return n}))},function(t,e){t.exports=flarum.core.compat["components/Button"]},function(t,e){t.exports=flarum.core.compat.extend},function(t,e,o){"use strict";e.a=function(t){return t.slice(0).sort((function(t,e){var o=t.order()-e.order();return 0!==o?o:t.name()>e.name()?1:t.name()<e.name()?-1:0}))}},function(t,e,o){"use strict";e.a=function(t){return t.slice(0).sort((function(t,e){var o=t.order()-e.order();return 0!==o?o:t.name()>e.name()?1:t.name()<e.name()?-1:0}))}},function(t,e){t.exports=flarum.core.compat["components/LoadingIndicator"]},function(t,e,o){"use strict";o.d(e,"a",(function(){return r}));var n=o(10),a=o.n(n);function r(t,e,o){void 0===e&&(e={}),void 0===o&&(o={});var n=t&&t.icon(),r=o.useColor,s=void 0===r||r;return e.className=a()([e.className,"icon",n?t.icon():"TaxonomyIcon"]),t?(e.style=e.style||{},n?e.style.color=s?t.color():"":e.style.backgroundColor=t.color()):e.className+=" untagged",n?m("i",e):m("span",e)}},function(t,e){t.exports=flarum.core.compat["utils/mixin"]},function(t,e){t.exports=flarum.core.compat["utils/classList"]},function(t,e){t.exports=flarum.core.compat["components/Modal"]},function(t,e){t.exports=flarum.core.compat.Component},function(t,e){t.exports=flarum.core.compat["utils/computed"]},function(t,e,o){"use strict";var n=o(0),a=o.n(n),r=o(2),s=o(1),i=o.n(s),c=o(13),u=o.n(c),m=o(9),l=o.n(m),p=function(t){function e(){return t.apply(this,arguments)||this}return Object(r.a)(e,t),e}(l()(i.a,{name:i.a.attribute("name"),slug:i.a.attribute("slug"),description:i.a.attribute("description"),color:i.a.attribute("color"),icon:i.a.attribute("icon"),order:i.a.attribute("order"),showLabel:i.a.attribute("showLabel"),showFilter:i.a.attribute("showFilter"),allowCustomValues:i.a.attribute("allowCustomValues"),minTerms:i.a.attribute("minTerms"),maxTerms:i.a.attribute("maxTerms"),createdAt:i.a.attribute("createdAt",i.a.transformDate),uniqueKey:u()("id",(function(t){return"taxonomy"+t}))})),f=function(t){function e(){return t.apply(this,arguments)||this}return Object(r.a)(e,t),e}(l()(i.a,{name:i.a.attribute("name"),slug:i.a.attribute("slug"),description:i.a.attribute("description"),color:i.a.attribute("color"),icon:i.a.attribute("icon"),order:i.a.attribute("order"),createdAt:i.a.attribute("createdAt",i.a.transformDate),taxonomy:i.a.hasOne("taxonomy")}));e.a=function(){a.a.store.models["fof-taxonomies"]=p,a.a.store.models["fof-taxonomy-terms"]=f}},function(t,e){t.exports=flarum.core.compat["utils/extract"]},,function(t,e){t.exports=flarum.core.compat["components/DiscussionComposer"]},function(t,e){t.exports=flarum.core.compat["models/Discussion"]},function(t,e){t.exports=flarum.core.compat["components/DiscussionPage"]},function(t,e){t.exports=flarum.core.compat["helpers/highlight"]},function(t,e){t.exports=flarum.core.compat["utils/extractText"]},function(t,e){t.exports=flarum.core.compat["utils/KeyboardNavigatable"]},function(t,e){t.exports=flarum.core.compat["utils/DiscussionControls"]},function(t,e){t.exports=flarum.core.compat["components/IndexPage"]},function(t,e){t.exports=flarum.core.compat["components/DiscussionList"]},function(t,e){t.exports=flarum.core.compat["components/Dropdown"]},function(t,e){t.exports=flarum.core.compat["components/DiscussionListItem"]},function(t,e){t.exports=flarum.core.compat["components/DiscussionHero"]},,,,function(t,e,o){"use strict";o.r(e);var n=o(0),a=o.n(n),r=o(18),s=o.n(r),i=o(1),c=o.n(i),u=o(4),l=o(17),p=o.n(l),f=o(2),d=o(11),h=o.n(d),x=o(19),y=o.n(x),b=o(3),v=o.n(b),g=o(7),T=o.n(g),I=o(20),O=o.n(I),w=o(10),j=o.n(w),L=o(21),D=o.n(L),C=o(22),q=o.n(C),E=o(15),K=o.n(E),F=o(8);function M(t,e){void 0===e&&(e={}),e.style=e.style||{},e.className="TaxonomyLabel "+(e.className||"");var o=K()(e,"link")&&!1,n=t?t.name():a.a.translator.trans("flarum-tags.lib.deleted_tag_text");if(t){var r=t.color();r&&(e.style.backgroundColor=e.style.color=r,e.className+=" colored"),o&&(e.title=t.description()||"",e.href=a.a.route("tag",{tags:t.slug()}),e.config=m.route)}else e.className+=" untagged";return m(o?"a":"span",e,m("span.TaxonomyLabel-text",[t&&t.icon()&&Object(F.a)(t,{},{useColor:!1})," "+n]))}var N=o(6);function k(){return(k=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(t[n]=o[n])}return t}).apply(this,arguments)}var _=function(t){return t.id()?c.a.getIdentifier(t):k({},c.a.getIdentifier(t),{attributes:{name:t.name()}})};var S=function(t){function e(){return t.apply(this,arguments)||this}Object(f.a)(e,t);var o=e.prototype;return o.init=function(){var e=this;t.prototype.init.call(this),this.availableTerms=null,this.selectedTerms=[],this.searchFilter="",this.activeListIndex=0,this.inputIsFocused=!1,this.props.selectedTerms?this.props.selectedTerms.forEach(this.addTerm.bind(this)):this.props.discussion&&this.props.discussion.taxonomyTerms().forEach((function(t){t.taxonomy().id()===e.props.taxonomy.id()&&e.addTerm(t)})),a.a.request({method:"GET",url:a.a.forum.attribute("apiUrl")+this.props.taxonomy.apiEndpoint()+"/terms"}).then((function(t){e.availableTerms=Object(N.a)(a.a.store.pushPayload(t)),m.redraw()})),this.navigator=new q.a,this.navigator.onUp((function(){return e.setIndex(e.activeListIndex-1,!0)})).onDown((function(){return e.setIndex(e.activeListIndex+1,!0)})).onSelect(this.select.bind(this)).onRemove((function(){return e.selectedTerms.splice(e.selectedTerms.length-1,1)}))},o.indexInSelectedTerms=function(t){return this.selectedTerms.findIndex((function(e){return n=t,(o=e).data.type===n.data.type&&(o.id()&&n.id()?o.id()===n.id():!o.id()==!n.id()&&o.name()===n.name());var o,n}))},o.addTerm=function(t){this.selectedTerms.push(t)},o.removeTerm=function(t){var e=this.indexInSelectedTerms(t);-1!==e&&this.selectedTerms.splice(e,1)},o.className=function(){return"TagDiscussionModal"},o.title=function(){return this.props.discussion?a.a.translator.trans("fof-taxonomies.forum.modal.title.edit",{taxonomy:this.props.taxonomy.name(),title:m("em",this.props.discussion.title())}):a.a.translator.trans("fof-taxonomies.forum.modal.title.new",{taxonomy:this.props.taxonomy.name()})},o.getInstruction=function(){var t=this.selectedTerms.length;if(this.props.taxonomy.minTerms()&&t<this.props.taxonomy.minTerms()){var e=this.props.taxonomy.minTerms()-t;return a.a.translator.transChoice("fof-taxonomies.forum.modal.placeholder",e,{remaining:e})}return""},o.content=function(){var t=this,e=null===this.availableTerms?[]:this.availableTerms,o=this.searchFilter.toLowerCase();return o&&(e=e.filter((function(t){return t.name().substr(0,o.length).toLowerCase()===o})),this.props.taxonomy.allowCustomValues()&&!e.some((function(t){return t.name().toLowerCase()===o}))&&e.push(a.a.store.createRecord("fof-taxonomy-terms",{attributes:{name:this.searchFilter}}))),this.props.taxonomy.maxTerms()&&this.selectedTerms.length>=this.props.taxonomy.maxTerms()&&(e=[]),[m(".Modal-body",m(".TagDiscussionModal-form",[m(".TagDiscussionModal-form-input",m(".TagsInput.FormControl",{className:this.inputIsFocused?"focus":""},[m("span.TagsInput-selected",this.selectedTerms.map((function(e){return m("span.TagsInput-tag",{onclick:function(){t.removeTerm(e),t.onready()}},M(e))}))),m("input.FormControl",{placeholder:D()(this.getInstruction()),value:this.searchFilter,oninput:function(e){t.searchFilter=e.target.value,t.activeListIndex=0},onkeydown:this.navigator.navigate.bind(this.navigator),onfocus:function(){return t.inputIsFocused=!0},onblur:function(){return t.inputIsFocused=!1}})])),m(".TagDiscussionModal-form-submit.App-primaryControl",v.a.component({type:"submit",className:"Button Button--primary",disabled:this.props.taxonomy.minTerms()&&this.selectedTerms.length<this.props.taxonomy.minTerms(),icon:"fas fa-check"},a.a.translator.trans("flarum-tags.forum.choose_tags.submit_button")))])),m(".Modal-footer",null===this.availableTerms?T.a.component():m("ul.TagDiscussionModal-list.SelectTagList",e.map((function(e,n){return m("li",{"data-index":n,className:j()({colored:!!e.color(),selected:-1!==t.indexInSelectedTerms(e),active:t.activeListIndex===n}),style:{color:e.color()},onmouseover:function(){return t.activeListIndex=n},onclick:t.toggleTerm.bind(t,e)},[Object(F.a)(e),m("span.SelectTagListItem-name",e.exists?O()(e.name(),o):a.a.translator.trans("fof-taxonomies.forum.modal.custom",{value:m("em",e.name())})),e.description()?m("span.SelectTagListItem-description",e.description()):""])}))))]},o.toggleTerm=function(t){-1!==this.indexInSelectedTerms(t)?this.removeTerm(t):this.addTerm(t),this.searchFilter&&(this.searchFilter="",this.activeListIndex=0),this.onready()},o.select=function(t){var e=this.getDomElement(this.activeListIndex);t.metaKey||t.ctrlKey||e.is(".selected")?this.selectedTerms.length&&this.$("form").submit():e[0].dispatchEvent(new Event("click"))},o.getDomElement=function(t){return this.$('li[data-index="'+t+'"]')},o.setIndex=function(t,e){var o=this.$(".TagDiscussionModal-list"),n=this.$(".TagDiscussionModal-list > li").length;t<0?t=n-1:t>=n&&(t=0);var a=this.getDomElement(t);if(this.activeListIndex=t,m.redraw(),e){var r,s=o.scrollTop(),i=o.offset().top,c=i+o.outerHeight(),u=a.offset().top,l=u+a.outerHeight();u<i?r=s-i+u-parseInt(o.css("padding-top"),10):l>c&&(r=s-c+l+parseInt(o.css("padding-bottom"),10)),void 0!==r&&o.stop(!0).animate({scrollTop:r},100)}},o.onsubmit=function(t){t.preventDefault(),this.props.discussion&&this.props.discussion.save({relationships:{taxonomies:[{verbatim:!0,type:"fof-taxonomies",id:this.props.taxonomy.id(),relationships:{terms:{data:this.selectedTerms.map(_)}}}]}}).then((function(){a.a.current instanceof y.a&&a.a.current.stream.update(),m.redraw()})),this.props.onsubmit&&this.props.onsubmit(this.selectedTerms),a.a.modal.close(),m.redraw.strategy("none")},e}(h.a);function P(t,e){void 0===e&&(e={});var o=[],n=K()(e,"link");if(e.className="TaxonomiesLabel "+(e.className||""),t){var a=K()(e,"taxonomy");a||(a=t[0].taxonomy()),a&&a.showLabel()&&o.push(M(a,{className:"TaxonomyParentLabel"})),Object(N.a)(t).forEach((function(e){(e||1===t.length)&&o.push(M(e,{link:n}))}))}else o.push(M());return m("span",e,o)}var A=o(5),$=o(23),z=o.n($),B=o(24),H=o.n(B),U=o(25),V=o.n(U),G=o(12),R=o.n(G),J=o(26),Q=o.n(J),W=function(t){function e(){return t.apply(this,arguments)||this}Object(f.a)(e,t);var o=e.prototype;return o.init=function(){this.termsInitialized=!1,this.terms=null},o.view=function(){var t=this,e=this.props.taxonomy;return Q.a.component({buttonClassName:"Button",label:e.name()+(this.props.term?": "+this.props.term.name():""),onshow:function(){t.termsInitialized||(t.termsInitialized=!0),a.a.request({method:"GET",url:a.a.forum.attribute("apiUrl")+e.apiEndpoint()+"/terms"}).then((function(o){t.terms=Object(N.a)(a.a.store.pushPayload(o)),t.terms.forEach((function(t){t.pushData({relationships:{taxonomy:e}})})),m.redraw()}))}},null===this.terms?[T.a.component()]:this.terms.map((function(e){var o=t.props.term===e;return v.a.component({icon:!o||"fas fa-check",onclick:function(){return t.props.onchange(e)},active:o},e.name())})))},e}(R.a),X=[],Y=o(27),Z=o.n(Y),tt=o(28),et=o.n(tt),ot=o(14);a.a.initializers.add("fof-taxonomies",(function(){Object(u.extend)(p.a.prototype,"headerItems",(function(t){var e=this;Object(A.a)(a.a.store.all("fof-taxonomies")).forEach((function(o){t.add(o.uniqueKey(),m("a.DiscussionComposer-changeTaxonomies",{onclick:function(){a.a.modal.show(new S({taxonomy:o,selectedTerms:(e[o.uniqueKey()]||[]).slice(0),onsubmit:function(t){e[o.uniqueKey()]=t,e.$("textarea").focus()}}))}},e[o.uniqueKey()]&&e[o.uniqueKey()].length?P(e[o.uniqueKey()],{taxonomy:o}):m("span.TaxonomyLabel.untagged",a.a.translator.trans("fof-taxonomies.forum.composer.choose",{taxonomy:o.name()}))),10)}))})),Object(u.override)(p.a.prototype,"onsubmit",(function(t){var e=this,o=t;Object(A.a)(a.a.store.all("fof-taxonomies")).forEach((function(t){var n=(e[t.uniqueKey()]||[]).length;t.minTerms()&&n<t.minTerms()&&(o=function(){a.a.modal.show(new S({taxonomy:t,selectedTags:(e[t.uniqueKey()]||[]).slice(0),onsubmit:function(n){e[t.uniqueKey()]=n,o()}}))})})),o()})),Object(u.extend)(p.a.prototype,"data",(function(t){var e=this,o=[];a.a.store.all("fof-taxonomies").forEach((function(t){e[t.uniqueKey()]&&e[t.uniqueKey()].length&&o.push({verbatim:!0,type:"fof-taxonomies",id:t.id(),relationships:{terms:{data:e[t.uniqueKey()].map(_)}}})})),t.relationships=t.relationships||{},t.relationships.taxonomies=o})),Object(u.override)(c.a,"getIdentifier",(function(t,e){return e.verbatim?(delete e.verbatim,e):t(e)})),Object(u.extend)(z.a,"moderationControls",(function(t,e){Object(A.a)(a.a.store.all("fof-taxonomies")).forEach((function(o){t.add("taxonomy"+o.id(),v.a.component({icon:"fas fa-tag",onclick:function(){return a.a.modal.show(new S({discussion:e,taxonomy:o}))}},a.a.translator.trans("fof-taxonomies.forum.discussion.edit",{taxonomy:o.name()})))}))})),Object(u.extend)(H.a.prototype,"viewItems",(function(t){Object(A.a)(a.a.store.all("fof-taxonomies")).forEach((function(e){e.showFilter()&&t.add(e.uniqueKey(),W.component({taxonomy:e,term:X.find((function(t){return t.taxonomy()===e})),onchange:function(t){var e=X.indexOf(t);-1===e?(X=X.filter((function(e){return e.taxonomy()!==t.taxonomy()}))).push(t):X.splice(e,1),a.a.cache.discussionList.refresh()}}))}))})),Object(u.extend)(V.a.prototype,"requestParams",(function(t){X.forEach((function(e){t.filter.q=(t.filter.q||"")+" taxonomy:"+e.taxonomy().slug()+":"+e.slug()}))})),Object(u.extend)(Z.a.prototype,"infoItems",(function(t){var e=this.props.discussion.taxonomyTerms();e&&e.length&&t.add("taxonomies",P(e),10)})),Object(u.extend)(et.a.prototype,"items",(function(t){var e=this.props.discussion.taxonomyTerms();e&&e.length&&t.add("taxonomies",P(e,{link:!0}),5)})),Object(ot.a)(),s.a.prototype.taxonomyTerms=c.a.hasMany("taxonomyTerms")}))}]);
//# sourceMappingURL=forum.js.map
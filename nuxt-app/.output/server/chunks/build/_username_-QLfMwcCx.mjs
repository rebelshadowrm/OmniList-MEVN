import { a as useRoute$1, C as ClientOnly } from '../virtual/entry.mjs';
import { defineComponent, computed, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import '@vue/shared';
import 'pinia';
import 'unhead/utils';

//#region app/pages/profile/[username].vue?vue&type=script&setup=true&lang.ts
var _username__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[username]",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute$1();
		computed(() => `${route.params.username ?? ""}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(ClientOnly, _attrs, {}, _parent));
		};
	}
});
//#endregion
//#region app/pages/profile/[username].vue
var _sfc_setup = _username__vue_vue_type_script_setup_true_lang_default.setup;
_username__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/[username].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _username__default = _username__vue_vue_type_script_setup_true_lang_default;

export { _username__default as default };
//# sourceMappingURL=_username_-QLfMwcCx.mjs.map

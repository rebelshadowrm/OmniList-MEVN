import { d as defineNuxtRouteMiddleware, $ as $fetch$2, u as useRequestFetch, e as executeAsync, n as navigateTo } from '../virtual/entry.mjs';
import { defineStore } from 'pinia';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue';
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
import 'vue/server-renderer';
import 'devalue';
import 'vue-router';
import '@vue/shared';
import 'unhead/utils';

//#region app/stores/session.ts
var pendingSession = null;
var useSessionStore = defineStore("session", {
	state: () => ({
		user: null,
		accessToken: null,
		status: "idle",
		error: ""
	}),
	getters: { isLoggedIn: (state) => !!state.user },
	actions: {
		async initialize(force = false) {
			if (this.status === "ready" && !force) return this.user;
			if (pendingSession && !force) return pendingSession;
			this.status = "loading";
			this.error = "";
			pendingSession = (async () => {
				try {
					const session = await useRequestFetch()("/api/auth/session", { credentials: "include" });
					this.user = session?.user ?? null;
					this.accessToken = session?.accessToken ?? null;
					this.status = "ready";
					return this.user;
				} catch (error) {
					this.user = null;
					this.accessToken = null;
					this.status = "error";
					this.error = error instanceof Error ? error.message : "Session bootstrap failed.";
					return null;
				} finally {
					pendingSession = null;
				}
			})();
			return pendingSession;
		},
		async login(payload) {
			this.status = "loading";
			this.error = "";
			try {
				await $fetch$2("/api/login", {
					method: "POST",
					body: payload,
					credentials: "include"
				});
				await this.initialize(true);
				return {
					ok: true,
					message: ""
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : "Login failed.";
				this.status = "error";
				this.error = message;
				return {
					ok: false,
					message
				};
			}
		},
		async logout() {
			try {
				await $fetch$2("/api/auth/session", {
					method: "DELETE",
					credentials: "include"
				});
			} finally {
				this.user = null;
				this.accessToken = null;
				this.status = "ready";
				this.error = "";
			}
		}
	}
});
//#endregion
//#region app/middleware/auth.ts
var auth_default = defineNuxtRouteMiddleware(async () => {
	let __temp, __restore;
	const session = useSessionStore();
	[__temp, __restore] = executeAsync(() => session.initialize()), await __temp, __restore();
	if (!session.isLoggedIn) return navigateTo("/login");
});

export { auth_default as default };
//# sourceMappingURL=auth-CDAKK7AI.mjs.map

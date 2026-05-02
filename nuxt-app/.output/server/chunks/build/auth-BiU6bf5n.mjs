import { A as executeAsync } from '../_/nitro.mjs';
import { h as defineNuxtRouteMiddleware, n as navigateTo, g as useRequestFetch } from './server.mjs';
import { defineStore } from 'pinia';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';

let pendingSession = null;
const useSessionStore = defineStore("session", {
  state: () => ({
    user: null,
    accessToken: null,
    status: "idle",
    error: ""
  }),
  getters: {
    isLoggedIn: (state) => !!state.user
  },
  actions: {
    async initialize(force = false) {
      if (this.status === "ready" && !force) {
        return this.user;
      }
      if (pendingSession && !force) {
        return pendingSession;
      }
      this.status = "loading";
      this.error = "";
      pendingSession = (async () => {
        try {
          const requestFetch = true ? useRequestFetch() : $fetch;
          const session = await requestFetch("/api/auth/session", {
            credentials: "include"
          });
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
        await $fetch("/api/login", {
          method: "POST",
          body: payload,
          credentials: "include"
        });
        await this.initialize(true);
        return { ok: true, message: "" };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed.";
        this.status = "error";
        this.error = message;
        return { ok: false, message };
      }
    },
    async logout() {
      try {
        await $fetch("/api/auth/session", {
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
const auth = defineNuxtRouteMiddleware(async () => {
  let __temp, __restore;
  const session = useSessionStore();
  [__temp, __restore] = executeAsync(() => session.initialize()), await __temp, __restore();
  if (!session.isLoggedIn) {
    return navigateTo("/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-BiU6bf5n.mjs.map

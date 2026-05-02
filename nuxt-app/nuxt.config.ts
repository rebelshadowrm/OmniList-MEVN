import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-25',
  srcDir: 'app/',
  modules: ['@pinia/nuxt'],
  devtools: {
    enabled: true,
  },
  css: ['~/assets/styles/app.css'],
  alias: {
    '@omni/shared': fileURLToPath(new URL('../client/src', import.meta.url)),
  },
  runtimeConfig: {
    apiProxyTarget: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:5000',
  },
  app: {
    head: {
      title: 'OmniList Nuxt',
      meta: [
        {
          name: 'description',
          content: 'Nuxt migration shell for OmniList, backed by the existing Express API.',
        },
      ],
      script: [
        {
          src: 'https://kit.fontawesome.com/2261da91cd.js',
          crossorigin: 'anonymous',
          defer: true,
        },
      ],
    },
  },
})

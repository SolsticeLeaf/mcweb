const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  app: {
    pageTransition: false,
    layoutTransition: false,
    head: {
      title: 'MineZone',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: "viewport",
          content: "width=device-width, height=device-height, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"
        },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: 'https://ik.imagekit.io/kiinse/icons/icon.svg?updatedAt=1740170186956' }]
    }
  },
  nitro: {
    compressPublicAssets: true,
  },
  experimental: {
    viewTransition: true,
    renderJsonPayloads: true,
  },
  sourcemap: true,
  compatibilityDate: '2025-01-29',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@nuxtjs/device', '@nuxt/icon', '@nuxt/fonts', '@nuxt/image', 'nuxt-umami', '@nuxtjs/color-mode'],
  icon: {
    serverBundle: {
      collections: ['pixelarticons', 'pixel', 'mdi']
    }
  },
  plugins: ['@/plugins/Vue3Marquee.client.ts'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json' },
      { code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
    ],
    lazy: true,
    langDir: 'locales',
    bundle: {
      optimizeTranslationDirective: false
    },
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'en',
    },
    strategy: 'prefix',
    defaultLocale: 'en',
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'site-color-mode'
  },
  devServer: {
    port: 4440,
  },
  css: ['@/assets/scss/global.scss', '@/assets/scss/screens.scss'],
  umami: {
    id: process.env.UMAMI_ID,
    host: process.env.UMAMI_HOST,
    autoTrack: true,
    enabled: false
  },
  runtimeConfig: {
    public: {
      DATABASE_NAME: process.env.DATABASE_NAME,
      DATABASE_URL: process.env.DATABASE_URL,
      UMAMI_ID: process.env.UMAMI_ID,
      UMAMI_HOST: process.env.UMAMI_HOST,
      DOMAIN: process.env.DOMAIN,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN
    }
  },
})
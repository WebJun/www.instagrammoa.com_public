export default {
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '인스타모아',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '인스타그램 이미지를 편하게 보실 수 있습니다.' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'naver-site-verification', content: '2ef623ffb9a2f3a511e0579b19542f0930ca3b99' },
      { name: 'google-site-verification', content: '6epeyw6_4TJ0aA17XWw9DY5pZDWVSQM0dEFxdIaNU90' },
      { name: 'og:type', content: 'website' },
      { name: 'og:title', content: '인스타모아' },
      { name: 'og:description', content: '인스타그램 이미지를 편하게 보실 수 있습니다.' },
      { name: 'og:image', content: 'https://www.instagrammoa.com/images/68d99ba29cc8.png' },
      { name: 'og:url', content: 'https://www.instagrammoa.com' },
      { name: 'og:site_name', content: 'INSTAMOA' },
      { name: 'instagram:title', content: '인스타모아 공식 인스타그램 계정' },
      { name: 'instagram:domain', content: 'https://www.instagram.com/instamoa_official/' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/36b3ee2d91ed.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~assets/sass/app.css' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'ko'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  router: {
    extendRoutes (routes, resolve) {
      const indexPage = 'pages/index.vue'
      routes.push({
        path: '/:username/',
        component: resolve(__dirname, indexPage)
      })
      routes.push({
        path: '/:username/reels/',
        component: resolve(__dirname, indexPage)
      })
      routes.push({
        path: '/:username/tagged/',
        component: resolve(__dirname, indexPage)
      })
      routes.push({
        path: '/p/:code/',
        component: resolve(__dirname, indexPage)
      })
      routes.push({
        path: '/reel/:code/',
        component: resolve(__dirname, indexPage)
      })
      routes.push({
        path: '/stories/highlights/:time/',
        component: resolve(__dirname, indexPage)
      })
    }
  }
}

const fs = require('fs')

// const webpack = require('webpack')
require('dotenv').config()
const {
  API_BASE_URL,
  BASE_URL,
  // CDN_URL,
  projectNameJa,
  projectNameEn,

  projectFooterJa,
  projectFooterEn,

  projectDescriptionJa,
  projectDescriptionEn,
  projectKeywords,
  ELASTIC_SEARCH_HOST,
  ELASTIC_SEARCH_MAIN_INDEX,
  IIIF_VIEWER_SHOW_FLAG,
  CURATION_VIEW_SHOW_FLAG,
  FACETS_FLAGS,
  FACETS_LABELS,
  SORT_LABELS,
  SEARCH_LABELS,
  GOOGLE_ANALYTICS_ID,
  SHORT_NAME,
  SIMILAR_IMAGES_FLAG,
} = process.env

/* nuxt.config.js */
// `DEPLOY_ENV` が `GH_PAGES` の場合のみ `router.base = '/<repository-name>/'` を追加する
const routerBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
        router: {
          base: '/u-renja/',
        },
      }
    : {}

// path
const baseUrl = process.env.BASE_URL
const baseDir = process.env.BASE_DIR || '/'
const basePath = baseUrl + baseDir

// meta
const lang = 'ja'
const siteName = process.env.projectNameJa
const siteDesc = process.env.projectDescriptionJa
const siteKeywords = process.env.projectKeywords

// images
const iconImages = basePath + 'img/icons/'
const ogpImages = basePath + 'img/ogp/' // cdnPath + 'img/ogp/'

// pwa
const shortName = process.env.SHORT_NAME
const manifestIcon = 'img/icons/icon-512.png'
// const splashscreens = cdnPath + 'img/splashscreens/'

const env = {
  API_BASE_URL,
  BASE_URL,
  // CDN_URL,
  projectNameJa,
  projectNameEn,

  projectFooterJa,
  projectFooterEn,

  projectDescriptionJa,
  projectDescriptionEn,
  projectKeywords,
  ELASTIC_SEARCH_HOST,
  ELASTIC_SEARCH_MAIN_INDEX,
  IIIF_VIEWER_SHOW_FLAG,
  CURATION_VIEW_SHOW_FLAG,
  FACETS_FLAGS,
  FACETS_LABELS,
  SORT_LABELS,
  SEARCH_LABELS,
  GOOGLE_ANALYTICS_ID,
  SHORT_NAME,
  SIMILAR_IMAGES_FLAG,
}

env.db = 'https://static.toyobunko-lab.jp/taishozo'

///

env.bc = true

env.config = {
  default: {
    label: '書名目録',
    index: 'data/index.json',
    to: {
      name: 'search-slug',
    },
    aggs: {
      '分類(1)': {
        // sort: 'name:asc',
        label: '分類(1)',
        value: {},
        key: '分類(1)',
        more: false,
        open: false, // true,
      },
      '分類(2)': {
        // sort: 'name:asc',
        label: '分類(2)',
        value: {},
        key: '分類(2)',
        more: false,
      },
      '分類(3)': {
        // sort: 'name:asc',
        label: '分類(3)',
        value: {},
        key: '分類(3)',
        more: false,
      },
      函册: {
        // sort: 'name:asc',
        label: '函册次',
        value: {},
        key: '函册',
        more: false,
      },
      經番: {
        // sort: 'name:asc',
        label: '經番',
        value: {},
        key: '經番',
        more: false,
      },
      譯著者_facet: {
        // sort: 'name:asc',
        label: '譯著者',
        value: {},
        key: '譯著者_facet',
        more: false,
      },
      版式: {
        // sort: 'name:asc',
        label: '版式',
        value: {},
        key: '版式',
        more: false,
      },
      大正藏採録種別: {
        // sort: 'name:asc',
        label: '大正藏採録種別',
        value: {},
        key: '大正藏採録種別',
        more: false,
      },
      画像有無: {
        // sort: 'name:asc',
        label: '画像有無',
        value: {},
        key: '画像有無',
        more: false,
        open: true,
      },
      通番: {
        // sort: 'name:asc',
        label: '通番',
        value: {},
        key: '通番',
        more: false,
        hide: true,
        type: 'number',
      },
    },
    // sort: [{ label: '適合度', value: '_score' }],
    sort: [{ label: '通番', value: '通番' }],
    defaultSort: '通番:asc',
    layout: [
      {
        label: 'table',
        value: 'table',
        icon: 'mdi-table',
        component: 'custom-search-layout-table',
      },
      {
        label: 'graph',
        value: 'graph',
        icon: 'mdi-chart-bar',
        component: 'search-layout-graph',
      },
    ],
    defaultLayout: 'table',
    advanced: [],
    itemPerPages: [20, 50, 100, 500],
    defaultItemPerPage: 20,
  },
  person: {
    label: '人名検索',
    index: 'data/person.json',
    to: {
      name: 'search-slug',
      params: { slug: 'person' },
    },
    aggs: {
      file: {
        // sort: 'name:asc',
        label: 'file',
        value: {},
        key: 'file',
        more: false,
      },
    },
    sort: [
      { label: '適合度', value: '_score' },
      { label: 'label', value: 'label' },
    ],
    defaultSort: '_score:desc',
    layout: [
      {
        label: 'list',
        value: 'list',
        icon: 'mdi-table',
        component: 'search-layout-list',
      },
      {
        label: 'table',
        value: 'grid',
        icon: 'mdi-table',
        component: 'search-layout-grid',
      },
      {
        label: 'graph',
        value: 'graph',
        icon: 'mdi-chart-bar',
        component: 'search-layout-graph',
      },
    ],
    defaultLayout: 'list',
    advanced: [],
    itemPerPages: [20, 50, 100, 500, 1000],
    defaultItemPerPage: 20,
  },
  place: {
    label: '地名検索',
    index: 'data/place.json',
    to: {
      name: 'search-slug',
      params: { slug: 'place' },
    },
    aggs: {
      file: {
        // sort: 'name:asc',
        label: 'file',
        value: {},
        key: 'file',
        more: false,
      },
    },
    sort: [
      { label: '適合度', value: '_score' },
      { label: 'label', value: 'label' },
    ],
    defaultSort: '_score:desc',
    layout: [
      {
        label: 'list',
        value: 'list',
        icon: 'mdi-table',
        component: 'search-layout-list',
      },
      {
        label: 'table',
        value: 'grid',
        icon: 'mdi-table',
        component: 'search-layout-grid',
      },
      {
        label: 'graph',
        value: 'graph',
        icon: 'mdi-chart-bar',
        component: 'search-layout-graph',
      },
    ],
    defaultLayout: 'list',
    advanced: [],
    itemPerPages: [20, 50, 100, 500, 1000],
    defaultItemPerPage: 20,
  },
}

env.hide = []

env.list = []

env.advanced = []

const norm = JSON.parse(fs.readFileSync('static/data/norm.json'))
env.itaiji = norm

///

module.exports = {
  server: {
    port: 8008, // デフォルト: 3000
    host: '0.0.0.0', // デフォルト: localhost
  },
  ...routerBase,
  env,
  // serverMiddleware: ['~~/api/'],
  workbox: {
    runtimeCaching: [
      {
        urlPattern: baseDir + '.*',
        handler: 'staleWhileRevalidate',
        strategyOptions: {
          cacheName: 'my-cache',
          cacheExpiration: {
            maxAgeSeconds: 24 * 60 * 60 * 30,
          },
        },
      },
    ],
  },
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true,
  },
  // mode: 'universal',
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#',
      lang,
    },
    titleTemplate: `%s - ${siteName}`,
    // title: 'Cultural Japan',
    meta: [
      { chatset: 'utf-8' },
      { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'format-detection',
        content: 'telephone=no, email=no, address=no',
      },
      // SEO関連
      { hid: 'description', name: 'description', content: siteDesc },
      { hid: 'keywords', name: 'keywords', content: siteKeywords },
      // ogp関連
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: siteName,
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: basePath },
      { hid: 'og:title', property: 'og:title', content: siteName },
      {
        hid: 'og:description',
        property: 'og:description',
        content: siteDesc,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${ogpImages}home.png`,
      },
      /*
      {
        hid: 'og:locale',
        property: 'og:locale',
        content: 'ja_JP'
      }
      */
      { name: 'twitter:card', content: 'summary_large_image' },
      // pwa iOS
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    ],
    link: [
      {
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
        href: iconImages + 'favicon-16.png',
      },
      {
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
        href: iconImages + 'favicon-32.png',
      },
      {
        rel: 'icon',
        sizes: '48x48',
        type: 'image/png',
        href: iconImages + 'favicon-48.png',
      },
      {
        rel: 'icon',
        sizes: '72x72',
        type: 'image/png',
        href: iconImages + 'favicon-72.png',
      },
      // apple touch icon
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: iconImages + 'apple-touch-icon.png',
      },
    ],
  },
  manifest: {
    lang,
    name: siteName,
    short_name: shortName,
    description: siteDesc,
    background_color: '#ffffff',
    theme_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
  },
  icon: {
    iconFileName: manifestIcon,
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#E64A19', height: '5px' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/utils.ts',
    '@/plugins/searchUtils.ts',
    '@/plugins/indexUtils.ts',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    '@nuxtjs/vuetify',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'nuxt-i18n',
    '@nuxtjs/sitemap',
    'nuxt-leaflet',
    // ['@nuxtjs/moment', ['ja', 'en']],
    '@nuxtjs/moment',
    '@nuxtjs/google-gtag',
  ],
  'google-gtag': {
    id: 'G-Y59NLBLGYC',
    debug: true, // Enable to track in dev mode.
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en_US', file: 'en.json' },
      { code: 'ja', iso: 'ja_JP', file: 'ja.json' },
    ],
    defaultLocale: 'ja',
    vueI18nLoader: true,
    lazy: true,
    langDir: 'lang/',
    // strategy: 'no_prefix'
  },
  sitemap: {
    path: '/sitemap.xml',
    hostname: baseUrl,
    // generate: true,
    exclude: ['/admin', '/test*', '/en/test*'],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    },
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line
    extend(config, ctx) {}
  },
}

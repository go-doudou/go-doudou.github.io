import { defineUserConfig } from '@vuepress/cli'
import type { DefaultThemeOptions } from '@vuepress/theme-default'
import { path } from '@vuepress/utils'
import { navbar, sidebar } from './configs'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig<DefaultThemeOptions>({
  base: '/',

  head: [[
    'link',
    {
      rel: 'icon',
      type: 'image/x-icon',
      sizes: '32x32',
      href: `/favicon.ico`,
    },
  ],
  ['meta', { name: 'keywords', content: 'microservice,service discovery,load balancing,circuit breaker,rate limit' }],
  ['meta', { name: 'description', content: 'go-doudou is a lightweight golang microservice framework. It supports monolith service application as well. Starts from golang interface, no need to learn new IDL(interface definition language). Built-in SWIM gossip protocol based service register and discovery mechanism to help you build a robust, scalable and decentralized service cluster. Powerful code generator cli built-in. After defining your interface methods, your only job is implementing your awesome idea. Built-in service governance support including client-side load balancer, rate limiter, circuit breaker, bulkhead, timeout, retry and more.' }]
],

  locales: {
    "/": {
      lang: "en-US",
      title: "go-doudou",
      description: "Lightweight Golang Microservice Development Framework",
    }
  },

  themeConfig: {
    repo: "https://github.com/unionj-cloud/go-doudou",
    logo: "/logo.png",
    // theme-level locales config
    locales: {
      /**
       * English locale config
       *
       * As the default locale of @vuepress/theme-default is English,
       * we don't need to set all of the locale fields
       */
      '/': {
        // navbar
        navbar: navbar.en,

        // sidebar
        sidebar: sidebar.en,

        // page meta
        editLinkText: 'Edit this page on GitHub',
      },

      /**
       * Chinese locale config
       */
      '/zh/': {
        // navbar
        navbar: navbar.zh,
        selectLanguageName: '????????????',
        selectLanguageText: '????????????',
        selectLanguageAriaLabel: '????????????',

        // sidebar
        sidebar: sidebar.zh,

        // page meta
        editLinkText: '??? GitHub ???????????????',
        lastUpdatedText: '????????????',
        contributorsText: '?????????',

        // custom containers
        tip: '??????',
        warning: '??????',
        danger: '??????',

        // 404 page
        notFound: [
          '?????????????????????',
          '???????????????????????????',
          '???????????? 404 ??????',
          '???????????????????????????????????????',
        ],
        backToHome: '????????????',

        // a11y
        openInNewWindow: '??????????????????',
        toggleDarkMode: '??????????????????',
        toggleSidebar: '???????????????',
      },
    },

    themePlugins: {
      // only enable git plugin in production mode
      git: isProd,
      // use shiki plugin in production mode instead
      prismjs: !isProd,
    },
  },

  markdown: {
    importCode: {
      handleImportPath: (str) =>
        str.replace(
          /^@vuepress/,
          path.resolve(__dirname, '../../packages/@vuepress')
        ),
    },
  },

  plugins: [
    [
      '@vuepress/plugin-google-analytics',
      {
        // we have multiple deployments, which would use different id
        id: "G-Q6WSSDRZKG",
      },
    ],
    [
      '@vuepress/plugin-register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],
    // only enable shiki plugin in production mode
    [
      '@vuepress/plugin-shiki',
      isProd
        ? {
          theme: 'dark-plus',
        }
        : false,
    ],
  ],
})

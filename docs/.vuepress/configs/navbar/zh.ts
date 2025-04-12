import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta'

export const zh: NavbarConfig = [
  {
    text: '指南',
    link: '/zh/guide/',
  },
  {
    text: '资源',
    link: '/zh/resources/',
  },
  {
    text: '博客',
    link: '/zh/blog/',
  },
  {
    text: '贡献',
    link: '/zh/contribution/',
  },
  {
    text: `Release Notes`,
    link: 'https://github.com/unionj-cloud/go-doudou/releases',
  },
  {
    text: `English`,
    link: '/',
  },
]

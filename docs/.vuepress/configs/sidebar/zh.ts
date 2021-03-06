import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
  '/zh/guide/': [
    {
      text: '指南',
      children: [
        '/zh/guide/README.md',
        '/zh/guide/getting-started.md',
        '/zh/guide/idl.md',
        '/zh/guide/cli.md',
        '/zh/guide/generation.md',
        '/zh/guide/rest.md',
        '/zh/guide/configuration.md',
        '/zh/guide/deployment.md',
      ],
    },
  ],
}

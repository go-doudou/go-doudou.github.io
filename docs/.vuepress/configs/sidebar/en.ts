import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/guide/': [
    {
      text: 'Guide',
      children: [
        '/guide/README.md',
        '/guide/getting-started.md',
        '/guide/idl.md',
        '/guide/cli.md',
        '/guide/generation.md',
        '/guide/rest.md',
        '/guide/grpc.md',
        '/guide/configuration.md',
        '/guide/deployment.md',
      ],
    },
  ],
  '/blog/': [
    {
      text: 'Blog',
      children: [
        '/blog/README.md',
        '/blog/memberlist.md',
        '/blog/pm2.md',
        '/blog/enum.md',
        '/blog/annotation.md',
        '/blog/v2.0.5.md',
        '/blog/go_doudou_dubbo_go.md',
        '/blog/gormgen.md',
        '/blog/cli-commands.md',
      ],
    },
  ],
}

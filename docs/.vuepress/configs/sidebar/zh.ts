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
        '/zh/guide/grpc.md',
        '/zh/guide/configuration.md',
        '/zh/guide/deployment.md',
      ],
    },
  ],
  '/zh/blog/': [
    {
      text: '博客',
      children: [
        '/zh/blog/README.md',
        '/zh/blog/memberlist.md',
        '/zh/blog/pm2.md',
        '/zh/blog/enum.md',
        '/zh/blog/annotation.md',
        '/zh/blog/v2.0.5.md',
        '/zh/blog/go_doudou_dubbo_go.md',
        '/zh/blog/gormgen.md',
        '/zh/blog/cli-commands.md',
        '/zh/blog/plugin-mechanism.md',
        '/zh/blog/go-doudou-microkernel-app.md',
      ],
    },
  ],
}

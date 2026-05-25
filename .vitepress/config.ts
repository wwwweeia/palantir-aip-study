import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  base: '/palantir-aip-study/',
  lang: 'zh-CN',
  title: 'Palantir AIP 研究',
  description: '从 Ontology 到 FDE 到企业 AI 落地的方法论研究 · 方法论借鉴，非产品推销',

  // 获取 git 提交时间显示最后更新
  lastUpdated: true,

  // 现有笔记中有相对链接，暂不做死链检查
  ignoreDeadLinks: true,

  head: [
    ['meta', { name: 'theme-color', content: '#3451b2' }],
    ['meta', { property: 'og:title', content: 'Palantir AIP 研究' }],
    ['meta', { property: 'og:description', content: '方法论借鉴，非产品推销' }],
  ],

  markdown: {
    lineNumbers: false,
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '学习笔记',
        items: [
          { text: '① Ontology 底层模型', link: '/01-palantir-aip-ontology' },
          { text: '② FDE 落地角色', link: '/02-fde-forward-deployed-engineer' },
          { text: '③ 企业 AI 落地', link: '/03-enterprise-ai-landing' },
          { text: '④ 国产化落地行动指南', link: '/04-action-guide-domestic-ai' },
          { text: '⑤ Ontology 工程落地模式', link: '/05-ontology-engineering-patterns' },
          { text: '⑥ UModel 开源语义运行时', link: '/06-umodel-alibaba-semantic-runtime' },
          { text: '碎片洞察', link: '/99-notes-and-insights' },
        ],
      },
    ],

    sidebar: [
      {
        text: '研究前提',
        items: [
          { text: '学习路径总览', link: '/README' },
        ],
      },
      {
        text: '第一阶段：理解底层模型',
        items: [
          { text: 'Palantir Ontology 深析', link: '/01-palantir-aip-ontology' },
        ],
      },
      {
        text: '第二阶段：理解落地角色',
        items: [
          { text: 'FDE 是谁、怎么工作、为什么有效', link: '/02-fde-forward-deployed-engineer' },
        ],
      },
      {
        text: '第三阶段：从理论到落地',
        items: [
          { text: '企业 AI 落地方法论', link: '/03-enterprise-ai-landing' },
        ],
      },
      {
        text: '第四阶段：收束与行动',
        items: [
          { text: '国产化 AI 落地行动指南', link: '/04-action-guide-domestic-ai' },
        ],
      },
      {
        text: '第五阶段：工程化实施模式',
        items: [
          { text: 'Ontology 工程落地模式', link: '/05-ontology-engineering-patterns' },
        ],
      },
      {
        text: '第六阶段：开源实现参考',
        items: [
          { text: 'UModel 阿里开源语义运行时', link: '/06-umodel-alibaba-semantic-runtime' },
        ],
      },
      {
        text: '附录',
        items: [
          { text: '碎片洞察与追问记录', link: '/99-notes-and-insights' },
        ],
      },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    editLink: {
      pattern: 'https://github.com/wwwweeia/palantir-aip-study/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },

    footer: {
      message: '方法论借鉴研究，非商业用途 · Palantir 不进中国市场，本研究目的是借鉴其方法论',
      copyright: '© 2026 阿威',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wwwweeia/palantir-aip-study' },
    ],

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
}))

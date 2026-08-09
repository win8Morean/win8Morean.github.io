# w1n8 Blog

这是 w1n8 的个人博客，记录 Web 安全、CTF、学习笔记和日常折腾。

## 技术栈

- Nuxt 4 + Vue 3 + TypeScript
- Nuxt Content v3 管理 Markdown 内容
- Nuxt SEO、Nuxt Image、Shiki
- Twikoo 评论系统
- pnpm + ESLint + Stylelint

## 目录

```text
.
├── app                 # 页面、组件、组合式函数和样式
├── content             # Markdown 文章、杂谈和友链说明
├── public               # 静态图片、字体和订阅源样式
├── server               # Atom、OPML 和统计接口
├── shared               # 前后端共用工具
├── scripts              # 新建文章和友链检查脚本
├── blog.config.ts       # 站点信息和博客功能配置
├── content.config.ts    # 内容集合和 Front Matter 校验
└── nuxt.config.ts       # Nuxt、构建和路由配置
```

## 开发

环境要求：Node.js 22.5+，pnpm 10+。

```sh
pnpm install
pnpm dev
```

常用命令：

```sh
pnpm new              # 新建文章
pnpm lint             # ESLint 和 Stylelint
pnpm build            # 构建 Nuxt 应用
pnpm generate         # 生成静态站点
pnpm preview          # 预览构建结果
pnpm check:feed       # 检查一个友链或订阅源
```

## 写文章

正式文章放在 `content/posts/年份/`，短记录放在 `content/chatters/`。文件名可以使用中文，文章 Front Matter 至少应包含标题、描述、日期和分类：

```yaml
---
title: 文章标题
description: 文章摘要
date: 2026-08-08
updated: 2026-08-08
categories: [Practice]
tags: [Web]
type: tech
---
```

分类、作者、域名、评论服务和页脚信息统一在 `blog.config.ts` 与 `app/app.config.ts` 中维护。

## 部署

当前项目使用静态生成：

```sh
pnpm generate
```

将 `dist` 目录部署到静态托管平台即可。部署前检查 `blog.config.ts` 中的域名、头像、邮箱和 Twikoo 地址，并确认图片路径能够正常访问。

## 许可证

- 项目代码：MIT，见 [LICENSE](LICENSE)。
- 博客文章：CC BY-NC-SA 4.0，见 [LICENCE-CC-BY-NC-SA](LICENCE-CC-BY-NC-SA)。

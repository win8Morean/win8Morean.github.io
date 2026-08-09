import type { FeedEntry } from './app/types/feed'

const basicConfig = {
	title: 'w1n8',
	subtitle: 'Web Security',
	// 长 description 利好于 SEO
	description: '记录 Web 安全、CTF、学习笔记和日常折腾。',
	author: {
		name: 'w1n8',
		avatar: '/images/tomori.jpg',
		email: 'zyx20070827@163.com',
		homepage: 'https://w1n8.cc/',
	},
	copyright: {
		abbr: 'CC BY-NC-SA 4.0',
		name: '署名-非商业性使用-相同方式共享 4.0 国际',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
	},
	favicon: '/images/tomori.jpg',
	language: 'zh-CN',
	timeEstablished: '2026-05-12',
	timeZone: 'Asia/Shanghai',
	url: 'https://w1n8.cc/',
	defaultCategory: '未分类',
}

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
// @keep-sorted
const blogConfig = {
	...basicConfig,

	article: {
		categories: {
			[basicConfig.defaultCategory]: { icon: 'tabler:circle-dashed' },
			/** 练习、复现、靶场与日常实战记录 */
			Practice: { icon: 'tabler:flask', color: '#33aaff' },
			/** Web 开发、页面、后端与站点实现 */
			Web: { icon: 'tabler:world-www', color: '#7777ff' },
			/** AI 工具、模型和工作流 */
			AI: { icon: 'tabler:brain', color: '#ff7733' },
			/** 自动化、知识库、生产力工作流 */
			Workflow: { icon: 'tabler:route', color: '#33bbaa' },
			/** 随笔、记录和阶段性总结 */
			Journal: { icon: 'tabler:book', color: '#ff7777' },
		},
		/** 文章版式，首个为默认版式 */
		types: {
			tech: {},
			story: {},
		},
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			// title: '标题',
		},
		/** 使用 pnpm new 新建文章时自动生成自定义链接（permalink/abbrlink） */
		useRandomPremalink: false,
		/** 隐藏基于文件路由（不是自定义链接）的 URL /post 路径前缀 */
		hidePostPrefix: true,
		/** 禁止搜索引擎收录的路径 */
		robotsNotIndex: [],
	},

	/** 博客 Atom 订阅源 */
	feed: {
		/** 订阅源最大文章数量 */
		limit: 50,
		/** 订阅源是否启用XSLT样式 */
		enableStyle: true,
	},

	/** 向 <head> 中添加脚本 */
	scripts: [
		{ src: 'https://cdn.jsdelivr.net/npm/twikoo@1.7.15/dist/twikoo.min.js', defer: true },
	],

	/** 自己部署的 Twikoo 服务 */
	twikoo: {
		envId: 'https://comment.w1n8.cc',
		preload: 'https://comment.w1n8.cc',
	},
}

/** 用于生成 OPML 和友链页面配置 */
export const myFeed: FeedEntry = {
	author: blogConfig.author.name,
	sitenick: 'w1n8',
	title: blogConfig.title,
	desc: blogConfig.subtitle || blogConfig.description,
	link: blogConfig.url,
	feed: new URL('/atom.xml', blogConfig.url).toString(),
	icon: blogConfig.favicon,
	avatar: blogConfig.author.avatar,
	archs: ['Nuxt', 'GitHub Pages'],
	date: blogConfig.timeEstablished,
	comment: '这是我自己',
}

export default blogConfig

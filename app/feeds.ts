import type { FeedGroup } from '../app/types/feed'
import { myFeed } from '../blog.config'

export default [
	{
		name: '靶场',
		desc: '在线练习与靶场平台。',
		entries: [
			{
				author: '青岑靶场',
				sitenick: 'CTF 练习',
				title: '青岑CTF',
				desc: 'www.qingcen.net',
				comment: '大学生网安技术交流及学习平台',
				link: 'https://ctf.qingcen.net/',
				icon: '/images/qingcen.jpg',
				avatar: '/images/qingcen.jpg',
				date: '2026-08-08',
			},
		],
	},
	{
		name: '校友',
		desc: '一起学习和记录安全技术的朋友。',
		entries: [
			{
				author: 'tooki',
				sitenick: '大学舍友',
				title: 'tookiのblog',
				desc: 'pwn手',
				comment: '臭迪克',
				link: 'https://tooki-blog.vercel.app/',
				icon: '/images/tooki.jpg',
				avatar: '/images/tooki.jpg',
				date: '2026-08-08',
			},
			{
				author: 'UKY',
				sitenick: '大学舍友',
				title: 'uky的博客',
				desc: 'web手',
				comment: '你卷不过我你信不信',
				link: 'https://www.uky.show/',
				icon: '/images/uky.jpg',
				avatar: '/images/uky.jpg',
				date: '2026-08-08',
			},
		],
	},
	{
		name: '我的站点',
		desc: '当前博客信息。',
		entries: [myFeed],
	},
] satisfies FeedGroup[]

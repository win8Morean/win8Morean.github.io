import { toZonedTemporal } from './time'

export interface StatsEntry {
	posts: number
	words: number
}

export interface CategoryEntry {
	name: string
	posts: number
	children?: CategoryEntry[]
}

export interface BlogStats {
	total: { posts: number, words: number }
	annual: Record<number, StatsEntry>
	categories: CategoryEntry[]
	tags: string[]
}

export interface BlogStatsPost {
	path?: string
	date?: string
	readingTime?: { words: number }
	categories?: string[]
	tags?: string[]
}

export function createEmptyBlogStats(): BlogStats {
	return {
		total: { posts: 0, words: 0 },
		annual: {},
		categories: [],
		tags: [],
	}
}

export function computeBlogStats(posts: BlogStatsPost[]) {
	const stats = createEmptyBlogStats()
	const existedPath = new Map<string, true>()

	const findOrCreateCategory = (
		name: string,
		tree: CategoryEntry[],
	): CategoryEntry => {
		let category = tree.find(entry => entry.name === name)
		if (!category) {
			category = { name, posts: 0 }
			tree.push(category)
		}
		return category
	}

	for (const post of posts) {
		if (post.path) {
			if (existedPath.has(post.path))
				console.warn('重复路径', post.path)
			existedPath.set(post.path, true)
		}

		const words = post.readingTime?.words ?? 0
		stats.total.posts++
		stats.total.words += words

		try {
			const year = toZonedTemporal(post.date || '').year
			if (!stats.annual[year])
				stats.annual[year] = { posts: 0, words: 0 }

			stats.annual[year].posts++
			stats.annual[year].words += words
		}
		catch {
			// ignore invalid dates
		}

		const categories = post.categories || []
		let currentLevel = stats.categories
		for (const [index, categoryName] of categories.entries()) {
			if (typeof categoryName !== 'string')
				continue

			const category = findOrCreateCategory(categoryName, currentLevel)
			category.posts++

			if (index < categories.length - 1) {
				if (!category.children)
					category.children = []
				currentLevel = category.children
			}
		}

		for (const tag of post.tags || []) {
			if (typeof tag === 'string' && !stats.tags.includes(tag))
				stats.tags.push(tag)
		}
	}

	return stats
}

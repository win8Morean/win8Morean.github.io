import { computeBlogStats } from '~~/shared/utils/stats'

export default defineEventHandler(async (event) => {
	const posts = await queryCollection(event, 'content').all()
	return computeBlogStats(posts)
})

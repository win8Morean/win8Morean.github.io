<script setup lang="ts">
import type { BlogStatsPost } from '~~/shared/utils/stats'
import { computeBlogStats } from '~~/shared/utils/stats'
import { UtilDate } from '#components'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const { data: posts } = await useAsyncData(
	'blog-stats:posts',
	() => queryCollection('content')
		.select('categories', 'date', 'path', 'readingTime', 'tags')
		.all(),
	{ default: () => [] },
)

const stats = computed(() => computeBlogStats(posts.value as BlogStatsPost[]))

const yearlyTip = computed(() => Object
	.entries(stats.value.annual)
	.reverse()
	.map(([year, item]) => `${year}年：${item.posts}篇，${formatNumber(item.words)}字`)
	.join('\n') || '暂无统计数据',
)

const blogStats = [{
	label: '运营时长',
	value: timeElapse(appConfig.timeEstablished),
	tip: `博客于${appConfig.timeEstablished}上线`,
}, {
	label: '上次更新',
	value: () => h(UtilDate, {
		date: runtimeConfig.public.buildTime,
		relative: true,
		tipPrefix: '构建于',
	}),
}, {
	label: '总字数',
	value: computed(() => formatNumber(stats.value.total.words) || '--'),
	tip: yearlyTip,
}]
</script>

<template>
<BlogWidget card title="博客统计">
	<ZDlGroup :items="blogStats" size="small" />
</BlogWidget>
</template>

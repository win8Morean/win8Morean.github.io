<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
	title: '杂谈',
	description: `${appConfig.title} 的短记事和阶段性想法。`,
})

const { data: chatterList } = await useAsyncData(
	'chatters:index',
	() => queryCollection('content')
		.where('stem', 'LIKE', 'chatters/%')
		.order('date', 'DESC')
		.all(),
	{ default: () => [] },
)
</script>

<template>
<template #aside>
	<WidgetBlogStats />
</template>

<div class="mobile-only">
	<BlogHeader to="/" suffix="杂谈" tag="div" />
</div>

<div class="chatter-page">
	<header class="chatter-hero">
		<p class="chatter-kicker">
			CHATTER
		</p>
		<h1>杂谈</h1>
		<p>轻一点、短一点，记录不适合写成长文但值得留下来的片段。</p>
	</header>

	<menu v-if="chatterList.length" class="chatter-list">
		<li v-for="item in chatterList" :key="item.path">
			<article class="chatter-card">
				<div class="chatter-card-head">
					<div>
						<p class="chatter-kicker">
							NOTE
						</p>
						<h2>{{ item.title }}</h2>
					</div>
					<UtilDate v-if="item.date" :date="item.date" format="date" />
				</div>

				<p v-if="item.description" class="chatter-desc">
					{{ item.description }}
				</p>

				<ContentRenderer :value="item" class="chatter-body" />
			</article>
		</li>
	</menu>

	<ZError
		v-else
		icon="line-md:document-list-twotone"
		title="还没有杂谈"
	/>
</div>
</template>

<style lang="scss" scoped>
.chatter-page {
	display: grid;
	gap: 1rem;
	padding: 1rem;
}

.chatter-hero,
.chatter-card {
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	background: linear-gradient(180deg, var(--c-bg-1), var(--c-bg-2));
	box-shadow: var(--box-shadow-1);
}

.chatter-hero {
	padding: 1.2rem;

	h1 {
		margin: 0;
		font-size: 2rem;
		line-height: 1.2;
	}

	p:last-child {
		max-width: 38rem;
		margin-bottom: 0;
		color: var(--c-text-2);
		line-height: 1.7;
	}
}

.chatter-kicker {
	margin: 0 0 0.5rem;
	color: var(--c-primary);
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0;
}

.chatter-list {
	display: grid;
	gap: 1rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.chatter-card {
	padding: 1rem;
}

.chatter-card-head {
	display: flex;
	gap: 1rem;
	align-items: flex-start;
	justify-content: space-between;

	h2 {
		margin: 0;
		font-size: 1.25rem;
	}
}

.chatter-desc {
	color: var(--c-text-2);
	line-height: 1.7;
}

.chatter-body {
	margin-top: 1rem;
	color: var(--c-text-1);
	line-height: 1.8;
}

@media (max-width: $breakpoint-mobile) {
	.chatter-page {
		padding: 0.75rem;
	}

	.chatter-card-head {
		flex-direction: column;
	}
}
</style>

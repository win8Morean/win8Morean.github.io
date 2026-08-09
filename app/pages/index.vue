<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
	title: '文章',
	description: appConfig.description,
	ogImage: appConfig.author.avatar,
})

const { data: articlesRaw } = await useAsyncData('home:posts', () => getArticleIndexOptions(), { default: () => [] })
const { listSorted, sortOrder } = useArticleSort(articlesRaw)
const featuredTrack = useTemplateRef<HTMLElement>('featured-track')
const selectedCategory = ref('')
const coverlessArticlePaths = new Set([
	'/week-1-november',
	'/5月21日刷题',
	'/hackthebox',
	'/litctf2026-partial-wp',
])
const libraryCovers = [
	'/images/bg1.jpg',
	'/images/bg2.jpg',
	'/images/bg3.jpg',
	'/images/bg4.jpg',
	'/images/bg5.jpg',
	'/images/bg6.jpg',
	'/images/writeups.jpg',
	'/images/study.jpg',
	'/images/photos.jpg',
	'/images/uky.jpg',
	'/images/tomori.jpg',
	'/images/tooki.jpg',
]

const categories = computed(() => [...new Set(
	listSorted.value
		.map(article => article.categories?.[0])
		.filter((category): category is string => Boolean(category)),
)])

const featuredArticles = computed(() => {
	const articlesWithCover = listSorted.value.filter(hasCover)
	const recommended = articlesWithCover.filter(article => article.recommend)
	return (recommended.length ? recommended : articlesWithCover).slice(0, 6)
})

const articles = computed(() => listSorted.value.filter(
	article => !selectedCategory.value || article.categories?.[0] === selectedCategory.value,
))
const { page, totalPages, listPaged } = usePagination(articles, { perPage: 10, bindQuery: 'page' })

watch([selectedCategory, sortOrder], () => {
	page.value = 1
})

function scrollFeatured(direction: number) {
	featuredTrack.value?.scrollBy({
		left: direction * featuredTrack.value.clientWidth * 0.72,
		behavior: 'smooth',
	})
}

function getCategory(article: typeof listSorted.value[number]) {
	return article.categories?.[0] || appConfig.defaultCategory
}

function hasCover(article: typeof listSorted.value[number]) {
	return !coverlessArticlePaths.has(article.path)
}

function getCover(article: typeof listSorted.value[number]) {
	if (!hasCover(article))
		return

	const articleIndex = listSorted.value.findIndex(item => item.path === article.path)
	return article.image || libraryCovers[Math.max(articleIndex, 0) % libraryCovers.length]
}
</script>

<template>
<template #aside>
	<WidgetBlogTech />
	<WidgetBlogStats />
</template>

<BlogHeader class="mobile-only" to="/" suffix="文章" tag="div" />

<main class="article-index">
	<section v-if="featuredArticles.length" class="featured-section" aria-labelledby="featured-heading">
		<div class="featured-heading">
			<div>
				<p class="section-label">
					FEATURED POSTS
				</p>
				<h1 id="featured-heading">
					精选文章
				</h1>
			</div>
			<div class="featured-actions">
				<span>横向浏览</span>
				<button aria-label="向前浏览精选文章" title="向前浏览" type="button" @click="scrollFeatured(-1)">
					<Icon name="tabler:chevron-left" />
				</button>
				<button aria-label="向后浏览精选文章" title="向后浏览" type="button" @click="scrollFeatured(1)">
					<Icon name="tabler:chevron-right" />
				</button>
			</div>
		</div>

		<div ref="featured-track" class="featured-track">
			<UtilLink v-for="article in featuredArticles" :key="article.path" :to="article.path" class="featured-card">
				<img :src="getCover(article)" :alt="article.title">
				<div class="featured-card-copy">
					<span>{{ getCategory(article) }}</span>
					<strong>{{ article.title }}</strong>
				</div>
			</UtilLink>
		</div>
	</section>

	<section class="article-section" aria-labelledby="article-list-heading">
		<div class="article-toolbar">
			<h2 id="article-list-heading">
				全部文章
			</h2>
			<div class="article-filters">
				<label>
					<Icon name="tabler:folder" />
					<span class="sr-only">分类</span>
					<select v-model="selectedCategory" aria-label="按分类筛选文章">
						<option value="">
							全部分类
						</option>
						<option v-for="category in categories" :key="category" :value="category">
							{{ category }}
						</option>
					</select>
				</label>
				<label>
					<Icon name="tabler:sort-descending" />
					<span class="sr-only">排序方式</span>
					<select v-model="sortOrder" aria-label="文章排序方式">
						<option value="date">
							创建日期
						</option>
						<option value="updated">
							更新时间
						</option>
					</select>
				</label>
			</div>
		</div>

		<div v-if="listPaged.length" class="article-list">
			<UtilLink
				v-for="article in listPaged"
				:key="article.path"
				:to="article.path"
				class="post-card"
				:class="{ 'has-cover': hasCover(article) }"
				:style="{ '--post-accent': getCategoryColor(getCategory(article)) || 'var(--c-primary)' }"
			>
				<div class="post-card-copy">
					<h3>{{ article.title }}</h3>
					<p>{{ article.description || '这篇文章正在整理摘要。' }}</p>
					<div class="post-meta">
						<UtilDate v-if="article.date" :date="article.date" icon="tabler:calendar" format="date" />
						<span class="post-category">
							<Icon :name="getCategoryIcon(getCategory(article))" />
							{{ getCategory(article) }}
						</span>
						<span v-if="article.readingTime?.words">
							<Icon name="tabler:pilcrow" />
							{{ formatNumber(article.readingTime.words) }} 字
						</span>
					</div>
				</div>
				<img v-if="hasCover(article)" class="post-cover" :src="getCover(article)" :alt="article.title">
			</UtilLink>
		</div>
		<ZPagination
			v-if="totalPages > 1"
			v-model="page"
			:total-pages="totalPages"
			sticky
		/>

		<div v-else class="empty-state">
			<Icon name="tabler:filter-off" />
			<p>这个分类暂时没有文章。</p>
			<button type="button" @click="selectedCategory = ''">
				查看全部文章
			</button>
		</div>
	</section>
</main>
</template>

<style lang="scss" scoped>
.article-index {
	display: grid;
	gap: 1.25rem;
	overflow-x: clip;
	max-width: 100%;
	padding: 1rem;
}

.featured-section,
.article-section {
	display: grid;
	gap: 0.85rem;
}

.featured-heading,
.article-toolbar,
.featured-actions,
.article-filters,
.post-meta,
.post-category,
.empty-state {
	display: flex;
	align-items: center;
}

.featured-heading,
.article-toolbar {
	justify-content: space-between;
	gap: 1rem;
}

.section-label {
	margin: 0 0 0.25rem;
	font-size: 0.72rem;
	font-weight: 800;
	letter-spacing: 0;
	color: var(--c-primary);
}

h1,
h2,
h3,
p {
	margin: 0;
}

h1,
h2,
h3 {
	line-height: 1.2;
}

h1 {
	font-size: 1.9rem;
}

h2 {
	font-size: 1.15rem;
}

.featured-actions,
.article-filters {
	gap: 0.35rem;
}

.featured-actions {
	font-size: 0.78rem;
	color: var(--c-text-3);

	button {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--c-border);
		border-radius: 0.5rem;
		color: var(--c-text-2);

		&:hover {
			border-color: var(--c-primary);
			background-color: var(--c-primary-soft);
			color: var(--c-primary);
		}
	}
}

.featured-track {
	display: flex;
	gap: 0.75rem;
	overflow-x: auto;
	padding: 0.1rem 0 0.65rem;
	scroll-behavior: smooth;
	scroll-snap-type: x mandatory;
	scrollbar-width: thin;
}

.featured-card {
	flex: 0 0 clamp(11rem, 21vw, 15rem);
	position: relative;
	overflow: hidden;
	height: 7rem;
	min-height: 7rem;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	background-color: var(--c-bg-2);
	color: #FFF;
	transition: transform 0.2s, border-color 0.2s;
	scroll-snap-align: start;

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(0deg, rgb(0 0 0 / 75%), transparent 75%);
	}

	&:hover {
		border-color: var(--c-primary);
		transform: translateY(-2px);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.featured-card-copy {
	display: grid;
	gap: 0.2rem;
	position: absolute;
	inset: auto 0 0;
	padding: 0.8rem;
	z-index: 1;

	span {
		font-size: 0.74rem;
		color: rgb(255 255 255 / 75%);
	}

	strong {
		display: -webkit-box;
		overflow: hidden;
		font-size: 1rem;
		-webkit-line-clamp: 2;
		line-height: 1.3;
		-webkit-box-orient: vertical;
	}
}

.article-toolbar {
	padding-top: 0.35rem;
	border-top: 1px solid var(--c-border);
}

.article-filters label {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem 0.4rem;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	background-color: var(--ld-bg-card);
	color: var(--c-text-2);

	&:focus-within {
		border-color: var(--c-primary);
	}
}

select {
	max-width: 8rem;
	border: 0;
	outline: 0;
	background: transparent;
	font: inherit;
	font-size: 0.82rem;
	color: inherit;
	cursor: pointer;
}

.article-list {
	display: grid;
	gap: 0.8rem;
}

.post-card {
	display: grid;
	position: relative;
	overflow: hidden;
	min-height: 7.75rem;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	background-color: var(--ld-bg-card);
	text-decoration: none;
	color: inherit;
	transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
	isolation: isolate;

	&:hover {
		border-color: var(--post-accent);
		box-shadow: var(--box-shadow-2);
		transform: translateY(-2px);
	}
}

.post-card-copy {
	display: grid;
	align-content: center;
	gap: 0.65rem;
	position: relative;
	min-width: 0;
	max-width: 74%;
	padding: 1rem 1.1rem;
	z-index: 2;

	h3 {
		overflow: hidden;
		font-size: 1.2rem;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	p {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		line-height: 1.55;
		color: var(--c-text-2);
		-webkit-box-orient: vertical;
	}
}

.post-card:not(.has-cover) .post-card-copy {
	max-width: none;
}

.post-meta {
	flex-wrap: wrap;
	gap: 0.35rem 0.7rem;
	font-size: 0.78rem;
	color: var(--c-text-3);

	> span,
	:deep(.util-date) {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
}

.post-category {
	color: var(--post-accent);
}

.post-cover {
	position: absolute;
	inset: 0 0 0 auto;
	width: clamp(10rem, 22vw, 12rem);
	height: 100%;
	mask-image: linear-gradient(to right, transparent, #000 48%);
	object-fit: cover;
	z-index: 0;
}

.empty-state {
	flex-direction: column;
	justify-content: center;
	gap: 0.6rem;
	min-height: 12rem;
	border: 1px dashed var(--c-border);
	border-radius: 0.5rem;
	color: var(--c-text-2);

	.iconify {
		font-size: 1.5rem;
		color: var(--c-text-3);
	}

	button {
		padding: 0.35rem 0.55rem;
		border: 1px solid var(--c-border);
		border-radius: 0.5rem;
		color: var(--c-primary);

		&:hover {
			background-color: var(--c-primary-soft);
		}
	}
}

.sr-only {
	position: absolute;
	overflow: hidden;
	width: 1px;
	height: 1px;
	clip-path: inset(50%);
	white-space: nowrap;
}

@media (max-width: $breakpoint-mobile) {
	.article-index {
		gap: 1rem;
		padding: 0.75rem;
	}

	.featured-heading,
	.article-toolbar {
		flex-direction: column;
		align-items: flex-start;
	}

	.featured-actions,
	.article-filters {
		width: 100%;
	}

	.article-filters label {
		flex: 1;
	}

	select {
		width: 100%;
		max-width: none;
	}

	.featured-card {
		flex-basis: min(68vw, 15rem);
	}

	.post-card {
		min-height: 7.25rem;
	}

	.post-card-copy {
		min-height: 7.25rem;
		max-width: calc(100% - 6.8rem);
		padding: 0.85rem 0.95rem;
	}

	.post-cover {
		width: 7.5rem;
	}
}
</style>

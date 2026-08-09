<script setup lang="ts">
const appConfig = useAppConfig()

const { data: articlesRaw } = await useAsyncData('projects:posts', () => getArticleIndexOptions(), { default: () => [] })
const { listSorted } = useArticleSort(articlesRaw)

const projects = computed(() => [
	{
		name: 'w1n8 Blog',
		icon: 'tabler:layout-dashboard',
		status: 'Flagship',
		desc: '用来集中整理题解、Web 安全学习笔记、界面实验和阶段性总结的个人博客。这个站点本身既是展示页，也是长期维护的练习场。',
		tags: ['Nuxt', 'Content', 'Markdown', 'CTF', 'Web Security', 'Blog'],
		liveUrl: appConfig.url,
		repoUrl: 'https://github.com/win8Morean/win8Morean.github.io',
		metrics: [
			{ label: '已迁文章', value: listSorted.value.length.toString() },
			{ label: '内容形态', value: 'Posts / Notes / Photos' },
			{ label: '部署目标', value: 'GitHub Pages' },
		],
	},
])

const buildNotes = [
	{
		icon: 'tabler:layout-dashboard',
		title: '信息架构',
		desc: '把旧站散落在 HTML、JS、data 里的内容收束到 Nuxt 页面和 Nuxt Content。',
	},
	{
		icon: 'tabler:markdown',
		title: '内容迁移',
		desc: '长文迁入 content/posts，短记录迁入 content/chatters，静态图片放进 public。',
	},
	{
		icon: 'tabler:device-desktop-code',
		title: '可维护体验',
		desc: '后续改博客时优先改配置、内容和 Vue 页面，减少旧式 DOM 拼接。',
	},
]

useSeoMeta({
	title: '项目',
	description: 'w1n8 的项目矩阵和博客迁移记录。',
	ogImage: appConfig.author.avatar,
})
</script>

<template>
<template #aside>
	<WidgetBlogStats />
	<WidgetBlogTech />
</template>

<div class="mobile-only">
	<BlogHeader to="/" suffix="项目" tag="div" />
</div>

<div class="projects-page">
	<header class="projects-hero">
		<div>
			<p class="projects-kicker">
				PROJECTS MATRIX
			</p>
			<h1>把博客当成一个长期维护的实验场</h1>
			<p>
				除了发文章，也把页面细节、内容组织和交互体验都当成项目的一部分慢慢打磨。
			</p>
		</div>
		<div class="hero-stats">
			<div>
				<strong>{{ projects.length }}</strong>
				<span>Projects</span>
			</div>
			<div>
				<strong>{{ projects[0]?.tags.length }}</strong>
				<span>Stack Tags</span>
			</div>
		</div>
	</header>

	<section class="project-list">
		<article v-for="project in projects" :key="project.name" class="project-card">
			<div class="project-head">
				<div class="project-mark">
					<Icon :name="project.icon" />
				</div>
				<div>
					<p class="projects-kicker">
						{{ project.status }}
					</p>
					<h2>{{ project.name }}</h2>
				</div>
			</div>

			<p class="project-desc">
				{{ project.desc }}
			</p>

			<div class="project-metrics">
				<div v-for="metric in project.metrics" :key="metric.label">
					<strong>{{ metric.value }}</strong>
					<span>{{ metric.label }}</span>
				</div>
			</div>

			<div class="project-tags">
				<span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
			</div>

			<div class="project-actions">
				<UtilLink :to="project.liveUrl" class="project-button primary">
					<Icon name="tabler:external-link" />
					<span>在线预览</span>
				</UtilLink>
				<UtilLink :to="project.repoUrl" class="project-button">
					<Icon name="tabler:brand-github" />
					<span>查看源码</span>
				</UtilLink>
			</div>
		</article>
	</section>

	<section class="build-notes">
		<div class="section-head">
			<p class="projects-kicker">
				BUILD NOTES
			</p>
			<h2>这次迁移先解决什么</h2>
		</div>
		<div class="note-grid">
			<article v-for="note in buildNotes" :key="note.title" class="note-card">
				<Icon :name="note.icon" />
				<h3>{{ note.title }}</h3>
				<p>{{ note.desc }}</p>
			</article>
		</div>
	</section>
</div>
</template>

<style lang="scss" scoped>
.projects-page {
	display: grid;
	gap: 1rem;
	max-width: 100%;
	overflow-x: clip;
	padding: 1rem;
}

.projects-hero,
.project-card,
.build-notes,
.note-card {
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	background: linear-gradient(180deg, var(--c-bg-1), var(--c-bg-2));
	box-shadow: var(--box-shadow-1);
}

.projects-hero {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 18rem;
	gap: 1rem;
	align-items: center;
	padding: 1.2rem;

	h1 {
		margin: 0;
		font-size: 2rem;
		line-height: 1.2;
	}

	p:last-child {
		max-width: 38rem;
		color: var(--c-text-2);
		line-height: 1.7;
	}
}

.projects-kicker {
	margin: 0 0 0.5rem;
	color: var(--c-primary);
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0;
	text-transform: uppercase;
}

.hero-stats,
.project-metrics {
	display: grid;
	gap: 0.6rem;
}

.hero-stats {
	grid-template-columns: repeat(2, minmax(0, 1fr));

	div {
		padding: 0.8rem;
		border: 1px solid var(--c-border);
		border-radius: 0.5rem;
		background-color: var(--c-bg-a50);
		text-align: center;
	}

	strong,
	span {
		display: block;
	}

	strong {
		font-size: 1.2rem;
	}

	span {
		color: var(--c-text-3);
		font-size: 0.78rem;
	}
}

.project-list {
	display: grid;
	gap: 1rem;
}

.project-card,
.build-notes {
	padding: 1rem;
}

.project-head {
	display: flex;
	gap: 0.8rem;
	align-items: center;

	h2 {
		margin: 0;
		line-height: 1.2;
	}
}

.project-mark {
	display: grid;
	place-items: center;
	width: 3rem;
	aspect-ratio: 1;
	border-radius: 0.5rem;
	background-color: var(--c-primary-soft);
	color: var(--c-primary);
	font-size: 1.5rem;
}

.project-desc,
.note-card p {
	color: var(--c-text-2);
	line-height: 1.7;
}

.project-metrics {
	grid-template-columns: repeat(3, minmax(0, 1fr));
	margin: 1rem 0;

	div {
		padding: 0.7rem;
		border: 1px solid var(--c-border);
		border-radius: 0.5rem;
		background-color: var(--c-bg-a50);
	}

	strong,
	span {
		display: block;
	}

	strong {
		font-size: 0.95rem;
	}

	span {
		color: var(--c-text-3);
		font-size: 0.78rem;
	}
}

.project-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;

	span {
		padding: 0.32rem 0.55rem;
		border-radius: 0.5rem;
		background-color: var(--c-bg-soft);
		color: var(--c-text-2);
		font-size: 0.82rem;
	}
}

.project-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
	margin-top: 1rem;
}

.project-button {
	display: inline-flex;
	gap: 0.35rem;
	align-items: center;
	padding: 0.45rem 0.7rem;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	color: var(--c-text-1);
	text-decoration: none;

	&.primary {
		border-color: var(--c-primary);
		background-color: var(--c-primary-soft);
		color: var(--c-primary);
	}

	&:hover {
		border-color: var(--c-primary);
		color: var(--c-primary);
	}
}

.section-head {
	h2 {
		margin: 0 0 1rem;
		line-height: 1.2;
	}
}

.note-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.8rem;
}

.note-card {
	padding: 1rem;

	.iconify {
		color: var(--c-primary);
		font-size: 1.6rem;
	}

	h3 {
		margin: 0.7rem 0 0;
	}

	p {
		margin-bottom: 0;
	}
}

@media (max-width: $breakpoint-mobile) {
	.projects-page {
		padding: 0.75rem;
	}

	.projects-hero,
	.hero-stats,
	.project-metrics,
	.note-grid {
		grid-template-columns: 1fr;
	}

	.projects-hero h1 {
		font-size: 1.6rem;
	}
}
</style>

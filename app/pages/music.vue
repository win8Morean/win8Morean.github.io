<script setup lang="ts">
const appConfig = useAppConfig()
const playback = useMusicPlayer()

useSeoMeta({
	title: '听点音乐',
	description: `${appConfig.title} 的本地音乐播放列表。`,
	ogImage: appConfig.author.avatar,
})
</script>

<template>
<template #aside>
	<WidgetBlogStats />
	<WidgetBlogTech />
</template>

<div class="mobile-only">
	<BlogHeader to="/" suffix="听点音乐" tag="div" />
</div>

<div class="music-page">
	<header class="music-hero">
		<div>
			<p class="music-kicker">
				MUSIC
			</p>
			<h1>听点音乐</h1>
			<p>写文章、刷题或者发呆的时候，放一首喜欢的歌。</p>
		</div>
		<div class="music-disc" aria-hidden="true">
			<img src="/images/tomori.jpg" alt="">
		</div>
	</header>

	<section class="music-grid">
		<article class="now-playing music-panel">
			<div class="panel-heading">
				<div>
					<p class="music-kicker">
						NOW PLAYING
					</p>
					<h2>{{ playback.title || '等待播放' }}</h2>
				</div>
				<span class="playback-status">
					{{ playback.status === 'playing' ? '播放中' : '未播放' }}
				</span>
			</div>

			<div class="song-info">
				<img :src="playback.cover || '/images/tomori.jpg'" :alt="playback.title || '音乐封面'">
				<div>
					<strong>{{ playback.author || '本地音乐' }}</strong>
					<p>{{ playback.ready ? '使用站内音频文件播放。' : '正在加载播放器...' }}</p>
				</div>
			</div>

			<div v-if="playback.lyric" class="lyric-box">
				<span class="lyric-label">LYRIC</span>
				<p>{{ playback.lyric }}</p>
			</div>
		</article>

		<article class="playlist-panel music-panel">
			<p class="music-kicker">
				PLAYLIST
			</p>
			<h2>我的歌单</h2>
			<p>这五首歌由站内静态文件提供，不依赖网易云接口或外部播放器服务。点击侧栏播放器的列表按钮即可切换歌曲。</p>
		</article>
	</section>
</div>
</template>

<style lang="scss" scoped>
.music-page {
	display: grid;
	gap: 1rem;
	overflow-x: clip;
	max-width: 100%;
	padding: 1rem;
}

.music-hero,
.music-panel {
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	box-shadow: var(--box-shadow-1);
	background-color: var(--ld-bg-card);
}

.music-hero {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 12rem;
	align-items: center;
	gap: 1rem;
	padding: 1.2rem;

	h1 {
		margin: 0;
		font-size: 2rem;
		line-height: 1.2;
	}

	p:last-child {
		max-width: 38rem;
		line-height: 1.7;
		color: var(--c-text-2);
	}
}

.music-kicker {
	margin: 0 0 0.5rem;
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0;
	text-transform: uppercase;
	color: var(--c-primary);
}

.music-disc {
	display: grid;
	place-items: center;
	aspect-ratio: 1;
	border-radius: 50%;
	background:
		radial-gradient(circle at center, var(--c-bg-1) 0 14%, transparent 15%),
		repeating-radial-gradient(circle at center, var(--c-bg-2) 0 0.45rem, var(--c-bg-soft) 0.5rem 0.55rem);

	img {
		width: 44%;
		aspect-ratio: 1;
		border-radius: 50%;
		object-fit: cover;
	}
}

.music-grid {
	display: grid;
	grid-template-columns: minmax(0, 1.5fr) minmax(16rem, 1fr);
	align-items: stretch;
	gap: 1rem;
}

.music-panel {
	padding: 1rem;

	h2 {
		margin: 0;
		line-height: 1.25;
	}

	> p:not(.music-kicker) {
		margin-top: 0.75rem;
		line-height: 1.7;
		color: var(--c-text-2);
	}
}

.panel-heading {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
}

.playback-status {
	flex-shrink: 0;
	padding: 0.2rem 0.45rem;
	border: 1px solid var(--c-border);
	border-radius: 0.3rem;
	font-size: 0.78rem;
	color: var(--c-text-2);
}

.song-info {
	display: flex;
	align-items: center;
	gap: 0.8rem;
	margin-top: 1rem;

	img {
		width: 4rem;
		aspect-ratio: 1;
		border-radius: 0.4rem;
		object-fit: cover;
	}

	p {
		margin-top: 0.25rem;
		font-size: 0.9rem;
		color: var(--c-text-2);
	}
}

.lyric-box {
	min-height: 5rem;
	margin-top: 1rem;
	padding: 0.8rem;
	border-left: 3px solid var(--c-primary);
	background-color: var(--c-bg-2);

	.lyric-label {
		font-size: 0.72rem;
		font-weight: 800;
		color: var(--c-text-3);
	}

	p {
		margin-top: 0.45rem;
		line-height: 1.7;
	}
}

@media (max-width: $breakpoint-mobile) {
	.music-page {
		padding: 0.75rem;
	}

	.music-hero,
	.music-grid {
		grid-template-columns: 1fr;
	}

	.music-hero h1 {
		font-size: 1.6rem;
	}

	.music-disc {
		width: min(12rem, 70vw);
		margin-inline: auto;
	}
}
</style>

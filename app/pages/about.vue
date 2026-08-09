<script setup lang="ts">
const appConfig = useAppConfig()

const socialLinks = [
	{
		icon: 'tabler:brand-github',
		label: 'GitHub',
		account: 'win8Morean',
		href: 'https://github.com/win8Morean',
	},
	{
		icon: 'tabler:mail',
		label: 'Email',
		account: 'zyx20070827@163.com',
		href: 'mailto:zyx20070827@163.com',
	},
	{
		icon: 'tabler:brand-qq',
		label: 'QQ',
		account: '1323546850',
		href: 'https://wpa.qq.com/msgrd?v=3&uin=1323546850&site=qq&menu=yes',
	},
	{
		icon: 'tabler:brand-wechat',
		label: '微信',
		account: 'win8_win8_win8',
		href: 'weixin://dl/chat?win8_win8_win8',
	},
]

useSeoMeta({
	title: '关于',
	description: '关于 w1n8：网安本科生，专注 Web 安全与 CTF。',
	ogImage: appConfig.author.avatar,
})
</script>

<template>
<BlogHeader class="mobile-only" to="/" suffix="关于" tag="div" />

<main class="about-page">
	<header class="profile-header">
		<div class="profile-banner" />
		<div class="profile-intro">
			<img class="profile-avatar" :src="appConfig.author.avatar" :alt="appConfig.author.name">
			<p class="profile-kicker">
				WEB SECURITY · CTF
			</p>
			<h1>w1n8</h1>
			<p class="profile-location">
				网安本科 · 西安
			</p>
			<nav class="social-links" aria-label="社交联系">
				<a
					v-for="item in socialLinks"
					:key="item.label"
					:href="item.href"
					:aria-label="`${item.label}: ${item.account}`"
					:title="`${item.label}: ${item.account}`"
					:target="item.href.startsWith('http') ? '_blank' : undefined"
					:rel="item.href.startsWith('http') ? 'noreferrer' : undefined"
					class="social-link"
				>
					<Icon :name="item.icon" />
					<span class="social-account">{{ item.account }}</span>
				</a>
			</nav>
		</div>
	</header>

	<section class="about-content-card" aria-label="关于 w1n8">
		<ContentDoc path="/about" />
	</section>
</main>
</template>

<style lang="scss" scoped>
.about-page {
	width: min(100%, 52rem);
	margin-inline: auto;
	padding: 1rem;
}

.profile-header,
.about-content-card {
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	box-shadow: var(--box-shadow-1);
	background-color: var(--ld-bg-card);
}

.profile-header {
	overflow: hidden;
	text-align: center;
}

.profile-banner {
	height: clamp(8rem, 22vw, 11rem);
	background:
		linear-gradient(to bottom, transparent 30%, var(--ld-bg-card)),
		url("/images/bg6.jpg") center 44% / cover;
}

.profile-intro {
	display: grid;
	justify-items: center;
	padding: 0 1.25rem 1.35rem;
}

.profile-avatar {
	width: 6.5rem;
	aspect-ratio: 1;
	margin-top: -3.25rem;
	border: 4px solid var(--ld-bg-card);
	border-radius: 50%;
	box-shadow: var(--box-shadow-2);
	background-color: var(--c-bg-2);
	object-fit: cover;
}

.profile-kicker {
	margin: 0.75rem 0 0;
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0;
	color: var(--c-primary);
}

h1 {
	margin: 0.2rem 0 0;
	font-size: 2rem;
	line-height: 1.2;
}

.profile-location {
	margin: 0.25rem 0 0;
	color: var(--c-text-2);
}

.social-links {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5rem;
	margin-top: 1rem;
}

.social-link {
	display: inline-flex;
	align-items: center;
	gap: 0;
	min-height: 2.25rem;
	padding: 0.45rem 0.6rem;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	background-color: var(--c-bg-a50);
	text-decoration: none;
	color: var(--c-text-2);
	transition: border-color 0.2s, background-color 0.2s, color 0.2s;

	.iconify {
		font-size: 1.2rem;
	}

	&:hover,
	&:focus-visible {
		border-color: var(--c-primary);
		background-color: var(--c-primary-soft);
		color: var(--c-primary);

		.social-account {
			opacity: 1;
			max-width: 14rem;
			margin-inline-start: 0.4rem;
		}
	}
}

.social-account {
	overflow: hidden;
	opacity: 0;
	max-width: 0;
	font-size: 0.82rem;
	white-space: nowrap;
	transition: max-width 0.2s, margin 0.2s, opacity 0.2s;
}

.about-content-card {
	margin-top: 1rem;
	padding: clamp(1.1rem, 4vw, 2rem);
}

:deep(h1) {
	font-size: 1.7rem;
}

:deep(h2) {
	margin-top: 2rem;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid var(--c-border);
	font-size: 1.25rem;
}

:deep(p) {
	line-height: 1.8;
	color: var(--c-text-2);
}

:deep(img) {
	display: block;
	width: 100%;
	margin: 1rem 0;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	background-color: var(--c-bg-a50);
}

@media (max-width: $breakpoint-mobile) {
	.about-page {
		padding: 0.75rem;
	}

	.profile-banner {
		height: 8rem;
	}

	.profile-intro {
		padding-inline: 0.8rem;
	}

	.social-links {
		gap: 0.4rem;
	}

	.social-link {
		justify-content: center;
		min-width: 2.25rem;
	}
}
</style>

<script setup lang="ts">
interface Track {
	name: string
	artist: string
	url: string
	cover: string
	lrc?: string
}

interface LyricLine {
	time: number
	text: string
}

const tracks: Track[] = [
	{
		name: 'Come Back To Me',
		artist: '宇多田ヒカル',
		url: '/music/come-back-to-me.mp3',
		cover: '/music/come-back-to-me.jpg',
		lrc: '/music/come-back-to-me.lrc',
	},
	{
		name: 'ブレインロット',
		artist: '東京真中, 重音テト',
		url: '/music/brainrot.mp3',
		cover: '/music/brainrot.jpg',
		lrc: '/music/brainrot.lrc',
	},
	{
		name: '老人と海',
		artist: 'ヨルシカ',
		url: '/music/the-old-man-and-the-sea.mp3',
		cover: '/music/the-old-man-and-the-sea.jpg',
		lrc: '/music/the-old-man-and-the-sea.lrc',
	},
	{
		name: '五月は花緑青の窓辺から',
		artist: 'ヨルシカ',
		url: '/music/may-green-window.mp3',
		cover: '/music/may-green-window.jpg',
		lrc: '/music/may-green-window.lrc',
	},
	{
		name: '又三郎',
		artist: 'ヨルシカ',
		url: '/music/matasaburo.mp3',
		cover: '/music/matasaburo.jpg',
		lrc: '/music/matasaburo.lrc',
	},
]

const playback = useMusicPlayer()
const showList = ref(false)

let audio: HTMLAudioElement | undefined
let lyricLines: LyricLine[] = []
let lyricRequest = 0

const progress = computed(() => playback.value.duration
	? (playback.value.currentTime / playback.value.duration) * 100
	: 0)

function formatTime(seconds: number) {
	if (!Number.isFinite(seconds) || seconds < 0)
		return '0:00'
	const minutes = Math.floor(seconds / 60)
	const remainder = Math.floor(seconds % 60).toString().padStart(2, '0')
	return `${minutes}:${remainder}`
}

function parseLrc(source: string) {
	return source
		.split(/\r?\n/)
		.flatMap((line) => {
			const text = line.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g, '').trim()
			return [...line.matchAll(/\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\]/g)]
				.map(([, minutes, seconds]) => ({
					time: Number(minutes) * 60 + Number(seconds),
					text,
				}))
				.filter(line => line.text)
		})
		.sort((first, second) => first.time - second.time)
}

function getCurrentLyric(currentTime: number) {
	let current = ''
	for (const line of lyricLines) {
		if (line.time > currentTime)
			break
		current = line.text
	}
	return current
}

async function loadLyrics(track: Track) {
	const request = ++lyricRequest
	lyricLines = []
	playback.value.lyric = ''
	if (!track.lrc)
		return

	try {
		const response = await fetch(track.lrc)
		if (!response.ok)
			throw new Error(`Unable to load lyrics: ${response.status}`)
		const source = await response.text()
		if (request !== lyricRequest)
			return
		lyricLines = parseLrc(source)
		syncPlayback()
	}
	catch (error) {
		if (request === lyricRequest)
			console.warn('[music-player] 无法加载歌词', error)
	}
}

function syncPlayback() {
	if (!audio)
		return

	const track = tracks[playback.value.index]
	playback.value = {
		...playback.value,
		status: audio.paused ? 'paused' : 'playing',
		title: track?.name || '',
		author: track?.artist || '',
		cover: track?.cover || '',
		lyric: getCurrentLyric(audio.currentTime),
		currentTime: audio.currentTime || 0,
		duration: Number.isFinite(audio.duration) ? audio.duration : 0,
		songs: tracks.map(track => ({
			name: track.name,
			artist: track.artist,
			cover: track.cover,
		})),
	}
}

async function play() {
	if (!audio)
		return

	try {
		await audio.play()
	}
	catch (error) {
		console.error('[music-player] 无法开始播放', error)
	}
}

function selectTrack(index: number, autoplay = false) {
	if (!audio || !tracks[index])
		return

	playback.value.index = index
	audio.src = tracks[index].url
	audio.load()
	void loadLyrics(tracks[index])
	syncPlayback()

	if (autoplay)
		void play()
}

function togglePlayback() {
	if (!audio)
		return
	if (audio.paused)
		void play()
	else
		audio.pause()
}

function skipBack() {
	const nextIndex = playback.value.index <= 0 ? tracks.length - 1 : playback.value.index - 1
	selectTrack(nextIndex, true)
}

function skipForward() {
	const nextIndex = playback.value.index >= tracks.length - 1 ? 0 : playback.value.index + 1
	selectTrack(nextIndex, true)
}

function seek(event: Event) {
	if (!audio || !playback.value.duration)
		return
	const value = Number((event.target as HTMLInputElement).value)
	audio.currentTime = (value / 100) * playback.value.duration
}

function switchSong(index: number) {
	selectTrack(index, true)
	showList.value = false
}

onMounted(() => {
	audio = new Audio()
	audio.preload = 'metadata'
	for (const event of ['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange'])
		audio.addEventListener(event, syncPlayback)
	audio.addEventListener('ended', skipForward)

	playback.value = {
		...playback.value,
		ready: true,
		lyric: '',
		index: 0,
	}
	selectTrack(0)
})

onBeforeUnmount(() => {
	if (!audio)
		return
	audio.pause()
	audio.src = ''
	audio.load()
})
</script>

<template>
<ClientOnly>
	<section class="music-card" aria-label="音乐播放器">
		<div class="music-card-main">
			<img class="music-cover" :src="playback.cover || '/images/tomori.jpg'" :alt="playback.title || '音乐封面'">
			<div class="music-meta">
				<strong>{{ playback.title || '等待播放' }}</strong>
				<span>{{ playback.author || '本地音乐' }}</span>
			</div>
		</div>

		<div class="music-progress">
			<input
				aria-label="播放进度"
				:max="100"
				:min="0"
				:style="{ '--progress': `${progress}%` }"
				:value="progress"
				type="range"
				@input="seek"
			>
			<div>
				<span>{{ formatTime(playback.currentTime) }}</span>
				<span>{{ formatTime(playback.duration) }}</span>
			</div>
		</div>

		<div class="music-controls">
			<button aria-label="上一首" title="上一首" type="button" @click="skipBack">
				<Icon name="tabler:player-track-prev" />
			</button>
			<button class="play-button" :aria-label="playback.status === 'playing' ? '暂停' : '播放'" :title="playback.status === 'playing' ? '暂停' : '播放'" type="button" @click="togglePlayback">
				<Icon :name="playback.status === 'playing' ? 'tabler:player-pause' : 'tabler:player-play'" />
			</button>
			<button aria-label="下一首" title="下一首" type="button" @click="skipForward">
				<Icon name="tabler:player-track-next" />
			</button>
			<button aria-label="显示播放列表" title="播放列表" type="button" @click="showList = !showList">
				<Icon name="tabler:list" />
			</button>
			<UtilLink aria-label="打开音乐页" title="打开音乐页" to="/music">
				<Icon name="tabler:music" />
			</UtilLink>
		</div>

		<div v-if="showList" class="music-list">
			<button v-for="(song, index) in playback.songs" :key="`${song.name}-${index}`" :class="{ active: index === playback.index }" type="button" @click="switchSong(index)">
				<span>{{ song.name }}</span>
				<small>{{ song.artist }}</small>
			</button>
		</div>
	</section>
</ClientOnly>
</template>

<style lang="scss" scoped>
.music-card {
	margin: 0 5% 1rem;
	padding: 0.75rem;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	box-shadow: var(--box-shadow-1);
	background-color: var(--ld-bg-card);
	color: var(--c-text-1);
}

.music-card-main {
	display: flex;
	align-items: center;
	gap: 0.65rem;
}

.music-cover {
	width: 3.2rem;
	height: 3.2rem;
	border-radius: 0.45rem;
	object-fit: cover;
}

.music-meta {
	display: grid;
	gap: 0.2rem;
	min-width: 0;

	strong,
	span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	span {
		font-size: 0.8rem;
		color: var(--c-text-2);
	}
}

.music-progress {
	margin-top: 0.6rem;

	input {
		display: block;
		width: 100%;
		height: 0.8rem;
		background: transparent;
		appearance: none;
		cursor: pointer;

		&::-webkit-slider-runnable-track {
			height: 0.2rem;
			border-radius: 1rem;
			background: linear-gradient(to right, var(--c-primary) var(--progress), var(--c-bg-soft) var(--progress));
		}

		&::-webkit-slider-thumb {
			width: 0.6rem;
			height: 0.6rem;
			margin-top: -0.2rem;
			border-radius: 50%;
			background-color: var(--c-primary);
			appearance: none;
		}

		&::-moz-range-track {
			height: 0.2rem;
			border-radius: 1rem;
			background-color: var(--c-bg-soft);
		}

		&::-moz-range-progress {
			height: 0.2rem;
			border-radius: 1rem;
			background-color: var(--c-primary);
		}

		&::-moz-range-thumb {
			width: 0.6rem;
			height: 0.6rem;
			border: 0;
			border-radius: 50%;
			background-color: var(--c-primary);
		}
	}

	> div {
		display: flex;
		justify-content: space-between;
		margin-top: 0.2rem;
		font-size: 0.68rem;
		color: var(--c-text-3);
		font-variant-numeric: tabular-nums;
	}
}

.music-controls {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.35rem;
	margin-top: 0.35rem;

	button,
	a {
		display: grid;
		place-items: center;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 50%;
		color: var(--c-text-2);

		&:hover {
			background-color: var(--c-bg-soft);
			color: var(--c-primary);
		}
	}

	.play-button {
		background-color: var(--c-primary-soft);
		color: var(--c-primary);
	}
}

.music-list {
	display: grid;
	overflow-y: auto;
	max-height: 12rem;
	margin-top: 0.65rem;
	border-top: 1px solid var(--c-border);
	scrollbar-width: thin;

	button {
		display: grid;
		gap: 0.15rem;
		padding: 0.45rem 0.25rem;
		border-bottom: 1px solid var(--c-border);
		text-align: start;

		&:hover,
		&.active {
			color: var(--c-primary);
		}
	}

	small {
		font-size: 0.72rem;
		color: var(--c-text-3);
	}
}
</style>

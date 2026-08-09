export interface MusicSong {
	name: string
	artist: string
	cover: string
}

export interface MusicPlaybackState {
	ready: boolean
	status: 'idle' | 'playing' | 'paused'
	title: string
	author: string
	cover: string
	lyric: string
	currentTime: number
	duration: number
	index: number
	songs: MusicSong[]
}

const initialState: MusicPlaybackState = {
	ready: false,
	status: 'idle',
	title: '',
	author: '',
	cover: '',
	lyric: '',
	currentTime: 0,
	duration: 0,
	index: -1,
	songs: [],
}

export function useMusicPlayer() {
	return useState<MusicPlaybackState>('music-player-state', () => ({ ...initialState }))
}

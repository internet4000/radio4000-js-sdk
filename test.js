import test from 'ava'
import {
	findChannel,
	findChannelBySlug,
	findChannelImage,
	findTrack,
	findTracksByChannel
} from './index'

test('finds channel by id', async t => {
	const res = await findChannel('-JXHtCxC9Ew-Ilck6iZ8')
	t.is(res.title, 'Radio Oskar')
	t.truthy(res.id)
	t.truthy(res.body)
})

test('it throws an error when it doesn find anything', async t => {
	await t.throws(findChannel('fake id'))
})

test('finds channel by slug', async t => {
	const res = await findChannelBySlug('200ok')
	t.is(res.title, '200ok')
	t.truthy(res.id)
	t.truthy(res.body)
})

test('throws when it can not find by slug', async t => {
	await t.throws(findChannelBySlug('fake slug'))
})

test('it returns an image with extra "url" prop', async t => {
	const channel = await findChannelBySlug('200ok')
	const res = await findChannelImage(channel)
	t.truthy(res.id)
	t.is(typeof res.src, 'string')
	t.truthy(res.url.includes('cloudinary'))
	t.truthy(res.url.includes('image/upload'))
})

test('it finds a track with id', async t => {
	const res = await findTrack('-JZYXjpqPp6ODkdeV08o')
	t.is(res.title, 'Keyboard Masher ~ El Halcon Rising')
	t.truthy(res.id)
	t.truthy(res.ytid)
	t.truthy(res.url)
})

test('it finds an array of tracks', async t => {
	const channel = await findChannelBySlug('200ok')
	const tracks = await findTracksByChannel('-J_QdrlmldCa7DFyh5GH')
	t.is(typeof tracks, 'object') // object meaning 'array' here
	t.truthy(tracks.length)
	// check that it actually is track objects inside
	const track = tracks[10]
	t.truthy(track.id)
	t.truthy(track.ytid)
	t.truthy(track.url)
})

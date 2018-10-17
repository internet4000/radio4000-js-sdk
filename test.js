import test from 'ava'

import {
	findChannels,
	findChannel,
	findChannelBySlug,
	findTrack,
	findTracksByChannel,
	createBackup
} from './dist/radio4000-sdk.cjs'

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

test('it finds a track with id', async t => {
	const res = await findTrack('-JZYXjpqPp6ODkdeV08o')
	t.is(res.title, 'Keyboard Masher ~ El Halcon Rising')
	t.truthy(res.id)
	t.truthy(res.ytid)
	t.truthy(res.url)
})

test('it finds an array of tracks', async t => {
	const tracks = await findTracksByChannel('-J_QdrlmldCa7DFyh5GH')
	t.is(typeof tracks, 'object') // Object meaning 'array' here
	t.truthy(tracks.length)
	// Make sure it contains "tracks"
	const track = tracks[0]
	t.truthy(track.id)
	t.truthy(track.ytid)
	t.truthy(track.url)
})

test('it can find channels and accepts a limit', async t => {
	t.plan(5)
	const limit = 10
	const res = await findChannels(limit)
	t.is(typeof res, 'object') // Object meaning 'array' here
	t.is(res.length, limit)
	// Make sure it contains "channels"
	const channel = res[0]
	t.truthy(channel.id)
	t.truthy(channel.title)
	t.truthy(channel.created)
})

test('it can create a full backup from a slug', async t => {
	const testSlug = '200ok'
	const res = await createBackup(testSlug)
	t.is(res.slug, testSlug)
	t.truthy(res.id)
	t.truthy(res.tracks.length)
	t.is(res.image.channel, undefined, 'image relationship is cleaned')

	const track = res.tracks[0]
	t.truthy(track.id)
	t.truthy(track.ytid)
	t.truthy(track.url)
	t.is(track.channel, undefined, 'channel relationship on tracks are cleaned')

	t.is(typeof res.image, 'string')
	t.is(typeof res.imageUrl, 'string')
	t.truthy(res.imageUrl.includes('cloudinary'))
	t.truthy(res.imageUrl.includes('image/upload'))
})

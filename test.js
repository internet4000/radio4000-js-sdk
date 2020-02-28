import test from 'ava'

import {
	/* Api */
	findChannels,
	findChannel,
	findChannelBySlug,
	findTrack,
	findTracksByChannel,
	createBackup,

	/* Tags */
	/* TODO: hashtagRegex, */
	tagsFromString,
	tagsFromList,
	uniqueTagsFromList
} from './dist/radio4000-sdk.cjs'

/* Api */
test('finds channel by id', async t => {
	const res = await findChannel('-JXHtCxC9Ew-Ilck6iZ8')
	t.is(res.title, 'Radio Oskar')
	t.truthy(res.id)
	t.truthy(res.body)
})

test('it throws an error when it doesn find anything', async t => {
	await t.throwsAsync(findChannel('fake id'))
})

test('finds channel by slug', async t => {
	const res = await findChannelBySlug('oskar')
	t.is(res.title, 'Radio Oskar')
	t.truthy(res.id)
	t.truthy(res.body)
})

test('throws when it can not find by slug', async t => {
	await t.throwsAsync(findChannelBySlug('fake slug'))
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
	const testSlug = 'oskar'
	const res = await createBackup(testSlug)
	t.is(res.slug, testSlug)
	t.truthy(res.id)
	t.is(res.image.channel, undefined, 'image relationship is cleaned')

	if (res.tracks) {
		t.truthy(res.tracks.length)
		const track = res.tracks[0]
		t.truthy(track.id)
		t.truthy(track.ytid)
		t.truthy(track.url)
		t.is(track.channel, undefined, 'channel relationship on tracks are cleaned')
	}

	t.is(typeof res.image, 'string')
	t.is(typeof res.imageUrl, 'string')
	t.truthy(res.imageUrl.includes('cloudinary'))
	t.truthy(res.imageUrl.includes('image/upload'))
})

/* Tags */
test('It find all tags in a string', t => {
	const example = '#hello world #what-is-up'
	const h = tagsFromString(example)
	t.true(h[0] === 'hello')
	t.true(h[1] === 'what-is-up')
})

test('It find all tags, including duplicates', t => {
	const example = '#hello world #what-is-up #world #hello'
	const h = tagsFromString(example)
	t.true(h.length === 4)
})

test('Generate all tags from array of tracks', t => {
	const tracks = [
		{
			body: 'hello #world'
		},
		{
			body: '#miam iz #world'
		}
	]
	const h = tagsFromList(tracks)
	t.true(h.length === 3)
	t.true(h.join('') === 'worldmiamworld')
})

test('It find all tags in a array of tracks', t => {
	const tracks = [
		{
			body: 'hello #world'
		},
		{
			body: '#miam iz #world #tour'
		}
	]
	const h = uniqueTagsFromList(tracks)
	t.true(h.sortedTags.length === 3)
	t.true(h.sortedTags[0][0] === 'world')
	t.true(h.sortedTags[0][1] === 2)
})

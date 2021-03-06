import fetch from 'isomorphic-unfetch'

// Helpers to make it easier to work with the Radio4000 Firebase database.
const fetchAndParse = (url, host = 'https://radio4000.firebaseio.com') =>
	fetch(`${host}/${url}`)
		.then(res => res.json())
		.then(data => {
			// Catch resolved promise with empty value. Like non-existing slug or id.
			if (Object.keys(data).length === 0) throw new Error('Not found')
			return data
		})

const toObject = (obj, id) => Object.assign(obj, {id})
const toArray = data => Object.keys(data).map(id => toObject(data[id], id))

export function findChannel(id) {
	const url = `channels/${id}.json`
	return fetchAndParse(url).then(obj => toObject(obj, id))
}

export const findChannels = max => {
	let url = `channels.json`
	if (max) url += `?orderBy="created"&limitToFirst=${max}`
	return fetchAndParse(url).then(toArray)
}

export const findChannelBySlug = slug => {
	const url = `channels.json?orderBy="slug"&startAt="${slug}"&endAt="${slug}"`
	return fetchAndParse(url)
		.then(toArray)
		.then(arr => arr[0])
}

export const findTrack = id => {
	const url = `tracks/${id}.json`
	return fetchAndParse(url).then(data => toObject(data, id))
}

export const findTracksByChannel = id => {
	if (typeof id !== 'string') {
		throw new TypeError('Pass a string with a valid channel id')
	}

	const url = `tracks.json?orderBy="channel"&startAt="${id}"&endAt="${id}"`

	return (
		// Firebase queries through REST are not sorted.
		fetchAndParse(url)
			.then(toArray)
			.then(arr => arr.sort((a, b) => a.created - b.created))
	)
}

export function createBackup(slug) {
	if (!slug) throw new Error('Can not export channel without a `slug`')

	let backup
	const cloudinaryUrl = 'https://res.cloudinary.com/radio4000/image/upload'

	return findChannelBySlug(slug)
		.then(channel => {
			// Clean up
			delete channel.images
			delete channel.channelPublic
			delete channel.favoriteChannels
			delete channel.isFeatured
			delete channel.isPremium

			if (channel.image) {
				channel.imageUrl = `${cloudinaryUrl}/${channel.image}`
			}

			// Save current state of backup.
			backup = channel
			return channel
		})
		.then(channel => {
			if (!channel.tracks) return channel
			return findTracksByChannel(channel.id).then(tracks => {
				// Clean up tracks
				backup.tracks = tracks.map(track => {
					delete track.channel
					return track
				})
				return backup
			})
		})
		.catch(() => Promise.reject(new Error('Could not backup your radio')))
}

/* Tags */
// Test here: https://regex101.com/r/pJ4wC5/1
export const hashtagRegex = /(^|\s)(#[a-z\d-]+)/gi

export const tagsFromString = searchText => {
	if (!searchText) return null
	// https://regexr.com/46r2p
	const regexp = /(?:\B#)(\w|-?)+\b/g
	const result = searchText.match(regexp)

	if (!result) {
		return null
	}

	return result.map(item => item.replace('#', ''))
}

export const tagsFromList = (items, attribute = 'body') => {
	let aggBodies
	if (items && items.length > 0) {
		aggBodies = items
			.map(item => item[attribute])
			.reduce((acc, curr) => {
				return acc + ' ' + curr
			})
	} else {
		aggBodies = ''
	}

	return tagsFromString(aggBodies)
}

export const uniqueTagsFromList = (items, attribute = 'body') => {
	const tags = tagsFromList(items, attribute)

	if (!tags) return null

	const uniqueTags = tags.reduce((acc, cur) => {
		if (Object.prototype.hasOwnProperty.call(acc, cur)) {
			acc[cur]++
		} else {
			acc[cur] = 1
		}

		return acc
	}, {})

	const sortedTags = Object.entries(uniqueTags).sort((a, b) => {
		return b[1] - a[1]
	})

	const result = {
		tags: sortedTags.map(i => i[0]),
		sortedTags
	}

	return result
}

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

// Returns a the newest image in the form of a "src" string.
// Expects a channel model object.
export const findChannelImage = channel => {
	if (!channel || !channel.images) {
		return Promise.reject(new Error('Channel does not have an image'))
	}
	const url = `images.json?orderBy="channel"&startAt="${channel.id}"&endAt="${
		channel.id
	}"&limitToLast=1`
	return fetchAndParse(url)
		.then(toArray)
		.then(arr => arr[0])
		.then(img => {
			const rootURL = 'https://res.cloudinary.com/radio4000/image/upload'
			const transforms = `q_auto,w_56,h_56,c_thumb,c_fill,fl_lossy`
			img.url = `${rootURL}/${transforms}/${img.src}`
			return img
		})
}

export const findTrack = id => {
	const url = `tracks/${id}.json`
	return fetchAndParse(url).then(data => toObject(data, id))
}

export const findTracksByChannel = id => {
	if (typeof id !== 'string')
		throw new Error('Pass a string with a valid channel id')
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

	return findChannelBySlug(slug)
		.then(channel => {
			// Add a new "image" property from the latest image
			return (
				findChannelImage(channel)
					.then(img => {
						channel.image = {cloudinaryId: img.src, url: img.url}
						return channel
					})
					// Allow it to continue without an image.
					.catch(() => channel)
			)
		})
		.then(channel => {
			// Clean up
			delete channel.images
			delete channel.channelPublic
			delete channel.favoriteChannels
			delete channel.isFeatured
			delete channel.isPremium
			delete channel.tracks

			// Save current state of backup.
			backup = channel
			return channel
		})
		.then(channel => findTracksByChannel(channel.id))
		.then(tracks => {
			// Clean up tracks
			backup.tracks = tracks.map(track => {
				delete track.channel
				return track
			})
			return backup
		})
		.catch(() => {
			return Promise.reject(new Error('Could not export your radio, sorry.'))
		})
}

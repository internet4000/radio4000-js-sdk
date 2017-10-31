const fetch = require('isomorphic-fetch')
const host = require('./database-url')

// Helpers to make it easier to work with the Radio4000 Firebase database.
export const fetchAndParse = url =>
	fetch(url)
		.then(res => res.json())
		.then(data => {
			// Catch resolved promise with empty value. Like non-existing slug or id.
			if (!Object.keys(data).length) throw new Error('Not found')
			return data
		})

export const toObject = (obj, id) => Object.assign(obj, { id })

export const toArray = data =>
	Object.keys(data).map(id => toObject(data[id], id))

export function findChannel(id) {
	const url = `${host}/channels/${id}.json`
	return fetchAndParse(url).then(obj => toObject(obj, id))
}

export function findChannelBySlug(slug) {
	const url = `${host}/channels.json?orderBy="slug"&startAt="${slug}"&endAt="${slug}"`
	return fetchAndParse(url)
		.then(toArray)
		.then(arr => arr[0])
}

// Returns a the newest image in the form of a "src" string.
// Expects a channel model object.
export function findChannelImage(channel) {
	if (!channel || !channel.images) {
		return Promise.reject('Channel does not have an image')
	}
	const url = `${host}/images.json?orderBy="channel"&startAt="${channel.id}"&endAt="${channel.id}"&limitToLast=1`
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

export function findTrack(id) {
	const url = `${host}/tracks/${id}.json`
	return fetchAndParse(url).then(data => toObject(data, id))
}

export function findTracksByChannel(id) {
	if (typeof id !== 'string')
		throw new Error('Pass a string with a valid channel id')
	const url = `${host}/tracks.json?orderBy="channel"&startAt="${id}"&endAt="${id}"`
	return fetchAndParse(url)
		.then(toArray)
		.then(arr => {
			// Firebase queries through REST are not sorted.
			return arr.sort((a, b) => a.created - b.created)
		})
}

export default {
	findChannel,
	findChannelBySlug,
	findChannelImage,
	findTrack,
	findTracksByChannel
}


// This file returns a string with the database URL to use.
// It allows you to overwrite it in a browser environment using
// the global "window.r4.databaseUrl".

let host

if (typeof window !== 'undefined' && window.r4 && window.r4.databaseUrl) {
	host = window.r4.databaseURL
} else if (process.env.NODE_ENV === 'production') {
	host = 'https://radio4000.firebaseio.com'
} else {
	host = 'https://radio4000-staging.firebaseio.com'
}

module.exports = host

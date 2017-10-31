// This file returns a string with the database URL to use.
let host

// Allow overwriting the URL.
const override = !process.env && window && window.r4 && window.r4.databaseURL
if (override) {
	host = window.r4.databaseURL
} else if (process.env.NODE_ENV === 'production') {
	// Production
	host = 'https://radio4000.firebaseio.com'
} else {
	// Default to staging
	host = 'https://radio4000-staging.firebaseio.com'
}

module.exports = host

# Radio4000 JavaScript SDK

> Helpers to fetch data via REST API from the Radio4000 Firebase database

[![Build Status](https://travis-ci.org/internet4000/radio4000-js-sdk.svg?branch=master)](https://travis-ci.org/internet4000/radio4000-js-sdk)

- works in browsers and node
- less than 1kb minified

## API methods

Here are the methods you can use. All return a promise.

```js
findChannels(amount) // amount is optional
findChannel(id)
findChannelBySlug(channelSlug)
findTrack(id)
findTracksByChannel(channelId)
createBackup(channelSlug)
```

> Note: the `findChannelImage(channelObject)` method was removed in 0.1.0

## Tags methods

You can use these methods, which should help find the tags the way you
need them.

``` js
const example1 = '#hello world #what-is-up'
console.log(tagsFromString(example1))
// [ 'hello', 'what-is-up']

const example2 = [
    {
        body: 'hello #world'
    },
    {
        body: '#miam iz #world'
    }
]
console.log(tagsFromList(example2, 'body'))
// [ 'world', 'miam', 'world' ]

const example3 = [
    {
        body: 'hello #world'
    },
    {
        body: '#miam iz #world #tour'
    }
]
console.log(uniqueTagsFromList(example3, 'body'))
// {
//   tags: [ 'world', 'miam', 'tour' ],
//   sortedTags: [ [ 'world', 2 ], [ 'miam', 1 ], [ 'tour', 1 ] ]
// }
```

## Usage if you can `import` or `require`

Install the module:

```
yarn add radio4000-sdk
```

Then, import the methods you need:

```js
// ES Modules
import { findChannel, findChannelBySlug } from 'radio4000-sdk'

// Node.js/CommonJS
const { findChannel, findTracks } = require('radio4000-sdk')
```

## Usage with `<script>`

For browsers you can do this. It will add a `radio4000Sdk` global.

```html
<script src="radio4000-sdk.js"></script>
<!-- or with a CDN
<script src="https://unpkg.com/radio4000-sdk"></script>
<script src="https://cdn.jsdelivr.net/npm/radio4000-sdk"></script>
-->
<script>
radio4000Sdk.findChannelBySlug('detecteve')
  .then(channel => {console.log(channel.title)})
</script>
```

## Development

Clone the repo, `yarn` and `yarn test`. There is no start because this is a library.

To release a new version, run `yarn release`. Run `yarn release --help` for more information.

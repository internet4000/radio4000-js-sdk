# Radio4000 JavaScript SDK

> Helpers to fetch data via REST API from the Radio4000 Firebase database

This package takes care of a few annoyances with Firebase: not having an `id` inside each object, "lists" being returned as an object instead an array.

## API

Here are the methods you can use. All return a promise.

```js
findChannels(amount) // amount is optional
findChannel(id)
findChannelBySlug(channelSlug)
findChannelImage(channelObject)
findTrack(id)
findTracksByChannel(channelId)
createBackup(channelSlug)
```

## Usage if you can use `import` or `require`

Install the module.

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
  .then(channel => {
    console.log(channel.title)
  })
</script>
```

## Development

Clone the repo, npm install and npm test. There is no start because this is a library.


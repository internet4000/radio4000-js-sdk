# Radio4000 JavaScript SDK

> Helpers to fetch data via REST API from the Radio4000 Firebase database

This package takes care of a few annoyances with Firebase: not having an `id` inside each object, "lists" being returned as an object instead an array.

Here are the methods you can use. All return a promise.

```js
findChannels(amount) // amount is optional
findChannel(id)
findChannelBySlug(channelSlug)
findChannelImage(channelObject)
findTrack(id)
findTracksByChannel(channelId)
```

## Usage

@todo publish to NPM.

For now, clone this repository and run `yarn link` inside. Then do `yarn link radio4000-api-sdk` in the project where you want this.

Then, import the methods you need:

```js
// ES6 Modules
import { findChannel, findChannelBySlug } from 'radio4000-api-sdk'

// CommonJS
const { findChannel, findTracks } = require('radio4000-api-sdk')
```


## Development

Clone the repo, npm install and npm test. There is no start.


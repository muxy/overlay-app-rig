# App Behavior
Your app is given a section of server-side state namespaced to your app id. You can store any JSON
objects here for either channel-wide configuration or viewer-specific state.

Configuration state for your app for a particular channel can only be set on the broadcaster-facing
apps: the Broadcaster Config and Live Apps. Viewers or your external servers may store data state on
the server and immediately broadcast updates to all viewers.

## App State
To use the state storage and updates mechanisms, your app must include the AppMixin. This will
provide many convenience methods and take responsibility for fetching and persisting state. To
include it, simply import and list it in the `mixins` section of your app:

```javascript
import AppMixin from 'shared/js/app-mixin';

export default {
  ...
  mixins: [AppMixin],
  ...
};
```

Getting state for an app is done through the `option` getter. This function takes an object path and
returns a reactive object of the current channel-specific state. This response will automatically
update when the value is changed either server- or client-side. The function also takes an optional
second `default` parameter to return if the path is not currently set.

There are a few options for setting viewer state dependent on how you intend the server to interpret
the values as detailed below.

## Get State
Assuming you are storing state for the app with this format (all settings must be valid JSON
objects):

```javascript
{
  image: {
    url: "http://<some image>"
  },
  title: "Awesome!!"
}
```

You could then access the image url with:

```javascript
let url = this.option('image.url');
```

The argument to option is any dot-separated path into the app-option object. `option('image')`, and
`option('image.url')` are both valid calls and will return the corresponding objects or values.
If any object along the path is not set, null will be returned.

In addition you may call `option()` with no path to return your entire options object.

You may also use the option helper directly in the DOM:

```html
<h1>{{ option('image.url') }}</h1>
```

**NOTE**: State for all apps available to the user is guaranteed to be populated and available to
the option accessor before your app component’s created or mounted methods are called.

## Watching State
You can also pass the `option` helper a callback function, if you need to do something more
advanced when a value changes.

```javascript
this.option('image.url', (url) => {
  this.cacheBustingURL = `${url}#${new Date().getTime()}`;
});
```

The provided callback will be called each time the value of the provided path changes, and will be
called immediately with the current value of the option (`null` if the option has no value).

## Persisting State
In its simplest form, broadcasters can store state per-channel using simple json blobs. This state
will be accessible to your app for all viewers of the broadcaster's channel. Each channel has their
own segregated state.

```javascript
const options = {
 image: {
   url: 'https://<new image url>'
 }
};

this.saveChannelOptions(options);
```

Only the broadcaster-facing apps can set state in this way, but it will be accessible to
all viewers.

To make user data accessible to other users and/or the broadcaster you must use one of the data
aggregation methods. The server accepts and aggregates data from the viewers using a few different
methods available to your app.

All aggregation methods take a namespace id that identifies that collection of data. This is to
allow you to have several types of data sources occurring at once with no overlap.

In addition, all data your app generates is stored exclusively for your app and is not available to
any other apps, extensions or channels at any time.

The `namespace_id` you provide has the same restrictions as your `app_id`: lowercase letters,
numbers and underscores only. You may use the same namespace with different aggregation methods and
not have data cross-contamination.

The available aggregations methods are:

### Accumulation
Accumulation is the simplest form of aggregation. Using this method, the server simply timestamps
and concatenates all JSON blobs sent to it.

No combining or processing is done on the data you send and no automatic broadcasting of the data
is provided. Your app (or other authenticated source) must ask for the data using an
accessor method.

To send a data blob:

```javascript
this.muxy.accumulate('awesomeness_level', {
 awesomeness_level: {
   great: 10,
   good: 2.5,
   poor: 'dank'
 }
});
```

You may include any data in these blobs (e.g. timestamp or user id info) as long as it is a valid
JSON object.

To retrieve the accumulated data:
```javascript
const oneMinuteAgo = (new Date().getTime()) - (1000 * 60);

this.muxy.getAccumulation('awesomeness_level', oneMinuteAgo);
```

The second parameter to getAccumulation() is a unix timestamp in milliseconds of the earliest
accumulation record to return.

### Voting
The voting endpoint takes integer values 0 through 5, uniques them on the server based on user
identification and periodically broadcasts the sum of all votes and vote metadata to all
viewers periodically.

To send a new vote for a user:

```javascript
// Viewer has chosen the first poll option
this.muxy.vote('awesome_poll_number_1', 0);
```

To get the current vote data for a given poll:

```javascript
const voteResults = this.muxy.getVoteData('awesome_poll_number_1');

console.log(voteResults.values);
```

If you'd like to listen for vote updates automatically instead of continuously polling, you can
do so with the same event system and the special `vote_update` event:

```javascript
this.muxy.listen('vote_update:awesome_poll_number_1', (voteData) => {
 console.log(voteData.values);
});
```

### Ranking
The ranking endpoint allows you to send arbitrary per-user keys to the server and request a ranked
response of the most popular. The keys can be any string value.

To send a ranking for a user:

```javascript
const usersFavoriteColor = 'tequila';

this.muxy.rank('favorite_color', usersFavoriteColor);
```

To request the current user rankings:

```javascript
this.muxy.getRank('favorite_color').then((colors) => {
  if (colors.values.length > 0) {
    colors.values.forEach((color) => {
      console.log(`${color.key}: ${color.score}`);
    });
  }
});
```

## Message Broadcast
In addition to the automated messages sent in response to the state and voting endpoints, you can
send custom messages to the viewers. This can be done from your own server or from the
broadcaster-facing pages. Individual viewers may not, however, send arbitrary messages to
other viewers.

To listen for incoming messages, simply call the listen function on the Muxy SDK object:

```javascript
const awesomeHandler = this.muxy.listen('increase_awesomeness', (data) => {
  this.awesomeness += data.level;
});
```

Events can also be sent to individual viewers only. To listen for events sent only to the current
viewer, simply send their opaque id as the second parameter:

```javascript
this.muxy.listen('increase_awesomeness', this.user.opaqueID(), (data) => {
  this.viewerAwesomeness += data.level;
});
```

And then from the broadcaster live or config page:

```javascript
this.muxy.send('increase_awesomeness', {
  level: 11
});
```

Or to send a message to a single viewer (whose opaque ID you know):

```javascript
this.muxy.send('increase_awesomeness', opaqueID, {
  level: 11
});
```

If you are done with an event listener and no longer wish to receive events:

```javascript
this.muxy.unlisten(awesomeHandler);
```

## Next Steps
 - [App Configuration](AppConfiguration.md)
 - [App Structure](AppStructure.md)
 - [App Appearance](AppAppearance.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

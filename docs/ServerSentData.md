# Server-Sent Data
If you have an existing server that you would like to integrate with your app, Muxy provides a
simple JSON storage and retrieval system. This works similarly to a standard key/value store, with
the limitation that the value must be a valid JSON object. The amount of data that can be stored is
currently limited to 2KB per-developer.

To push data to the store, simply send a POST request to the json_store endpoint:

```sh
curl -X POST \
 -H "Content-Type: application/json" \
 -H 'Authorization: "<extension id> <jwt>"' \
 -d '{ "potato": "russet", "awesomeness": 11 }' \
 https://api.muxy.io/v1/e/json_store?id=awesome_server_action
```

Where the json data payload may be any JSON blob and the id is any valid string of alphanumeric
characters and underscores.

The data you POST to this endpoint will be stored indefinitely, keyed on your app id and provided
identifier. The current stored data may be retrieved at any time by calling:

```javascript
this.muxy.getJSONStore('awesome_server_action').then((data) => {
  console.log(data.awesomeness);
});
```

The response will be a json object with your values:
```
{
  "potato": "russet",
  "awesomeness": 11
}
```

In addition to retrieving the data at any time, Muxy will broadcast an event to all viewers
currently using your app when new data is POSTed to the endpoint. You may listen for specific
storage events similar to how vote update events are handled:

```javascript
this.muxy.listen('json_store_update:awesome_server_action', (data) => {
  console.log(data.value.awesomeness);
});
```

The response includes the event id and value:
```
{
  "id": "awesome_server_action",
  "value": {
    "potato": "russet",
    "awesomeness": 11
  }
}
```


If you are posting json data to several different keys and would like to listen for all JSON
store updates, you can use * to reference all update events:

```javascript
this.muxy.listen('json_store_update:*', (data) => {
 if (data.id === 'awesome_server_action') {
   console.log(data.value.awesomeness);
 }
});
```

The response includes the event id and value:
```
{
  "id": "awesome_server_action",
  "value": {
    "potato": "russet",
    "awesomeness": 11
  }
}
```

## Next Steps
 - [App Configuration](AppConfiguration.md)
 - [App Structure](AppStructure.md)
 - [App Appearance](AppAppearance.md)
 - [App Behavior](AppBehavior.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

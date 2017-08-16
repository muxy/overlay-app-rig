# Ranking
The ranking endpoint allows you to send arbitrary per-user keys to the server and request a ranked
response of the most popular. The keys can be any string value.

Every rank has a 'name', which consists of lower-case alphanumeric characters and the hyphen '-'
character. Every rank name is sandboxed by your identifier, so two overlay apps can have the rank
'default' and the ranking will not conflict.

## Sending Ranks
Rank data are unique per user; a user may only have one rank entrye per 'name'. Repeated requests
to the `rank` endpoint with the same name will change the user's stored value.

To send a ranking for a user:

```javascript
const usersFavoriteColor = 'rebeccapurple';

this.muxy.rank('favorite_color', usersFavoriteColor);
```

## Get Ranking Data
To request the current user rankings for a specific rank name:

```javascript
this.muxy.getRankingData('favorite_color').then((colors) => {
  if (colors.data.length > 0) {
    colors.data.forEach((color) => {
      console.log(`${color.key}: ${color.score}`);
    });
  }
});
```

The response has the structure:

```json
{
  "data": [
    { "key": "rebeccapurple", "score": 5 },
    { "key": "arcticblue", "score": 2 },
    { "key": "olivedrab", "score": 1 }
  ]
}
```

`data` will be an ordered array sorted by the "score" (how many people submitted ranks for that
key) for the top 100 keys.

## Next Steps
 - [Back to App Behavior](AppBehavior.md)
 - [Accumulate Endpoint](Accumulate.md)
 - [Voting Endpoint](Vote.md)

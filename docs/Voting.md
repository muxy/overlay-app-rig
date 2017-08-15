# Voting interface
For basic voting behavior, muxy provides a vote endpoint. Every poll has a 'name', which is a name consisting of lower-case
alphanumeric characters and the hypen '-' character. Every poll name is sandboxed by your identifier, so two overlays
can have the poll 'default' and the votes will not conflict.

## Voting
To vote in a poll, POST to `vote` with a json body with a `value` key. The `value` key must be a number in the range [-1000, 1000].
These values may be floating point values. Votes are unique per user - one user may only cast one vote. Repeated requests
to the `vote` endpoint will change the user's vote.

```javascript
muxy.vote('vote-name', 1)
```

This returns a promise that will resolve with a json blob with information about the poll.
```
{
    mean: 1,
    sum: 1,
    stddev: 0,
    specific: [0, 1, 0, 0, 0, 0],
    count: 1
    vote: 1
    decay: {
        ...
    }
}
```

The `mean` field is the average of all the votes cast in this poll. `sum` is the sum of all the values cast, and `stddev` is
an approximate standard deviation of all the votes cast in this poll.

The `specific` field captures the number of votes cast with the integer values between 0 and 5, inclusive. The number of votes
cast for such a value is stored in the array at the index of that value. That is, the number of votes cast for the literal value
`4` can be found in `specific[4]`.

the `vote` field is the value of the vote that the current user cast. This may not exist if the user has not cast a vote yet.

The `decay` object has some implementation specific parameters. This field is depreciated and should not be relied upon.

On vote, a `vote_update:vote-name` event is broadcast. The data associated with this event is the same as the response object
from the POST. This event is emitted at most once every five seconds. Since one event is not emitted on every vote, the suggested pattern
is to update the poll interface after every `vote_update` event, and then after five seconds of no such events,
issue `muxy.getVoteData('vote-name')` to get the poll values after voting has settled.

## Poll Status
To get the current status of a poll, issue a GET to `vote`.

```javascript
muxy.getVoteData('vote-name')
```

This returns a promise that will resolve with the same response as the POST variant.

Polls expire 15 mintues after the last vote is cast.

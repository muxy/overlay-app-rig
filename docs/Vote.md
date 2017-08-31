# Voting
For basic voting behavior, muxy provides a vote endpoint. Every poll has a 'name', which consists of
lower-case alphanumeric characters and the hyphen '-' character. Every poll name is sandboxed by
your identifier, so two overlay apps can have the poll 'default' and the votes will not conflict.

Polls expire automatically 15 minutes after the last vote is cast. After that point, all vote values
will be removed and sending votes with the same vote 'name' will act as a new poll.

## Sending Votes
To vote in a poll, simply use the SDK's `vote` method. This method takes a poll `name` and a
numeric value. The value must be in the range [-1000, 1000] and may be a floating point.

Votes are unique per user; a user may only cast one vote per poll 'name'. Repeated requests
to the `vote` endpoint with the same poll name will change the user's vote.

```javascript
this.muxy.vote('poll-number-1', 1);
```

## Getting Votes
To get the current status of a running poll, use the `getVoteData` method.

```javascript
this.muxy.getVoteData('poll-number-1').then((voteData) => {
  console.log(voteData.sum);
});
```

This method returns a promise that will resolve with a json blob with information about the poll:
```json
{
    mean: 1,
    sum: 1,
    stddev: 0,
    specific: [0, 1, 0, 0, 0, 0],
    count: 1
    vote: 1
}
```

The `mean` field is the average of all the votes cast in this poll. `sum` is the sum of all the
values cast, and `stddev` is an approximate standard deviation of all the votes cast in this poll.

The `specific` field captures the number of votes cast with the integer values between 0 and 5,
inclusive. The number of votes cast for such a value is stored in the array at the index of that
value. That is, the number of votes cast for the literal value `4` can be found in `specific[4]`.

The `count` field is the number of users that have voted.

The `vote` field is the value of the vote that the current user cast. This may not exist if the
user has not cast a vote yet.

There is also a `decay` object in the response, but its use is deprecated and it will be removed
in a future update.

## Automatic Vote Updates
While votes are being sent to the voting system, the server will periodically send update events to
all viewers. These update events are sent at most every 5 seconds and so may include data for
multiple "votes."

We suggest using the vote update events to refresh your interface in real-time, but if no update
events have been seen in over 5 seconds, you may wish to request the vote data directly for the
most recent data.

The automatic updates can be listened to by using:

```javascript
this.muxy.listen('vote_update:poll-number-1', (voteData) => {
  console.log(voteData.sum);
});
```

The `voteData` callback value returns the event id and a value param that has the same structure and fields as the `getVoteData`

```
{
    "id": "poll-number-1",
    "stats": {
        "stddev": 0,
        "mean": 0,
        "sum": 0,
        "specific": [0, 1, 0, 0, 0, 0],
        "count": 1,
    }
}
```


## Next Steps
 - [Back to App Behavior](AppBehavior.md)
 - [Accumulate Endpoint](Accumulate.md)
 - [Ranking Endpoint](Rank.md)
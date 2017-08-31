# Data Accumulation
Accumulation is the simplest form of aggregation. Using this method, the server simply timestamps
and concatenates all JSON blobs sent to it.

No combining or processing is done on the data you send and no automatic broadcasting of the data
is provided. Your app (or other authenticated source) must ask for the data using an
accessor method. Viewers may not request the data themselves, but the broadcaster live app can get,
transform and send the info out to viewers as needed.

## Sending Data
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

The response object will be an empty json object:

```
{}
```

## Accessing Data
The broadcaster can then request the accumulated data:

```javascript
const oneMinuteAgo = (new Date().getTime()) - (1000 * 60);

this.muxy.getAccumulation('awesomeness_level', oneMinuteAgo).then((resp) => {
  console.log(resp.latest); // An epoch timestamp of the most recent accumulate entry.
  console.log(resp.data); // A list of all accumulate values since oneMinuteAgo.
});
```

Response:
```
{  
   "data":[  
      {  
         "observed": 1503939418480,
         "channel_id": "23161357",
         "opaque_user_id": "A1954218",
         "user_id": "",
         "data": {  
            "awesomeness_level": {  
               "good": 2.5,
               "great": 10,
               "poor": "dank"
            }
         }
      }
   ],
   "latest": 1503939418480
}
```

The second parameter to getAccumulation() is a unix timestamp in milliseconds of the earliest
accumulation record to return.

## Next Steps
 - [Back to App Behavior](AppBehavior.md)
 - [Voting Endpoint](Vote.md)
 - [Ranking Endpoint](Rank.md)
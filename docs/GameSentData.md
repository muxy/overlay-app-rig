# Game-Sent Data
Applications that run on a broadcaster’s computer (e.g. games) and do not have a dedicated server
component can also send data to extensions, although an extra authentication step is required.

In this case, the broadcaster must use a two-factor auth style scheme to verify their identity with
Twitch, Muxy and your application. This is achieved by having your app display a 4-digit pin, which
the broadcaster must then type into your config app.

Once this is done, and the broadcaster has authenticated, your application may use the existing
`/json_store` endpoint to send data to that broadcaster’s app.

## Authenticating the Broadcaster
Muxy provides an auth endpoint for creating a broadcaster/app auth request at `/v1/e/unauthed/pin`.
To use, you should POST your app id to this endpoint.

```sh
curl -X POST \
 -H "Content-Type: application/json" \
 -d '{ "identifier": "<your app id>" }' \
 https://api.muxy.io/v1/e/unauthed/pin
```

The API will always respond with a JSON payload containing a new auth token and PIN value. You will
receive a new token and PIN combination each time you hit this endpoint, however existing token and
PIN pairs will continue to work.


> HTTP/1.1 200 OK
> Content-Type: application/json
>
> `{"token": "<broadcaster's auth token>", "pin": "<a 6-character broadcaster PIN>"}`

The PIN will always be a 4-character alphanumeric string and is not case-sensitive. We recommend
displaying the PIN using a clear, high-contrast font in all uppercase.

To finish the authorization setup, this PIN is entered in your Muxy Overlay App’s Config page (more
information below). The `token` response is an authorization token specific to this broadcaster and
your app which will become valid once the broadcaster has finished the authorization.

To check if your PIN is valid, issue a POST request to `/v1/e/unauthed/validate_pin` sending your
app id and the returned PIN in a JSON payload.

```sh
curl -X POST \
 -H "Content-Type: application/json" \
 -d '{ "identifier": "<your app id>", "pin": "<your pin from /pin> }' \
 https://api.muxy.io/v1/e/unauthed/validate_pin
```

You may also POST your JWT to the same endpoint to check its validity.

```sh
curl -X POST \
 -H "Content-Type: application/json" \
 -d '{ "identifier": "<your app id>", "jwt": "<your jwt from /pin> }' \
 https://api.muxy.io/v1/e/unauthed/validate_pin
```

These endpoints return an empty json body as a response, and a 200 if the pin or JWT was valid. A
PIN is considered valid if it was created by your application identifier and has not expired. A JWT
is considered valid if it was created by your application identifier and the user has entered the
PIN into the confirmation page on twitch. The endpoint returns 401 otherwise.

> HTTP/1.1 200 OK
> Content-Type: application/json
>
> {}

## Broadcaster PIN
To support client-side authentication, you must have an Overlay Config app. This app can contain
any configuration your app needs to run, but must at a minimum include and display the provided
GameAuth component.

The GameAuth displays a 4-character input field and validate and cancel buttons. It is up to the
containing app to handle showing and displaying this component. The component has two required
props - `:muxy`, which should be set to the muxy sdk associated with your extension, and `:appName`
- the user-facing name of your extension.

The component exposes three events - `success`, `cancel` and `failure`.
 - `success`: the user input a valid authentication code and clicked submit
 - `cancel`: the user clicked the cancel button
 - `failure`: a server-side error occured after the user tried to submit a code

```javascript
import GameAuth from 'shared/components/GameAuth';
...
<game-auth v-if="gameauth" class="game-auth"
   :muxy="muxy" appName="Toast Demo"
   @success="successfulAuth" @cancel="dismissAuth"></game-auth>
```

In the sample code above, it is assumed that the component that has the GameAuth component has a
muxy sdk accessible through the variable `muxy`, and controls the visibility of the GameAuth
component by toggling the boolean variable `gameauth`.

Since the GameAuth component does not control its own visbility, the success and failure events
should hide the GameAuth component.

## SDK Methods
The muxy sdk has two methods to interact with game auth tokens.

`muxy.pinTokenExists()` checks to see if a game auth token exists and is valid for your extension
and the current user. It does not validate a specific PIN, nor does it return what JWT or PIN
is validated.

`muxy.revokeAllPINCodes()` will invalidate all existing game auth tokens.

## Sending Data
Once the broadcaster has successfully authenticated your app, you can send data to your Overlay App
using the `/json_store` endpoint and the returned broadcaster auth token.

```sh
curl -i -X POST \
 -H "Content-Type: application/json" \
 -H 'Authorization: "<your app id> <broadcaster's auth token>"' \
 -d '{ <any valid json data> }' \
 https://api.muxy.io/v1/e/json_store
```

You should receive a successful 200 response with an empty body:

> HTTP/1.1 200 OK
> Content-Type: application/json
>
> {}

## Next Steps
 - [App Configuration](AppConfiguration.md)
 - [App Structure](AppStructure.md)
 - [App Appearance](AppAppearance.md)
 - [App Behavior](AppBehavior.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

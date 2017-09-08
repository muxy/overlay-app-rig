# App Configuration

## Global Settings
There is a global configuration file located at `src/config.json`. This file holds settings for the
entire rig and does not effect your app. Currently it only contains a single option.

```json
{
  "testing_channel": "126955211"
}
```

| Field           | Required | Description                                          |
|-----------------|----------|------------------------------------------------------|
| testing_channel | Yes      | the Twitch Channel ID to load in the embedded player |


## App Settings
Your app must first be configured by editing the json file located in `src/<app id>/config.json`.
This file defines the name and appearance of your app in the side toolbar, as well as how your
app's window appears.

An app is identified by its `id` field. This is a string which you provide and can be any
combination of lowercase letters, numbers and underscores. We use the convention of
`<company_name>_<app_name>` to avoid collision.

Once you have decided on an id for your app, navigate to [https://u.muxy.io/dashboard/developers](https://u.muxy.io/dashboard/developers) and create a new
overlay app. This will allow the automatic sandbox credentials to work for your extension.

```json
{
  "id": "muxy_toast_demo",
  "name": "Toast Popup Demo",
  "icon": "assets/images/logo.svg",
  "viewer": "ToastDemo",
  "config": "ToastDemoConfig",
  "live": "ToastDemoLive",
  "broadcaster_whitelist": ["126955211", "89319907"],
  "window": {
    "type": "movable"
  }
}
```

| Field                 | Required | Description                                                                           |
|-----------------------|----------|---------------------------------------------------------------------------------------|
| id                    | Yes      | a unique string identifier for your app                                               |
| name                  | Yes      | a short string name for your app                                                      |
| icon                  | Yes      | a path to the white silhouette version of your toolbar icon                           |
| viewer                | Yes      | a path to the vue component file for your viewer app                                  |
| config                | No       | if you have an associated broadcaster config app, the path to that vue component file |
| live                  | No       | if you have an associated broadcaster live app, the path to that vue component file   |
| broadcaster_whitelist | No       | a list of channel ids to limit your app's installable access                          |
| window                | No       | an object describing the containing window for your app                               |

## Next Steps
 - [App Structure](AppStructure.md)
 - [App Appearance](AppAppearance.md)
 - [App Behavior](AppBehavior.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

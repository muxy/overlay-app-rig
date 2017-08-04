# App Configuration

Your app must first be configured by editing the json file located in `src/<app id>/config.json`.
This file defines the name and appearance of your app in the side toolbar, as well as how your
app's window appears.

An app is identified by its `id` field. This is a string which you provide and can be any
combination of lowercase letters, numbers and underscores. We use the convention of
`<company_name>_<app_name>` to avoid collision.

```json
{
 "id": "muxy_toast_demo",
 "name": "Toast Popup Demo",
 "icon": "assets/images/logo.svg",
 "window": "movable",
 "viewer": "ToastDemo",
 "config": "ToastDemoConfig",
 "live": "ToastDemoLive",
 "broadcaster_whitelist": ["126955211", "89319907"]
}
```

| Field                 | Required | Description                                                                            |
|-----------------------|----------|----------------------------------------------------------------------------------------|
| id                    | Yes      | a unique string identifier for your app.                                               |
| name                  | Yes      | a short string name for your app.                                                      |
| icon                  | Yes      | a path to the white silhouette version of your toolbar icon.                           |
| window                | No       | a string designating the type of window-management used by this app.                   |
| viewer                | Yes      | a path to the vue component file for your viewer app.                                  |
| config                | No       | if you have an associated broadcaster config app, the path to that vue component file. |
| live                  | No       | if you have an associated broadcaster live app, the path to that vue component file.   |
| broadcaster_whitelist | No       | a list of channel ids to limit your app's installable access.                          |

## Next Steps
 - [App Structure](AppStructure.md)
 - [App Appearance](AppAppearance.md)
 - [App Behavior](AppBehavior.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

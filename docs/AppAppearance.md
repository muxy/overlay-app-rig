# App Appearance
The Overlay container acts like a window manager for apps on the viewer's page. Each app you create
can optionally have an interactable icon in the toolbar and a display area on the screen.

## App Icon
The appearance in the toolbar is controlled by the `icon` app config option. If this field is not
provided, no icon will appear in the toolbar. If the field is set, it is expected to be a path to a
white silhouette version of the app's icon. Clicking on the icon in the toolbar toggles the app's
`show` variable. If you use one of the provided window types, showing and hiding your app is
handled for you.

## App Window
Taking advantage of Muxy's window types allows us to handle showing and hiding your app when the
viewer requests it, as well as allowing user's to optionally reposition your app on their screen.
If you do not set the app config `window` option, you are responsible for positioning and displaying
your app when appropriate.

If you choose to control your app's visibility manually, we provide three functions you may find
useful:

```javascript
this.show();
this.hide();
this.toggle();
```

If you'd rather use one of the default window types, you may choose from:

### Movable
If `window` is set to `movable`, Muxy will wrap your app in a window object automatically. Showing
and hiding this window will be toggled when the user clicks the app icon on the toolbar. Your
template will be rendered within the window object and will respect your styling and size.

The window has a "title" that is set to your app's `name` field that appears when the user hovers
over your app's window.

Users will be able to drag your app around the screen, limited to the bounds of the video player.
Positioning and visibility are reset when the page refreshes.

### Center
If `window` is set to `center`, Muxy will similarly wrap your app in a window object. Showing and
hiding the window will work the same as a movable window, however your app will always appear
centered on the screen when it is shown and users will not be able to reposition it.

### Toast
If `window` is set to `toast`, your app will be locked to the upper left corner of the video player.
When it is shown, either due to a user click or programmatically, it slides down to just be visible.
When hidden it slides up to off-screen.

If you are using the toast window type, you may optionally provide an object as the window field,
with extra configuration.

```javascript
"window": {
  "type": "toast",
  "position": "top center"
}
```

`position` will determine the location and animation direction for your toast window. Possible
values are: `top left`, `top center`, `top right`, `middle left`, `middle right`, `bottom left`,
`bottom center` or `bottom right`.

Your code can, of course, override this setting and choose any display position at runtime.

### Popper
If `window` is set to `popper`, your app's template will be rendered directly to the left or right
of the toolbar (depending on its position on-screen). This can be used to create a "sub-menu" of
options for the app's toolbar item.

## Next Steps
 - [App Configuration](AppConfiguration.md)
 - [App Structure](AppStructure.md)
 - [App Behavior](AppBehavior.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

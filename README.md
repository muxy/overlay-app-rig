# Muxy Overlay App Rig

![Muxy Logo](docs/logo.png)

The Muxy Overlay App Rig is a platform to make developing interactive experiences on Twitch
faster and easier!

This repo provides everything you need to get started building a full interactive app integrated
into Muxy's Overlay experience on Twitch.

See also:

[Muxy Extension JavaScript Library](https://github.com/muxy/extensions-js)

[Muxy Extension Rig](https://github.com/muxy/extensions-rig)

## Overview

### What are Extensions?

### Viewer App

The Viewer App is the main component of what people consider an "Extension." It is the interface
that viewers see and use. It will appear over the broadcaster's stream and various parts can be
shown, hidden or moved around the screen.

### Broadcaster Config App

The Broadcaster Config App is accessible by the broadcaster from Twitch's "Extension Manager." It
shows the broadcaster what apps they have enabled for the Overlay, and allows them to configure
each one. Your app will appear in a large area and should display any configuration options the
broadcaster may set that will affect your app channel-wide.

You may optionally choose to let viewers override any settings the broadcaster sets here.

This page is not expected to be kept open by the broadcaster. Instead it is loaded and configured
before the app is enabled, so that viewers only see your app after the broadcaster has tweaked it
to their liking. Any realtime events or updates sent to this page will most likely not be seen by
the broadcaster.

### Broadcaster Live App

The broadcaster live app is accessible by the broadcaster from Twitch's "Live Dashboard." The
usable space in the Live App is considerable smaller than the other two, and should only display
controls that are immediately useful to the broadcaster. The expected behavior is that a
broadcaster will have the Live Dashboard open while they stream.

This app is optional, but may be used to display information needed by the broadcaster. For
example, it may show aggregate voting data. It can also be used by the broadcaster to effect app
state, such as clearing out a poll's information, sending messages to viewers or hiding/displaying
the app on all viewers' pages.

## Resources
 - [Change Log](CHANGELOG.md)
 - [Getting Started Guide](docs/GettingStarted.md)

# Getting Started
The code being made available to you is a stripped down version of Muxy's Overlay extension on
Twitch. This allows you to run it outside of Twitch proper, with all of the functionality you would
expect to be present in the final shipped form.

You can use this to develop "apps" for inclusion into the Overlay extension, without the need to
set up a full backend system and development environment. The rig comes as a NodeJS application
which runs a local web server on your machine.

**NOTE**: Currently only Mac OS X and Linux development environments have been tested and are known
to work. Running the rig on Windows may require extra work.

## Requirements
The rig runs as a NodeJS web server, and as such a globally accessible version of NodeJS must
be available. The LTS version (currently 6.11) is used to test against. NodeJS may be downloaded
[here](https://nodejs.org).

This documentation is bundled with the Overlay App Rig. The code can always be found on its
[GitHub page](https://github.com/muxy/overlay-app-rig) with specific
[tagged releases](https://github.com/muxy/overlay-app-rig/releases) available.

The NodeJS libraries required to run the rig can be installed by running `npm install` on the
command line.

## Running
To run the rig, simply run `PORT=4000 npm run dev`. This will start the server running on port
4000 on your local machine. You may change the port to suite your environment.

Once running, visit http://localhost:4000 to see the app rig. There are three tabs labeled
"Viewer App," "Broadcaster Config App" and "Broadcaster Live App." Clicking these tabs will show
the corresponding app you may build (only the viewer app is required) to have a complete Overlay
App ready to deploy on Twitch.

Each app also has an "Open in New Window" button, which will open the corresponding app in its own
window to ease debugging. The [VueJS Chrome Extension](https://github.com/vuejs/vue-devtools) is
also helpful.

## Editing
**IMPORTANT**: Before you begin to develop your app, you must obtain an app id from Muxy. This will
give you access to the backend and Muxy provided-services, and uniquely identify your app in the
Overlay. You can read more about this id and how to obtain one in the
[App Configuration](AppConfiguration.md) section.

All files you need to edit to customize your app are located under the `src/` directory. There you
will find several directories, each of which contains a demoable app. You can create any folder
here named after your app id and it will automatically be imported into the rig.

Each directory can have the following files or folders (using MuxyToastDemo as an example):

| Path                | Required | Purpose                                                        |
|---------------------|----------|----------------------------------------------------------------|
| assets/             | No       | Any files you need to import into your app (images/fonts/etc.) |
| config.json         | Yes      | Configuration information about your application               |
| ToastDemo.vue       | Yes      | The app viewers of a broadcast see and interact with           |
| ToastDemoConfig.vue | No       | The app a broadcaster will use to configure your application   |
| ToastDemoLive.vue   | No       | The app a broadcaster will interact with while streaming       |

These items are described in more detail below.

## Release
Once you have your app in a good state, you can build a production version to test. Running
`npm run build` in the project directory will create a production build in the `dist/`
folder for testing.

It will also run eslint on the code to ensure it follows our internal guidelines
for code corectness. If you have a good reason to override any of our linter settings, you can do so
with the
[eslint-disable](http://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)
commands.

Once you are satisfied with the results, simply zip up your app's folder within the `src/`
directory and send that file to us. We'll review your code and get back to you with next steps.

We will not accept any changes to code outside of your app's directory withing the `src/` folder,
however bug fixes are always appreciated and can be incorporated by opening a Pull Request on the
repo itself.

## Next Steps
 - [App Configuration](AppConfiguration.md)
 - [App Structure](AppStructure.md)
 - [App Appearance](AppAppearance.md)
 - [App Behavior](AppBehavior.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

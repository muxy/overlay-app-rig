# Getting Started
The code being made available to you is a stripped down version of Muxy's Overlay extension on
Twitch. This allows you to run it outside of Twitch proper, with all of the functionality you would
expect to be present in the final shipped form.

You can use this to develop "apps" for inclusion into the Overlay extension, without the need to
set up a full backend system and development environment. The skeleton comes as a NodeJS application
which runs a local web server on your machine.

**NOTE**: Currently only Mac OS X and Linux development environments have been tested and are known
to work. Running the skeleton on Windows may require extra work.

## Requirements
The skeleton runs as a NodeJS web server, and as such a globally accessible version of NodeJS must
be available. The LTS version (currently 6.11) is used to test against. NodeJS may be downloaded
[here](https://nodejs.org).

This documentation is bundled with the App Skeleton. The code can always be found on its
[GitHub page](https://github.com/muxy/overlay-app-skeleton) with specific
[tagged releases](https://github.com/muxy/overlay-app-skeleton/releases) available.

The NodeJS libraries required to run the skeleton can be installed by running `npm install` on the
command line.

## Running
To run the skeleton, simply run `PORT=4000 npm run dev`. This will start the server running on port
4000 on your local machine. You may change the port to suite your environment.

Once running, visit http://localhost:4000 to see the app skeleton. There are three tabs labeled
"Viewer App," "Broadcaster Config App" and "Broadcaster Live App." Clicking these tabs will show
the corresponding app you may build (only the viewer app is required) to have a complete Overlay
App ready to deploy on Twitch.

Each app also has an "Open in New Window" button, which will open the corresponding app in its own
window to ease debugging. The [VueJS Chrome Extension](https://github.com/vuejs/vue-devtools) is
also helpful.

## Editing
All files you need to edit to customize your app are located under the `src/` directory. There you
will find several directories, each of which contains a demoable app. You can create any folder
here named after your app id and it will automatically be imported into the skeleton.

Each directory can have the following files or folders (using MyAwesomeApp as an example):

| Path                   | Required | Purpose                                                        |
| ---------------------- | -------- | -------------------------------------------------------------- |
| assets/                | No       | Any files you need to import into your app (images/fonts/etc.) |
| config.json            | Yes      | Configuration information about your application               |
| MyAwesomeApp.vue       | Yes      | The app viewers of a broadcast see and interact with           |
| MyAwesomeAppConfig.vue | No       | The app a broadcaster will use to configure your application   |
| MyAwesomeAppLive.vue   | No       | The app a broadcaster will interact with while streaming       |

These items are described in more detail below.

## Release
Once you have your app in a good state, you can build a production version to test. `npm run lint`
will run eslint on your apps and check to ensure it follows our internal guidelines for code
correctness. If you have a good reason to override any of our linter settings, you can do so with
the
[eslint-disable](http://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments)
commands.

Running `npm run build` in the project directory will create a production build in the `dist/`
folder for testing.

Once you are satisfied with the results, simply zip up your app's folder within the `src/`
directory and send that file to us. We'll review your code and get back to you with next steps.

## Next Steps
 - [App Configuration](AppConfiguration.md)
 - [App Structure](AppStructure.md)
 - [App Appearance](AppAppearance.md)
 - [App Behavior](AppBehavior.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

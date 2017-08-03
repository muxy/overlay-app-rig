# App Structure
Individual apps are written as VueJs components. A full description of VueJS can be found
[here](https://vuejs.org), but we have abstracted most of the Vue-specific requirements out of the
individual apps.

Each app you create will contain the sections: The template, the styling and the code, as
detailed below.

## Template
The template is a standard HTML structure defined within the `<template>` block. You must define a
single element inside the template block eg. a div. Any valid HTML can appear here, with the
exception of external links and `<script>` blocks (see "[Code](#Code)" below for how to define
app behavior).

The full suite of VueJS bindings can be used here, although we recommend using the dynamic helpers
provided by the Muxy SDK (as described in [App State](AppState.md)).

```html
<template>
  <div class="toast-demo">
    <h1>This is an <em>Awesome</em> app!</h1>
    <img :src="imageURL" />
  </div>
</template>
```

## Style
Styling is done in the `<style>` section at the bottom of your vue component file.
[SCSS](http://sass-lang.com) is supported if you add the attribute `lang="scss"` to the
`<style>` tag.

```scss
$awesome-font-color: rebeccapurple;

.toasty {
  h1 {
    font-size: 2rem;
    em { color: $awesome-font-color; }
  }
}
```

## Code
Your app's behavior is defined in the `<script>` section of the file. This code is run through the
[Babel](https://babeljs.io) interpreter before being served, so any Stage-2 EcmaScript functionality
may be used. VueJS has a lot of useful functionality for data-binding reactive elements. All the
examples below assume you are using our app mixin, which provides many convenience wrappers around
state and event management. A full app that renders the template above could be just:

```javascript
import AppMixin from 'shared/js/app-mixin';

export default {
  name: 'muxy_toast_demo',
  mixins: [AppMixin]
};
```

The name field must match the id field in your config.json file.

App initialization can be done in the `created` function, which is called once the Overlay is
running and ready for your app. All SDK functionality and initial state will be available to your
app before this method is called:

```javascript
data: () => ({
  imageURL: ''
}),

created() {
  this.imageURL = this.option('image.url', 'https://lorempixel.com/64/64/animals');
}
```

## Assets
Non-code files (fonts, images, etc.) that you would like to include in your app, should be included
within your `<app>/assets` directory. You must import any assets you use for them to be bundled
into your app.

In Javascript:
```javascript
import ImageOfToast from './assets/images/toast.png';
```

Or in SCSS:
```scss
.toast-bg {
  background-image: url('./assets/images/ui/toastman.png');
}
```

## Next Steps
 - [App Configuration](AppConfiguration.md)
 - [App Appearance](AppAppearance.md)
 - [App Behavior](AppBehavior.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)

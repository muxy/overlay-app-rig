<template>
  <!-- Your app's template can only have a single top-level element. -->
  <div class="toast-demo-live">
    <!-- The ui-textbox elements are imported from KeenUI below. -->
    <ui-textbox label="Title" v-model="title"></ui-textbox>
    <ui-textbox label="Message" v-model="body"></ui-textbox>

    <div class="action">
      <!-- The button simply calles `sendMessageToAllViewers` each time it is clicked. -->
      <ui-button color="primary" raised @click="sendMessageToAllViewers">
        Send Message To All&nbsp;Viewers
      </ui-button>

      <!-- You can use the `option` helper to automatically update values in the DOM. -->
      <small>(with a random {{ option('image_type') }} image)</small>
    </div>
  </div>
</template>

<script>
// The <script> tag defines your app's behavior. It is run through babel to convert any ES6
// functionality to box-stock ES5.
//
// This app is the Broadcaster Live App. It defines a much smaller interface (286x200)
// that is only accessible by Broadcasters. It loads in a small tab on their Live Dashboard
// that has controls to quickly switch between apps currently running in the Overlay.
//
// It is expected that the broadcaster will have this page open while streaming and can
// use this interface to perform quick actions related to your app. This may include starting
// or stopping a poll, clearing state or (in this demo case) sending messages to users.

import AppMixin from 'shared/js/app-mixin';

// KeenUI is globally accessible to your app directly at the `window.KeenUI` object. You can
// use any KeenUI element on the broadcaster-facing pages: https://josephuspaye.github.io/Keen-UI
const UiButton = window.KeenUI.UiButton;
const UiTextbox = window.KeenUI.UiTextbox;

// This is the main access point to this app.
export default {
  // The name field must be your app id with `_live` appended to it.
  name: 'muxy_toast_demo_live',

  // The AppMixin provides access to several convenience methods, such as the powerful
  // `option` function.
  mixins: [AppMixin],

  // Components are other .vue files that define the appearance and behavior of DOM elements.
  // Here we import the button and textbox elements from KeenUI and make them accessible
  // to the DOM.
  components: { UiButton, UiTextbox },

  // Any fields added to your `data` object are accessible on `this` in your
  // class methods or directly in your template elements.
  data: () => ({
    title: '',
    body: '',
    imageType: ''
  }),

  // Any methods defined here can be called from your template elements.
  methods: {
    sendMessageToAllViewers() {
      // You can extract any channel options values your app has set using the `option` getter.
      // All options will be loaded from the server before any code in your app is called.
      const imageType = this.option('image_type', 'Animals');

      // The `muxy.send` function can be used by the broadcaster to send any messages and optional
      // payload to all viewers. Each viewer will receive this message, usually within seconds
      // of calling `send`.
      this.muxy.send('show_awesome_message', {
        title: this.title,
        body: this.body,
        image: `https://lorempixel.com/64/64/${imageType.toLowerCase()}#${new Date().getTime()}`
      });
    }
  }
};
</script>

<style lang="scss">
// The style section will be applied to your template above. We are setting `lang="scss"` so
// that we can use any SCSS features here and have them automatically converted to standard
// CSS before display.
.toast-demo-live {
  margin: 0;
  padding: 5px;

  .action {
    button { width: 100%; }

    small {
      color: #777;
      display: block;
      margin-top: 5px;
      text-align: center;
      text-transform: lowercase;
      width: 100%;
    }
  }
}
</style>
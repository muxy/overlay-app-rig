<template>
  <!-- Your app's template can only have a single top-level element. -->
  <div class="toasty">
    <div class="body">
      <!-- Mustache template tags will be populated using the exported class's `data` values. -->
      <h1>{{ title }}</h1>
      <h2>{{ body }}</h2>
    </div>
  </div>
</template>

<script>
// The <script> tag defines your app's behavior. It is run through babel to convert any ES6
// functionality to box-stock ES5.
//
// This app is the Viewer App. It defines the whole of your app's appearance and behavior
// that viewers of a stream will experience. It may have a movable window over the stream
// video, be showable/hideable, or change appearance depending upon actions occuring on
// the broadcaster's stream!

import AppMixin from 'shared/js/app-mixin';

// Any local resources (images/fonts/etc.) should be referenced from your JavaScript. Small
// sized files (~10KB) will be automatically inlined into the source code.
import DefaultImage from './assets/images/default-image.png';

// This is the main access point to this app.
export default {
  // The name field must be your blessed app id and be the same as appears in config.json.
  name: 'muxy_toast_demo',

  // The AppMixin provides access to several convenience methods, such as the powerful
  // `option` function.
  mixins: [AppMixin],

  // Any fields added to your `data` object are accessible on `this` in your
  // class methods or directly in your template elements.
  data: () => ({
    title: '',
    body: '',
    messageHandler: null
  }),

  // Any methods defined here can be called from your template elements.
  methods: {
    showIncomingMessage(data) {
      this.title = data.title;
      this.body = data.body;

      // You can query the DOM elements directly using the special member `this.$el` which
      // is a JavaScript reference to your parent DOM element (in this case <div class="toasty">).

      // First, remove all existing images from the DOM.
      const imgs = this.$el.getElementsByTagName('img');
      for (let i = imgs.length - 1; i >= 0; i -= 1) {
        imgs[i].parentNode.removeChild(imgs[i]);
      }

      // Manually create and insert new <img> element.
      const imgEl = document.createElement('img');
      imgEl.addEventListener('load', () => {
        // `this.show()` is made available from the AppMixin. It will toggle the visibility of your
        // app. Because we have defined this app as having a window of type `toast`, this will
        // cause it to drop down from the upper-left corner of the screen.
        this.show();

        // `this.hide()` is another helper method that runs the window hiding functionality. This
        // will change depending on your chosen window `type`, or you can control it manually.
        setTimeout(this.hide, 10000);
      });

      // Local resources can be loaded from disk by importing them and using the references
      // directly. Here we assume network failure 10% of the time and show a default image.
      if (Math.random() < 0.9) {
        imgEl.src = data.image;
      } else {
        imgEl.src = DefaultImage;
      }

      this.$el.insertBefore(imgEl, this.$el.querySelector('.body'));
    }
  },

  // The `created` method is called when your app is first loaded and ready to be populated
  // with data displayed.
  created() {
    // `this.muxy.listen()` will establish a callback handler to call whenever the provided event
    // is received by this viewer. It is scoped to your app id, so even if another app uses the
    // same message, there will be no cross-communication. Any JSON payload sent with the
    // event will be passed to the callback function as the first parameter.
    this.messageHandler = this.muxy.listen('show_awesome_message', this.showIncomingMessage);

    // If you need to do perform some custom logic when your application window is shown or hidden
    // but don't want to implement your own window type, you can use the integrated Vue messaging
    // system to get notified on `app-shown` and `app-hidden` events.
    this.$on('app-shown', () => {
      console.log('The window is about to be shown'); // eslint-disable-line no-console
    });

    // We also provide events for when your app's icon is clicked in the toolbar.
    this.$on('clicked', () => {
      this.showIncomingMessage({
        title: 'Example of an incoming message',
        body: 'This message was not actually sent to all viewers, just you!',
        image: DefaultImage
      });
    });
  },

  // The `destroyed` method is called when your app is being removed from overlay (not when
  // it is being hidden by the viewer or system, but completely removed). You should do any
  // cleanup necessary in this method.
  destroyed() {
    if (this.messageHandler) {
      // `this.muxy.unlisten()` removes the event callback handler. The callback you specified
      // in the `listen()` function will no longer be called when the specified event
      // is received.
      this.muxy.unlisten(this.messageHandler);
    }
  }
};
</script>

<style lang="scss">
// The style section will be applied to your template above. We are setting `lang="scss"` so
// that we can use any SCSS features here and have them automatically converted to standard
// CSS before display.
.toasty {
  background-color: rgba(40, 40, 40, 0.9);
  display: flex;
  align-items: center;
  user-select: none;

  img { verical-align: middle; }

  .body {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    vertical-align: middle;

    h1, h2 {
      color: white;
      margin: 0;
      max-width: 20vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    h1 { font-size: 14px; }
    h2 { font-size: 12px; }
  }
}
</style>
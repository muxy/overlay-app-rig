<template>
  <!-- Your app's template can only have a single top-level element. -->
  <div class="my-awesome-config">
    <!--
      The ui-select element is imported from KeenUI below.
      :options holds the array of possible string values a user may choose.
      v-model defines the `data` field to update with the chosen field.
      @change will fire the `save` method everytime the user changes option.
    -->
    <ui-select label="Toast Placement" :options="placementChoices"
      v-model="placement" @change="save">
    </ui-select>

    <ui-select label="Random Image Type" :options="imageTypeChoices"
      v-model="imageType" @change="save">
    </ui-select>

    <div class="image-demo">
      <!--
        The demoImageURL computed value will automatically update when the imageType field
        changes above.
      -->
      <img :src="demoImageURL" />
      <em>{{ demoImageURL }}</em>
    </div>
  </div>
</template>

<script>
// The <script> tag defines your app's behavior. It is run through babel to convert any ES6
// functionality to box-stock ES5.
//
// This app is the Broadcaster Config App. It defines a relatively large area (500 pixels
// high and almost as wide as the browser window) that only a broadcaster can see. It is
// their first entry point into an app and should show any configuration options available
// to them.
//
// It is not expected that broadcasters will keep this window open while they are streaming,
// however, so it should not be used for immediate notifications or actions.

import AppMixin from 'shared/js/app-mixin';

// KeenUI is globally accessible to your app directly at the `window.KeenUI` object. You can
// use any KeenUI element on the broadcaster-facing pages: https://josephuspaye.github.io/Keen-UI
const UiSelect = window.KeenUI.UiSelect;

const placementChoices = [
  'Top Left', 'Top Center', 'Top Right',
  'Middle Left', 'Middle Right',
  'Bottom Left', 'Bottom Center', 'Bottom Right'
];

const imageTypeChoices = [
  'Abstract', 'Animals', 'Business', 'Cats', 'City',
  'Fashion', 'Food', 'Nature', 'Nightlife', 'Sports',
  'People', 'Technics', 'Transport'
];

// This is the main access point to this app.
export default {
  // The name field must be your app id with `_config` appended to it.
  name: 'my_awesome_app_config',

  // The AppMixin provides access to several convenience methods, such as the powerful
  // `option` function.
  mixins: [AppMixin],

  // Components are other .vue files that define the appearance and behavior of DOM elements.
  // Here we import the select dropdown from KeenUI to make the image type selector look nicer.
  components: { UiSelect },

  // Any fields added to your `data` object are accessible on `this` in your class methods or
  // directly in your template elements.
  data: () => ({
    placementChoices,
    placement: placementChoices[1],
    imageTypeChoices,
    imageType: imageTypeChoices[1]
  }),

  // Computed functions are reactive and will automatically update when any data fields
  // they reference change.
  computed: {
    demoImageURL() {
      return `https://lorempixel.com/64/64/${this.imageType.toLowerCase()}`;
    }
  },

  // Any methods defined here can be called from your template elements.
  methods: {
    save() {
      this.saveChannelOptions({
        image_type: this.imageType,
        window: {
          position: this.placement
        }
      });
    }
  },

  // The `created` method is called when your app is first loaded and ready to be populated
  // with data displayed.
  created() {
    // You can extract the initial options values using the `option` getters. Channel options
    // will be loaded from the server before your `created` method is called.
    this.placement = this.option('placement', placementChoices[1]);
    this.imageType = this.option('image_type', imageTypeChoices[1]);

    // You can also pass a callback function to `option` which will be called with the new
    // value at the path every time it is updated. It will be called immediately with the
    // initial value of the option or `undefined` if none is set.
    this.option('image_type', (type) => {
      // eslint-disable-next-line no-console
      console.log(`Images of ${type.toLowerCase()}? I love images of ${type.toLowerCase()}!`);
    });
  }
};
</script>

<style lang="scss">
// The style section will be applied to your template above. We are setting `lang="scss"` so that
// we can use any SCSS features here and have them automatically converted to standard CSS
// before display.
.my-awesome-config {
  margin: 0;
  padding: 10px;

  .image-demo {
    margin: 10px 0;

    img {
      display: block;
      margin-bottom: 5px;
    }
  }
}
</style>
<template>
  <div class="my-awesome-config">
    <h1>Awesome Message Sending App<br>Configuration</h1>

    <ui-select label="Random Image Type" :options="imageTypeChoices"
      v-model="imageType" @change="saveOptions">
    </ui-select>

    <div class="image-demo">
      <img :src="demoImageURL" />
      <em>{{ demoImageURL }}</em>
    </div>

    <h1>Live Page</h1>
    <ui-textbox label="Title" v-model="title"></ui-textbox>
    <ui-textbox label="Message" v-model="body"></ui-textbox>

    <ui-button color="primary" raised @click="sendMessageToAllViewers">
      Send Message To All Viewers
    </ui-button>
  </div>
</template>

<script>
import AppMixin from 'shared/js/app-mixin';

const UiButton = window.KeenUI.UiButton;
const UiSelect = window.KeenUI.UiSelect;
const UiTextbox = window.KeenUI.UiTextbox;

const imageTypeChoices = [
  'Abstract', 'Animals', 'Business', 'Cats', 'City',
  'Fashion', 'Food', 'Nature', 'Nightlife', 'Sports',
  'People', 'Technics', 'Transport'
];

export default {
  name: 'my_awesome_app_config',
  mixins: [AppMixin],

  components: {
    UiButton,
    UiSelect,
    UiTextbox
  },

  data: () => ({
    imageTypeChoices,
    title: 'Awesome Message',
    body: 'This is a very important message for all viewers',
    imageType: ''
  }),

  computed: {
    demoImageURL() {
      return `https://lorempixel.com/64/64/${this.imageType.toLowerCase()}`;
    }
  },

  created() {
    this.imageType = this.option('my_awesome_app.image_type', imageTypeChoices[1]);
  },

  methods: {
    sendMessageToAllViewers() {
      this.muxy.broadcast('show_awesome_message', {
        title: this.title || 'Awesome Message',
        body: this.body || 'This is a very important message for all viewers',
        image: `https://lorempixel.com/64/64/${this.imageType.toLowerCase()}#${new Date().getTime()}`
      });
    },

    saveOptions() {
      console.log('Saving options');
      const my_awesome_app = {
        image_type: this.imageType
      };
      console.log({ my_awesome_app });

      this.$emit('save', { my_awesome_app });
    }
  }
};
</script>

<style lang="scss">
.my-awesome-config {
  margin: 0;
  padding: 10px;

  h1 {
    margin: 0;
    text-align: center;
  }

  .image-demo {
    margin: 10px 0;

    img {
      display: block;
      margin-bottom: 5px;
    }
  }

  input {
    display: block;
  }
}
</style>
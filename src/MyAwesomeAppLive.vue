<template>
  <div class="my-awesome-live">
    <span>Current Image Category: {{ imageType }}</span>
    <ui-textbox label="Title" v-model="title"></ui-textbox>
    <ui-textbox label="Message" v-model="body"></ui-textbox>

    <ui-button color="primary" raised @click="sendMessageToAllViewers">
      Send Message To All&nbsp;Viewers
    </ui-button>
  </div>
</template>

<script>
import AppMixin from 'shared/js/app-mixin';

const UiButton = window.KeenUI.UiButton;
const UiTextbox = window.KeenUI.UiTextbox;

export default {
  name: 'my_awesome_app_live',
  mixins: [AppMixin],

  components: {
    UiButton,
    UiTextbox
  },

  data: () => ({
    title: '',
    body: '',
    imageType: '',
  }),

  created() {
    this.imageType = this.option('image_type', 'Animals');
    this.optionWatch('image_type', (n) => {
      this.imageType = n;
    });
  },

  methods: {
    sendMessageToAllViewers() {
      const imageType = this.option('image_type', 'Animals');

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
.my-awesome-live {
  margin: 0;
  padding: 10px;
}
</style>
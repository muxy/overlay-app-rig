<template>
  <div class="my-awesome-config">
    <h1>Awesome Message Sending App Configuration</h1>

    <ui-select label="Random Image Type" :options="imageTypeChoices"
      v-model="imageType" @change="saveOptions">
    </ui-select>

    <input type="text" placeholder="Title" v-model="title" />
    <input type="text" placeholder="Body" v-model="body" />
    <button @click="sendMessageToAllViewers">Send Message To All Viewers</button>
  </div>
</template>

<script>
import AppMixin from 'shared/js/app-mixin';

const UiButton = window.KeenUI.UiButton;
const UiSelect = window.KeenUI.UiSelect;

const imageTypeChoices = [
  { label: 'Abstract', value: 'abstract' },
  { label: 'Animals', value: 'animals' },
  { label: 'City', value: 'city' }
];

export default {
  name: 'my_awesome_app_config',
  mixins: [AppMixin],

  components: {
    UiButton,
    UiSelect
  },

  data: () => ({
    imageTypeChoices,
    title: 'Awesome Message',
    body: 'This is a very important message for all viewers',
    imageType: 'animals'
  }),

  created() {
    this.imageType = this.option('my_awesome_app', 'animals');
  },

  methods: {
    sendMessageToAllViewers() {
      this.muxy.broadcast('show_awesome_message', {
        title: this.title || 'Awesome Message',
        body: this.body || 'This is a very important message for all viewers',
        image: `https://lorempixel.com/64/64/${this.imageType}#${new Date().getTime()}`
      });
    },

    saveOptions() {
      const my_awesome_app = {
        image_type: this.imageType
      };

      this.$emit('save', { my_awesome_app });
    }
  }
};
</script>

<style lang="scss">
.my-awesome-config {
  margin: 10px;

  h1 {
    text-align: center;
  }

  input {
    display: block;
  }
}
</style>
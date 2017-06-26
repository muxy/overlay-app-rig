<template>
  <div class="my-awesome-config">
    <ui-select label="Random Image Type" :options="imageTypeChoices"
      v-model="imageType" @change="save">
    </ui-select>

    <div class="image-demo">
      <img :src="demoImageURL" />
      <em>{{ demoImageURL }}</em>
    </div>
  </div>
</template>

<script>
import AppMixin from 'shared/js/app-mixin';
const UiSelect = window.KeenUI.UiSelect;

const imageTypeChoices = [
  'Abstract', 'Animals', 'Business', 'Cats', 'City',
  'Fashion', 'Food', 'Nature', 'Nightlife', 'Sports',
  'People', 'Technics', 'Transport'
];

export default {
  name: 'my_awesome_app_config',
  mixins: [AppMixin],

  components: {
    UiSelect
  },

  data: () => ({
    imageTypeChoices,
    imageType: ''
  }),

  computed: {
    demoImageURL() {
      return `https://lorempixel.com/64/64/${this.imageType.toLowerCase()}`;
    }
  },

  created() {
    this.imageType = this.option('image_type', imageTypeChoices[1]);
    this.optionWatch('image_type', (n) => {
      this.imageType = n;
    });
  },

  methods: {
    save() {
      this.saveChannelOptions({
        image_type: this.imageType
      });
    }
  }
};
</script>

<style lang="scss">
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
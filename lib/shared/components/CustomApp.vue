<template>
  <div class="app">
    <window v-if="window" :show="show" :title="name" :center="window.center"
      :min-width="window.minWidth" :min-height="window.minHeight"
      :auto-height="window.autoHeight" :auto-width="window.autoWidth"
      :movable="window.movable" :id="id">
      <component :id="id" :is="id" :parent-data="$data" @alter-window="alterWindow" :show="show"></component>
    </window>

    <component v-else :id="id" :is="id" :parent-data="$data" :show="show"></component>
  </div>
</template>

<script>
import Window from 'shared/components/Window';
import _ from 'lodash';

import DevApp from 'app//* @echo viewer */';

let localComponents = {
  Window,
  '/* @echo id */': DevApp
};

export default {
  name: 'custom-app',
  components: localComponents,

  data: () => ({
    show: false,
    enabled: false,
    notification: false,
    window: {
      autoHeight: true,
      autoWidth: true
    }
  }),

  methods: {
    alterWindow(data) {
      this.window = _.merge(this.window, data);
    }
  }
};
</script>

<style lang="scss">
</style>

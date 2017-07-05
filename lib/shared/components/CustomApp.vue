<template>
  <div class="app">
    <component v-if="windowType === WINDOW_TYPES.NONE" :id="id" :is="componentType" :parent-data="$data" :show="show"></component>

    <movable-window v-else-if="windowType === WINDOW_TYPES.MOVABLE" :id="id" :show="show" :title="name" :options="windowOptions">
      <component :id="id" :is="componentType" :parent-data="$data" :show="show"></component>
    </movable-window>

    <center-window v-else-if="windowType === WINDOW_TYPES.CENTER" :id="id" :show="show" :title="name" :options="windowOptions">
      <component :id="id" :is="componentType" :parent-data="$data" :show="show"></component>
    </center-window>

    <toast-window v-else-if="windowType === WINDOW_TYPES.TOAST" :id="id" :show="show" :options="windowOptions">
      <component :id="id" :is="componentType" :parent-data="$data" :show="show"></component>
    </toast-window>

    <popper-window v-else-if="windowType === WINDOW_TYPES.POPPER" :id="id" :show="show" :options="windowOptions">
      <component :id="id" :is="componentType" :parent-data="$data" :show="show"></component>
    </popper-window>
  </div>
</template>

<script>
import CenterWindow from 'shared/components/windows/CenterWindow';
import MovableWindow from 'shared/components/windows/MovableWindow';
import PopperWindow from 'shared/components/windows/PopperWindow';
import ToastWindow from 'shared/components/windows/ToastWindow';

import _ from 'lodash';

import DevApp from 'app//* @echo viewer */';

let localComponents = {
  CenterWindow,
  MovableWindow,
  PopperWindow,
  ToastWindow,
  '/* @echo id */': DevApp
};

const WINDOW_TYPES = {
  CENTER: 'center',
  MOVABLE: 'movable',
  NONE: 'none',
  POPPER: 'popper',
  TOAST: 'toast'
};

export default {
  name: 'custom-app',
  components: localComponents,

  data: () => ({
    WINDOW_TYPES,
    show: false,
    enabled: false,
    notification: false,
    windowOptions: {}
  }),

  computed: {
    componentType() {
      return this.type || this.id;
    },

    windowType() {
      if (typeof this.window === 'object') {
        return this.window.type;
      }

      return this.window || WINDOW_TYPES.MOVABLE;
    }
  },

  created() {
    const key = `apps.${this.id}.window`;

    this.windowOptions = (typeof this.window === 'object') ? this.window : {};
    this.windowOptions = this.$store.getters.option(key, this.windowOptions);

    this.$store.watch(() => this.$store.getters.option(key), (windowOptions) => {
      this.windowOptions = windowOptions;
    });
  }
};
</script>

<style lang="scss">
</style>

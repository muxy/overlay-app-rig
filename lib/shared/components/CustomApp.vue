<template>
  <div class="app">
    <component :is="windowType" :shown="show" :options="windowOptions">
      <component :id="id" :is="componentType" :enabled="enabled" :shown="show" :clicked="clicked"></component>
    </component>
  </div>
</template>

<script>
import _ from 'lodash';

import CenterWindow from 'shared/components/windows/CenterWindow';
import MovableWindow from 'shared/components/windows/MovableWindow';
import NoneWindow from 'shared/components/windows/NoneWindow';
import PopperWindow from 'shared/components/windows/PopperWindow';
import ToastWindow from 'shared/components/windows/ToastWindow';

// Import Viewer components for all dev apps.
/* DI:ImportViewerApps */

// Set app components.
const appComponents = /* DI:ViewerAppComponents */;

let localComponents = _.extend(appComponents, {
  CenterWindow,
  MovableWindow,
  NoneWindow,
  PopperWindow,
  ToastWindow
});

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
    windowOptions: {}
  }),

  computed: {
    componentType() {
      return this.type || this.id;
    },

    windowType() {
      if (typeof this.window === 'object') {
        return `${this.window.type}-window`;
      }

      return `${this.window}-window` || `${WINDOW_TYPES.MOVABLE}-window`;
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

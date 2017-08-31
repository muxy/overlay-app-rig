<template>
  <div class="popper">
    <slot></slot>
  </div>
</template>

<script>
import Popper from 'popper.js';

import { Mutations } from 'shared/js/store';

export default {
  name: 'popper-window',
  props: {
    shown: {
      type: Boolean,
      required: false,
      default: false
    },
    placement: {
      type: String,
      required: false,
      default: 'auto-end'
    },
    options: {
      type: Object,
      required: false,
      default: {}
    }
  },

  data: () => ({
    popperEl: null
  }),

  watch: {
    shown(showing) {
      if (showing) {
        this.$nextTick(() => {
          this.destroyPopper();
          this.init();
          document.addEventListener('click', this.closePopper);
        });
      } else {
        this.destroyPopper();
        document.removeEventListener('click', this.closePopper);
      }
    }
  },

  mounted() {
    if (this.shown) {
      this.init();
    }
  },

  unmounted() {
    this.destroyPopper();
  },

  methods: {
    init() {
      const triggerEl = document.querySelector(`#${this.options.id}.toolbar-app`);
      this.popperEl = new Popper(triggerEl, this.$el, {
        placement: this.placement,
        removeOnDestroy: false
      });

      document.querySelector('.app-container').appendChild(this.$el);
    },

    destroyPopper() {
      if (this.popperEl) {
        document.querySelector('.app-container').removeChild(this.$el);
        this.popperEl.destroy();
        this.popperEl = null;
      }
    },

    closePopper(event) {
      // if the click was on the trigger element, let the default click behavior handle close.
      const triggerEl = document.querySelector(`#${this.options.id}.toolbar-app`);
      if (event.target !== triggerEl && !triggerEl.contains(event.target)) {
        this.$store.commit(Mutations.HIDE_APP, { appID: this.options.id });
      }
    }
  }
};
</script>

<style lang="scss">
body.mouse-out .popper {
  opacity: 0.0;
}

.popper {
  opacity: 0.2;
  transition: opacity 0.5s;
  z-index: 1000;

  &:hover {
    opacity: 0.9 !important;
  }
}
</style>

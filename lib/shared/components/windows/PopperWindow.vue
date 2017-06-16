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
    id: {
      type: String,
      required: true
    },
    show: {
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
    show(showing) {
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
    if (this.show) {
      this.init();
    }
  },

  unmounted() {
    this.destroyPopper();
  },

  methods: {
    init() {
      const triggerEl = document.querySelector(`#${this.id}.toolbar-app`);
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

    closePopper() {
      this.$store.commit(Mutations.HIDE_APP, { appID: this.id });
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

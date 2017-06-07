<template>
  <div class="popper">
    <slot></slot>
  </div>
</template>

<script>
import Popper from 'popper.js';

export default {
  name: 'popper',
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    placement: {
      type: String,
      required: false,
      default: 'right-end'
    },
    popper: null,
    content: {
      type: String,
      required: false,
      default: ''
    }
  },

  data: () => ({
    popperID: null,
    popperEl: null
  }),

  watch: {
    show(showing) {
      if (showing) {
        this.$nextTick(() => {
          this.init();
        });
      }
    },

    popper() {
      if (this.popper) {
        this.destroyPopper();
        this.init();
      } else {
        this.destroyPopper();
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.show) {
        this.init();
      }
    });
  },

  unmounted() {
    this.destroyPopper();
  },

  methods: {
    init() {
      if (this.popper) {
        this.popperEl = new Popper(this.popper, this.$el, {
          placement: this.placement,
          removeOnDestroy: true
        });
      }
    },

    destroyPopper() {
      if (this.popperEl) {
        this.popperEl.destroy();
        this.popperEl = null;
      }
    },

    uuid4() {
      // Usually a bitwise operator is a mistyped '&&', etc. So disable the error
      // here, but keep it globally.
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * (16 | 0); // eslint-disable-line no-bitwise
        const v = c === 'x' ? r : (r & (0x3 | 0x8)); // eslint-disable-line no-bitwise
        return v.toString(16);
      });
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

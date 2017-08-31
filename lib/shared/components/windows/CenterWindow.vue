<template>
  <div class="window center-window" :style="style">
    <div class="header">
      <h1 class="title">{{ options.title }}</h1>
    </div>

    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import WindowMixin from './window-mixin';

// MINIMUM_EXTENSION_WIDTH defines the smallest overall size of the
// extension for windows to scale and position correctly.
const MINIMUM_EXTENSION_WIDTH = 300;

export default {
  name: 'center-window',
  mixins: [WindowMixin],

  props: {
    shown: { type: Boolean, default: false },
    options: { type: Object, required: true }
  },

  data: () => ({
    x: 0, y: 0, xp: 0, yp: 0
  }),

  computed: {
    style() {
      return {
        visibility: this.shown ? '' : 'hidden',
        left: `${this.x}px`,
        top: `${this.y}px`
      };
    }
  },

  methods: {
    recenter() {
      const bounds = document.querySelector('.app-container').getBoundingClientRect();
      const dims = this.$el.getBoundingClientRect();
      this.x = (bounds.width / 2) - (dims.width / 2);
      this.y = (bounds.height / 2) - (dims.height / 2);

      // Store percentages for next resize event.
      this.xp = this.x / bounds.width;
      this.yp = this.y / bounds.height;
    },

    moveOnScreen() {
      if (!this.shown) {
        return;
      }

      const bounds = document.querySelector('.app-container').getBoundingClientRect();

      if (bounds.width < MINIMUM_EXTENSION_WIDTH) {
        return;
      }

      const dims = this.$el.getBoundingClientRect();

      let x = this.x;
      let y = this.y;

      // Check for last value percentages and try to maintain.
      if (this.xp > 0 && this.yp > 0) {
        x = this.xp * bounds.width;
        y = this.yp * bounds.height;
      }

      // Bounds check.
      this.x = Math.floor(Math.max(0, Math.min(x, bounds.width - dims.width)));
      this.y = Math.floor(Math.max(0, Math.min(y, bounds.height - dims.height)));

      // Store percentages for next resize event.
      this.xp = this.x / bounds.width;
      this.yp = this.y / bounds.height;
    }
  },

  mounted() {
    document.querySelector('.app-container').appendChild(this.$el);
    this.recenter();

    this.$root.$on('resize', () => {
      this.recenter();
      this.moveOnScreen();
    });

    // Prevent clicks on the window from reaching the main app.
    this.$el.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    this.$el.addEventListener('dblclick', (event) => {
      event.stopPropagation();
    });
  }
};
</script>

<style lang="scss">
.center-window {
  position: fixed;
  z-index: 10;

  &:hover {
    .header, .resize {
      opacity: 1;
    }
  }

  .header {
    background-color: #222;
    opacity: 0;

    position: absolute;
    top: -19px;
    left: 0;
    z-index: 30;

    &.force-show {
      opacity: 1;
    }

    .title {
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      line-height: 14px;
      margin: 2px 4px;
      text-transform: uppercase;
      user-select: none;
    }
  }

  .body {
    overflow: hidden;
    height: 100%;
    width: 100%;
    z-index: 20;
  }
}
</style>

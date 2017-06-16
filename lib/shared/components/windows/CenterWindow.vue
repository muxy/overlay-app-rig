<template>
  <div class="center-window" :style="style">
    <div class="header">
      <h1 class="title">{{ title }}</h1>
    </div>

    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// MINIMUM_EXTENSION_WIDTH defines the smallest overall size of the
// extension for windows to scale and position correctly.
const MINIMUM_EXTENSION_WIDTH = 300;

export default {
  name: 'center-window',

  props: {
    id: { type: String, required: true },
    show: { type: Boolean, default: false },
    title: { type: String, required: true }
  },

  data: () => ({
    x: 0, y: 0, xp: 0, yp: 0
  }),

  computed: {
    style() {
      return {
        visibility: this.show ? '' : 'hidden',
        left: `${this.x}px`,
        top: `${this.y}px`
      };
    }
  },

  watch: {
    show(showing) {
      if (showing) {
        this.recenter();

        this.$store.state.analytics.sendEvent('show', this.id, 1);
      } else {
        this.$store.state.analytics.sendEvent('hide', this.id, 1);
      }
    }
  },

  methods: {
    recenter() {
      const bounds = document.querySelector('.app-container').getBoundingClientRect();
      const dims = this.$el.getBoundingClientRect();
      this.x = (bounds.width / 2) - (dims.width / 2);
      this.y = (bounds.height / 2) - (dims.height / 2);
    },

    moveOnScreen() {
      if (!this.show) {
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

    this.$root.$on('resize', this.moveOnScreen.bind(this));

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

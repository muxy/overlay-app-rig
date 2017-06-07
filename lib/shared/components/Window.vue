<template>
  <div class="window" :style="style" :class="{ show: show }">
    <div class="header">
      <h1 class="title">{{ title }}</h1>
    </div>

    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import interact from 'interactjs';

// MINIMUM_EXTENSION_WIDTH defines the smallest overall size of the
// extension for windows to scale and position correctly.
const MINIMUM_EXTENSION_WIDTH = 300;

export default {
  name: 'window',

  props: {
    show: { type: Boolean, default: false },
    title: { type: String, required: true },
    id: { type: String, required: true },

    movable: { type: Boolean, default: true },
    resizeable: { type: Boolean, default: false },
    center: { type: Boolean, default: false },

    autoHeight: { type: Boolean, default: false },
    autoWidth: { type: Boolean, default: false },

    minWidth: { type: Number, default: 0 },
    minHeight: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 }
  },

  data: () => ({
    x: 0, y: 0, w: 0, h: 0, xp: 0, yp: 0
  }),

  watch: {
    show(showing) {
      if (showing) {
        document.querySelector('.app-container').appendChild(this.$el);
        this.$store.state.analytics.sendEvent('show', this.id, 1);
      } else {
        document.querySelector('.app-container').removeChild(this.$el);
        this.$store.state.analytics.sendEvent('hide', this.id, 1);
      }
    },

    center(isCentered) {
      this.w = this.minWidth || 100;
      this.h = this.minHeight || 100;
      if (isCentered) {
        const bounds = document.querySelector('.app-container').getBoundingClientRect();
        this.x = (bounds.width / 2) - (this.w / 2);
        this.y = (bounds.height / 2) - (this.h / 2);
      }
    }
  },

  methods: {
    width() {
      const bounds = document.querySelector('.app-container').getBoundingClientRect();
      let w = this.w;
      w = Math.min(w, this.maxWidth);
      w = Math.max(w, this.minWidth);
      w = Math.min(w, bounds.width);
      this.w = w;
      return w;
    },

    height() {
      const bounds = document.querySelector('.app-container').getBoundingClientRect();
      let h = this.h;
      h = Math.min(h, this.maxHeight);
      h = Math.max(h, this.minHeight);
      h = Math.min(h, bounds.height);
      this.h = h;
      return h;
    },

    offset() {
      return {
        x: this.x,
        y: this.y
      };
    },

    bounds() {
      return {
        ...this.offset(),
        width: this.width(),
        height: this.height()
      };
    },

    recenter() {
      const bounds = document.querySelector('.app-container').getBoundingClientRect();
      this.x = (bounds.width / 2) - (this.w / 2);
      this.y = (bounds.height / 2) - (this.h / 2);
    },

    moveOnScreen() {
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

  computed: {
    style() {
      const bounds = this.bounds();
      const res = {
        left: `${bounds.x}px`,
        top: `${bounds.y}px`,
        height: `${bounds.height}px`,
        width: `${bounds.width}px`
      };

      if (this.autoHeight) {
        res.height = undefined;
      }

      if (this.autoWidth) {
        res.width = undefined;
      }

      return res;
    }
  },

  created() {
    this.w = this.minWidth || 100;
    this.h = this.minHeight || 100;
  },

  mounted() {
    if (this.movable) {
      interact(this.$el)
        .draggable({
          inertia: true,
          context: this.$el,

          restrict: {
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },

          onmove: (event) => {
            this.x += event.dx;
            this.y += event.dy;
          },

          onend: () => {}
        });
    }

    if (this.resizeable) {
      interact(this.$el)
        .resizable({
          preserveAspectRatio: true,
          edges: {
            left: false,
            right: '.resize',
            bottom: '.resize',
            top: false
          },
          invert: 'reposition'
        })
        .on('resizemove', (event) => {
          this.w = event.rect.width;
          this.h = event.rect.height;

          this.$emit('resize', this.w, this.h);
        });
    }

    if (this.center) {
      this.recenter();
    }

    this.$root.$on('resize', this.moveOnScreen.bind(this));

    this.clickHandler = this.$el.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  },

  unmounted() {
    window.removeEventListener(this.clickHandler);
  }
};
</script>

<style lang="scss">
.window {
  display: none;
  position: fixed;
  z-index: 10;

//  backface-visibility: hidden;
//  transform: translateZ(0) scale(1.0, 1.0);

  &.show { display: block; }

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

  .resize {
    height: 10px;
    width: 10px;

    background-color: #222;
    cursor: pointer;
    opacity: 0;
    transition: opacity 1s;

    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>

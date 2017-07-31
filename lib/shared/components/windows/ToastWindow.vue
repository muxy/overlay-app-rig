<template>
  <div class="toast" v-on:open="animateOnScreen">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'toast-window',

  props: {
    shown: { type: Boolean, default: false },
    options: { type: Object, required: true }
  },

  computed: {
    position() {
      // Returns the positioning percentage [0-1] needed to animate the toast
      // window for the user-specified position.

      let out = {
        // `position` is the offset of the windows bounds to set the toast window.
        // [0, 0] is upper-left of the screen, [1, 1] is lower-right.
        position: [0, 0],

        // `anchorStart` is the position within the toast window to start the animation.
        // [0, 0] is the window upper-left, [1, 1] is lower-right.
        anchorStart: [0, 1],

        // `anchorEnd` is the position within the toast window to end the animation.
        // [0, 0] is the window upper-left, [1, 1] is lower-right.
        anchorEnd: [0, 0]
      };

      const pos = (this.options.position || 'top left').toLowerCase();

      switch (pos) {
        case 'top left':
          out = {
            position: [0, 0],
            anchorStart: [0, 1],
            anchorEnd: [0, 0]
          };
          break;

        case 'top center':
          out = {
            position: [0.5, 0],
            anchorStart: [0.5, 1],
            anchorEnd: [0.5, 0]
          };
          break;

        case 'top right':
          out = {
            position: [1, 0],
            anchorStart: [1, 1],
            anchorEnd: [1, 0]
          };
          break;

        case 'middle left':
          out = {
            position: [0, 0.5],
            anchorStart: [1, 0.5],
            anchorEnd: [0, 0.5]
          };
          break;

        case 'middle right':
          out = {
            position: [1, 0.5],
            anchorStart: [0, 0.5],
            anchorEnd: [1, 0.5]
          };
          break;

        case 'bottom left':
          out = {
            position: [0, 1],
            anchorStart: [0, 0],
            anchorEnd: [0, 1]
          };
          break;

        case 'bottom center':
          out = {
            position: [0.5, 1],
            anchorStart: [0.5, 0],
            anchorEnd: [0.5, 1]
          };
          break;

        case 'bottom right':
          out = {
            position: [1, 1],
            anchorStart: [1, 0],
            anchorEnd: [1, 1]
          };
          break;

        default:
      }

      return out;
    }
  },

  watch: {
    shown(showing) {
      if (showing) {
        this.animateOnScreen();
      } else {
        this.animateOffScreen();
      }
    }
  },

  methods: {
    animateOnScreen() {
      const pos = this.position;

      let bounds = document.querySelector('body').getBoundingClientRect();
      bounds = [bounds.width * pos.position[0], bounds.height * pos.position[1]];

      const dims = this.$el.getBoundingClientRect();
      const start = [bounds[0] - (dims.width * pos.anchorStart[0]), bounds[1] - (dims.height * pos.anchorStart[1])];
      const end = [bounds[0] - (dims.width * pos.anchorEnd[0]), bounds[1] - (dims.height * pos.anchorEnd[1])];

      window.anime({
        targets: this.$el,
        left: {
          value: [start[0], end[0]],
          duration: 500,
          easing: 'easeInOutQuart'
        },
        top: {
          value: [start[1], end[1]],
          duration: 500,
          easing: 'easeInOutQuart'
        }
      });
    },

    animateOffScreen() {
      const pos = this.position;

      let bounds = document.querySelector('body').getBoundingClientRect();
      bounds = [bounds.width * pos.position[0], bounds.height * pos.position[1]];

      const dims = this.$el.getBoundingClientRect();
      const start = [bounds[0] - (dims.width * pos.anchorStart[0]), bounds[1] - (dims.height * pos.anchorStart[1])];
      const end = [bounds[0] - (dims.width * pos.anchorEnd[0]), bounds[1] - (dims.height * pos.anchorEnd[1])];

      window.anime({
        targets: this.$el,
        left: {
          value: [end[0], start[0]],
          duration: 500,
          easing: 'easeInOutQuart'
        },
        top: {
          value: [end[1], start[1]],
          duration: 500,
          easing: 'easeInOutQuart'
        }
      });
    }
  },

  mounted() {
    document.querySelector('.app-container').appendChild(this.$el);

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
.toast {
  position: fixed;
  left: 100vw;
  top: 100vh;
  z-index: 900;
}
</style>

<template>
  <div class="toast" v-on:open="animateOnScreen">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'toast-window',

  props: {
    id: { type: String, required: true },
    show: { type: Boolean, default: false }
  },

  data: () => ({
    location: 'top middle'
  }),

  watch: {
    show(showing) {
      if (showing) {
        this.animateOnScreen();
      } else {
        this.animateOffScreen();
      }
    }
  },

  methods: {
    animateOnScreen() {
      const dims = this.$el.getBoundingClientRect();
      window.anime({
        targets: this.$el,
        top: {
          value: [-dims.height, 0],
          duration: 500,
          easing: 'easeInOutQuart'
        },
        complete: () => {
          this.$store.state.analytics.sendEvent('show', this.id, 1);
        }
      });
    },

    animateOffScreen() {
      const dims = this.$el.getBoundingClientRect();
      window.anime({
        targets: this.$el,
        top: {
          value: [0, -dims.height - 10],
          duration: 500,
          easing: 'easeInOutQuart'
        },
        complete: () => {
          this.$store.state.analytics.sendEvent('hide', this.id, 1);
        }
      });
    }
  },

  mounted() {
    const dims = this.$el.getBoundingClientRect();
    this.$el.style.top = -dims.height - 10;

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
  z-index: 900;

  &.animate-in {
    transition: margin 1s;
  }
}
</style>

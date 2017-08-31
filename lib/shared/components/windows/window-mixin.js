export default {
  watch: {
    shown(showing) {
      if (showing) {
        const header = this.$el.querySelector('.window > .header');
        if (header) {
          header.classList.add('force-show');
          setTimeout(() => {
            header.classList.remove('force-show');
          }, 1500);
        }
      }
    }
  }
};

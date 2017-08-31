<template>
  <div class="toolbar-container" :class="toolbarPosition">
    <div class="toolbar">
      <ul class="items">
        <toolbar-app v-for="a in activeApps" :app="a" :key="a.id"></toolbar-app>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ToolbarApp from './ToolbarApp';

export default {
  name: 'toolbar',
  components: { ToolbarApp },

  computed: {
    ...mapGetters(['option', 'activeApps']),

    toolbarPosition() {
      return this.option('toolbar.position') || 'right';
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$el.querySelectorAll('.items li').forEach((appEl) => {
        appEl.classList.add('load-animation');
      });
    });
  }
};
</script>

<style lang="scss">
body.mouse-in .toolbar-container .items .toolbar-app {
  opacity: 0.5;
}

.toolbar-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;

  // Configurable toolbar positioning.
  &.left { left: 0; }
  &.right { right: 0; }

  // Items should be mostly transparent until user hovers over the toolbar.
  & {
    .items .toolbar-app {
      opacity: 0.0;
      transition: opacity 0.5s;
    }

    &:hover .items .toolbar-app {
      opacity: 0.9 !important;
    }
  }

  .toolbar {
    height: 100%;
    padding: 0;
    position: relative;

    .items {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li + li {
        margin-top: 1px;
      };

      .logo .item {
        font-family: muxy;

        // https://fvsch.com/code/css-locks/
        font-size: calc(1.5rem + ((10vw - 5em)/10));

        &:after { content: 'e'; }
      }

      .load-animation {
        animation: loadAnimationFrames 2s ease-in-out;
        animation-iteration-count: 2;
        animation-direction: alternate;
      }

      @for $i from 1 through 20 {
        $delay: $i * 100ms;
        .load-animation:nth-child(#{$i}) {
          animation-delay: #{$delay};
        }
      }

      @keyframes loadAnimationFrames {
        0% { opacity: 0.2; background-color: #222222; }
        20% { opacity: 1.0; background-color: #5FADC3; }
        40% { opacity: 1.0; background-color: #4C8889; }
        60% { opacity: 1.0; background-color: #629B95; }
        80% { opacity: 1.0; background-color: #93B171; }
        100% { opacity: 1.0; background-color: #EAF896; }
      }
    }
  }
}
</style>

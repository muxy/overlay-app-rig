<template>
  <div>
    <div class="toolbar-container" :class="toolbarPosition">
      <div class="toolbar">
        <ul class="items">
          <li class="toolbar-app logo" ref="logo" key="logo" @click="toggleTwichIDShareMessage">
            <ui-tooltip trigger="logo" position="left middle">Overlay by Muxy</ui-tooltip>
            <div class="item"></div>
          </li>

          <toolbar-app v-for="a in activeApps" :data="a" :id="a.id" :name="a.name" :key="a.id"
            :icon="a.icon" :notification="a.notification"></toolbar-app>
        </ul>
      </div>
    </div>

    <!-- Dialog explaining ID sharing -->
    <div class="share-twitch-id" :class="{ show: showTwitchIDShareMessage }">
      <div class="close" @click="toggleTwichIDShareMessage"><i class="fa fa-fw fa-close"></i></div>

      <div v-if="userState === 'anonymous'">
        <p>
          You have not granted permissions to Muxy.
        </p>
        <p>
          Log in to Twitch and click the "Grant Permissions" button in the upper
          right corner of the player to access enhanced features like a faster
          confetti cooldown and more voting weight!
        </p>
      </div>

      <div v-else-if="userState === 'authed'">
        <p>
          You have not granted permissions to Muxy.
        </p>
        <p>
          Click the "Grant Permissions" button in the upper right corner of the
          player to access enhanced features like a faster confetti cooldown and
          more voting weight!
        </p>
      </div>

      <div v-else-if="userState === 'shared'">
        <p>
          Thank you for granting permissions to Muxy!
        </p>
        <p>
          You now have access to enhanced features like a faster confetti
          cooldown and more voting weight!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import ToolbarApp from './ToolbarApp';

export default {
  name: 'toolbar',
  components: { ToolbarApp },
  data: () => ({
    showTwitchIDShareMessage: false
  }),

  computed: {
    ...mapGetters(['option', 'activeApps']),
    ...mapState({
      twitchID: state => state.user.twitchID
    }),

    userState() {
      const user = this.$store.getters.user;

      if (user.twitchID) {
        return 'shared';
      } else if (user.twitchOpaqueID && user.twitchOpaqueID[0] === 'U') {
        return 'authed';
      }

      return 'anonymous';
    },

    toolbarPosition() {
      return this.option('toolbar.position') || 'middle right';
    }
  },

  methods: {
    toggleTwichIDShareMessage(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.showTwitchIDShareMessage = !this.showTwitchIDShareMessage;
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
  z-index: 1000;

  // Configurable toolbar positioning.
  &.top { top: 0; }
  &.middle { top: 50%; transform: translateY(-50%); }
  &.bottom { bottom: 0; }
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
        color: white;
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

.share-twitch-id {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding-top: 10px;
  user-select: none;

  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1200;

  min-width: 275px;
  max-width: 400px;

  &.show {
    display: block;
  }

  p {
    color: #000;
    margin: 0;
    padding: 10px;
  }

  .close {
    cursor: pointer;
    font-size: 18px;

    position: absolute;
    top: 0;
    right: 0;
    height: 23px;
    width: 23px;

    transition: background-color 0.5s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>

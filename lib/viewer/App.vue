<template>
  <div class="app-container">
    <error v-if="error" :message="error" :translucent="true"></error>
    <toolbar v-if="show"></toolbar>
  </div>
</template>

<script>
import _ from 'lodash';

import Vue from 'vue';
import Vuex from 'vuex';

import * as config from 'manifest';

import { Mutations } from 'shared/js/store';

// Components
import Error from 'shared/components/Error';
import Toolbar from 'shared/components/Toolbar';
import CustomApp from 'shared/components/CustomApp';

// Developer app
import * as AppConfig from 'app/config';

// App object
export default {
  name: 'app',
  components: { Error, Toolbar },
  data: () => ({
    show: false
  }),

  computed: Vuex.mapState(['error']),

  methods: {
    ...Vuex.mapMutations({
      fail: Mutations.ERROR
    }),

    addAvailableApps() {
      AppConfig.enabled = true;
      const AppComponent = Vue.extend(_.extend(CustomApp, { parent: this }));
      new AppComponent({ data: AppConfig, store: this.$store }).$mount(); // eslint-disable-line no-new

      this.$store.commit(Mutations.ADD_APP, AppConfig);
    }
  },

  created() {
    const muxySDK = new window.MuxyExtensionsSDK('extension_id', {testAppID: AppConfig.id, testChannelID: AppConfig.testing_channel});
    muxySDK.loaded().then(() => {
      this.$store.commit(Mutations.SET_MUXY_SDK, muxySDK);
      this.$store.commit(Mutations.READY);
    });
  },

  // Once the main app has been mounted, run through all enabled apps
  // and create/mount components for them.
  mounted() {
    const bodyEl = document.querySelector('body');

    if (this.$store.getters.ready) {
      this.addAvailableApps();
      this.show = true;
    } else {
      const stopWatching = this.$store.watch(state => state.ready, (ready) => {
        if (ready) {
          stopWatching();
          this.addAvailableApps();
          this.show = true;
        }
      });
    }

    // Watch for all click events.
    window.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.$emit('user-click', event);
    });

    // Track user's mouse enter/leave.
    bodyEl.addEventListener('mouseenter', (event) => {
      event.preventDefault();
      event.stopPropagation();

      bodyEl.classList.remove('mouse-out');
      bodyEl.classList.add('mouse-in');
    });
    bodyEl.addEventListener('mouseleave', (event) => {
      event.preventDefault();
      event.stopPropagation();

      bodyEl.classList.remove('mouse-in');
      bodyEl.classList.add('mouse-out');
    });

    // Watch for mouse idle.
    bodyEl.addEventListener('mousemove', () => {
      bodyEl.classList.remove('mouse-out');
      bodyEl.classList.add('mouse-in');

      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        bodyEl.classList.remove('mouse-in');
        bodyEl.classList.add('mouse-out');
      }, 5 * 1000);
    });

    // Watch for window resize events.
    window.addEventListener('resize', _.debounce(() => {
      this.$emit('resize', event);
    }, 250));
  }
};
</script>

<style lang="scss">
@import '../shared/scss/base';

body {
  height: 100%;
  width: 100%;

  background-color: black;

  // If the mouse is over the extension but timed-out, hide it.
  &.mouse-out:hover { cursor: none; }

  .app-container {
    // Twitch reserves the bottom 40px for player controls.
    height: calc(100% - 40px);
    width: 100%;
    margin: 0;
    position: relative;
  }
}
</style>

<template>
  <div class="app-container">
    <error :translucent="true"></error>
    <toolbar v-if="show"></toolbar>
  </div>
</template>

<script>
/* globals Muxy */

import _ from 'lodash';

import Vue from 'vue';
import Vuex from 'vuex';

import * as config from 'manifest';

import { Mutations, Events } from 'shared/js/store';

// Components
import Error from 'shared/components/Error';
import Toolbar from 'shared/components/Toolbar';
import CustomApp from 'shared/components/CustomApp';

// Import developer app icons.
/* DI:ImportAppIcons */

// Developer apps list
const apps = /* DI:AppList */;

// App object
export default {
  name: 'app',
  components: { Error, Toolbar },
  data: () => ({ show: false }),

  computed: Vuex.mapState(['error']),

  methods: {
    ...Vuex.mapMutations({
      fail: Mutations.ERROR
    }),

    addAvailableApps() {
      _.each(apps, (app) => {
        try {
          app.enabled = true;
          app.available = true;
          app.show = false;
          app.notification = false;
          app.clicked = 0;

          const AppComponent = Vue.extend(_.extend(CustomApp, {
            store: this.$store,
            parent: this
          }));

          new AppComponent({ data: app }).$mount(); // eslint-disable-line no-new

          this.$store.commit(Mutations.ADD_APP, app);
        } catch (err) {
          this.fail(err.toString());
        }
      });
    }
  },

  created() {
    Muxy.setup({ extensionID: config.extension_id });

    const muxySDK = new Muxy.SDK();
    muxySDK.loaded().then(() => {
      this.$store.commit(Mutations.SET_USER, muxySDK.user);

      muxySDK.getAllState().then((state) => {
        this.$store.commit(Mutations.UPDATE_ALL_OPTIONS, state);

        this.$store.commit(Mutations.READY);
      });

      muxySDK.listen(Events.CHANNEL_OPTIONS_CHANGE, (options) => {
         this.$store.commit(Mutations.UPDATE_CHANNEL_OPTIONS, options);
      });
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
      this.$emit('resize');
    }, 250));
  }
};
</script>

<style lang="scss">
@import '../shared/scss/base';

body {
  height: 100%;
  width: 100%;

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

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

import Analytics from 'shared/js/analytics';
import Ext from 'shared/js/twitch-ext';
import Messenger, { Events } from 'shared/js/messenger';
import StateClient from 'shared/js/state-client';
import { Mutations } from 'shared/js/store';
import User from 'shared/js/user';

// Components
import Error from 'shared/components/Error';
import Toolbar from 'shared/components/Toolbar';
import CustomApp from 'shared/components/CustomApp';

// Developer app
import * as AppConfig from 'app/config';

console.log(AppConfig);

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
      const appList = this.$store.getters.option('apps') || [];

      // Create Vue objects for all available apps and add them to vuex.
      _.each(AllApps, (data) => {
        if (data.available) {
          try {
            data.enabled = _.includes(appList, data.id) || Globals.MOCK_DATA;
            const AppComponent = Vue.extend(_.extend(CustomApp, { parent: this }));
            new AppComponent({ data, store: this.$store }).$mount(); // eslint-disable-line no-new

            // Only store the POJO in vuex, otherwise we have a
            // circular reference in `app.$store`.
            this.$store.commit(Mutations.ADD_APP, data);
          } catch (err) {
            this.fail(err.toString());
          }
        }
      });
    }
  },

  // As soon as the app is created, set up the state client, analytics and user
  // objects. Also start listening for configuration changes.
  created() {
    // Only allow 15 seconds for user auth.
    const failedAuth = setTimeout(() => {
      this.fail('Could not authorize this account.');
    }, 15000);

    Ext.onAuthorized((auth) => {
      if (!auth) {
        this.fail(`Received null auth token: ${JSON.stringify(auth)}.`);
        return;
      }

      if (this.$store.getters.ready) {
        this.$store.getters.user.updateAuth(this.$store, auth);
      } else {
        // First time auth callback set up the world.
        clearTimeout(failedAuth);

        const client = new StateClient(this.$store, config.extension_id,
          auth.token, auth.channelId);
        this.$store.commit(Mutations.SET_STATE_CLIENT, client);

        const analytics = new Analytics(this.$store, auth.userId);
        this.$store.commit(Mutations.SET_ANALYTICS_CLIENT, analytics);

        const user = new User(this.$store, client, auth);
        this.$store.commit(Mutations.SET_USER, user);

        Messenger.listen(Events.CHANNEL_OPTIONS_CHANGE, (channelOptions) => {
          this.$store.commit(Mutations.UPDATE_CHANNEL_OPTIONS, channelOptions);
        });

        client.loaded.then(() => {
          this.$store.commit(Mutations.READY);
        }).catch((err) => {
          this.fail(err);
        });
      }
    });

    Ext.onContext((context) => {
      this.$store.commit(Mutations.SET_MODE, context.mode);
      // Set Video Mode
      if (context.isFullScreen) {
        this.$store.commit(Mutations.SET_USER_VIDEOMODE, 'fullscreen');
      } else if (context.isTheatreMode) {
        this.$store.commit(Mutations.SET_USER_VIDEOMODE, 'theatre');
      } else {
        this.$store.commit(Mutations.SET_USER_VIDEOMODE, 'default');
      }
      this.$store.commit(Mutations.SET_USER_GAME, context.game);
      // Emit buffering Event
      if (context.bufferSize < 1) {
        this.$store.state.analytics.sendEvent('video', 'buffer', 1);
      }
      this.$store.commit(Mutations.SET_USER_BITRATE, Math.round(context.bitrate));
      this.$store.commit(Mutations.SET_USER_LATENCY, context.hlsLatencyBroadcaster);
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

          setInterval(() => {
            this.$store.state.analytics.sendEvent('video', 'pulse', 1);
          }, DATA_PULSE_TIMEOUT);
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

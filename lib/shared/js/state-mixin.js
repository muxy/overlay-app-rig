import _ from 'lodash';

import { mapMutations } from 'vuex';

import Analytics from 'shared/js/analytics';
import Ext from 'shared/js/twitch-ext';
import StateClient from 'shared/js/state-client';
import { Mutations } from 'shared/js/store';
import User from 'shared/js/user';

import AvailableApps from 'shared/data/apps';

const config = {
  extension_id: 'fake-extension'
};

// Send a data pulse every two minutes.
const DATA_PULSE_TIMEOUT = 120 * 1000;

export default {
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

      if (this.$store.state.ready) {
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

        _.each(AvailableApps, (app) => {
          this.$store.commit(Mutations.ADD_APP, app);
        });

        client.loaded.then(() => {
          this.$store.commit(Mutations.READY);

          setInterval(() => {
            this.$store.state.analytics.sendEvent('video', 'pulse', 1);
          }, DATA_PULSE_TIMEOUT);
        }).catch(() => {
          this.fail('Could not load extension state from backend.');
        });
      }
    });
  },

  methods: {
    ...mapMutations({
      fail: Mutations.ERROR
    })
  }
};

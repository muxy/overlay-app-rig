<template>
  <div id="app">
    <error :message="error"></error>
    <router-view></router-view>
  </div>
</template>

<script>
/* globals Muxy */

import _ from 'lodash';
import { mapState } from 'vuex';

import Error from 'shared/components/Error';
import { Mutations, Events } from 'shared/js/store';

import * as manifest from 'manifest';

const apps = /* DI:AppList */;

// App object
export default {
  name: 'app',
  components: { Error },
  computed: mapState(['error', 'ready']),

  methods: {
    showFirstAppSettings() {
      const appid = this.$store.getters.availableApps[0].id;
      this.$router.push({ name: 'config-app', params: { appid } });
    }
  },

  created() {
    Muxy.testJWTRole = 'broadcaster';
    Muxy.setup({ extensionID: manifest.extension_id });

    const muxySDK = new Muxy.SDK();
    muxySDK.loaded().then(() => {
      this.$store.commit(Mutations.SET_USER, muxySDK.user);

      _.each(apps, (app) => {
        app.enabled = true;
        app.available = true;
        app.required = true; // Don't let the developers disable the apps.
        app.configurable = !!app.config;
        app.show = false;
        app.notification = false;

        this.$store.commit(Mutations.ADD_APP, app);
      });

      muxySDK.getAllState().then((state) => {
        this.$store.commit(Mutations.UPDATE_ALL_OPTIONS, state);

        this.$store.commit(Mutations.READY);
      });

      muxySDK.listen(Events.CHANNEL_OPTIONS_CHANGE, (options) => {
        this.$store.commit(Mutations.UPDATE_CHANNEL_OPTIONS, options);
      });
    });

    this.$router.push('/');
  },

  mounted() {
    if (this.ready) {
      this.showFirstAppSettings();
    } else {
      const stopWatching = this.$store.watch(state => state.ready, (ready) => {
        if (ready) {
          stopWatching();
          this.showFirstAppSettings();
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import '../shared/scss/base';

#app {
  height: 100%;
  width: 100%;

  margin: 0 auto;
  padding: 0;
}
</style>

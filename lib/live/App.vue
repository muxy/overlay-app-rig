<template>
  <div id="app">
    <error :message="error"></error>
    <router-view v-if="ready"></router-view>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import * as manifest from 'manifest';

import Error from 'shared/components/Error';
import { Mutations, Events } from 'shared/js/store';

import Live from './components/Live';

const apps = /* DI:AppList */;

// App object
export default {
  name: 'app',
  components: { Error },

  computed: {
    ...mapState(['error', 'ready']),
    ...mapGetters(['option', 'liveApps'])
  },

  methods: {
    showFirstApp() {
      if (this.$store.getters.liveApps.length > 0) {
        this.$router.push({ name: 'live-app', params: { appid: this.$store.getters.liveApps[0].id } });
      }
    }
  },

  created() {
    this.$router.push('/');

    Muxy.testJWTRole = 'broadcaster';
    Muxy.setup({ extensionID: manifest.extension_id });

    const muxySDK = Muxy.SDK();
    muxySDK.loaded().then(() => {
      this.$store.commit(Mutations.SET_USER, muxySDK.user);

      _.each(apps, (app) => {
        app.enabled = true;
        app.available = true;
        app.required = true; // Don't let the developers disable the apps.
        app.live = !!app.live;
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
  },

  mounted() {
    if (this.ready) {
      this.showFirstApp();
    } else {
      const stopWatching = this.$store.watch(state => state.ready, (ready) => {
        if (ready) {
          stopWatching();
          this.showFirstApp();
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

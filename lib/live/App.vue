<template>
    <div id="app">
        <error v-if="error" :message="error"></error>
        <router-view v-else></router-view>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import Error from 'shared/components/Error';

import * as AppConfig from 'app/config';

// App object
export default {
  name: 'app',

  components: { Error },

  computed: {
    ...mapState(['error']),
    ...mapGetters(['option', 'liveApps'])
  },

  methods: {
    showFirstAppSettings() {
      if (this.$store.getters.liveApps.length > 0) {
        this.$router.push({ name: 'live-app' });
      }
    }
  },

  created() {
    this.$router.push('/');

    Muxy.testJWTRole = 'broadcaster';
    const muxySDK = new Muxy.SDK(AppConfig.id);
    muxySDK.loaded().then(() => {
      this.$store.commit(Mutations.SET_MUXY_SDK, muxySDK);
      this.$store.commit(Mutations.READY);
    });
  },

  mounted() {
    if (this.$store.getters.ready) {
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

<template>
  <div id="app">
    <error v-if="error" :message="error"></error>
    <live v-if="ready"></live>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import * as manifest from 'manifest';

import Error from 'shared/components/Error';
import { Mutations, Events } from 'shared/js/store';

import * as AppConfig from 'app/config';

import Live from './components/Live';

// App object
export default {
  name: 'app',
  components: { Error, Live },

  computed: mapState(['error', 'ready']),

  created() {
    Muxy.testJWTRole = 'broadcaster';
    Muxy.setup({ extensionID: manifest.extension_id });

    const muxySDK = Muxy.SDK(AppConfig.id);

    muxySDK.loaded().then(() => {
      this.$store.commit(Mutations.SET_MUXY_SDK, muxySDK);
      this.$store.commit(Mutations.SET_USER, muxySDK.user);

      muxySDK.getAllState().then((state) => {
        this.$store.commit(Mutations.SET_APP_ALL_OPTIONS, {
          id: AppConfig.id,
          options: state
        });

        this.$store.commit(Mutations.READY);
      });

      muxySDK.listen(Events.CHANNEL_OPTIONS_CHANGE, (options) => {
        this.$store.commit(Mutations.SET_APP_CHANNEL_OPTIONS, {
          id: AppConfig.id,
          options
        });
      });
    });
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

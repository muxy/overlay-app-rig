<template>
  <div id="app">
    <error v-if="error" :message="error"></error>
    <config v-if="ready"></config>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Error from 'shared/components/Error';
import { Mutations, Events } from 'shared/js/store';

import * as AppConfig from 'app/config';

import Config from './components/Config';

// App object
export default {
  name: 'app',
  components: { Error, Config },
  data: () => ({}),
  computed: mapState(['error', 'ready']),

  created() {
    Muxy.testJWTRole = 'broadcaster';
    const muxySDK = Muxy.SDK(AppConfig.id);
    this.$store.commit(Mutations.SET_MUXY_SDK, muxySDK);

    muxySDK.loaded().then(() => {
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

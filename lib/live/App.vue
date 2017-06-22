<template>
  <div id="app">
    <error v-if="error" :message="error"></error>
    <live></live>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import Error from 'shared/components/Error';
import { Mutations } from 'shared/js/store';

import * as AppConfig from 'app/config';

import Live from './components/Live';

// App object
export default {
  name: 'app',
  components: { Error, Live },

  computed: mapState(['error']),

  created() {
    Muxy.testJWTRole = 'broadcaster';
    const muxySDK = Muxy.SDK(AppConfig.id);
    this.$store.commit(Mutations.SET_MUXY_SDK, muxySDK);

    muxySDK.loaded().then(() => {
      this.$store.commit(Mutations.READY);
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

<template>
  <div id="app">
    <error v-if="error" :message="error"></error>
    <config v-if="ready"></config>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Error from 'shared/components/Error';
import { Mutations } from 'shared/js/store';

import * as AppConfig from 'app/config';

import Config from './components/Config';

// App object
export default {
  name: 'app',
  components: { Error, Config },
  data: () => ({ ready: false }),
  computed: mapState(['error']),

  created() {
    Muxy.testJWTRole = 'broadcaster';
    const muxySDK = Muxy.SDK(AppConfig.id);
    this.$store.commit(Mutations.SET_MUXY_SDK, muxySDK);
    muxySDK.loaded().then(() => {
      this.$store.commit(Mutations.READY);
      this.ready = true;
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

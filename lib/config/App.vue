<template>
  <div id="app">
    <error v-if="error" :message="error"></error>
    <my-awesome-app-config></my-awesome-app-config>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Error from 'shared/components/Error';
import { Mutations } from 'shared/js/store';

// Developer app
import * as AppConfig from 'app/config';
import MyAwesomeAppConfig from 'app/MyAwesomeAppConfig';

// App object
export default {
  name: 'app',
  components: { Error, MyAwesomeAppConfig },
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

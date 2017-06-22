<template>
  <div class="dashboard">
    <component :id="appID" :is="appID"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import * as AppConfig from 'app/config';
import DevLiveApp from 'app//* @echo live */';

let localComponents = {
  '/* @echo id */': DevLiveApp
};

export default {
  name: 'live',
  components: localComponents,

  data: () => ({
    appID: AppConfig.id
  })
};
</script>

<style lang="scss">
</style>

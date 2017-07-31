<template>
  <div v-if="app">
    <component v-if="app.live" :id="app.id" :is="type" :app-config="app"></component>
  </div>
</template>

<script type="text/javascript">
import _ from 'lodash';
import { mapGetters } from 'vuex';

// Import live components for all dev apps.
/* DI:ImportLiveApps */

// Set app components.
const appComponents = /* DI:LiveAppComponents */;
let components = _.extend(appComponents, {});

export default {
  name: 'live-app',
  props: ['appid'],
  components,

  computed: {
    ...mapGetters(['availableApps']),

    app() {
      return _.find(this.availableApps, { id: this.appid });
    },

    type() {
      return `${this.app.type || this.app.id}`;
    }
  }
};
</script>

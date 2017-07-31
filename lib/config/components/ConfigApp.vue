<template>
  <div v-if="app">
    <ui-switch :label="app.name" switchPosition="left" :value="enabled" ref="switch"
               :disabled="app.required" :checked="enabled" @change="toggleAppEnabled">
    </ui-switch>

    <div v-if="app.description" class="description">
      <p v-for="p in description">{{ p }}</p>
    </div>

    <component v-if="app.configurable" :is="type" :app-config="app" :id="app.id"></component>
  </div>
</template>

<script type="text/javascript">
import _ from 'lodash';
import { mapGetters } from 'vuex';

import { Mutations } from 'shared/js/store';

// Import Config components for all dev apps.
/* DI:ImportConfigApps */

const UiSwitch = window.KeenUI.UiSwitch;
const UiTooltip = window.KeenUI.UiTooltip;

// Set app components.
const appComponents = /* DI:ConfigAppComponents */;
const components = _.extend(appComponents, {
  UiSwitch, UiTooltip
});

export default {
  name: 'config-app',
  props: ['appid'],
  components,

  computed: {
    ...mapGetters(['availableApps']),

    app() {
      return _.find(this.availableApps, { id: this.appid });
    },

    enabled() {
      return !!(this.app.required || this.app.enabled);
    },

    type() {
      return `${this.app.type || this.app.id}`;
    },

    description() {
      return this.app.description.split('\n');
    }
  },

  methods: {
    toggleAppEnabled(enabled) {
      this.$store.commit(enabled ? Mutations.ENABLE_APP : Mutations.DISABLE_APP,
        { appID: this.appid });

      this.$emit('save-channel-options');
    }
  }
};
</script>

<style lang="scss">
label.ui-switch {
  font-weight: bold;
}

.description {
  background-color: #eee;
  border: 1px solid #444;
  margin: 1.5rem auto;
  padding: 0.5rem;
  width: 80%;

  p:first-child { margin-top: 0; }
  p:last-child { margin-bottom: 0; }
}
</style>

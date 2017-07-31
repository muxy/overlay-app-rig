<template>
  <div class="broadcaster-config">
    <div class="save-message">
      <ui-alert :type="saveType" v-show="saveShow" :dismissible="false">{{ saveMessage }}</ui-alert>
    </div>

    <div class="config">
      <div class="config-nav">
        <ui-select label="Toolbar Position" :disabled="true" :options="toolbarPositions"
          v-model="toolbarPosition" @change="saveChannelOptions"></ui-select>

        <table class="apps">
          <tr><th colspan="3">Overlay Apps</th></tr>

          <router-link v-for="app in availableApps" tag="tr" :key="app.id"
            :to="{ name: 'config-app', params: { appid: app.id } }" exact>
            <td class="name">{{ app.name }}</td>
            <td class="configure"><i class="fa fa-fw fa-gear"></i></td>
          </router-link>
        </table>
      </div>

      <div class="config-container">
        <router-view v-on:save-promise="handleAppSaved"></router-view>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
/* globals Muxy */

import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';
import { Mutations } from 'shared/js/store';

// Import Config components for all dev apps.
/* DI:ImportConfigApps */

// Set app components.
const appComponents = /* DI:ConfigAppComponents */;

const UiAlert = window.KeenUI.UiAlert;
const UiSelect = window.KeenUI.UiSelect;

const components = _.extend(appComponents, {
  UiAlert,
  UiSelect
});

const TOOLBAR_POSITIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' }
];

export default {
  name: 'config',
  components,

  data: () => ({
    toolbarPositions: TOOLBAR_POSITIONS,
    toolbarPosition: TOOLBAR_POSITIONS[1],
    saveShow: false,
    saveType: 'success',
    saveMessage: '',
    saveClear: null
  }),

  computed: {
    ...mapGetters(['option', 'availableApps'])
  },

  methods: {
    saveSuccess() {
      this.saveType = 'success';
      this.saveMessage = 'Your settings have been saved! Viewers should see the new values immediately.';
      this.saveShow = true;

      if (this.saveClear) {
        clearTimeout(this.saveClear);
      }

      this.saveClear = setTimeout(() => {
        this.saveShow = false;
        this.saveClear = null;
      }, 5000);
    },

    saveFailure() {
      this.saveType = 'error';
      this.saveMessage = 'We could not save your settings at this time! Please refresh the page and try again.';
      this.saveShow = true;

      if (this.saveClear) {
        clearTimeout(this.saveClear);
      }

      this.saveClear = setTimeout(() => {
        this.saveShow = false;
        this.saveClear = null;
      }, 5000);
    },

    handleAppSaved(promise) {
      console.log('Fuck yeah! We are handling that save promise!');
      if (!promise) {
        this.saveFailure();
        return;
      }

      promise.then(() => {
        this.saveSuccess();
      }).catch(() => {
        this.saveFailure();
      });
    },

    saveChannelOptions() {
      const options = {
        toolbar: {
          position: this.toolbarPosition.value
        },
        enabled_apps: this.availableApps
          .filter(a => a.required || a.enabled)
          .map(a => a.id)
      };

      this.$store.commit(Mutations.UPDATE_CHANNEL_OPTIONS, options);

      // Persist changes to server.
      this.muxy.setChannelState(options).then(() => {
        // Send event to all viewers of new settings.
        this.muxy.send(Events.CHANNEL_OPTIONS_CHANGE, options);
      });
    }
  },

  created() {
    this.muxy = new Muxy.SDK();

    const pos = this.option('toolbar.position', 'right');
    this.toolbarPosition = _.find(TOOLBAR_POSITIONS, { value: pos }) || TOOLBAR_POSITIONS[1];
  }
};
</script>

<style lang="scss">
.save-message {
  position: absolute;
  left: 0;
  right: 0;

  .ui-alert--type-success .ui-alert__body {
    background-color: rgba(76, 175, 80, 0.9);
    z-index: 100;
  }

  .ui-alert--type-error .ui-alert__body {
    background-color: rgba(76, 175, 80, 0.9);
    z-index: 100;
  }
}

.config {
  display: flex;
  flex-direction: row;

  padding: 10px;
  height: 700px;

  .config-nav {
    border-right: 1px solid lightgrey;
    flex: 0 0 320px;
    height: 100%;
    margin-right: 10px;
    padding-right: 10px;

    .apps {
      border-collapse: collapse;
      width: 100%;

      tr {
        border: 1px solid #dfe6ec;

        &.router-link-active {
          background-color: darken(#eef1f6, 5%);
        }
      }

      th {
        background-color: #eef1f6;
        padding: 5px;
        text-align: left;
      }

      td {
        cursor: pointer;
        padding: 10px;

        &:last-child { text-align: right; }
      }
    }
  }

  .config-container {
    flex-grow: 1;
    margin-left: 30px;
  }
}
</style>

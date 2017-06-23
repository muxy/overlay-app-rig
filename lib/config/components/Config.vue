<template>
  <div class="broadcaster-config">
    <div class="save-success-message">
      <ui-alert :type="saveType" v-show="saveShow" :dismissible="false">
        {{ saveMessage }}
      </ui-alert>
    </div>

    <div class="config-container">
      <component :id="appID" :is="appID" v-on:save-promise="handleSavePromise">
      </component>
    </div>
  </div>
</template>

<script type="text/javascript">
import _ from 'lodash';
import { mapGetters, mapState } from 'vuex';
import { Mutations } from 'shared/js/store';

import * as AppConfig from 'app/config';

import DevApp from 'app//* @echo config */';

let localComponents = {
  'UiAlert': window.KeenUI.UiAlert,
  '/* @echo id */': DevApp
};

export default {
  name: 'config',
  components: localComponents,

  data: () => ({
    saveShow: false,
    saveType: 'success',
    saveMessage: '',
    saveClear: null
  }),

  computed: {
    ...mapGetters(['muxy', 'option', 'availableApps', 'channelOptions']),
    appID: () => AppConfig.id
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

    handleSavePromise(promise) {
      if (!promise) {
        this.saveFailure();
        return;
      }

      promise.then(() => {
        this.saveSuccess();
      }).catch(() => {
        this.saveFailure();
      });
    }
  }
};
</script>

<style lang="scss">
.save-success-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  .ui-alert {
    background-color: rgba(255, 255, 255, 0.97);
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

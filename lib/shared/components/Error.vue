<template>
  <div class="error" v-if="error" :class="{ translucent: translucent }">
    <ui-alert :removeIcon="false" type="error">
      <div class="title">{{ message }}</div>
      <div class="actions">
        <span @click="reload">Retry</span>
        <span @click="hide">Close</span>
      </div>
    </ui-alert>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { Mutations } from 'shared/js/store';

const UiAlert = window.KeenUI.UiAlert;

export default {
  name: 'error',
  props: ['message', 'translucent'],
  components: { UiAlert },
  computed: mapState(['error']),

  methods: {
    reload() {
      window.location.reload();
    },

    hide() {
      this.$store.commit(Mutations.CLEAR_ERROR);
    }
  }
};
</script>

<style lang="scss">
.error {
  margin: 10vh 10px 0 10px;

  .ui-alert__body {
    background-color: rgba(255, 73, 73, 1);
    color: #fff;

    .ui-alert__icon,
    .ui-alert__dismiss-button {
      display: none;
    }

    .title {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      line-height: 1.2rem;
    }

    .actions {
      display: inline-block;
      line-height: 1.5rem;
      margin: 0 0 0 20px;

      span {
        background-color: rgba(0, 0, 0, 0.1);
        cursor: pointer;
        font-size: 0.8rem;
        padding: 10px;
        text-transform: uppercase;

        &:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  &.translucent .ui-alert__body {
    background-color: rgba(255, 73, 73, 0.8);
    border: 1px solid rgb(255, 73, 73);
  }
}
</style>

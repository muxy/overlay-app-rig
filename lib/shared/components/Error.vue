<template>
  <div class="error" :class="{ translucent: translucent }">
    <ui-alert :removeIcon="true" type="error" @dismiss="hide">
      <div class="title">{{ message }}</div>
      <div class="reload">
        <span @click="reload">Retry</span>
      </div>
    </ui-alert>
  </div>
</template>

<script>
import { Mutations } from 'shared/js/store';

export default {
  name: 'error',
  props: ['message', 'translucent'],

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
  margin: 10px;

  .ui-alert__body {
    background-color: rgba(255, 73, 73, 1);
    color: #fff;

    .ui-close-button {
      &:hover .ui-close-button__icon,
      .ui-close-button__icon {
        color: #fff;
      }
    }

    .title {
      font-size: 0.8rem;
      font-weight: 700;
      line-height: 1.2rem;
    }

    .message {
      font-size: 0.9rem;
      line-height: 1rem;
      margin-top: 0.5rem;
    }

    .reload {
      line-height: 1.5rem;
      margin-top: 20px;

      span {
        background-color: rgba(0, 0, 0, 0.1);
        cursor: pointer;
        font-size: 0.8rem;
        padding: 10px;

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

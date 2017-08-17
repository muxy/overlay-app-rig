<template>
  <li v-if="app.icon" :id="app.id" class="toolbar-app app" ref="app">
    <ui-tooltip trigger="app" position="left middle">{{ app.name }}</ui-tooltip>
    <div class="item" @click="click" :class="{ notification: app.notification }">
      <img :src="`src/${app.id}/${app.icon}`" class="icon" />
    </div>
  </li>
</template>

<script>
import _ from 'lodash';

import { Mutations } from 'shared/js/store';

const UiTooltip = window.KeenUI.UiTooltip;

export default {
  name: 'toolbar-app',
  props: ['app'],
  components: { UiTooltip },

  methods: {
    click:  _.debounce(function focus(event) {
      event.preventDefault();
      event.stopPropagation();

      this.$store.commit(Mutations.TOGGLE_APP, { appID: this.app.id });
      this.$store.commit(Mutations.CLICK_APP, { appID: this.app.id });
    }, 200)
  }
};
</script>

<style lang="scss">
.toolbar-app {
  background-color: #222;
  color: white;
  cursor: pointer;
  padding: 5px;
  text-align: center;
  user-select: none;

  &:hover { background-color: #444; }

  .item {
    padding: 2px;
  }

  img.icon { min-width: 15px; width: 2.3vw; max-width: 25px; }

  &.notification {
    background-color: darken(firebrick, 10%);

    &:hover { background-color: firebrick; }
  }
}
</style>

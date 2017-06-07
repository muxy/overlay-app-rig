<template>
  <li v-if="data.icon" :id="data.id" class="toolbar-app app" ref="app">
    <ui-tooltip trigger="app" position="left middle">{{ data.name }}</ui-tooltip>
    <div class="item" @click="focus" :class="{ notification: data.notification }">
      <img v-if="data.iconFile" :src="data.iconFile" class="icon" />

      <i v-else class="fa fa-fw" :class="data.icon"></i>
    </div>
  </li>
</template>

<script>
import { Mutations } from 'shared/js/store';

const UiTooltip = window.KeenUI.UiTooltip;


export default {
  name: 'toolbar-app',
  props: {
    data: Object
  },

  components: { UiTooltip },

  methods: {
    focus(event) {
      event.preventDefault();
      event.stopPropagation();

      this.$store.commit(Mutations.TOGGLE_APP, { appID: this.data.id });
    }
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
    i { font-size: calc(1.3rem + ((10vw - 5em)/10)); }

    &.notification {
      background-color: darken(firebrick, 10%);

      &:hover { background-color: firebrick; }
    }
}
</style>

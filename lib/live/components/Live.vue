<template>
  <div class="dashboard">
    <ul>
      <router-link v-for="app in liveApps" v-bind:key="app.name" tag="li" class="app"
        :to="{ name: 'live-app', params: { appid: app.id }}" exact>
        <div class="item">
          <img :src="app.icon" class="icon" />
        </div>
      </router-link>
    </ul>
    <router-view>
    </router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'live',

  computed: {
    ...mapGetters(['option', 'liveApps', 'channelOptions'])
  }
};
</script>

<style lang="scss">
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.app {
  background-color: #222;
  color: white;
  cursor: pointer;
  padding: 5px;
  text-align: center;
  user-select: none;
  display: inline-block;

  &:hover { background-color: #444; }

  & + .app {
    border-left: 1px dotted #999;
  }

  .item {
    height: 24px;
    width: 24px;
  }

  .icon {
    padding: 2px;
    width: 24px;
  }
}
</style>

<template>
  <div class="dashboard">
    <ul>
      <router-link v-for="app in liveApps" tag="li" class="app" :key="app.id"
        :to="{ name: 'live-app', params: { appid: app.id }}" exact>
        <div class="item">
          <img :src="`src/${app.id}/${app.icon}`" class="icon" />
        </div>
      </router-link>
    </ul>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

// Import live components for all dev apps.
/* DI:ImportLiveApps */

// Set app components.
const appComponents = /* DI:LiveAppComponents */;
const components = _.extend(appComponents, {});

export default {
  name: 'live',
  components,

  computed: {
    ...mapGetters(['liveApps'])
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
  display: inline-block;
  padding: 5px;
  text-align: center;
  user-select: none;
  vertical-align: middle;

  &:hover { background-color: #444; }
  & + .app { border-left: 1px dotted #999; }

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

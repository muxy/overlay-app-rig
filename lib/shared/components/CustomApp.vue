<template>
  <div class="app">
    <window v-if="window" :show="show" :title="name" :center="window.center"
      :min-width="window.minWidth" :min-height="window.minHeight"
      :auto-height="window.autoHeight" :auto-width="window.autoWidth"
      :movable="window.movable" :id="id">
      <component :id="id" :is="type" :parent-data="$data" @alter-window="alterWindow" :show="show"></component>
    </window>

    <component v-else :id="id" :is="type" :parent-data="$data" :show="show"></component>
  </div>
</template>

<script>
import Window from 'shared/components/Window';
import _ from 'lodash';

// Known custom app types.
import Clicker from './Clicker';
import Confetti from './Confetti';
import Info from './Info';
import PretzelNowPlaying from './PretzelNowPlaying';
import Sentiment from './Sentiment';
import SpotifyNowPlaying from './SpotifyNowPlaying';
import Globe from './Globe';

export default {
  name: 'custom-app',
  components: {
    Window,
    Clicker,
    Confetti,
    Globe,
    Info,
    PretzelNowPlaying,
    Sentiment,
    SpotifyNowPlaying
  },

  data: () => ({
    show: false,
    enabled: false,
    notification: false,
    window: {
      minHeight: 100,
      minWidth: 100
    }
  }),

  methods: {
    alterWindow(data) {
      this.window = _.merge(this.window, data);
    }
  }
};
</script>

<style lang="scss">
</style>

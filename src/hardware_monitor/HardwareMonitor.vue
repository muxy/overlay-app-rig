<template>
  <div class="stats">
    <h2> Stats </h2>
    <h3> CPU </h3>
    <ui-progress-linear color="primary" type="determinate" :progress="CPU"></ui-progress-linear>
    <h3> RAM </h3>
    <ui-progress-linear color="primary" type="determinate" :progress="RAM"></ui-progress-linear>
  </div>
</template>
<script>
import AppMixin from 'shared/js/app-mixin';

const UiProgressLinear = window.KeenUI.UiProgressLinear;

export default {
  name: 'hardware_monitor',
  mixins: [AppMixin],

  components: {
    UiProgressLinear
  },

  data: () => ({
    dataListener: null,
    CPU: 0.0,
    RAM: 0.0
  }),
  
  methods: {
    updateStats(data) {
      this.CPU = data.CPU;
      this.RAM = data.RAM;
    }
  },

  mounted() {
    // Fetch any initial state
    this.muxy.getJSONStore().then((data) => {
      if (data) {
        this.updateStats(data);
      }
    });

    // Listener for updates from json_store
    this.dataListener = this.muxy.listen('json_store_update:default', (data) => {
      setTimeout(() => { // Timeout allows for viewer latency to syncronize stats and video
        this.updateStats(data.value); // Use value to unwrap the json object
      }, (this.muxy.user.latency || 0) * 1000);
    });
  },

  destroyed() {
    if (this.dataListener) {
      this.muxy.unlisten(this.dataListener);
    }
  }
};
</script>

<style lang="scss">

.stats {
  user-select: none;
  width: 20vw;
  min-width: 350px;
  background-color: #454545;
  vertical-align: middle;
  padding: 16px;

  h2,h3 {
    font-family: 'Raleway', sans-serif;
    color: #fff;
    font-weight: 300;
    margin-top: 10px;
    word-wrap: break-word;
    white-space: normal;
  }
}

.ui-progress-linear {
  margin-top: rem-calc(8px);
  margin-bottom: rem-calc(8px);
}

</style>

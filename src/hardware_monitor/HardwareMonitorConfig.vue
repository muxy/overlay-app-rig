<template>
  <div class="hardware-monitor-config">
    <game-auth :muxy="muxy" app-name="HardwareMonitor" :show-cancel="false"></game-auth>
  </div>
</template>

<script type="text/javascript">
import AppMixin from 'shared/js/app-mixin';
import GameAuth from 'shared/components/GameAuth';

export default {
  name: 'hardware_monitor',
  mixins: [AppMixin],
  components: { GameAuth }
};
</script>
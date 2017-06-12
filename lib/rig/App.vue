<template>
  <div class="rig">
    <div class="viewer">
      <h1 class="title">Viewer App</h1>
      <div class="overlay">
        <iframe class="ext" src="/viewer.html" scrolling="no" sandbox="allow-scripts"></iframe>
        <iframe class="player" src="https://player.twitch.tv/?channel=lirik" scrolling="no"></iframe>
      </div>
    </div>

    <div class="broadcaster">
      <div v-if="app.config" class="config">
        <h1 class="title">Broadcaster Config App</h1>
        <iframe src="/config.html" scrolling="no" sandbox="allow-scripts"></iframe>
      </div>

      <div v-if="app.live" class="live">
        <h1 class="title">Broadcaster Live App</h1>
        <iframe src="/live.html" scrolling="no" sandbox="allow-scripts"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import * as AppConfig from 'app/config';

export default {
  name: 'app',

  data: () => ({
    app: AppConfig
  }),

  created() {
  }
};
</script>

<style lang='scss'>
.rig {
  .title {
    font-family: 'Open Sans';
    font-size: 18px;
  }

  iframe {
    border: 1px solid #bbb;
  }

  .viewer {
    height: 400px; width: 100%;
    overflow: hidden;

    .overlay {
      height: 100%; width: 100%;
      position: relative;

      .ext {
        border: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        height: 100%; width: 100%;
      }

      .player {
        border: 1px solid #eee;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        height: 100%; width: 100%;
      }
    }
  }

  .broadcaster {
    display: flex;
    justify-content: space-around;

    .config iframe {
      height: 600px;
      width: 600px;
      overflow: hidden;
    }

    .live iframe {
      height: 200px;
      width: 286px;
      overflow: hidden;
    }
  }
}
</style>
<template>
  <div class="rig">
    <ui-tabs fullwidth background-color="default" indicator-color="white" type="text">
      <ui-tab title="Viewer App">
        <ui-button class="popout" icon="open_in_new" type="primary" @click="popout('/viewer.html')">
          Open In New Window
        </ui-button>

        <div class="viewer">
          <div class="overlay">
            <iframe class="ext" src="/viewer.html" scrolling="no" sandbox="allow-scripts"></iframe>
            <iframe class="player" :src="`https://player.twitch.tv/?channel=${videoChannel}`" scrolling="no"></iframe>
          </div>
        </div>
      </ui-tab>

      <ui-tab title="Broadcaster Config App">
        <ui-button class="popout" icon="open_in_new" type="primary" @click="popout('/config.html')">
          Open In New Window
        </ui-button>

        <div class="broadcaster">
          <div class="config">
            <iframe src="/config.html" scrolling="no" sandbox="allow-scripts"></iframe>
          </div>

          <div class="info">
            <p>
              The Broadcaster Config App is accessible by the broadcaster from Twitch&#8217;s
              &#8220;Extension Manager.&#8221; It shows the broadcaster what apps they have
              enabled for the Overlay, and allows them to configure each one. Your app will
              appear in a large area and should display any configuration options the
              broadcaster may set that will affect your app channel-wide.
            </p>
            <p>
              You may optionally choose to let viewers override any settings the broadcaster
              sets here.
            </p>
            <p>
              This page is not expected to be kept open by the broadcaster. Instead it is
              loaded and configured before the app is enabled, so that viewers only see your
              app after the broadcaster has tweaked it to their liking. Any realtime events
              or updates sent to this page will most likely not be seen by the broadcaster.
            </p>
          </div>
        </div>
      </ui-tab>

      <ui-tab title="Broadcaster Live App">
        <ui-button class="popout" icon="open_in_new" type="primary" @click="popout('/live.html')">
          Open In New Window
        </ui-button>

        <div class="broadcaster">
          <div class="live">
            <iframe src="/live.html" scrolling="no" sandbox="allow-scripts"></iframe>
          </div>

          <div class="info">
            <p>
              The broadcaster live app is accessible by the broadcaster from Twitch&#8217;s
              &#8220;Live Dashboard.&#8221; The useable space in the Live App is considerably
              smaller than the other two, and should only display controls that are immediately
              useful to the broadcaster. The expected behavior is that a broadcaster will have
              the Live Dashboard open while they stream.
            </p>
            <p>
              This app is optional, but may be used to display information needed by the
              broadcaster. For example, it may show aggregate voting data. It can also be used
              by the broadcaster to effect app state, such as clearing out a poll&#8217;s
              information, sending messages to viewers or hiding/displaying the app on all
              viewers&#8217; pages.
            </p>
          </div>
        </div>
      </ui-tab>
    </ui-tabs>
  </div>
</template>

<script>
import XHRPromise from 'xhr-promise';

import * as AppConfig from 'app/config';

const UiButton = window.KeenUI.UiButton;
const UiTab = window.KeenUI.UiTab;
const UiTabs = window.KeenUI.UiTabs;
const UiToolbar = window.KeenUI.UiToolbar;

export default {
  name: 'app',
  components: { UiButton, UiTab, UiTabs, UiToolbar },

  data: () => ({
    config: AppConfig,
    videoChannel: 'lirik'
  }),

  methods: {
    popout(url) {
      window.open(url);
    }
  },

  created() {
    if (this.config.testing_channel) {
      const xhrPromise = new XHRPromise();
      xhrPromise.send({
          method: 'GET',
          url: `https://api.twitch.tv/kraken/channels/${this.config.testing_channel}`,
          headers: {
            Accept: 'application/vnd.twitchtv.v5+json',
            'Client-ID': '252bcsw1s0sx8qroh1t14its1aulp0a'
          }
        }).then((resp) => {
          if (resp.status < 400) {
            this.videoChannel = resp.responseText.name;
          }
        });
    }
  }
};
</script>

<style lang='scss'>
@import '../shared/scss/base';

.rig {
  iframe {
    border: 1px solid #bbb;
  }

  .popout {
    margin-bottom: 20px;
  }

  .viewer {
    height: 800px; width: 100%;
    overflow: hidden;

    .overlay {
      height: 100%; width: 100%;
      position: relative;

      .ext {
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
    flex-flow: space-around;

    .info {
      margin: 0 40px 20px 20px;

      p:first-child { margin-top: 0; }
    }

    .live {
      flex-grow: 1;
    }
  }

  .config iframe {
    height: 700px;
    width: 800px;
    overflow: hidden;
  }

  .live iframe {
    height: 500px;
    width: 286px;
    overflow: hidden;
  }
}
</style>
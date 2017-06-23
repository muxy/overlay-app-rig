<template>
  <div class="toasty">
    <img :src="imgSrc" />
    <div class="body">
      <h1>{{ title }}</h1>
      <h2>{{ body }}</h2>
    </div>
  </div>
</template>

<script>
import XMLHttpRequestPromise from 'xhr-promise';

import AppMixin from 'shared/js/app-mixin';

export default {
  name: 'my_awesome_app',
  mixins: [AppMixin],

  data: () => ({
    imgSrc: '',
    title: '',
    body: '',
    messageHandler: null
  }),

  methods: {
    showIncomingMessage(data) {
      console.log('Received message');
      console.log(data);
      this.imgSrc = data.image;
      this.title = data.title;
      this.body = data.body;

      // Wait for image to load.
      const imgEl = this.$el.querySelector('img');
      if (imgEl.complete) {
        this.show();
        setTimeout(this.hide, 10000);
      } else {
        imgEl.addEventListener('load', () => {
          this.show();
          setTimeout(this.hide, 10000);
        });
      }
    }
  },

  created() {
    this.messageHandler = this.muxy.listen('show_awesome_message', this.showIncomingMessage);
  },

  destroyed() {
    if (this.messageHandler) {
      this.muxy.unlisten(this.messageHandler);
    }
  }
};
</script>

<style lang="scss">
.toasty {
  background-color: rgba(40, 40, 40, 0.9);
  display: flex;
  align-items: center;
  user-select: none;

  img { verical-align: middle; }

  .body {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    vertical-align: middle;

    h1, h2 {
      color: white;
      margin: 0;
      max-width: 20vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    h1 { font-size: 14px; }
    h2 { font-size: 12px; }
  }
}
</style>
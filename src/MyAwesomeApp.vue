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

import { Mutations } from 'shared/js/store';

export default {
  name: 'my_awesome_app',
  props: ['id'],

  data: () => ({
    showing: false,
    imgSrc: '',
    title: '',
    body: ''
  }),

  methods: {
    showToast() {
      this.$nextTick(() => {
        this.$store.commit(Mutations.SHOW_APP, { appID: this.id });
        this.showing = true;
      });
    },

    hideToast() {
      this.$nextTick(() => {
        this.$store.commit(Mutations.HIDE_APP, { appID: this.id });
        this.showing = false;
      });
    }
  },

  mounted() {
    // Test toasts with animal images and bacon.
    setInterval(() => {
      if (this.showing) {
        this.hideToast();
      } else {
        this.imgSrc = `https://lorempixel.com/64/64/animals#${new Date().getTime()}`;

        const xhrPromise = new XMLHttpRequestPromise();
        xhrPromise.send({
          method: 'GET',
          url: 'https://baconipsum.com/api/?type=all-meat&sentences=2',
          processData: false
        }).catch((err) => {
          this.title = 'Error';
          this.body = err;
          this.showToast();
        }).then((resp) => {
          const parts = resp.responseText[0].split('. ');
          this.title = parts[0];
          this.body = parts[1];

          const imgEl = this.$el.querySelector('img');
          if (imgEl.complete) {
            this.showToast();
          } else {
            imgEl.addEventListener('load', () => {
              this.showToast();
            });
          }
        });
      }
    }, 10000);
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
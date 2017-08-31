import 'es6-promise/auto';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import StateStore from 'shared/js/store';

import Loader from 'shared/components/Loader';

import App from './App.vue';
import Config from './components/Config';
import ConfigApp from './components/ConfigApp';

Vue.use(Vuex);
const store = new Vuex.Store(StateStore);

Vue.use(VueRouter);
const router = new VueRouter({
  hashbang: false,
  routes: [
    {
      path: '/',
      component: Loader
    },
    {
      path: '/config',
      name: 'config',
      component: Config,
      children: [
        {
          path: '/config/:appid',
          name: 'config-app',
          props: true,
          component: ConfigApp,
          linkActiveClass: true
        }
      ]
    }
  ]
});

const app = new Vue({
  store,
  router,

  ...App
});

app.$mount('#app');

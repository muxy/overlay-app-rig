import 'es6-promise/auto';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import StateStore from 'shared/js/store';

import Loader from 'shared/components/Loader';

import App from './App';
import Live from './components/Live';
import LiveApp from './components/LiveApp';

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
      path: '/live',
      name: 'live',
      component: Live,
      children: [
        {
          path: '/live/:appid',
          name: 'live-app',
          props: true,
          component: LiveApp,
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

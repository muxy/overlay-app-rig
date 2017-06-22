import Vue from 'vue';
import Vuex from 'vuex';

import StateStore from 'shared/js/store';

import App from './App';

Vue.use(Vuex);
const store = new Vuex.Store(StateStore);

const app = new Vue({
  store,

  ...App
});

app.$mount('#app');
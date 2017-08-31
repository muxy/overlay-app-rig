import 'es6-promise/auto';

import Vue from 'vue';
import Vuex from 'vuex';
import KeenUI from 'keen-ui';

import StateStore from 'shared/js/store';

import App from './App';

Vue.use(Vuex);
Vue.use(KeenUI);
const store = new Vuex.Store(StateStore);

const app = new Vue({
  store,

  ...App
});

app.$mount('#app');

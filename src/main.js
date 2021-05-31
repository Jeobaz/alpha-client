import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'
import { ValidationProvider } from 'vee-validate';
import './plugins/dayjs'

Vue.config.productionTip = false;

window.axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1:3333';

Vue.component('ValidationProvider', ValidationProvider);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

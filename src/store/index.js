import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import { auth }  from './auth.module'
import { reminder } from './reminder.module'
import { client } from './client.module';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth, reminder, client
  },
  plugins: [createPersistedState()],
})

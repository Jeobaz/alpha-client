import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = user
  ? { status: { loggedIn: true }, user, userData }
  : { status: { loggedIn: false }, user, userData: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    register({ commit }, user) {
      return AuthService.register(user).then(
        (response) => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        (error) => {
          commit('registerFailure');
          return Promise.reject(error);
        },
      );
    },
    login({ commit }, user) {
      return AuthService.login(user).then(
        (user) => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        (error) => {
          commit('loginFailure');
          return Promise.reject(error);
        },
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    getUserData({ commit }) {
      AuthService.getUserData().then((response) => {
        commit('setUserData', response);
        return Promise.resolve(response);
      });
    },
  },
  mutations: {
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = state.userData = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = state.userData = null;
    },
    setUserData(state, userData) {
      state.userData = userData;
    },
  },
};

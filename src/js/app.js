import './polyfills';

import Vue from 'vue/dist/vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import {APPLICATION_SELECTOR} from './config';

import AppComponent from './component/app';

import BoardCardComponent from './component/board/board-card';

import routes from './routes';

import * as mutations from './store/mutations';

import {generateToken, validate} from './auth';

import {read as readPersistent, write as writePersistent} from './db';

const data = readPersistent();

const validateAccessToken = (token) => validate(token, data.signUpTokens);

export {};

Vue.use(Vuex);
Vue.use(VueRouter);

Vue.component('app', AppComponent);
Vue.component('board-card', BoardCardComponent);

Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

/**
 * @type {boolean}
 */
const isSuccessAuth = validateAccessToken(data.accessToken);

if (!isSuccessAuth) {
  delete data.accessToken;

  writePersistent(data);
}

const router = new VueRouter({
  routes,
});

const storeWritePersistentPlugin = (store) => store.subscribe((mutation, state) => writePersistent(Object.assign(data, state)));

const store = new Vuex.Store({
  strict: false,
  plugins: [storeWritePersistentPlugin],
  state: {
    boards: data.boards,
    accessToken: data.accessToken,
    login: data.login,
    isSuccessAuth,

    hoveredColumn: null,
    movableColumn: null,

    hoveredCard: null,
    movableCard: null,

    readyForCardMoving: false,
    readyForColumnMoving: false,

    displayedColumns: null,
  },
  getters: {
    isLoginError(state) {
      return state.accessToken && !state.isSuccessAuth;
    },
  },
  mutations,
  actions: {
    addBoard({commit}, payload) {
      commit('addBoard', payload);
    },
    addColumn({commit}, payload) {
      commit('addColumn', payload);
    },
    addCard({commit}, payload) {
      commit('addCard', payload);
    },
    removeBoard({commit}, payload) {
      commit('removeBoard', payload);
    },
    removeColumn({commit}, payload) {
      commit('removeColumn', payload);
    },
    removeCard({commit}, payload) {
      commit('removeCard', payload);
    },
    updateColumn({commit}, payload) {
      commit('updateColumn', payload);
    },
    updateCard({commit}, payload) {
      commit('updateCard', payload);
    },
    columnMovingEnd({commit}) {
      commit('columnMovingEnd');
    },
    cardMovingEnd({commit}, payload) {
      commit('cardMovingEnd', payload);
    },
    movableCard({commit}, card) {
      commit(card);
    },
    displayedColumns({commit}) {
      commit('displayedColumns');
    },
    signUp({commit, state}, {login, password}) {
      const isSuccessAuth = true;
      const accessToken = generateToken(login, password);

      state.signUpTokens = state.signUpTokens || [];

      state.signUpTokens.push(accessToken);

      commit('authorizationState', {accessToken, isSuccessAuth, login});

      router.push(router.history.current.query.redirect || '/');
    },
    signIn({commit}, {login, password}) {
      const accessToken = generateToken(login, password);

      const isSuccessAuth = validateAccessToken(accessToken);

      if (!isSuccessAuth) {
        login = null;
      }

      commit('authorizationState', {accessToken, isSuccessAuth, login});

      if (isSuccessAuth) {
        router.push(router.history.current.query.redirect || '/');
      }
    },
    logout({commit}) {
      commit('logout');

      router.push('/login');
    },
  },
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);

  const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut);

  const loggedIn = !!store.state.isSuccessAuth;

  if (!isPublic && !loggedIn) {
    return next({
      path: '/login',
      query: {redirect: to.fullPath}  // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next('/')
  }

  next();
});

const App = new Vue({
  el: APPLICATION_SELECTOR,
  store,
  router,
  template: '<app/>',
});

import './polyfills';

import Vue from 'vue/dist/vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import { APPLICATION_SELECTOR } from './config';

import { read as readPersistent, write as writePersistent } from './db/index';

import { validate, generateToken } from './auth';

import { EventBus, EVENT_CARD_MOVING_PLACEMENT } from './event-bus';

import AppComponent from './component/app';

import LoginComponent from './component/auth/login';

import BoardComponent from './component/board/board';
import BoardsComponent from './component/boards';

import BoardCardComponent from './component/board/board-card';

import Card from './component/card';

export {};

const data = readPersistent();

const validateAccessToken = (token) => validate(token, data.signUpTokens);

/**
 * @type {boolean}
 */
const isSuccessAuth = validateAccessToken(data.accessToken);

if (!isSuccessAuth) {
  delete data.accessToken;

  writePersistent(data);
}

Vue.use(Vuex);
Vue.use(VueRouter);

Vue.component('app', AppComponent);
Vue.component('boards', BoardsComponent);
Vue.component('board', BoardComponent);
Vue.component('board-card', BoardCardComponent);

Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

/**
 * Where card will be placed in board.
 *
 * @type {null|{boardIndex, columnIndex, cardIndex}}
 */
let cardMovingPlacement;

const store = new Vuex.Store({
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
  mutations: {
    displayedColumns(state) {
      if (state.hoveredColumn) {
        const fromIndex = state.movableColumn.columnIndex;
        const toIndex = state.hoveredColumn.columnIndex;

        const columns = state.boards[state.movableColumn.boardIndex].columns.slice();

        const fromColumn = columns.splice(fromIndex, 1)[0];

        columns.splice(toIndex, 0, fromColumn);

        state.displayedColumns = columns;
      }
    },
    hoveredColumn(state, column) {
      state.hoveredColumn = column;
    },
    movableColumn(state, column) {
      state.movableColumn = column
    },
    hoveredCard(state, column) {
      state.hoveredCard = column;
    },
    movableCard(state, card) {
      state.movableCard = card;
    },
    readyForColumnMoving(state, bool) {
      state.readyForColumnMoving = !!bool;
    },
    readyForCardMoving(state, bool) {
      state.readyForCardMoving = !!bool;
    },
    columnMovingEnd(state) {
      if (store.state.movableColumn) {
        if (store.state.hoveredColumn) {
          const { boardIndex: fromBoardIndex, columnIndex: fromColumnIndex } = store.state.movableColumn;
          const { boardIndex: toBoardIndex, columnIndex: toColumnIndex } = store.state.hoveredColumn;

          const columns = store.state.boards[toBoardIndex].columns;
          const column = columns.splice(fromColumnIndex, 1)[0];

          columns.splice(toColumnIndex, 0, column);
        }

        state.movableColumn = null;
        state.hoveredColumn = null;
        state.displayedColumns = null;
      }

      state.readyForColumnMoving = false;
    },
    cardMovingEnd(state) {
      if (store.state.movableCard) {
        if (cardMovingPlacement) {
          const { boardIndex: fromBoardIndex, columnIndex: fromColumnIndex, cardIndex: fromCardIndex } = store.state.movableCard;
          const { boardIndex: toBoardIndex, columnIndex: toColumnIndex, cardIndex: toCardIndex } = cardMovingPlacement;

          const fromCards = store.state.boards[fromBoardIndex].columns[fromColumnIndex].cards;
          const toCards = store.state.boards[toBoardIndex].columns[toColumnIndex].cards;

          const card = fromCards.splice(fromCardIndex, 1)[0];

          toCards.splice(toCardIndex, 0, card);
        }

        state.movableCard = null;
        state.hoveredCard = null;

        cardMovingPlacement = null;
      }

      state.readyForCardMoving = false;
    },
    addBoard(state) {
      state.boards.push({
        id: new Date().getTime(),
        name: 'New board',
        columns: [],
      });
    },
    addColumn(state, { boardIndex }) {
      state.boards[boardIndex].columns.push({
        id: new Date().getTime(),
        name: 'New column',
        cards: [],
      });

      Object.assign(state.boards, state.boards);
    },
    addCard(state, { boardIndex, columnIndex }) {
      state.boards[boardIndex].columns[columnIndex].cards.push({
        name: 'New card',
      });
    },
    removeBoard(state, { boardIndex }) {
      state.boards.splice(boardIndex, 1);
    },
    removeColumn(state, { boardIndex, columnIndex }) {
      state.boards[boardIndex].columns.splice(columnIndex, 1);
    },
    removeCard(state, { boardIndex, columnIndex, cardIndex }) {
      state.boards[boardIndex].columns[columnIndex].cards.splice(cardIndex, 1);
    },
    updateBoard(state, { boardIndex, board}) {
      state.boards[boardIndex] = board;
    },
    updateColumn(state, { boardIndex, columnIndex, column }) {
      state.boards[boardIndex].columns[columnIndex] = column;
    },
    updateCard(state, { boardIndex, columnIndex, cardIndex, card }) {
      state.boards[boardIndex].columns[columnIndex].cards[cardIndex] = card;
    },
    authorizationState(state, { accessToken, isSuccessAuth, login }) {
      state.accessToken = accessToken;
      state.isSuccessAuth = isSuccessAuth;
      state.login = login;
    },
    logout(state) {
      state.accessToken = null;
      state.login = null;
      state.isSuccessAuth = false;
    },
  },
  actions: {
    addBoard({ commit }, payload) {
      commit('addBoard', payload);
    },
    addColumn({ commit }, payload) {
      commit('addColumn', payload);
    },
    addCard({ commit }, payload) {
      commit('addCard', payload);
    },
    removeBoard({ commit }, payload) {
      commit('removeBoard', payload);
    },
    removeColumn({ commit }, payload) {
      commit('removeColumn', payload);
    },
    removeCard({ commit }, payload) {
      commit('removeCard', payload);
    },
    updateColumn({ commit }, payload) {
      commit('updateColumn', payload);
    },
    updateCard({ commit }, payload) {
      commit('updateCard', payload);
    },
    columnMovingEnd({ commit }) {
      commit('columnMovingEnd');
    },
    cardMovingEnd({ commit }) {
      commit('cardMovingEnd');
    },
    movableCard({ commit }, card) {
      commit(card);
    },
    displayedColumns({ commit }) {
      commit('displayedColumns');
    },
    signUp({ commit, state }, { login, password }) {
      const isSuccessAuth = true;
      const accessToken = generateToken(login, password);

      state.signUpTokens = state.signUpTokens || [];

      state.signUpTokens.push(accessToken);

      commit('authorizationState', { accessToken, isSuccessAuth, login });

      router.push(router.history.current.query.redirect || '/');
    },
    signIn({ commit }, { login, password }) {
      const accessToken = generateToken(login, password);

      const isSuccessAuth = validateAccessToken(accessToken);

      if (!isSuccessAuth) {
        login = null;
      }

      commit('authorizationState', { accessToken, isSuccessAuth, login });

      if (isSuccessAuth) {
        router.push(router.history.current.query.redirect || '/');
      }
    },
    logout({ commit }) {
      commit('logout');

      router.push('/login');
    },
  },
});

store.subscribe((mutation, state) => {
  writePersistent(Object.assign(data, state));
});

EventBus.$on(EVENT_CARD_MOVING_PLACEMENT, (placement) => {
  cardMovingPlacement = placement;
});

const routes = [
  {
    path: '*',
    name: '404',
    component: { template: '<div>404</div>'},
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent,
    meta: {
      public: true,  // Allow access to even if not logged in
      onlyWhenLoggedOut: true
    }
  },
  {
    path: '/',
    name: 'index',
    redirect: {
      name: 'boards'
    },
  },
  {
    path: '/boards',
    name: 'boards',
    component: BoardsComponent,
  },
  {
    path: '/boards/:boardIndex',
    name: 'board',
    component: BoardComponent,
    props(route) {
      return {
        boardIndex: parseInt(route.params.boardIndex),
      };
    },
    children: [
      {
        name: 'card',
        path: 'column/:columnIndex/card/:cardIndex',
        component: Card,
        props(route) {
          return {
            boardIndex: parseInt(route.params.boardIndex),
            columnIndex: parseInt(route.params.columnIndex),
            cardIndex: parseInt(route.params.cardIndex),
          };
        },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public);

  const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut);

  const loggedIn = !!store.state.isSuccessAuth;

  if (!isPublic && !loggedIn) {
    return next({
      path:'/login',
      query: { redirect: to.fullPath }  // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next('/')
  }

  next();
});

new Vue({
  el: APPLICATION_SELECTOR,
  store,
  router,
  template: '<app/>',
  mounted() {},
});

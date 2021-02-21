import Vue from 'vue';
import Vuex from 'vuex';
import api, { cancelRequest, cancelTokenSource } from '@/helpers/api';

Vue.use(Vuex);

export const SET_LOADING = 'SET_LOADING';
export const GET_PLAYERS = 'GET_PLAYERS';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const CLEAR_PLAYERS = 'CLEAR_PLAYERS';
export const CLEAR_GAMES = 'CLEAR_GAMES';
export const CREATE_MATCH = 'CREATE_MATCH';
export const GET_MATCH = 'GET_MATCH';
export const SET_NAVIGATION_MANUAL = 'SET_NAVIGATION_MANUAL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

const playerPlaceholder = {
  personaname: '',
  avatar: '/user.png',
  avatarmedium: '/user.png',
  disabled: true,
};

export default new Vuex.Store({
  state: {
    id: null,
    players: [],
    games: [],
    playersErrors: [],
    gamesErrors: [],
    loadingPlayers: false,
    loadingGames: false,
    isManualNavigated: false,
  },
  getters: {
    players: (state) => {
      const placeholder =
        !state.players || state.players.length < 3
          ? Array(3 - state.players.length).fill(playerPlaceholder)
          : [];
      return [...state.players, ...placeholder];
    },
    games: (state) => state.games,
    playersCount: (state) => (state.players && state.players.length) || 0,
    steamIds: (state) => state.players && state.players.map((p) => p.steamid),
    gamesCount: (state) => (state.games && state.games.length) || 0,
    loadingGames: (state) => state.loadingGames,
    loadingPlayers: (state) => state.loadingPlayers,
    id: (state) => state.id,
    isManualNavigated: (state) => state.isManualNavigated,
    errors: (state) => [...state.playersErrors, ...state.gamesErrors],
  },
  mutations: {
    [SET_LOADING](state, { type = 'Players', loading }) {
      !loading
        ? setTimeout(() => (state[`loading${type}`] = loading), 400)
        : (state[`loading${type}`] = loading);
    },
    [GET_PLAYERS](state, { players, errors }) {
      if (errors) state.playersErrors = errors;
      state.players =
        [
          ...state.players,
          ...players.filter((p) => !state.players.some(({ steamid }) => steamid === p.steamid)),
        ] || [];
    },
    [REMOVE_PLAYER](state, player) {
      state.players.splice(state.players.indexOf(player), 1);
      if (!state.players || !state.players.length) {
        state.playersErrors = [];
        state.gamesErrors = [];
      }
    },
    [CLEAR_PLAYERS](state) {
      state.players = [];
    },
    [CLEAR_GAMES](state) {
      state.games = [];
    },
    [CLEAR_ERRORS](state, type) {
      state[`${type}Errors`] = [];
    },
    [GET_MATCH](state, { players, games, id, errors, isNew = false }) {
      if (players) state.players = players;
      if (games) state.games = games;
      if (id) state.id = id;
      if (errors) state.gamesErrors = errors;
      state.isNew = isNew;
    },
    [SET_NAVIGATION_MANUAL](state, payload) {
      state.isManualNavigated = payload;
    },
  },
  actions: {
    async [GET_PLAYERS]({ commit }, { nicknames, steamIds }) {
      commit(SET_LOADING, { type: 'Players', loading: true });
      commit(CLEAR_ERRORS, 'players');
      try {
        const { players, errors } = await api.post(
          '/players/',
          {
            nicknames,
            steamIds,
          },
          { cancelToken: cancelTokenSource.token },
        );
        if (!players) return;
        commit(GET_PLAYERS, { players, errors });
        commit(SET_LOADING, { type: 'Players', loading: false });
        return { players, errors };
      } catch (e) {
        commit(SET_LOADING, { type: 'Players', loading: false });
        return Promise.reject(e);
      }
    },
    async [CREATE_MATCH]({ commit, getters }) {
      cancelRequest();
      commit(SET_LOADING, { type: 'Games', loading: true });
      commit(CLEAR_ERRORS, 'games');
      try {
        const response = await api.post(
          '/match/create',
          {
            steamIds: getters.steamIds,
          },
          { cancelToken: cancelTokenSource.token },
        );
        const { games, id, errors } = response;
        commit(SET_NAVIGATION_MANUAL, true);
        commit(GET_MATCH, { games, id, errors, isNew: true });
        commit(SET_LOADING, { type: 'Games', loading: false });
        return response;
      } catch (e) {
        if (e === 'cancel') return;
        commit(SET_LOADING, { type: 'Games', loading: false });
        return Promise.reject(e);
      }
    },
    async [GET_MATCH]({ commit }, id) {
      cancelRequest();
      commit(SET_LOADING, { type: 'Games', loading: true });
      commit(CLEAR_ERRORS);
      try {
        const response = await api.get('/match/get', {
          params: { id },
          cancelToken: cancelTokenSource.token,
        });
        commit(GET_MATCH, response);
        commit(SET_LOADING, { type: 'Games', loading: false });
        return response;
      } catch (e) {
        if (e === 'cancel') return;
        commit(SET_LOADING, { type: 'Games', loading: false });
        return Promise.reject(e);
      }
    },
  },
});

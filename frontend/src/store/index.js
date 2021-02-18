import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/helpers/api';

Vue.use(Vuex);

export const SET_LOADING = 'SET_LOADING';
export const GET_PLAYERS = 'GET_PLAYERS';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const CLEAR_PLAYERS = 'CLEAR_PLAYERS';
export const CLEAR_GAMES = 'CLEAR_GAMES';
export const CREATE_MATCH = 'CREATE_MATCH';
export const GET_MATCH = 'GET_MATCH';

const playerPlaceholder = {
  personaname: '',
  avatar: '/user.png',
  avatarmedium: '/user.png',
  disabled: true,
};

const gamePlaceholder = {
  name: '',
  steam_appid: '',
  header_image: 'game.png',
};

export default new Vuex.Store({
  state: {
    players: [],
    games: [],
    loadingPlayers: false,
    loadingGames: false,
  },
  getters: {
    players: (state) => {
      const placeholder =
        !state.players || state.players.length < 3
          ? Array(3 - state.players.length).fill(playerPlaceholder)
          : [];
      return [...state.players, ...placeholder];
    },
    games: (state) => {
      const placeholder =
        !state.games || state.games.length < 3
          ? Array(3 - state.games.length).fill(gamePlaceholder)
          : [];
      return [...state.games, ...placeholder];
    },
    playersCount: (state) => (state.players && state.players.length) || 0,
    playerUrls: (state) => state.players && state.players.map((p) => p.profileurl),
    gamesCount: (state) => (state.games && state.games.length) || 0,
    loadingGames: (state) => state.loadingGames,
    loadingPlayers: (state) => state.loadingPlayers,
  },
  mutations: {
    [SET_LOADING](state, { type = 'Players', loading }) {
      !loading
        ? setTimeout(() => (state[`loading${type}`] = loading), 400)
        : (state[`loading${type}`] = loading);
    },
    [GET_PLAYERS](state, { players }) {
      state.players =
        [
          ...state.players,
          ...players.filter((p) => !state.players.some(({ steamid }) => steamid === p.steamid)),
        ] || [];
    },
    [REMOVE_PLAYER](state, player) {
      state.players.splice(state.players.indexOf(player), 1);
    },
    [CLEAR_PLAYERS](state) {
      state.players = [];
    },
    [CLEAR_GAMES](state) {
      state.games = [];
    },
    [GET_MATCH](state, { players, games, link }) {
      if (players) state.players = players;
      if (games) state.games = games;
      if (link) state.link = link;
    },
  },
  actions: {
    async [GET_PLAYERS]({ commit }, payload) {
      commit(SET_LOADING, { type: 'Players', loading: true });
      try {
        const players = await api.post('/players/', { urls: payload });
        if (!players) return;
        commit(GET_PLAYERS, { players });
        commit(SET_LOADING, { type: 'Players', loading: false });
        return players;
      } catch (e) {
        commit(SET_LOADING, { type: 'Players', loading: false });
        return Promise.reject(e);
      }
    },
    async [CREATE_MATCH]({ commit, getters }) {
      commit(SET_LOADING, { type: 'Games', loading: true });
      try {
        const response = await api.post('/match/create', {
          urls: getters.playerUrls,
        });
        commit(GET_MATCH, response);
        commit(SET_LOADING, { type: 'Games', loading: false });
        return response;
      } catch (e) {
        commit(SET_LOADING, { type: 'Games', loading: false });
        return Promise.reject(e);
      }
    },
    async [GET_MATCH]({ commit }, id) {
      commit(SET_LOADING, { type: 'Games', loading: true });
      try {
        const response = await api.get('/match/get', { params: { id } });
        commit(GET_MATCH, response);
        commit(SET_LOADING, { type: 'Games', loading: false });
        return response;
      } catch (e) {
        commit(SET_LOADING, { type: 'Games', loading: false });
        return Promise.reject(e);
      }
    },
  },
});

import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/helpers/api';

Vue.use(Vuex);

export const SET_LOADING = 'SET_LOADING';
export const GET_PLAYERS = 'GET_PLAYERS';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const CLEAR_PLAYERS = 'CLEAR_PLAYERS';

export default new Vuex.Store({
  state: {
    players: [],
    loading: false,
  },
  getters: {
    players: (state) => {
      const placeholder =
        !state.players || state.players.length < 3
          ? Array(3 - state.players.length).fill({
              personaname: '',
              avatar: 'user.png',
              avatarmedium: 'user.png',
              disabled: true,
            })
          : [];
      return [...state.players, ...placeholder];
    },
    playersCount: (state) => (state.players && state.players.length) || 0,
    loading: (state) => state.loading,
  },
  mutations: {
    [SET_LOADING](state, payload) {
      state.loading = payload;
    },
    [GET_PLAYERS](state, payload) {
      state.players =
        [
          ...state.players,
          ...payload.filter((p) => !state.players.some(({ steamid }) => steamid === p.steamid)),
        ] || [];
    },
    [REMOVE_PLAYER](state, player) {
      state.players.splice(state.players.indexOf(player), 1);
    },
    [CLEAR_PLAYERS](state) {
      state.players = [];
    },
  },
  actions: {
    async [GET_PLAYERS]({ commit }, payload) {
      commit(SET_LOADING, true);
      try {
        const players = await api.post('/players/', { urls: payload });
        if (!players) return;
        commit(GET_PLAYERS, players);
        commit(SET_LOADING, false);
        return players;
      } catch (e) {
        commit(SET_LOADING, false);
        return Promise.reject(e);
      }
    },
  },
});

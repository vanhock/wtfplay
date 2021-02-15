import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/helpers/api';

Vue.use(Vuex);

export const SET_LOADING = 'SET_LOADING';
export const GET_PLAYERS = 'GET_PLAYERS';

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
              disabled: true,
            })
          : [];
      return [...state.players, ...placeholder];
    },
    playersCount: (state) => state.players && state.players.length,
    loading: (state) => state.loading,
  },
  mutations: {
    [SET_LOADING](state, payload) {
      state.loading = payload;
    },
    [GET_PLAYERS](state, payload) {
      state.players = payload || [];
    },
  },
  actions: {
    async [GET_PLAYERS]({ commit }, payload) {
      commit(SET_LOADING, true);
      const players = await api.get('/players', { params: payload });
      if (!players) return;
      commit(GET_PLAYERS, players);
      commit(SET_LOADING, false);
      return players;
    },
  },
});

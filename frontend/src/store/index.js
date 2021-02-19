import Vue from 'vue';
import Vuex from 'vuex';
import api, {cancelRequest, cancelTokenSource} from '@/helpers/api';

Vue.use(Vuex);

export const SET_LOADING = 'SET_LOADING';
export const GET_PLAYERS = 'GET_PLAYERS';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';
export const CLEAR_PLAYERS = 'CLEAR_PLAYERS';
export const CLEAR_GAMES = 'CLEAR_GAMES';
export const CREATE_MATCH = 'CREATE_MATCH';
export const GET_MATCH = 'GET_MATCH';
export const SET_NAVIGATION_MANUAL = 'SET_NAVIGATION_MANUAL';

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
    id: null,
    players: [],
    games: [],
    loadingPlayers: false,
    loadingGames: false,
    isManualNavigated: false
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
    steamIds: (state) => state.players && state.players.map((p) => p.steamid),
    gamesCount: (state) => (state.games && state.games.length) || 0,
    loadingGames: (state) => state.loadingGames,
    loadingPlayers: (state) => state.loadingPlayers,
    id: (state) => state.id,
    isManualNavigated: (state) => state.isManualNavigated
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
    [GET_MATCH](state, { players, games, id, isNew = false }) {
      if (players) state.players = players;
      if (games) state.games = games;
      if (id) state.id = id;
      state.isNew = isNew
    },
    [SET_NAVIGATION_MANUAL] (state, payload) {
      state.isManualNavigated = payload
    }
  },
  actions: {
    async [GET_PLAYERS]({ commit }, { nicknames, steamIds }) {
      commit(SET_LOADING, { type: 'Players', loading: true });
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
        commit(GET_PLAYERS, { players });
        commit(SET_LOADING, { type: 'Players', loading: false });
        return { players, errors };
      } catch (e) {
        commit(SET_LOADING, { type: 'Players', loading: false });
        return Promise.reject(e);
      }
    },
    async [CREATE_MATCH]({ commit, getters }) {
      cancelRequest();
      try {
        const response = await api.post(
          '/match/create',
          {
            steamIds: getters.steamIds,
          },
          { cancelToken: cancelTokenSource.token },
        );
        commit(GET_MATCH, { ...response, isNew: true });
        commit(SET_LOADING, { type: 'Games', loading: false });
        return response;
      } catch (e) {
        console.log(e);
        commit(SET_LOADING, { type: 'Games', loading: false });
        return Promise.reject(e);
      }
    },
    async [GET_MATCH]({ commit }, id) {
      cancelRequest();
      commit(SET_LOADING, { type: 'Games', loading: true });
      try {
        const response = await api.get('/match/get', {
          params: { id },
          cancelToken: cancelTokenSource.token,
        });
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

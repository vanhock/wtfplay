<template>
  <div id="app">
    <Logo/>
    <Players/>
    <AddPlayers/>
    <Errors/>
    <Preloader
        v-show="loadingGames || loadingPlayers"
        :text="loadingText"
        :text-show-delay="loadingTextShowDelay"
        :text-delay="loadingTextDelay"
    />
    <router-view/>
    <UpButton/>
  </div>
</template>

<script>
import Players from '@/components/modules/Players';
import Logo from '@/components/modules/Logo';
import {GET_MATCH, SET_NAVIGATION_MANUAL} from '@/store';
import Preloader from '@/components/primitives/Preloader';
import {mapGetters} from 'vuex';
import UpButton from '@/components/primitives/UpButton';
import AddPlayers from '@/components/modules/AddPlayers';
import Errors from "@/components/modules/Errors";
import gameQuotes from "@/helpers/gameQuotes";

export default {
  components: {Errors, AddPlayers, UpButton, Preloader, Logo, Players},
  created() {
    const matchId =
        (this.$router.history.pending && this.$router.history.pending.params.id) ||
        this.$route.params.id;
    this.getMatchById(matchId);
    this.$router.beforeEach((to, from, next) => {
      if (!this.isManualNavigated) this.getMatchById(to.params.id);
      this.$store.commit(SET_NAVIGATION_MANUAL, false);
      next();
    });
  },
  data: () => ({
    loadingText: gameQuotes,
    loadingTextDelay: 9000,
    loadingTextShowDelay: 7000,
  }),
  computed: {
    ...mapGetters(['loadingGames', 'loadingPlayers', "playersCount", 'gamesCount', 'id', 'isManualNavigated']),
  },
  methods: {
    async getMatchById(matchId) {
      if (!matchId) return;
      try {
        await this.$store.dispatch(GET_MATCH, matchId);
      } catch (e) {
        await this.$router.push({name: 'AddPlayers'});
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  max-width: 1280px;
  margin: 0 auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  @media (max-width: $mobile) {
    padding: 0 15px;
  }
}

button {
  border: 0;
  appearance: none;
  outline-color: #ccc;
  box-sizing: border-box;
  user-select: none;

  &:active {
    outline: none;
  }
}

.buttons {
  display: flex;
  justify-content: center;
  margin: 0 auto;

  & > * {
    margin: 0 15px;
  }
}

[disabled] {
  pointer-events: none;
  opacity: 0.5;
}
</style>

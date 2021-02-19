<template>
  <div id="app">
    <Logo/>
    <Players/>
    <AddPlayers/>
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

export default {
  components: {AddPlayers, UpButton, Preloader, Logo, Players},
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
    loadingText: [
      'Finding players',
      'Looking for perks',
      'Asking Gordon Freemen',
      'Opening a portal',
      'Killing zombie',
      'Planting the bomb',
      '3',
      '2',
      '1',
      'Boom!',
      'Almost there',
    ],
    loadingTextDelay: 6000,
    loadingTextShowDelay: 3000,
  }),
  computed: {
    ...mapGetters(['loadingGames', 'loadingPlayers', 'gamesCount', 'id', 'isManualNavigated']),
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

  &:active {
    outline: none;
  }
}

[disabled] {
  pointer-events: none;
  opacity: 0.5;
}
</style>

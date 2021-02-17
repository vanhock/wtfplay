<template>
  <div id="app">
    <Logo />
    <Players />
    <Preloader v-show="loadingGames" />
    <router-view />
    <UpButton />
  </div>
</template>

<script>
import Players from '@/components/modules/Players';
import Logo from '@/components/modules/Logo';
import { GET_MATCH } from '@/store';
import Preloader from '@/components/primitives/Preloader';
import { mapGetters } from 'vuex';
import UpButton from '@/components/primitives/UpButton';

export default {
  components: { UpButton, Preloader, Logo, Players },
  created() {
    const matchId = this.$router.history.pending && this.$router.history.pending.params.id;
    this.getMatchById(matchId);
  },
  computed: {
    ...mapGetters(['loadingGames']),
  },
  methods: {
    async getMatchById(matchId) {
      if (!matchId) return;
      try {
        await this.$store.dispatch(GET_MATCH, matchId);
      } catch (e) {
        await this.$router.push({ name: 'AddPlayers' });
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
  outline: none;
  border: 0;
  appearance: none;
}

[disabled] {
  pointer-events: none;
  opacity: 0.5;
}
</style>

<template>
  <div class="games">
    <Game
      v-for="game in games"
      :key="game.steam_appid"
      :name="game.name"
      :header_image="game.header_image"
    />
  </div>
</template>

<script>
import Game from '@/components/modules/Game';
import { mapGetters } from 'vuex';

export default {
  name: 'Games',
  components: { Game },
  computed: {
    ...mapGetters(['games', 'gamesCount']),
  },
};
</script>

<style lang="scss" scoped>
.games {
  margin-top: 45px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  grid-gap: 1.5rem;
  justify-content: center;
  justify-items: center;
}
</style>

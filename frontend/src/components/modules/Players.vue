<template>
  <div class="players">
    <div class="players__instruction" v-if="!playersCount && !loadingGames">
      Don't know what to play <br />with your friends in Steam? 😔
      <p><b>👉 Paste profile's links and let's find out! 😍</b></p>
    </div>
    <div class="players-list" v-if="playersCount">
      <Player
        v-for="(player, index) in players"
        :key="player.steamid || index"
        v-bind="player"
        @remove="removePlayer(player)"
        :editable="playersEditable"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Player from '@/components/modules/Player';
import { REMOVE_PLAYER } from '@/store';

export default {
  name: 'Players',
  components: { Player },
  computed: {
    ...mapGetters(['players', 'playersCount', 'gamesCount', 'loadingPlayers', 'loadingGames']),
    playersEditable() {
      return !this.loadingPlayers && !this.gamesCount && !this.loadingGames;
    },
  },
  methods: {
    removePlayer(player) {
      this.$store.commit(REMOVE_PLAYER, player);
    },
  },
};
</script>

<style lang="scss" scoped>
.players {
  height: 86px;
  margin-top: 25px;
  margin-bottom: 20px;
  overflow-y: hidden;
  &__instruction {
    line-height: 22px;
  }
}
.players-list {
  height: 86px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: hidden;
  @media (max-width: $mobile) {
    width: fit-content;
    justify-content: flex-start;
    margin: 0 auto;
  }
}
</style>

<template>
  <div class="players" ref="players">
    <div class="players__instruction" v-if="!playersCount && !loadingGames">
      Don't know what to play <br/>with your friends in Steam? 😔
      <p><b>👉 Paste profile's links and let's find out! 😍</b></p>
    </div>
    <div class="players-list" v-if="playersCount">
      <Player
          v-for="(player, index) in players"
          :key="player.steamid || index"
          v-bind="player"
          @remove="removePlayer(player)"
          :editable="!!player.steamid"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Player from '@/components/modules/Player';
import {CLEAR_ERRORS, CLEAR_GAMES, CREATE_MATCH, REMOVE_PLAYER, SET_LOADING} from '@/store';
import {cancelRequest} from "@/helpers/api";

export default {
  name: 'Players',
  components: {Player},
  computed: {
    ...mapGetters(['players', 'playersCount', 'gamesCount', 'loadingPlayers', 'loadingGames']),
  },
  watch: {
    players(current, prev) {
      if(prev !== current) {
        this.$nextTick(() => {
          this.$refs.players.scrollLeft = this.$refs.players.scrollWidth
        })
      }
    }
  },
  methods: {
    async removePlayer(player) {
      this.$store.commit(REMOVE_PLAYER, player);
      this.$store.commit(CLEAR_ERRORS, 'players');
      if (this.playersCount > 1) {
        const response = await this.$store.dispatch(CREATE_MATCH);
        if (!response) return;
        const {id} = response;
        await this.$router.push({name: 'Match', params: {id: id}});
      } else {
        this.$store.commit(SET_LOADING, {type: 'Games', loading: false});
        this.$store.commit(CLEAR_GAMES);
        cancelRequest();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.players {
  height: 86px;
  margin-top: 25px;
  padding-bottom: 20px;
  overflow-y: hidden;

  &__instruction {
    line-height: 22px;
  }
}

.players-list {
  height: 88px;
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

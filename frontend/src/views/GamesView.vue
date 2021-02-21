<template>
  <div class="games-view">
    <template v-if="gamesCount && !loadingGames">
      <div class="games-view__text">
        <b>🎉 Congratulations! 🎉</b>
        <p>
          Found <b>{{ gamesCount }} {{ gamesCount === 1 ? 'game' : 'games' }}</b> you can play with
          your friends in Steam
        </p>
      </div>
      <Games />
    </template>
    <div class="games-view__empty" v-show="gamesNotFound">
      <p>There are no games yet</p>
      <div class="buttons" v-if="playersCount > 1">
        <VButtonInline @click="getMatch">Try again</VButtonInline>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Games from '@/components/modules/Games';
import VButtonInline from "@/components/primitives/VButtonInline";
import {CREATE_MATCH} from "@/store";

export default {
  name: 'MatchView',
  components: {VButtonInline, Games },
  computed: {
    ...mapGetters(['gamesCount', "loadingGames", "playersCount"]),
    gamesNotFound() {
      return !this.gamesCount && !this.loadingGames && this.playersCount
    },
  },
  methods: {
    getMatch() {
      this.$store.dispatch(CREATE_MATCH)
    }
  }
};
</script>
<style lang="scss" scoped>
.games-view {
  &__text {
    margin-top: 45px;
  }

  &__actions {
    display: flex;
    justify-content: center;
    margin: 30px auto 0;

    & > * {
      margin: 0 10px;
    }
  }

  &__empty {
    margin-top: 30px;
    p {
      color: $colorCaption
    }
  }
}
</style>

<template>
  <div class="match-view">
    <template v-if="gamesCount && !loadingGames">
      <div class="match-view__text">
        <b>🎉 Congratulations! 🎉</b>
        <p>
          Found <b>{{ gamesCount }} {{ gamesCount === 1 ? 'game' : 'games' }}</b> you can play with
          your friends in Steam
        </p>
      </div>
      <Games />
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Games from '@/components/modules/Games';

export default {
  name: 'MatchView',
  components: {Games },
  computed: {
    ...mapGetters(['gamesCount', "loadingGames"]),
  }
};
</script>
<style lang="scss" scoped>
.match-view {
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
}
</style>

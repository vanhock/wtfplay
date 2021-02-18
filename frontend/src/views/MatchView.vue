<template>
  <div class="match-view" v-if="gamesCount">
    <div class="match-view__text" v-if="!loadingGames">
      <b>🎉 Congratulations! 🎉</b>
      <p>
        We found <b>{{ gamesCount }} {{ gamesCount === 1 ? 'game' : 'games' }}</b> you can play with
        your friends in Steam
      </p>
    </div>
    <div class="match-view__actions">
      <VButtonInline @click="tryAgain">Try again</VButtonInline>
      <VButton @click="copyToClipboard">Copy link</VButton>
    </div>
    <div class="copied" v-show="copied">Copied to clipboard</div>
    <Games />
  </div>
</template>
<script>
import Games from '@/components/modules/Games';
import { mapGetters } from 'vuex';
import VButtonInline from '@/components/primitives/VButtonInline';
import VButton from '@/components/primitives/VButton';
import { CLEAR_GAMES } from '@/store';

export default {
  name: 'MatchView',
  components: { VButton, VButtonInline, Games },
  data: () => ({
    copied: false,
  }),
  computed: {
    ...mapGetters(['gamesCount', "loadingGames"]),
  },
  methods: {
    copyToClipboard() {
      const el = document.createElement('textarea');
      el.value = location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2500);
    },
    tryAgain() {
      this.$store.commit(CLEAR_GAMES);
      this.$router.push({ name: 'AddPlayers' });
    },
  },
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

.copied {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 15px;
  color: green;
  text-align: center;
  font-size: 12px;
}
</style>

<template>
  <div class="add-players">
    <div class="add-players__tip">
      <template v-if="showAmountTip">Add one more player</template>
      <template v-if="showMaxTip">You've reached maximum players</template>
      <template v-else-if="playersCount > 1">added {{ playersCount }} players</template>
    </div>
    <VInput
      class="add-players__input"
      ref="input"
      v-model="currentValue"
      placeholder="Paste links of steam profiles..."
      :invalid="!isInputValid"
      :disabled="inputDisabled"
    />
    <div class="add-players__buttons">
      <VButton class="add-players__submit" :disabled="buttonDisabled" @click="getPlayers"
        >Add players
      </VButton>
      <VButtonOutline v-show="gamesCount" :disabled="loadingGames" @click="copyToClipboard"
        >Copy link</VButtonOutline
      >
    </div>
    <div class="copied" v-show="copied">Copied to clipboard</div>
  </div>
</template>

<script>
import VButton from '@/components/primitives/VButton';
import {CLEAR_PLAYERS, CREATE_MATCH, GET_PLAYERS, SET_NAVIGATION_MANUAL} from '@/store';
import { mapGetters } from 'vuex';
import VInput from '@/components/primitives/VInput';
import VButtonOutline from '@/components/primitives/VButtonOutline';

export default {
  name: 'AddPlayers',
  components: { VButtonOutline, VInput, VButton },
  mounted() {
    this.focusInput();
  },
  data: () => ({
    currentValue: null,
    isInputValid: true,
    links: [],
    errorMessage: null,
    copied: false,
  }),
  computed: {
    ...mapGetters(['players', 'playersCount', 'gamesCount', 'loadingGames', 'loadingPlayers']),
    buttonDisabled() {
      return !this.currentValue;
    },
    inputDisabled() {
      return false;
    },
    showAmountTip() {
      return this.playersCount === 1;
    },
    showMaxTip() {
      return this.playersCount === 10;
    },
  },
  methods: {
    async getPlayers() {
      if (!this.currentValue || !this.currentValue) return;
      this.isInputValid = true;
      this.errorMessage = null;
      const data = this.resolveInputData();
      try {
        const { errors } = await this.$store.dispatch(GET_PLAYERS, data);
        if (errors && errors.length) this.errorMessage = errors.join(', ');
        if (this.playersCount > 1) {
          const { id } = await this.$store.dispatch(CREATE_MATCH);
          this.$store.commit(SET_NAVIGATION_MANUAL, true);
          await this.$router.push({ name: 'Match', params: { id: id } });
        }
      } catch (e) {
        this.errorMessage = e;
        this.isInputValid = false;
      }
    },
    resolveInputData() {
      const dataArray = this.currentValue.includes(',')
        ? this.currentValue.trim().split(',')
        : this.currentValue.trim().split(' ');
      const nicknames = [];
      const steamIds = [];
      for (const item of dataArray) {
        const formattedItem = this.formatInputData(item);
        const isSteamId = formattedItem.match(/(^\d{17}$)/gm); // Test on 64bit SteamId
        if (isSteamId) {
          steamIds.push(formattedItem);
        } else {
          nicknames.push(formattedItem);
        }
      }

      return { nicknames, steamIds };
    },
    formatInputData(data) {
      return (
        data &&
        data
          .trim()
          .replace('https://steamcommunity.com/id/', '')
          .replace('https://steamcommunity.com/profiles/', '')
          .split('/')[0]
          .split('?')[0]
      );
    },
    clearPlayers() {
      this.$store.commit(CLEAR_PLAYERS);
    },
    focusInput() {
      this.$nextTick(() => {
        this.$refs.input.setFocus();
      });
    },
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
  },
};
</script>

<style lang="scss" scoped>
.add-players {
  &__buttons {
    display: flex;
    justify-content: center;
    margin: 0 auto;

    & > * {
      margin: 0 15px;
    }
  }

  &__input {
    display: flex;
    max-width: 600px;
    margin: 0 auto 30px;
  }

  &__tip {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 18px;
    margin-bottom: 15px;
    font-size: 12px;
    color: $colorCaption;
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

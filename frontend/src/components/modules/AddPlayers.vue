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
        :disabled="inputDisabled"
        @submit="getPlayers"
    />
    <div class="buttons">
      <VButton class="add-players__submit" :disabled="buttonDisabled" @click="getPlayers"
      >Add players
      </VButton>
      <VButtonOutline v-show="gamesCount" :disabled="loadingGames" @click="copyToClipboard"
      >Copy link
      </VButtonOutline>
    </div>
    <div class="copied" v-show="copied">Copied to clipboard</div>
  </div>
</template>

<script>
import {debounce} from "lodash";
import VButton from '@/components/primitives/VButton';
import {CREATE_MATCH, GET_PLAYERS, SET_NAVIGATION_MANUAL} from '@/store';
import {mapGetters} from 'vuex';
import VButtonOutline from '@/components/primitives/VButtonOutline';
import VInput from "@/components/primitives/VInput";

export default {
  name: 'AddPlayers',
  components: {VInput, VButtonOutline, VButton},
  mounted() {
    this.focusInput();
  },
  data: () => ({
    currentValue: null,
    isInputValid: true,
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
    getPlayers: debounce(async function () {
      console.log("add player call");
      if (!this.currentValue) return;
      this.isInputValid = true;
      this.errorMessage = null;
      const data = this.resolveInputData();
      this.currentValue = null;
      this.focusInput();
      try {
        const {errors} = await this.$store.dispatch(GET_PLAYERS, data);
        if (errors && errors.length) this.errorMessage = errors.join(', ');
        if (this.playersCount > 1) {
          const {id} = await this.$store.dispatch(CREATE_MATCH);
          this.$store.commit(SET_NAVIGATION_MANUAL, true);
          await this.$router.push({name: 'Match', params: {id: id}});
        }
      } catch (e) {
        this.errorMessage = e;
        this.isInputValid = false;
      }

    }, 100),
    resolveInputData() {
      const dataArray = this.currentValue.includes(",") ? this.currentValue.trim().split(',') : this.currentValue.trim().split(' ');
      const nicknames = [];
      const steamIds = [];
      for (const item of dataArray) {
        if (!item) continue;
        const formattedItem = this.formatInputData(item);
        const isSteamId = formattedItem.match(/(^\d{17}$)/gm); // Test on 64bit SteamId
        if (isSteamId) {
          steamIds.push(formattedItem);
        } else {
          nicknames.push(formattedItem);
        }
      }

      return {nicknames, steamIds};
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
    focusInput() {
      this.$nextTick(() => {
        this.$refs.input && this.$refs.input.setFocus();
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

<template>
  <div class="add-players">
    <template v-if="!loadingGames">
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
        <VButtonInline :disabled="!playersCount || loadingPlayers" @click="clearPlayers"
        >Clear
        </VButtonInline
        >
        <VButton class="add-players__submit" :disabled="buttonDisabled" @click="setLinks"
        >Add player
        </VButton
        >
      </div>
    </template>
  </div>
</template>

<script>
import VButton from '@/components/primitives/VButton';
import {CLEAR_PLAYERS, CREATE_MATCH, GET_PLAYERS} from '@/store';
import {mapGetters} from 'vuex';
import VInput from '@/components/primitives/VInput';
import {debounce} from 'lodash';
import VButtonInline from '@/components/primitives/VButtonInline';

export default {
  name: 'AddPlayersView',
  components: {VButtonInline, VInput, VButton},
  mounted() {
    this.focusInput();
  },
  data: () => ({
    currentValue: null,
    isInputValid: true,
    links: [],
  }),
  computed: {
    ...mapGetters(['players', 'playersCount', 'loadingGames', 'loadingPlayers']),
    buttonDisabled() {
      return !this.currentValue
    },
    inputDisabled() {
      return this.loadingPlayers || this.playersCount === 10;
    },
    showAmountTip() {
      return this.playersCount === 1;
    },
    showMaxTip() {
      return this.playersCount === 10;
    },
  },
  watch: {
    currentValue: debounce(function (value) {
      console.log('value', value);
    }, 100),
  },
  methods: {
    async setLinks() {
      if (!this.currentValue || !this.currentValue || this.playersCount < 2) return;
      this.isInputValid = true;
      let links = this.currentValue.includes(',')
          ? this.currentValue.trim().split(',')
          : this.currentValue.trim().split(' ');
      links = links.map((v) => v.trim());
      const isLinksValid = links.every((l) => l.includes('https://steamcommunity.com/id/'));
      if (links && links.length && isLinksValid) {
        const players = await this.getPlayers(links);
        if (players) this.currentValue = null;
      }
    },
    async getPlayers(links) {
      try {
        return await this.$store.dispatch(GET_PLAYERS, links);
      } catch (e) {
        this.isInputValid = false;
      }
    },
    async findGames() {
      const {id} = await this.$store.dispatch(CREATE_MATCH);
      await this.$router.push({name: 'Match', params: {id: id}});
    },
    clearPlayers() {
      this.$store.commit(CLEAR_PLAYERS);
    },
    focusInput() {
      this.$nextTick(() => {
        this.$refs.input.setFocus();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-players {
  &__buttons {
    display: flex;
    justify-content: center;
    margin: 30px auto 0;

    & > * {
      margin: 0 15px;
    }
  }

  &__input {
    display: flex;
    max-width: 600px;
    margin: 0 auto 50px;
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
</style>

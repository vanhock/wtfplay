<template>
  <div class="add-players">
    <div class="add-players__tip">
      <template v-if="showAmountTip">Add one more player</template>
      <template v-if="showMaxTip">You've reached maximum players</template>
      <template v-else-if="playersCount > 1">added {{ playersCount }} players</template>
    </div>
    <VInput class="add-players__input" ref="input" v-model="currentValue" placeholder="Paste links of steam profiles..."
            :invalid="!isInputValid"
            :disabled="inputDisabled"/>
    <div class="add-players__buttons">
      <VButtonInline :disabled="!playersCount || loading" @click="clearPlayers">Clear</VButtonInline>
      <VButton class="add-players__submit" :disabled="buttonDisabled" @click="findGames">Find common games</VButton>
    </div>
  </div>
</template>

<script>
import VButton from '@/components/VButton';
import {CLEAR_PLAYERS, CREATE_MATCH, GET_PLAYERS} from '@/store';
import {mapGetters} from 'vuex';
import VInput from "@/components/VInput";
import {debounce} from "lodash"
import VButtonInline from "@/components/VButtonInline";

export default {
  name: 'AddPlayers',
  components: {VButtonInline, VInput, VButton},
  mounted() {
    this.focusInput();
  },
  data: () => ({
    loadingPlayers: false,
    currentValue: null,
    isInputValid: true,
    links: []
  }),
  computed: {
    ...mapGetters(['players', 'playersCount', 'loading']),
    buttonDisabled() {
      return this.playersCount < 2 || this.loading;
    },
    inputDisabled() {
      return this.loading || this.playersCount === 10
    },
    showAmountTip() {
      return this.playersCount === 1
    },
    showMaxTip() {
      return this.playersCount === 10
    }
  },
  watch: {
    currentValue: debounce(function (value) {
      this.setLinks(value)
    }, 100)
  },
  methods: {
    async setLinks(value) {
      if (!value || !value.length) return;
      this.isInputValid = true;
      let links = value.includes(',') ? value.trim().split(',') : value.trim().split(' ');
      links = links.map(v => v.trim());
      const isLinksValid = links.every(l => l.includes('https://steamcommunity.com/id/'));
      if (links && links.length && isLinksValid) {
        const players = await this.getPlayers(links);
        if (players) this.currentValue = null;
      }
    },
    async getPlayers(links) {
      try {
        return await this.$store.dispatch(GET_PLAYERS, links);
      } catch (e) {
        this.isInputValid = false
      }
    },
    findGames() {
      this.$store.dispatch(CREATE_MATCH, {start: 0, offset: 2});
    },
    clearPlayers() {
      this.$store.commit(CLEAR_PLAYERS);
    },
    focusInput() {
      this.$nextTick(() => {
        this.$refs.input.setFocus();
      })
    }
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

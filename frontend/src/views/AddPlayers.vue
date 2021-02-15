<template>
  <div class="add-players">
    <VInput placeholder="Paste links of steam profiles..." value="" @input="setLinks" />
    <VButton class="add-players__submit" :disabled="buttonDisabled">Find common games</VButton>
  </div>
</template>

<script>
import VButton from '@/components/VButton';
import VInput from '@/components/VInput';
import { GET_PLAYERS } from '@/store';
import { mapGetters } from 'vuex';

export default {
  name: 'AddPlayers',
  components: { VInput, VButton },
  data: () => ({
    loadingPlayers: false,
  }),
  computed: {
    ...mapGetters(['players', 'playersCount', 'loading']),
    buttonDisabled() {
      return !this.players || !this.players.length < 2 || this.loading;
    },
  },
  methods: {
    setLinks(value) {
      if (!value) return;
      const links = value.split(' ').split(',');
      if (links && links.length) {
        this.getPlayers(links);
      }
    },
    getPlayers(links) {
      this.$store.dispatch(GET_PLAYERS, links);
    },
  },
};
</script>

<style lang="scss" scoped>
.add-players {
  &__submit {
    margin: 30px auto 0;
  }
}
</style>

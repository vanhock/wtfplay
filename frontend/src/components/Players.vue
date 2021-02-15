<template>
  <div class="players">
    <div class="players-list">
      <Player v-for="(player, index) in players" :key="index" v-bind="player" @remove="removePlayer(player)"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Player from "@/components/Player";
import {REMOVE_PLAYER} from "@/store";

export default {
  name: 'Players',
  components: {Player},
  computed: {
    ...mapGetters(['players', 'playersCount']),
  },
  methods: {
    removePlayer(player) {
      this.$store.commit(REMOVE_PLAYER, player);
    },
  }
};
</script>

<style lang="scss" scoped>
.players {
  margin-top: 25px;
  margin-bottom: 20px;
  overflow-y: hidden;
}
.players-list {
  height: 85px;
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

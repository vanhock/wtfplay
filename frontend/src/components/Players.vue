<template>
  <div class="players">
    <div class="players-list">
      <Player v-for="(player, index) in players" :key="index" v-bind="player"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Player from "@/components/Player";

export default {
  name: 'Players',
  components: {Player},
  computed: {
    ...mapGetters(['players', 'playersCount']),
  },
};
</script>

<style lang="scss" scoped>
.players-list {
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>

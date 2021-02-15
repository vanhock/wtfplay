<template>
  <div class="games">
    <Game v-for="game in gamesCount" :key="game.steam_appid" v-bind="game"/>
  </div>
</template>

<script>
import Game from "@/components/Game";
import {mapGetters} from "vuex";

export default {
  name: "Games",
  components: {Game},
  computed: {
    ...mapGetters(["games", "gamesCount"])
  }
}
</script>

<style lang="scss" scoped>
  .games {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    grid-gap: 1rem;
  }
</style>
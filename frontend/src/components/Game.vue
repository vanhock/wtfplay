<template>
  <div class="game">
    <img class="game__image" :src="header_image" :alt="name" />
    <div class="game__title">{{name}}</div>
  </div>
</template>

<script>
export default {
name: "Game",
  props: {
    name: String,
    steam_appid: Number,
    header_image: String,
  }
}
</script>

<style lang="scss" scoped>
  .game {
    &__title {
      margin-top: 15px;
      font-size: 14px;
      font-weight: bold;
      color: $colorSecond;
    }
  }
</style>
<template>
  <div class="game">
    <img class="game__image" :src="header_image" :alt="name" />
    <div class="game__title">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  props: {
    name: String,
    header_image: String,
    id: [String, Number],
    visible: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.game {
  margin-bottom: 1rem;
  &__image {
    width: 100%;
    border-radius: 5px;
  }
  &__title {
    margin-top: 10px;
    font-size: 14px;
    font-weight: bold;
    color: $colorSecond;
  }
}
</style>

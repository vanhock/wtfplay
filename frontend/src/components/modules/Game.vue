<template>
  <div class="game">
    <a :href="`https://store.steampowered.com/app/${id}`" target="_blank">
      <img class="game__image" :src="header_image" :alt="name"/>
      <div class="game__title">{{ name }}</div>
    </a>
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
  position: relative;
  margin-bottom: 1rem;
  a {
    text-decoration: none;
    @media (min-width: $mobile) {
      position: relative;
      display: block;
      transition: .2s ease transform;
      will-change: transform;
      z-index: 1;
    }
  }
  &:hover {
    a {
      @media (min-width: $mobile) {
        transform: scale(1.05);
        z-index: 2;
      }
    }
  }
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

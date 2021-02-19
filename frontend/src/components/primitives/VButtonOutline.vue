<template>
  <button class="v-button-outline" :type="type" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'VButtonOutline',
  props: {
    type: {
      type: String,
      default: 'button',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/mixins';
.v-button-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 110px;
  padding: 0 20px;
  border-radius: 35px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  will-change: transform;
  transition: transform linear 0.1s;
  border: 2px solid $colorPrime;
  background-color: transparent;
  color: $colorSecond;
  &:active {
    transform: scale(0.97);
  }
  &:hover {
    @include gradient();
    color: #fff;
  }
}
</style>

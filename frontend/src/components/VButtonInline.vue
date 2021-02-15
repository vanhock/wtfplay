<template>
  <button class="v-button-inline" :type="type" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'VButtonInline',
  props: {
    type: {
      type: String,
      default: 'button',
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/mixins';
.v-button-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 110px;
  padding: 0 20px;
  border-radius: 35px;
  font-size: 14px;
  font-weight: bold;
  color: $colorSecond;
  cursor: pointer;
  will-change: transform;
  transition: transform linear .1s;
  &:active {
    transform: scale(.97);
  }
}
</style>

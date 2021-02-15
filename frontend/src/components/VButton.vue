<template>
  <button class="v-button" :type="type">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'VButton',
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
.v-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 110px;
  padding: 0 15px;
  @include gradient();
  border-radius: 35px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  &:active {
    transform: scale(.99);
  }
}
</style>

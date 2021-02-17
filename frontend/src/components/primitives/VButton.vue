<template>
  <button class="v-button" :type="type" @click="$emit('click')">
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
@import '../../assets/styles/mixins';
.v-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 110px;
  padding: 0 20px;
  @include gradient();
  border-radius: 35px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  will-change: transform;
  transition: transform linear 0.1s;
  &:active {
    transform: scale(0.97);
  }
}
</style>

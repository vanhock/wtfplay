<template>
  <label class="v-input">
    <input class="v-input__input" v-model="inputValue" :type="type" :placeholder="placeholder"/>
  </label>
</template>

<script>
export default {
  name: 'VInput',
  props: {
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input {
  width: 100%;

  &__input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15px;
    font-size: 16px;
  }
}
</style>

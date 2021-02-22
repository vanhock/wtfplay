<template>
  <label class="v-input">
    <input
      ref="input"
      class="v-input__input"
      :class="{ 'v-input_invalid': invalid }"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      @keydown="handleKeydown"
    />
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
    },
    invalid: Boolean,
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
  methods: {
    setFocus() {
      this.$refs.input.focus();
    },
    handleKeydown(e) {
      if (e.keyCode === 13) this.$emit('submit');
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
    border-radius: 7px;
    outline: none;
    appearance: none;
    border: 2px solid $colorPrime;
    @include box-shadow(medium);
    text-align: center;
    font-size: 16px;

    &[disabled] {
      background-color: antiquewhite;
    }

    &.v-input_invalid {
      animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>

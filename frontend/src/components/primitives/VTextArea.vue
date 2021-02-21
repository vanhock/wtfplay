<template>
  <label class="v-textarea">
    <textarea
      ref="input"
      :style="{ height: `${height}px` }"
      class="v-textarea__input"
      :class="{ 'v-input_invalid': invalid, empty: !inputValue }"
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      @keydown="handleKeydown"
      @paste="handlePaste"
      @focus="handleFocus"
    />
    <button v-if="inputValue" class="v-textarea__clear" @click="handleClear" />
  </label>
</template>

<script>
export default {
  name: 'VTextArea',
  data: () => ({
    height: 44,
    defaultHeight: 44,
    expandedHeight: 44,
  }),
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
    maxHeight: {
      type: Number,
      default: 250,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', this.replaceSpaces(value));
      },
    },
  },
  methods: {
    handleKeydown(e) {
      if (e.keyCode === 13 && (e.shiftKey || e.ctrlKey)) return this.$emit('submit');
      this.setHeight(e);
    },
    handlePaste(e) {
      setTimeout(() => {
        this.inputValue = `${this.inputValue || ''} `;
      });
      this.setHeight(e);
    },
    handleFocus(e) {
      this.setHeight(e);
      setTimeout(() => {
        this.setFocus();
      });
    },
    setFocus() {
      const value = this.$refs.input.value;
      this.$refs.input.value = '';
      this.$refs.input.focus();
      this.$nextTick(() => {
        this.$refs.input.value = value;
      });
    },
    setHeight(e) {
      setTimeout(() => {
        const isEmpty = e && e.target && !e.target.value.replace(/\r?\n|\r/g, '').length;
        if (isEmpty) {
          this.height = this.defaultHeight;
          this.expandedHeight = this.defaultHeight;
        } else if (e.target.scrollHeight < this.maxHeight) {
          const newHeight = e.target.scrollHeight;
          this.height = newHeight;
          this.expandedHeight = newHeight;
        }
      }, 0);
    },
    replaceSpaces(value) {
      if (!value) return '';
      return value.replace(/ /g, '\r\n');
    },
    handleClear() {
      this.inputValue = '';
      this.height = this.defaultHeight;
      this.$emit('clear');
    },
  },
};
</script>

<style lang="scss" scoped>
.v-textarea {
  position: relative;
  width: 100%;

  &__input {
    width: 100%;
    min-height: 44px;
    box-sizing: border-box;
    padding: 8px 15px 10px;
    border-radius: 7px;
    outline: none;
    appearance: none;
    resize: none;
    border: 2px solid $colorPrime;
    @include box-shadow(medium);
    text-align: center;
    font-family: inherit;
    font-size: 16px;
    line-height: 26px;
    @include scroll();

    &:not(:focus) {
      max-height: 44px;
      //line-height: 16px;
      overflow: hidden;
      @media (min-width: $mobile) {
        padding-right: 28px;
      }
    }

    &.empty {
      line-height: 24px;
    }

    &[disabled] {
      background-color: antiquewhite;
    }

    &:focus {
      & + .v-textarea__clear {
        display: none;
      }
    }
  }

  &__clear {
    position: absolute;
    width: 45px;
    height: 40px;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    border-radius: 0 7px 7px 0;
    z-index: 1;
    cursor: pointer;

    &:before {
      position: absolute;
      content: '';
      width: 22px;
      height: 22px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 511.76 511.76'%3E%3Cpath d='M436.896 74.869c-99.84-99.819-262.208-99.819-362.048 0-99.797 99.819-99.797 262.229 0 362.048 49.92 49.899 115.477 74.837 181.035 74.837s131.093-24.939 181.013-74.837c99.819-99.818 99.819-262.229 0-362.048zm-75.435 256.448c8.341 8.341 8.341 21.824 0 30.165a21.275 21.275 0 01-15.083 6.251 21.277 21.277 0 01-15.083-6.251l-75.413-75.435-75.392 75.413a21.348 21.348 0 01-15.083 6.251 21.277 21.277 0 01-15.083-6.251c-8.341-8.341-8.341-21.845 0-30.165l75.392-75.413-75.413-75.413c-8.341-8.341-8.341-21.845 0-30.165 8.32-8.341 21.824-8.341 30.165 0l75.413 75.413 75.413-75.413c8.341-8.341 21.824-8.341 30.165 0 8.341 8.32 8.341 21.824 0 30.165l-75.413 75.413 75.415 75.435z'/%3E%3C/svg%3E");
      opacity: 0.2;
    }

    &:hover {
      &:before {
        opacity: 0.5;
      }
    }
  }
}
</style>

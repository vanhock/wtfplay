<template>
  <div class="errors" v-if="errors">
    <div v-for="(error, index) in errors" :key="index" class="errors__error">{{ error.message }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Errors',
  computed: {
    ...mapGetters(['errors']),
  },
};
</script>

<style lang="scss" scoped>
  .errors {
    margin-top: 30px;
    &__error {
      color: red;
      font-size: 14px;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
</style>

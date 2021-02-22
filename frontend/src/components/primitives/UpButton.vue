<template>
  <button v-show="show" class="up" @click="handleClick"></button>
</template>

<script>
import {debounce} from 'lodash';

export default {
  name: 'UpButton',
  mounted() {
    this.scrollListener = document.addEventListener('scroll', debounce(this.handleScroll, 100));
  },
  beforeDestroy() {
    document.removeEventListener(this.scrollListener, debounce(this.handleScroll, 100));
  },
  data: () => ({
    show: false,
    scrollListener: null,
  }),
  methods: {
    handleScroll() {
      const scroll = document.scrollingElement.scrollTop;
      this.show = scroll > 500;
    },
    handleClick() {
      document.querySelector('html').scrollIntoView({behavior: 'smooth'});
    },
  },
};
</script>

<style lang="scss" scoped>
.up {
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 47px;
  height: 47px;
  border-radius: 50%;
  @include box-shadow(very-deep);
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg fill='%23ccc' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 492.002 492.002'%3E%3Cpath d='M484.136 328.473L264.988 109.329c-5.064-5.064-11.816-7.844-19.172-7.844-7.208 0-13.964 2.78-19.02 7.844L7.852 328.265C2.788 333.333 0 340.089 0 347.297s2.784 13.968 7.852 19.032l16.124 16.124c5.064 5.064 11.824 7.86 19.032 7.86s13.964-2.796 19.032-7.86l183.852-183.852 184.056 184.064c5.064 5.06 11.82 7.852 19.032 7.852 7.208 0 13.96-2.792 19.028-7.852l16.128-16.132c10.488-10.492 10.488-27.568 0-38.06z'/%3E%3C/svg%3E");
  background-position: center;
  background-size: 50%;
  background-repeat: no-repeat;
  cursor: pointer;
  z-index: 15;
}
</style>

<template>
  <div id="app">
    <Logo />
    <Players/>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  max-width: 730px;
  margin: 0 auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

button {
  outline: none;
  border: 0;
  appearance: none;
}

[disabled] {
  pointer-events: none;
  opacity: .5;
}
</style>
<script>
import Players from "@/components/Players";
import Logo from "@/components/Logo";

export default {
  components: {Logo, Players}
}
</script>
<template>
  <div id="app">
    <Players/>
    <router-view/>
  </div>
</template>

<style>
#app {
  max-width: 600px;
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
</style>
<script>
import Players from "@/components/Players";

export default {
  components: {Players}
}
</script>
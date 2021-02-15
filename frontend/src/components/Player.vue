<template>
  <div class="player">
    <img class="player__avatar" :src="avatarmedium" :alt="personaname" />
    <div class="player-panel">
      <div class="player-panel__name">{{ personaname }}</div>
      <div class="player-panel__remove" role="button" data-text="Remove" @click="$emit('remove')"></div>
    </div>
  </div>
</template>

<script>
export default {
name: "Player",
  props: {
    personaname: String,
    avatarmedium: String,
    _id: String
  }
}
</script>

<style lang="scss" scoped>
.player {
  position: relative;
  margin: 0 10px;
  @media (max-width: $mobile) {
    margin: 0 14px;
  }
  &__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  &:not([disabled]):hover{
    .player-panel {
      display: block;
    }
  }
  &[disabled] .player-panel {
    @media (max-width: $mobile) {
      display: none;
    }
  }
}
.player-panel {
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;
  left: 0;
  top: 0;
  z-index: 1;

  @media (max-width: $mobile) {
    display: block;
  }
  &__name {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
  }
  &__remove {
    margin-left: calc(100% - 14px);
    width: 14px;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 511.76 511.76'%3E%3Cpath d='M436.896 74.869c-99.84-99.819-262.208-99.819-362.048 0-99.797 99.819-99.797 262.229 0 362.048 49.92 49.899 115.477 74.837 181.035 74.837s131.093-24.939 181.013-74.837c99.819-99.818 99.819-262.229 0-362.048zm-75.435 256.448c8.341 8.341 8.341 21.824 0 30.165a21.275 21.275 0 01-15.083 6.251 21.277 21.277 0 01-15.083-6.251l-75.413-75.435-75.392 75.413a21.348 21.348 0 01-15.083 6.251 21.277 21.277 0 01-15.083-6.251c-8.341-8.341-8.341-21.845 0-30.165l75.392-75.413-75.413-75.413c-8.341-8.341-8.341-21.845 0-30.165 8.32-8.341 21.824-8.341 30.165 0l75.413 75.413 75.413-75.413c8.341-8.341 21.824-8.341 30.165 0 8.341 8.32 8.341 21.824 0 30.165l-75.413 75.413 75.415 75.435z'/%3E%3C/svg%3E");
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #fff;
    cursor: pointer;
    opacity: .7;

  }
}
</style>
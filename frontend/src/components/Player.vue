<template>
  <div class="player">
    <img class="player__avatar" :src="avatar" :alt="personaname" />
    <div class="player-panel">
      <div class="player-panel__name">{{ personaname }}</div>
      <div class="player-panel__remove" role="button" :data-text="Remove"></div>
    </div>
  </div>
</template>

<script>
export default {
name: "Player",
  props: {
    personaname: String,
    avatar: String,
    _id: String
  }
}
</script>

<style lang="scss" scoped>
.player {
  position: relative;
  &__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  &:hover {
    .player-panel {
      display: block;
    }
  }
}
.player-panel {
  position: absolute;
  display: none;
  z-index: 1;
  @media (max-width: 768px) {
    pointer-events: none;
    transform: scale(0);
  }
  &__remove {
    width: 10px;
    height: 10px;
    background-image: url("data:image/svg+xml,%3Csvg width='15' height='16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.63.366A1.203 1.203 0 0013.775 0a1.154 1.154 0 00-.854.366L7.495 5.794 2.095.366A1.204 1.204 0 001.241 0a1.154 1.154 0 00-.853.366 1.215 1.215 0 000 1.741l5.426 5.426L.357 12.93a1.236 1.236 0 00.854 2.105 1.108 1.108 0 00.854-.367l5.43-5.428 5.428 5.428a1.204 1.204 0 001.321.277c.147-.063.28-.157.387-.277a1.215 1.215 0 000-1.74l-5.4-5.424 5.428-5.428a1.207 1.207 0 00-.03-1.71z' fill='%23B5B5B5'/%3E%3C/svg%3E");
    @media (max-width: 768px) {
      background-image: none;
      width: 100%;
      height: 50px;
      border-radius: 50px;
      background-color: $colorSecond;
    }
  }
}
</style>
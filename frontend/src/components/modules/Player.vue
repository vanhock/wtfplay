<template>
  <div class="player">
    <img class="player__avatar" :src="avatarmedium" :alt="personaname"/>
    <div class="player__name">{{ personaname }}</div>
    <button
        v-if="editable"
        class="player__remove"
        role="button"
        data-text="Remove"
        @click="$emit('remove')"
    ></button>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    personaname: String,
    avatarmedium: String,
    _id: String,
    editable: Boolean,
  },
};
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

  &:not([disabled]):hover {
    .player__name, .player__remove {
      opacity: 1;
    }
  }

  &[disabled] {
    .player__name, .player__remove {
      @media (max-width: $mobile) {
        opacity: 0;
      }
    }
  }

  &__name, &__remove {
    opacity: 0;
  }

  &__name {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;

    @media (max-width: $mobile) {
      opacity: 1;
    }
  }

  &__remove {
    position: absolute;
    width: 25px;
    height: 25px;
    top: -3px;
    right: -9px;
    margin-left: calc(100% - 17px);
    border-radius: 50%;
    cursor: pointer;
    background-color: transparent;
    @media (max-width: $mobile) {
      opacity: 1;
    }

    &:focus {
      opacity: 1;
    }

    &:active {
      outline: none;
    }

    &:before {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: block;
      content: '';
      width: 16px;
      height: 16px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 511.76 511.76'%3E%3Cpath d='M436.896 74.869c-99.84-99.819-262.208-99.819-362.048 0-99.797 99.819-99.797 262.229 0 362.048 49.92 49.899 115.477 74.837 181.035 74.837s131.093-24.939 181.013-74.837c99.819-99.818 99.819-262.229 0-362.048zm-75.435 256.448c8.341 8.341 8.341 21.824 0 30.165a21.275 21.275 0 01-15.083 6.251 21.277 21.277 0 01-15.083-6.251l-75.413-75.435-75.392 75.413a21.348 21.348 0 01-15.083 6.251 21.277 21.277 0 01-15.083-6.251c-8.341-8.341-8.341-21.845 0-30.165l75.392-75.413-75.413-75.413c-8.341-8.341-8.341-21.845 0-30.165 8.32-8.341 21.824-8.341 30.165 0l75.413 75.413 75.413-75.413c8.341-8.341 21.824-8.341 30.165 0 8.341 8.32 8.341 21.824 0 30.165l-75.413 75.413 75.415 75.435z'/%3E%3C/svg%3E");
      background-color: #fff;
      background-repeat: no-repeat;
      border-radius: 50%;
      border: 1px solid #fff;
      opacity: .7;
    }
  }
}
</style>

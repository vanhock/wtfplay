<template>
  <div class="preloader">
    <div class="preloader__text">
      <transition name="slide-fade">
        <span v-show="showText">{{ currentText }}</span>
      </transition>
    </div>

    <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
    <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
      <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
        <circle cx="22" cy="22" r="6" stroke-opacity="0">
          <animate
              attributeName="r"
              begin="1.5s"
              dur="3s"
              values="6;22"
              calcMode="linear"
              repeatCount="indefinite"
          />
          <animate
              attributeName="stroke-opacity"
              begin="1.5s"
              dur="3s"
              values="1;0"
              calcMode="linear"
              repeatCount="indefinite"
          />
          <animate
              attributeName="stroke-width"
              begin="1.5s"
              dur="3s"
              values="2;0"
              calcMode="linear"
              repeatCount="indefinite"
          />
        </circle>
        <circle cx="22" cy="22" r="6" stroke-opacity="0">
          <animate
              attributeName="r"
              begin="3s"
              dur="3s"
              values="6;22"
              calcMode="linear"
              repeatCount="indefinite"
          />
          <animate
              attributeName="stroke-opacity"
              begin="3s"
              dur="3s"
              values="1;0"
              calcMode="linear"
              repeatCount="indefinite"
          />
          <animate
              attributeName="stroke-width"
              begin="3s"
              dur="3s"
              values="2;0"
              calcMode="linear"
              repeatCount="indefinite"
          />
        </circle>
        <circle cx="22" cy="22" r="8">
          <animate
              attributeName="r"
              begin="0s"
              dur="1.5s"
              values="6;1;2;3;4;5;6"
              calcMode="linear"
              repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Preloader',
  data: () => ({
    currentText: '',
    showText: false,
    interval: null
  }),
  mounted() {
    this.setLoadingSequence();
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval)
  },
  props: {
    text: {
      type: Array,
      default: () => ["Loading"]
    },
    textDelay: {
      type: Number,
      default: 3500
    },
    textShowDelay: {
      type: Number,
      default: 1000
    }
  },
  methods: {
    setLoadingSequence() {
      let currentIndex = 0;
      this.interval = setInterval(() => {
        this.showText = true;
        this.currentText = this.text[currentIndex];
        currentIndex === this.text.length - 1 ? currentIndex = 0 : currentIndex++
        setTimeout(() => {
          this.showText = false;
        }, this.textShowDelay)
      }, this.textDelay)
    }
  }
};
</script>

<style lang="scss" scoped>
.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  min-width: 200px;
  min-height: 200px;

  svg {
    width: 100px;
    height: 100px;
    stroke: $colorPrime;
  }
  &__text {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100px;
    font-weight: bold;
    color: $colorPrime
  }
}

.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter {
  transform: translateX(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

</style>

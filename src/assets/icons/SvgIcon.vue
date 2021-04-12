<template>
  <svg :class="svgClass" aria-hidden="true" :style="styleObj">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    className: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '20px'
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  },
  data() {
    return {
      styleObj: {
        width: this.size,
        height: this.size
      }
    }
  }
}
</script>

<style scoped>
/* .svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
} */
</style>

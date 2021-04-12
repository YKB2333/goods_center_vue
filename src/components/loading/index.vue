<template>
  <div v-if="show">
    <div class="loading-mask_transparent"></div>
    <div class="loading-toast">
      <i class="loading-icon"></i>
      <p class="loading-centent" v-if="text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyLoading',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.loading-mask_transparent{
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.loading-toast{
  z-index: 5001;
  position: fixed;
  width: 7.6em;
  min-height: 7.6em;
  top: 180px;/* no */
  left: 50%;
  margin-left: -3.8em;
  background: rgba(17, 17, 17, 0.7);
  text-align: center;
  border-radius: 5px;/* no */
  color: #FFFFFF;
}
.loading-icon{
  margin: 18px 0 0;/* no */
  width: 38px;/* no */
  height: 38px;/* no */
  vertical-align: baseline;
  display: inline-block;
  background: transparent url('./loading.svg') no-repeat;
  background-size: 100%;
  animation: myLoading 1s steps(12, end) infinite;
}
.loading-content{
  margin: 0 0 15px;
}
@keyframes myLoading {
  0%{
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100%{
        transform: rotate3d(0, 0, 1, 360deg);
  }
}
</style>

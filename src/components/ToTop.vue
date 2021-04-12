<template>
    <div
      v-if="isShowToTop"
      class="fixed w30 h30 col totop"
      :style="{ zIndex: zIndex }"
    >
      <img
        @click="toTop"
        :src="require('@/assets/images/toTop.png')"
      />
    </div>
</template>

<script>
export default {
  data() {
    return {
      osTop: 0,
      clientHdight: 200,
      targetDom: null,
      // zzIndex: 999
    }
  },
  computed: {
    isShowToTop() {
      return this.osTop > this.clientHdight
    }
  },
  mounted() {
    this.targetDom = document.getElementById(this.target || 'app') ;
    console.log(this.targetDom);
    this.targetDom.onscroll = this.scrollHandle
    // document.getElementById('app').onscroll = this.scrollHandle
    // this.targetDom.addEventListener('scroll', this.scrollHandle )
  },
  destroyed() {
    this.targetDom.removeEventListener('scroll', this.scrollHandle)
  },
  props: {
    target: {
      type: String,
      default: ''
    },
    zIndex: {
      type: Number,
      default: 9999
    }
  },
  methods: {
    scrollHandle(e) {
      this.osTop = this.targetDom.scrollTop;
    },
    toTop() {
      let dom = document.getElementById('app');
      let osTop = dom.scrollTop;
      if (this.target) {
        if(document.getElementById(this.target).scrollTop > osTop) {
          dom = document.getElementById(this.target);
          osTop = dom.scrollTop;
        }
      }
      let speed = Math.floor(-osTop / 6);
      console.log(dom.scrollTop);
      let timer = setInterval(() => {
        dom.scrollTop += speed;
        if(dom.scrollTop <= 0) {
          clearInterval(timer)
        }
      }, 30);
    },
  }
}
</script>

<style scoped>
.totop {
  right:14px;
  bottom:150px;
  /* z-index:9999 */
}
</style>
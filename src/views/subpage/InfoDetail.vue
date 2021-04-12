<template>
  <div class="p14 info-wrapper">
    <div v-html="infoDetail && infoDetail.content"></div>
  </div>
</template>

<script>
import { getInfoById } from '@/api/cms'

export default {
  name: 'InfoDetail',
  components: {},
  data() {
    return {
      infoId: null,
      infoDetail: null
    }
  },
  computed: {},
  created() {
    this.infoId = this.$route.query.infoId
    let title = this.$route.query.title
    if(title) document.title = title
    console.log('资讯ID', this.infoId)
    this.fetchInfo()
  },
  mounted() {},
  methods: {
    // 根据资讯id获取资讯详情
    fetchInfo() {
      this.$store.commit('SHOW_LOADING')
      getInfoById(this.infoId).then(res => {
        console.log('资讯', res)
        this.infoDetail = res
      }).finally(() => {
        this.$store.commit('SHOW_LOADING', false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info-wrapper img {
  transform: scale(1) rotate(0) translate3d(0, 0, 0);
}
</style>

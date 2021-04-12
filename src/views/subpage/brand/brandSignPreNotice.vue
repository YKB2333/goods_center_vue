<template>
  <div>
    <div class="text-center pt40 pb30">
      <img :src="require('@/assets/images/brand_sign_pre_notice.png')" width="139" height="103">
      <div class="sub-text-color fs13 mt20">
        <p>新品牌正在洽谈中</p>
        <p class="mt6">敬请期待.....</p>
      </div>
    </div>
    <div class="plr14 pt20 pb2">
      <div v-for="(item, index) in brandList" :key="index" class="bg-white p14 card-shadow radius6 mb14 row relative">
        <div class="w-h80 p10 mr10 row center card-shadow">
          <img :src="item.titleImage || require('@/assets/images/logo.png')">
        </div>
        <div class="flex-1 hidden col space-around">
          <p class="main-text-color fw600 fs14">{{ item.title }}</p>
          <p class="sub-text-color fs12 ellipsis">{{ item.subhead }}</p>
          <p class="sub-text-color fs12 ellipsis">{{ item.summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getInfoByCateId } from '@/api/cms'

export default {
  name: 'brandSignPreNotice',
  components: {},
  data() {
    return {
      brandListInfoCateId: null, // 品牌列表栏目ID
      brandList: []
    }
  },
  computed: {},
  created() {
    this.brandListInfoCateId = this.$config.infoCateIds['signBrandListId']
    if (this.brandListInfoCateId) {
      this.fetchInfoList()
    }
  },
  methods: {
    fetchInfoList() {
      getInfoByCateId(this.brandListInfoCateId)
        .then(res => {
          console.log('品牌列表资讯', res.records)
          this.brandList = res.records
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>

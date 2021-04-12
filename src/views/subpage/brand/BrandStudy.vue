<template>
  <div class="bgcolor min-h-full">
    <div class="plr14 pt20 pb2">
      <div 
        v-for="(item, index) in brandList" :key="index" 
        class="bg-white ptb14 pl14 card-shadow radius6 mb14 row relative"
        @click="$router.push({ path: '/brandInfo', query: { brandId: item.id } })"
      >
        <div class="w-h80 p10 mr10 row center card-shadow">
          <img :src="item.icon || require('@/assets/images/logo.png')">
        </div>
        <div class="flex-1 hidden col space-around">
          <p class="main-text-color fw600 fs14">{{ item.name }}</p>
          <p class="sub-text-color fs12 ellipsis2">{{ item.story }}</p>
        </div>
        <div class="col flex-end">
          <img 
            :src="require('@/assets/images/view_detail_btn.png')" 
            width="105" height="45" 
            style="margin-bottom: -10px;"
          />
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { getBrandInfo } from '@/api/brand'

export default {
  name: 'BrandStudy',
  components: { },
  data() {
    return {
      brandIds: [],
      brandList: []
    }
  },
  computed: {},
  created() {
    this.brandIds = this.$route.query.brandIds.split('|').map(id => Number(id))
    console.log(this.brandIds)
    this.init()
  },
  methods: {
    init() {
      if (this.brandIds.length) {
        this.fetchBrandList()
      }
    },
    async fetchBrandList() {
      for(let i = 0; i < this.brandIds.length; i++) {
        await getBrandInfo(this.brandIds[i]).then(res => {
          this.brandList.push(res)
          // console.log('新品牌学习区', this.brandList)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>

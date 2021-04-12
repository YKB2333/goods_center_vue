<template>
  <div class="bgcolor">
        <!-- 搜索栏 -->
    <goods-search 
      placeholder="商品名称/商品条码/规格编码/品牌/分类"
      v-model="searchVal"
      @search="onSearch"
      @cancel="onCancelSearch" 
    />
    <!-- banner图 -->
    <div class="ptb20 plr14 text-cnter" v-if="info.banner">
      <img :src="info.banner && info.banner.titleImage" class="radius8">
    </div>
    <!-- 渠道标签 -->
    <div class="canal-tag-container" v-if="info.tag">
      <div class="title">{{ info.tag.title }}</div>
      <div class="tag-wrapper">
        <div class="tag" v-for="(tag, index) in canalTags" :key="index" :class="tagClass(index)">{{ tag }}</div>
      </div>
    </div>
    <goods-list 
      ref="goods-list"
      goods-item-type="2"
      :filter="{ showBrandCategory: false, showBrand: false }"
      downLoadVisible
      orderVisible
    />
    <!-- 新品 -->
  </div>
</template>

<script>
import { addInfoClick, getInfoById, getInfoByCateId } from '@/api/cms'
import GoodsList from '@/components/goods/List'
import { savePosition } from '@/mixins'
import GoodsSearch from '@/components/GoodsSearch'
export default {
  name: 'Subpage',
  components: { GoodsList ,GoodsSearch},
  mixins: [new savePosition()],
  data() {
    return {
      searchVal: '',
      info: { // 资讯
        banner: null, // banner
        tag: null,    // 标签
      }
    }
  },
  computed: {
    // 渠道标签
    canalTags() {
      let arr = []
      if (this.info.tag && this.info.tag.tagList) {
        let splitArr = this.info.tag.tagList.split('|')
        arr = splitArr.filter(item => item)
      }
      console.log('渠道标签', arr)
      return arr
    }
  },
  created() {
    this.init()
    // 判断是否新品专区
    if (this.$route.query['tag'] && this.$route.query['tag'] === '新品') {
      getInfoByCateId(this.$config['infoCateIds'].newGoodsBanner).then(res => {
        console.log('新品专区banner', res.records)
        let list = res.records
        if (list.length) {
          this.info['banner'] = list[0]
        }
      })
    }
  },
  methods: {
    init() {
      if (this.$route.query.bannerInfoId) {
        getInfoById(this.$route.query.bannerInfoId)
          .then(res => {
            console.log('banner资讯', res)
            this.info.banner = res
          })
      }
      if (this.$route.query.tagInfoId) {
        getInfoById(this.$route.query.tagInfoId)
          .then(res => {
            console.log('标签资讯', res)
            this.info.tag = res
          })
      }
    },
    // 标签类名
    tagClass(index) {
      let N = Math.floor(index / 4)
      if (index + 1 === (N * 4) + 1) {
        return 'one'
      }
      if (index + 1 === (N * 4) + 2) {
        return 'two'
      }
      if (index + 1 === (N * 4) + 3) {
        return 'three'
      }
      if (index + 1 === (N * 4) + 4) {
        return 'four'
      }
    },
    onSearch() {
      this.$refs['goods-list'].setSearchVal(this.searchVal)
    },
    onCancelSearch() {
      this.$refs['goods-list'].search4Parent('')
    },
  }
}
</script>

<style lang="scss" scoped>
.canal-tag-container{
  background-color: #ffffff;
  padding: 14px;
  margin-bottom: 14px;
  .title{
    color: #333333;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
  }
  .tag-wrapper{
    display: flex;
    flex-wrap: wrap;
    .tag{
      display: flex;
      align-items: center;
      text-align: center;
      color: #ffffff;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      &.one{
        background-color: #fe497c;
      }
      &.two{
        background-color: #fdd109;
      }
      &.three{
        background-color: #6cd9fd;
      }
      &.four{
        background-color: #8e87fc;
      }
    }
  }
}
</style>

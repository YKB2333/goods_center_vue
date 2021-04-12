<template>
  <div class="bgcolor pt14" style="min-height: 100vh;">
    <!-- 搜索栏 -->
    <goods-search 
      placeholder="商品名称/商品条码/规格编码/品牌/分类"
      v-model="searchVal"
      @search="onSearch"
      @cancel="onCancelSearch"
    />
    <!-- 品牌图片 -->
    <div class="plr14 pb14 bg-white" style="padding-top: 10px" v-if="banner">
      <img :src="banner.titleImage">
    </div>
    <!-- 展开全部 -->
    <div class="plr14 bg-white">
      <van-row gutter="15" class="plr2" id="obm">
        <van-col v-for="(item, index) in showBrandList" :key="index" span="8" class="mtb14" >
          <div :class="['brand-item bg-white']" @click="jump(item)">
            <div class="icon-wrapper">
              <img :src="item.icon || require('@/assets/images/logo.png')" />
            </div>
            <p class="ellipsis fs13 text-center main-text-color">{{ item.name }}</p>
          </div>
        </van-col>
        <van-col span="8" class="mtb14" v-if="showArrow">
          <div :class="['brand-item bg-white hideShadow']" @click="showArrow = false;">
            <div class="icon-wrapper">
              <img :src="require('@/assets/images/icon_zhan@2x.png')" />
            </div>
            <p class="ellipsis fs13 text-center main-text-color">展开全部</p>
          </div>
        </van-col>
      </van-row>
    </div>
    <div>
      <divider-title color="#090909">商品推荐</divider-title>
      <goods-list
        ref="goods-list"
        :auto-init="false"
        downLoadVisible
      />
    </div>
  </div>
</template>

<script>
import GoodsList from '@/components/goods/List'
import DividerTitle from '@/components/DividerTitle'
import { getBrandList } from '@/api/brand'
import { getInfoByCateId } from '@/api/cms'
import { savePosition } from '@/mixins'
import { deepClone } from '@/utils'
import GoodsSearch from '@/components/GoodsSearch'
export default {
  name: 'japanArea',
  mixins: [new savePosition()],
  data() {
    return {
      banner: null,
      brandList: [], // 全部品牌
      showArrow: false, // 是否显示箭头
      splitNumber: 9, // 显示箭头的分界数量
      brandIds: [], // 全部品牌id
      searchVal:"",
    }
  },
  components:{
    GoodsList,DividerTitle,GoodsSearch
  },
  computed: {
    showBrandList() {
      if (this.showArrow) {
        let copy = deepClone(this.brandList)
        return copy.splice(0, this.splitNumber - 1)
      } else {
        return this.brandList
      }
    }
  },
  created() {
    this.initJapanBrand()
    getInfoByCateId(this.$config['infoCateIds'].japanBanner).then(res => {
      let list = res.records
      if (list.length) {
        this.banner = list[0]
      }
    })
  },
  methods: {
    onShowBrand(){
      console.log('显示更多');
      this.isShow =  false;
    },
    jump(item) {
      this.$router.push({
        path: '/brandInfo',
        query: {
          brandId: item.id
        }
      })
    },
    initJapanBrand() {
      getBrandList({
        pageIndex: 1,
        pageSize: 100000,
        isEnable: true,
        orderStr: 'orderLevel desc',
        tag: 'ARATA'
      }).then(res => {
        this.showArrow = res.list.length > this.splitNumber
        this.brandList = res.list

        let brandIds = res.list.map(e => e.id)
        this.$refs['goods-list'].setBrandIds(brandIds)
        this.$refs['goods-list'].init()
      })
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
.brand-item{
  box-shadow:0px 0px 10px 0px rgba(40,109,153,0.1);
  height: 117px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 10px;
  max-width: 120px;
  margin: 0 auto;
  .icon-wrapper{
    width: 60px;
    height: 60px;
    // background-color: #f8f8f8;
    // border-radius: 50%;
    margin: 0 auto;
    // padding: 10px 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.hideShadow{
  box-shadow:none !important;
}
</style>

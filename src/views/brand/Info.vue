<template>
  <div id="brand-info-page" class="bgcolor">
    <!-- 搜索栏 -->
    <goods-search
      placeholder="商品名称/商品条码/规格编码/品牌/分类"
      v-model="searchVal"
      @search="onSearch"
      @cancel="onCancelSearch"
    />
    <div class="bg-white p20 mb14">
      <div class="row center-y">
        <div class="w-h74 mr12 row center card-shadow">
          <img
            :src="brandInfo && brandInfo.icon || require('@/assets/images/logo.png')"
            style="max-width: 100%;"
          />
        </div>
        <div>
          <p class="main-text-color fs16 fw600 mb14">{{ brandInfo && brandInfo.name }}</p>
          <router-link
            :to="{path: '/brandAttachment', query: { brandId: brandInfo && brandInfo.id, brandName: brandInfo && brandInfo.name }}"
          >
            <img
              :src="require('@/assets/images/download_brand_atta_btn.png')"
              width="100"
              height="22"
            />
          </router-link>
        </div>
      </div>
      <div
        class="sub-text-color fs13 mt18"
        v-if=" brandInfo && brandInfo.story"
      >{{ brandInfo && brandInfo.story }}</div>
    </div>
    <div class="bg-white mb14" v-if="shopList.length">
      <div class="fs16 fw600 pl14 pt20">在营品牌店铺</div>
      <div class="row" style="overflow-x: auto;">
        <div class="row ptb20 plr14">
          <div
            v-for="item in shopList"
            :key="item.shopId"
            class="shop-item"
            @click="onShopClick(item)"
          >
            <div class="flex-1 row center">
              <img
                :src="item.logo || require('@/assets/images/logo.png')"
                width="80"
                height="50"
                class="fit-contain"
              />
            </div>
            <p class="fs12 plr8 ellipsis text-center pb10">{{ item.name }}</p>
            <span class="shop-tag" v-if="item.onLineName">{{ item.onLineName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white mb14">
      <van-tabs
        v-if="isShowGoodTab"
        v-model="activeTag"
        @change="onTagChange"
        :color="$config.mainColor"
        :line-width="18"
        :border="false"
      >
        <van-tab title="普通商品"></van-tab>
        <van-tab title="赠品/中小样/试用装"></van-tab>
      </van-tabs>
      <goods-list  ref="goods-list"  goods-item-type="1" downLoadVisible  v-show="listOneShow"/>
      <goods-list :is-show-tag="true" ref="goods-list2"  goods-item-type="5" :tags="demoTag" downLoadVisible v-show="listTwoShow" />
    </div>
    <!-- 为你推荐 -->
    <div class="bg-white mb14" v-if="recommendBrandList.length">
      <area-title title="为你推荐" :line="false" />
      <van-row gutter="15" class="plr14" id="odm">
        <van-col v-for="(item, index) in recommendBrandList" :key="index" span="8" class="mb14">
          <brand-item
            :icon="item.icon || require('@/assets/images/logo.png')"
            :name="item.name"
            @click.native="$router.push({ path: '/productList', query: { brandId: item.id } })"
          />
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import {
  getBrandInfo,
  getBrandList,
  getBrandShopList,
  getAllOnlineNames,
} from '@/api/brand'
import { getSpuInfoById, spuSearch } from '@/api/spu'
import BrandItem from '@/components/BrandItem'
import AreaTitle from '@/components/AreaTitle'
import GoodsList from '@/components/goods/List'
import GoodsSearch from '@/components/GoodsSearch'
import { savePosition } from '@/mixins'

export default {
  name: 'BrandInfo',
  components: { GoodsSearch, BrandItem, AreaTitle, GoodsList },
  mixins: [new savePosition()],
  data() {
    return {
      onLineNames: [], //所有的店铺销售渠道
      searchVal: '',
      brandId: null, // 品牌id
      brandInfo: null, // 品牌信息
      recommendBrandList: [], // 为你推荐品牌列表
      shopList: [], // 店铺列表
      activeTag: 0,
      demoTag: ['赠品', '中小样', '试用装'], // 赠品
      isShowGoodTab: false,
      isShowTag: false,
      listOneShow:true,
      listTwoShow:false
    }
  },
  computed: {},
  async created() {
    if (this.$route.query.brandId) {
      this.brandId = this.$route.query.brandId
    }
    await getAllOnlineNames().then((res) => {
      this.onLineNames = res
      console.log(this.onLineNames, 'onLineNames')
    })
    this.init()
  },
  methods: {
    init() {
      getBrandInfo(this.brandId).then((res) => {
        this.brandInfo = res
      })

      // 获取店铺
      getBrandShopList(this.brandId).then((res) => {
        this.shopList = res || []
        if (this.shopList.length) {
          this.shopList = this.shopList.map((item) => {
            if (item.onLineName) {
              console.log(this.onLineNames, 'onLineNames')
              let name = this.onLineNames.filter((o) => {
                return o.code === item.onLineName
              })
              if (name.length) {
                item.onLineName = name[0].text
              }
            }
            return item
          })
        }
      })

      getBrandList({
        pageIndex: 1,
        pageSize: 3,
        isEnable: true,
        orderStr: 'orderLevel desc',
        tag: '为你推荐',
      }).then((res) => {
        this.recommendBrandList = res.list
      })

      // 获取该品牌下1条中小样赠品
      spuSearch({
        pageIndex: 1,
        pageSize: 1,
        tag: this.demoTag,
        brandIds: [this.brandId],
      }).then((res) => {
        this.isShowGoodTab = res && res.count
        console.log('zhong <<<<<<<<')
        console.log(res)
      })
    },

    onTagChange(name, title) {
      console.log(name, title)
      if (name) {
        this.listOneShow=false
        this.listTwoShow=true
      } else {
        this.listOneShow=true
        this.listTwoShow=false
      }
    },

    onSearch() {
      this.$refs['goods-list'].setSearchVal(this.searchVal)
    },
    onCancelSearch() {
      this.$refs['goods-list'].search4Parent('')
    },
    onShopClick(item) {
      console.log(item, 'item')
      if (!item.website) {
        this.$toast('暂无店铺链接')
        return
      }
      window.open(item.website, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.shop-item {
  width: 100px;
  height: 100px;
  flex: none;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(40, 109, 153, 0.1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  position: relative;
  &:not(:last-child) {
    margin-right: 8px;
  }
  .shop-tag {
    background-color: #ebf4ff;
    color: #3d93ff;
    font-size: 10px;
    border-radius: 6px 0px 6px 0px;
    padding: 2px 6px;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>

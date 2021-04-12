<template>
  <div id="home" class="bgcolor">
    <!-- 搜索栏 -->
    <van-sticky>
      <goods-search placeholder="商品名称/商品条码/规格编码/品牌/分类" @search="onSearch" />
    </van-sticky>
    <!--轮播图  -->
    <div class="swiper-container banner-container pb14">
      <div class="swiper-wrapper">
        <div class="swiper-slide plr14" v-for="(item, index) in carouselList" :key="index">
          <img :src="item.titleImage" class="w-full pointer" />
        </div>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination swiper-pagination-banner"></div>
    </div>
    <!-- 商品服务类型 -->
    <van-row class="bg-white mb14">
      <van-col
        span="6"
        v-for="(item, index) in entry"
        :key="index"
        class="entry-item"
        @click="
          $router.push({
            path: '/productList',
            query: { brandCategory: item.brandCategory },
          })
        "
      >
        <img :src="item.icon" class="w-full" />
        <p>{{ item.title }}</p>
      </van-col>
    </van-row>
    <!-- 新品推荐 -->
    <div class="bg-white mb14" v-if="newGoodsList.length">
      <area-title
        title="新品推荐"
        label="查看全部"
        @more="$router.push({ path: '/subpage', query: { tag: '新品',isRemark:true } })"
      >
        <span slot="after-title" class="fs13 color-666 ml4">/每月更新</span>
      </area-title>
      <van-row gutter="15" class="plr14 pb20">
        <van-col span="8" v-for="(item, index) in newGoodsList" :key="index">
          <div
            class="col"
            @click="
              $router.push({
                path: '/productDetail',
                query: { spuId: item.id },
              })
            "
          >
            <div class="card-shadow relative text-center">
              <img
                :src="
                  item.titleImage
                    ? `${item.titleImage + $config.imageZoom}200`
                    : require('@/assets/images/logo.png')
                "
              />
              <img
                :src="require('@/assets/images/tag_new.png')"
                class="w26 h16 absolute"
                style="left: 0; top: 10px"
              />
              <img
                :src="require('@/assets/images/sale_out.png')"
                class="pos-center w-h60"
                v-if="item.outStockType == '3'"
              />
              <img
                :src="require('@/assets/images/eplenishment.png')"
                class="pos-center w-h60"
                v-if="item.outStockType == '2'"
              />
              <img
                :src="require('@/assets/images/arrival.png')"
                class="pos-center w-h60"
                v-if="item.outStockType == '1'"
              />
            </div>
            <p class="text-center main-text-color mt12 fs13 ellipsis">{{ item.name }}</p>
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- 常规推荐 -->
    <div class="bg-white mb14" v-if="routineRecommend.length">
      <area-title title="常规推荐"></area-title>
      <van-row gutter="20" class="pb20 plr18">
        <van-col span="12" v-for="(item, index) in routineRecommend" :key="index">
          <img :src="item.titleImage" class="w-full pointer" @click="onInfoClick(item)" />
        </van-col>
      </van-row>
    </div>
    <!-- 主题推荐 -->
    <div class="bg-white mb14" v-if="titleRecommend.length">
      <area-title title="主题推荐" border></area-title>
      <van-grid :column-num="2" :border="true">
        <van-grid-item v-for="(item, index) in titleRecommend" :key="index">
          <router-link :to="item.skipUrl + '&theme=1&isRemark=true'">
            <goods-recommend
              :title="item.title"
              :imgUrl="
                titleRecommend[index] && titleRecommend[index].titleImage
              "
              :iconColor="(index + 1) % 2 !== 0 ? '#ff497c' : '#fed00b'"
            />
          </router-link>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 进口品推荐 -->
    <div class="bg-white mb14" v-if="importsRecommend.length">
      <area-title title="进口品推荐" border></area-title>
      <van-grid :column-num="2" :border="true">
        <van-grid-item v-for="(item, index) in importsRecommend" :key="index">
          <router-link :to="item.skipUrl">
            <goods-recommend
              :title="item.title"
              :imgUrl="
                importsRecommend[index] && importsRecommend[index].titleImage
              "
              :iconColor="(index + 1) % 2 !== 0 ? '#6dd7ff' : '#9085ff'"
            />
          </router-link>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 销售排行 -->
    <div class="bg-white mb14">
      <area-title title="销售排行"></area-title>
      <div class="plr14 pb14">
        <goods-rank
          v-for="(item, index) in rankData"
          :key="index"
          :title="item.info.title"
          :label="item.info.subhead"
          :goods="item.goods"
          @goods="(goods) => toGoodsDetail(goods.id)"
          @more="$router.push(item.info.skipUrl+'&isRemark=true')"
          :barColor="rankBorderColor(index)"
          class="mb14"
        />
      </div>
    </div>
    <div class="bg-white mb14" v-if="hotBrands.length">
      <area-title title="重点大牌" label="查看更多" @more="$router.push('/brand')"></area-title>
      <van-row class="hot-brand plr14">
        <van-col
          span="6"
          v-for="(brand, index) in hotBrands"
          :key="index"
          @click="
            $router.push({ path: '/brandInfo', query: { brandId: brand.id } })
          "
        >
          <div class="img-wrapper">
            <img :src="brand.icon || require('@/assets/images/logo.png')" />
            <span class="shop-tag" v-if="brand.onLineName">
              {{
              brand.onLineName
              }}
            </span>
          </div>
          <p class="ellipsis">{{ brand.name }}</p>
        </van-col>
      </van-row>
    </div>
    <!-- 助力销售成长 -->
    <div class="bg-white mb14" v-if="helpSalerList.length">
      <area-title title="助力销售成长"></area-title>
      <div class="plr14">
        <van-row gutter="20">
          <van-col
            v-for="(item, index) in helpSalerList"
            :key="index"
            :span="index === 0 ? 24 : 12"
            class="mb14 text-center"
          >
            <img :src="item.titleImage" class="w-full pointer" @click="onInfoClick(item)" />
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 日本专区 -->
    <div class="bg-white mb14">
      <area-title title="日本专区"></area-title>
      <div class="plr14">
        <img
          :src="require('@/assets/images/home/jp.png')"
          @click="$router.push({ path: '/information' })"
        />
        <van-row gutter="15" class="plr2" id="obm" v-if="japanDivision.length">
          <van-col v-for="(item, index) in japanDivision" :key="index" span="8" class="mtb14">
            <brand-item
              :icon="item.icon || require('@/assets/images/logo.png')"
              :name="item.name"
              @click.native="$router.push({ path: '/japan' })"
            />
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- 其他商品 -->
    <div class="bg-white mb14" v-if="otherGoods.length">
      <area-title title="其他商品"></area-title>
      <van-row gutter="20" class="pb20 plr18">
        <van-col span="12" v-for="(item, index) in otherGoods" :key="index">
          <img :src="item.titleImage" class="w-full pointer" @click="onInfoClick(item)" />
        </van-col>
      </van-row>
    </div>
    <!-- 同类渠道推品 -->
    <!-- <div class="bg-white mb14">
      <area-title title="同类渠道推品"></area-title>
      <div class="plr14 pb20">
        <goods-same-canal
          v-for="(item, index) in sameCanal" :key="index"
          :icon="item.info.titleImage"
          :goods="item.goods"
          class="mb14"
          @goodsClick="(goods) => toGoodsDetail(goods.id)"
          @more="$router.push({ path: item.info.skipUrl })"
        />
      </div>
    </div>-->
    <!-- 版本弹窗 -->
    <van-dialog
      v-model="isShowDialog"
      :showConfirmButton="false"
      width="8rem"
      class="fz-dialog"
      theme="round-button"
    >
      <img :src="require('@/assets/images/version.png')" class="w-full" />
      <div class="guide-wapper plr20 pb20 pt16">
        <div class="ellipsis title mb12">版本更新（{{versionName}}）</div>
        <div class="fs14 content">{{versionContent}}</div>
        <van-button
          class="mt22 fw600 h34"
          color="#3D93FF"
          round
          block
          @click="onjumpVersion"
        >{{versionUrl ? '查看详情' : '确定'}}</van-button>
        <!-- <div class="fs12 no-show-text" @click="onNeverShow">不在弹出</div> -->
      </div>
    </van-dialog>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { savePosition } from '@/mixins'
import AreaTitle from '@/components/AreaTitle'
import GoodsRecommend from '@/components/home/Recommend'
import GoodsRank from '@/components/home/SaleRank'
import GoodsSameCanal from '@/components/home/SameCanal'
import GoodsSearch from '@/components/GoodsSearch'
import { addInfoClick, getInfoById, getInfoByCateId } from '@/api/cms'
import { getLatestVersion, putLatestVersion } from '@/api/version'
import { getBrandList, getAllOnlineNames } from '@/api/brand'
import { spuSearch } from '@/api/spu'
import BrandItem from '@/components/BrandItem'

export default {
  name: 'Home',
  components: {
    AreaTitle,
    GoodsRecommend,
    GoodsRank,
    GoodsSameCanal,
    GoodsSearch,
    BrandItem
  },
  mixins: [new savePosition()],
  data() {
    return {
      refresh: false, // 下拉刷新
      carouselList: [], // 轮播
      entry: [
        // 商品入口
        {
          title: 'NB商品', // 代理
          icon: require('@/assets/images/home/entry/nb.png'),
          brandCategory: '1'
        },
        {
          title: 'JVB商品', // 合资
          icon: require('@/assets/images/home/entry/jvb.png'),
          brandCategory: '4'
        },
        {
          title: '自有品牌',
          icon: require('@/assets/images/home/entry/brand-owned.png'),
          brandCategory: '3'
        },
        {
          title: 'ODM商品', // 代工
          icon: require('@/assets/images/home/entry/odm.png'),
          brandCategory: '2'
        }
      ],
      titleRecommend: [], // 主题推荐
      importsRecommend: [], // 进口品推荐
      rankData: [], // 排行数据
      helpSalerList: [], // 助理销售成长
      // sameCanal: [],  // 同类渠道
      hotBrands: [], // 热门大牌
      // 常规推荐
      routineRecommend: [],
      japanDivision: [],
      newGoodsList: [], // 新品推荐
      onLineNames: [], //所有店铺平台销售渠道名称
      otherGoods: [], //其他商品
      isShowDialog: false,
      versionName: '', //版本标题
      versionContent: '', //版本内容
      versionUrl: '' //版本链接
    }
  },
  created() {
    // this.getAllOnlineName();
    this.init()
  },
  methods: {
    // getAllOnlineName() {
    //   getAllOnlineNames().then((res) => {
    //     this.onLineNames = res;
    //   });
    // },

    init() {
      //版本更新
      getLatestVersion().then((res) => {
        let isVersionState = sessionStorage.getItem('isVersion')
        if (isVersionState || !res) {
          this.isShowDialog = false
          return
        }
        this.isShowDialog = true
        this.versionName = res.name
        this.versionContent = res.updateContent
        this.versionUrl = res.updatePushUrl
      })
      // 轮播图
      this.fetchInfoList(this.$config.infoCateIds.indexCarousel).then(
        (list) => {
          this.carouselList = list
          this.$nextTick(() => {
            this.initSwiper()
          })
        }
      )
      // 主题推荐
      this.fetchInfoList(this.$config.infoCateIds.titleRecommend).then(
        (list) => {
          this.titleRecommend = list
        }
      )
      // 进口推荐
      this.fetchInfoList(this.$config.infoCateIds.importsRecommend).then(
        (list) => {
          console.log('进口推荐', list)
          list.forEach((item) => {
            if (item.skipUrl.indexOf('isCrossBorderTrade') != -1) {
              // 获取销售额最高的进口品
              this.fechGoods({
                pageIndex: 1,
                pageSize: 1,
                isCrossBorderTrade: true,
                orderProperty: 'monthAmt',
                orderType: 1
              }).then((res) => {
                item.titleImage = res[0].titleImage
                  ? res[0].titleImage
                  : item.titleImage
              })
            }

            if (item.skipUrl.indexOf('isGeneralTrade') != -1) {
              // 获取销售额最高的进口品
              this.fechGoods({
                pageIndex: 1,
                pageSize: 1,
                isGeneralTrade: true,
                orderProperty: 'monthAmt',
                orderType: 1
              }).then((res) => {
                item.titleImage = res[0].titleImage
                  ? res[0].titleImage
                  : item.titleImage
              })
            }
          })
          this.importsRecommend = list
        }
      )
      // 排行榜
      this.initRankData()
      // 助力销售成长
      this.fetchInfoList(this.$config.infoCateIds.helpSalerGrowth).then(
        (list) => {
          this.helpSalerList = list
        }
      )
      // 同类渠道
      // this.initSameCanal()
      // 热门大牌
      this.initHotBrand()
      //日本专区
      this.initJapanBrand()
      // 常规推荐
      this.fetchInfoList(this.$config.infoCateIds.routineRecommend).then(
        (list) => {
          this.routineRecommend = list
          this.routineRecommend.forEach((item) => {
            item.title === '全渠道必卖清单'
              ? (item.skipUrl = `${item.skipUrl}&isRemark=true`)
              : ''
          })
        }
      )
      //其他商品
      this.fetchInfoList(this.$config.infoCateIds.otherGoods).then((list) => {
        this.otherGoods = list
      })
      // 获取新品推荐商品
      this.fechGoods({
        pageIndex: 1,
        pageSize: 3,
        tag: ['新品'],
        orderProperty: 'updateDate',
        orderType: 1
      }).then((res) => {
        this.newGoodsList = res
      })
    },

    initSwiper() {
      var that = this
      var bannerContainer = new Swiper('.banner-container', {
        slidesPerView: 'auto',
        spaceBetween: 8,
        centeredSlides: true,
        loop: true,
        grabCursor: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: true
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        on: {
          click: function () {
            // this.realIndex 当前索引activeIndex不同的是，在loop模式下不会将复制的块的数量计算在内。
            let index = this.realIndex
            let item = that.carouselList[index]
            that.onInfoClick(item)
          }
        }
      })
    },
    // 排行资讯
    initRankData() {
      this.fetchInfoList(this.$config.infoCateIds.saleRank).then(
        async (list) => {
          let result = []
          for (let i = 0; i < list.length; i++) {
            let item = {}
            item['info'] = list[i]
            // let tagList = list[i].tagList.split('|').filter(item => item)
            let goods = await this.fechGoods({
              pageSize: 6,
              orderProperty: 'monthSales',
              orderType: 1
            })
            item['goods'] = goods
            result.push(item)
          }
          this.rankData = result
        }
      )
    },
    // 同类渠道资讯
    initSameCanal() {
      this.fetchInfoList(this.$config.infoCateIds.sameCanal).then(
        async (list) => {
          let result = []
          for (let i = 0; i < list.length; i++) {
            let item = {}
            item['info'] = list[i]
            let tagList = list[i].tagList.split('|').filter((item) => item)
            let goods = await this.fechGoods({
              pageSize: 2,
              tag: tagList,
              orderProperty: 'brandOrder',
              orderType: 1
            })
            item['goods'] = goods
            result.push(item)
          }
          this.sameCanal = result
        }
      )
    },
    // 重点大牌
    async initHotBrand() {
      try {
        this.onLineNames = await getAllOnlineNames()
        let hotBrandQuery = {
          pageIndex: 1,
          pageSize: 4,
          isEnable: true,
          isShow: true,
          orderStr: 'orderLevel desc',
          tag: '重点大牌'
        }
        let res = await getBrandList(hotBrandQuery)
        this.hotBrands = res.list.map((item) => {
          if (item.brandRelatedShops.length > 0) {
            item.onLineName = item.brandRelatedShops[0].onLineName
          }
          if (item.onLineName) {
            let arr = this.onLineNames.filter((o) => {
              return o.code === item.onLineName
            })
            if (arr && arr.length) {
              item.onLineName = arr[0].text
            }
          }
          return item
        })
      } catch (error) {
        console.error(error)
      }
    },

    initJapanBrand() {
      getBrandList({
        pageIndex: 1,
        pageSize: 3,
        isEnable: true,
        orderStr: 'orderLevel desc',
        tag: 'ARATA'
      }).then((res) => {
        this.japanDivision = res.list
      })
    },

    onjumpVersion() {
      putLatestVersion({ sys: 'goods' }).then((res) => {
        sessionStorage.setItem('isVersion', true)
        this.onCloseDialog()
        if (this.versionUrl) {
          window.location.href = this.versionUrl
        }
      })
    },

    onCloseDialog() {
      this.isShowDialog = false
    },
    // 根据栏目ID获取资讯列表
    fetchInfoList(cateId) {
      return new Promise((resolve, reject) => {
        getInfoByCateId(cateId)
          .then((res) => {
            resolve(res.records)
          })
          .catch((error) => {
            resolve([])
          })
      })
    },
    // 获取商品
    fechGoods(data) {
      return new Promise((resolve, reject) => {
        let params = {
          isOnSale: true, //是否已上架
          pageIndex: 1,
          ...data
        }
        spuSearch(params)
          .then((res) => {
            resolve(res.list)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 跳转商品详情
    toGoodsDetail(id) {
      this.$router.push({
        name: 'ProductDetail',
        query: {
          spuId: id
        }
      })
    },

    onInfoClick(info) {
      if (info.skipUrl) {
        this.$router.push({ path: info.skipUrl })
      }
    },

    rankBorderColor(index) {
      let N = Math.floor(index / 4)
      if (index + 1 === N * 4 + 1) {
        return '#ffb6cb'
      }
      if (index + 1 === N * 4 + 2) {
        return '#ffec9d'
      }
      if (index + 1 === N * 4 + 3) {
        return '#c5efff'
      }
      if (index + 1 === N * 4 + 4) {
        return '#d3ceff'
      }
    },

    onSearch(val) {
      this.$router.push({
        path: '/productListSearch',
        query: {
          searchVal: val
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  /deep/ .van-swipe__indicator {
    background-color: #8c6f6e;
  }
  .entry-item {
    text-align: center;
    padding: 16px 8px;
    cursor: pointer;
    img {
      max-width: 72px;
    }
    p {
      font-size: 13px;
      color: #090909;
    }
  }
  /deep/ .fz-dialog {
    border-radius: 8px;
    background-color: transparent;
    .guide-wapper {
      position: relative;
      text-align: justify;
      white-space: pre-line;
      background-color: #fff;
      transform: translateY(-1px);
      .close-btn {
        position: absolute;
        right: 0px;
        transform: translate(25%, -25%);
      }
      .title {
        font-weight: bold;
        color: #121314;
        line-height: 20px;
        font-size: 16px;
      }
      .content {
        color: #666666;
        line-height: 22px;
        font-size: 14px;
      }
    }
    .van-goods-action.van-dialog__footer {
      display: none;
    }
    .no-show-text {
      color: rgba(102, 102, 102, 0.6);
      margin: 8px 0;
      float: right;
    }
  }
  .hot-brand {
    text-align: center;
    cursor: pointer;
    padding-bottom: 14px;
    .img-wrapper {
      width: 78px;
      height: 78px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 6px;
      // background-color: #f8f8f9;
      box-shadow: 0px 0px 10px 0px rgba(40, 109, 153, 0.1);
      margin: 0 auto;
      position: relative;
    }
    p {
      font-size: 13px;
      color: #090909;
      margin-top: 10px;
    }
    @media (max-width: 320px) {
      .img-wrapper {
        width: 68px !important;
        height: 68px !important;
      }
    }
  }
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
/deep/ .swiper-pagination-bullet-active {
  opacity: 1;
  background: white;
}
/deep/ .swiper-pagination-bullet {
  width: 6px;
  height: 6px;
}

/deep/ .swiper-pagination-bullets {
  bottom: 20px;
}
.shop-tag {
  background: linear-gradient(0deg, #ff5650 0%, #ff817d 98%);
  border-radius: 30px;
  color: #fff;
  font-size: 10px;
  line-height: 15px;
  font-weight: 500;
  padding: 2px 4px;
  position: absolute;
  left: 4px;
  top: 4px;
}
</style>

<template>
  <div>
    <div v-if="loading" id="bg"></div>
    <!-- 遮罩 -->
    <van-sticky>
      <goods-order
        ref="goodsOrder"
        v-model="orderObj"
        :brandList="brandList"
        :categoryList="filterCateList"
        :showBrandCategory="showBrandCategory"
        :showBrand="showBrand"
        :showCategory="showCategory"
        @change="onTabsChange"
        @confirm="onFilterConfirm"
        @reset="onFilterReset"
      />
    </van-sticky>
   <div class="topLine">
      <offer-search 
      placeholder="输入商品查询报价信息"
      v-model="searchVal"
      @search="onSearch"
      @cancel="onCancelSearch"
      @showFilter="showFilter"
    />
   </div>
    <!-- 列表 -->
    <div class="goods-list pt14 plr14 bg-white" id="goods-list">
      <van-list
        v-model="vanList.loading"
        :immediate-check="false"
        :finished="vanList.finished"
        :error.sync="vanList.error"
        :finished-text="vanList.finishedText"
        error-text="请求失败，点击重新加载"
        @load="onLoadMore">
          <van-row gutter="20">
            <van-col :span="colSpan" v-for="(item, index) in goodsList" :key="index">
              <offer-item
                :type="goodsItemType"
                :title-image="item.titleImage ? `${item.titleImage + $config.imageZoom}200` : require('@/assets/images/logo.png')"
                :name="item.name"
                :msrp="item.mainPushPrice?item.mainPushPrice:item.lowerMsrp"
                :brandName="item.brandName"
                :productDescribe="item.productDescribe"
                :validity-stock="getStockWithSpuId(item.id)"
                @click.native="toGoodsDetail(item)"
              />
            </van-col>
          </van-row>
      </van-list>
    </div>
    <!-- <div class="button">
      <van-button v-if="goodsList.length>0" :loading="loading" loading-text="下载中..." @click="downLoad('dowmLoad')" class="button_" round type="info">下载商品报价表</van-button>
      <van-button @click="downLoad('history')" class="button_" round type="warning">下载历史</van-button>
    </div> -->
    <div class="fixed w30 h30 col" style="right:14px;bottom:110px;">
      <img v-if="goodsList.length>0"  @click="downLoad" class="mb24" :src="require('@/assets/images/downLoad.png')" alt="">
      <img @click="$router.push({name:'OfferDownLoad',query:{type:'1'}})" :src="require('@/assets/images/history.png')" alt="">
    </div>
  </div>
</template>

<script>
import offerItem from './offerItem'
import GoodsOrder from './GoodsOrder'
import OfferSearch from './OfferSearch'
import { serviceMan, customerMan } from '@/config'
import { spuSearch, spuSearch4Condition, getStockData,exportSpu } from '@/api/spu'
import {getWxUserId} from '@/api/user'
export default {
  name: 'GoodsList',
  components: { offerItem, GoodsOrder ,OfferSearch},
  props: {
    goodsItemType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      loading:false,
      isShowFilterPopup:false,
      goodsList: [],
      params:{},
      query: {
        pageIndex: 1,
        pageSize: 14,
        keyword: '',
        lowerMsrp: '',
        higherMsrp: '',
        brandCategorys: [],
        brandIds: []
      },
      searchVal: '', // 搜索值
      vanList: {
        loading: false,
        finished: false,
        finishedText: '',
        error: false,
        myError: false
      },
      orderObj: { // 排序
        orderProperty: 'monthSales', // 排序属性
        orderType: 1, // 1降序；2升序；
      },
      // 默认排序
      brandList: [],
      filterCateList: [],
      inited: false,
      runSearch4Condiiton: false,
      showBrandCategory: true, // 显示商品服务类型筛选
      showBrand: true,  // 显示品牌筛选
      showCategory: true,  // 显示品类筛选
      stockList: []
    }
  },
  computed: {
    colSpan() {
      if (this.goodsItemType === '1') {
        return '12'
      }
      if (this.goodsItemType === '2') {
        return '24'
      }
    }
  },
  created() {
    if (this.$route.query.searchVal) { // 搜索参数
      this.searchVal = this.$route.query.searchVal
    }
    if (this.$route.query.brandId) { // 品牌ID
      this.query['brandIds'].push(this.$route.query.brandId)
      this.showBrand = false
    }
    this.init()
  },
  methods: {
    downLoad(status){
      // this.$toast('该功能暂未开放使用，敬请期待') 
      // return
      this.loading = true
      var params = JSON.parse(JSON.stringify(this.params))
      this.$store.commit('SHOW_LOADING')
      exportSpu(params,'1')
        .then(res=>{
          this.$router.push({name:'OfferDownLoad',query:{type:'1'}})
          this.$store.commit('SHOW_LOADING', false)
          this.$toast('下载成功')
        }).catch(e=>{
          this.$toast('下载失败')
          this.$store.commit('SHOW_LOADING', false)
        })
    },
    showFilter(){
      this.$refs.goodsOrder.showFilter()
    },
    init() {
      this.runSearch4Condiiton = true
      this.fetchGoodsList()
    },
    onLoadMore() {
        if (this.vanList.finished || !this.inited) return
        this.runSearch4Condiiton = false
        if (!this.vanList.myError) {
          this.query['pageIndex'] += 1
        }
        this.fetchGoodsList('loadMore')
    },
    fetchGoodsList(flag = 'init') {
      return new Promise((resolve, reject) => {
        // console.log(this.orderObj, this.query)
        this.params = {}
        console.log("query",this.query)
        Object.assign(this.params, this.orderObj, this.query) // 将两个对象合并到params对象上
        this.params['keyword'] = this.searchVal
        spuSearch(this.params)
          .then(async res => {
            let isFinish = res.pages === 0|| res.pages === res.pageIndex // 是否还有下一页
            // console.log('isFinish', isFinish)
            this.vanList.finished = isFinish
            if (flag === 'init') {
              console.log('init')
              this.goodsList = []
              this.stockList = []
              // document.getElementById('app').scrollTop = 0
              this.goodsList = res.list
              if (isFinish && res.list.length > 0) {
                this.vanList.finishedText = '已经到底啦'
              } else {
                this.vanList.finishedText = '暂无数据'
              }
            }
0
            if (flag === 'loadMore') {
              this.goodsList = this.goodsList.concat(res.list)
              if (isFinish) {
                this.vanList.finishedText = '已经到底啦'
              }
            }
            this.stockList = []
            for(let i = 0; i < this.goodsList.length; i++) {
              let stockDatas = await this.fetchStockData(this.goodsList[i].id)
              let itemObj = {}
              let total = 0
              stockDatas.forEach(item => {
                total += item.validityStock
              })
              itemObj['validityStock'] = total
              itemObj['spuId'] = this.goodsList[i].id
              this.stockList.push(itemObj)
            }
            // console.log(this.stockList)
            this.vanList.error = false
            this.vanList.myError = false

            // if (this.filter.showBrand && this.runSearch4Condiiton) {
            //   this.search4Condiiton()
            // }
            if (!this.inited) {
              this.search4Condiiton()
            }
            resolve(res.list)
          }).catch(error => {
            console.log(error)
            this.vanList.myError = true
            this.vanList.error = true
          }).finally(() => {
            this.inited = true
            this.vanList.loading = false
          })
      })
    },
    search4Condiiton() {
      spuSearch4Condition(this.query)
        .then(res => {
          // console.log('search4Condiiton=>', res)
          this.brandList = res.brandList
          this.filterCateList = res.categoryList
        })
    },
    // 根据spuid获取库存数据
    fetchStockData(spuId) {
      return new Promise((resolve, reject) => {
        getStockData(spuId).then(res => {
          // console.log('库存数据', res)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getStockWithSpuId(spuId) {
      let value = 0
      this.stockList.forEach(item => {
        if (item.spuId === spuId) {
          value = item.validityStock
          return false
        } else {
          return true
        }
      })
      return value
    },
    toGoodsDetail(item) {
      console.log(item)
      this.$router.push({
        path: '/productDetail',
        query: {
          spuId: item.id
        }
      })
    },
    onTabsChange() {
      this.resetQuery()
      this.fetchGoodsList()
    },
    onSearch() {
      this.runSearch4Condiiton = true
      this.resetQuery()
      this.fetchGoodsList()
    },
    onCancelSearch() {
      this.runSearch4Condiiton = true
      this.resetQuery()
      this.fetchGoodsList()
    },
    onFilterConfirm(data) {
      this.runSearch4Condiiton = true
      console.log('确认', data)
      this.setFilterData(data)
      this.resetQuery()
      this.fetchGoodsList()
    },
    onFilterReset(data) {
      this.runSearch4Condiiton = true
      console.log('重置', data)
      this.setFilterData(data)
      this.resetQuery()
      this.fetchGoodsList()
    },
    setFilterData(data) {
      this.query['lowerMsrp'] = data['lowerMsrp']
      this.query['higherMsrp'] = data['higherMsrp']
      if (data['isGeneralTrade']) {
        this.query['isGeneralTrade'] = true
      } else {
        delete this.query['isGeneralTrade']
      }
      if (data['isCrossBorderTrade']) {
        this.query['isCrossBorderTrade'] = true
      } else {
        delete this.query['isCrossBorderTrade']
      }
      this.query['workStatus'] = data['workStatus']
      this.query['brandCategorys'] = data['brandCategorys']
      if (this.showBrand) {
        this.query['brandIds'] = data['brandIds']
      }
      if (this.showCategory) {
        this.query['cateOne'] = data['cateOne']
      }
    },
    resetQuery() {
      this.query['pageIndex'] = 1
      this.vanList.error = false
      this.vanList.myError = false
    },
    // 父组件搜索时调用
    setSearchVal(searchVal) {
      this.runSearch4Condiiton = true
      this.searchVal = searchVal
      this.resetQuery()
      this.fetchGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
#goods-list{
  background-color: rgba(242,244,249,1);
}
.topLine{
  height: 60px;
  background-color: #fff;
}
.button{
  position: fixed;
  bottom:34px;
  left:0;
  width:100%;
  text-align: center;
  visibility: hidden;
  .button_{
    width: 140px;
    visibility: visible; 
    margin:0 4px;
  }
}
#bg{
    position: fixed;
    // background-color: rgba(0,0,0,0);
    z-index: 100;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
</style>

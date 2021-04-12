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
      <goods-search 
      ref="searchs"
      placeholder="请输入搜索关键词"
      v-model="searchVal"
      @search="onSearch"
      @cancel="onCancelSearch"
      @showFilter="showFilter"
    />
   </div>
    <!-- 列表 -->
    <div class="goods-list plr14 bg-white" id="goods-list">
      <van-list
        v-model="vanList.loading"
        :immediate-check="false"
        :finished="vanList.finished"
        :error.sync="vanList.error"
        :finished-text="vanList.finishedText"
        error-text="请求失败，点击重新加载"
        @load="onLoadMore">
          <van-row gutter="20">
            <van-col span="12" v-for="(item, index) in goodsList" :key="index">
              <goods-item
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
  </div>
</template>

<script>
import goodsItem from './GoodsItem_after'
import GoodsOrder from './GoodsOrder_after'
import goodsSearch from './GoodsSearch_after'
import { serviceMan, customerMan } from '@/config'
import { spuSearch, spuSearch4Condition, getStockData,exportSpu } from '@/api/spu'
import {getWxUserId} from '@/api/user'
export default {
  name: 'GoodsList',
  components: { goodsItem, GoodsOrder ,goodsSearch},
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
        tag: [],
        keyword: '',
        cateOne: '',
        cateTwo: '',
        cateThree: '',
        lowerMsrp: '',
        higherMsrp: '',
        brandCategorys: [],
        brandIds: [],
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
        orderProperty: '', // 排序属性
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
      stockList: [],
    }
  },
  created() {
    if (this.$route.query.keyword || this.$route.query.searchVal) { // 搜索参数
      this.searchVal = this.$route.query.keyword || this.$route.query.searchVal || ''
      this.query['keyword'] = this.$route.query.keyword || this.$route.query.searchVal || ''
      this.$nextTick(()=>{
        this.$refs.searchs.searchVal = this.$route.query.keyword || this.$route.query.searchVal || ''
      })
    } 
    // if(this.$route.query && this.$route.query.pageIndex){
    //   this.query =_.cloneDeep(this.$route.query)
    //   if(typeof(this.$route.query.pageIndex) == 'string'){
    //     // this.$router.back()
    //     // return
    //   }
    // }
    if (this.$route.query.isCrossBorderTrade) { // 跨境贸易
      this.query['isCrossBorderTrade'] = Boolean(this.$route.query.isCrossBorderTrade)
      this.$nextTick(() => {
        this.$refs['goodsOrder'].setFilter4Parent('isCrossBorderTrade', Boolean(this.$route.query.isCrossBorderTrade))
      })
    }
    if (this.$route.query.isGeneralTrade) { // 一般贸易
      this.query['isGeneralTrade'] = Boolean(this.$route.query.isGeneralTrade)
      this.$nextTick(() => {
        this.$refs['goodsOrder'].setFilter4Parent('isGeneralTrade', Boolean(this.$route.query.isGeneralTrade))
      })
    }
    if (this.$route.query.workStatus) { // 清货
      this.query['workStatus'] = this.$route.query.workStatus
      this.$nextTick(() => {
        this.$refs['goodsOrder'].setFilter4Parent('workStatus', this.$route.query.workStatus)
      })
    }
    this.query['cateOne'] = this.$route.query.cateOne || ''
    this.query['cateTwo'] = this.$route.query.cateTwo || ''
    this.query['cateThree'] = this.$route.query.cateThree || ''
    this.query['brandCategorys'] = this.$route.query.brandCategorys || [] // 商品服务类型
    if(!Array.isArray(this.query['brandCategorys'])){
      this.query['brandCategorys'] = this.query['brandCategorys'].split('')
    }
    this.showBrandCategory = this.$route.query.showBrandCategorys?false:true //展示商品服务类型要根据另一个值判断，分类那边有一个情景是重置这个的而品牌重置不重置brandCategorys，但两边都有一个brandCategorys，所以加多一个值判断
    this.query['brandIds'] = this.$route.query.brandIds || [] 
    this.query['lowerMsrp'] = this.$route.query.lowerMsrp || ''
    this.query['higherMsrp'] = this.$route.query.higherMsrp || ''
    this.init()
  },
  methods: {
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
        this.params = {}
        Object.assign(this.params, this.orderObj, this.query) // 将两个对象合并到params对象上
        this.params['keyword'] = this.searchVal
        this.params['orderProperty'] = ''
        spuSearch(this.params)
          .then(async res => {
            let isFinish = res.pages === 0|| res.pages === res.pageIndex // 是否还有下一页
            this.vanList.finished = isFinish
            if (flag === 'init') {
              this.goodsList = []
              this.stockList = []
              this.goodsList = res.list
              if (isFinish && res.list.length > 0) {
                this.vanList.finishedText = '已经到底啦'
              } else {
                this.vanList.finishedText = '暂无数据'
              }
            }
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
            this.vanList.error = false
            this.vanList.myError = false
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
      let query
      if(this.$route.query.pageIndex){
        query = _.cloneDeep(this.query)
      }else{
        query = {
          // 主页进去搜索的query
          pageIndex: 1,
          pageSize: 14,
          tag: [],
          keyword: '',
          cateOne: '',
          cateTwo: '',
          cateThree: '',
          lowerMsrp: '',
          higherMsrp: '',
          brandCategorys: [],
          brandIds: [],
        }
      }
      spuSearch4Condition(query)
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
      this.query['cateOne'] = this.$route.query.cateOne?this.$route.query.cateOne:''
      this.query['cateTwo'] = this.$route.query.cateTwo?this.$route.query.cateTwo:''
      this.query['cateThree'] = this.$route.query.cateThree?this.$route.query.cateThree:''
      this.query['brandCategorys'] = this.$route.query.brandCategorys?this.$route.query.brandCategorys:this.$route.query.brandCategory?this.$route.query.brandCategory:[]
      if(!Array.isArray(this.query['brandCategorys'])){
        this.query['brandCategorys'] = this.query['brandCategorys'].split('')
      }
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
      if(!Array.isArray(this.query['brandCategorys'])){
        this.query['brandCategorys'] = this.query['brandCategorys'].split('')
      }
      if (this.showBrand) {
        this.query['brandIds'] = data['brandIds']
      }
      if (this.showCategory) {
        this.query['cateOne'] = data['cateOne']
      }
      if (this.showCategory) {
        this.query['cateTwo'] = data['cateTwo']
      }
      if (this.showCategory) {
        this.query['cateThree'] = data['cateThree']
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
  background-color: #fff;
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

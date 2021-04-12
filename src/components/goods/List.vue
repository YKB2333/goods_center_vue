<template>
  <div>
    <!-- 搜索框 -->
    <offer-search
      v-if="searchVisible"
      ref="searchs"
      placeholder="商品名称/商品条码/规格编码/品牌/分类"
      v-model="searchVal"
      @search="onSearch"
      @cancel="onCancelSearch"
      @showFilter="showFilter"
      :is-show-action="isShowAction"
    />
    <!-- 订单头部排序 -->
    <van-sticky :class="{'headerHidden': !orderVisible}">
      <goods-order
        v-if="!tagSearchVisible && historyType !== '8'"
        ref="goodsOrder"
        v-model="orderSort"
        :brandList="brandList"
        :categoryList="categoryList"
        :showBrandCategory="showBrandCategory"
        :showBrand="showBrand"
        :showCategory="showCategory"
        :showWorkStatus="showWorkStatus"
        :showStockStatus="showStockStatus"
        :showTrade="showTrade"
        @change="onTabsChange"
        @confirm="onFilterConfirm"
        @reset="onFilterReset"
      />

      <goods-order-tag
        v-if="tagSearchVisible"
        ref="goodsOrderTag"
        v-model="query"
        :brandList="brandList"
        :categoryList="categoryList"
        :showBrandCategory="showBrandCategory"
        :showBrand="showBrand"
        :showCategory="showCategory"
        :showWorkStatus="showWorkStatus"
        :showStockStatus="showStockStatus"
        :showTrade="showTrade"
        @change="onTabsChange"
        @confirm="onFilterConfirm"
        @reset="onFilterReset"
      />
    </van-sticky>

    <!-- 列表 -->
    <div :class="['goods-list pt14 plr14', {'bg-white': goodsItemType !== '3'}]" id="goods-list">
      <van-list
        v-model="vanList.loading"
        :immediate-check="false"
        :finished="vanList.finished"
        :error.sync="vanList.error"
        :finished-text="vanList.finishedText"
        error-text="请求失败，点击重新加载"
        @load="onLoadMore"
      >
        <van-row gutter="20">
          <van-col :span="colSpan" v-for="(item, index) in goodsList" :key="index" class="div-col">
            <goods-item
              :type="goodsItemType"
              :title-image="item.titleImage ? `${item.titleImage + $config.imageZoom}200` : require('@/assets/images/logo.png')"
              :name="item.name"
              :showNew="goodsItemType !== '3' && item.updateDateIsInWeek"
              :msrp="item.mainPushPrice?item.mainPushPrice:item.lowerMsrp"
              :monthSales="item.monthSales"
              :is-checked="downloadSwitch"
              :remarks="isRemark && item.spuTagRemarks && item.spuTagRemarks.length>0 && item.spuTagRemarks[0].remark"
              :checked="checkedList.includes(item.id)"
              :brandName="item.brandName"
              :productDescribe="item.productDescribe"
              :validityStock="item.validityStock"
              :outStockType="item.outStockType"
              :is-show-tag="isShowTag"
              :tag="item.tag"
              @click.native="actionClick(item)"
            />
          </van-col>
        </van-row>
      </van-list>
    </div>

    <div class="fixed w30 h30 col" style="right:14px;bottom: 204px;">
      <img v-if="isShowToTop" @click="toTop" :src="require('@/assets/images/toTop.png')" />
    </div>
    <!-- 下载按钮 -->
    <div
      v-if="showDownLoad && !downloadSwitch"
      class="fixed w30 h30 col"
      style="right:14px;bottom:150px;"
    >
      <img
        v-if="goodsList.length>0"
        @click="toggleDownloadVisible"
        class="mb24"
        :src="require('@/assets/images/downLoad.png')"
      />
      <img
        @click="$router.push({name:'OfferDownLoad',query:{type: historyType}})"
        :src="require('@/assets/images/history.png')"
      />
    </div>

    <!-- 底部下载行 -->
    <div class="download_footer wrap" v-show="downloadSwitch">
      <div class="flex-1 ptb10" style="color:#9A9A9A">
        <van-checkbox v-model="selectStatus" @click="selectAll" class="fs14">当前页</van-checkbox>
      </div>
      <div class="row center-x space-between ptb10">
        <div class="cancel" @click="cancel">取消</div>
        <div class="bottom" @click="fetchDownloadMethod('all')">下载全部</div>
        <div class="bottom" @click="fetchDownloadMethod('select')">选中项({{ checkedList.length }})</div>
      </div>
    </div>

    <!-- 下载选项 -->
    <van-popup v-model="showPicker" round position="bottom" :lazy-render="false">
      <van-picker
        ref="downLoadPicker"
        title="请选择下载信息"
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="confirmDownloadMethod"
      />
    </van-popup>

    <!-- 邮箱 -->
    <van-dialog
      v-model="showEmail"
      :show-confirm-button="showConfirm"
      title="提示"
      show-cancel-button
      @confirm="exportspuData"
    >
      <div class="center-x mt14 mb20 fs15 fc-gray" style="color: #888">资料将发送至邮箱，请及时下载</div>
      <div
        class="center-x mb10 fs14"
        style="color: #aaa;margin-left:10px;margin-right:10px;text-alain:center"
      >
        <!-- <p class="ptb6">{{ userInfo && userInfo.email || '请在“企业微信-我-个人信息”中完善邮箱信息后下载' }}</p> -->
        <div :class="readonly?'newfield2':'newfield'">
          <van-field
            ref="emailInput"
            :input-align="'center'"
            :autosize="true"
            :border="true"
            type="text"
            v-model="query.email"
            :readonly="readonly"
            right-icon="edit"
            placeholder="请输入邮箱"
            @click-right-icon="eidtEmail"
          />
        </div>
        <!-- <div v-if="readonly">
          {{query.email}} <van-icon name="edit" style="margin-left: 5px;" @click="eidtEmail" />
        </div>-->
      </div>
      <div
        class="center-x mb20 fs14"
        style="color: #aaa;margin-left:10px;margin-right:10px;text-alain:center"
      >{{tipMsg}}</div>
    </van-dialog>
  </div>
</template>

<script>
import GoodsItem from './GoodsItem'
import GoodsOrder from './GoodsOrder'
import GoodsOrderTag from './GoodsOrderTag'
import OfferSearch from './OfferSearch'
import {
  spuSearch,
  spuSearch4Condition,
  getStockData,
  exportSpu
} from '@/api/spu'
import { mapGetters } from 'vuex'

export default {
  name: 'GoodsList',
  components: { GoodsItem, GoodsOrder, OfferSearch, GoodsOrderTag },
  props: {
    goodsItemType: {
      // 传入参数是显示 goods-item的值、  1 => item宽度50%;  2 => item宽度100%； 3是商品报价页面样式
      type: String,
      default: '1'
    },
    downLoadVisible: {
      // 是否显示下载按钮
      type: Boolean,
      default: false
    },
    searchVisible: {
      // 是否显示搜索框
      type: Boolean,
      default: false
    },
    orderVisible: {
      // 是否显order框
      type: Boolean,
      default: false
    },
    tagSearchVisible: {
      // 是否显赠品、中小样、试用装框
      type: Boolean,
      default: false
    },
    tags: {
      type: Array,
      default: () => []
    },
    isShowTag: {
      // 用于显示item前的标签 暂时使用于品牌详情页
      type: Boolean,
      default: false
    },
    isShowAction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tipMsg: '',
      showConfirm: true,
      readonly: true,
      count: 0,
      goodsList: [], // 商品列表
      showDownLoad: false, // 是否显示下载按钮
      historyType: '1', // 传入的历史类型
      isRemark: false, //
      query: {
        // 查询参数
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
        workStatus: '',
        existStock: '',
        brandIds: [],
        spuIds: [],
        email: '',
        isSampleGoods: false,
        type: '' // 类型 1:商品提案表 2:图素详情
      },
      searchVal: '', // 搜索值
      vanList: {
        //  下拉加载对象
        loading: true,
        finished: false,
        finishedText: '',
        error: false,
        myError: false
      },
      orderSort: {
        // 排序
        orderProperty: 'updateDate', // 排序属性
        orderType: 1 // 1降序；2升序；
      },
      // 默认排序
      brandList: [],
      categoryList: [],
      inited: false,
      showBrandCategory: true, // 显示商品服务类型筛选
      showBrand: true, // 显示品牌筛选
      showCategory: true, // 显示品类筛选
      showWorkStatus: true,
      showStockStatus: false, // 显示库存筛选
      showBrandCategory: true,
      showTrade: true,
      stockList: [],
      showNew: true,
      selectStatus: false, // 当前页全选状态
      downloadSwitch: false, // 下载选择开关
      checkedList: [], // 复选列表
      showPicker: false,
      showPickerName: '',
      columns: [],
      columnsTwo: [
        { text: '商品详情表（内部使用）', key: '0' },
        { text: '商品提案表（含主图，可发客户）', key: '1' },
        { text: '图素详情（图素、提案表，可发客户）', key: '2' }
      ],
      columnsOne: [{ text: '商品详情表（内部使用）', key: '0' }],
      showEmail: false,
      appTop: 0,
      appHight: 0,
      goodsCount: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    colSpan() {
      if (['1', '5'].includes(this.goodsItemType)) {
        return '12'
      }
      if (['2', '3', '4'].includes(this.goodsItemType)) {
        return '24'
      }
    },
    isShowToTop() {
      return this.appHight < this.appTop
    }
  },
  watch: {
    tags: {
      handler: function (val) {
        this.query.tag = val
        this.fetchGoodsList()
      },
      immediate: false
    },

    downLoadVisible: {
      handler(newValue) {
        this.showDownLoad = newValue
      },
      immediate: true
    },

    'query.email': function (newVal) {
      var verify = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (newVal && verify.test(newVal)) {
        this.tipMsg = '备注:可修改为客户邮箱,修改后仅生效一次'
        this.showConfirm = true
      } else {
        this.showConfirm = false
      }
    }
  },
  created() {},
  mounted() {
    this.init()
    // 获取筛选条件的、品牌列表、品类列表
    this.fetchBrandList()
    let dom = document.getElementById('app')
    this.appHight = dom.clientHeight
    dom.addEventListener('scroll', this.scrollEvent)
  },
  destroyed() {
    document
      .getElementById('app')
      .removeEventListener('scroll', this.scrollEvent)
  },
  methods: {
    scrollEvent(e) {
      this.appTop = document.getElementById('app').scrollTop
    },

    toTop() {
      let osTop = document.getElementById('app').scrollTop
      let speed = Math.floor(-osTop / 6)
      let timer = setInterval(() => {
        document.getElementById('app').scrollTop += speed
        if (document.getElementById('app').scrollTop <= 0) {
          clearInterval(timer)
        }
      }, 30)
    },

    init() {
      // 搜索参数
      // if (this.$route.query.keyword || this.$route.query.searchVal || Object.keys(this.$route.query).includes('keyword') || Object.keys(this.$route.query).includes('searchVal')) {
      //   let search = this.$route.query.keyword || this.$route.query.searchVal || ''
      //   this.searchVal = search
      //   this.query['keyword'] = search
      //   // this.$refs.searchs.searchVal = search
      //   this.orderSort.orderProperty = ''
      // }

      if (
        this.$route.query.keyword ||
        this.$route.query.searchVal ||
        Object.keys(this.$route.query).includes('keyword') ||
        Object.keys(this.$route.query).includes('searchVal')
      ) {
        // 搜索参数
        let search =
          this.$route.query.keyword || this.$route.query.searchVal || ''
        console.info('searchVal:', search)
        this.query.keyword = search
        this.searchVal = search
      }

      if (this.goodsItemType === '3' || this.goodsItemType === '5') {
        // 商品报价（从商品报价的页面排序方式为月排序）
        this.orderSort.orderProperty = 'monthSales'
      }

      if (this.$route.query['saleRankType']) {
        this.orderSort.orderProperty = 'monthSales'
        this.historyType = '8'
      }

      if (Array.isArray(this.tags)) {
        this.query.tag = [...this.tags]
      }

      if (this.$route.query.tag && this.$route.query.tag.length > 0) {
        if (Array.isArray(this.$route.query.tag)) {
          this.query.tag = this.$route.query.tag
        } else {
          this.query.tag.push(this.$route.query.tag)
        }
        this.fetchTagHistoryType()
      }

      if (
        this.$route.query.brandCategory &&
        this.$route.query.brandCategory.length > 0
      ) {
        // 商品服务类型
        this.historyType = '5'
        this.query['brandCategorys'].push(this.$route.query.brandCategory)
        this.showBrandCategory = false
      }

      if (
        this.$route.query.brandCategorys &&
        this.$route.query.brandCategorys.length > 0
      ) {
        // 商品服务类型
        if (!Array.isArray(this.$route.query.brandCategorys)) {
          this.query['brandCategorys'].push(this.$route.query.brandCategorys)
        } else {
          this.query['brandCategorys'] = this.$route.query.brandCategorys
        }
        this.showBrandCategory = false
        this.historyType = '5'
      }

      if (this.$route.query.isCrossBorderTrade) {
        // 跨境贸易
        this.historyType = '7'
        this.query['isCrossBorderTrade'] = Boolean(
          this.$route.query.isCrossBorderTrade
        )
        this.showTrade = false
      }

      if (this.$route.query.isGeneralTrade) {
        // 一般贸易
        this.historyType = '7'
        this.query['isGeneralTrade'] = Boolean(this.$route.query.isGeneralTrade)
        this.showTrade = false
      }

      if (this.$route.query.brandId) {
        // 品牌ID
        this.query['brandIds'].push(this.$route.query.brandId)
        this.showBrand = false
        this.historyType = '9'
      }
      if (this.$route.query.workStatus) {
        // 清货
        this.query['workStatus'] = this.$route.query.workStatus
        console.info(" this.query['workStatus']:", this.query['workStatus'])
        this.showDownLoad = true
        this.historyType = '3'
        this.showWorkStatus = false
      }

      if (this.$route.query.brandIds && this.$route.query.brandIds.length > 0) {
        // 日本专区
        this.query.brandIds = this.$route.query.brandIds
        this.showBrand = false
        this.historyType = '9'
      }

      if (this.$route.query.cateOne) {
        // 一级分类ID
        this.query['cateOne'] = this.$route.query.cateOne
        this.showCategory = false
      }

      if (this.$route.query.cateTwo) {
        // 二级分类ID
        this.query['cateTwo'] = this.$route.query.cateTwo
        this.showCategory = false
      }

      if (this.$route.query.cateThree) {
        // 三级分类ID
        this.query['cateThree'] = this.$route.query.cateThree
        this.showCategory = false
      }
      if (Object.keys(this.$route.query).includes('isOnSale')) {
        this.query.isOnSale = this.$route.query.isOnSale != true ? false : true
      }

      if (this.$route.query.isHistoryGoods) {
        this.historyType = '10'
      }

      if (Object.keys(this.$route.query).includes('existStock')) {
        this.query.existStock = this.$route.query.existStock
      }
      if (this.$route.query.isSampleGoods) {
        this.query.isSampleGoods = true
        if (this.query.existStock == null || this.query.existStock === '') {
          this.showStockStatus = true
        }
        this.historyType = '11'
      }
      if (Object.keys(this.$route.query).includes('isRemark')) {
        this.isRemark = this.$route.query['isRemark']
      }
      this.fetchGoodsList()
    },

    // 获取下载方式、弹窗
    fetchDownloadMethod(type) {
      if (type === 'select' && this.checkedList.length === 0) {
        this.$toast('请选择下载内容')
        return
      }
      this.columns = this.columnsTwo
      this.showPicker = true
      this.showPickerName = type
      this.$refs.downLoadPicker.setIndexes([0])
    },
    // 通过标签获取历史类型
    fetchTagHistoryType() {
      if (!this.query.tag || !this.query.tag.length) return
      let tagTyps = {
        全渠道必卖: '2',
        拯救干燥: '4',
        新品: '6'
      }
      // 商品标签格式化
      this.historyType = tagTyps[this.query.tag]
      this.showDownLoad = true
    },
    // 确定下载方法 判断是下载本地、还是通过邮箱
    confirmDownloadMethod(data) {
      if (data.key === '0') {
        // 下载项1 商品详情
        this.query.downLoadType = '0'
        this.query.email = ''
        this.exportspuData()
        return
      }
      if (data.key === '2') {
        // 下载项3 图素详情（轮播图、详情图、提案表）
        this.query.downLoadType = '2'
        if (
          this.checkedList.length > 300 ||
          (this.checkedList.length === 0 && this.goodsCount > 300)
        ) {
          this.$dialog.confirm({
            title: '提示',
            message: '最大限制下载300条数据</br>请筛选后重新下载',
            showCancelButton: false
          })
          this.showPicker = false
          return
        }
        if (!this.userInfo || !this.userInfo.email) {
          this.showPicker = false
          this.showConfirm = false
          this.query.email = ''
        } else {
          this.showConfirm = true
          this.query.email = this.userInfo.email
        }
        this.tipMsg = '备注:可修改为客户邮箱,修改后仅生效一次'
        this.readonly = true
        this.showEmail = true
        return
      }
      if (data.key === '1') {
        // 下载项2 商品提案表
        this.query.downLoadType = '1'
        this.query.email = ''

        if (
          this.checkedList.length > 3000 ||
          (this.checkedList.length === 0 && this.goodsCount > 3000)
        ) {
          this.$dialog.confirm({
            title: '提示',
            message: '最大限制下载3000条数据</br>请筛选后重新下载',
            showCancelButton: false
          })
          this.showPicker = false
          return
        }
        this.exportspuData()
      }
    },
    // 全部下载、选择下载
    exportspuData() {
      if (this.showPickerName === 'all') {
        this.query.spuIds = []
        this.checkedList = []
        this.fetchExportSpu()
      }
      if (this.showPickerName === 'select') {
        this.query.spuIds = this.checkedList
        this.fetchExportSpu()
      }
    },

    cancel() {
      this.checkedList = []
      this.downloadSwitch = false
      this.selectStatus = false
      this.query.spuIds = []
    },
    // 判断点击状态是选择还是跳转
    actionClick(item) {
      if (this.downloadSwitch) {
        this.toggleChecked(item)
      } else {
        this.toGoodsDetail(item)
      }
    },
    // 全选
    selectAll() {
      if (this.selectStatus) {
        this.checkedList = this.goodsList.map((e) => e.id)
      } else {
        this.checkedList = []
      }
    },

    toggleChecked(item) {
      let findIndex = this.checkedList.findIndex((key) => key == item.id)
      if (findIndex) {
        this.checkedList.push(item.id)
      } else {
        this.checkedList.splice(findIndex, 1)
      }
    },

    toggleDownloadVisible() {
      this.downloadSwitch = !this.downloadSwitch
    },

    fetchExportSpu() {
      let params = {}
      this.query.bizType = this.historyType
      Object.assign(params, this.orderSort, this.query) // 将两个对象合并到params对象上
      params['keyword'] = this.searchVal
      this.$store.commit('SHOW_LOADING', '下载中...')
      exportSpu(params)
        .then((res) => {
          this.cancel()
          this.showPicker = false
          // 当前是通过邮件的方式
          if (this.query.email) {
            this.$toast('商品图素详情资料正在下载中，请留意你的邮箱信息。')
            return
          } else {
            this.$router.push({
              name: 'OfferDownLoad',
              query: { type: this.historyType }
            })
            this.$toast('下载成功')
          }
        })
        .catch((e) => {
          console.info('error', e)
          this.$toast('下载失败')
        })
        .finally(() => {
          this.$store.commit('SHOW_LOADING', false)
        })
    },

    showFilter() {
      this.$refs.goodsOrder.showFilter()
    },

    onLoadMore() {
      if (this.vanList.finished) return
      if (!this.vanList.myError) {
        this.query['pageIndex'] += 1
      }
      this.fetchGoodsList('loadMore')
    },

    fetchGoodsList(flag = 'init') {
      let params = { ...this.orderSort, ...this.query } // 将两个对象合并到params对象上
      params['keyword'] = this.searchVal.replace(/,|，|\n/g, ' ')
      spuSearch(params)
        .then(async (res) => {
          let isFinish = res.pages === 0 || res.pages === res.pageIndex // 是否还有下一页
          this.vanList.finished = isFinish
          if (flag === 'init') {
            this.goodsList = []
            this.stockList = []
            // document.getElementById('app').scrollTop = 0
            this.goodsList = res.list
            this.goodsCount = res.count
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
          this.vanList.error = false
          this.vanList.myError = false
        })
        .catch((error) => {
          this.vanList.myError = true
          this.vanList.error = true
        })
        .finally(() => {
          this.vanList.loading = false
          this.selectStatus = false
        })
    },
    // 获取筛选条件的、品牌列表、品类列表
    fetchBrandList() {
      spuSearch4Condition(this.query).then((res) => {
        this.brandList = res.brandList
        this.categoryList = res.categoryList
      })
    },
    // 根据spuid获取库存数据
    fetchStockData(spuId) {
      return new Promise((resolve, reject) => {
        getStockData(spuId)
          .then((res) => {
            // console.log('库存数据', res)
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    getStockWithSpuId(spuId) {
      let value = '加载中...'
      this.stockList.every((item) => {
        if (item.spuId === spuId) {
          value = item.validityStock
          return false
        } else {
          return true
        }
      })
      // console.log(value)
      return value
    },

    toGoodsDetail(item) {
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
      this.resetQuery()
      this.fetchGoodsList()
    },

    onCancelSearch() {
      this.resetQuery()
      this.fetchGoodsList()
    },

    onFilterConfirm(data) {
      this.setFilterData(data)
      this.resetQuery()
      this.fetchGoodsList()
    },

    onFilterReset(data) {
      this.setFilterData(data)
      this.resetQuery()
      this.fetchGoodsList()
    },

    setFilterData(data) {
      this.query['lowerMsrp'] = data['lowerMsrp']
      this.query['higherMsrp'] = data['higherMsrp']
      if (this.showTrade) {
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
      }
      if (this.showWorkStatus) {
        this.query['workStatus'] = data['workStatus']
      }
      if (this.showBrandCategory) {
        this.query['brandCategorys'] = data['brandCategorys']
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
      if (this.showStockStatus) {
        this.query['existStock'] = data['existStock']
      }
    },

    resetQuery() {
      this.query['pageIndex'] = 1
      this.vanList.error = false
      this.vanList.myError = false
    },
    // #region 供父组件调用
    // 父组件搜索时调用
    setSearchVal(searchVal) {
      this.searchVal = searchVal
      this.resetQuery()
      this.fetchGoodsList()
      this.query.keyword = searchVal
      this.$router.push({ name: 'productListSearch', query: this.query })
    },

    setBrandIds(brandIds) {
      this.query['brandIds'] = brandIds
    },
    setTags(tags) {
      if (Array.isArray(tags)) {
        this.query.tag = tags
      } else {
        this.query.tag = [tags]
      }
      this.fetchGoodsList()
    },
    // #endregion

    // #region 下载到邮箱
    eidtEmail() {
      this.readonly = false
      setTimeout(() => {
        this.$refs.emailInput && this.$refs.emailInput.focus()
      }, 10)
    }
    // #endregion
  }
}
</script>

<style lang="scss" scoped>
// 底部下载栏目样式
.download_footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 100%;
  max-width: 600px;
  transform: translate(-50%, 0);
  padding: 0 4%;
  display: flex;
  align-items: center;
  background: white;
  justify-content: space-between;
  border-top: 1px solid #ebeef3;
  .bottom {
    color: white;
    background: #3e94ff;
    min-width: 80px;
    text-align: center;
    height: 35px;
    line-height: 35px;
    border-radius: 20px;
    font-size: 13px;
    margin-left: 10px;
  }
  .cancel {
    min-width: 80px;
    text-align: center;
    height: 35px;
    line-height: 35px;
    border-radius: 20px;
    font-size: 13px;
    color: #9a9a9a;
    border: 1px solid #cccccc;
  }
}
.headerHidden {
  height: 0px;
  overflow: hidden;
  /deep/.van-sticky {
    height: 0px;
    overflow: hidden;
    position: absolute;
    top: -100%;
  }
}
.div-col {
  position: relative;
}
/deep/ .newfield .van-field__body .van-field__control {
  background-color: #ebedf0;
  border-radius: 6px;
  height: 30px;
  margin-left: 10px;
}

/deep/ .newfield2 .van-field__body .van-field__control {
  // background-color: #ebedf0;
  border-radius: 6px;
  height: 30px;
  margin-left: 10px;
}
</style>
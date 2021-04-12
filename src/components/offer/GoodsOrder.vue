<template>
  <div id="goods-order" class="van-hairline--bottom">
    <!-- <van-tabs 
      class="flex-1"
      :class="tabActive === 'lowerMsrp' ? 'tabs-lower-msrp' : ''"
      v-model="tabActive" 
      :color="$config.mainColor" 
      :line-width="18" 
      :border="false"
      @click="onTabClick"
    >
      <van-tab title="销量" name="monthSales"></van-tab>
      <van-tab title="增速" name="monthGrowthRate"></van-tab>
      <van-tab name="lowerMsrp">
        <span title="价格" slot="title">价格
          <img v-if="priceOrder === 0" :src="require('@/assets/images/order.png')" width="13">
          <img v-if="priceOrder === 1" :src="require('@/assets/images/order-desc.png')" width="13">
          <img v-if="priceOrder === 2" :src="require('@/assets/images/order-asc.png')" width="13">
        </span>
      </van-tab>
    </van-tabs> -->
    <!-- <div class="filter-btn" @click="showFilter"> -->
      <!-- <span class="van-hairline--left">筛选</span> -->
      <!-- <svg-icon name="filter" /> -->
    <!-- </div> -->
    <van-popup
      v-model="isShowFilterPopup"
      position="right"
      class="h-full fs14 col filter-popup"
      style="max-width: 86%; color: #090909;">
      <div class="flex-1" style="overflow-y: auto;">
        <!-- 货品类型 -->
        <div class="mb30 plr16">
          <h4 class="ptb16">是否正常合作</h4>
          <div class="row space-between">
            <div class="select-btn" :class="filter.workStatus === '' ? 'active' : ''" @click="workStatus('')">全部</div>
            <div class="select-btn" :class="filter.workStatus === '正常销售' ? 'active' : ''" @click="workStatus('正常销售')">正常销售</div>
            <div class="select-btn" :class="filter.workStatus === '清货' ? 'active' : ''" @click="workStatus('清货')">清货</div>
          </div>
        </div>
        <!-- 价格区间 -->
        <div class="mb30 plr16">
          <h4 class="pb16">价格区间</h4>
          <div class="row center-y">
            <span class="fs12 pr10">建议零售价</span>
            <van-field v-model="filter.lowerMsrp" placeholder="最低价" input-align="center" class="price-field" />
            <span class="gray-dark plr6">-</span>
            <van-field v-model="filter.higherMsrp" placeholder="最高价" input-align="center" class="price-field" />
          </div>
        </div>
        <!-- 贸易类型 -->
        <div class="mb30 plr16">
          <h4 class="pb16">贸易类型</h4>
          <div class="row">
            <div class="select-btn mr8" :class="filter.isGeneralTrade ? 'active' : ''" @click="filter.isGeneralTrade=!filter.isGeneralTrade">一般贸易</div>
            <div class="select-btn" :class="filter.isCrossBorderTrade ? 'active' : ''" @click="filter.isCrossBorderTrade=!filter.isCrossBorderTrade">跨境贸易</div>
          </div>
        </div>
        <!-- 货品类型 -->
        <div class="mb22 plr16" v-if="showBrandCategory">
          <h4 class="mb8">商品服务类型</h4>
          <div class="row flex-wrap">
            <div 
              v-for="(item, index) in $config.brandCategoryList" :key="index" 
              class="select-btn mr8 mb8" 
              :class="selectBrandCategory.some(value => value.type === item.type) ? 'active' : ''" 
              @click="onBrandCategoryClick(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 品牌选择 -->
        <div class="mb22 plr16" v-if="showBrand && brandList.length">
          <div class="row space-between pb16">
            <h4>品牌</h4>
            <div @click="brandFlag = !brandFlag">
              <span class="fs12" style="color: #999999;">{{ brandFlag ? '收起' : '全部'}}</span>
              <van-icon :name="brandFlag ? 'arrow-up' : 'arrow-down'" color="#999999" />
            </div>
          </div>
          <div class="row" style="flex-wrap: wrap;">
            <div 
              class="select-btn mb8 mr8" 
              v-for="(item, index) in currentBrandList" :key="index"
              :class="brandSelectList.some(value => value.id === item.id) ? 'active' : ''" 
              @click="onBrandSelect(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 分类 -->
        <div class="mb22 plr16" v-if="showCategory && categoryList.length">
          <div class="row space-between pb16">
            <h4>品类</h4>
            <div @click="categoryFlag = !categoryFlag">
              <span class="fs12" style="color: #999999;">{{ categoryFlag ? '收起' : '全部'}}</span>
              <van-icon :name="categoryFlag ? 'arrow-up' : 'arrow-down'" color="#999999" />
            </div>
          </div>
          <div class="row" style="flex-wrap: wrap;">
            <div 
              class="select-btn mb8 mr8" 
              v-for="(item, index) in currentCategoryList" :key="index"
              :class="filter.cateOne === item.id ? 'active' : ''"
              @click="onCategorySelect(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="bottom-bar plr16 ptb20">
        <div @click="onReset">重置</div>
        <div @click="onConfirm">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getBrandList } from '@/api/brand'

export default {
  name: 'GoodsOrder',
  props: {
    value: {
      type: Object
    },
    brandList: { // 品牌列表
      type: Array,
      default: () => []
    },
    showBrandCategory: {
      type: Boolean,
      default: true
    },
    showBrand: {
      type: Boolean,
      default: true
    },
    showCategory: {
      type: Boolean,
      default: true
    },
    categoryList: { // 分类列表
      type: Array, 
      default: () => []
    }
  },
  data() {
    return {
      isShowFilterPopup: false,
      filter: {
        workStatus: '', // 合作状态
        lowerMsrp: '', // 最低价
        higherMsrp: '', // 最高价
        isGeneralTrade: false, // 一般贸易
        isCrossBorderTrade: false, // 跨境贸易
        brandCategorys: [], // 商品服务类型
        brandIds: [], // 品牌id
        cateOne: ''
      },
      brandSelectList: [], // 已选择的品牌列表
      selectBrandCategory: [],   /// 已选择的商品服务类型
      priceOrder: 0, // 价格排序：0未排序，1降序，2升序
      brandFlag: false, // false前6个，true全部
      categoryFlag: false, // false前6个，true全部
    }
  },
  computed: {
    // 品牌
    currentBrandList() {
      let arr = []
      if (this.brandFlag === false) {
        arr = this.brandList.slice(0, 6)
      } else {
        arr = this.brandList
      }
      return arr
    },
    // 分类
    currentCategoryList() {
      let arr = []
      if (this.categoryFlag === false) {
        arr = this.categoryList.slice(0, 6)
      } else {
        arr = this.categoryList
      }
      return arr
    }
  },
  created() {
    // this.tabActive = this.value['orderProperty']
  },
  methods: {
    showFilter() {
      this.isShowFilterPopup = true
    },
    workStatus(value) {
      if (this.filter.workStatus === value) return
      this.filter.workStatus = value
    },
    onBrandSelect(item) {
      // console.log(item)
      let index = this.brandSelectList.findIndex(value => value.id === item.id)
      if (index === -1) {
        this.brandSelectList.push(item)
      } else {
        this.brandSelectList.splice(index, 1)
      }
      console.log(this.brandSelectList)
    },
    onCategorySelect(item) {
      // console.log(item)
      if (item.id === this.filter['cateOne']) {
        this.filter['cateOne'] = ''
      } else {
        this.filter['cateOne'] = item.id
      }
    },
    onBrandCategoryClick(item) {
      console.log(item.name)
      let index = this.selectBrandCategory.findIndex(value => value.type === item.type)
      if (index === -1) { // 不存在
        this.selectBrandCategory.push(item)
      } else {
        this.selectBrandCategory.splice(index, 1)
      }
      console.log(this.selectBrandCategory)
    },
    onReset() {
      this.resetFilterValue()
      let data = _.cloneDeep(this.filter)
      this.$emit('reset', data)
      this.isShowFilterPopup = false
    },
    onConfirm() {
      let data = _.cloneDeep(this.filter)
      data['lowerMsrp'] = data['lowerMsrp'] ? parseInt(data['lowerMsrp']) : ''
      data['higherMsrp'] = data['higherMsrp'] ? parseInt(data['higherMsrp']) : ''
      data['brandIds'] = this.brandSelectList.map(item => item.id)
      data['brandCategorys'] = this.selectBrandCategory.map(item => item.type)
      this.$emit('confirm', data)
      this.isShowFilterPopup = false
    },
    onClose() {
      this.isShowFilterPopup = false
    },
    resetFilterValue() {
      // console.log(this.filter['cateOne'])
      this.filter['workStatus'] = ''
      this.filter['lowerMsrp'] = ''
      this.filter['higherMsrp'] = ''
      this.filter['isGeneralTrade'] = false
      this.filter['isCrossBorderTrade'] = false
      this.filter['cateOne'] = ''
      this.brandSelectList = []
      this.selectBrandCategory = []
      this.filter['brandCategorys'] = []
    },
    setFilter4Parent(key, value) {
      this.filter[key] = value
      console.log(this.filter[key])
    }
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
#goods-order{
  display: flex;
  background-color: #ffffff;
  /deep/ .van-tabs__line{
    height: 4px;
    border-radius: 15px;
  }
  .tabs-lower-msrp{
    /deep/ .van-tabs__line{
      left: -8px;
    }
  }
  .filter-btn{
    display: flex;
    align-items: center;
    // padding: 0 15px;
    padding-right: 30px;
    cursor: pointer;
    span{
      padding-left: 15px;
      font-size: 13px;
      color: #999999;
    }
  }
  .filter-popup{
    .price-field{
      background-color: #f8f8f8;
      border-radius: 50px;
      padding: 2px 15px;
      width: 86px;
      font-size: 12px;
    }
    .select-brand-name{
      background-color: #e8e3e3;
      padding: 4px 6px;
      border-radius: 20px;
      color: #1989fa;
      min-height: 18px;
      font-size: 12px;
    }
    .bottom-bar{
      display: flex;
      justify-content: space-between;
      
      &>div{
        width: 45%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        height: 38px;
        border-radius: 30px;
        font-weight: 600;
        &:nth-child(1){
          background-color:rgba(255,255,255,1);
          border: 1px solid #C7CBD3;
          color: #090909;
        }
        &:nth-child(2){
          background-color:#3A78EF;
          border: 1px solid #3A78EF;
          color: #ffffff;
        }
      }
    }
    /deep/ .van-dropdown-menu{
      &::after{
        border: none;
      }
    }
    .select-btn{
      width: 86px;
      height: 26px;
      background-color:rgba(245,246,249,1);
      border:1px solid rgba(245,246,249,1);
      border-radius: 30px;
      // display: flex;
      // align-items: center;
      // justify-content: center;
      font-size: 12px;
      color: #090909;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
      line-height: 24px;
      &.active{
        background-color:rgba(242,249,255,1);
        border:1px solid rgba(61,147,255,1);
        color: #3D93FF;
      }
    }
  }
}
</style>

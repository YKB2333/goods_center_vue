<template>
  <div>
    <div id="goods-order" class="van-hairline--bottom">
      <van-dropdown-menu
        active-color="#3A78EF"
        :class="['filter-left', (tabActive === 'monthAmt' || tabActive === 'monthSales') ? 'tabs-lower-msrp' : '']"
      >
        <van-dropdown-item
          @open="onOpenAmt"
          @close="onCloseAmt"
          @change="onAmtChange"
          v-model="selectAmtValue"
          :options="amtList"
        />
      </van-dropdown-menu>
      <van-tabs
        class="flex-4"
        :color="$config.mainColor"
        :line-width="18"
        :border="false"
        @click="onTabClick"
      >
        <van-tab name="updateDate">
          <span title="默认" slot="title">默认</span>
        </van-tab>
        <van-tab name="amt">
          <span title="销售额" slot="title">
            {{amtText}}
            <van-icon name="arrow-down" :color="isShowAmtMenu ? '#3d93ff' : '#646566'" />
          </span>
        </van-tab>
        <van-tab name="validityStock">
          <span title="库存" slot="title">
            库存
            <img v-if="stockOrder === 0" :src="require('@/assets/images/order.png')" width="13" />
            <img
              v-if="stockOrder === 1"
              :src="require('@/assets/images/order-desc.png')"
              width="13"
            />
            <img v-if="stockOrder === 2" :src="require('@/assets/images/order-asc.png')" width="13" />
          </span>
        </van-tab>
        <van-tab name="lowerMsrp">
          <span title="价格" slot="title">
            价格
            <img v-if="priceOrder === 0" :src="require('@/assets/images/order.png')" width="13" />
            <img
              v-if="priceOrder === 1"
              :src="require('@/assets/images/order-desc.png')"
              width="13"
            />
            <img v-if="priceOrder === 2" :src="require('@/assets/images/order-asc.png')" width="13" />
          </span>
        </van-tab>
        <van-tab name="filter">
          <span title="筛选" slot="title">筛选</span>
        </van-tab>
      </van-tabs>
      <van-popup
        v-model="isShowFilterPopup"
        position="right"
        class="h-full fs14 col filter-popup"
        style="max-width: 86%; color: #090909;"
      >
        <div class="flex-1" style="overflow-y: auto;">
          <!-- 货品类型 -->
          <div class="mb30 plr16" v-if="showWorkStatus">
            <h4 class="ptb16">合作状态</h4>
            <div class="row space-between">
              <div
                class="select-btn"
                :class="filter.workStatus === '' ? 'active' : ''"
                @click="workStatus('')"
              >全部</div>
              <div
                class="select-btn"
                :class="filter.workStatus === '正常销售' ? 'active' : ''"
                @click="workStatus('正常销售')"
              >正常销售</div>
              <div
                class="select-btn"
                :class="filter.workStatus === '清货' ? 'active' : ''"
                @click="workStatus('清货')"
              >清货</div>
            </div>
          </div>
          <!-- 价格区间 -->
          <div class="mb30 plr16">
            <h4 class="pb16">价格区间</h4>
            <div class="row center-y">
              <span class="fs12 pr10">建议零售价</span>
              <van-field
                v-model="filter.lowerMsrp"
                placeholder="最低价"
                input-align="center"
                class="price-field"
              />
              <span class="gray-dark plr6">-</span>
              <van-field
                v-model="filter.higherMsrp"
                placeholder="最高价"
                input-align="center"
                class="price-field"
              />
            </div>
          </div>
          <!-- 贸易类型 -->
          <div class="mb30 plr16" v-if="showTrade">
            <h4 class="pb16">贸易类型</h4>
            <div class="row">
              <div
                class="select-btn mr8"
                :class="filter.isGeneralTrade ? 'active' : ''"
                @click="filter.isGeneralTrade=!filter.isGeneralTrade"
              >一般贸易</div>
              <div
                class="select-btn"
                :class="filter.isCrossBorderTrade ? 'active' : ''"
                @click="filter.isCrossBorderTrade=!filter.isCrossBorderTrade"
              >跨境贸易</div>
            </div>
          </div>
          <!-- 货品类型 -->
          <div class="mb22 plr16" v-if="showBrandCategory">
            <h4 class="mb8">商品服务类型</h4>
            <div class="row flex-wrap">
              <div
                v-for="(item, index) in $config.brandCategoryList"
                :key="index"
                class="select-btn mr8 mb8"
                :class="selectBrandCategory.some(value => value.type === item.type) ? 'active' : ''"
                @click="onBrandCategoryClick(item)"
              >{{ item.name }}</div>
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
                v-for="(item, index) in currentBrandList"
                :key="index"
                :class="brandSelectList.some(value => value.id === item.id) ? 'active' : ''"
                @click="onBrandSelect(item)"
              >{{ item.name }}</div>
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
                v-for="(item, index) in currentCategoryList"
                :key="index"
                :class="filter.cateOne === item.id ? 'active' : ''"
                @click="onCategorySelect(item)"
              >{{ item.name }}</div>
            </div>
          </div>
          <!-- 是否有库存类型 -->
          <div class="mb30 plr16" v-if="showStockStatus">
            <h4 class="ptb16">是否有库存</h4>
            <div class="row space-between">
              <div
                class="select-btn"
                :class="filter.existStock ==null ? 'active' : '' "
                @click="existStock(null)"
              >全部</div>
              <div
                class="select-btn"
                :class="filter.existStock === true ? 'active' : ''"
                @click="existStock(true)"
              >有库存</div>
              <div
                class="select-btn"
                :class="filter.existStock === false ? 'active' : ''"
                @click="existStock(false)"
              >无库存</div>
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
    <div class="flex-1 twoLine">
      <van-button
        class="atb-btn"
        v-for="(item, index) in tags"
        :key="index"
        round
        size="small"
        :plain="index !== currentIndex"
        :color="$config.mainColor"
        @click="onClickBtn(item, index)"
      >{{ item }}</van-button>
    </div>
  </div>
</template>

<script>
import { goodsOrder } from '@/mixins/goods-order'
export default {
  name: 'GoodsOrderTag',
  props: {
    value: {
      type: Object
    },
    brandList: {
      // 品牌列表
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
    showWorkStatus: {
      type: Boolean,
      default: true
    },
    showStockStatus: {
      type: Boolean,
      default: true
    },
    showTrade: {
      type: Boolean,
      default: true
    },
    categoryList: {
      // 分类列表
      type: Array,
      default: () => []
    }
  },
  mixins: [goodsOrder],
  data() {
    return {
      currentIndex: 0,
      tags: ['全部', '赠品', '中小样', '试用装']
    }
  },
  computed: {},
  methods: {
    onConfirm() {
      let data = _.cloneDeep(this.filter)
      data['lowerMsrp'] = data['lowerMsrp'] ? parseInt(data['lowerMsrp']) : ''
      data['higherMsrp'] = data['higherMsrp']
        ? parseInt(data['higherMsrp'])
        : ''
      data['brandIds'] = this.brandSelectList.map((item) => item.id)
      data['brandCategorys'] = this.selectBrandCategory.map((item) => item.type)
      if (this.$route.query.cateTwo) {
        data['cateOne'] = this.$route.query.cateOne
          ? this.$route.query.cateOne
          : ''
        data['cateTwo'] = this.$route.query.cateTwo
          ? this.$route.query.cateTwo
          : ''
        data['cateThree'] = this.$route.query.cateThree
          ? this.$route.query.cateThree
          : ''
      }
      this.$emit('confirm', data)
      this.isShowFilterPopup = false
    },

    onClickBtn(item, index) {
      this.currentIndex = index
      if (item === '全部') {
        this.value.tag = ['赠品', '中小样', '试用装']
      } else {
        this.value.tag = [item]
      }
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
#goods-order {
  display: flex;
  background-color: #ffffff;
  /deep/ .van-tabs {
    z-index: 2;
  }
  .update-date-box {
    /deep/ .van-tab--active,
    /deep/ .van-tab {
      padding-right: 0;
    }
  }
  /deep/ .van-icon-arrow-down {
    font-size: 12px;
    transform: scale(0.8);
  }
  /deep/ .van-tab--active {
    color: #090909 !important;
    font-weight: 600;
  }

  /deep/ .van-tabs__line {
    height: 4px;
    border-radius: 15px;
    left: -8px;
  }
  /deep/ .van-hairline--left::after {
    border-left: none;
  }
  /deep/ .van-tabs__nav {
    background-color: transparent;
  }
  .filter-left {
    position: absolute;
    left: 70px;
    width: 90px;
    height: 44px; /* no */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /deep/ .van-dropdown-menu__bar {
      height: 44px; /* no */
      box-shadow: none;
      opacity: 0;
    }
    /deep/ .van-dropdown-menu__title {
      color: #666;
      font-size: 13px; /* no */
      line-height: 16px; /* no */
      padding: 0;
      transform: translate(-4px, -1px);
    }
    /deep/ .van-dropdown-item__content .van-dropdown-item__option:nth-child(1) {
      display: none;
    }
    /deep/ .van-dropdown-menu__title--active {
      color: #090909 !important;
      font-weight: 600 !important;
    }
    /deep/ .van-icon-success::before {
      content: '';
      width: 22px;
      height: 22px;
      background: url('~@/assets/images/icon_gou.png');
      background-size: cover;
    }
    /deep/ .van-dropdown-menu__title::after {
      display: block;
      overflow: hidden;
      margin-top: 0; /* no */
      top: 38%;
      right: -16px; /* no */
      width: 13px; /* no */
      height: 4px; /* no */
      transform: rotate(0) scale(0.9);
      background-image: url('~@/assets/images/order.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position-y: bottom;
      border-color: transparent;
      opacity: 1;
    }
  }
  .filter-btn {
    display: flex;
    flex: 1;
    line-height: 42px; /* no */
    justify-content: center;
    cursor: pointer;
    span {
      font-size: 13px; /* no */
      color: #666;
    }
  }
  .filter-popup {
    .price-field {
      background-color: #f8f8f8;
      border-radius: 50px;
      padding: 2px 15px;
      width: 86px;
      font-size: 12px;
    }
    .select-brand-name {
      background-color: #e8e3e3;
      padding: 4px 6px;
      border-radius: 20px;
      color: #1989fa;
      min-height: 18px;
      font-size: 12px;
    }
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      & > div {
        width: 45%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        height: 38px;
        border-radius: 30px;
        font-weight: 600;
        &:nth-child(1) {
          background-color: rgba(255, 255, 255, 1);
          border: 1px solid #c7cbd3;
          color: #090909;
        }
        &:nth-child(2) {
          background-color: #3a78ef;
          border: 1px solid #3a78ef;
          color: #ffffff;
        }
      }
    }
    /deep/ .van-dropdown-item {
      max-width: 400px;
      margin: 0 auto;
    }
    /deep/ .van-dropdown-menu {
      &::after {
        border: none;
      }
    }
    .select-btn {
      width: 86px;
      height: 26px;
      background-color: rgba(245, 246, 249, 1);
      border: 1px solid rgba(245, 246, 249, 1);
      border-radius: 30px;
      font-size: 12px;
      color: #090909;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
      line-height: 24px;
      &.active {
        background-color: rgba(242, 249, 255, 1);
        border: 1px solid rgba(61, 147, 255, 1);
        color: #3d93ff;
      }
    }
  }
}
.twoLine {
  background-color: #ffffff;
  padding: 15px 15px 0;
  .atb-btn {
    height: 26px;
    padding: 0 16px;
    margin-right: 14px;
    background-color: #ebf4ff !important;
    border: 1px solid #3d93ff;
    .van-button__text {
      color: #3d93ff;
      font-weight: 600;
    }
    &.van-button--plain {
      background: #f4f4f4 !important;
      border: 1px solid transparent !important;
      .van-button__text {
        color: #666666;
        font-weight: 400;
      }
    }
  }
}
</style>

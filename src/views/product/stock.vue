<template>
  <div class="page">
    <div class="hairline-bottom plr16 bg-white">
      <div class="fs16 pt20 pb10 ellipsis2 fw600">{{title}}</div>
      <div>
        <div v-if="firstAtbValues.length > 0" class="row">
          <span class="main-text-color fs13 pr4 pt2">{{ firstAtbValues[0].firstAtbKey }}：</span>
          <div class="flex-1">
            <van-button
              v-for="(item, index) in firstAtbValues"
              :key="index"
              :class="['atb-btn']"
              round
              size="small"
              :color="$config.mainColor"
              :plain="index !== currentFirst.index || firstDisableds.some(data => data.id === item.id)"
              :disabled="firstDisableds.some(data => data.id === item.id)"
              @click="onClickFirst(item, index)"
            >{{ item.firstAtbValue }}</van-button>
          </div>
        </div>
        <div v-if="secondAtbValues.length > 0" class="row pb10">
          <span class="main-text-color fs13 pr4 pt2">{{ secondAtbValues[0].secondAtbKey }}：</span>
          <div class="flex-1 two-line">
            <van-button
              v-for="(item, index) in secondAtbValues"
              :key="index"
              class="atb-btn"
              round
              size="small"
              :color="$config.mainColor"
              :plain="index !== currentSecond.index || secondDisableds.some(data => data.id === item.id)"
              :disabled="secondDisableds.some(data => data.id === item.id)"
              @click="onClickSecond(item, index)"
            >{{ item.secondAtbValue }}</van-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="stockObj" class="hairline-bottom plr16 bg-white">
      <div class="fw600 ptb18 van-hairline--bottom">
        <span class="dot-yellow parameterSpan">总库存：{{ stockObj.stock || 0 }}</span>
        <span
          style="margin-right:0;"
          class="dot-red parameterSpan"
        >可发货库存：{{ stockObj.validityStock || 0 }}</span>
        <img :src="require('@/assets/images/icon_sm.png')" class="w-h22 fr" @click="onOpenDialog" />
      </div>
      <div v-if="!isStockEmpty(stockObj)" class="row wrap space-between quantity-box">
        <div v-for="(item, idx) in validityList" :key="idx" class="col center quantity-item">
          <div class="mb4 color333 fs14 fw600">{{ stockObj[item.column] || 0 }}</div>
          <div class="color-666">{{item.name}}</div>
        </div>
      </div>
      <div v-else class="color-666 text-center ptb20">暂无效期库存数据</div>
    </div>
    <div v-else class="emply pos-center">
      <img src="@/assets/images/isEmply.png" alt />
      <p>暂无库存数据哦</p>
    </div>
    <div v-if="stockObj && stockObj.storeStocks && stockObj.storeStocks.length>0">
      <div
        v-for="(v, idx) in stockObj.storeStocks"
        :key="idx"
        class="hairline-bottom plr16 bg-white"
      >
        <div class="fw600 ptb18 van-hairline--bottom">
          <div>
            <span class="dot-gray parameterSpan">{{ v.ckName }}</span>
            <img
              :src="require('@/assets/images/icon_sm.png')"
              class="w-h22 fr"
              @click="onOpenDialog"
            />
          </div>
          <div class="mt8">
            <span class="dot-transparent parameterSpan color-666">总库存：{{ v.stock || 0 }}</span>
            <span
              style="margin-right:0;"
              class="dot-transparent parameterSpan color-666"
            >可发货：{{ v.validityStock || 0 }}</span>
          </div>
        </div>
        <div v-if="!isStockEmpty(v)" class="row wrap space-between quantity-box">
          <div v-for="(item, idx) in validityList" :key="idx" class="col center quantity-item">
            <div class="mb4 color333 fs14 fw600">{{ v[item.column] || 0}}</div>
            <div class="color-666">{{item.name}}</div>
          </div>
        </div>
        <div v-else class="color-666 text-center ptb20">暂无效期库存数据</div>
      </div>
    </div>
    <!--说明弹窗 -->
    <van-dialog
      v-model="isShowDialog"
      :showConfirmButton="false"
      width="330"
      class="fz-dialog"
      theme="round-button"
    >
      <div class="guide-wapper">
        <van-icon class="close-btn" size="25" name="close" @click="onCloseDialog" />
        <div class="text-center ellipsis title mb20">效期说明</div>
        <div class="hidden">
          <div class="fs14 content">
            <div class="mb12">1、无保质期：长期可以使用，效期不敏感，或者基础信息不完整；</div>
            <div class="mb12">2、1/3效期内：距生产日期已过1/3效期内，还剩大于2/3保质期；</div>
            <div class="mb12">3、1/3-1/2效期：距生产日期已过1/3-1/2效期，还剩1/2-2/3保质期；</div>
            <div class="mb12">4、1/2-2/3效期：距生产日期已过1/3-2/3效期，还剩大于1/3保质期；</div>
            <div class="mb12">5、大于2/3效期：距生产日期已过大于2/3效期，还剩不到1/3保质期；</div>
            <div class="mb12">6、生产日期不全：WMS未录入效期，或者商品库存在NC保税仓，无效期明细；</div>
            <div class="overlay"></div>
          </div>
        </div>
        <van-button class="mt22 fw600" color="#3D93FF" round block @click="onCloseDialog">知道了</van-button>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { getSpuInfoById } from '@/api/spu'
import { uniqueArr, deepClone } from '@/utils'
export default {
  name: 'ProductStock',
  data() {
    return {
      title: '',
      spuId: null,
      firstAtbValues: [], // 主属性值数组
      secondAtbValues: [], // 副属性值数组
      skuList: [],
      currentFirst: {
        // 当前主属性值
        index: 0,
        data: null
      },
      currentSecond: {
        // 当前辅属性值
        index: 0,
        data: null
      },
      validityList: [
        { name: '无保质期', column: 'noExpiryDateTotal' },
        { name: '1/3效期内', column: 'leOneThirdTotal' },
        { name: '1/3-1/2效期', column: 'leOneTwoTotal' },
        { name: '1/2-2/3效期', column: 'leTwoThirdTotal' },
        { name: '大于2/3效期', column: 'gtTwoThirdTotal' },
        { name: '过保质期', column: 'pastShelfLifeTotal' },
        { name: '生产日期不全', column: 'noManufactureDateTotal' },
        { name: '不良品仓', column: 'inferiorGoodsTotal' },
        { name: '待报废仓', column: 'damagedAndExpiredTotal' }
      ],
      isShowDialog: false,
      stockList: [],
      firstDisableds: [], // 主属性值禁用列表
      secondDisableds: [], // 副属性值禁用列表
      stockObj: null
    }
  },
  computed: {
    isStockEmpty() {
      return (obj) => {
        let isEmpty = true
        for (let i = 0; i < this.validityList.length; i++) {
          if (
            obj[this.validityList[i].column] !== 0 &&
            obj[this.validityList[i].column] !== null
          ) {
            isEmpty = false
            break
          }
        }
        return isEmpty
      }
    }
  },
  created() {
    document.title = '库存（WMS+NC保税仓）'
    if (this.$route.params.stockList) {
      this.stockList = this.$route.params.stockList
      sessionStorage.setItem(
        'stockList',
        JSON.stringify(this.$route.params.stockList)
      )
    } else {
      this.stockList = JSON.parse(sessionStorage.getItem('stockList'))
    }
    this.spuId = this.$route.query.spuId // 获取spuId
    this.title = this.$route.query.title // 获取spuId
    this.init()
  },
  methods: {
    async init() {
      await this.fetchSpuOne() // 根据spuId获取spu详情
      this.initAtbValues() // 获取主属性值列表和副属性值列表
    },
    // 获取spu信息
    fetchSpuOne() {
      return new Promise((resolve, reject) => {
        this.$store.commit('SHOW_LOADING')
        getSpuInfoById(this.spuId)
          .then((res) => {
            // sku列表
            if (res.skus) {
              let isTrueList = res.skus.filter((e) => e.isMainPush)
              let isFalseList = res.skus.filter((e) => !e.isMainPush)
              // 如果存在主推商品
              this.skuList = isTrueList.concat(isFalseList)
            }
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            this.$store.commit('SHOW_LOADING', false)
          })
      })
    },
    // 主属性值点击
    onClickFirst(item, index) {
      if (index === this.currentFirst['index']) {
        this.currentFirst.swipeImages = []
        this.currentFirst.detailImages = []
        this.currentFirst['index'] = -1
        this.currentFirst['data'] = null
        if (this.secondAtbValues.length) {
          this.secondDisableds = []
          this.unSendisableds = deepClone(this.secondAtbValues)
        }
      } else {
        this.currentFirst['index'] = index
        this.currentFirst['data'] = deepClone(item)
        if (this.secondAtbValues.length) {
          this.secondDisableds = []
          this.unSendisableds = []
          let arr = this.skuList.filter(
            (ele) =>
              ele.firstAtbValue === this.currentFirst['data'].firstAtbValue
          )
          this.secondAtbValues.forEach((item) => {
            let findIndex = arr.findIndex(
              (ele) => ele.secondAtbValue === item.secondAtbValue
            )
            if (findIndex >= 0) {
              this.unSendisableds.push(item)
            } else {
              this.secondDisableds.push(item)
            }
          })
        }
      }
      this.getStockObj(this.currentFirst)
    },
    // 副属性值点击
    onClickSecond(item, index) {
      if (index === this.currentSecond['index']) {
        this.currentSecond['index'] = -1
        this.currentSecond['data'] = null
        this.firstDisableds = []
        this.unFirstDisableds = deepClone(this.firstAtbValues)
      } else {
        this.currentSecond['index'] = index
        this.currentSecond['data'] = deepClone(item)
        this.firstDisableds = []
        this.unFirstDisableds = []
        let arr = this.skuList.filter(
          (ele) =>
            ele.secondAtbValue === this.currentSecond['data'].secondAtbValue
        )
        this.firstAtbValues.forEach((item) => {
          let findIndex = arr.findIndex(
            (ele) => ele.firstAtbValue === item.firstAtbValue
          )
          if (findIndex >= 0) {
            this.unFirstDisableds.push(item)
          } else {
            this.firstDisableds.push(item)
          }
        })
      }
      this.getStockObj(this.currentSecond)
    },
    // 获取sku仓库库存
    getStockObj(obj) {
      if (obj.data) {
        this.stockObj =
          this.stockList &&
          this.stockList.filter((v) => v.skuId === obj.data.id)[0]
      }
    },

    initAtbValues() {
      // 主
      this.firstAtbValues = uniqueArr(
        this.skuList.filter((item) => item.firstAtbValue),
        'firstAtbValue'
      ) // 去重
      this.currentFirst['data'] = this.firstAtbValues[0]
      // 副
      this.secondAtbValues = uniqueArr(
        this.skuList.filter((item) => item.secondAtbValue),
        'secondAtbValue'
      ) // 去重
      this.getStockObj(this.currentFirst)
    },

    onCloseDialog() {
      this.isShowDialog = false
    },

    onOpenDialog() {
      this.isShowDialog = true
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f2f4f9;
  .hairline-bottom {
    // border-bottom: 8px solid #ebedf2;
    margin-bottom: 8px;
  }
  .two-line {
    width: 80%;
  }
  .atb-btn {
    margin-right: 10px;
    margin-bottom: 10px;
    height: 22px !important;
    line-height: 20px !important;
    cursor: pointer;
    &.van-button--plain {
      color: #3d93ff;
      background-color: #f2f9ff;
      border: 1px solid #3d93ff;
    }
    .van-button__text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .copy-btn {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    cursor: pointer;
    transform: translateY(-1px);
  }
  .dot-transparent,
  .dot-yellow,
  .dot-red,
  .dot-gray {
    &::before {
      display: inline-block;
      content: '';
      width: 6px; /*no*/
      height: 6px; /*no*/
      border-radius: 50%;
      margin-right: 8px; /*no*/
      margin-bottom: 2px; /*no*/
    }
  }
  .dot-yellow::before {
    background-color: #fed00b;
  }
  .dot-red::before {
    background-color: #ff497c;
  }
  .dot-gray::before {
    background-color: #e0e8ee;
  }
  .parameterSpan {
    margin-right: 24px;
    // display: inline-block;
    // width: 120px;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 22px;
    vertical-align: middle;
    // :nth-last-child()
  }
  .fr {
    float: right;
  }
  .quantity-box {
    padding: 10px 0;
    &::after {
      content: '';
      width: 30%;
    }
    .quantity-item {
      width: 30%;
      margin: 10px 0;
    }
  }
  /deep/ .fz-dialog {
    border-radius: 8px;
    padding: 26px 15px;
    // padding-bottom: 5px;
    .guide-wapper {
      position: relative;
      white-space: pre-line;
      text-align: justify;
      .close-btn {
        position: absolute;
        top: -12px;
        right: 0px;
        transform: translate(25%, -25%);
        color: #999;
      }
      .title {
        font-weight: bold;
        color: #000000;
        line-height: 20px;
        font-size: 18px;
      }
      .content {
        width: 108%;
        height: 240px;
        line-height: 22px;
        padding-right: 24px;
        overflow: auto;
        color: #666666;
        font-size: 14px;
        // &::-webkit-scrollbar {
        //   width: 0;
        // }
        .overlay {
          position: absolute;
          bottom: 40px;
          width: 100%;
          height: 48px;
          background: linear-gradient(
            0deg,
            #ffffff 0%,
            rgba(255, 255, 255, 0) 100%
          );
        }
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
  .emply {
    text-align: center;
    padding: 0 0 40px;
    img {
      width: 200px;
    }
    p {
      margin-top: 20px;
      font-size: 14px;
      color: #959ca7;
      line-height: 14px;
    }
  }
}
</style>
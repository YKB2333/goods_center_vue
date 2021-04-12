<template>
  <div class="mb14 pointer">
    <div v-if="type === '1'" class="goods-card">
      <div class="relative">
        <div v-if="isChecked" class="checkbox">
          <van-checkbox v-model="item_checked"></van-checkbox>
        </div>
        <img :src="titleImage" class="title-image" />
        <img :src="stockTypeImg" v-if="stockTypeImg" class="pos-center w-h60" />
      </div>
      <div>
        <div class="name van-ellipsis">{{ name }}</div>
        <div class="ellipsis">
          <span class="msrp">￥{{ Numeral(msrp).format('0,0.00') }}</span>
          <span class="text">建议零售价</span>
        </div>
      </div>
    </div>
    <div v-if="type === '2'" class="goods-item">
      <div class="row">
        <div v-if="isChecked" class="row center-y mr8">
          <van-checkbox v-model="item_checked"></van-checkbox>
        </div>
        <div class="goods-img-box relative">
          <img :src="titleImage" />
          <img :src="stockTypeImg" v-if="stockTypeImg" class="pos-center w-h60" />
        </div>
        <div class="goods-content">
          <p class="name ellipsis2">{{ name }}</p>
          <div class="hot-sale">
            <img :src="require('@/assets/images/hot-sale.png')" width="14" />
            <span>月销 {{ monthSales | salesFormat }}</span>
          </div>
          <div class="bottom">
            <div class="price flex-1">
              <p class="value">
                <span class="text mb4 pr6">建议零售价</span>
                ￥{{ Numeral(msrp).format('0,0.00') }}
              </p>
              <p class="text">
                <span class="pr6 fw600">可发货库存</span>
                <span class="fs14 bold">{{ validityStock }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="remarks" class="goods-recomend">
        <img :src="require('@/assets/images/icon_tj.png')" class="w-h14 mr4" />
        <span class="fw600 fs10 pr2">推荐理由：</span>
        <span class="fs10" style="color:#666666;">{{remarks}}</span>
        <img
          :src="require('@/assets/images/icon_copy.png')"
          alt="复制"
          class="copy-btn w-h14"
          @click.stop="() => {}"
          v-clipboard:copy.stop="remarks"
          v-clipboard:success="onCopy"
        />
      </div>
    </div>
    <!-- 商品报价页面专用 -->
    <div v-if="type === '3'" class="goods-item-type3">
      <div v-if="isChecked" class="row center-y">
        <van-checkbox v-model="item_checked"></van-checkbox>
      </div>
      <div class="goods-img-box relative">
        <img :src="titleImage" />
        <img :src="stockTypeImg" v-if="stockTypeImg" class="pos-center w-h60" />
      </div>
      <div class="goods-content">
        <p class="name ellipsis2">{{ name }}</p>
        <div class="hot-sale">
          <span>{{brandName}}</span>
        </div>
        <div class="bottom">
          <div class="price flex-1">
            <p class="text">
              <span>{{productDescribe}}</span>
            </p>
            <p class="value">
              <span class="text pr6">建议零售价</span>
              ￥{{ Numeral(msrp).format('0,0.00') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 历史商品页面专用 -->
    <div v-if="type === '4'" class="goods-item-type3">
      <div v-if="isChecked" class="row center-y">
        <van-checkbox v-model="item_checked"></van-checkbox>
      </div>
      <div class="goods-img-box relative">
        <img :src="titleImage" />
      </div>
      <div class="goods-content">
        <p class="name ellipsis2">{{ name }}</p>
        <div class="bottom">
          <div class="price flex-1">
            <p class="text">
              <span>{{productDescribe}}</span>
            </p>
            <p class="value">
              <span class="text pr6">建议零售价</span>
              ￥{{ Numeral(msrp).format('0,0.00') }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 品牌详情页面专用 -->
    <div v-if="type === '5'" class="goods-card">
      <div class="relative">
        <div v-if="isChecked" class="checkbox">
          <van-checkbox v-model="item_checked"></van-checkbox>
        </div>
        <img :src="titleImage" class="title-image" />
        <img :src="stockTypeImg" v-if="stockTypeImg" class="pos-center w-h60" />
      </div>
      <div>
        <div :class="['name', !isShowTag ? 'van-ellipsis' : 'ellipsis2 text-left h40']">
          <template v-if="isShowTag">
            <van-tag
              v-for="item in tagList"
              :key="item"
              class="mr2 mb2"
              round
              plain
              color="#F71744"
            >{{item}}</van-tag>
          </template>
          <span class="l-h20">{{ name }}</span>
        </div>
        <div class="ellipsis">
          <span class="msrp">￥{{ Numeral(msrp).format('0,0.00') }}</span>
          <span class="text">建议零售价</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Numeral from 'numeral'
import { CheckboxGroup } from 'vant'

export default {
  name: 'GoodsItem',
  components: {},
  props: {
    type: {
      type: String,
      default: '1'
    },
    titleImage: {
      type: String
    },
    name: {
      type: String
    },
    msrp: {
      type: Number
    },
    monthSales: {
      type: Number
    },
    validityStock: {
      type: [Number, String]
    },
    outStockType: {
      type: [Number, String]
    },
    checked: {
      type: Boolean,
      default: false
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    productDescribe: {
      type: String
    },
    brandName: {
      type: String
    },
    remarks: {
      default: ''
    },
    tag: {
      type: String,
      default: ''
    },
    isShowTag: {
      // 显示名称前的tag， 目前仅用于品牌信息页
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      item_checked: false
    }
  },
  watch: {
    checked: {
      handler(newValue) {
        this.item_checked = newValue
      },
      immediate: true
    }
  },
  computed: {
    stockTypeImg() {
      // <img :src="require('@/assets/images/sale_out.png')" v-if="outStockType==3" class="pos-center w-h60" alt="">
      //   <img :src="require('@/assets/images/eplenishment.png')" v-if="outStockType==2" class="pos-center w-h60" alt="">
      //   <img :src="require('@/assets/images/arrival.png')" v-if="outStockType==1" class="pos-center w-h60" alt="">
      let map = {
        1: require('@/assets/images/arrival.png'),
        2: require('@/assets/images/eplenishment.png'),
        3: require('@/assets/images/sale_out.png')
      }
      return map[this.outStockType] || ''
    },

    tagList() {
      if (!this.tag) {
        return []
      }
      const demoTag = ['赠品', '中小样', '试用装']
      return this.tag.split('|').filter((v) => demoTag.includes(v))
    }
  },
  created() {},
  methods: {
    Numeral,

    onCopy() {
      this.$toast({
        message: '内容已复制到粘贴板',
        duration: 1000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$name-color: #333333;
$price-color: #f71744;
@mixin shadow() {
  box-shadow: 0px 0px 10px 0px rgba(40, 109, 153, 0.1);
}
.goods-item {
  background-color: #ffffff;
  border-radius: 6px;
  padding: 14px;
  @include shadow();
  .goods-img-box {
    width: 105px;
    margin-right: 10px;
  }
  .goods-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      color: $name-color;
      font-size: 13px;
    }
    .hot-sale {
      color: #666;
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-top: 4px;
      img {
        margin-right: 4px;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .price {
        .value {
          color: $price-color;
          font-size: 16px;
          font-weight: 600;
        }
        .text {
          font-size: 12px;
          color: #666;
        }
      }
      .detail-btn {
        width: 105px;
        height: 46px;
        position: relative;
        bottom: -6px;
        cursor: pointer;
      }
    }
  }
}
.goods-card {
  padding: 20px 14px;
  @include shadow();
  text-align: center;
  border-radius: 6px;
  .title-image {
    width: 100%;
    max-width: 200px;
    margin-bottom: 15px;
  }
  .name {
    color: $name-color;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    /deep/ .van-tag {
      vertical-align: middle;
    }
  }
  .msrp {
    color: $price-color;
    font-size: 14px;
    font-weight: 600;
    margin-right: 6px;
  }
  .text {
    font-size: 12px;
    color: #666;
  }
}
.checkbox {
  background: white;
  border-radius: 50%;
  position: absolute;
  right: -6px;
  top: -6px;
}
.goods-recomend {
  margin-top: 10px;
  padding: 6px 10px;
  line-height: 18px;
  background: #f9f9f9;
  border: 1px solid #ebedf2;
  border-radius: 4px;
}
.goods-item-type3 {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 9px;
  @include shadow();
  .goods-img-box {
    width: 121px;
    margin-right: 5px;
  }
  .goods-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // min-width:0;
    .name {
      display: block;
      color: $name-color;
      font-size: 14px;
      font-weight: bold;
      color: rgba(35, 35, 35, 1);
      line-height: 18px;
      // min-width:0;
    }
    .hot-sale {
      span {
        display: inline-block;
        font-size: 12px;
        color: rgba(61, 147, 255, 1);
        background: rgba(242, 249, 255, 1);
        border-radius: 3px;
        padding: 3px 6px;
        margin: 8px 0;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .price {
        overflow: hidden;
        p {
          line-height: 24px;
        }
        .value {
          color: $price-color;
          font-size: 16px;
          font-weight: 600;
        }
        .text {
          font-size: 11px;
          color: #666;
          font-weight: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>

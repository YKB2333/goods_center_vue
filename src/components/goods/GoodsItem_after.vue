<template>
  <div class="mb14 pointer">
    <div v-if="true" class="goods-card">
      <img :src="titleImage" class="title-image">
      <div>
        <div class="name van-ellipsis">{{ name }}</div>
        <div class="ellipsis">
          <span class="msrp">￥{{ Numeral(msrp).format('0,0.00') }}</span>
          <span class="text">建议零售价</span>
        </div>
      </div>
    </div>
    <!-- <div v-if="type === '2'" class="goods-item">
      <div class="goods-img-box"><img :src="titleImage"></div>
      <div class="goods-content">
        <p class="name ellipsis2">{{ name }}</p>
        <div class="hot-sale">
          <span>
            {{brandName}}
          </span>
        </div>
        <div class="bottom">
          <div class="price flex-1">
            <p class="text"><span>{{productDescribe}}</span></p>
            <p class="value"><span class="text pr6">建议零售价</span>￥{{ Numeral(msrp).format('0,0.00') }}</p>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import Numeral from 'numeral'

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
    productDescribe:{
      type: String
    },
    brandName:{
      type: String
    },
    msrp: {
      type: Number
    },
    validityStock: {
      type: Number
    }
  },
  data() {
    return {
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    Numeral
  }
}
</script>

<style lang="scss" scoped>
$name-color: #333333;
$price-color: #f71744;
@mixin shadow() {
  box-shadow: 0px 0px 10px 0px rgba(40, 109, 153, 0.1);
}
.goods-item{
  display: flex;
  align-items :center;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 9px;
  @include shadow();
  .goods-img-box{
    width: 121px;
    margin-right: 5px;
  }
  .goods-content{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top:10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
      // min-width:0;
    .name{
      display: block;
      color: $name-color;
      font-size: 14px;
      font-weight:bold;
      color:rgba(35,35,35,1);
      line-height:18px;
      // min-width:0;
    }
    .hot-sale{
      span{
        display: inline-block;
        font-size: 12px;
        color:rgba(61,147,255,1);
        background: rgba(242,249,255,1);
        border-radius: 3px;
        padding: 3px 6px;
        margin: 8px 0;
      }
    }
    .bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .price{
        overflow: hidden;
        p{
          line-height: 24px;
        }
        .value{
          color: $price-color;
          font-size: 16px;
          font-weight: 600;
        }
        .text{
          font-size: 11px;
          color: #666;
          font-weight: normal;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      .detail-btn{
        width: 105px;
        height: 46px;
        position: relative;
        bottom: -6px;
        cursor: pointer;
      }
    }
  }
}
.goods-card{
  padding: 20px 14px;
  @include shadow();
  text-align: center;
  border-radius: 6px;
  .title-image{
    width: 100%;
    max-width: 200px;
    margin-bottom: 15px;
  }
  .name{
    color: $name-color;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .msrp{
    color: $price-color;
    font-size: 14px;
    font-weight: 600;
    margin-right: 6px;
  }
  .text{
    font-size: 12px;
    color: #666;
  }
}
</style>

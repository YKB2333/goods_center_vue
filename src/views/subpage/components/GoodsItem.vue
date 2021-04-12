<template>
  <div class="goods-item">
    <div class="goods-img-box"><img :src="imgUrl"></div>
    <div class="goods-content">
      <p class="name ellipsis2">{{ name }}</p>
      <div class="hot-sale" v-if="salesVolume">
        <img :src="require('@/assets/images/hot-sale.png')" width="14">
        <span>热销{{ salesVolume }}</span>
      </div>
      <div class="bottom">
        <div class="price">
          <p class="value">￥{{ msrp }}</p>
          <p class="text">建议零售价</p>
        </div>
        <img :src="require('@/assets/images/view_detail_btn.png')" alt="查看详情" class="detail-btn">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsItem',
  components: {},
  props: {
    imgUrl: {
      type: String
    },
    name: {
      type: String
    },
    msrp: {
      type: Number
    },
    salesVolume: {
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
  methods: {}
}
</script>

<style lang="scss" scoped>
$name-color: #333333;
$price-color: #f71744;
@mixin shadow() {
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
}
.goods-item{
  margin-bottom: 10px;
  display: flex;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 14px;
  @include shadow();
  .goods-img-box{
    width: 105px;
    margin-right: 10px;
  }
  .goods-content{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name{
      color: $name-color;
      font-size: 13px;
    }
    .hot-sale{
      color: #666;
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-top: 4px;
      img{
        margin-right: 4px;
      }
    }
    .bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .price{
        .value{
          color: $price-color;
          font-size: 16px;
          font-weight: 600;
        }
        .text{
          font-size: 12px;
          color: #666;
        }
      }
      .detail-btn{
        width: 105px;
        height: 46px;
        position: relative;
        bottom: -6px;
      }
    }
  }
}
</style>

<template>
  <div class="rank-goods-wrapper">
    <div class="text-box van-hairline--right" @click="onMoreClick">
      <div class="title">
        <span>{{ title }}</span>
        <p class="bar" :style="{ backgroundColor: barColor }"></p>
      </div>
      <div class="label">{{ label }}</div>
    </div>
    <div class="goods-list">
      <div class="item" v-for="(item, index) in goods" :key="index" @click="onGoodsClick(item)">
        <div class="w-h70 relative">
          <img :src="item.titleImage || require('@/assets/images/logo.png')" class="w-h-full">
          <img :src="require('@/assets/images/sale_out.png')" v-if="item.outStockType == '3'" class="pos-center w-h54" alt="">
          <img :src="require('@/assets/images/eplenishment.png')" v-if="item.outStockType == '2'" class="pos-center w-h54" alt="">
          <img :src="require('@/assets/images/arrival.png')" v-if="item.outStockType == '1'" class="pos-center w-h54" alt="">
        </div>
        <p class="ellipsis">{{ item.name }}</p>
      </div>
      <div class="more">
        <span @click="onMoreClick">更多</span>
        <img :src="require('@/assets/images/rank-more-arrow.png')">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaleRank',
  props: {
    title: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    goods: {
      type: Array,
      required: true
    },
    barColor: {
      type: String,
      required: true
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
    onMoreClick() {
      this.$emit('more')
    },
    onGoodsClick(item){
      this.$emit('goods', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.rank-goods-wrapper{
  width: 100%;
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
  padding: 12px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  .text-box{
    width: 104px;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-right: 12px;
    .title{
      align-self: flex-start;
      font-size: 14px;
      font-weight: 600;
      color: #090909;
      position: relative;
      cursor: pointer;
      span{
        position: relative;
        z-index: 2;
      }
      .bar{
        height: 6px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
    .label{
      font-size: 12px;
      color: #666;
    }
  }
  .goods-list{
    flex: 1;
    display: flex;
    overflow-x: auto;
    .item{
      color: #090909;
      font-size: 12px;
      width: 75px;
      margin-right: 12px;
      position: relative;
      cursor: pointer;
      p{
        margin-top: 12px;
      }
    }
    .more{
      display: flex;
      align-items: center;
      cursor: pointer;
      span{
        color: #090909;
        font-size: 12px;
        white-space: nowrap;
        margin-right: 4px;
      }
      img{
        width: 10px;
        height: 10px;
      }
    }
  }
}
</style>

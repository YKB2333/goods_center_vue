<template>
  <div class="goods-recommend-wrapper">
    <div class="left">
      <div class="title">{{ title }}</div>
      <div class="go" :style="{backgroundColor: iconColor}">
        <span>GO</span>
        <img :src="require('@/assets/images/go-arrow.png')" width="6">
      </div>
    </div>
    <div class="goods-img">
      <img :src="imgUrl || require('@/assets/images/logo.png')">
    </div>
  </div>
</template>

<script>
// 商品展示-推荐类型样式
export default {
  name: 'GoodsRecommend',
  props: {
    title: {
      type: String,
      required: true
    },
    imgUrl: {
      type: String
    },
    iconColor: {
      type: String
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
  }
}
</script>

<style lang="scss" scoped>
.goods-recommend-wrapper{
  display: flex;
  padding: 0 8px;
  .left{
    max-width: 58px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title{
      font-size: 14px;
      color: #090909;
      font-weight: 600;
    }
    .go{
      color: #ffffff;
      width: 38px;
      height: 18px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 8px;
      span{
        font-size: 11px;
      }
      img{
        margin-left: 2px;
      }
    }
  }
  .goods-img{
    flex: 1;
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
</style>

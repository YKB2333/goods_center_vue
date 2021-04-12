<template>
  <div class="same-canal-wrapper">
    <img :src="icon" width="115" height="122" class="mr10 pointer" @click="onMoreClick">
    <div class="goods-list">
      <van-row gutter="15">
        <van-col span="12" v-for="(item, index) in goods" :key="index" class="item" @click="onGoodsClick(item)">
          <img :src="item.titleImage || require('@/assets/images/logo.png')" style="max-width: 95px; cursor: pointer;">
          <p class="ellipsis goods-name">{{ item.name }}</p>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SameCanal',
  props: {
    icon: {
      type: String,
      required: true
    },
    goods: {
      type: Array,
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
    onGoodsClick(item) {
      this.$emit('goodsClick', item)
    },
    // onMoreClick
    onMoreClick() {
      this.$emit('more')
    }
  }
}
</script>

<style lang="scss" scoped>
.same-canal-wrapper{
  width: 100%;
  box-shadow: 0px 0px 21px 0px rgba(40, 109, 153, 0.1);
  padding: 12px;
  display: flex;
  border-radius: 6px;
  align-items: center;
  .goods-list{
    flex: 1;
    .item{
      text-align: center;
      .goods-name{
        font-size: 12px;
        color: #090909;
        margin-top: 12px;
      }
    }
  }
}
</style>
<style lang="scss">
</style>

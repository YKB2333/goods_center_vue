<template>
  <div id="product-list-page" ref="page">
    <goods-search 
      placeholder="商品名称/商品条码/规格编码/品牌/分类"
      v-model="searchVal"
      @search="onSearch"
      @cancel="onCancelSearch"
    />
    <goods-list 
      ref="goods-list"
      orderVisible
      downLoadVisible
    />
  </div>
</template>

<script>
import GoodsSearch from '@/components/GoodsSearch'
import { savePosition } from '@/mixins'
import GoodsList from '@/components/goods/List'

export default {
  name: 'ProductList',
  components: { GoodsSearch, GoodsList },
  mixins: [new savePosition()],
  data() {
    return {
      searchVal: '', // 搜索值
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    onSearch() {
      this.$refs['goods-list'].setSearchVal(this.searchVal)
    },
    onCancelSearch() {
      this.$refs['goods-list'].setSearchVal('')
    }
  }
}
</script>

<style lang="scss" scoped>
#product-list-page{
  .fixed-tabs{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }
}
</style>

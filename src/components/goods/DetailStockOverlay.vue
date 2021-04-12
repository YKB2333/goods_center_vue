<template>
  <van-overlay class-name="filter" :show="value" @click="onClick" z-index="100">
    <!-- <div class="bg-white mb14 stock">
      <area-title title="仓库库存">
        <div slot="right" class="fs13 color666 center row">
          <span class="dot-red ml10 mr6">可发货库存：0</span>
          <van-icon name="arrow" />
        </div>
      </area-title>
    </div>-->
    <div class="guide-wapper">
      <img class="drop-down" :src="require('@/assets/images/good/stock_guide/drop_down.png')" />
      <img class="stock-click" :src="require('@/assets/images/good/stock_guide/stock_click.png')" />
      <div class="stock">
        <img :src="require('@/assets/images/good/stock_guide/stock.png')" />
        <img class="btn mt60 mb50" :src="require('@/assets/images/good/btn.png')" />
      </div>
    </div>
  </van-overlay>
</template>

<script>
import AreaTitle from '@/components/AreaTitle'

export default {
  name: 'DetailStockOverlay',

  components: { AreaTitle },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onClick() {
      this.$emit('onSubmit', 'goodsStockGuide')
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.guide-wapper {
  height: 100%;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: auto;
  .drop-down {
    position: absolute;
    top: 101px;
    left: 44px;
    width: 141px;
  }
  .stock-click {
    position: absolute;
    top: 281px;
    right: 16px;
    width: 141px;
  }
  .stock {
    position: absolute;
    top: 376px;
    margin: 0 6px;
    text-align: center;
  }
  .btn {
    // position: absolute;
    width: 150px;
    // left: 114px;
    // bottom: 72px;
  }
}
</style>
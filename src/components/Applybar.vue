<template>
  <div id="apply-bar" class="van-hairline--top">
    <div class="content-wrapper">
      <!-- <div class="customer" @click="$emit('service')">
        <img :src="require('@/assets/images/customer_icon.png')" width="29" height="24">
      </div>-->
      <div class="row plr8">
        <div class="pointer text-center plr6" @click="$emit('service')">
          <van-icon :name="require('@/assets/images/detail_icon_kefu@2x.png')" class="cart-icon" />
          <p class="fs10" style="color: #666;">品牌负责人</p>
        </div>
        <!-- <div class="ml14 pointer text-center" @click="$emit('material')">
          <img :src="require('@/assets/images/detail_icon_sucai@2x.png')" width="25" />
          <p class="fs10" style="color: #666;">资料库</p>
        </div>-->
        <div class="pl8 pr6 pointer text-center" @click="$emit('list')">
          <!-- <img :src="require('@/assets/images/cart.png')" width="25"> -->
          <van-icon
            :name="require('@/assets/images/good/applybar/apply_list.png')"
            :badge="countText"
            class="cart-icon"
          />
          <p class="fs10" style="color: #666;">申领清单</p>
        </div>
      </div>
      <div class="btns">
        <div class="aplly plain" @click="$emit('apply')">加入申领清单</div>
        <!-- <div class="list" @click="$emit('list')">样品申请清单</div> -->
        <div class="plr4 ptb4 ml4">
          <div class="aplly" @click="$emit('material')">资料库</div>
        </div>
      </div>
      <!-- <div class="btns">
      </div>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Applybar',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['applySkuList']),
    countText() {
      if (this.applySkuList && this.applySkuList.length > 0) {
        let count = this.applySkuList.reduce(
          (prev, curr) => prev + curr.quantity,
          0
        )
        return count > 99 ? '99+' : count
      }
      return ''
    },
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
#apply-bar {
  background-color: #ffffff;
  height: 63px;
  padding: 7px 0;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  .content-wrapper {
    display: flex;
    height: 100%;
    align-items: center;
    .pointer {
      padding: 5px 0;
    }
    .btns {
      flex: 1;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding-left: 10px;
      padding-right: 10px;
      & > div {
        width: 100%;
        // padding: 12px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .aplly {
        width: 100%;
        height: 35px;
        background-color: #3d93ff;
        color: #ffffff;
        border-radius: 19px;
        line-height: 35px;
        text-align: center;
        border: 1px solid rgba(61, 147, 255, 1);
        &.plain {
          background: #f2f9ff;
          border: 1px solid #3d93ff;
          color: #3d93ff;
        }
      }
      .aplly + .aplly {
        margin-left: 7px;
      }
      .list {
        background: rgba(242, 249, 255, 1);
        border: 1px solid rgba(61, 147, 255, 1);
        color: #3d93ff;
      }
    }
  }
  .cart-icon {
    width: 25px;
    height: 25px;
    img {
      width: 100%;
      height: 100%;
    }
    .van-info {
      top: 4px;
      right: 4px;
    }
  }
}
</style>

<template>
  <van-overlay :show="value" @click="handleOverlayClick" z-index="100">
    <div>
      <img class="overlay-btn" :src="require('@/assets/images/good/btn.png')" alt />
      <img class="overlay-fz" :src="require('@/assets/images/good/fz.png')" alt />
      <img class="overlay-zl" :src="require('@/assets/images/good/zl.png')" alt />
      <div id="apply-bar">
        <div class="content-wrapper">
          <div class="row plr8">
            <div class="pointer text-center plr6 show bg-white">
              <van-icon
                :name="require('@/assets/images/detail_icon_kefu@2x.png')"
                class="cart-icon"
              />
              <p class="fs10" style="color: #666;">品牌负责人</p>
            </div>
            <div class="pl8 pr6 pointer text-center hide">
              <van-icon
                :name="require('@/assets/images/good/applybar/apply_list.png')"
                class="cart-icon"
              />
              <p class="fs10" style="color: #666;">申领清单</p>
            </div>
          </div>
          <div class="btns">
            <div class="aplly plain hide">加入申领清单</div>
            <div class="plr4 ptb4 ml4 show">
              <div class="aplly">资料库</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>

<script>
export default {
  name: 'DetailOverlay',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },

  methods: {
    handleOverlayClick() {
      this.$emit('onSubmit', 'goodsDetailGuide')
      // localStorage.setItem('isShowdetailTip', true)
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay-btn {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 150px;
  transform: translate(-50%, -50%);
}
.overlay-fz {
  position: fixed;
  width: 165px;
  bottom: 72px;
  left: 0px;
}
.overlay-fz-btn {
  position: fixed;
  width: 60px;
  left: 12px;
  bottom: 8px;
}
.overlay-zl {
  position: fixed;
  width: 129px;
  bottom: 70px;
  right: 0px;
}
.overlay-zl-btn {
  position: fixed;
  width: 120px;
  bottom: 5px;
  right: 6px;
}

#apply-bar {
  // background-color: #ffffff;
  height: 63px;
  padding: 7px 0;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  .hide {
    opacity: 0;
  }
  .show {
    border-radius: 4px;
  }
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
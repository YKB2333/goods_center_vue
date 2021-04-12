<template>
  <div id="mine-page" class="bgcolor min-h-full">
    <div class="background">
      <!-- <img :src="require('@/assets/images/mine/background.jpg')" alt=""> -->
    </div>
    <div class="user-card">
      <div class="avatar">
        <img :src="userInfo && userInfo.avatar || require('@/assets/images/logo.png')" alt />
      </div>
      <p class="name">{{ userInfo && userInfo.name }}</p>
      <p class="apartment">部门：{{ userDepart && userDepart.name }}</p>
      <div class="item-wrapper">
        <div class="item" @click="alert">
          <p class="num">0</p>
          <p class="text">商品收藏</p>
          <p class="line"></p>
        </div>
        <div class="item" @click="alert">
          <p class="num">0</p>
          <p class="text">品牌收藏</p>
          <p class="line"></p>
        </div>
        <div class="item" @click="alert">
          <p class="num">0</p>
          <p class="text">浏览历史</p>
        </div>
      </div>
    </div>
    <div style="margin-top: -70px; overflow: hidden;">
      <van-grid :border="false">
        <van-grid-item to="/apply">
          <img :src="require('@/assets/images/mine/apply.png')" slot="icon" class="grid-item-icon" />
          <p slot="text" class="grid-item-text">申领清单</p>
        </van-grid-item>
        <van-grid-item :to="{ path: '/attachment' }">
          <img
            :src="require('@/assets/images/mine/attachment.png')"
            slot="icon"
            class="grid-item-icon"
          />
          <p slot="text" class="grid-item-text">全部附件</p>
        </van-grid-item>
        <!-- 品牌类型附件 -->
        <van-grid-item :to="{ path: '/attachment', query: { attaType: 2 } }">
          <img
            :src="require('@/assets/images/mine/brandFile.png')"
            slot="icon"
            class="grid-item-icon"
          />
          <p slot="text" class="grid-item-text">品牌附件</p>
        </van-grid-item>
        <!-- 商品类型附件 -->
        <van-grid-item :to="{ path: '/attachment', query: { attaType: 1 } }">
          <img
            :src="require('@/assets/images/mine/icon_goods_file.png')"
            slot="icon"
            class="grid-item-icon"
          />
          <p slot="text" class="grid-item-text">商品附件</p>
        </van-grid-item>
      </van-grid>
      <van-grid :border="false" class="mt14">
        <!-- <van-grid-item @click="goFindCustomer"> -->
        <van-grid-item @click="alert">
          <img
            :src="require('@/assets/images/mine/customer.png')"
            slot="icon"
            class="grid-item-icon"
          />
          <p slot="text" class="grid-item-text">我的客户</p>
        </van-grid-item>
        <van-grid-item :to="{ path: '/message' }">
          <img
            :src="require('@/assets/images/mine/message.png')"
            slot="icon"
            class="grid-item-icon"
          />
          <p slot="text" class="grid-item-text">留言板</p>
        </van-grid-item>
        <van-grid-item @click="$store.dispatch('openEnterpriseChat')">
          <img :src="require('@/assets/images/mine/help.png')" slot="icon" class="grid-item-icon" />
          <p slot="text" class="grid-item-text">帮助与客服</p>
        </van-grid-item>
        <van-grid-item :to="{ path: '/offer' }">
          <!-- <van-grid-item @click="$store.dispatch('openEnterpriseChat')"> -->
          <img
            :src="require('@/assets/images/icon_goods_info.png')"
            slot="icon"
            class="grid-item-icon"
          />
          <p slot="text" class="grid-item-text">商品资料</p>
        </van-grid-item>
      </van-grid>
      <div class="link-wrapper">
        <div class="title van-hairline--bottom">常用功能</div>
        <van-cell
          is-link
          :icon="require('@/assets/images/mine/attachment.png')"
          @click="goToPath('toReview')"
        >
          <span slot="title">商品复核</span>
        </van-cell>
        <van-cell
          is-link
          :icon="require('@/assets/images/mine/attachment.png')"
          @click="goToPath('stock')"
        >
          <span slot="title">当日库存</span>
        </van-cell>
        <van-cell
          is-link
          :icon="require('@/assets/images/mine/link-customer-center.png')"
          @click="goAppHome('customer')"
        >
          <!-- <van-cell is-link :icon="require('@/assets/images/mine/link-customer-center.png')" @click="alert"> -->
          <span slot="title">客户中心</span>
        </van-cell>
        <van-cell
          is-link
          :icon="require('@/assets/images/mine/link-supplier.png')"
          @click="goAppHome('supplier')"
        >
          <span slot="title">供应商中心</span>
        </van-cell>
        <van-cell
          is-link
          :icon="require('@/assets/images/mine/link-history.png')"
          @click="goToPath('version')"
        >
          <span slot="title">历史版本</span>
        </van-cell>
        <van-cell is-link :icon="require('@/assets/images/mine/link-group.png')" @click="alert">
          <span slot="title">集团介绍</span>
        </van-cell>
        <van-cell
          is-link
          :icon="require('@/assets/images/mine/link-customer-activity.png')"
          @click="alert"
        >
          <span slot="title">客户活动档期</span>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { savePosition } from '@/mixins'
import { getCurrentUser, deptById } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'Mine',
  mixins: [new savePosition()],
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['userInfo', 'userDepart'])
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.$store.commit('SHOW_LOADING')
        await this.getUser()
        if (!this.userDepart) {
          if (this.userInfo.departIds && this.userInfo.departIds[0]) {
            deptById(this.userInfo.departIds[0]).then((res) => {
              console.log('部门', res)
              this.$store.commit('SET_USER_DEPART', res)
            })
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.$store.commit('SHOW_LOADING', false)
      }
    },
    getUser() {
      return new Promise((resolve, reject) => {
        getCurrentUser()
          .then((res) => {
            this.$store.commit('SET_USER_INFO', res)
            resolve()
          })
          .catch((error) => {
            reject()
          })
      })
    },
    alert() {
      this.$dialog
        .alert({
          message: '敬请期待'
        })
        .then(() => {
          // on close
        })
    },
    goAppHome(app) {
      window.open(`${this.$config.otherAppLogin[app]}`, '_blank')
    },
    goFindCustomer() {
      let customer = this.$config.otherAppLogin['customer']
      window.open(`${customer}&jump=/findCustomer`, '_blank')
      // window.open(`${this.$config.otherAppLogin[app]}`, '_blank')
    },
    goToPath(type) {
      if (type === 'stock') {
        this.$router.push({
          path: '/stockFile'
        })
      } else if (type === 'toReview') {
        this.$router.push({
          path: '/to-review'
        })
      } else if (type === 'version') {
        this.$router.push({
          path: '/version'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#mine-page {
  .background {
    background: url('~@/assets/images/mine/background.jpg') no-repeat center;
    height: 190px;
  }
  .user-card {
    background-color: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(40, 109, 153, 0.1);
    border-radius: 8px;
    width: 90%;
    max-width: 342px;
    position: relative;
    top: -90px;
    margin: 0 auto;
    padding-top: 50px;
    .avatar {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      top: -40px;
      padding: 6px;
      background-color: #fff;
      border-radius: 50%;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
    .name {
      color: #090909;
      font-size: 16px;
      margin-bottom: 10px;
      margin-top: 6px;
      text-align: center;
      font-weight: 600;
    }
    .apartment {
      color: #666;
      font-size: 14px;
      text-align: center;
    }
    .item-wrapper {
      display: flex;
      padding: 20px 30px;
      .item {
        flex: 1;
        text-align: center;
        position: relative;
        cursor: pointer;
        .num {
          font-size: 20px;
          color: #3d93ff;
        }
        .text {
          font-size: 13px;
          color: #666;
          margin-top: 4px;
        }
        .line {
          position: absolute;
          display: inline-block;
          height: 20px;
          width: 1px;
          background-color: #e9ebf0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .grid-item-icon {
    width: 28px;
  }
  .grid-item-text {
    font-size: 13px;
    color: #666;
    margin-top: 10px;
  }
  .link-wrapper {
    background-color: #ffffff;
    margin-top: 15px;
    margin-bottom: 20px;
    .title {
      color: #090909;
      font-size: 16px;
      padding: 20px 15px;
      font-weight: 600;
    }
    /deep/ .van-cell__left-icon {
      font-size: 18px;
      margin-right: 10px;
    }
    /dee/ .van-cell__title {
      color: #666;
      font-size: 14px;
    }
    /deep/ .van-cell__right-icon {
      color: #d2d5dd;
    }
  }
}
/deep/ .van-icon {
  display: flex;
  align-items: center;
}
</style>
<style lang="scss">
</style>

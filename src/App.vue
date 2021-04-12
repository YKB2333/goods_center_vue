<template>
  <div id="app" :class="{'pb50': showTabbar}">
    <!-- <transition :name="transitionName"> -->
      <keep-alive :include="cachePages">
        <router-view :key="$route.fullPath"></router-view>
      </keep-alive>
    <!-- </transition> -->
    <!-- 底部导航栏 -->
    <van-tabbar v-model="tabActive" v-show="showTabbar" :active-color="$config.mainColor" :z-index="999" safe-area-inset-bottom>
      <van-tabbar-item v-for="item in tabbar" :key="item.id" @click="onTabItemClick(item)">
        <span>{{ item.name }}</span>
        <img slot="icon" slot-scope="props" :src="props.active ? item.iconActive : item.icon">
      </van-tabbar-item>
    </van-tabbar>
    <loading :show="loading.show" :text="loading.text"></loading>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Loading  from "@/components/loading";
import { getUrlParam, delUrlParam } from '@/utils'
import { testToken, headersTokenKey } from '@/config'
import { getCurrentUser,deptById } from '@/api/user'

export default {
  name: "app",
  components: { Loading },
  data() {
    return {
      transitionName: "slide-right",
      tabbar: [
        {
          id: 1,
          name: '首页',
          path: '/home',
          icon: require('@/assets/images/tabbar/home.png'),
          iconActive: require('@/assets/images/tabbar/home-active.png')
        },
        { 
          id: 2,
          name: '消息',
          path: '/message',
          icon: require('@/assets/images/tabbar/message.png'),
          iconActive: require('@/assets/images/tabbar/message-active.png')
        },
        {
          id: 3,
          name: '分类',
          path: '/category',
          icon: require('@/assets/images/tabbar/category.png'),
          iconActive: require('@/assets/images/tabbar/category-active.png')
        },
        {
          id: 4,
          name: '成长发现',
          path: '/growthDiscovery',
          icon: require('@/assets/images/tabbar/growth-discovery.png'),
          iconActive: require('@/assets/images/tabbar/growth-discovery-active.png')
        },
        {
          id: 5,
          name: '我的',
          path: '/mine',
          icon: require('@/assets/images/tabbar/mine.png'),
          iconActive: require('@/assets/images/tabbar/mine-active.png')
        }
      ],
      showTabbar: false
    }
  },
  computed: {
    ...mapGetters([
      'cachePages',
      'loading'
    ]),
    tabActive: {
      get() {
        let index = this.tabbar.findIndex((value, index, arr) => {
          return value.path === this.$route.path
        })
        return index
      },
      set(val) {
        // console.log(val);
      }
    }
  },
  methods: {
    onTabItemClick(item) {
      if (item.id === 2) {
        this.$store.dispatch('openCustService')
      } else {
        this.$router.replace({
          path: item.path
        })
      }
    }
  },
  watch: {
    $route(to, from) {
      let isBack = this.$router.isBack; //  监听路由变化时的状态为前进还是后退
      if (isBack) {
        this.transitionName = "slide-right"
      } else {
        this.transitionName = "slide-left"
      }
      this.$router.isBack = false

      // 监听路由，判断是否显示底部导航
      let paths = this.tabbar.filter(item => item.id !== 2).map(item => item.path)
      // console.log(paths)
      if (paths.includes(to.path)) {
        this.showTabbar = true
      } else {
        this.showTabbar = false
      }
    }
  },
  beforeCreate() {
    if (process.env.NODE_ENV === "development") {
      // 开发环境下使用后门token
      this.$store.commit("SET_TOKEN", this.$config.testToken);
    }
    if (this.$store.getters.token) {
      // 进行微信签名(url传参为：http://xxx.com/index.html)
      this.$store.dispatch('weixinConfig', location.href.split('#')[0]).then(res => {
        // wx.ready(() => {
        //   wx.hideOptionMenu()
        // })
      })
      getCurrentUser().then(res => {
        this.$store.commit('SET_USER_INFO', res)
        if (this.$store.getters.userInfo.departIds && this.$store.getters.userInfo.departIds[0]) {
            deptById(this.$store.getters.userInfo.departIds[0]).then(depart => {
              console.info("部门123")
              this.$store.commit('SET_USER_DEPART', depart)
            })
          }
      })
    }
  },
  mounted() {
    window && (window.document.body.style.backgroundColor = "#e4ebf7")
  }
};
</script>

<style lang="scss">
@import '@/assets/scss/index.scss';
@import '@/assets/scss/app.scss';
</style>

<style lang="scss" scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  -webkit-transition: all 0.25s ease-out;
  transition: all 0.25s ease-out;
}
.slide-left-enter,
.slide-right-leave-to {
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0);
}
.slide-left-leave-to,
.slide-right-enter {
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
}

</style>



import Vue from 'vue'
import { HIDE_WX_MENU_LIST } from '@/const/wx'
import { baseURL, apiAgent } from '@/config'

Vue.mixin({
  mounted() {
    const key = 'wxMenuShareApp' // 页面data里的key值：wxMenuShareApp: { title: '', desc: '', imgUrl: '' }
    if (this.$parent && this.$parent.$options.name && this.$parent.$options.name.toLowerCase() === 'app') {
      wx.ready(() => {
        wx.showOptionMenu()
        wx.hideMenuItems({ menuList: HIDE_WX_MENU_LIST })
        if (this[key]) {
          this.$watch(key, (data) => {
            // console.log('watch', this.$options.name, data)
            wx.onMenuShareAppMessage({
              title: data.title || '', // 分享标题
              desc: data.desc || '', // 分享描述
              imgUrl: data.imgUrl || '', // 分享图标
              link: `${baseURL}/login?agent=${apiAgent}&jump=${this.$route.fullPath}`, // 分享链接
            })
          }, { deep: true, immediate: true })
        } else {
          wx.onMenuShareAppMessage({
            title: document.title,
            desc: '快来看看吧',
            link: `${baseURL}/login?agent=${apiAgent}&jump=${this.$route.fullPath}`, // 分享链接
          })
        }
      })
    }
  }
})
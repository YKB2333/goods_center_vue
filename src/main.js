import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import libs from './libs'
import * as filters from './filters'
import VideoPlayer from 'vue-video-player'
import VueClipboard  from 'vue-clipboard2'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import "swiper/css/swiper.min.css"
import '@/mixins/wx-share'

Vue.use(VueClipboard)
Vue.use(VideoPlayer)
Vue.use(libs, { router, store })
Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$maxNumber = 2147483647

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
Vue.use(Router);
import { projectName, reLoginUrl, headersTokenKey } from '@/config'
import { getUrlParam, getUrlParamAll, delUrlParam } from '@/utils'

// 添加返回函数
Router.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1);
};
// 导入modules文件夹里的所有路由
const files = require.context('./modules', false, /\.js$/);
let modules = [];
files.keys().forEach(key => {
  modules = modules.concat(files(key).default);
});
// 路由
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  ...modules
]

const router = new Router({
  mode: 'hash',
  routes: routes,
})


function isKeepAlive(route) {
  if (route.meta && route.meta.keepAlive) {
    store.commit("PUT_CACHE_PAGE", route.name);
  }
  if (route.children) {
    route.children.forEach(child => {
      isKeepAlive(child);
    });
  }
}
routes.forEach(item => {
  isKeepAlive(item);
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (from.meta.needCachePages && from.meta.needCachePages.includes(to.name)) {
    store.commit("PUT_CACHE_PAGE", from.name);
  } else if (from.meta.needCachePages) {
    store.commit("REMOVE_CACHE_PAGE", from.name);
  }
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      next()
    }, 100)
  } else {
    if (store.getters.token) {
      if (getUrlParam(location.href, 'jump')) {
        let target = ''
        let domain = location.href.split('?')[0] // 域名
        if (getUrlParam(location.href, 'jump')) { // 判断url地址是否有jump
          let jumpParam = getUrlParamAll(location.href, 'jump')
          target = `${domain}#${jumpParam}`
        } else {
          target = `${domain}#/home`
        }
        setTimeout(() => {
          location.replace(target)
        }, 100)
      } else {
        setTimeout(() => {
          next()
        }, 100)
      }
    } else {
      if (getUrlParam(location.href, headersTokenKey)) { // 判断url地址是否携带authorization
        let target = ''
        let token = getUrlParam(location.href, headersTokenKey) // 获取token
        store.commit('SET_TOKEN', token)
        let domain = location.href.split('?')[0] // 域名
        if (getUrlParam(location.href, 'jump')) { // 判断url地址是否有jump
          let jumpParam = getUrlParamAll(location.href, 'jump')
          target = `${domain}#${jumpParam}`
        } else {
          target = `${domain}#/home`
        }
        location.replace(target)
      } else {
        let jumpUrl = location.href.split('#')[1]
        if (jumpUrl && jumpUrl !== '/') {
          store.commit('SET_JUMPURL', jumpUrl)
        }
        location.replace(reLoginUrl)
      }
    }
  }
});
router.afterEach(to => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title + '-' + projectName
  } else {
    document.title = projectName
  }
});

export default router;

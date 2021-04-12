import Vue from 'vue';
import Axios from 'axios';
import CONFIG from '@/config';
import store from '@/store';
import { Toast } from 'vant';
import { Dialog } from 'vant';

const axios = Axios.create({
  baseURL: CONFIG.baseURL,
  // timeout: CONFIG.timeout,
  headers: {'Content-Type': 'application/json'}
});

let errorNoRespones = 0

// 请求拦截器
axios.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers[CONFIG.headersTokenKey] = store.getters.token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // console.log(response.headers)
    let headersAuth = CONFIG.headersTokenKey
    let lowercase = headersAuth.replace(headersAuth[0], headersAuth[0].toLowerCase())
    // axios里headers字段是小写
    let token = response.headers[headersAuth] || response.headers[lowercase]
    if (token) {
      console.log('更新token', token)
      store.commit("SET_TOKEN", token)
    }
    // console.log(response)
    if (response.status === 200 && response.data) {
      if (response.data.resultCode === '0') {
        return response.data.result
      } else {
        Toast(response.data.resultMsg)
        return Promise.reject(response.data.resultMsg)
      }
    } else {
      Toast(response.status)
      return Promise.reject(response.status)
    }
  }, 
  (error) => {
    console.log('error', error)
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      console.log('请求超时', error.code, error.message)
      Toast("请求超时")
      return Promise.reject('请求超时')
    } else {
      if (error.response) {
        console.log('error.response', error.response)
        let headersAuth = CONFIG.headersTokenKey
        let lowercase = headersAuth.replace(headersAuth[0], headersAuth[0].toLowerCase())
        // axios里headers字段是小写
        let token = error.response.headers[headersAuth] || error.response.headers[lowercase]
        if (token) {
          console.log('更新token', token)
          store.commit("SET_TOKEN", token)
        }
        if (error.response.status === 401) { // token过期
          // 删除token
          store.commit('SET_TOKEN', '')
          // 弹窗
          Dialog.alert({
            message: '正在进行企业微信授权'
          }).then(() => {
            // on close
            window.location.href = CONFIG.reLoginUrl
          })
          return Promise.reject('登录过期')
        } else if (error.response.status === 404) {
          Toast('404')
          return Promise.reject('404')
        } else {
          if (error.response.data.resultMsg) {
            Toast(error.response.data.resultMsg)
            return Promise.reject(error.response.data.resultMsg)
          } else {
            if (error.response.data.message.includes('Subject does not have role')) {
              console.log(error.response.data.message)
              // if (error.response.data.message == 'Subject does not have role [download_protect_atta]') {
              //   Dialog({message: '无下载权限'})
              // }
              return Promise.reject({ code: 403, msg: '无操作权限' })
            } else {
              Toast(error.response.data.message)
              return Promise.reject(error.response.data.resultMsg)
            }
          }
        }
      } else {
        console.log('errorNoRespones===', errorNoRespones)
        let tips = errorNoRespones === 0 ? '加载中': '网络连接出错'
        // Toast(tips)
        errorNoRespones++
        return Promise.reject(tips)
      }
    }
  }
);


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

function get(url,params = {}){
  return new Promise((resolve,reject) => {
    axios.get(url, {
      params: params
    })
    .then(response => {
      resolve(response)
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
    .then(response => {
      resolve(response)
    },err => {
      reject(err)
    })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

function deleteHttp(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.delete(url, { data: data})
    .then(response => {
      resolve(response);
    },err => {
        reject(err)
      })
    })
  }
  
  /**
   * 封装put请求
   * @param url
   * @param data
   * @returns {Promise}
   */
  
  function put(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err)
      })
    })
  }
  Vue.prototype.$get = get;
  Vue.prototype.$post = post;
  Vue.prototype.$put = put; 
  Vue.prototype.$deleteHttp = deleteHttp;
  Vue.prototype.$http = axios;
  export default axios
  
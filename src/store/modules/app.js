import types from '../types.js';
import { serviceMan, customerMan } from '@/config'

export default {
  state: {
    cachePages: [],
    loading: {
      show: false,
      text: ''
    },
    searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],
    // 素材编辑信息
    materialInfo: JSON.parse(localStorage.getItem('materialInfo')) || null,
  },
  getters: {},
  mutations: {
    [types.PUT_CACHE_PAGE](state, page) {
      if (!state.cachePages.includes(page)) {
        state.cachePages.push(page);
      }
    },
    [types.REMOVE_CACHE_PAGE](state, page) {
      if (state.cachePages.indexOf(page) > -1) {
        state.cachePages.splice(state.cachePages.indexOf(page), 1);
      }
    },
    [types.SHOW_LOADING](state, param) {
      if (param === undefined) {
        state.loading.show = true;
      } else {
        if (typeof param === 'boolean') {
          state.loading.show = param;
          state.loading.text = '';
        } else if (typeof param === 'string') {
          state.loading.show = true;
          let loadingText = param;
          state.loading.text = loadingText;
        }
      }
    },
    [types.SET_SEARCH_HISTORY](state, val) {
      if (Array.isArray(val)) {
        state.searchHistory = []
        localStorage.removeItem('searchHistory')
      } else {
        state.searchHistory.unshift(val)
        localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
      }
    },
    SET_MATERIAL_INFO(state, info) {
      state.materialInfo = info
      localStorage.setItem('materialInfo', JSON.stringify(info))
    }
  },
  actions: {
    openEnterpriseChat({ commit }, payload = { brandName: '', directorId: '' }) {
      const { brandName, directorId } = payload;
      console.log('directorId', directorId);
      console.log('openEnterpriseChat', brandName)
      return new Promise((resolve, reject) => {
        let userId = directorId || serviceMan.defaultUserId
        // if (!brandName && serviceMan.brandContactUsers && serviceMan.brandContactUsers.length) {
        //   serviceMan.brandContactUsers.forEach(item => {
        //     if (item.brandName === brandName) {
        //       userId = item.userId
        //     }
        //   })
        // }
        console.log('群聊用户ID', userId)
        wx.openEnterpriseChat({
          userIds: userId,    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
          groupName: '',  // 必填，会话名称。单聊时该参数传入空字符串""即可。
          success: res => {
            // 回调
            resolve(res)
          },
          fail: res => {
            reject(res)
          }
        })
      })
    },
    openCustService() {
      console.log('openCustService')
      return new Promise((resolve, reject) => {
        let va = customerMan.map(item => item.value).join(';')
        wx.openEnterpriseChat({
          userIds: va, //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
          groupName: '客服', // 必填，会话名称。单聊时该参数传入空字符串""即可。
          success: function (res) {
            // 回调
            resolve()
          },
          fail: function (res) {
            if (res.errMsg.indexOf('function not exist') > -1) {
              alert('版本过低请升级')
            }
            reject()
          }
        })
      })
    },
  }
}
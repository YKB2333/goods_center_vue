import types from '../types.js';
import { Toast } from 'vant';
import { wxSignature } from '@/api/user'
import { weixin } from '@/config'

export default {
  state: {
    token: sessionStorage.getItem('goods_token') || '',
    applyList: localStorage.getItem('applyList') ? JSON.parse(localStorage.getItem('applyList')) : {},
    jumpUrl: localStorage.getItem('jumpUrl') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    userDepart: JSON.parse(localStorage.getItem('userDepart')) || null,
  },
  mutations: {
    [types.SET_TOKEN](state, token) {
      state.token = token;
      sessionStorage.setItem('goods_token', token);
    },
    [types.SET_JUMPURL](state, jumpUrl) {
      state.jumpUrl = jumpUrl;
      localStorage.setItem('jumpUrl', jumpUrl);
    },
    [types.ADD_APPLY_LIST](state, sku) {
      //获取localStorage中的申领清单信息
      let spuList = state.applyList;
      let skuList = new Array()
      if (spuList.hasOwnProperty(sku.spuId))
        skuList = spuList[sku.spuId]

      //判断sku是否已经存在清单中，存在则数量加1
      for (let item of skuList) {
        if (item.id == sku.id) {
          item.quantity += 1;
          console.log(item.id, '=========', item.quantity);
          localStorage.setItem('applyList', JSON.stringify(spuList));
          state.applyList = spuList
          return;
        }
      }

      //默认sku不存在清单中
      let item = { id: sku.id, quantity: 1 }
      skuList.push(item)
      spuList[sku.spuId] = skuList
      localStorage.setItem('applyList', JSON.stringify(spuList));
      state.applyList = spuList
      Toast.success('添加成功');
      console.log(sku.spuId, '：skuList=========', item.quantity);
    },
    [types.SUB_APPLY_GOODS](state, sku) {
      //获取localStorage中的申领清单信息
      let spuList = state.applyList;
      let skuList = new Array()
      if (spuList.hasOwnProperty(sku.spuId))
        skuList = spuList[sku.spuId]

      //判断sku是否已经存在清单中，存在则数量减1
      for (let item of skuList) {
        if (item.id == sku.id) {
          if (item.quantity == 1) {
            Toast('亲，数量已经不能再减了');
            return;
          }
          item.quantity -= 1;
          console.log(item.id, '=========', item.quantity);
          localStorage.setItem('applyList', JSON.stringify(spuList));
          state.applyList = spuList
          return;
        }
      }

      //默认sku不存在清单中
      let item = { id: sku.id, quantity: 1 }
      skuList.push(item)
      spuList[sku.spuId] = skuList
      localStorage.setItem('applyList', JSON.stringify(spuList));
      state.applyList = spuList
      console.log(sku.spuId, '：skuList=========', item.quantity);
    },
    [types.DEL_APPLY_GOODS](state, sku) {
      //获取localStorage中的申领清单信息
      let spuList = state.applyList;
      let skuList = new Array()
      if (spuList.hasOwnProperty(sku.spuId))
        skuList = spuList[sku.spuId]

      //判断sku是否存在清单，存在则移除
      let index = skuList.findIndex(o => {
        return o.id == sku.id;
      })
      if (index > -1) {
        if(skuList.length <= 1){
          delete spuList[sku.spuId]
        }
        skuList.splice(index, 1);
        localStorage.setItem('applyList', JSON.stringify(spuList));
        state.applyList = spuList
      }
      console.log('移除成功', state.applyList)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    SET_USER_DEPART(state, userDepart) {
      state.userDepart = userDepart
      localStorage.setItem('userDepart', JSON.stringify(userDepart))
    }
  },
  actions: {
    weixinConfig({ commit }, url) {
      return new Promise((resolve, reject) => {
        wxSignature(url).then(data => {
          wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: weixin.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业微信的corpID
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: weixin.jsApiList, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          })
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
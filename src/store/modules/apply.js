/**
 * 申领清单
 */
import lodash from 'lodash'

export default {
  state: {
    applySkuList: JSON.parse(localStorage.getItem('applySkuList')) || []
  },
  mutations: {
    SET_APPLY_SKU(state, item) {
      state.applySkuList.push(item)
      localStorage.setItem('applySkuList', JSON.stringify(state.applySkuList))
    },
    ADD_APPLY_QUANTIRY(state, { skuId, quantity }) {
      let targetIndex = state.applySkuList.findIndex(value => value.skuId === skuId)
      state.applySkuList[targetIndex].quantity += quantity
      localStorage.setItem('applySkuList', JSON.stringify(state.applySkuList))
    },
    DELETE_APPLY_SKU(state, skuIds) {
      console.log(state.applySkuList)
      let list = lodash.cloneDeep(state.applySkuList)
      skuIds.forEach(id => {
        list.forEach((item, index) => {
          if (id === item.skuId) {
            list.splice(index, 1)
          }
        })
      })
      state.applySkuList = list
      console.log(state.applySkuList)
      localStorage.setItem('applySkuList', JSON.stringify(list))
    }
  },
  actions: {
    /**
     * 页面调用
     * this.$store.dispatch('addApplySku', this.currentSku)
        .then(res => {
          this.$toast.success(res.msg)
        })
     */ 
    addApplySku({ commit, state }, sku) {
      return new Promise((resolve, reject) => {
        let currentList = lodash.cloneDeep(state.applySkuList)
        // 判断sku是否已经存在清单中，存在则数量加1，不存在则添加sku
        let targetIndex = currentList.findIndex(value => value.skuId === sku.id)
        if (targetIndex === -1) { // 不存在
          commit('SET_APPLY_SKU', {
            spuId: sku.spuId,
            skuId: sku.id,
            quantity: 1
          })
          resolve({code: 1, msg: '添加成功'})
        } else { // 存在
          commit('ADD_APPLY_QUANTIRY', { skuId: sku.id, quantity: 1 })
          resolve({code: 2, msg: '数量+1'})
        }
      })
    }
  }
}
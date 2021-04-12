import axios from '../libs/http'

export function getSkuList(data) { // 获取sku列表
  return axios.post('/goods/sku/getSkuPager', data)
}

export function getSkuCostPrice(skuId) { // 获取sku成本价
  return axios.get(`/goods/sku/getCostPriceBySkuId?skuId=${skuId}`)
}

export function getTopSale(skuSn, pageSize) { // 获取热销排行
  return axios.get(`/goods/sku/getTopSale?code=${skuSn}&pageSize=${pageSize}`)
}

export function getSkuPager(data) {
  return axios.post(`/goods/sku/getSkuPager`, data)
}
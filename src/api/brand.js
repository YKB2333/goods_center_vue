import axios from '../libs/http'

export function getBrandList(data) { // 品牌列表
  return axios.post(`/goods/brand/getBrandPager`, data)
}

export function getBrandInfo(brandId) { // 根据品牌id获取品牌信息
  return axios.get(`/goods/brand/getOne/${brandId}`)
}

// 获取品牌关联的店铺列表
export const getBrandShopList = (brandId) => axios.get(`/goods/brand/getShopsByBrandId/${brandId}`)

// 获取所有的店铺销售渠道
export function getAllOnlineNames() { 
  return axios.get(`/goods/brand/getAllOnlineNames`)
}
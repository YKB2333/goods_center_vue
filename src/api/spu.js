import axios from '../libs/http'
import { apiAgent } from '../config'

export function spuSearch(data) { // 搜索spu
  return axios.post(`/goods/spu/search`, data)
}

export function spuSearch4Condition(data) {
  return axios.post(`/goods/spu/search4Condition`, data)
}

export function getSpuInfoById(spuId) { // 获取spu信息
  return axios.get(`/goods/spu/getOne/${spuId}`)
}

export function getSkuStockBySpuId(spuId) { // 根据spuId获取sku库存数据
  return axios.get(`/goods/spu/getSkuStockBySpuId/${spuId}`)
}

export function getSpuPager(data) {
  return axios.post(`/goods/spu/getSpuPager`, data)
}

export function getStockData(spuId) {
  return axios.get(`/goods/spu/getSkuStockBySpuId/${spuId}`)
}
//报价下载
export function exportSpu(data) {
  return axios.post(`/goods/spu/exportSpu?agent=${apiAgent}`,data)
}
// 下载历史
export function getReportAttachment(type) {
  return axios.post(`/goods/offerAttachment/getOfferAttachment/${type}`)
}
//分页获取下载历史
export function getOfferAttachmentPage(data){
  return axios.post(`/goods/offerAttachment/getOfferAttachmentPage`,data)
}
//获取销量
export function getSale(params) {
  return axios.post(`/goods/spu/report/orderSale?agent=${apiAgent}`,params)
}
//相似商品
export function getSpuRecommend(spuId,params) {
  return axios.post(`/goods/spu/getSpuRecommend/${spuId}`,params)
}
//获取NC渠道
export function getNcChannel() {
  return axios.get(`/nc-base-info/channel`)
}
//获取当月全渠道销量排行榜
export function getSalesRank(time) {
  return axios.get(`/goods/messagePush/getHotGoodsPageDetail/${time}`)
}
//获取关联标签
export function getSpuTag(spuId) {
  return axios.get(`/goods/spu/getSpuTag/${spuId}`)
}
//获取海报信息
export function getPoster(data) {
  return axios.post(`/goods/spu/getPoster`,data)
}

//下载商品图片信息
export function downloadPic(spuId) {
  return axios.get(`/goods/spu/downloadPic/${spuId}`)
}

//上传海报信息
export function uploadPoster(data) {
  return axios.post(`/goods/spu/uploadPoster`,data)
}

export function getPosterImage(data) {
  return axios.post(`/goods/spu/getPosterImage`,data)
}

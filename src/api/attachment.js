import axios from '../libs/http'

export function getBrandAttachment(brandId) { // 获取品牌附件
  return axios.get(`/goods/attachment/getByBrandId/${brandId}`)
}

export function download(isProtect, attaId) {
  let api = isProtect ? '/goods/attachment/protectDownload' : '/goods/attachment/freeDownload'
  return axios.get(`${api}/${attaId}`)
}

export function searchAttachment(data) {
  return axios.post(`/goods/attachment/search`, data)
}
export function getSpuAttachment(spuId) {  // 获取spu附件
  return axios.get(`/goods/attachment/getBySpuId/${spuId}`)
}

export function searchStockFile() {
  return axios.get(`/goods/stockFile/list`)
}


export function designAttachment(path) { // 设计资源分页
  return axios.get(`/goods/design-attachment/list?dir=${path}`)
}



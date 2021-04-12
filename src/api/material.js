import axios from '../libs/http'

export function checkPermission() { // 检查是否有权限
  return axios.get(`/goods/materialController/check`)
}

export function getMaterialList(spuId) { // 根据spuId获取素材列表
  return axios.get(`/goods/materialController/findMaterialList/${spuId}`)
}

export function addMaterial(data) {  // 添加素材
  return axios.post(`/goods/materialController/addMaterial`, data)
}

export function updateMaterial(data) { // 修改素材
  return axios.post(`/goods/materialController/updateMaterial`, data)
}

export function deleteMaterial(materialId) { // 删除素材
  return axios.delete(`/goods/materialController/deleteMaterial/${materialId}`)
}

export function uploadMaterailAtta (file) { // 文件上传
  let formData = new FormData()
  formData.append('file', file)
  return axios.post(`/uploadGoodsSc`, formData)
}
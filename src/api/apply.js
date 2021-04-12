import axios from '../libs/http'

export function apply(data) { // 申领接口
  return axios.post(`/goods/sample/apply`, data)
}

export function getChannelTypeList() { // 客户渠道类型
  return axios.get(`/goods/sample/custTypeList`)
}

export function getCustomerList(name) { // 搜索客户
  return axios.post(`/goods/sample/findCustName`, name)
}

export function getOAThreeSub() { // 获取所有公司/一二级部门
  return axios.get('/ecology-user/getOAThreeSub')
}

export function getGuideInfo() { // 指引信息查询接口
  return axios.get('/guide/goods/get')
}

export function submitGuide(pam) { // 指引信息确认
  return axios.put('/guide/goods/submit', pam)
}
import axios from '../libs/http'
import Vue from 'vue'
export function addInfoClick(infoId) { // 增加资讯点击数
  return axios.put(`/cms/info/addClick?id=${infoId}`)
}

export function getInfoById(infoId) { // 根据资讯ID获取资讯
  return axios.get(`/cms/info/getOne/${infoId}`)  
}

export function getInfoByCateId(cateId, data = {}) { // 获取栏目下的资讯列表
  return axios.post(`/cms/info/selectPage`, {
    pageIndex: 1,
    pageSize: Vue.prototype.$maxNumber,
    infoCategoryId: cateId,
    status: '1', // 状态:0待审,1已审,2删除
    orderStr: 'orderLevel desc',
    ...data
  })
}

export function getAttaListByInfoId(infoId) { // 根据资讯ID获取资讯附件
  return axios.get(`/cms/attachment/getByInfoId/${infoId}`)
}

export function getDateByCateId(infoId) { // 根据咨讯栏目id获取咨讯发布时间列表
  return axios.get(`/cms/info/getDate/${infoId}`)  
}

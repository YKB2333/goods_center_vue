import axios from '../libs/http'
import { apiAgent } from '../config'

export function noticePage(data) {
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/goods/msg/noticePage`, params)
}

export function noticeRead(id) {
  return axios.put(`/goods/msg/noticeRead/${id}`)
}

export function myMsgPage(data) {
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/goods/msg/myMsgPage`, params)
}

export function recMsgPage(data) {
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/goods/msg/recMsgPage`, params)
}

export function msgAdd(data) {
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/goods/msg/msgAdd`, params)
}

export function msgDetail(msgId) {
  return axios.get(`/goods/msg/msgDetail/${msgId}?agent=${apiAgent}`)
}

export function replyList(msgId) {
  return axios.get(`/goods/msg/replyList/${msgId}`)
}

export function replyAdd(data) {
  let params = {
    sysTag: apiAgent,
    ...data
  }
  return axios.post(`/goods/msg/replyAdd`, params)
}

export function msgDelete(msgId) {
  return axios.delete(`/goods/msg/msgDelete/${msgId}`)
}

export function replyDelete(replyId) {
  return axios.delete(`/goods/msg/replyDelete/${replyId}`)
}

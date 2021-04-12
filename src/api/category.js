import axios from '../libs/http'

export function getCategoryList(data) {
  return axios.post(`/goods/category/getCategoryPager`, data)
}
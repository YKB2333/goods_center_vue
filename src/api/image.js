import axios from '../libs/http'

export function getImageList(data) {
  return axios.post('/goods/images/getImagesPager', data)
}
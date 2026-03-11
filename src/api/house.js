import request from '@/utils/request'

export function getHousePage(params) {
  return request({ url: '/house/page', method: 'get', params })
}
export function saveHouse(data) {
  return request({ url: '/house', method: 'post', data })
}
export function updateHouse(data) {
  return request({ url: '/house', method: 'put', data })
}
export function deleteHouse(id) {
  return request({ url: `/house/${id}`, method: 'delete' })
}

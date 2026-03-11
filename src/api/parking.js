import request from '@/utils/request'

export function getParkingPage(params) {
  return request({ url: '/parking-space/page', method: 'get', params })
}
export function saveParking(data) {
  return request({ url: '/parking-space', method: 'post', data })
}
export function updateParking(data) {
  return request({ url: '/parking-space', method: 'put', data })
}
export function deleteParking(id) {
  return request({ url: `/parking-space/${id}`, method: 'delete' })
}

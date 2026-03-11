import request from '@/utils/request'

export function getBuildingPage(params) {
  return request({ url: '/building/page', method: 'get', params })
}
export function saveBuilding(data) {
  return request({ url: '/building', method: 'post', data })
}
export function updateBuilding(data) {
  return request({ url: '/building', method: 'put', data })
}
export function deleteBuilding(id) {
  return request({ url: `/building/${id}`, method: 'delete' })
}

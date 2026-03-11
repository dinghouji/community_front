import request from '@/utils/request'

export function getFacilityPage(params) {
  return request({ url: '/facility/page', method: 'get', params })
}
export function saveFacility(data) {
  return request({ url: '/facility', method: 'post', data })
}
export function updateFacility(data) {
  return request({ url: '/facility', method: 'put', data })
}
export function deleteFacility(id) {
  return request({ url: `/facility/${id}`, method: 'delete' })
}

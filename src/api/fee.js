import request from '@/utils/request'

export function getFeeItemPage(params) {
  return request({ url: '/fee-item/page', method: 'get', params })
}
export function saveFeeItem(data) {
  return request({ url: '/fee-item', method: 'post', data })
}
export function updateFeeItem(data) {
  return request({ url: '/fee-item', method: 'put', data })
}
export function deleteFeeItem(id) {
  return request({ url: `/fee-item/${id}`, method: 'delete' })
}

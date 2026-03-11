import request from '@/utils/request'

export function getFeedbackPage(params) {
  return request({ url: '/feedback/page', method: 'get', params })
}
export function saveFeedback(data) {
  return request({ url: '/feedback', method: 'post', data })
}
export function updateFeedback(data) {
  return request({ url: '/feedback', method: 'put', data })
}
export function deleteFeedback(id) {
  return request({ url: `/feedback/${id}`, method: 'delete' })
}

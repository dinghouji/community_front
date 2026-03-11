import request from '@/utils/request'

export function getUnitPage(params) {
  return request({ url: '/unit/page', method: 'get', params })
}

export function saveUnit(data) {
  return request({ url: '/unit', method: 'post', data })
}

export function updateUnit(data) {
  return request({ url: '/unit', method: 'put', data })
}

export function deleteUnit(id) {
  return request({ url: `/unit/${id}`, method: 'delete' })
}

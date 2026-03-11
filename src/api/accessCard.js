import request from '@/utils/request'

export function getAccessCardPage(params) {
  return request({
    url: '/access-card/page',
    method: 'get',
    params
  })
}

export function saveAccessCard(data) {
  return request({
    url: '/access-card',
    method: 'post',
    data
  })
}

export function updateAccessCard(data) {
  return request({
    url: '/access-card',
    method: 'put',
    data
  })
}

export function deleteAccessCard(id) {
  return request({
    url: `/access-card/${id}`,
    method: 'delete'
  })
}

import request from '@/utils/request'

export function getUserPage(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  })
}

export function saveUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

export function changePassword(data) {
  return request({
    url: '/user/change-password',
    method: 'post',
    data
  })
}
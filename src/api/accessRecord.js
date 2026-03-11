import request from '@/utils/request'

export function getAccessRecordPage(params) {
  return request({
    url: '/access-record/page',
    method: 'get',
    params
  })
}

export function saveAccessRecord(data) {
  return request({
    url: '/access-record',
    method: 'post',
    data
  })
}

export function deleteAccessRecord(id) {
  return request({
    url: `/access-record/${id}`,
    method: 'delete'
  })
}

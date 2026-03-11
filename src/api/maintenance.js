import request from '@/utils/request'

export function getMaintenanceRecordPage(params) {
  return request({
    url: '/maintenance-record/page',
    method: 'get',
    params
  })
}

export function saveMaintenanceRecord(data) {
  return request({
    url: '/maintenance-record',
    method: 'post',
    data
  })
}

export function updateMaintenanceRecord(data) {
  return request({
    url: '/maintenance-record',
    method: 'put',
    data
  })
}

export function deleteMaintenanceRecord(id) {
  return request({
    url: `/maintenance-record/${id}`,
    method: 'delete'
  })
}

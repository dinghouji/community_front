import request from '@/utils/request'

export function getFacilityUsagePage(params) {
  return request({
    url: '/facility-usage/page',
    method: 'get',
    params
  })
}

// 获取用户自己的申请记录
export function getMyFacilityUsages(userId) {
  return request({
    url: '/facility-usage/my',
    method: 'get',
    params: { userId }
  })
}

// 检查时间段是否冲突
export function checkFacilityConflict(facilityId, startTime, endTime) {
  return request({
    url: '/facility-usage/check-conflict',
    method: 'get',
    params: { facilityId, startTime, endTime }
  })
}

// 获取设施已有的使用时间段（待审核和已批准的）
export function getFacilitySchedule(facilityId) {
  return request({
    url: '/facility-usage/schedule',
    method: 'get',
    params: { facilityId }
  })
}

export function saveFacilityUsage(data) {
  return request({
    url: '/facility-usage',
    method: 'post',
    data
  })
}

export function updateFacilityUsage(data) {
  return request({
    url: '/facility-usage',
    method: 'put',
    data
  })
}

export function deleteFacilityUsage(id) {
  return request({
    url: `/facility-usage/${id}`,
    method: 'delete'
  })
}

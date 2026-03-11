import request from '@/utils/request'

export function getParkingTypePage(params) {
  return request({
    url: '/parking-type/page',
    method: 'get',
    params
  })
}

export function saveParkingType(data) {
  return request({
    url: '/parking-type',
    method: 'post',
    data
  })
}

export function updateParkingType(data) {
  return request({
    url: '/parking-type',
    method: 'put',
    data
  })
}

export function deleteParkingType(id) {
  return request({
    url: `/parking-type/${id}`,
    method: 'delete'
  })
}

export function getAllParkingTypes() {
    // Assuming there might be a list endpoint, or we just use page with large size
    return request({
        url: '/parking-type/page',
        method: 'get',
        params: { pageNum: 1, pageSize: 1000 }
    })
}

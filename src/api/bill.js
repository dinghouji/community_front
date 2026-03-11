import request from '@/utils/request'

export function getBillPage(params) {
  return request({
    url: '/bill/page',
    method: 'get',
    params
  })
}

export function saveBill(data) {
  return request({
    url: '/bill',
    method: 'post',
    data
  })
}

export function updateBill(data) {
  return request({
    url: '/bill',
    method: 'put',
    data
  })
}

export function deleteBill(id) {
  return request({
    url: `/bill/${id}`,
    method: 'delete'
  })
}

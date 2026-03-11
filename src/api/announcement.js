import request from '@/utils/request'

export function getAnnouncementPage(params) {
  return request({ url: '/announcement/page', method: 'get', params })
}
export function saveAnnouncement(data) {
  return request({ url: '/announcement', method: 'post', data })
}
export function updateAnnouncement(data) {
  return request({ url: '/announcement', method: 'put', data })
}
export function deleteAnnouncement(id) {
  return request({ url: `/announcement/${id}`, method: 'delete' })
}

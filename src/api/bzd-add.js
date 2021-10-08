import request from '@/utils/request'

export function fetchAdd(data) {
  return request({
    url: '/ToSave',
    method: 'post',
    data
  })
}

export function fetchEdit(data) {
  return request({
    url: '/BZDGetEntity',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: '/BZDGetList',
    method: 'post',
    data
  })
}

export function deleteList(data) {
  return request({
    url: '/ToDelete',
    method: 'post',
    data
  })
}


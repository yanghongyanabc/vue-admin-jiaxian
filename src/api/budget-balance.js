import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/Yue/GetData',
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


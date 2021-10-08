import request from '@/utils/request'

export function fetchUnitList(data) {
  return request({
    url: '/GetUnitList',
    method: 'post',
    data
  })
}

export function fetchKemuList(data) {
  return request({
    url: '/GetYSYCWList',
    method: 'post',
    data
  })
}

export function fetchZhibiaoList(data) {
  return request({
    url: '/GetZBList',
    method: 'post',
    data
  })
}


import request from '@/utils/request'

/* export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
} */
export function login(data) {
  return request({
    url: '/Login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/UserInfo',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/UserLogout',
    method: 'post'
  })
}

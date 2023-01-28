import request from '@/utils/request'

export function login(data) {
  //request方法是基于axios封装的库
  //axios有两种拦截，一种是request拦截(请求拦截器)，一种是response拦截(响应拦截器)
  //首先创建axios示例，它帮助我们完成一些基本的请求功能，更重要的是它的两个拦截器：
  //请求拦截器和响应拦截器，设置请求拦截器的好处是可以在这里添加全局统一的关卡 
  //比如说token，判断是否拥有登录，有则添加到请求参数中去，这样只要请求就会带token，就不需要再在每个接口中写全局统一的参数。
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

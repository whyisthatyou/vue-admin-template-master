import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

//permission主要用于拦截页面请求

// NProgress是页面跳转是出现在浏览器顶部的进度条
//showSpinner：进度环显示隐藏
NProgress.configure({ showSpinner: false }) 

//配置页面请求白名单，在白名单不做拦截以及任何处理
const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {    ////如果有token，说明是登录状态
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          console.log('Has Error')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    //在白名单不做拦截以及任何处理
    //使用 http://localhost:9528/#/login登录后会识别为白名单不处理，还是 http://localhost:9528/#/login
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()  //不做处理

    } else {
      // other pages that do not have permission to access are redirected to the login page.
      //使用 http://localhost:9528/登录后会被重定向到 http://localhost:9528/#/login?redirect=%2Fdashboard
      next(`/login?redirect=${to.path}`)
      NProgress.done()  //浏览器顶部的进度条结束
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()  //浏览器顶部的进度条结束
})

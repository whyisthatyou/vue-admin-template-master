import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'   //实际上是 import App from './App.vue';
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control




import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.use(VXETable)
Vue.prototype.$VXETable = VXETable
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
  const { mockXHR } = require('../mock')
  mockXHR()

import axios from 'axios'  // 安装axios后引入
Vue.prototype.$axios = axios  // 将axios挂载到原型上方便使用

import Mock from 'mockjs'
Mock.mock('http://localhost:9528/api/aaa/bbb', { 'code': '0', 'msg': 'success', 'data': 'dlsajfkdas' })

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',   // 提供一个在页面上已经存在的 DOM 元素的ID作为 Vue 实例挂载目标
  router,
  store,//在main.js文件中注册store.使之可以使用vue中的全局变量 this.$store.state 
  render: h => h(App)
  //createElement就是h,一个形参，没有具体意义，可以随意改变书写
  //  等价于 render:(function(createElement){    return createElement(App); })

})

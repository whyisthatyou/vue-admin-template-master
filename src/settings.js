//module.exports 对象是由模块系统创建的。在我们自己写模块的时候，需要在模块最后写好模块接口
//声明这个模块对外暴露什么内容，module.exports 提供了暴露接口的方法。这种方法可以返回全局共享的变量或者方法。
//  调用方法：
//  const defaultSettings = require('./src/settings.js')
//  const title = defaultSettings.title 
module.exports = {

  title: '运维集市',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar  左侧菜单栏顶部是否显示logo
   */
  sidebarLogo: true
}

'use strict'
//vue.config.js是vue-cli3之后新增的一个功能，再这个版本里面如果要配置webpack相关的属性
//就需要自己在项目根目录新建vue.config.js这个文件，然后在该文件里面去写入你需要的配置等等。
//vue.config.js配置参考 https://cli.vuejs.org/zh/config/#configurewebpack
const path = require('path')  // path模块包含一系列处理和转换文件路径的工具集，node语法中通过 require('path') 可用来访问这个模块。
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)   //拼接绝对路径，__dirname代表当前目录
}

const name = defaultSettings.title || 'vue Admin Template' // 取page title  ||后面接的默认值，如果defaultSettings.title为空则取||后的默认值

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // process.env.port  读取当前目录下环境变量port的值  

// All configuration item explanations can be find in https://cli.vuejs.org/config/
//module.exports 对象是由模块系统创建的。在我们自己写模块的时候，需要在模块最后写好模块接口
//声明这个模块对外暴露什么内容，module.exports 提供了暴露接口的方法。这种方法可以返回全局共享的变量或者方法。
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  //默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。
  //如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，
  //则设置 publicPath 为 /my-app/
  publicPath: '/', 
  //当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录的内容在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
  outputDir: 'dist',
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,//如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  devServer: {
    port: port,
    open: false,//告诉 dev-server 在服务器已经启动后打开浏览器。设置其为 true 以打开你的默认浏览器。
    overlay: {
      warnings: false,//设置其为 true时，当出现编译警告时，在浏览器中显示全屏覆盖。
      errors: true //设置其为 true时，当出现编译错误时，在浏览器中显示全屏覆盖。
    },
    before: require('./mock/mock-server.js')   //使用mock模拟数据 https://www.sunmoonblog.com/2020/07/01/vue-mockserver-watch-not-working/
  },

  //configureWebpack 和chainWebpack的作用相同，唯一的区别就是它们修改webpack配置的方式不同
  //configureWebpack 通过操作对象的形式，来修改默认的webpack配置，该对象将会被 webpack-merge 合并入最终的 webpack 配置
  //chainWebpack 通过链式编程的形式，来修改默认的webpack配置
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
       //随着项目模块增多，导入模块的路径越来越长，从视觉和编程体验上带来很差的体验，webpack提供了配置路径别名的方法，可通过resolve选项中的alias来配置。
       //将 src 简写成 @
      alias: { 
        '@': resolve('src')  
        //@ 的作用是在你引入模块时，可以使用 @ 代替 /src 目录（是固定的），避免易错的相对路径。
        //如：你在（src/views/pmp/setLarge/index.vue）文件中想引入（src/assets/setLarge.png）的图片
        //正常情况下你需要（…/…/…/…/src/assets/setLarge.png）才能找到该图片，但如果你配置了就可以这样简写（src/assets/setLarge.png）
      }
    }
  },

  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [  //https://juejin.cn/post/6893681741240909832
      {
        rel: 'preload', //preload的设计初衷是为了尽早加载首屏需要的关键资源，从而提升页面渲染性能。preload用来声明当前页面的关键资源，强制浏览器尽快加载；而prefetch用来声明将来可能用到的资源，在浏览器空闲时进行加载。
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial' //include属性。该属性默认取值'asyncChunks'，表示仅预加载异步js模块；如果需要预加载图片、字体等资源，则需要将其设置为'allAssets'，表示处理所有类型的资源。initial：entry项对应生成的chunk文件

      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    //Prefetch 链接将会消耗带宽。如果你的应用很大且有很多 async chunk
    //而用户主要使用的是对带宽较敏感的移动端，那么你可能需要关掉 prefetch 链接并手动选择要提前获取的代码区块
    //使用config.plugins.delete('prefetch-${name}')去删除
    //${name}需要赋值具体的页面入口
    //例如
    //login.html 则添加 config.plugins.delete('prefetch-login'),
    //index.html 则添加 config.plugins.delete('prefetch-index')
    //问题：下面这个配置项没有带name，是不是没有生效？
    config.plugins.delete('prefetch')  

    // set svg-sprite-loader  vue-svg-loader将 svg 图标作为 Vue 组件导入
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}

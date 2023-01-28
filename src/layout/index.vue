<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 移动端触发侧边导航栏开关    ===代表严格相同  -->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!--加载侧边栏布局-->
    <sidebar class="sidebar-container" />

    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>

</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

//export主要用于对外输出本模块变量的接口,在其它文件或模块中通过import来导入常量，函数，文件或模块
//export default和export都能导出一个模块里面的常量，函数，文件，模块等
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],  //简单来说，就是将一个组件的变量和方法作为公共的，可以合并到任意一个组件中，后者可以调用前者的变量与方法
  
  //计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。注意，如果某个依赖 (比如非响应式属性) 在该实例范畴之外，则计算属性是不会被更新的。
  computed: {
    sidebar() {
    //<template> 拥有组件实例的上下文，可直接通过 {{$store.state.XXX }} 访问，等价于 script 中的 this.$store.state.XXX
    //就把 $store 看成在data中return的某个变量，在下面的script中使用需要加this，在上面的template中不需要加this
      return this.$store.state.app.sidebar  
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      //withoutAnimation  控制Sidebar样式的transition的,见~@/styles/sidebar.scss
      //dispatch 用来触发异步操作的方法
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;  //为父级元素 添加 .clearfix 类可以很容易地清除内部的浮动
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>

<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!--activeMenu  控制点击的菜单栏高亮-->
      <!--isCollapse  折叠左侧菜单栏，仅在 mode 为 vertical 时可用-->
      <!--vertical  垂直扩展-->
      <el-menu
        :default-active="activeMenu"    
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"   
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },

    activeMenu() {   //控制点击的菜单栏高亮
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      // 可以在路由配置文件中设置自定义的路由路径到meta.activeMenu属性中，来控制菜单自定义高亮显示
      // meta中 有activeMenu 字段的页面，都会显示高亮
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },

    showLogo() {  //控制左侧菜单栏顶部是否显示logo
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    //NavBar 中点击按钮，会修改 Cookie 中的 sidebarStatus，从 vuex 取值时会将 sidebarStatus 转为 Boolean，并判断默认是否需要收缩左侧菜单栏
    isCollapse() {  //控制是否折叠左侧菜单栏
      return !this.sidebar.opened
    }
  }
}
</script>

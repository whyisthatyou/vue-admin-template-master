<!--sidebar-item：sidebar-item 分为两部分：
  第一部分是当只需要展示一个 children 或者没有 children 时进行展示，展示的组件包括：
      app-link：动态组件，path 为链接时，显示为 a 标签，path 为路由时，显示为 router-link 组件
      el-menu-item：菜单项，当 sidebar-item 为非 nest 组件时，el-menu-item 会增加 submenu-title-noDropdown 的 class
      item：el-menu-item 里的内容，主要是 icon 和 title，当 title 为空时，整个菜单项将不会展示
  第二部分是当 children 超过两项时进行展示，展示的组件包括：
      el-submenu：子菜单组件容器，用于嵌套子菜单组件
      sidebar-item：el-submenu 迭代嵌套了 sidebar-item 组件，在 sidebar-item 组件中有两点变化：
      设置 is-nest 属性为 true
      根据 child.path 生成了 base-path 属性传入 sidebar-item 组件
-->
<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object  路由对象
    item: {                    
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    //判断是否只有一个需要展示的子路由
    hasOneShowingChild(children = [], parent) { 
      //children.filter是javascript函数，用于筛选childrens中为函数返回true的children，赋值给showingChildren数组
      const showingChildren = children.filter(item => {
        // 如果 children 中的路由包含 hidden 属性，则返回 false
        if (item.hidden) {
          return false
        } else {
          // 将子路由赋值给 onlyOneChild，用于只包含一个路由时展示 
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      //showingChildren是一个数组，包含所有item.hidden=true的children
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

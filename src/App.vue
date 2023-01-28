<template>
  <div id="app">
    <router-view />  <!--<router-view>标签将会把路由相关内容渲染在这个地方，路由配置在src/router/index.js中-->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<template>
  <div class="page-x">
    <!-- 【步骤1】 创建容器 -->
    <div class="g6-x" id="NPM" ref="containerG6"></div>
    <div class="tips">
        <span style="position:absolute;top:30px;right:50px;">用户名: admin</span>
        <span style="position:absolute;top:60px;right:50px;"> 密码: any</span>
          <span style="position:absolute;top:90px;right:50px;">id: 唯一编号</span>
    <el-input type="test" :rows="2" placeholder="请输入内容" v-model=this.data.data.nodes.name></el-input>
    <el-divider></el-divider>
      </div>
  </div>
</template>

<script>
// 【步骤2】 引入G6
import G6 from '@antv/g6'


// 配置右键菜单





export default {
  name: "Started",
  data() {
    return {
      graph: null,
      // 【步骤3】 准备数据
      graphData: {
        // 点集
    nodes: [
      {
        id: 'node1', // 节点的唯一标识
        x: 100, // 节点横坐标
        y: 100, // 节点纵坐标
        label: '发起订单信息 \t \n 查询请求', // 节点文本
      },
      {
        id: 'node2',
        x: 300,
        y: 100,
        label: '接收订单查询请求',
      },
      {
        id: 'node3',
        x: 300,
        y: 200,
        label: '查询cops_order_info \n,返回订单信息',
      },
      {
        id: 'node4',
        x: 100,
        y: 300,
        label: '返回结果',
      },
    ],
    // 边集
    edges: [
      // 表示一条从 node1 节点连接到 node2 节点的边
      {
        source: 'node1', // 起始点 id
        target: 'node2', // 目标点 id
        label: '', // 边的文本
      },
      {
        source: 'node2', // 起始点 id
        target: 'node3', // 目标点 id
        label: '', // 边的文本
      },
      {
        source: 'node3', // 起始点 id
        target: 'node4', // 目标点 id
        label: '', // 边的文本
      },
    ],
  }
      
    }
  },
  methods: {
    // 初始化关系图，并渲染数据
    initGraph() {
      // 【步骤4】 创建关系图
      const containerG6  = this.$refs.containerG6 // 获取容器（DOM元素）
      this.graph = new G6.Graph({
    
      //  plugins: [toolbar1], // 配置 右键菜单 Menu 插件
        defaultNode: {
    size: [130, 30], // 节点大小
    type:'rect',       // 元素的图形
    // ...                 // 节点的其他配置
    // 节点样式配置
    style: {
      fill: 'steelblue', // 节点填充色
      stroke: '#666', // 节点描边色
      lineWidth: 1, // 节点描边粗细
    },
    // 节点上的标签文本配置
    labelCfg: {
      // 节点上的标签文本样式配置
      style: {
        fill: '#fff', // 节点标签文字颜色
      },
    },
  },
    // 边在默认状态下的样式配置（style）和其他配置
    defaultEdge: {
    // ...                 // 边的其他配置
    // 边样式配置
    style: {
      opacity: 0.6, // 边透明度
      stroke: 'grey', // 边描边颜色
    },
    // 边上的标签文本配置
    labelCfg: {
      autoRotate: true, // 边上的标签文本根据边的方向旋转
    },
  },

  // 节点不同状态下的样式集合
  nodeStateStyles: {
    // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
    hover: {
      fill: 'lightsteelblue',
    },
    // 鼠标点击节点，即 click 状态为 true 时的样式
    click: {
      stroke: '#666',
      lineWidth: 3,
    },
  },

        container: containerG6, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: containerG6.offsetWidth, // Number，必须，图的宽度
        height: containerG6.offsetHeight, // Number，必须，图的高度
        modes: {
    default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
  },
     
      })

      // 【步骤5】 匹配数据源并渲染
      this.graph.data(this.graphData) // 读取 Step 2 中的数据源到图上
      this.graph.render() // 渲染图

      // 鼠标进入节点
      this.graph.on('node:mouseenter', (e) => {
  const nodeItem = e.item; // 获取鼠标进入的节点元素对象
  this.graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
});

// 鼠标离开节点
this.graph.on('node:mouseleave', (e) => {
  const nodeItem = e.item; // 获取鼠标离开的节点元素对象
  this.graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
});

// 点击节点
this.graph.on('node:click', (e) => {
  // 先将所有当前是 click 状态的节点置为非 click 状态
  const clickNodes = this.graph.findAllByState('node', 'click');
  clickNodes.forEach((cn) => {
    this.graph.setItemState(cn, 'click', false);
  });
  const nodeItem = e.item; // 获取被点击的节点元素对象
  this.graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
});


    }


  },
  mounted() {
    this.initGraph();


  }
};

   
</script>

<style scoped>
.g6-x {
  width: 1100px;
  height: 600px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
</style>
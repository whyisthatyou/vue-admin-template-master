<template>
  <div class="page-x">
    <!-- 【步骤1】 创建容器 -->
    <div class="g6-x" id="NPM" ref="containerG6"></div>
    <div class="tips">
        <el-input id= "node_id" size="small" style="position:absolute;top:30px;right:40px;width: 150px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[0].id>
         <template slot="prepend"> id  </template>
        </el-input>
         <el-input id= "node_x" size="small" style="position:absolute;top:60px;right:40px;width: 150px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[0].x>
         <template slot="prepend"> x   </template>
        </el-input>
         <el-input id= "node_y" size="small" style="position:absolute;top:90px;right:40px;width: 150px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[0].y>
         <template slot="prepend"> y   </template>
        </el-input>
        <el-input id= "node_width" size="small" style="position:absolute;top:120px;right:40px;width: 150px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[0].width>
         <template slot="prepend"> 宽度   </template>
        </el-input>
        <el-input id= "node_height" size="small" style="position:absolute;top:150px;right:40px;width: 150px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[0].height>
         <template slot="prepend"> 长度   </template>
        </el-input>
         <el-input id= "node_label" size="small" style="position:absolute;top:180px;right:40px;width: 150px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[0].label>
         <template slot="prepend">描述</template>
         </el-input>
         <p class="form-item" style="position:absolute;top:210px;right:40px;width: 150px;">
          <button @click.prevent="handleSubmit">更新属性</button>
        </p>
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
        width:130,
        height:30,
        label: '发起订单信息 \t \n 查询请求', // 节点文本
      },
      {
        id: 'node2',
        x: 300,
        y: 100,
        width:130,
        height:30,
        label: '接收订单查询请求',
      },
      {
        id: 'node3',
        x: 300,
        y: 200,
        width:130,
        height:30,
        label: '查询cops_order_info \n,返回订单信息',
      },
      {
        id: 'node4',
        x: 100,
        y: 300,
        width:130,
        height:30,
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
    size:[130,30],
    //指定边链接的点
    anchorPoints: [[0.5, 0], [0.5, 1],[0,0.5],[1,0.5]],
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
    shape: 'polyline',
    style: {
      endArrow: true,
      lineWidth: 2,
      stroke: '#666'
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
    , handleSubmit() {
      
      let node_label =  document.getElementById('node_label').value;
      this.graphData.nodes[0].label=node_label;
      let node_id =  document.getElementById('node_id').value;
      this.graphData.nodes[0].id=node_id;
      let node_x =  document.getElementById('node_x').value;
      this.graphData.nodes[0].x=node_x;
      let node_y =  document.getElementById('node_y').value;
      this.graphData.nodes[0].y=node_y;
      let node_height =  document.getElementById('node_height').value;
      let node_width =  document.getElementById('node_width').value;
      this.graphData.nodes[0].size=[node_width,node_height];
      this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
      this.graph.render() ; // 渲染图
    }

  },
  mounted() {
    this.initGraph();


  }
};

   
</script>

<style scoped>
.g6-x {
  width: 950px;
  height: 600px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}


</style>
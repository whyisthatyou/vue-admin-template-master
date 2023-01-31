<template>
  <div class="page-x">
    <!-- 【步骤1】 创建容器 -->
    <div class="g6-x" id="NPM" ref="containerG6">
      <ul v-show="true" :style="css_style" class="contextmenu">
      <!-- <li v-if="rightClickItem.fileType==99" @click="handleClickFolder(rightClickItem)">打开</li>
      <li @click="handleDelete(rightClickItem)">删除</li>
      <li @click="handleDownloadFile(rightClickItem)" v-if="rightClickItem.fileType!=99">下载</li>
      <li @click="handlePreviewFile(rightClickItem)" v-if="rightClickItem.fileType!=99">预览</li>
      <li @click="handleUpdate(rightClickItem)">编辑</li> -->
      <li @click="handleNodeCopy()">复制</li>
      <li @click="handleNodeDelete()">删除</li>
    </ul>

    <ul v-show="true" :style="edge_css_style" class="contextmenu">
      <li @click="handleEdgeCopy()">复制</li>
      <li @click="handleEdgeDelete()">删除</li>
    </ul>

    </div>
    <div class="tips"  id="tips" >
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
         <template slot="prepend"> 高度   </template>
        </el-input>
         <el-input id= "node_label" size="small" style="position:absolute;top:180px;right:40px;width: 150px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[0].label>
         <template slot="prepend">描述</template>
         </el-input>
         <p class="form-item" style="position:absolute;top:210px;right:40px;width: 150px;">
          <button @click.prevent="handleSubmit">更新属性</button>
        </p>
        <p class="form-item" style="position:absolute;top:240px;right:40px;width: 150px;">
          <button @click.prevent="handleAddLine">新增连接线</button>
        </p>
        <p class="form-item" style="position:absolute;top:270px;right:40px;width: 150px;">
          <button @click.prevent="handleAddRect">新增矩形节点</button>
        </p>
        <p class="form-item" style="position:absolute;top:300px;right:40px;width: 150px;">
          <button @click.prevent="handleSave">保存整个流程图</button>
        </p>
        <p class="form-item" style="position:absolute;top:330px;right:40px;width: 150px;">
          <button @click.prevent="handleReadSaveFile">读取备份流程图</button>
        </p>
        <p class="form-item" style="position:absolute;top:360px;right:40px;width: 150px;">
          <button @click.prevent="handleChangeMode">编辑，拖拽切换</button>
        </p>
    <el-divider></el-divider>
      </div>
  </div>
</template>

<script>
// 【步骤2】 引入G6
import G6 from '@antv/g6'







export default {
  name: "Started",
  data() {
    return {
      graph: null,
      //将右键菜单项style：css_style做成变量  初始值给负值将菜单项移到图外，右键点击后再移回来
      css_style:{left:-300+'px',top:-300+'px'}, 
      edge_css_style:{left:-300+'px',top:-300+'px'}, 
      // 【步骤3】 准备数据
      graphData: {
        // 点集
    nodes: [
      {
        id: 'node1', // 节点的唯一标识
        type:'rectNode',
        x: 100, // 节点横坐标
        y: 100, // 节点纵坐标
        size:[130,30],
        label: '发起订单信息 \t \n 查询请求', // 节点文本
      },
      {
        id: 'node2',
        type:'rectNode',
        x: 300,
        y: 100,
        width:130,
        height:30,
        label: '接收订单查询请求',
      },
      {
        id: 'node3',
        type:'rectNode',
        x: 300,
        y: 200,
        width:130,
        height:30,
        label: '查询cops_order_info \n,返回订单信息',
      },
      {
        id: 'node4',
        type:'rectNode',
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
        id:'edges1',
        source: 'node1', // 起始点 id
        target: 'node2', // 目标点 id
        label: '发送请求', // 边的文本
      },
      {
        id:'edges2',
        source: 'node2', // 起始点 id
        target: 'node3', // 目标点 id
        label: '', // 边的文本
      },
      {
        id:'edges3',
        source: 'node3', // 起始点 id
        target: 'node4', // 目标点 id
        label: '', // 边的文本
      },
    ],

  }
      ,nodeNo:"node1"
      ,edgeNo:"edge1" 
      ,dragMode:1,
    }
  },
  methods: {
  
    // 初始化关系图，并渲染数据
    initGraph() {

// 基于 rect 扩展出新的图形
G6.registerNode('rectNode', {
  getAnchorPoints() {
      return [
        [0, 0.5], // 左侧中间
        [1, 0.5], // 右侧中间
        [0.5, 1], // 右侧中间
        [0.5, 0], // 右侧中间
      ];
    },
    draw(cfg, group) {
      group.addShape("rect", {
      attrs: {
        id:cfg.id,
        x:cfg.x,
        y:cfg.y,
        width: cfg.size[0],
        height: cfg.size[1],
        fill: 'steelblue', // 节点填充色
        stroke: '#666', // 节点描边色
        lineWidth: 1, // 节点描边粗细
        label:cfg.label,
        index: "node"
      },
      draggable: true
    });
    // 如果 cfg 中定义了 style 需要同这里的属性进行融合

    if (cfg.label) {
      group.addShape("text", {
        attrs: {
          x: cfg.x+cfg.size[0] / 2,
          y: cfg.y+cfg.size[1] / 2,
          textAlign: "center",
          textBaseline: "middle",
          text: cfg.label,
          fill: "#fff",
          index: "node"
        },
        draggable: true
      });
    }
    
    const points = cfg.anchorPoints;
    for (let index = 0; index < points.length; index++) {
      group.addShape("circle", {
        attrs: {
          x: cfg.x+cfg.size[0] * points[index][0],
          y: cfg.y+cfg.size[1] * points[index][1],
          r: 5,
          stroke: "block",
          fill: "red",
          index:'maodian',   //锚点标签
        }
      });
    }

    return group;
  },


    
  },'rect',);

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
  // 边不同状态下的样式集合
  edgeStateStyles: {
    hover: {
      stroke: 'red',
    },
    // 鼠标点击边，即 click 状态为 true 时的样式
    click: {
      stroke: 'red',
    },
  },

        container: containerG6, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: containerG6.offsetWidth, // Number，必须，图的宽度
        height: containerG6.offsetHeight, // Number，必须，图的高度
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
          edit: ['click-select'],      // ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
  },
     
      })

      // 【步骤5】 匹配数据源并渲染
      this.graph.data(this.graphData) // 读取 Step 2 中的数据源到图上
      this.graph.render() // 渲染图


      //定义右键菜单项
// 在实际开发中，右键菜单内容可以使用JSX或HTML中的模板
  // 创建ul
  


  // 鼠标进入节点
  this.graph.on('node:mouseenter', (e) => {
  const nodeItem = e.item; // 获取鼠标进入的节点元素对象
  this.nodeNo=nodeItem._cfg.id;  //鼠标划过时获取node的Id
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
// 点击右键，触发菜单项
this.graph.on('node:contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.css_style.left =e.canvasX +'px'; // 使菜单出现在节点的右侧，e.canvasX是节点的坐标
      this.css_style.top = e.canvasY +'px';
      this.css_style.display = "block";
      this.css_style.position='absolute';
});


  // 鼠标进入边
  this.graph.on('edge:mouseenter', (e) => {
  const edgeItem = e.item; // 获取鼠标进入的节点元素对象
  this.edgeNo=edgeItem._cfg.id;  //鼠标划过时获取node的Id
  this.graph.setItemState(edgeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
});
// 鼠标离开边
this.graph.on('edge:mouseleave', (e) => {
  const edgeItem = e.item; // 获取鼠标离开的节点元素对象
  this.graph.setItemState(edgeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
});
// 点击边
this.graph.on('edge:click', (e) => {
  // 先将所有当前是 click 状态的边置为非 click 状态
  const clickEdges = this.graph.findAllByState('edge', 'click');
  clickEdges.forEach((ce) => {
    this.graph.setItemState(ce, 'click', false);
  });
  const edgeItem = e.item; // 获取被点击的边元素对象
  this.graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
});
// 点击右键，触发菜单项
this.graph.on('edge:contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.edge_css_style.left =e.canvasX +'px'; // 使菜单出现在节点的右侧，e.canvasX是节点的坐标
      this.edge_css_style.top = e.canvasY +'px';
      this.edge_css_style.display = "block";
      this.edge_css_style.position='absolute';

});

this.graph.on('node:mousedown', (e) => {
  const graph = this.graph;
    if ("index" in e.shape.attrs) {
      if (e.shape.attrs.index == "node") {
        console.log("节点：拖动关键图形");
      } else {
        console.log("节点：拖动锚点");
        if (e.item) {
          const point = e.item.getContainer().get("children")[
            parseInt(e.shape.attrs.index) + 1
          ];
          console.log(point)
         // point.attrs.fill='#fff';
         // point.attrs.stroke='#000';
         // point.attrs.r=10;
        }
        const uid = Math.round(Math.random() * 100 + 100);
       // this.graphData.nodes.push( 
        graph.setMode("addedge");
        graph.addItem("edge", {
          id: uid,
          type: "cubic",
          source: e.item.getModel().id,
          sourceAnchor: e.shape.attrs.index,
          target: { x: e.x, y: e.y }
        });
        this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
        this.graph.render() ; // 渲染图
      }
    } else {
      console.log("节点：拖动原生图形");
    }
  
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
      this.graphData.nodes[0].size=[parseInt(node_width),parseInt(node_height)];   // 这里size里的值必须是整数而不是字符串
      console.log(this.graphData.nodes[0].size)
      this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
      this.graph.render() ; // 渲染图
    }
    ,handleAddLine(){
      this.graphData.edges.push( {
        source: 'node1', // 起始点 id
        target: 'node2', // 目标点 id
        label: '发送请求', // 边的文本
      });
      this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
      this.graph.render() ; // 渲染图
    }
    ,handleAddRect(){
      this.graphData.nodes.push( {
        id: 'node',
        x: 500,
        y: 100,
        width:130,
        height:30,
        label: '新节点',
      });
      this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
      this.graph.render() ; // 渲染图
    }
    ,handleNodeCopy(){
      this.graphData.nodes.push( {
        id: 'node',
        x: 500,
        y: 100,
        width:130,
        height:30,
        label: '新节点',
      });  // TODU 这里是创建了新节点，而不是复制节点
      this.css_style.left =-300 +'px'; // 隐藏右键菜单项
      this.css_style.top = -300 +'px'; // 隐藏右键菜单项
      this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
      this.graph.render() ; // 渲染图
      
    }
    ,handleNodeDelete(){
      for (let i=0; i<this.graphData.nodes.length; i++){
				if (this.graphData.nodes[i].id == this.nodeNo){
					this.graphData.nodes.splice(i, 1)
				}
			}
        this.css_style.left =-300 +'px'; // 隐藏右键菜单项
        this.css_style.top = -300 +'px'; // 隐藏右键菜单项
        this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
        this.graph.render() ; // 渲染图
    }
    ,handleEdgeCopy(){
      this.graphData.edges.push( {
        id:'edges111',
        source: 'node1', // 起始点 id
        target: 'node2', // 目标点 id
        label: '', // 边的文本
      });  // TODU 这里是创建了新节点，而不是复制节点
      this.edge_css_style.left =-300 +'px'; // 隐藏右键菜单项
      this.edge_css_style.top = -300 +'px'; // 隐藏右键菜单项
      this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
      this.graph.render() ; // 渲染图
      
    }
    ,handleEdgeDelete(){
      console.log(this.graphData.edges.length)
      for (let i=0; i<this.graphData.edges.length; i++){
				if (this.graphData.edges[i].id == this.edgeNo){
					this.graphData.edges.splice(i, 1)
				}
			}
        console.log(this.graphData.edges.length)
        this.edge_css_style.left =-300 +'px'; // 隐藏右键菜单项
        this.edge_css_style.top = -300 +'px'; // 隐藏右键菜单项
        this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
        this.graph.render() ; // 渲染图
    }
    ,handleSave(){
      var data = JSON.stringify(this.graphData)
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data);
      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download = "vue.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);


    }

    ,handleReadSaveFile(){
        this.$axios.get('/data.json').then(res => {     // 获取public下的test.json文件数据
        this.graphData=res.data;
        this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
        this.graph.render() ; // 渲染图
  })
    }
    ,handleChangeMode(){
      if(this.dragMode == 1){
        this.graph.setMode('edit');
        this.dragMode=0;
      }
      else{
        this.graph.setMode('default');
        this.dragMode=1;
      }
      
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


.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu  li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}

.contextmenu li:hover {
  background: #eee;
}


</style>
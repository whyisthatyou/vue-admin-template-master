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
      <li @click="handleEdgeEdit()">编辑</li>
      <li @click="handleEdgeDelete()">删除</li>
    </ul>
    <el-col :span="21">
    <el-input id= "edge_label"  @change="handlerEdgeLabelChange" @keyup.enter.native="handlerEdgeLabelChange"  size="small" v-show="true" :style="edge_label_css_style"  type="test" :rows="1" placeholder="" v-model="edge_label_edit" >
         </el-input>
    </el-col>
    </div>
    <div class="tips"  id="tips" >
        <el-input id= "node_id" size="small" style="position:absolute;top:30px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].id>
         <template slot="prepend"> id  </template>
        </el-input>
         <el-input id= "node_x" size="small" style="position:absolute;top:60px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].x>
         <template slot="prepend"> x   </template>
        </el-input>
         <el-input id= "node_y" size="small" style="position:absolute;top:90px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].y>
         <template slot="prepend"> y   </template>
        </el-input>
        <el-input id= "node_width" size="small" style="position:absolute;top:120px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].width>
         <template slot="prepend"> 宽度   </template>
        </el-input>
        <el-input id= "node_height" size="small" style="position:absolute;top:150px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].height>
         <template slot="prepend"> 高度   </template>
        </el-input>
         <el-input id= "node_label" size="small" style="position:absolute;top:180px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].label>
         <template slot="prepend">正文</template>
         </el-input>
         <el-input id= "node_desc" size="small" style="position:absolute;top:210px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].node_desc>
         <template slot="prepend">补充</template>
         </el-input>
         <el-input id= "node_application" size="small" style="position:absolute;top:240px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].node_application>
         <template slot="prepend">应用名</template>
         </el-input>
         <el-input id= "node_father" size="small" style="position:absolute;top:270px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].node_father>
         <template slot="prepend">归属业务</template>
         </el-input>
         <el-input id= "node_own" size="small" style="position:absolute;top:300px;right:40px;width: 300px;" type="test" :rows="1" placeholder="请输入内容" v-model=graphData.nodes[nodeItemNo].node_own>
         <template slot="prepend">是否父业务</template>
         </el-input>
         <p class="form-item" style="position:absolute;top:330px;right:40px;width: 150px;">
          <button @click.prevent="handleSubmit">更新属性</button>
        </p>
        <p class="form-item" style="position:absolute;top:360px;right:40px;width: 150px;">
          <button @click.prevent="handleAddLine">新增连接线</button>
        </p>
        <p class="form-item" style="position:absolute;top:390px;right:40px;width: 150px;">
          <button @click.prevent="handleAddRect">新增矩形节点</button>
        </p>
        <p class="form-item" style="position:absolute;top:420px;right:40px;width: 150px;">
          <button @click.prevent="handleSave">保存整个流程图</button>
        </p>
        <p class="form-item" style="position:absolute;top:450px;right:40px;width: 150px;">
          <button @click.prevent="handleReadSaveFile">读取备份流程图</button>
        </p>
        <p class="form-item" style="position:absolute;top:480px;right:40px;width: 150px;">
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
      edge_label_css_style:{width: '140px',left:-300+'px',top:-300+'px'},
      edge_label_edit:'',
      edge_label_id:0,
      nodeItemNo:0,
      // 【步骤3】 准备数据
      graphData: {
        // 点集
    nodes: [
      {
        id: 'node1', // 节点的唯一标识
        type:'rectNode',
        x: 100, // 节点横坐标
        y: 100, // 节点纵坐标
        width:130,
        height:30,
        anchorPoints:[
        [0.5,0], // 左侧中间
        [0.5, 1], // 右侧中间
        [1,0.5], // 右侧中间
        [0, 0.5], // 右侧中间
      ],
        label: '发起订单信息 \t \n 查询请求', // 节点文本
      },
      {
        id: 'node2',
        type:'rectNode',
        x: 300,
        y: 100,
        width:130,
        height:30,
        anchorPoints:[
        [0.5,0], // 左侧中间
        [0.5, 1], // 右侧中间
        [1,0.5], // 右侧中间
        [0, 0.5], // 右侧中间
      ],
        label: '接收订单查询请求',
      },
      {
        id: 'node3',
        type:'rectNode',
        x: 300,
        y: 200,
        width:130,
        height:30,
        anchorPoints:[
        [0.5,0], // 左侧中间
        [0.5, 1], // 右侧中间
        [1,0.5], // 右侧中间
        [0, 0.5], // 右侧中间
      ],
        label: '查询cops_order_info \n,返回订单信息',
      },
      {
        id: 'node4',
        type:'rectNode',
        x: 100,
        y: 300,
        width:130,
        height:30,
        anchorPoints:[
        [0.5,0], // 左侧中间
        [0.5, 1], // 右侧中间
        [1,0.5], // 右侧中间
        [0, 0.5], // 右侧中间
      ],
        label: '返回结果',
      },
    ],
    // 边集
    edges: [
    ],

  }
      ,nodeNo:"node1"
      ,edgeNo:"edge1" 
      ,dragMode:1
      ,mousedownSource:"node1"
      ,mousedownSourcePoint:[0.5,0]
      ,
    }
  },
  methods: {
  
    	// 获取当前日期的方法
	getProjectNum () {
      const projectTime = new Date() // 当前中国标准时间
      const Year = projectTime.getFullYear() // 获取当前年份 支持IE和火狐浏览器.
      const Month = projectTime.getMonth() + 1 // 获取中国区月份
      const Day = projectTime.getDate() // 获取几号
      var CurrentDate = Year
      if (Month >= 10) { // 判断月份和几号是否大于10或者小于10
        CurrentDate += Month
      } else {
        CurrentDate += '0' + Month
      }
      if (Day >= 10) {
        CurrentDate += Day
      } else {
        CurrentDate += '0' + Day
      }
      return CurrentDate
    },
    // 初始化关系图，并渲染数据
    initGraph() {

// 基于 rect 扩展出新的图形
G6.registerNode('rectNode', {
  setState(name, value, item) {
      const group = item.getContainer();
      if (name === 'show') {
        if (value) {
          // G6挖的坑：这里只能用.show()去改变visible的值，不能直接改visible的值。
          group.get('children')[2].show();    // 该节点的 visible 属性值在该方法调用后被置为 true
          group.get('children')[3].show();
          group.get('children')[4].show();
          group.get('children')[5].show();
        } else {
       //   group.get('children')[2].hide();
        //  group.get('children')[3].hide();
        //  group.get('children')[4].hide();
        //  group.get('children')[5].hide();
        }
      }
    },
  getAnchorPoints() {
      return [
        [0.5,0], // 左侧中间
        [0.5, 1], // 右侧中间
        [1,0.5], // 右侧中间
        [0, 0.5], // 右侧中间
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
      const a=index;
      group.addShape("circle", {
        visible:false,
        attrs: {
          x: cfg.x+cfg.size[0] * points[index][0],
          y: cfg.y+cfg.size[1] * points[index][1],
          r: 5,
          stroke: "block",
          fill: "white",
          index:a,   //锚点标签
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
    shape: 'cubic',      //  'polyline',
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
        width: containerG6.offsetWidth+500, // Number，必须，图的宽度
        height: containerG6.offsetHeight+800, // Number，必须，图的高度
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
          edit: ['click-select'],      // ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
  },
     
      })

      // 【步骤5】 匹配数据源并渲染
      console.log(containerG6.offsetWidth)
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
  this.graph.setItemState(nodeItem, 'show', true); // 显示锚点

});
// 鼠标离开节点
this.graph.on('node:mouseleave', (e) => {
  const nodeItem = e.item; // 获取鼠标离开的节点元素对象
  this.graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
  // this.graph.setItemState(nodeItem, 'show', false); // 隐藏锚点
});
// 点击节点
this.graph.on('node:click', (e) => {
// 调用获取当前日期的方法加四位随机数  赋值表单中的项目编号
const timenumber = this.getProjectNum() + Math.floor(Math.random() * 100000000)  // 如果是6位或者8位随机数，相应的 *1000000或者 *100000000就行了
console.log(timenumber)
      // 鼠标划过时获取node在nodes数组的编号
      for (let i=0; i<this.graphData.nodes.length; i++){
				if (this.graphData.nodes[i].id == this.nodeNo){
          this.nodeItemNo=i;  // 鼠标划过时获取node
        }
      }
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

// 鼠标拖动锚点
this.graph.on('node:mousedown', (e) => {
  const graph = this.graph;
    if ("index" in e.shape.attrs) {
      if (e.shape.attrs.index == "node") {
       // console.log("节点：拖动关键图形");
      } else if (e.shape.attrs.index in [0,1,2,3]){
     //   console.log("节点：拖动锚点");
        const uid = Math.round(Math.random() * 100 + 100);
        this.mousedownSource=e.item.getModel().id;
        this.mousedownSourcePoint=e.shape.attrs.index
      }
    } else {
    //  console.log("节点：拖动原生图形");
    }
  
});
// 鼠标松开锚点
this.graph.on('node:mouseup', (e) => {
  const graph = this.graph;
    if ("index" in e.shape.attrs) {
      if (e.shape.attrs.index == "node") {
     //   console.log("节点：拖动关键图形");
      } else if(typeof e.item != "undefined" && this.mousedownSource != e.item.getModel().id){
      //  console.log("节点：拖动锚点");
        const uid = Math.round(Math.random() * 100 + 100);
        this.graphData.edges.push( {
        id:uid,
        source: this.mousedownSource, // 起始点 id
        sourceAnchor: this.mousedownSourcePoint, // 起始的锚点
        targetAnchor: e.shape.attrs.index,
        target: e.item.getModel().id, // 目标点 id
        label: '', // 边的文本
      }); 
        this.graph.render() ; // 渲染图
      }
    } else {
     // console.log("节点：拖动原生图形");
    }
  
});


    }
    , handleSubmit() {
      
      let node_label =  document.getElementById('node_label').value;
      this.graphData.nodes[this.nodeItemNo].label=node_label;
      let node_id =  document.getElementById('node_id').value;
      this.graphData.nodes[this.nodeItemNo].id=node_id;
      let node_x =  document.getElementById('node_x').value;
      this.graphData.nodes[this.nodeItemNo].x=node_x;
      let node_y =  document.getElementById('node_y').value;
      this.graphData.nodes[this.nodeItemNo].y=node_y;
      let node_height =  document.getElementById('node_height').value;
      let node_width =  document.getElementById('node_width').value;
      this.graphData.nodes[this.nodeItemNo].size=[parseInt(node_width),parseInt(node_height)];   // 这里size里的值必须是整数而不是字符串
      console.log(this.graphData.nodes[this.nodeItemNo].size)
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
      this.graphData.nodes.push({
        id: this.getProjectNum() + Math.floor(Math.random() * 100000000), // 节点的唯一标识
        type:'rectNode',
        x: 180, // 节点横坐标
        y: 100, // 节点纵坐标
        width:130,
        height:30,
        node_desc:'',
        node_application:'',
        node_father:'',
        node_own:'',
        anchorPoints:[
        [0.5,0], // 左侧中间
        [0.5, 1], // 右侧中间
        [1,0.5], // 右侧中间
        [0, 0.5], // 右侧中间
      ],
        label: '新节点', // 节点文本
      }
      );  // TODU 这里是创建了新节点，而不是复制节点  
    
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
      for (let i=0; i<this.graphData.edges.length; i++){
				if (this.graphData.edges[i].id == this.edgeNo){
					this.graphData.edges.splice(i, 1)  //从数组中第i位删除一个元素
				}
			}
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
    ,handleEdgeEdit(){
      for (let i=0; i<this.graphData.edges.length; i++){
				if (this.graphData.edges[i].id == this.edgeNo){
          this.edge_label_css_style={width: '140px',left:this.graphData.edges[i].startPoint.x/2+this.graphData.edges[i].endPoint.x/2+'px',top:this.graphData.edges[i].startPoint.y/2+this.graphData.edges[i].endPoint.y/2+'px'}
          this.edge_label_id=i;
          this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
          this.graph.render() ; // 渲染图
				}
			}
        this.edge_css_style.left =-300 +'px'; // 隐藏右键菜单项
        this.edge_css_style.top = -300 +'px'; // 隐藏右键菜单项

    }
    ,handlerEdgeLabelChange(){
          this.graphData.edges[this.edge_label_id].label=this.edge_label_edit;
          this.graph.data(this.graphData)  ;  // 读取 Step 2 中的数据源到图上
          this.graph.render() ; // 渲染图
        this.edge_label_css_style.left =-300 +'px'; // 隐藏右键菜单项
        this.edge_label_css_style.top = -300 +'px'; // 隐藏右键菜单项

    }

    
  },
  mounted() {


    this.initGraph();



  }
};

   
</script>

<style scoped>
.g6-x {
  width: 2000px;
  height: 3000px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}

.tips {
  position: fixed;
    top: 30px;
    right: 0;
    width: 300px;
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
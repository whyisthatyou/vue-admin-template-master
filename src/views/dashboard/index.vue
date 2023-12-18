
<template>
    <div class="app-container" @contextmenu.prevent>
    <el-container>
      <el-main>
  <div>
    <!--width,height 画布的宽度，高度。 可以是百分比或像素，一般在dom元素上设置 -->
    <div id="network_id" class="network" style="height:80vh"></div>

    <div :style="{'z-index': 9999, position: 'fixed',left: optionCardX + 'px', 
				top: optionCardY + 'px', width: '100px', background: 'white',
				 'box-shadow': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}" 
				 v-show="optionCardShow" id="option-button-group">
	<el-button @click="copyJob" class="option-card-button">复制</el-button>
	<el-button @click="deleteJob" class="option-card-button">删除</el-button>
  <el-button @click="runJob" class="option-card-button">运行</el-button>
  <el-button @click="showNext" class="option-card-button">依赖</el-button>
</div>
  </div>
</el-main>
<el-asider>
  <div class="app-asider">

    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name"  type="textarea"/>
      </el-form-item>

            <el-form-item label="描述">
        <el-input v-model="form.desc"  type="textarea"/>
      </el-form-item>

      <el-form-item label="是否起点或终点">
        <el-select v-model="form.endpoint" placeholder="默认不是">
          <el-option label="起点" value="起点" />
          <el-option label="终点" value="终点" />
          <el-option label="不是" value="不是" />
        </el-select>
      </el-form-item>
    
      <el-form-item label="关键字">
        <el-input v-model="form.keywords" type="textarea" />
      </el-form-item>

      <el-form-item label="形状">
        <el-select v-model="form.shape" placeholder="默认椭圆">
          <el-option label="矩形" value="矩形" />
          <el-option label="菱形" value="菱形" />
          <el-option label="圆形" value="圆形" />
          <el-option label="椭圆" value="椭圆" />
       </el-select>
      </el-form-item>

      <el-form-item label="归属">
        <el-input v-model="form.parent"  />
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit" >保存</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSave" >导出流程图</el-button>
      </el-form-item>




    </el-form>
  </div>
</el-asider>
</el-container>
</div>
</template>
<script>
require("vis-network/dist/dist/vis-network.min.css");
const Vis = require("vis-network/dist/vis-network.min");
export default {
  data() {
    return {
      optionCardShow:false,
      optionCardX:'',
      optionCardY:'',
      form: {
        name: '',
        desc: '',
        endpoint: '',
        shape: '',
        parent: '',
      },
      // 当前鼠标锚点
      mountpoint:'',
      dialogVisible: false,
      nodes: [],
      edges: [],
      // network:null,
      container: null,
      //   节点数组
      nodesArray: [
        {
          color: { background: "yellow" },
          id: 0,
          label: "大前端",
          parent:'',
          shape: 'box',
          desc:'',
          endpoint:'',
        },
        {
          color: { background: "pink" },
          id: 1,
          label: "HTML",
          parent:'',
          shape: 'box',  
          desc:'',
          endpoint:'',
        },
        {
          color: { background: "pink" },
          id: 2,
          label: "JavaScript",
          parent:'',
          shape: 'box',  
          desc:'',
          endpoint:'',
        },
        {
          color: { background: "pink" },
          id: 3,
          label: "CSS",
          parent:'',
          shape: 'box',  
          desc:'',
          endpoint:'',
        },
        {
          color: { background: "pink" },
          id: 4,
          label: "三大主流框架",
          parent:'',
          shape: 'box',  
          desc:'',
          endpoint:'',
        },
        {
          color: { background: "pink" },
          id: 5,
          label: "vue.js",
          parent:'',
          shape: 'box',  
          desc:'',
          endpoint:'',
        },
        {
          color: { background: "pink" },
          id: 6,
          label: "react.js",
          parent:'',
          shape: 'box',  
          desc:'',
          endpoint:'',
        },
        {
          color: { background: "pink" },
          id: 201111111111101,
          label: "angular.js",
          parent:'',
          shape: 'box',  
          desc:'',
          endpoint:'',
        }
      ],
      //   关系线数组
      edgesArray: [
        { from: 0, to: 1, label: "ddd" ,desc:'',parent:''},
        { from: 1, to: 0, label: "aaa",desc:'',parent:'' },
        { from: 0, to: 2, label: "step1",desc:'',parent:'' },
        { from: 0, to: 3, label: "step1",desc:'',parent:'' },
        { from: 0, to: 4, label: "step1",desc:'',parent:'' },
        { from: 4, to: 5, label: "step2",desc:'',parent:'' },
        { from: 4, to: 6, label: "step2",desc:'',parent:'' },
        { from: 4, to: 201111111111101, label: "step2",desc:'',parent:'' }
      ],
      options: {},
      data: {}
    };
  },
  methods: {
    onSubmit() {
      console.log(this.nodes)
   //   this.nodes.add({
   //       label: '1111111',
  //        ...this.nodes[0],
   //     });
   if(this.nodes.get(this.mountpoint)!=undefined){
    // 提交后更新节点
        var myShape='';
        if(this.form.shape=='矩形'){
          myShape='box'
        }
        this.nodes.update({
            id: this.mountpoint,
            label: this.form.name,
            desc:this.form.desc,
            endpoint:this.form.endpoint,
            shape:myShape,
            parent:this.form.parent,
            changEdge: this.mountpoint,
          });   
        }
        // 提交后更新边
    else if(this.edges.get(this.mountpoint)!=undefined){
      this.edges.update({
            id: this.mountpoint,
            label: this.form.name,
            desc:this.form.desc,
            parent:this.form.parent,
          });   
    }
    this.data = {
        nodes: this.nodes,
        edges: this.edges
      };
 
      
      },

      onSave(){
        var nodeItems = this.nodes.get({
            fields: ['id', 'label','parent','shape','desc','endpoint'],
            type: {
                  }
                                      });
        var edgeItems = this.edges.get({
            fields: ['from', 'to','label','desc','parent'],
            type: {
                  }
                                      });
        // pretty print  data
        var dataexportValue = JSON.stringify(nodeItems, undefined, 2);
        var edgeexportValue = JSON.stringify(edgeItems, undefined, 2);
        var exportdata='{"nodes":'+dataexportValue+','+'"edges":'+edgeexportValue+'}'
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(exportdata);
      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download = "flowdata.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
     
                   
      this.$axios.post('http://localhost:9528/api/aaa/bbb')
          .then(function (response) {
            // handle success
            console.log(response);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {
            console.log("ssss");
          });


      },
    init() {
      let _this = this;
      //1.创建一个nodes数组
      _this.nodes = new Vis.DataSet(_this.nodesArray);
      //2.创建一个edges数组
      _this.edges = new Vis.DataSet(_this.edgesArray);
      _this.container = document.getElementById("network_id");
      _this.data = {
        nodes: _this.nodes,
        edges: _this.edges
      };




      var locales = {
  en: {
    edit: 'Edit',
    del: 'Delete selected',
    back: 'Back',
    addNode: 'Add Node',
    addEdge: 'Add Edge',
    editNode: 'Edit Node',
    editEdge: 'Edit Edge',
    addDescription: 'Click in an empty space to place a new node.',
    edgeDescription: 'Click on a node and drag the edge to another node to connect them.',
    editEdgeDescription: 'Click on the control points and drag them to a node to connect to it.',
    createEdgeError: 'Cannot link edges to a cluster.',
    deleteClusterError: 'Clusters cannot be deleted.',
    editClusterError: 'Clusters cannot be edited.'
  },
  cn: {
    edit: 'Edit',
    del: '删除',
    back: '返回',
    addNode: '新增节点',
    addEdge: '新增连接线',
    editNode: '编辑节点',
    editEdge: '编辑连接线',
    addDescription: '点击空白处添加节点',
    edgeDescription: '单击一个节点并将边缘拖动到另一个节点以连接它们',
    editEdgeDescription: '单击控制点并将其拖动到节点以连接到该节点',
    createEdgeError: 'Cannot link edges to a cluster.',
    deleteClusterError: 'Clusters cannot be deleted.',
    editClusterError: 'Clusters cannot be edited.'
  }
}    
 // these are all options in full.
var options = {
  edges:{
    arrows:{
        to:true 
    }
  },
  locale: 'cn',
  locales: locales,
  manipulation: {
    enabled: true,
    initiallyActive: false,
    addNode: function(nodeData,callback){ nodeData.add({id:'asfdadf222', label:"I'm new!",x:nodeData.x,y:nodeData.y});} ,
    addEdge: true,
    editNode: true,
    editEdge: true,
    deleteNode: true,
    deleteEdge: true,
    controlNodeStyle:{
      // all node options are valid.
    },
   






  },
  configure: {
    enabled: false,
    filter: 'nodes,edges',
    container: _this.container,
    showButton: true
  }
}
_this.options =options;

      _this.network = new Vis.Network(
        _this.container,
        _this.data,
        _this.options
      );
    },
 
    resetAllNodes() {
      let _this = this;
      _this.nodes.clear();
      _this.edges.clear();
      _this.nodes.add(_this.nodesArray);
      _this.edges.add(_this.edgesArray);
      _this.data = {
        nodes: _this.nodes,
        edges: _this.edges
      };
      //   network是一种用于将包含点和线的网络和网络之间的可视化展示
      _this.network = new Vis.Network(
        _this.container,
        _this.data,
        _this.options
      );
    },
    resetAllNodesStabilize() {
      let _this = this;
      _this.resetAllNodes();
      _this.network.stabilize();
    },

   
    // 复制节点
    copyJob(){
      console.log("复制");
      var myShape='';
        if(this.form.shape=='矩形'){
          myShape='box'
        }
        this.nodes.add({
            id: this.mountpoint+10000,
            label: this.form.name+'-复制',
            desc:this.form.desc,
            endpoint:this.form.endpoint,
            shape:myShape,
            parent:'',
            changEdge: this.mountpoint,
          });   
        
		this.$message({
			type: 'success',
			message: '节点复制成功！'
		});
    this.optionCardShow = false
    },

    // 删除节点
    deleteJob(){
	this.optionCardShow = false
	this.$confirm('此操作将删除该节点, 是否继续?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		this.data.nodes.remove(this.mountpoint)
		this.$message({
			type: 'success',
			message: '删除成功!'
		});
	}).catch(() => {
		this.$message({
			type: 'info',
			message: '已取消删除'
		});
	});
      console.log("删除");
    },
    runJob(){
      console.log("运行");
    },
    showSchedule(){
      console.log("查看调度计划");
    },
    showNext(){
      console.log("查看依赖");
    },
    appendJob() {
      
},
    
OptionCardClose(event) {
	var currentCli = document.getElementById("option-button-group");
	if (currentCli) {
		if (!currentCli.contains(event.target)) { //点击到了id为option-button-group以外的区域，就隐藏菜单
			this.optionCardShow = false
		}
	}
},
  

  },
 
  mounted() {
    this.init();
    // 左键点击事件，将node或者edge的label值传给form.name,前端右边菜单显示form.name
    this.network.on("click", params => {
      if(params.nodes == undefined || params.nodes.length <= 0){
        // 控制前端edge的名字显示
        if(params.edges != undefined && params.edges.length > 0){
          if(this.data.edges.get(params.edges[0]) != undefined){
          var chooseEdge=this.data.edges.get(params.edges[0])
                    this.form.name=chooseEdge.label
                    this.form.desc=chooseEdge.desc
                    this.form.parent=chooseEdge.parent
                    this.mountpoint=params.edges[0]   
          }
            console.log("点击", params.edges);
        }
      }else{
        // 控制前端node的名字显示
        if(this.data.nodes.get(params.nodes[0]) != undefined){
          var chooseNode=this.data.nodes.get(params.nodes[0])
                    this.form.name=chooseNode.label
                    this.form.desc=chooseNode.desc
                    this.form.parent=chooseNode.parent
                    if(chooseNode.shape == 'box'){
                      this.form.shape='矩形'
                    }else if(chooseNode.shape == 'ellipse'){
                      this.form.shape='椭圆'
                    }
                    this.form.endpoint=chooseNode.endpoint
                    this.mountpoint=params.nodes[0]
                  }
            console.log("点击", params.nodes);
      }

    });
    // 点击鼠标右键事件
    this.network.on("oncontext", params => {
      this.optionCardShow = false
       // 通过节点id 获取节点中心点的在画布的位置
       let nodePosition = this.network.getPositions(this.mountpoint);
       nodePosition = this.network.canvasToDOM(nodePosition[this.mountpoint]);
  // 让右键菜单出现在鼠标右键的位置 
	this.optionCardX = nodePosition.x+100  
	this.optionCardY = nodePosition.y+70
  // 展示右键菜单
	this.optionCardShow = true  
      console.log("右击", params);
      this.dialogVisible = true;
    });
  }
};
</script>
<style >
  .el-main{height:100%;padding:0;margin:0;width:90%;}
  .option-card-button {
	width: 100%;
	font-size: 10px;
	border-radius: 0;
  margin-left: 0px;
}
.el-button+.el-button {
    margin-left: 0px;
}

</style>
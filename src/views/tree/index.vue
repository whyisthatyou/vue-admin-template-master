<template>
  <div class="app-container">
    <el-container>
      <el-asider>
        <el-tree :data="data2"  draggable node-key="id" @node-contextmenu="floderOption">
	<span class="custom-tree-node" slot-scope="{ node, data }">
		<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
		<span style="font-size: 15px;">{{ node.label }}</span>
	</span>
</el-tree>

<div :style="{'z-index': 9999, position: 'fixed',left: optionCardX + 'px', 
				top: optionCardY + 'px', width: '100px', background: 'white',
				 'box-shadow': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}" 
				 v-show="optionCardShow" id="option-button-group">
	<el-button @click="changeJob" class="option-card-button"> 编辑
  </el-button>
	<el-button @click="copyJob" class="option-card-button"> 复制
  </el-button>
	<el-button @click="deleteJob" class="option-card-button"> 删除
  </el-button>
  <el-button @click="appendJob" class="option-card-button"> 新建子任务
  </el-button>
  <el-button @click="runJob" class="option-card-button"> 运行
  </el-button>
  <el-button @click="showSchedule" class="option-card-button"> 查看调度计划
  </el-button>
  <el-button @click="showNext" class="option-card-button"> 查看依赖
  </el-button>
</div>
      </el-asider>
<el-main>


  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</el-main>

    </el-container>
  
  </div>

</template>


<script>
export default {

  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      filterText: '',
      optionCardX:'',
      optionCardY:'',
      optionCardShow:false,
      optionData:[],
      tree:null,
      node:null,
      data2: [{
        id: 1,
        label: '银联全渠道前置',
        children: [{
          id: 4,
          label: '银联传统应用',
          children: [{
            id: 9,
            label: '快赎'
          }, {
            id: 10,
            label: '老代付'
          }]
        }]
      }, {
        id: 2,
        label: '银联二维码前置',
        children: [{
          id: 5,
          label: 'pos扫码'
        }, {
          id: 6,
          label: '二维码取现'
        }]
      }, {
        id: 3,
        label: '银联无卡',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    changeJob(){
      const newChild = {   // 新建一个子节点
			id: 11111,
			label: "value",
			children: []
		};
    this.$set(this.optionData, 'children', []);
		this.optionData.children.push(newChild);  // 插入
		//同时展开节点
		if (!this.node.expanded) {
			this.node.expanded = true
		}
		this.$message({
			type: 'success',
			message: '文件夹新建成功！'
		});
    this.optionCardShow = false
      console.log("编辑");
    },

    copyJob(){
      console.log("复制");
    },

    // 删除作业
    deleteJob(){
	this.optionCardShow = false
	this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		const parent = this.node.parent;
		const children = parent.data.children || parent.data;
		const index = children.findIndex(d => d.id === this.optionData.id);
		children.splice(index, 1);
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
      const newChild = {   // 新建一个子节点
			id: 11111,
			label: "value",
			children: []
		};
    this.$set(this.optionData, 'children', []);
		this.optionData.children.push(newChild);  // 插入
		//同时展开节点
		if (!this.node.expanded) {
			this.node.expanded = true
		}
		this.$message({
			type: 'success',
			message: '文件夹新建成功！'
		});
    this.optionCardShow = false
},
    // 文件夹右键时触发的事件
floderOption(e, data, n, t) {
	this.optionCardShow = false
  // 让右键菜单出现在鼠标右键的位置 
	this.optionCardX = e.x   
	this.optionCardY = e.y
	this.optionData = data
  // 将当前节点保存
	this.node = n 
	this.tree = t
  // 展示右键菜单
	this.optionCardShow = true  
},
OptionCardClose(event) {
	var currentCli = document.getElementById("option-button-group");
	if (currentCli) {
		if (!currentCli.contains(event.target)) { //点击到了id为option-button-group以外的区域，就隐藏菜单
			this.optionCardShow = false
		}
	}
},
  }
}
</script>

<style>
.line{
  text-align: center;
}

.folder-box {
	height: 100%;
}

.option-card-button {
	width: 100%;
	font-size: 10px;
	border-radius: 0;
}

.el-button+.el-button {
    margin-left: 0px;
}
</style>

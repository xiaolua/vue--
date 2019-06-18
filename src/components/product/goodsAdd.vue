<template>
    <el-card>
         <!-- 面包屑 -->
    <BreadNav :navone="'商品管理'" :navtwo="'商品列表'"></BreadNav>
     <el-alert
    title="添加商品信息"
    type="info"
    center show-icon class='alertHeight'> 
  </el-alert>
    <el-steps :active="active" finish-status="success" align-center class="tagheight">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 左侧导航 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" tabPosition="left" class="tabsHeight">
    <el-tab-pane label="基本信息" name="first">
        <!-- 基本信息模块-->
         <el-form :label-position="'top'" :rules="rules" label-width="80px" :model="addObj">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addObj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addObj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数据" prop="goods_number">
            <el-input v-model="addObj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{ cateSelect }}
            <el-cascader v-model="cateSelect" :options="catesList" :props="cateObj"></el-cascader>
          </el-form-item>
        </el-form>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="second">
        <div v-for="(item1,index1) in manyparmas" :key="index1" class="mybtn">
            <h4>{{item1.attr_name}}</h4>
            <div class="mydiv">
                <el-checkbox 
                v-model="check" 
                border 
                v-for="(val,index2) in item1.attr_vals.split(',')" :key="index2">
                    {{val}}
                </el-checkbox>
            </div>
        </div>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="third">
        <div v-for="(item2,index2) in onlyparmas"  :key=index2>
            <h4>{{item2.attr_name}}</h4>
             <el-input v-model="item2.attr_vals" placeholder="请输入内容"></el-input>

        </div>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="fourth">
      
        <el-upload 
  class="upload-demo"
  action="http://localhost:8888/api/private/v1/upload/"
  :on-preview="handlePreview"
  :file-list="fileList"
  :on-remove="handleRemove"
  :on-success="uploadsuccess"
  list-type="picture"
  :headers="uploadHeader">
    
  <el-button size="small" type="primary">点击上传</el-button>
  {{fileList}}
</el-upload>
    </el-tab-pane>

    <el-tab-pane label="商品内容" name="fives">
        <el-button @click='addGoods'>添加商品</el-button>
        <quill-editor v-model="content"></quill-editor>
    </el-tab-pane>
    </el-tabs>

     <!-- 点击图片预览时的对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogImg">
      <img ref="myimg">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogImg = false">确 定</el-button>
      </div>
    </el-dialog>

    </el-card>
</template>

<script>
import BreadNav from '../breadnav/breadnav.vue'
export default {
    data() {
        return {
            active:0,
            activeName:0,
            rules:{
                    goods_name:
                    [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ]
            },
            addObj:{
                goods_name: '',
                goods_price: '',
                goods_weight: '',
                goods_number: ''
            },
            cateSelect:[],//选择的内容
            catesList:[],//数据源
            cateObj:{//这里可以修改默认渲染的名字 要与后台返回来的数据名一致
                value: 'cat_id', // 当前选项对应的值
                label: 'cat_name', // 显示的文本
                expandTrigger: 'hover' // 触发下一层选项的方式
            },
            manyparmas:[],
            onlyparmas:[],
            check:true,
            uploadHeader:{
                Authorization:localStorage.getItem('token')
            },
            fileList:[],
            dialogImg:false,
            content: '我是富文本中的默认值'
        }
    },
    methods: {
        // tag和event参数是自带的 有很多参数 tag其中有一个index
        handleClick(tag,event){
            // 因为tag中的index是字符串 所以要进行转换
            this.active = +tag.index
            // 在这里做判断用户有没有选择商品分类
            if(tag.index==='1' || tag.index==='2'){
                if(this.cateSelect.length == 0){
                    this.$message.error('请选择商品分类')
                    return
                }
               this.test(tag)
            }
        },
        uploadsuccess(res,file,fileList){//上传成功
            this.fileList.push({
                name:res.data.tmp_path,
                url:res.data.url
            })
        },
        handlePreview(file){//图片预览
              this.dialogImg = true
             this.$nextTick(function() {
                this.$refs.myimg.src = file.url
             })
        },
        handleRemove(file){//删除图片
            // 遍历fileList中的数据 当fileList中的文件名等于file.name时 就删除这个元素
            for(var i=0 ; i<this.fileList.length ; i++){
                if(this.fileList[i].name === file.name){
                    this.fileList.splice(i,1)
                }
            }
        },
      async getAllgoods(){
          let res = await this.$http.get(`/categories?type=3`)
          let {meta,data} = res.data
          if(meta.status===200){
              this.catesList = data
          }else {
             this.$message.error(meta.msg)
             }
        },
       async test(tag) {
             // 在这里发送请求
                let id = this.cateSelect[this.cateSelect.length-1]//拿到选择的参数的最后一个数
                let sel = tag.index ==='1' ?'many':(tag.index ==='2'?'only':'')
              let res = await  this.$http.get(`categories/${id}/attributes?sel=${sel}`)
              let {meta,data} = res.data
              if(meta.status == 200){
                  if(tag.index==='1'){
                    this.manyparmas = data
                    console.log(this.manyparmas)
                  }else{
                    this.onlyparmas = data
                  }
              }else{
                  this.$message.error(meta.msg)
              }
        },
        addGoods(){
            let obj = {
                    goods_name:this.addObj.goods_name,
                    goods_cat:this.cateSelect.join(','),
                    goods_price:this.addObj.goods_price,
                    goods_number:this.addObj.goods_number,
                    goods_weight:this.addObj.goods_weight,
                    goods_introduce:this.content,

                }
            this.$http.post('goods',obj).then(res=>{
                let {meta} = res.data
                if(meta.status===201){
                    this.$message({
                        type:'success',
                        message:meta.msg
                    })
                    this.$router.push({name:'goods'})
                }else{
                    this.$message.error(meta.msg)
                }

                console.log(res)
            })
        }
    },
    components:{
        BreadNav
    },
    mounted() {
        this.getAllgoods()
    },
}

</script>

<style scoped>
    .tagheight{
        line-height: 0px;
        font-size: 10px;
    }
    .el-step__title{
        font-size: 12px;
    }
    .alertHeight{
        line-height: 0px;
        margin-top: 20px;
    }
    .tabsHeight{
        line-height: 0px;
        text-align: left;
    }
    .mybtn{
        line-height: 30px;
    }
    h4{
        line-height: 50px;
        font-size: 14px;
        font-weight: normal;
    }
</style>

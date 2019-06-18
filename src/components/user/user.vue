<template>
  <el-card>
    <!-- 面包屑 -->
    <BreadNav :navone="'用户管理'" :navtwo="'用户列表'"></BreadNav>

    <!-- 搜索 -->
    <el-row class="myrow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="SelectSearch" ></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="success" class="addbtn" plain @click="showAdd">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 添加一个表格 -->
    <el-table :border="true" :data="tableData" style="width: 100%" class="tableHeight"> 
      <el-table-column  type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row }}
          <!-- 这里是用户的状态 -->
          <!-- change事件 监听状态是否发生改变 -->
          <el-switch 
          @change='changeStu(scope.row.id,scope.row.mg_state)' 
          v-model="scope.row.mg_state" 
          active-color="#0f0" 
          inactive-color="#f00"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <!-- scope.row可以获取这行的数据 -->
          <!-- 两个按钮 -->
          <!-- 编辑按钮 -->
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="UserEdit(scope.row.id)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="UserDelet(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-user" plain size="mini" @click="rolecheck(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->


      <!-- 新增的对话框 -->
                <!-- 
                el-dialog: 对话框
                visible.sync：控制当前对话框的显示和隐藏
                -->
        <el-dialog title="添加用户" :visible.sync="addDialog" class="DialogHeight">
            <el-form :rules="rules" ref="addForm" :model="formObj">
                <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="formObj.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="formObj.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="formObj.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="formObj.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="postAdd">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑的对话框 -->
         <el-dialog title="编辑用户" :visible.sync="EditDialog" class="DialogHeight">
            <el-form :rules="rules" ref="EditForm" :model="formObj">
                <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
                    <el-input  :disabled="true"  v-model="formObj.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="formObj.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="formObj.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="EditDialog = false">取 消</el-button>
                <el-button type="primary" @click="EidtAdd">确 定</el-button>
            </div>
        </el-dialog>

         <!-- 角色设置的对话框 -->
         <el-dialog title="角色设置" :visible.sync="roleDialog" class="DialogHeight">
            <el-form :rules="rules" ref="RoleForm" :model="formObj">
                <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
                    {{formObj.username}}
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                  {{formObj.rid}}
                     <el-select v-model="formObj.rid" placeholder="请选择">
                       <!-- 新增一条后默认是-1 就设置默认值为请选择 -->
                       <el-option :value="-1" label="请选择"></el-option>
                      <el-option 
                      v-for="item in options" 
                      :key="item.id"  
                      :label="item.roleName"  
                      :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialog = false">取 消</el-button>
                <el-button type="primary" @click="roleAdd">确 定</el-button>
            </div>
        </el-dialog>
  </el-card>
</template>

<script>
import BreadNav from '../breadnav/breadnav.vue'

export default {
  data() {
    return {
      search: "",
      tableData: [],
      pagenum: 1, // 当前页
      pagesize: 20, // 页容量
      formObj: {
        // 表单元素中的数据
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addDialog: false, // 控制新增对话框的显示和隐藏
      EditDialog: false, // 控制编辑对话框的显示和隐藏
      roleDialog: false, // 控制角色对话框的显示和隐藏
      formLabelWidth: "100px", // 文本的宽度
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      options:[]
    };
  },
  methods: {
      getUserList(){
        //   首先得到token
        let token = window.localStorage.getItem('token')
        // 发送请求的时候 要在请求头中添加token
        this.$http.get('users',{
            // 请求头中添加的参数
            headers:{
                Authorization:token
            },
            // 发送请求时自带的参数
            params:{
                pagenum: this.pagenum,
                pagesize: this.pagesize,
                query:this.search//查询的参数
            }
        }).then(res=>{
            // 解析
            let {data,meta} = res.data
            if(meta.status===200){
                this.tableData = data.users
            }
        })
      },
      showAdd(){//点击这个按钮的时候 就显示
          this.addDialog=true
      },
    //   表单提交
      postAdd(){
          let token = window.localStorage.getItem('token')
        //   验证数据是否合法
        this.$refs.addForm.validate(vali=>{
            if(vali){
                // formObj用户输入的数据
                // post参数 第一个时路径
                //  第二个时数据
                // 第三个可以添加其他数据 这里是在请求头里放了一个token
                this.$http.post('users',this.formObj,{
                    headers:{
                        Authorization:token
                    }
                }).then(res=>{
                    // 接受结果 把数据重新渲染在表格上面
                    // 1.解析
                    let {meta} = res.data
                    //2. 判断
                    if(meta.status===201){
                        // 就提示新增成功
                        this.$message({
                            type:'success',
                            message:meta.msg
                        })
                        // 调用getuserlist
                        this.getUserList();
                        // 把表单清空
                        this.formObj.username='';
                        this.formObj.password='';
                        this.formObj.email='';
                        this.formObj.mobile='';
                        // 把面板关掉
                        this.addDialog = false;
                    }else{
                        this.$message.error(meta.msg)
                    }
                })
            }else{
                this.$message.error('参数不合法')
            }
        })
      },
      SelectSearch(){
         this.$message({
                            type:'success',
                            message:'搜索成功'
                        })
        this.getUserList()
      },
      // 编辑按钮的功能
      UserEdit(id){
        this.EditDialog = true;
        let token = window.localStorage.getItem('token')
         this.$http.get(`users/${id}`,{
            headers:{
                Authorization:token
            },
         }).then(res=>{
           this.formObj =res.data.data
           console.log( this.formObj)
         })
      },
      // 编辑按钮提交实现修改功能
      EidtAdd(){
        // 发送请求 带上修改的数据
        this.$http.put(`users/${this.formObj.id}`,{
          // 带上邮箱和手机号
          email:this.formObj.email,
          mobile:this.formObj.mobile
        },{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        }).then(res=>{
          // 解构
          let {meta} = res.data
          if(meta.status===200){
            this.$message({
              type:'success',
              message:meta.msg
            })
            // 关掉弹窗
            this.EditDialog = false;
            this.getUserList()
          }else{
            this.$message.error(meta.msg)
          }
        })
      },
      // 删除按钮的实现
      UserDelet(id){
       if(confirm('你确定要删除吗？')){
           this.$http.delete(`users/${id}`,{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        }).then(res=>{
          let {meta}=res.data
         if(meta.status===200){
            this.$message({
            type:'success',
            message:meta.msg
          })
          this.getUserList()
         }else{
           this.$message.error(meta.msg)
         }
        })
       }
      },
      // 状态按钮
      changeStu(id,state){
        // 请求路径：users/:uId/state/:type
        this.$http.put(`users/${id}/state/${state}`,{},{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        }).then(res=>{
          let {meta} = res.data
          if(meta.status === 200){
            this.$message({
              type:'success',
              message:meta.msg
            })
          }else{
            this.$message.error(meta.msg)
          }
        })
      },
      // 角色按钮的功能实现
      rolecheck(id){
        this.roleDialog = true;
        // 发送请求获取数据到表格上
        this.$http.get(`users/${id}`,{
          headers:{Authorization:localStorage.getItem('token')}
        }).then(res=>{
          let {meta,data} = res.data
          if(meta.status === 200){
            this.formObj = data
          }else{
            this.$message.error(meta.msg)
          }
        })
      },
      // 角色分配的下拉框实现
      roleOption(){
        // 发送get请求roles 
        this.$http.get('roles',
        {
          headers:{
           Authorization:localStorage.getItem('token')
          }
        }).then(res=>{
          console.log(res)
          // 把响应回来的数据放到options中
          this.options = res.data.data

        })
      },
      // 角色分配提交
      roleAdd(){
        // 发送put请求 
        // users/:id/role 带上参数rid 设置响应头中的token
        this.$http.put(`users/${this.formObj.id}/role`,{rid:this.formObj.rid},{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        }).then(res=>{
          let {meta}=res.data
          if(meta.status===200){
            this.$message({
              type:'success',
              message:meta.msg
            })
            // 修改成功后重新渲染列表
            this.getUserList()
          }else{
            this.$message.error(meta.msg)
          }
          this.roleDialog = false;
        })
      }
  },
  mounted() {
    // 获取页面的表格
      this.getUserList()
      // 获取角色分配中的下拉框中的按钮
      this.roleOption()
  },
  components:{
    BreadNav
  }
};
</script>

<style scoped>
.myrow {
  margin-top: 10px;
  line-height: 60px;
}
.tableHeight{
    line-height: 0px;
}
.DialogHeight{
    line-height: 20px;
}

</style>

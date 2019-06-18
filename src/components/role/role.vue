<template>
  <el-card>
   <!-- 面包屑 -->
    <BreadNav :navone="'权限管理'" :navtwo="'角色列表'"></BreadNav>
     <!-- 添加角色 -->
        <el-row class="myrow">
            <el-col :span="2">
                <el-button type="primary" plain @click="BtnAddRole">添加角色</el-button>
            </el-col>
        </el-row>
    <!-- 添加一个表格 -->
    <el-table :border="true" :data="tableData" style="width: 100%" class="tableHeight">
        <!-- 设置展开行  el-table-column中设置属性 type="expand"-->
        <el-table-column type="expand">
            <!-- 设置template标签 -->
            <template slot-scope='scope'>
                <!-- 一行两列 -->
                <el-row v-for="(item,index1) in scope.row.children" :key=index1>
                    <el-col :span='4'>
                        <!-- 第一列 -->
                        <el-tag @close="handleClose(scope.row.id, item.id, scope)" :disable-transitions="false" closable> {{item.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>

                    </el-col>
                    <el-col  :span='20'>
                        <!-- 第二列 -->
                        <el-row v-for="(item2,index2) in item.children" :key=index2>
                            <el-col :span='8'>
                                <el-tag @close="handleClose(scope.row.id, item2.id, scope)" :disable-transitions="false" closable type="success"> {{item2.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>

                            </el-col>
                            <el-col :span='14' >
                                 <el-tag @close="handleClose(scope.row.id, item3.id, scope)" :disable-transitions="false"  closable class="mytag3" type="warning" v-for="(item3,index3) in item2.children" :key=index3> {{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" >
      


      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <!-- </el-table-column> -->
      <el-table-column label="操作"   >
        <template slot-scope="scope">
          <!-- scope可以获取这行的数据 -->
          <!-- 两个按钮 -->
          <!-- 编辑按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="RoleEdit(scope.row.id)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="RoleDel(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-user"
            plain
            size="mini"
            @click="RoleDialog(scope)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->

    <!-- 添加按钮的弹窗 -->
    <el-dialog title="添加角色" :visible.sync="addRole" class="DialogHeight">
            <el-form :rules="rules" ref="addForm" :model="formObj">
                <el-form-item prop="roleName" label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="formObj.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="roleDesc" label="角色描述" :label-width="formLabelWidth">
                    <el-input  v-model="formObj.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRole = false">取 消</el-button>
                <el-button type="primary" @click="RoleAdd">确 定</el-button>
            </div>
        </el-dialog>
    
    <!-- 弹出权限分配列表 -->
      <el-dialog title="权限分配" :visible.sync="roleDialog" class="qxheight">
            <!-- 
                                    props: 用来指定数据源中显示的文本属性&子选项的属性
                                    show-checkbox: 显示多选框
                                    data: 绑定数据源
                                    default-expand-all: 展开所有项
                                    default-checked-keys：设置默认选中
                                    node-key：设置当前节点的唯一标识  node-key="id" 唯一标识就是id
                                    ref="tree" 用来操作dom元素 主要用来可以获取到这行的状态
                                -->
            <el-tree 
            :data="rightsList" 
            :props="props" 
            ref="tree"
             node-key="id" 
             :default-checked-keys="defaultcheck" 
             show-checkbox 
             default-expand-all>
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleDialog = false">取 消</el-button>
                <el-button type="primary" @click="setRight">确 定</el-button>
            </div>
        </el-dialog>
  
  </el-card>
</template>

<script>
import BreadNav from '../breadnav/breadnav.vue'

export default {
    data() {
        return {
            tableData:[],
            addRole:false,
            roleDialog:false,
            rules:{
                roleName:[{required: true, message: "请输入角色名称", trigger: "blur"}],
                roleDesc:[{required: true, message: "请输入角色描述", trigger: "blur"}]
            },
            formObj:{
                roleName:'',
                roleDesc:'',
            },
            formLabelWidth: "100px", // 文本的宽度
            rightsList:[],
            defaultcheck:[],//默认选中
            props:{
                label:'authName'//由于这个组件渲染的名字默认是从lable中渲染 
                                 // 但是后台返回的数据是authName ，所以要把lable改成authName
            },
            roleid:'',//角色id 默认是空的

        }
    },
    methods: {
        getAllRole(){
            this.$http.get('roles',{
                headers:{
                    Authorization:localStorage.getItem('token')
                },
            }).then(res=>{
                this.tableData = res.data.data;
            })
        },
        // 添加角色按钮
        BtnAddRole(){
            this.addRole=true
        },
        // 提交角色的功能 
        RoleAdd(){
            console.log(this.formObj)
            this.$http.post('roles',this.formObj,{
                headers:{Authorization:localStorage.getItem('token')}
            }).then(res=>{
                let {meta} = res.data
                if(meta.status===201){
                    this.$message({
                        type:'success',
                        message:meta.msg
                    })
                    this.addRole=false
                    this.getAllRole()
                }else{
                    this.$message.error('创建失败')
                }
            })
        },
        //删除按钮
        RoleDel(id){
            
            this.$confirm('你确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`roles/${id}`,{
                    headers:{Authorization:localStorage.getItem('token')}
                }).then(res=>{
                    let {meta} = res.data
                    if(meta.status===200){
                         this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                    this.getAllRole()
                })
               
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 权限取消的功能
        // 要传三个参数 第一个是要删除权限的角色 roleid
                    // 第二个是要删除的权限 rightid
                    // 第三个是当前行的数据源
      async  handleClose(roleId,rightId,scope){
        let res = await  this.$http.delete(`roles/${roleId}/rights/${rightId}`)
            // 解构
            let {meta,data} = res.data
            // 判断
            if(meta.status === 200){
                scope.row.children = data
            }else{
                this.$message.error(meta.msg)
            }
        },
        // 打开权限分配列表时获取数据
        RoleDialog(scope){
            // 当这一行被打开时 去获取角色id
            this.roleid  = scope.row.id //这里方便后面提交时 获取到角色id

            this.defaultcheck = [];
            this.roleDialog = true;
            this.$http.get('rights/tree')//发送树形解构请求
            .then(res=>{
                let {meta,data} = res.data
                if(meta.status===200){
                this.rightsList = data      
                // 下面设置默认选中的
                // 选中第三级时会默认把第一级和第二级选中
                scope.row.children.forEach(item1=>{ // 遍历第一层 // 拿到第一层的children
                    item1.children.forEach(item2=>{ // 遍历第二层 // 拿到第二层的children
                        item2.children.forEach(item3=>{// 遍历第三层
                            // 拿到第三层所有的id 把所有的id都添加到 defaultcheck 中 这样就可以实现默认选中
                            let id = item3.id
                            this.defaultcheck.push(id)
                        })
                    })
                })              
                }else{
                    this.$message.error(meta.msg)
                }
            })
        },
        setRight(){
            
            // 下面两个时拿到选中的权限的权限id
            let allcheck = this.$refs.tree.getCheckedKeys() // 获取到选中的按钮
            let halfcheck = this.$refs.tree.getHalfCheckedKeys()//和半选状态的按钮
            // 把两个合并在一起
            let arr = [...allcheck,...halfcheck]
            // 转为字符串
            let rids = arr.join(',')
            // 角色授权  下面时请求时携带的参数
            // :roleId角色 . ID不能为空`携带在url中`
            // rids权限ID列表. 以 `,` 分割的权限ID列表 (每个权限都有对应的id)
            this.$http.post(`roles/${this.roleid}/rights`,{
                rids:rids
            }).then(res=>{
                let {meta} = res.data
                if(meta.status===200){
                    // 提示成功
                    this.$message({
                        type:'success',
                        message:meta.msg
                    })
                    
                    this.getAllRole()
                    
                }else{
                    this.$message.error('分配失败')
                }
                this.roleDialog = false;
            })
        }

    },
    mounted() {
        this.getAllRole()
    },
    components:{
    BreadNav
  }
};
</script>

<style>
.myrow{
    line-height: 0px;
    margin: 15px;
}
.tableHeight{
    line-height: 0px;
}
.mytag3 {
    margin-right: 10px;
    margin-bottom: 10px;
}
.DialogHeight{
    line-height: 0px;
}
.qxheight{
    line-height: 0px
}
</style>

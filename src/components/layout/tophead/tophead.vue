<template>
     <el-row>
          <el-col :span="1">
            <div index='/main' class="grid-content bg-purple" >
                <!-- <img src="../../../../static/vo.jpg" alt="" width="207px" height='60px' > -->
            </div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light">
                <h2>电商后台管理系统</h2>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple logout">
                 <el-button type="primary" plain  @click.prevent="logout">退出</el-button>
                <!-- <a href="#">退出</a> -->
            </div>
          </el-col>
        </el-row>
</template>

<script>
export default {
 methods: {
    logout(){
        this.$confirm('你确认要退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
          window.localStorage.removeItem('token');
          this.$router.push({name:'login'})
        })
      }
  }
}
</script>

<style>

</style>

<template>
  <div class="content">
    <el-container>
      <el-header>
       <Tophead></Tophead>
      </el-header>
      <el-container>
          <!-- 这里是侧边导航 -->
        <el-aside width="200px">
            <Aside></Aside>
        </el-aside>
        <el-main>
         
          <!-- 在内容区域写一个router-viwe -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from './layout/aside/aside.vue'
import Tophead from './layout/tophead/tophead.vue'
export default {
 
  components:{
    Aside,
    Tophead
  },
  mounted() {
    // 拿到token
    var token = window.localStorage.getItem("token");
    // 如果token不存在  那么就跳回登陆也
    if (!token) {
          this.$message.error('请登陆');
        this.$router.push("/login");
    }
  }
}
</script>

<style scope>
.content {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
  height: 100%;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.logout{
    text-align: right;
}
.logout a{
    text-decoration: none;
    color: #000;
}
  .mymenu {
    height: 100%;
  }
 
</style>

<template>
  <el-card>
      <!-- 面包屑 -->
    <BreadNav :navone="'权限管理'" :navtwo="'权限列表'"></BreadNav>
   
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" class="rightTable">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column  label="层级">
          <template slot-scope='scope'>
              {{scope.row.level==='0'?'一级':(scope.row.level==='1'?'二级':'三级')}}
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import BreadNav from '../breadnav/breadnav.vue'

export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    getAllRight() {
      this.$http.get("rights/list", {
        headers: {Authorization:localStorage.getItem('token')}
      }).then(res=>{
          let {meta} = res.data
          if(meta.status === 200){
              this.tableData = res.data.data
          }
      })
    }
  },
  mounted() {
      this.getAllRight()
  },
  components:{
    BreadNav
  }
};
</script>

<style>
.rightTable{
    line-height: 0px;
    margin-top: 20px;
}
</style>

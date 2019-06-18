<template>
  <!-- 面包屑导航的封装 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{navone}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{navtwo}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    props:['navone','navtwo']
}
</script>

<style>

</style>

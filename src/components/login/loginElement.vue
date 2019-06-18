<template>
  <div class="loginbox">
    <!-- 表单验证第一步 设置 :rules="rules" -->
    <el-form
      label-position="top"
      :rules="rules"
      :model="ruleForm"
      status-icon
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <h3>用户登录</h3>
      <el-form-item label="用户名" prop="username">
        <!-- 第二步 prop="username"用户名绑定 -->
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 第二步 prop="password"密码绑定 -->
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="mybtn" type="primary" v-on:keyup.enter="submit" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户对象
      ruleForm: {
        username: "",
        password: ""
      },
      // 验证规则
      rules: {
        // 用户名的验证规则
        // required:true这个属性是必须的 不存在时就提示 当失去焦点时触发
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$http.post("login", this.ruleForm).then(res => {
            let { data, meta } = res.data;
            if (meta.status === 200) {
              // 弹出eleemnt组件中的$mesasage 方法中的成功消息提示
              this.$message({
                  message:meta.msg,
                  type:'success'
              })
              // 1.先把token保存再跳转
              window.localStorage.setItem('token',res.data.data.token)
              this.$router.push('/home')
            }else{
                this.$message.error(meta.msg)
            }
          });
        } else {
          // 弹出eleemnt组件中的$mesasage 方法中的错误消息提示
          this.$message.error("用户名或密码不正确");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
/* scoped 只在这个组件生效 */
.loginbox {
  padding: 40px;
  width: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border-radius: 10px;
  background-color: #fff;
}

.loginbox .mybtn {
  width: 100%;
}
</style>


<template>
  <div class="app-wrapper login-container">
    <div class="form-content-login">
      <div class="form-left">
        <div>
          <div class="form-left-name">雄安调蓄库工程智慧管理平台</div>
          <div class="form-version">V{{ version }}</div>
        </div>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-right login-form"
        autocomplete="off"
        label-position="left"
        @keydown.enter="handleLogin"
      >
        <el-form-item prop="username" class="login-item">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            autocomplete="off"
            class="login-input"
          />
        </el-form-item>
        <el-form-item prop="password" class="login-item">
          <el-input
            v-model="loginForm.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="请输入密码"
            autocomplete="off"
            class="login-input"
          />
        </el-form-item>
        <div class="remember-item">
          <el-checkbox v-model="remember">记住密码</el-checkbox>
        </div>
        <div class="btn-content" @click="handleLogin">
          <el-button type="primary" class="login-btn" :loading="loading">
            登录
          </el-button>
        </div>
        <div class="error-row" v-if="errorMsg">
          <span class="errorMsg">{{ errorMsg }}</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import pkg from "../../../package.json";

export default {
  name: "LoginPage",
  data() {
    return {
      version: pkg.version || "",
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      remember: false,
      loading: false,
      errorMsg: "",
      passwordVisible: false,
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          this.errorMsg = "*请输入正确的账号或密码";
          return;
        }
        this.errorMsg = "";
        this.loading = true;
        this.$router.push({ path: "/homeIndex/index" }).finally(() => {
          this.loading = false;
        });
      });
    },
  },
};
</script>

<style lang="scss">
.app-wrapper.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #014acb 0%, #02142f 60%, #014acb 100%);
}

.form-content-login {
  display: flex;
  width: 880px;
  max-width: 95%;
  min-height: 420px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  background: #ffffff;
}

.form-left {
  width: 40%;
  padding: 16px;
  background: linear-gradient(180deg, #014acb 0%, rgba(1, 109, 203, 0.06) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-left-name {
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  margin-top: 12px;
}

.form-version {
  margin-top: 8px;
  font-size: 12px;
  color: #c0d5ff;
  text-align: center;
}

.login-form {
  width: 60%;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-item {
  margin-bottom: 24px;
}

.login-input .el-input__inner {
  border-radius: 6px;
}

.remember-item {
  margin-bottom: 24px;
}

.btn-content {
  display: flex;
  justify-content: center;
}

.login-btn {
  width: 100%;
}

.error-row {
  margin-top: 8px;
}

.errorMsg {
  color: #f56c6c;
  font-size: 12px;
}
</style>

<template>
  <div class="app-wrapper login-container">
    <div class="login-bgImg">
      <img
        :src="require('@/assets/img/login/bg1.png')"
        :style="{ opacity: imgIndex === 0 ? '1' : '0' }"
      />
      <img
        :src="require('@/assets/img/login/bg2.png')"
        :style="{ opacity: imgIndex === 1 ? '1' : '0' }"
      />
      <img
        :src="require('@/assets/img/login/bg3.png')"
        :style="{ opacity: imgIndex === 2 ? '1' : '0' }"
      />
      <img
        :src="require('@/assets/img/login/bg4.png')"
        :style="{ opacity: imgIndex === 3 ? '1' : '0' }"
      />
      <div class="login-bgImg-dots">
        <div :class="{ active: imgIndex === 0 }" @click="clickImgBar(0)"></div>
        <div :class="{ active: imgIndex === 1 }" @click="clickImgBar(1)"></div>
        <div :class="{ active: imgIndex === 2 }" @click="clickImgBar(2)"></div>
        <div :class="{ active: imgIndex === 3 }" @click="clickImgBar(3)"></div>
      </div>
    </div>

    <transition name="el-fade-in">
      <div class="form-content-login" v-show="showLoginDialog">
        <div class="form-left">
          <div class="form-left-panel">
            <img
              class="form-left-zgxa"
              :src="require('@/assets/img/login/zgxa.png')"
            />
            <span class="form-left-name">雄安调蓄库工程智慧管理平台</span>
            <span class="form-version">V{{ version }}</span>
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
          <el-form-item prop="" class="login-title">
            <span>欢迎登录</span>
            <img
              class="login-title-arrow"
              :src="require('@/assets/img/login/arrow.png')"
            />
          </el-form-item>
          <el-form-item prop="username" class="login-item">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入账号"
              autocomplete="off"
              class="login-input"
            >
              <template #prefix>
                <img
                  class="login-prefix-icon"
                  :src="require('@/assets/img/login/user.png')"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password" class="login-item">
            <div class="password-wrapper">
              <el-input
                ref="password"
                v-model="loginForm.password"
                :type="passwordVisible ? 'text' : 'password'"
                placeholder="请输入密码"
                autocomplete="off"
                class="login-input"
                @keyup="checkCapslock"
                @blur="capsTooltip = false"
              >
                <template #prefix>
                  <img
                    class="login-prefix-icon"
                    :src="require('@/assets/img/login/lock.png')"
                  />
                </template>
              </el-input>
              <div class="password-toggle" @click="togglePasswordVisible">
                <img
                  v-if="passwordVisible"
                  class="pwdIcon"
                  :src="require('@/assets/img/login/view.png')"
                />
                <img
                  v-else
                  class="pwdIcon"
                  :src="require('@/assets/img/login/mask.png')"
                />
              </div>
            </div>
          </el-form-item>
          <el-row style="height: 20px">
            <span class="errorMsg" v-if="errorMsg">{{ errorMsg }}</span>
          </el-row>
          <div class="remember-item">
            <el-checkbox v-model="remember">记住密码</el-checkbox>
          </div>
          <div class="btn-content" style="cursor: pointer" @click="handleLogin">
            <span class="login-img">登录</span>
          </div>
        </el-form>
      </div>
    </transition>

    <div class="login-enter" v-show="!showLoginDialog">
      <span @click="showLoginForm">登录</span>
    </div>
  </div>
</template>

<script>
import pkg from "../../../package.json";
import config from "@/utils/config";
import { getLoginPublicKey, getConfig, repeatedLogin } from "@/api/user";
import JSEncrypt from "jsencrypt";

export default {
  name: "LoginPage",
  data() {
    return {
      version: pkg.version || "",
      loginForm: {
        username: "super",
        password: "Jh@12345",
        kaptcha: "",
      },
      loginRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      remember: false,
      loading: false,
      errorMsg: "",
      passwordVisible: false,
      showLoginDialog: true,
      imgIndex: 0,
      imgTimer: null,
      capsTooltip: false,
      pubKey: "",
      configData: {},
      redirect: "",
      otherQuery: {},
    };
  },
  created() {
    this.loadRememberInfo();
    this.startImgTimer();
    this.initRouteQuery();
    this.initConfig();
  },
  beforeUnmount() {
    if (this.imgTimer) {
      clearInterval(this.imgTimer);
      this.imgTimer = null;
    }
  },
  methods: {
    initRouteQuery() {
      const route = this.$route;
      if (!route || !route.query) {
        return;
      }
      const query = route.query;
      const otherQuery = {};
      Object.keys(query).forEach((key) => {
        if (key !== "redirect") {
          otherQuery[key] = query[key];
        }
      });
      this.redirect = query.redirect || "";
      this.otherQuery = otherQuery;
    },
    async initConfig() {
      try {
        const res = await getConfig();
        if (res && res.success) {
          this.configData = res.data || {};
        }
      } catch (e) {
        // 忽略配置获取错误，登录流程仍可继续
      }
    },
    async fetchLoginPublicKey() {
      try {
        console.log("获取公钥");
        const res = await getLoginPublicKey();
        if (!res || !res.success) {
          this.errorMsg = "*获取公钥失败:" + (res && res.message || "");
          throw new Error(this.errorMsg);
        }
        this.pubKey = res.data;
        return this.pubKey;
      } catch (error) {
        this.errorMsg = "*获取公钥失败";
        throw error;
      }
    },
    encryptPassword(password) {
      if (!password) {
        return "";
      }
      if (!this.pubKey) {
        return password; // 原项目在没有公钥时会使用明文
      }
      try {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(this.pubKey);
        const encrypted = encrypt.encrypt(password);
        if (!encrypted) {
          this.errorMsg = "*密码加密失败";
          return "";
        }
        return encrypted;
      } catch (error) {
        this.errorMsg = "*密码加密过程出错";
        console.error("加密错误:", error);
        return "";
      }
    },
    loadRememberInfo() {
      try {
        const saved = localStorage.getItem("loginRememberInfo");
        if (!saved) {
          return;
        }
        const info = JSON.parse(saved);
        this.loginForm.username = info.username || "";
        if (info.remember && info.password) {
          this.loginForm.password = window.atob(info.password);
          this.remember = true;
        }
      } catch (e) {
        // ignore parse/storage error
      }
    },
    startImgTimer() {
      if (this.imgTimer) {
        clearInterval(this.imgTimer);
      }
      this.imgTimer = setInterval(() => {
        this.imgIndex = (this.imgIndex + 1) % 4;
      }, 10000);
    },
    clickImgBar(index) {
      this.imgIndex = index;
      this.startImgTimer();
    },
    showLoginForm() {
      this.showLoginDialog = true;
    },
    togglePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) {
          this.errorMsg = "*请输入正确的账号或密码";
          return;
        }
        this.errorMsg = "";

        const rememberInfo = {
          username: this.loginForm.username,
          remember: this.remember,
          password: this.remember ? window.btoa(this.loginForm.password) : "",
        };
        try {
          localStorage.setItem(
            "loginRememberInfo",
            JSON.stringify(rememberInfo)
          );
        } catch (e) {
          // ignore storage error
        }

        const doAfterLoginSuccess = async () => {
          try {
            await this.$store.dispatch("user/getInfo");
          } catch (e) {
            // ignore getInfo error, 页面依然可以进入
          }
          const targetPath =
            (this.redirect && this.redirect !== "/login" && this.redirect) ||
            config.getLoginedPath() ||
            "/homeIndex/index";
          config.init(() => {
            this.$router
              .push({
                path: targetPath,
                query: this.otherQuery,
              })
              .catch(() => {});
          });
        };

        this.loading = true;
        try {
          await this.fetchLoginPublicKey();
          const encryptedPassword = this.encryptPassword(
            this.loginForm.password
          );
          const submitData = {
            username: this.loginForm.username,
            password: encryptedPassword,
            kaptcha: this.loginForm.kaptcha || "",
          };
          const res = await this.$store.dispatch("user/login", submitData);
          if (res && res.success) {
            try {
              const repeatRes = await repeatedLogin();
              if (
                repeatRes &&
                !repeatRes.success &&
                repeatRes.message === "请修改密码"
              ) {
                this.$router
                  .push({
                    path: this.redirect || "/",
                    query: this.otherQuery,
                  })
                  .catch(() => {});
                return;
              }
            } catch (e) {
              // ignore repeatedLogin error
            }

            await doAfterLoginSuccess();
          } else if (res && res.message) {
            this.errorMsg = "*" + res.message;
          } else {
            this.errorMsg = "*登录失败";
          }
        } catch (e) {
          this.errorMsg = "*登录异常";
        } finally {
          this.loading = false;
        }
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
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #014acb 0%, #02142f 60%, #014acb 100%);
}

.login-bgImg {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
}

.login-bgImg img {
  width: 100%;
  height: 100%;
  position: absolute;
  transition: opacity 2s linear;
}

.login-bgImg-dots {
  position: absolute;
  bottom: 32px;
  left: 100px;
  display: flex;
}

.login-bgImg-dots div {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 8px;
  margin: 0 6px;
  cursor: pointer;
  position: relative;
}

.login-bgImg-dots div::before {
  content: "";
  width: 0;
  height: 100%;
  border-radius: 8px;
  background-color: #ffffff;
  position: absolute;
}

.login-bgImg-dots .active {
  width: 50px;
  background: #d6d6d6;
}

.login-bgImg-dots .active::before {
  width: 100%;
  transition: width 10s linear;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-left {
  width: 40%;
  padding: 16px;
  background: linear-gradient(180deg, #014acb 0%, rgba(1, 109, 203, 0.06) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-left-panel {
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
}

.form-left-zgxa {
  width: 142px;
  height: 145px;
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

.login-title {
  margin-bottom: 24px;
}

.login-title-arrow {
  padding-left: 9px;
  width: 30px;
}

.login-item {
  margin-bottom: 24px;
}

.login-input .el-input__inner {
  border-radius: 10px;
  height: 100%;
}

.login-prefix-icon {
  margin-top: 19px;
  width: 16px;
  height: 18px;
}

.password-wrapper {
  position: relative;
  height: 100%;
  display: flex;
}

.password-toggle {
  position: absolute;
  right: 20px;
  top: 20px;
}

.pwdIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.remember-item {
  margin-top: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.btn-content {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.login-img {
  display: inline-block;
  width: 100%;
  height: 56px;
  line-height: 56px;
  background: #014acb;
  box-shadow: 0 4px 10px rgba(8, 56, 99, 0.15);
  border-radius: 2px;
  text-align: center;
  font-family: MiSans, MiSans;
  font-weight: 600;
  font-size: 24px;
  color: #ffffff;
}

.error-row {
  margin-top: 8px;
}

.errorMsg {
  color: #f56c6c;
  font-size: 12px;
}

.login-enter {
  position: absolute;
  bottom: 70px;
  right: 80px;
  cursor: pointer;
  color: #ffffff;
}
</style>

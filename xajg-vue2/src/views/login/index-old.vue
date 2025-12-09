<template>
  <div class="login-container">
    <div class="login-logo"></div>
    <div class="page-content">
      <div class="login-left"></div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-right login-form"
        autocomplete="on"
        label-position="left"
        @keydown.native.enter="handleLogin"
      >
        <div class="title-container">
          <div class="login-ico"></div>
          <div class="title">雄安水电站前期工程现场数字化指挥平台</div>
        </div>

        <el-form-item prop="username" class="login-item">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入账号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
            class="login-input"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>

        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password" class="login-item">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              prefix-icon="el-icon-lock"
              class="login-input"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            >
              <template slot="suffix">
                <span class="show-pwd" @click="showPwd">
                  <i class="el-input__icon el-icon-view" />
                </span>
              </template>
            </el-input>
          </el-form-item>
        </el-tooltip>
        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item prop="kaptcha" class="login-item">
              <el-input
                v-model="loginForm.kaptcha"
                placeholder="请输入验证码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <img
              class="kaptcha"
              :src="kaptcha"
              title="点击更换验证码"
              @click="getKaptcha"
            />
          </el-col>
        </el-row>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <el-checkbox v-model="remenber">记住密码</el-checkbox>
        </div>
        <div class="btn-content">
          <el-button
            :loading="loading"
            type="primary"
            class="login-btn"
            @click.native.prevent="handleLogin"
          >
            登录
          </el-button>
        </div>
        <div class="login-app">
          <div>
            <div class="description" @click="downAppHandle">APP下载</div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { getKaptcha, getLoginPublicKey } from "@/api/user";
import { JSEncrypt } from "jsencrypt";
export default {
  name: "Login",
  data() {
    // eslint-disable-next-line no-unused-vars
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    // eslint-disable-next-line no-unused-vars
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      remenber: true,
      loginForm: {
        username: "",
        password: "",
        kaptcha: "",
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: "请输入账号" }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        // kaptcha: [{ required: true, trigger: "blur", message: "请输入验证码" }],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: '/mdgHome',
      otherQuery: {},
      kaptchaConfig: null,
      kaptcha: null,
      pubKey: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          // this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
    this.getLoginPublicKey();
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    /** */
    downAppHandle() {
      this.$message.info("功能开发中...");
    },
    /* 获取图片验证码 */
    getKaptcha() {
      const data = getKaptcha().then((res) => {
        this.kaptchaConfig = res.data;
        if (
          res.success &&
          res.data &&
          res.data.images &&
          res.data.images.length > 0
        ) {
          this.kaptcha = res.data.images[0].image;
          console.log("kaptcha", this.kaptcha);
        }
      });
    },
    encrypt(str) {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.pubKey);
      return encrypt.encrypt(str);
    },
    getLoginPublicKey() {
      try {
        getLoginPublicKey().then((res) => {
          if (!res.success) {
            return this.$message.error("获取公钥失败: + res.message");
          }
          this.pubKey = res.data;
          this.getKaptcha();
        });
      } catch (error) {
        this.$message.error("获取公钥失败: + error");
      }
    },

    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const submitData = {
            ...this.loginForm,
            password: this.encrypt(this.loginForm.password),
          };
          this.$store
            .dispatch("user/login", submitData)
            .then((res) => {
              if (res.success) {
                this.$router.push({
                  path: this.redirect || "/homeIndex/index",
                  query: this.otherQuery,
                });
                this.loading = false;
              } else {
                this.getKaptcha();
                this.$message.error(res.message);
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  background-image: url("~@/assets/img/login/bg1.png");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;

  .login-logo {
    width: 429px;
    height: 79px;
    position: absolute;
    top: 40px;
    left: 25px;
    background-image: url("~@/assets/img/login/logo.png");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
    }
  }

  .el-form-item {
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    color: #454545;
  }
  .footer {
    position: fixed;
    bottom: 5px;
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    font-size: 12px;
    color: white;
    margin-bottom: 10px;
  }
  .a-btn {
    color: #00bfff;
    cursor: pointer;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #69767e;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .page-content {
    width: 1118px;
    height: 650px;
    display: flex;
    position: relative;
    background: #ffffff;
    box-shadow: 0px 4px 4px 0px rgba(21, 53, 81, 0.25);
    border-radius: 4px 4px 4px 4px;
    .login-app {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #333333;
      justify-content: space-around;
      cursor: pointer;
      padding: 0 40px;
      .logo-app-qrcode {
        width: 120px;
        height: 120px;
        margin-right: 50px;
      }
      .title {
        font-size: 32px;
        margin-bottom: 20px;
        font-size: 25px;
        display: flex;
        align-items: center;
        flex-direction: row;
      }
      .description {
        text-align: center;
        width: 89px;
        height: 30px;
        font-size: 20px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #3b9ff3;
        line-height: 23px;
        letter-spacing: 2px;
        -webkit-background-clip: text;
      }
    }
  }
  .login-left {
    width: 654px;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-image: url("~@/assets/img/login/left.png");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .login-right {
    width: 50%; //calc(100% - 654px);
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
  }
  .login-form {
    padding: 50px;
    overflow: hidden;

    .login-item {
      width: 100%;
      height: 68px;
      background: #ffffff;
      border-radius: 10px;
      opacity: 1;
      border: 1px solid #3b9ff3;

      ::v-deep .el-form-item__content {
        width: 100%;
        height: 100%;
        background: #ffffff;
        border-radius: 10px;

        .el-input,
        .el-input__inner {
          height: 100%;
          border-radius: 10px;
        }
      }

      ::v-deep .el-input__prefix {
        font-size: 20px;
        top: 5px;
        left: 10px;
      }
    }
    .login-input {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 10px;

      ::v-deep .el-input__inner {
        height: 100%;
        text-indent: 25px;
        border-radius: 10px;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .login-ico {
      height: 72px;
      width: 72px;
      margin: auto;
      background-image: url("~@/assets/img/login/login-icon.png");
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .sub-title {
      color: #1a74f0;
      // font-size: 24px;
      font-weight: bold;
      text-align: left;
      margin-top: 70px;
    }
    .title {
      font-size: 32px;
      color: #3b9ff3;
      margin: 20px auto 50px auto;
      text-align: center;
      font-weight: bold;
      // background-image: -webkit-gradient(
      //   linear,
      //   left top,
      //   right top,
      //   color-stop(0, #f7af17),
      //   color-stop(1, #5358ee)
      // );
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
    }
  }

  .show-pwd {
    margin-right: 14px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .btn-content {
    width: 100%;
    margin-top: 5px;
    display: flex;

    .login-btn {
      width: 286px;
      height: 48px;
      background: #3b9ff3;
      border-radius: 6px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      margin: auto;
    }
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
.kaptcha {
  position: relative;
  top: 5px;
  display: inline-block;
  cursor: pointer;
  width: 100px;
  height: 60px;
  border-radius: 10px;
}
</style>

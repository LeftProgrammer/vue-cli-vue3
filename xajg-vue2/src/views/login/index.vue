<template xmlns="http://www.w3.org/1999/html">
  <div class="app-wrapper login-container position-relative">
    <div
      class="mask position-absolute bg-fff w-100pre h-100pre index-999"
      v-if="showMask"
    >
      <div
        class="mask-content"
        style="width: 500px; height: 200px; border-radius: 10px; font-size: 20px"
      >
        <div>
          请等待
          <span style="font-size: 40px; color: red"> {{ seconds }} </span>
          秒可对系统功能进行操作！
          <el-tooltip placement="right-end">
            <div slot="content">
              主账号同意登录后方可登录。若{{
                loginWaitSecond
              }}秒<br />后主账号未操作，可直接进入系统。
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="pt-30 pl-350" style="display: flex; justify-content: flex-end">
          <el-button type="primary" round @click="hideMask">关闭</el-button>
        </div>
      </div>
    </div>
    <!-- 背景图片盒子 -->
    <div class="login-bgImg">
      <img
        :src="require('@/assets/img/login/bg1.png')"
        :style="{ opacity: imgIndex == 0 ? '1' : '0' }"
      />
      <img
        :src="require('@/assets/img/login/bg2.png')"
        :style="{ opacity: imgIndex == 1 ? '1' : '0' }"
      />
      <img
        :src="require('@/assets/img/login/bg3.png')"
        :style="{ opacity: imgIndex == 2 ? '1' : '0' }"
      />
      <img
        :src="require('@/assets/img/login/bg4.png')"
        :style="{ opacity: imgIndex == 3 ? '1' : '0' }"
      />
      <div>
        <div :class="{ active: imgIndex == 0 }" @click="clickImgBar(0)"></div>
        <div :class="{ active: imgIndex == 1 }" @click="clickImgBar(1)"></div>
        <div :class="{ active: imgIndex == 2 }" @click="clickImgBar(2)"></div>
        <div :class="{ active: imgIndex == 3 }" @click="clickImgBar(3)"></div>
      </div>
    </div>
    <!--    <div class="login-logo"></div>-->
    <!--    <div class="video">-->
    <!--      <video id="indexVideo" :src="publicPath + '/video/indexVideo.mp4'" autoplay="autoplay"></video>-->
    <!--    </div>-->
    <!--    <div class="download-qrcode" @click="showDownload = !showDownload" style="right: 355px">-->
    <!--      <div class="" style="cursor: pointer">-->
    <!--        <img :src="require('@/assets/img/login/downloadApp.png')"/>-->
    <!--        &lt;!&ndash;        <span>APP</span>&ndash;&gt;-->
    <!--      </div>-->
    <!--      <transition name="el-fade-in">-->
    <!--        <div class="download-qrcode-dialog" v-show="showDownload"></div>-->
    <!--      </transition>-->
    <!--    </div>-->
    <!--    <div class="download-qrcode sound-switch" @click="soundSwitch = !soundSwitch">-->
    <!--      <div class="" style="cursor: pointer">-->
    <!--        <img :src="require(soundSwitch-->
    <!--          ? '@/assets/img/login/offSound.png'-->
    <!--          : '@/assets/img/login/openSound.png')-->
    <!--          "-->
    <!--        />-->
    <!--      </div>-->
    <!--    </div>-->
    <transition name="el-fade-in">
      <div class="form-content-login" v-show="showLoginDialog">
        <div style="padding: 8px" class="form-left">
          <div
            style="
              background: linear-gradient(180deg,#014acb 0%,rgba(1, 109, 203, 0.06) 100%);
              padding: 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              flex-direction: column;
            "
          >
            <img class="form-left-zgxa" :src="require('@/assets/img/login/zgxa.png')" />
            <span class="form-left-name">雄安调蓄库工程智慧管理平台</span>
            <span class="form-version">{{ version }}</span>
          </div>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-right login-form"
          autocomplete="off"
          label-position="left"
          @keydown.native.enter="handleLogin"
        >
          <el-form-item prop="" class="login-title">
            <span>欢迎登录</span>
            <img
              style="padding-left: 9px; width: 30px"
              :src="require('@/assets/img/login/arrow.png')"
            />
          </el-form-item>
          <el-form-item prop="username" class="login-item">
            <!-- 密码弹窗 -->
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入账号"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="off"
              class="login-input"
              @focus="usernameFocus"
              @blur="userListVisible = false"
            >
              <template slot="prefix">
                <img
                  style="margin-top: 19px; width: 16px; height: 18px"
                  :src="require('@/assets/img/login/user.png')"
                />
              </template>
            </el-input>
            <el-popover placement="center" style="width: 100%" v-model="userListVisible">
              <div class="w-200" style="overflow: auto; max-height: 500px">
                <div
                  @click="comfirmUser(item)"
                  v-for="(item, index) in userList"
                  :key="index"
                  class="user-item rounded-8 p-5"
                >
                  <div>{{ item.username }}</div>
                  <div>******</div>
                </div>
              </div>
            </el-popover>
          </el-form-item>

          <el-form-item prop="password" class="login-item">
            <div class="flex h-100pre position-relative">
              <PwInput
                v-if="isPwd"
                :placeholder="'输入密码'"
                :value="passwordValue"
                v-model="loginForm.password"
              >
              </PwInput>
              <el-input
                v-else
                type="text"
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                placeholder="请输入密码"
                name="password"
                tabindex="2"
                autocomplete="off"
                class="login-input"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
                @keydown="handleKeyDown"
              >
                <template slot="prefix">
                  <img
                    style="margin-top: 19px; width: 16px; height: 18px"
                    :src="require('@/assets/img/login/lock.png')"
                  />
                </template>
              </el-input>
              <div class="position-absolute right-20 top-20">
                <img
                  class="pwdIcon"
                  v-if="isPwd"
                  @click="changePwd"
                  :src="require('@/assets/img/login/mask.png')"
                />
                <img
                  class="pwdIcon"
                  v-else
                  @click="changePwd(password)"
                  :src="require('@/assets/img/login/view.png')"
                />
              </div>
            </div>
          </el-form-item>
          <el-row :gutter="20" v-if="kaptchaType === 0">
            <el-col :span="15">
              <el-form-item prop="kaptcha" class="login-item">
                <el-input v-model="loginForm.kaptcha" placeholder="请输入验证码" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <div
                style="
                  background: #fff;
                  border-radius: 10px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <img
                  class="kaptcha"
                  :src="kaptcha"
                  title="点击更换验证码"
                  @click="getKaptcha"
                />
              </div>
            </el-col>
          </el-row>
          <el-row style="height: 20px">
            <span class="errorMsg" v-show="errorMsg">{{ errorMsg }}</span>
          </el-row>
          <div class="remember-item">
            <el-checkbox v-model="remenber"> 记住密码</el-checkbox>
          </div>
          <div class="btn-content" style="cursor: pointer" @click="handleLogin">
            <span class="login-img" :loading="loading">登录</span>
          </div>
        </el-form>
      </div>
    </transition>
    <div style="position: absolute; bottom: 70px; right: 80px" v-show="!showLoginDialog">
      <!--      <img style="cursor: pointer" :src="require('@/assets/img/login/loginButton.png')" @click="showLoginForm"/>-->
      <span @click="showLoginForm">登录</span>
    </div>

    <div class="slide-kaptcha-main" v-if="kaptchaType === 1" v-show="kaptchaBoxShow">
      <div class="slide-fade"></div>
      <div class="kaptcha-main-box">
        <div class="kaptcha-main">
          <div
            class="image-box"
            id="clickRectDiv"
            @click.prevent.stop="handleKaptchaClick"
          >
            <img :src="kaptcha" />
          </div>
          <div class="slide-box">
            <div class="slide-rect">
              <span>{{ kaptchaMsg }}</span>
            </div>
          </div>
        </div>
        <div class="kaptcha-footer">
          <i
            title="取消"
            @click="handleKaptchaBoxClose"
            class="el-icon-circle-close icon-footer"
          ></i>
          <i title="刷新" @click="getKaptcha" class="el-icon-refresh icon-footer"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import config from "@/utils/config";
import { getKaptcha, getLoginPublicKey, repeatedLogin, getConfig } from "@/api/user";
import JSEncrypt from "@/utils/jsencrypt.min.js";
import { removeCookie } from "@szgc/plt-core";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { getToken, removeToken, setToken } from "../../utils/auth";
import { socket } from "@szgc/plt-core";
import heatbeat from "@/utils/heatbeat";
import pkg from '../../../package.json';
import PwInput from "./passWord";
import { warningStatByType } from "@/views/home/api";
import { mapGetters } from "vuex";
import mdgWarning from "@/views/home/components/mdgWarning.vue";
import { version } from "nprogress";

export default {
  components: {
    mdgWarning,
    PwInput
  },
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
      isPwd: true,
      passwordValue: "",
      version:"",
      password: "",
      domain: window.location.hostname,
      publicPath: window.location.origin + process.env.BASE_URL,
      remenber: false,
      errorMsg: "",
      showDownload: false,
      soundSwitch: false,
      showLoginDialog: true,
      loginForm: {
        username: "",
        password: "",
        kaptcha: ""
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: " " }],
        password: [{ required: true, trigger: "blur", message: " " }]
        // kaptcha: [{ required: true, trigger: "blur", message: "请输入验证码" }],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: "",
      otherQuery: {},
      kaptchaConfig: null,
      //验证码图片
      kaptcha: null,
      //验证码类型：0 数字图片，1 点击文字
      kaptchaType: 1,
      //点击文字的描述
      kaptchaMsg: "",
      //点击文字验证码弹窗
      kaptchaBoxShow: false,
      //点击文字次数
      kaptchaClickNum: 0,
      //点击文字标准次数
      kaptchaClickSize: 3,
      //点击文字的坐标值
      kaptchaPositions: [],

      pubKey: "",
      config: {},
      showMask: false,
      timer: null,
      userList: [],
      userListVisible: false,
      showPassWord: false,
      //登录等候秒
      loginWaitSecond: this.$store.state.systemConfig?.loginWaitSecond || 20,
      seconds: this.$store.state.systemConfig?.loginWaitSecond || 20,
      imgIndex: 0,
      imgTimer: null
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
      immediate: true
    },
    soundSwitch: {
      handler: function (val) {
        console.log(val);
        // 视频切换静音
        let indexVideo = document.getElementById("indexVideo");
        indexVideo.muted = !val;
      }
    }
  },
  created() {
    heatbeat.clear();

    // this.getLoginPublicKey();
    this.getConfig();
    // 获取用户登陆列表
    this.getLocalUserList();
    this.imgTimer = setInterval(() => {
      if (this.imgIndex == 3) this.imgIndex = 0;
      else this.imgIndex += 1;
    }, 10000);
    this.getVersion();
  },
  mounted() {
    //this.initVideo();
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
    clearInterval(this.imgTimer);
    clearInterval(this.timer);
  },
  methods: {
    getVersion(){
      this.version='v'+pkg.version
    },
    clickImgBar(index) {
      clearInterval(this.imgTimer);
      this.imgIndex = index;
      this.imgTimer = setInterval(() => {
        if (this.imgIndex == 3) this.imgIndex = 0;
        else this.imgIndex += 1;
      }, 2000);
    },
    //清空点击
    clearKaptchaClick() {
      let clickDivDom = document.querySelector("#clickRectDiv");
      let doms = clickDivDom.querySelectorAll(".position-text");
      if (doms && doms.length > 0) {
        for (let i = doms.length - 1; i >= 0; i--) {
          const dom = doms[i];
          clickDivDom.removeChild(dom);
        }
      }
    },
    //验证码点击时
    handleKaptchaClick(e) {
      const event = e || window.event;
      event.preventDefault && event.stopPropagation(); //阻止文字选中等 浏览器默认事件
      let clickDivDom = document.querySelector("#clickRectDiv");
      // const rectPos = clickDivDom.getBoundingClientRect();
      const left = e.offsetX; //e.pageX - rectPos.x;
      const top = e.offsetY; //e.pageY - rectPos.y;
      if (left < 0 || top < 0) {
        return false;
      }
      const div = document.createElement("div");
      div.className = "position-text";
      div.style.left = left - 16 + "px";
      div.style.top = top - 16 + "px";
      const img = document.createElement("img");
      img.src = "./static/img/login/position.png";
      const childDiv = document.createElement("div");
      childDiv.className = "text";

      this.kaptchaClickNum++;

      childDiv.innerText = this.kaptchaClickNum;
      div.appendChild(img);
      div.appendChild(childDiv);

      clickDivDom.appendChild(div);
      this.kaptchaPositions.push({
        x: left,
        y: top
      });

      if (this.kaptchaClickNum >= this.kaptchaClickSize) {
        this.handleLogin2();
      }
    },
    //初始化验证码信息
    kaptchaInit() {
      //验证码图片
      this.kaptcha = null;
      //点击文字的描述
      this.kaptchaMsg = "";
      //点击文字次数
      this.kaptchaClickNum = 0;
      //点击文字的坐标值
      this.kaptchaPositions = [];
      this.clearKaptchaClick();
    },
    //关闭弹窗
    handleKaptchaBoxClose() {
      this.kaptchaInit();
      //点击文字验证码弹窗
      this.kaptchaBoxShow = false;
    },
    // 密码明文切换
    changePwd(data) {
      this.isPwd = !this.isPwd;
      if (data) {
        this.passwordValue = data;
      }
    },
    handleKeyDown(e) {
      console.log("键盘事件", e);
    },
    getLocalUserList() {
      let loacalUserList = this.$getStorage("userList");
      this.userList = loacalUserList || [];
    },
    comfirmUser(item) {
      console.log("选中数据", item);
      this.loginForm.username = item.username;
      if (item.remenber) {
        this.loginForm.password = window.atob(item.password);
      } else {
        this.loginForm.password = "";
      }
      this.remenber = item.remenber;
      this.userListVisible = false;
    },
    usernameFocus() {
      console.log("输入框聚焦");
      if (this.userList.length > 0) {
        this.userListVisible = true;
      } else {
        this.userListVisible = false;
      }
    },
    /**初始化视频信息 */
    initVideo() {
      // 视频播放结束后循环播放最后几秒
      let indexVideo = document.getElementById("indexVideo");

      let promise = indexVideo.play();
      indexVideo.muted = true;
      if (promise !== undefined) {
        promise.then(function () {
          indexVideo.play();
        });
      }

      indexVideo.addEventListener("timeupdate", function () {
        // console.log('Event callback: ' + indexVideo.currentTime);
        let now = Number(indexVideo.currentTime.toFixed(1));
        if (now === 34.0 || now === 34.1 || now === 34.2) {
          indexVideo.currentTime = 30.1;
        }
      });
    },
    /**
     * 点击显示登录form
     */
    showLoginForm() {
      console.log("showLoginForm");
      this.getLastLoginInfo(); //获取上一次登录的用户
      //this.changeVideoTime();
      this.showLoginDialog = true;
      this.$nextTick(() => {
        if (this.loginForm.username) {
          this.$refs.username.focus();
        } else if (this.loginForm.password) {
          this.$refs.password.focus();
        }
      });
    },
    // 获取上一次登录的用户
    getLastLoginInfo() {
      let logininfo = this.$getStorage("userInfo");
      // 获取 列表
      let loacalUserList = this.$getStorage("userList") || [];
      // 判断当前的账号是不是 列表中
      let item = loacalUserList?.find((item) => item.username === logininfo.username);
      if (item) {
        this.loginForm.username = logininfo.username;
        if (item.remenber) {
          // this.loginForm.password = window.atob(item.password);
          let password = window.atob(item.password);
          this.loginForm.password = password;
          this.remenber = item.remenber;
        } else {
          this.loginForm.password = "";
        }
      } else {
        this.clearCookie();
        this.$refs["loginForm"]?.resetFields();
        this.getLoginPublicKey();
      }
      console.log("this.loginForm", this.loginForm);
    },
    /**视频跳转到指定的播放时间 */
    changeVideoTime() {
      let indexVideo = document.getElementById("indexVideo");
      indexVideo.currentTime = 30.1;
      this.showLoginDialog = true;
    },
    /** */
    downAppHandle() {
      this.$message.info("功能开发中...");
    },
    /* 获取图片验证码 */
    getKaptcha() {
      this.kaptchaInit();
      getKaptcha().then((res) => {
        this.kaptchaConfig = res.data;
        if (res.success && res.data && res.data.images && res.data.images.length > 0) {
          this.kaptcha = res.data.images[0].image;
          this.kaptchaType = res.data.type;
          if (this.kaptchaType === 1) {
            this.kaptchaMsg = res.data.message;
            this.kaptchaClickSize = res.data.inputSize;
          }
          // console.log("kaptcha", this.kaptcha);
        }
      });
    },
    encrypt(str) {
      //加密前获取公钥
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.pubKey);
      return encrypt.encrypt(str);
    },
    getLoginPublicKey(cb) {
      try {
        console.log("获取公钥");
        getLoginPublicKey().then((res) => {
          if (!res.success) {
            return this.$message.error("获取公钥失败:" + res.message);
          }
          this.pubKey = res.data;
          typeof cb === "function" && cb();
        });
      } catch (error) {
        this.$message.error("获取公钥失败: + error");
      }
    },
    getConfig() {
      getConfig().then((res) => {
        if (!res.success) {
          return this.$message.error("获取配置失败:" + res.message);
        }
        this.config = res.data;
        console.log("获取配置", this.config);
        if (this.config.enableKaptcha) {
          this.getKaptcha();
        }
      });
    },
    /**清理cookie和locationStorage */
    clearCookie() {
      // document.cookie = "szgc-mdg-sid=;path=/;";
      removeCookie(ACCESS_TOKEN, {
        path: "/",
        domain: this.domain
      });
      this.$clearStorageAll();
    },
    checkCapslock(e) {
      console.log("checkCapslock", e);
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      // if (this.passwordType === "password") {
      //   this.passwordType = "";
      // } else {
      //   this.passwordType = "password";
      // }
      // this.$nextTick(() => {
      //   this.$refs.password.focus();
      // });
    },
    handleLogin() {
      // console.log("this.config", this.config)
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.getLoginPublicKey(() => {
            if (this.config.enableKaptcha) {
              this.getKaptcha();
              this.kaptchaBoxShow = true;
            } else {
              this.handleLogin2();
            }
            this.loading = true;
          });
        } else {
          this.errorMsg = "*请输入正确的账号或密码";
          return false;
        }
      });
    },
    handleLogin2() {
      const userInfo = this.loginForm;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let submitData = {
            ...this.loginForm,
            password: this.encrypt(this.loginForm.password)
          };
          console.log("登录信息", submitData);
          if (this.kaptchaType === 1) {
            let str = "";
            this.kaptchaPositions.map((item, index) => {
              str += parseInt(item.x) + ":" + parseInt(item.y);
              if (index !== this.kaptchaPositions.length - 1) {
                str += ",";
              }
            });
            submitData.kaptcha = str;
            submitData.type = "username";
          }
          this.$store
            .dispatch("user/login", submitData)
            .then((res) => {
              if (res.success) {
                userInfo.remenber = this.remenber;
                this.setLocalUsrList(userInfo);
                socket.connect();
                repeatedLogin().then(async (res) => {
                  if (!res.success && res.message === "请修改密码") {
                    this.$router.push({
                      path: this.redirect || "/",
                      query: this.otherQuery
                    });
                    this.loading = false;
                    return;
                  }

                  if (res?.data) {
                    //todo
                    let tempToken = getToken();
                    this.$setStorage("repeatedLoginInfo", tempToken);
                    removeToken();
                    // this.showMask = true;
                    // this.timer = setInterval(() => {
                    // if (this.seconds > 0) {
                    // this.seconds--;
                    // } else {
                    this.showMask = false;
                    clearInterval(this.timer);
                    this.timer = null;
                    this.seconds = this.loginWaitSecond;
                    let loginToken = this.$getStorage("repeatedLoginInfo");
                    this.kaptchaInit();
                    //重新设置token跳转页面
                    setToken(loginToken);

                    //初始化前端参数
                    config.init(() => {
                      this.$router.push({
                        path: config.getLoginedPath() || "/",
                        query: this.otherQuery
                      });
                    });
                    // }
                    // }, 1000);
                  } else {
                    //初始化前端参数
                    config.init(() => {
                      this.$router.push({
                        path: config.getLoginedPath() || "/",
                        query: this.otherQuery
                      });
                    });

                    this.$message.success("登录成功！");

                    // 预警提醒
                    localStorage.setItem("warning", "0");

                    this.loading = false;
                  }
                });
              } else {
                if (this.kaptchaType === 1) {
                  this.kaptchaBoxShow = false;
                  this.$message.error(res.message);
                } else {
                  this.getKaptcha();
                  this.errorMsg = "*" + res.message;
                }
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.errorMsg = "*请输入正确的账号或密码";
          return false;
        }
      });
    },

    setLocalUsrList(data) {
      let userInfo = { ...data };
      let loacalUserList = JSON.parse(JSON.stringify(this.$getStorage("userList")));
      if (userInfo.remenber) {
        userInfo.password = window.btoa(userInfo.password);
      } else {
        userInfo.password = "";
      }
      if (loacalUserList) {
        let userList = loacalUserList;
        let index = userList.findIndex((item) => item.username === userInfo.username);
        if (index === 0 || index > 0) {
          userList[index].password = userInfo.password;
          userList[index].remenber = userInfo.remenber;
          this.$setStorage("userList", userList);
        } else {
          let setLocaUserList = [...userList, ...[userInfo]];
          this.$setStorage("userList", setLocaUserList);
        }
      } else {
        this.$setStorage("userList", [userInfo]);
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    hideMask() {
      this.showMask = false;
      clearInterval(this.timer);
      this.timer = null;
      this.seconds = this.loginWaitSecond;
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
.login-bgImg {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: opacity 2s linear;
  }
  > div {
    position: absolute;
    bottom: 32px;
    display: flex;
    left: 100px;
    .active {
      width: 50px;
      height: 8px;
      background: #d6d6d6;
      border-radius: 8px;
      &::before {
        width: 100%;
        border-radius: 8px;
        transition: width 10s linear;
      }
    }
    div {
      width: 8px;
      height: 8px;
      background: #ffffff;
      border-radius: 8px 8px 8px 8px;
      margin: 0 6px;
      cursor: pointer;
      position: relative;
      &::before {
        content: "";
        width: 0;
        border-radius: 8px 8px 8px 8px;
        height: 100%;
        background-color: #fff;
        position: absolute;
      }
    }
  }
}
/* reset element-ui css */
.login-container {
  // background-image: url("~@/assets/img/login/bg1.png"), url("~@/assets/img/login/bg2.png"), url("~@/assets/img/login/bg3.png"), url("~@/assets/img/login/bg4.png");
  // background-position: center center;
  // background-size: cover;
  // background-repeat: no-repeat;
  // animation: bgSlider 30s infinite linear;

  .login-logo {
    z-index: 10;
    width: 542px;
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
      padding: 12px 5px 12px 32px;
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

@keyframes bgSlider {
  0% {
    background-image: url("~@/assets/img/login/bg1.png");
  }
  33.33% {
    background-image: url("~@/assets/img/login/bg2.png");
  }
  66.66% {
    background-image: url("~@/assets/img/login/bg3.png");
  }
  100% {
    background-image: url("~@/assets/img/login/bg1.png");
  }
}

.slide-kaptcha-main {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;

  .slide-fade {
    width: 100%;
    height: 100%;
    opacity: 0.6;
    background-color: #000;
  }

  .kaptcha-main-box {
    position: absolute;
    background-color: #fff;
    left: 50%;
    top: 50%;
    z-index: 10;
    transform: translate(-50%, -50%);

    .kaptcha-main {
      padding: 10px;

      .image-box {
        position: relative;
        font-size: 0;
        overflow: hidden;
        width: 320px;
        height: 200px;

        .position-text {
          position: absolute;
          width: 32px;
          height: 32px;
          z-index: 6;

          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }

          .text {
            position: absolute;
            text-align: center;
            z-index: 5;
            color: #fff;
            font-weight: bold;
            font-size: 12px;
            left: 12px;
            top: 7px;
          }
        }
      }

      .slide-box {
        position: relative;
        margin-top: 12px;
        margin-bottom: 4px;
        border-radius: 50px;
        padding: 12px 0;
        background-color: #dfe1e2;
        text-align: center;
        box-shadow: 0 0 5px #88949d inset;

        .slide-rect {
          color: #88949d;
          font-size: 14px;
        }
      }
    }

    .kaptcha-footer {
      padding: 10px;
      border-top: 1px solid #eee;

      .icon-footer {
        font-size: 22px;
        cursor: pointer;
        margin-right: 10px;
        color: #96989c;
      }
    }
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
    //position: absolute;
    right: 0;
    top: 0;
  }

  .login-form {
    padding: 50px;
    // overflow: hidden;

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
        border-radius: 2px;

        .el-input,
        .el-input__inner {
          height: 100%;
          border-radius: 2px;
        }
      }

      ::v-deep .el-input__prefix {
        font-size: 20px;
        top: 5px;
        left: 27px;
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
    cursor: pointer;
    user-select: none;
  }

  .remember-item {
    justify-content: space-between;
    align-items: center;

    ::v-deep .el-checkbox__label {
      width: 56px;
      height: 22px;
      font-family: MiSans, MiSans;
      font-weight: 500;
      font-size: 14px;
      color: #666666;
      line-height: 22px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .btn-content {
    margin-top: 39px;
    // width: 372px;
    height: 56px;
    background: #014acb;
    box-shadow: 0px 4px 10px 0px rgba(8, 56, 99, 0.15);
    border-radius: 2px 2px 2px 2px;

    display: flex; /* 设置为 flexbox */
    justify-content: center; /* 水平居中 */
    align-items: center;

    .login-img {
      font-family: MiSans, MiSans;
      font-weight: 600;
      font-size: 24px;
      color: #ffffff;
      // background-color: #00338d;
      letter-spacing: 2px;
      text-align: center; /* 这对块级元素有效 */
      font-style: normal;
      text-transform: none;
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
  display: inline-block;
  cursor: pointer;
  width: 100%;
  height: 68px;
  border-radius: 10px;
}

.video {
  width: 100%;
  height: 100%;
}

.video video {
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
}

.download-qrcode {
  position: absolute;
  top: 50px;
  right: 100px;
  width: 199px;
  height: 55px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px 4px 4px 4px;
  backdrop-filter: blur(1px); //毛玻璃属性
  border: 1px solid rgba(255, 255, 255, 0.08);
  //border-image: linear-gradient(180deg, rgba(248, 248, 248, 0.49), rgba(248, 248, 248, 0)) 1 1;
}

.download-qrcode-button img {
  user-select: none;
  position: relative;
  top: 13px;
  left: 58px;
}

.download-qrcode-button span {
  user-select: none;
  position: relative;
  top: 12px;
  left: 68px;
  width: 49px;
  height: 36px;
  font-size: 26px;
  font-family: Alibaba PuHuiTi 2-55 Regular, Alibaba PuHuiTi 20;
  font-weight: normal;
  color: #ffffff;
  line-height: 30px;
  -webkit-background-clip: text;
}

.download-qrcode-dialog {
  background-image: url("@/assets/img/login/qrcode.png"),
    url("@/assets/img/login/appDownload.png");
  width: 200px;
  height: 200px;
  background-repeat: no-repeat;
  background-position: center 27px, center 0;
  margin-top: 16px;
  margin-left: 19px;
}

.login-form {
  backdrop-filter: blur(5px) !important;
  width: 459px !important;
  height: 479px !important;
  //background: rgba(128, 128, 128, 0.2) !important;
  //position: absolute !important;
  //top: 50% !important;
  //left: 50% !important;
  //transform: translate(-50%, -50%) !important;
  //border-radius: 16px !important;
}

/deep/ .el-form-item {
  border: none !important;
  width: 100% !important;
  background: none !important;
}

/deep/ .el-form-item__content {
  border: none !important;
  width: 100% !important;
  background: none !important;
}

/deep/ .el-input {
  border: none !important;
  width: 100% !important;
  background: none !important;
}

/deep/ .el-input__inner {
  border: none !important;
  width: 100% !important;
  // background: rgba(255, 255, 255, 0.3) !important;
}

/deep/ .el-input__inner {
  color: #797979 !important;
}

/deep/ .el-input__inner::placeholder {
  width: 120px !important;
  height: 24px !important;
  font-family: MiSans, MiSans !important;
  font-weight: 500 !important;
  font-size: 18px !important;
  color: #797979 !important;
  line-height: 21px !important;
  text-align: left !important;
  font-style: normal !important;
  text-transform: none !important;
}

/deep/ input:-webkit-autofill {
  -webkit-animation: autofill-fix 1s infinite !important;
  //-webkit-text-fill-color: white;
  -webkit-transition: background-color 50000s ease-in-out 0s !important;
  transition: background-color 50000s ease-in-out 0s !important;
  //background-color: rgba(92, 163, 53, 0.3) !important;
  //-webkit-box-shadow: 0 0 0 1000px transparent inset!important;
  -webkit-box-shadow: 0px 0px 0px 1000px rgba(10, 10, 10, 0.3) inset !important;
  -webkit-text-fill-color: #fff;
  opacity: 0.7;
}

.errorMsg {
  color: red;
}

.login-title {
  ::v-deep .el-form-item__content {
    justify-content: left;
    display: flex;
    align-items: center;

    span {
      width: 84px;
      height: 27px;
      font-family: MiSans, MiSans;
      font-weight: 600;
      font-size: 20px;
      color: #2c2a2a;
      line-height: 23px;
      letter-spacing: 1px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}

.mask {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.mask-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: white;
}

.user-item:hover {
  background-color: #e9e9e9;
}

.dPwd {
  position: relative;

  .pwdIcon {
    width: 20px;
    height: 20px;
    display: block;
    position: absolute;
    right: 20px;
    top: 10px;
  }
}

.form-content-login {
  display: flex;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  border-radius: 2px;
  background: #ffffff6e;
}

.form-left {
  height: 479px;
  width: 467px;
}

.form-left-name {
  margin-top: 18px;
  width: 410px;
  height: 50px;
  font-family: MiSans, MiSans;
  font-weight: 600;
  font-size: 29px;
  color: #ffffff;
  line-height: 50px;
  letter-spacing: 2px;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.form-left-zgxa {
  width: 142px;
  height: 145px;
}

.custem-input {
  padding-left: 40px !important;
}
.form-version{
  font-size: 14px;
  color: #ffffff;
}
</style>

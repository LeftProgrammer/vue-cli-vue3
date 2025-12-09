<template>
  <div id="app">
    <router-view/>
    <el-dialog :visible.sync="dialogVisible" title="强制下线通知" :show-close="false" width="600px"
               custom-class="wbench-el-dialog" :close-on-click-modal="false"
    >
      <p style="font-size: 20px">{{ message }}</p>
      <p style="font-size: 20px">
        (<span style="font-size: 40px; color: red">{{ seconds }}</span>秒内没有任何操作默认允许该账户登录！)
      </p>
      <br/>
      <span slot="footer">
        <el-button type="primary" @click="agreeLogin" size="large" style="font-size: 20px">同意登录</el-button>
        <el-button type="danger" @click="forceLogout" size="large" style="font-size: 20px">下线</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import autofit from "autofit.js";
import { socket } from "@szgc/plt-core";
import { dateFormat, fromApp } from "./utils";
import { disallowLogin, allowLogin, logout } from "./api/user";
import { setToken } from "./utils/auth";
import heatbeat from "@/utils/heatbeat";
import config from "@/utils/config";

export default {
  created() {
  },
  data() {
    return {
      dialogVisible: false,
      preSid: "",
      message: "",
      customStyle: "",
      //登录等候秒
      loginWaitSecond: this.$store.state.systemConfig?.loginWaitSecond || 20,
      seconds: this.$store.state.systemConfig?.loginWaitSecond || 20,
      timer: null,
      beforeUnloadTime: "",
      gapTime: "",
      redirect: config.getLoginedPath(),
    };
  },
  mounted() {
    //监听退出浏览器前的操作
    //window.addEventListener("beforeunload", this.autoLogoutBefore);
    //window.addEventListener("unload", this.autoLogout);

    let app = document.getElementById("app");
    // console.log(app);
    if (self != top || fromApp()) {
      // 在iframe中，去除滚动条
      app.style.minWidth = "";
      app.style.minHeight = "";
    } else {
      app.style.minWidth = "1000px";
      app.style.minHeight = "600px";
    }
    this.dealScoketMsg();
    //检测心跳
    heatbeat.start();
  },
  destroyed() {
    // 销毁时，取消订阅
    //socket.off("NOTICE");
    //window.removeEventListener("beforeunload", this.autoLogoutBefore);
    //window.removeEventListener("unload", this.autoLogout);
    heatbeat.clear();
  },
  methods: {
    dealScoketMsg() {
      // 连接事件是在登录之后 这里只做监听
      socket.on("NOTICE", (data) => {
        // 这个事文档里面的  文档在app 包里面的public
        // const noticeType = {
        //   0: "系统通知",
        //   1: "系统公告",
        //   20: "流程通知",
        //   21: "流程公告",
        //   31: "致远通知",
        //   41: "登录通知",
        // };
        if (data?.noticeType == "41") {
          this.dialogVisible = false;
          console.log("通知信息", data);
          //主页面才执行
          if (self == top) {
            //指定sid的登录人
            let preSid = data.noticeTitle;
            //判断是不是指定操作的用户
            if (!this.isSpecifiedUser(preSid)) {
              return;
            }
            let noticeTypeStr = data.noticeTypeStr;
            //处理同意登录后的消息
            if (noticeTypeStr && noticeTypeStr == "allow") {
              let loginToken = this.$getStorage("repeatedLoginInfo");
              //重新设置token跳转页面
              setToken(loginToken);

              //初始化前端参数
              config.init(() => {
                this.$router.push({
                  path: config.getLoginedPath(),
                });
              });

              this.$message.warning("主账号已同意登录，可进行功能操作！");

              return;
            }
            //处理拒绝登录后的消息
            if (noticeTypeStr && noticeTypeStr == "disallow") {
              this.$message.warning("主账号已拒绝登录，请更换账号重新登录！");
              //调用登出接口
              this.$store.dispatch("user/logout").then((res) => {
                socket.off("NOTICE");
                this.$router.push(`/login`).then(() => {
                  location.reload();
                });
              });
              return;
            }
            //处理重复登录的推送消息
            let preCookie = data.noticeSchema;
            //如果存在则给出提示
            if (preCookie) {
              // 请求登录的cookie信息
              let sid = this.getSid(preCookie, "szgc-mdg-sid");
              //当前登录的cookie信息
              let currentSid = this.getSid(document.cookie, "szgc-mdg-sid");

              console.warn("通知cookie", preCookie, sid)
              console.warn("当前cookie", document.cookie, currentSid)

              if (sid && sid != currentSid) {
                this.preSid = sid;
                this.message =
                  "您的账号于" +
                  dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss") +
                  "在其他设备登录,若非您本人操作,可将账号进行强制下线操作。";
                this.dialogVisible = true;
                //给出20秒倒计时
                this.timer = setInterval(() => {
                  if (this.seconds > 0) {
                    this.seconds--;
                  } else {
                    clearInterval(this.timer);
                    this.timer = null;
                    this.seconds = this.loginWaitSecond;
                    this.dialogVisible = false;
                    this.preSid = "";
                    this.message = "";
                  }
                }, 1000);
              }
            }
          }
        }
      });
    },
    agreeLogin() {
      this.dialogVisible = false;
      clearInterval(this.timer);
      this.seconds = this.loginWaitSecond;
      console.log("同意登录");
      if (this.preSid) {
        allowLogin(this.preSid).then((res) => {

          //初始化前端参数
          config.init();

          this.preSid = "";
          this.message = "";
        });
      } else {

      }
    },
    forceLogout() {
      console.log("强制下线");
      this.dialogVisible = false;
      clearInterval(this.timer);
      this.seconds = this.loginWaitSecond;
      if (this.preSid) {
        disallowLogin(this.preSid).then((res) => {
          this.preSid = "";
          this.message = "";
        });
      }
    },
    //获取cookie
    getSid(str, key) {
      var name = key + "=";
      var ca = str.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
      }
      return "";
    },
    // getSid(str, key) {
    //   const obj = {};
    //   const parts = str.split("; ");
    //   for (let part of parts) {
    //     const [key, value] = part.split("=");
    //     obj[key] = value;
    //   }
    //   return obj[key];
    // },
    //判断是不是指定操作的用户
    isSpecifiedUser(preSid) {
      let currentCookie = document.cookie;
      if (currentCookie) {
        let currentSid = this.getSid(currentCookie, "szgc-mdg-sid");
        console.log("preSid", preSid, currentSid);
        //只有最早登录的账号才弹窗
        if (preSid == currentSid) {
          return true;
        }
      }
      return false;
    },
    autoLogoutBefore() {
      this.beforeUnloadTime = new Date().getTime();
    },
    async autoLogout() {
      this.gapTime = new Date().getTime() - this.beforeUnloadTime;
      //判断是窗口关闭还是刷新
      if (this.gapTime <= 5) {
        //浏览器关闭
        await logout();
        console.log("关闭浏览器");
      } else {
        console.log("刷新浏览器");
      }
    },
  },
};
</script>
<style lang="scss">
/* V1.0设计规范 lv 2023年8月7日*/
@import "common/css/public.scss";
//
@import "common/css/public.css";
//
@import "common/css/font.css";
//字体
@import "common/css/animate.css";
// 按钮
@import "common/css/element-variables.scss";
//animate动画
@import "common/iconFont/icon.css"; //图标库</style>

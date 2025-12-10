<template>
  <router-view />

  <el-dialog
    v-model="dialogVisible"
    title="强制下线通知"
    :show-close="false"
    width="600px"
    custom-class="wbench-el-dialog"
    :close-on-click-modal="false"
  >
    <p style="font-size: 20px">{{ message }}</p>
    <p style="font-size: 20px">
      (<span style="font-size: 40px; color: red">{{ seconds }}</span
      >秒内没有任何操作默认允许该账户登录！)
    </p>
    <br />
    <template #footer>
      <el-button
        type="primary"
        size="large"
        style="font-size: 20px"
        @click="agreeLogin"
      >
        同意登录
      </el-button>
      <el-button
        type="danger"
        size="large"
        style="font-size: 20px"
        @click="forceLogout"
      >
        下线
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { socket } from "@/utils/socket";
import { dateFormat, fromApp } from "@/utils";
import { allowLogin, disallowLogin, logout } from "@/api/user";
import { setToken } from "@/utils/auth";
import heatbeat from "@/utils/heatbeat";
import config from "@/utils/config";

export default {
  name: "App",
  data() {
    return {
      dialogVisible: false,
      preSid: "",
      message: "",
      // 登录等候秒
      loginWaitSecond: this.$store.state.systemConfig?.loginWaitSecond || 20,
      seconds: this.$store.state.systemConfig?.loginWaitSecond || 20,
      timer: null,
      beforeUnloadTime: "",
      gapTime: "",
    };
  },
  mounted() {
    const appEl = document.getElementById("app");
    if (appEl) {
      if (self !== top || fromApp()) {
        // 在 iframe 或移动端中，去除最小宽高限制
        appEl.style.minWidth = "";
        appEl.style.minHeight = "";
      } else {
        appEl.style.minWidth = "1000px";
        appEl.style.minHeight = "600px";
      }
    }

    // 建立 WebSocket 连接，并监听登录通知
    socket.connect && socket.connect();
    this.registerNoticeListener();

    // 启动心跳（heatbeat.start 内部有幂等保护）
    heatbeat.start();

    // 如后续需要区分关闭/刷新，可放开下面两行
    // window.addEventListener("beforeunload", this.autoLogoutBefore);
    // window.addEventListener("unload", this.autoLogout);
  },
  beforeUnmount() {
    // 取消 NOTICE 监听
    socket.off && socket.off("NOTICE", this.handleNotice);

    // 关闭心跳
    heatbeat.clear();

    // window.removeEventListener("beforeunload", this.autoLogoutBefore);
    // window.removeEventListener("unload", this.autoLogout);
  },
  methods: {
    registerNoticeListener() {
      // 监听后端推送的登录通知
      socket.on && socket.on("NOTICE", this.handleNotice);
    },

    handleNotice(data) {
      // 只处理登录通知（noticeType == 41）
      if (!data || data.noticeType !== "41") {
        return;
      }

      this.dialogVisible = false;

      // 仅在顶层窗口处理
      if (self !== top) {
        return;
      }

      const preSid = data.noticeTitle;
      if (!this.isSpecifiedUser(preSid)) {
        return;
      }

      const noticeTypeStr = data.noticeTypeStr;

      // 同意登录
      if (noticeTypeStr === "allow") {
        const loginToken = this.$getStorage && this.$getStorage("repeatedLoginInfo");
        if (loginToken) {
          setToken(loginToken);
        }

        // 初始化前端参数并跳转到登录后的首页
        config.init(() => {
          this.$router.push({ path: config.getLoginedPath() }).then(() => {
            this.$message && this.$message.warning("主账号已同意登录，可进行功能操作！");
          });
        });

        return;
      }

      // 拒绝登录
      if (noticeTypeStr === "disallow") {
        this.$message && this.$message.warning("主账号已拒绝登录，请更换账号重新登录！");
        this.$store
          .dispatch("user/logout")
          .then(() => {
            socket.off && socket.off("NOTICE", this.handleNotice);
            this.$router.push("/login").then(() => {
              location.reload();
            });
          })
          .catch(() => {});
        return;
      }

      // 处理重复登录的推送消息
      const preCookie = data.noticeSchema;
      if (!preCookie) return;

      const sid = this.getSid(preCookie, "szgc-mdg-sid");
      const currentSid = this.getSid(document.cookie || "", "szgc-mdg-sid");

      if (sid && sid !== currentSid) {
        this.preSid = sid;
        this.message =
          "您的账号于" +
          dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss") +
          "在其他设备登录,若非您本人操作,可将账号进行强制下线操作。";
        this.dialogVisible = true;

        if (this.timer) {
          clearInterval(this.timer);
        }
        this.seconds = this.loginWaitSecond;
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
    },

    agreeLogin() {
      this.dialogVisible = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.seconds = this.loginWaitSecond;

      if (!this.preSid) return;

      allowLogin(this.preSid)
        .then(() => {
          // 重新初始化参数
          config.init();
          this.preSid = "";
          this.message = "";
        })
        .catch(() => {});
    },

    forceLogout() {
      this.dialogVisible = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.seconds = this.loginWaitSecond;

      if (!this.preSid) return;

      disallowLogin(this.preSid)
        .then(() => {
          this.preSid = "";
          this.message = "";
        })
        .catch(() => {});
    },

    // 获取 cookie 中指定 key 的值
    getSid(str, key) {
      if (!str || !key) return "";
      const name = key + "=";
      const ca = str.split(";");
      for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(name) !== -1) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },

    // 判断当前登录用户是否为指定 sid 对应用户
    isSpecifiedUser(preSid) {
      const currentCookie = document.cookie || "";
      if (!currentCookie) return false;
      const currentSid = this.getSid(currentCookie, "szgc-mdg-sid");
      return preSid && currentSid && preSid === currentSid;
    },

    autoLogoutBefore() {
      this.beforeUnloadTime = new Date().getTime();
    },

    async autoLogout() {
      this.gapTime = new Date().getTime() - this.beforeUnloadTime;
      // 判断是窗口关闭还是刷新
      if (this.gapTime <= 5) {
        // 浏览器关闭
        try {
          await logout();
        } catch (e) {
          // 记录登出失败，但不打断窗口关闭流程
          console.error("logout failed", e);
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "common/css/public.scss";
@import "common/css/public.css";
@import "common/css/font.css";
@import "common/css/animate.css";
@import "common/css/element-variables.scss";
@import "common/iconFont/icon.css";
</style>

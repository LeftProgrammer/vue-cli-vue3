<template>
  <div class="navbar">
    <div class="logo">
      <LogoBox />
      <el-divider direction="vertical" />
      <span class="title">雄安调蓄库工程智慧管理平台</span>
    </div>
    <div class="right-menu">
      <div class="avatar-wrapper">
        <!-- 综合展示按钮（有 large 权限时显示） -->
        <div v-if="hasLarge" class="font-topBar" @click="openLargeScreen">
          <div class="icon-topBar dmgHome" />
          <div class="text">综合展示</div>
        </div>

        <el-dropdown @command="handleCommand" placement="bottom-start">
          <div class="font-topBar">
            <span class="text">{{ displayName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import LogoBox from "./Logo.vue";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  name: "LayoutNavbar",
  components: {
    LogoBox,
  },
  computed: {
    ...mapGetters(["loginInfo", "hasLarge"]),
    displayName() {
      const info = this.loginInfo || {};
      return info.nickName || info.realName || "用户";
    },
  },
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        this.handleLogout();
      }
    },
    handleLogout() {
      const ok = window.confirm("确定退出登录？");
      if (!ok) return;
      this.$store
        .dispatch("user/logout")
        .then(() => {
          this.$router.push("/login");
        })
        .finally(() => {
          // 刷新以清理运行时状态
          window.location.reload();
        });
    },
    openLargeScreen() {
      const token = getToken();
      const origin = window.location.origin;
      if (!token) {
        window.open(`${origin}/large-screen/`, "_blank");
        return;
      }
      window.open(`${origin}/large-screen/?token=${token}`, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.navbar {
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #014acb;
  height: 56px;
  min-height: 54px;
  padding: 0 24px;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
}

.logo .title {
  font-family: MiSans, MiSans;
  font-weight: 600;
  font-size: 18px;
  line-height: 32px;
  letter-spacing: 1px;
}

.right-menu {
  height: 100%;
}

.avatar-wrapper {
  height: 100%;
  color: #ffffff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.font-topBar {
  height: 100%;
  font-weight: 500;
  font-size: 16px;
  margin: 0 12px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  justify-items: center;
  align-items: center;
}

.font-topBar .text {
  text-indent: 4px;
}

.font-topBar .icon-topBar {
  width: 22px;
  height: 22px;
}

.font-topBar .dmgHome {
  background-image: url("@/assets/img/system/navi.png");
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
}

.el-dropdown {
  display: flex;
  align-items: center;
}
</style>

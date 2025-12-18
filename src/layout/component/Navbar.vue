<template>
  <div class="navbar">
    <div class="logo">
      <LogoBox :collapse="true" />
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

        <div class="font-topBar">
          <NoticeBar />
        </div>

        <div class="font-topBar">
          <TodoBar />
        </div>

        <el-dropdown class="user-dropdown" placement="bottom-start" @command="handleCommand">
          <div class="font-topBar user-trigger">
            <img class="icon-topBar" :src="avatarDefault" />
            <span class="text">{{ displayName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item v-if="isSystem" command="clearDict">
                清理字典缓存
              </el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="changePassVisible"
      title="修改密码"
      width="680px"
      :close-on-press-escape="true"
      :close-on-click-modal="false"
    >
      <PasswordPage />
    </el-dialog>
  </div>
</template>

<script>
import LogoBox from "./Logo.vue";
import NoticeBar from "@/components/NoticeBar/index.vue";
import TodoBar from "@/components/TodoBar/index.vue";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { refreshDictItemList } from "@/api/dict";
import { ElMessage, ElMessageBox } from "element-plus";
import PasswordPage from "@/views/password/index.vue";
import avatarDefault from "@/assets/avatar-default.png";

export default {
  name: "LayoutNavbar",
  components: {
    LogoBox,
    NoticeBar,
    TodoBar,
    PasswordPage,
  },
  data() {
    return {
      changePassVisible: false,
      avatarDefault,
    };
  },
  computed: {
    ...mapGetters(["loginInfo", "hasLarge"]),
    displayName() {
      const info = this.loginInfo || {};
      return info.nickName || info.realName || "用户";
    },
    // 是否为系统级账号（system/super），用于控制“清理字典缓存”入口
    isSystem() {
      const info = this.loginInfo || {};
      const username = info.username || info.userName || "";
      return username === "system" || username === "super";
    },
  },
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        this.handleLogout();
      } else if (command === "password") {
        this.goChangePassword();
      } else if (command === "clearDict") {
        this.handleClearDict();
      }
    },
    handleLogout() {
      ElMessageBox.confirm("确定退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("user/logout")
            .catch(() => {
              // 忽略登出接口异常，仍然回到登录页
            })
            .finally(() => {
              this.$router.replace("/login").catch(() => {});
            });
        })
        .catch(() => {
          // 点击取消，不做处理
        });
    },
    goChangePassword() {
      this.changePassVisible = true;
    },
    async handleClearDict() {
      try {
        const res = await refreshDictItemList("qdxtpz");
        if (res && res.success) {
          ElMessage.success("清理成功！");
        } else {
          ElMessage.error((res && res.message) || "清理失败！");
        }
      } catch (error) {
        ElMessage.error("清理失败！");
      }
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
  background: var(--el-color-primary);
  height: 5.56%;
  min-height: 54px;
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
  line-height: 60px;
}

.avatar-wrapper {
  height: 100%;
  color: #ffffff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-right: 20px;
}

.font-topBar {
  height: 100%;
  font-weight: 500;
  font-size: 18px;
  margin: 0;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  gap: 10px;
  justify-items: center;
  align-items: center;
}

.font-topBar .text {
  text-indent: 0;
  font-size: 16px;
}

.font-topBar.user-trigger {
  margin: 0;
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

.avatar-wrapper :deep(.notice-bar),
.avatar-wrapper :deep(.todo-bar) {
  gap: 10px;
}

.avatar-wrapper :deep(.notice-bar .icon-topBar),
.avatar-wrapper :deep(.todo-bar .icon-topBar) {
  right: 0;
}

.avatar-wrapper :deep(.notice-bar .font-topBar),
.avatar-wrapper :deep(.todo-bar .font-topBar) {
  margin: 0;
  line-height: inherit;
}

.user-dropdown {
  display: flex;
  align-items: center;

  // 覆盖 Element Plus 内部触发元素在获得/失去焦点时的描边样式
  :deep(.el-tooltip__trigger),
  :deep(.el-dropdown-link),
  :deep(.el-dropdown-selfdefine) {
    outline: none !important;
    box-shadow: none !important;
    border-color: transparent !important;
  }
}
</style>

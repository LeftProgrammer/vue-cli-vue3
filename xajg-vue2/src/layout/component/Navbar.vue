<template>
  <div class="navbar">
    <div class="logo">
      <LogoBox :collapse="true" />
      <el-divider direction="vertical"></el-divider>
      <span class="title">雄安调蓄库工程智慧管理平台</span>
    </div>
    <!-- <div v-if="$route.name !== 'dashboard' && !hideMenu" class="menu-box">
      <div
        v-for="route in menuRoutes"
        :key="route.id"
        :class="{ 'menu-item-active': isCurrentSubTheme(route) }"
        class="menu-item"
        @click="pickRootPage(route)"
      >
        <i class="iconfont" :class="route.permIcon" />
        {{ route && route.permName ? route.permName : "" }}
      </div>
    </div> -->
    <div class="right-menu">
      <div class="avatar-wrapper">
        <div class="font-topBar" @click="daping()" v-if="hasLarge">
          <div class="icon-topBar dmgHome"></div>
          <div class="text">综合展示</div>
        </div>
        <div class="font-topBar">
          <notice-bar @childEvt="noticeEvt"> </notice-bar>
        </div>
        <div class="font-topBar" @click.prevent="todo">
          <todo-bar></todo-bar>
        </div>
        <el-popover placement="bottom" trigger="click">
          <el-button type="text">修改密码</el-button>
        </el-popover>
        <el-dropdown @command="handleClick" placement="bottom-start">
          <div class="font-topBar" style="margin: 0px 0px">
            <img
              class="icon-topBar"
              :src="require('@/assets/img/avatar-default.png')"
            />
            <span class="text">
              {{ loginInfo.nickName || loginInfo.realName }}
            </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="password" style="min-width: 100px">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item command="clearDict" v-if="isSystem"
              >清理字典缓存</el-dropdown-item
            >
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            <!-- <el-dropdown-item command="projectControl">项目管理</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div class="welcome font-topBar">
          欢迎 ， {{ loginInfo.nickName || loginInfo.realName }}
        </div> -->
      </div>
    </div>
    <el-dialog
      v-draggable
      title="修改密码"
      :visible.sync="changePass"
      width="630px"
      @close="cancelEditPasswd"
      :close-on-press-escape="true"
      :close-on-click-modal="false"
    >
      <password-info ref="formPass" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { todo as getTaskTodo } from "@/api/flow";
import { refreshDictItemList } from "@/api/dict";
// import { getTaskTodo } from "@/api/notice";
import PasswordInfo from "@/views/Password/index";
import { socket } from "@szgc/plt-core";
// import Hamburger from '@/components/Hamburger'
// import { asyncRoutes } from '@/router'
import { BaseMixin } from "@/mixins/BaseMixin";
import { getToken } from "@/utils/auth";
export default {
  mixins: [BaseMixin],
  components: {
    LogoBox: () => import("./Logo.vue"),
    NoticeBar: () => import("@/components/NoticeBar/index"),
    TodoBar: () => import("./TodoBar/index"),
    // Hamburger,
    PasswordInfo,
  },
  props: {
    hideMenu: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      todoNum: 0,
      changePass: false,
    };
  },
  computed: {
    ...mapGetters(["loginInfo", "permissions", "menuRoutes", "hasLarge"]),
    isDev() {
      return process.env.NODE_ENV === "development";
    },
    pageMenuRoutes() {
      let menuRoutes = this.menuRoutes;
      return menuRoutes;
    },
  },

  beforeDestroy() {
    console.log("DestroyUpdateTodoNum");
    // 解绑更新待办事件数量事件总线
    // this.$bus.off("updateTodoNum", () => {});
    // this.socket && this.socket.uninstall && this.socket.uninstall('USER_TASK_TODO_UPDATE')
  },
  created() {
    console.log("cUpdateTodoNum");
    // 绑定更新待办事件数量事件总线
    // this.$bus.off('updateTodoNum',()=>console.log('$offsuccess'));
    // this.$bus.on("updateTodoNum", (val) => {
    //   console.log("$busupdateTodoNum---------222222222222222222222222222222222222222222222---------")
    //   this.updateTodoNum();
    // });
  },
  mounted() {
    this.updateTodoNum();
    // console.log(asyncRoutes)
  },
  methods: {
    daping() {
      const token = getToken();
      const origin = window.location.origin;
      window.open(`${origin}/large-screen/?token=${token}`, "_blank");
    },
    todo() {
      console.log("跳转");
      this.$router.push("/common/flow");
    },
    isCurrentSubTheme(node) {
      try {
        if (node.permCode === this.$route.query.permCode) {
          return true;
        } else {
          return node.children.some((i) => this.isCurrentSubTheme(i));
        }
      } catch (e) {
        return false;
      }
    },
    async pickRootPage(route) {
      //permType 自定义菜单：0，视图菜单：4 按钮: 2，
      // 只跳转叶子节点
      if (route.children && route.children.length) {
        let subRoute = route.children.find(
          (x) => x.permType === 0 || x.permType === 4
        ); //route.children[0]
        if (subRoute) {
          return this.pickRootPage(subRoute);
        }
      }
      let path = "";
      if (route.permType === 0) {
        path = `${route.dataViewConfId}?permCode=${route.permCode}`;
      } else if (route.permType === 4) {
        path = `/customTable?viewId=${route.dataViewConfId}&permCode=${route.permCode}&name=${route.name}`;
      }
      this.$router.push(path);
    },
    async updateTodoNum() {
      const { data } = await getTaskTodo({
        taskStatus: 1,
      });
      // console.log("updateTodoNum", data.total);
      this.todoNum = data.total;
    },
    onSocketMessage(e) {
      // this.updateTodoNum()
    },
    cancelEditPasswd() {
      this.changePass = false;
      this.$refs.formPass.reset();
    },
    logout() {
      this.$confirm("确定退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("user/logout").then((res) => {
            socket.off("NOTICE");
            this.$router
              .push(`/login?redirect=${this.$route.fullPath}`)
              .then(() => {
                location.reload();
              });
          });
        })
        .catch(() => {});
    },
    //清理字典缓存
    clearDict() {
      refreshDictItemList("qdxtpz").then((res) => {
        if (res.success) {
          this.$message.success("清理成功！");
        } else {
          this.$message.error("清理失败！");
        }
      });
    },
    async getToken() {
      const { data } = await this.$api.getToken("");
      return data;
    },
    handleClick(command) {
      switch (command) {
        case "password":
          this.changePass = true;
          // this.$router.push({
          //   path: "/password",
          //   query: {
          //     redirect: this.$route.fullPath,
          //   },
          // });
          break;
        case "projectControl":
          this.$router.push({
            name: "project-control-index",
          });
          break;
        case "help":
          window.open(
            "/helpDocument/亭子口灌区一期工程工程数字建造平台文函管理模块使用办法（试行稿）.pdf",
            "_blank"
          );
          break;
        case "logout":
          this.logout();
          break;
        case "clearDict":
          this.clearDict();
          break;
        default:
          break;
      }
    },
    /* 通知消息事件处理*/
    async noticeEvt(data) {
      // console.log(this.noticeData);
      // console.log(data);
      if (data.type === "sure") {
        this.noticeData = data.data;
        if (data.data.noticeType === "1") {
          if (this.noticeData) {
            this.noticeShow = true;
          }
        } else if (data.data.noticeType === "20") {
          if (this.noticeData) {
            this.processPage = this.noticeData.noticeBizType;
            this.processData = {
              businessId: this.noticeData.noticeBizId,
              taskId: this.noticeData.noticeBizParams,
            };
            this.processShow = true;
          }
        } else {
          alert("自定义业务");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.navbar {
  position: relative;
  // background: #1a74f0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  background: #014acb;
  height: 5.56%;
  min-height: 54px;

  // z-index: 1;
  .selectedEngineer {
    margin-top: 6px;
  }

  .hamburger-container {
    cursor: pointer;
    position: fixed;
    top: 45vh;
    z-index: 999;
    width: 40px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      font-family: MiSans, MiSans;
      font-weight: 600;
      font-size: 18px;
      color: #ffffff;
      line-height: 32px;
      letter-spacing: 1px;
    }
  }

  .menu-box {
    height: 100%;
    display: flex;
    flex: 1;

    .menu-item {
      min-width: 130px;
      font-size: 18px;
      cursor: pointer;
      line-height: 60px;
      height: 60px;
      -webkit-transition: all 0.3s ease;
      transition: all 0.3s ease;
      padding: 0 20px;
      font-weight: 400;
      color: white;
      text-align: center;
      position: relative;

      .iconfont {
        font-size: 18px;
      }
    }

    .menu-item:hover {
      .sub-box {
        display: block;
      }
    }

    .menu-item-active,
    .menu-item:hover {
      border-bottom: 4px solid white;
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 4px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-wrapper {
      height: 100%;
      color: white;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;

      .user-avatar {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin: 0 10px;
        cursor: pointer;
      }

      .badge {
        height: 20px;
        width: 32px;
        margin-right: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -10px;
        font-size: 12px;
      }
    }
  }

  .el-dropdown {
    display: flex;
    align-items: center;
  }
}

// .icon-topBar {
//   position: relative;
//   top: 6px;
//   right: 10px;
// }
.font-topBar {
  height: 100%;
  font-weight: 500;
  font-size: 18px;
  margin: 0px 20px;
  cursor: pointer;
  color: white;
  display: flex;
  justify-items: center;
  align-items: center;

  .icon-topBar {
    width: 22px;
    height: 22px;
  }

  .dmgHome {
    background-image: url(@/assets/img/system/navi.png);
    background-position: center;
    background-size: 100%;
  }

  .text {
    text-indent: 10px;
    font-size: 16px;
  }
}

// .notice-bar {
//   cursor: pointer;
//   position: relative;
//   display: inline-block;
//   line-height: initial;

//   ::v-deep .el-badge__content.is-fixed {
//     padding: 3px;
//     height: 22px;
//     line-height: 14px;
//     width: 22px;
//     top: 5px;
//     right: 20px;
//     border: 0;
//   }
// }
.welcome {
  margin-left: 20px;
  margin-right: 5px;
}

// // 1080p以下自适应样式
// @media screen and (max-width: 1440px) {
//   .navbar {
//     height: 65px;
//     padding-top: 0px;
//   }
//   .font-topBar {
//     font-size: 16px;
//     margin-right: 0;
//   }
//   .icon-topBar {
//     width: 23px;
//     margin-right: 0;
//   }
//   .welcome {
//     font-size: 16px;
//     margin-right: 0;
//   }
//   ::v-deep .el-badge__content.is-fixed {
//     height: 20px;
//     line-height: 13px;
//   }
// }
// // 1080p自适应样式
// @media screen and (min-width: 1441px) and (max-width: 1920px) {
//   .navbar {
//     height: 85px;
//     padding-top: 0px;
//   }
//   .font-topBar {
//     font-size: 18px;
//     margin-right: 0;
//   }
//   .icon-topBar {
//     width: 27px;
//     margin-right: 0;
//   }
//   .welcome {
//     font-size: 18px;
//     margin-right: 0;
//   }
//   ::v-deep .el-badge__content.is-fixed {
//     height: 20px;
//     line-height: 13px;
//   }
// }
// @media screen and (min-width: 1921px) {
//   .navbar {
//     height: 100px;
//     padding-top: 0px;
//   }
// }
</style>

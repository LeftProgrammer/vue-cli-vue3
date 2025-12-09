<template>
  <div class="notice-bar">
    <el-badge
      :value="todoNum || ''"
      :is-dot="!!!todoNum || todoNum === 0"
      :hidden="!!!todoNum || todoNum === 0"
      class="badge-item"
      title="通知"
    >
      <slot v-if="$slots.icon" name="icon" />
      <img
        class="icon-topBar"
        :src="require('@/assets/img/system/mission.png')"
      />
    </el-badge>
    <span class="font-topBar">待办事项</span>
  </div>
</template>

<script>
import { todo as getTaskTodo } from "@/api/flow";
import { socket } from "@szgc/plt-core";

export default {
  components: {},
  props: {},
  data() {
    return {
      todoNum: 0,
    };
  },
  beforeDestroy() {
    console.log("DestroyUpdateTodoNum");
    // 解绑更新待办事件数量事件总线
    // this.$bus.off("updateTodoNum", () => {});
    // this.socket && this.socket.uninstall && this.socket.uninstall('USER_TASK_TODO_UPDATE')
  },
  created() {
    socket.connect();
    console.log("cUpdateTodoNum");
    // 绑定更新待办事件数量事件总线
    // this.$bus.off('updateTodoNum',()=>console.log('$offsuccess'));
    this.$bus.on("updateTodoNum", (val) => {
      this.$nextTick(() => {
        this.updateTodoNum();
      });
    });
    this.updateTodoNum();
    socket.on("NOTICE", (data) => {
      if (data.noticeType == "20") {
        this.updateTodoNum();
      }
    });
  },
  methods: {
    async updateTodoNum() {
      const { data } = await getTaskTodo({
        taskStatus: 1,
      });
      // console.log("updateTodoNum", data.total);
      this.todoNum = data.total;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-message-solid {
  font-size: 17px;
}

.notice-bar {
  cursor: pointer;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .badge-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .badge-item .el-badge__content.is-fixed {
    padding: 3px;
    height: 22px;
    line-height: 14px;
    width: 22px;
    top: 2px;
    right: 20px;
  }
}

.notice-drawer {
  ::v-deep .el-drawer__header {
    padding: 10px 20px;
    margin-bottom: 5px;
    border-bottom: 1px solid #eee;
  }
}

.notice-dialog {
  ::v-deep .el-dialog__header {
    padding: 0 10px;
    height: 45px;
    line-height: 45px;
    background-color: #00c0ff;
  }

  ::v-deep .el-dialog__body {
    width: 100% !important;
    height: calc(100% - 45px);
    padding: 0;
  }
}
.icon-topBar {
  position: relative;
  right: 8px;
  width: 22px;
  height: 24px;
}
.font-topBar {
  font-weight: 500;
  font-size: 16px;
  margin-left: 0px;
  margin-right: 10px;
  line-height: 46px;
  color: white;
}
::v-deep .el-badge__content {
  border: 0;
}

// // 1080p以下自适应样式
// @media screen and (max-width: 1440px) {
//   .font-topBar {
//     font-size: 16px;
//     margin-right: 0;
//   }
//   .icon-topBar {
//     width: 22px;
//     margin-right: 0;
//   }
// }
// // 1080p自适应样式
// @media screen and (min-width: 1441px) and (max-width: 1920px) {
//   .font-topBar {
//     font-size: 18px;
//     margin-right: 0;
//   }
//   .icon-topBar {
//     width: 22px;
//     margin-right: 0;
//   }
// }
</style>

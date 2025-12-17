<template>
  <div class="todo-bar" @click="goTodo">
    <el-badge
      :value="todoNum || ''"
      :is-dot="!todoNum || todoNum === 0"
      :hidden="!todoNum || todoNum === 0"
      class="badge-item"
      title="待办事项"
    >
      <img class="icon-topBar" :src="missionIcon" />
    </el-badge>
    <span class="font-topBar">待办事项</span>
  </div>
</template>

<script>
import { socket } from "@/utils/socket";
import { todo as getTaskTodo } from "@/api/flow";

export default {
  name: "TodoBar",
  data() {
    return {
      todoNum: 0,
      missionIcon: require("@/assets/img/system/mission.png"),
      onSocketNoticeHandler: null,
      onBusHandler: null,
    };
  },
  created() {
    socket.connect();

    this.onBusHandler = () => {
      this.updateTodoNum();
    };
    this.$bus.on("updateTodoNum", this.onBusHandler);

    this.onSocketNoticeHandler = data => {
      if (data && String(data.noticeType) === "20") {
        this.updateTodoNum();
      }
    };
    socket.on("NOTICE", this.onSocketNoticeHandler);

    this.updateTodoNum();
  },
  beforeUnmount() {
    if (this.onBusHandler) {
      this.$bus.off("updateTodoNum", this.onBusHandler);
      this.onBusHandler = null;
    }
    if (this.onSocketNoticeHandler) {
      socket.off("NOTICE", this.onSocketNoticeHandler);
      this.onSocketNoticeHandler = null;
    }
  },
  methods: {
    goTodo() {
      const path = "/common/flow";
      if (this.$route && this.$route.path === path) return;
      this.$router.push(path).catch(() => {});
    },
    async updateTodoNum() {
      try {
        const res = await getTaskTodo({ taskStatus: 1 });
        const total = (res && res.data && res.data.total) ?? 0;
        this.todoNum = Number(total) || 0;
      } catch (e) {
        this.todoNum = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.todo-bar {
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
</style>

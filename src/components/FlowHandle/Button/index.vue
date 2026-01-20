<template>
  <div class="list-button-container">
    <!-- 显示更多 -->
    <template v-if="showMore">
      <el-link
        v-for="(item, index) in btns.slice(0, 2)"
        :key="index"
        :type="item.method == 'delete' ? 'danger' : item.type || 'primary'"
        :underline="false"
        :disabled="disabledBtn(item)"
        @click="handleClick(item)"
      >
        {{ item.title }}
      </el-link>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in btns.slice(2, btns.length)"
              :key="index"
              :command="item.method"
              :disabled="disabledBtn(item)"
            >
              {{ item.title }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <!-- 不显示更多 -->
    <template v-else>
      <el-link
        v-for="(item, index) in btns"
        :key="index"
        :type="item.method == 'delete' ? 'danger' : item.type || 'primary'"
        :disabled="disabledBtn(item)"
        :underline="false"
        @click="handleClick(item)"
      >
        {{ item.method == "delete" && isSystem ? "管理员" : "" }} {{ item.title }}
      </el-link>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ArrowDown } from '@element-plus/icons-vue';
import { sendMessage, deleteWait, deleteTaskData } from "@/api/flow";

const flowPageStatus = {
  0: "mine",
  1: "todo",
  2: "done",
  3: "cc",
  4: "wait",
  5: "sent",
  6: "fine",
  7: "term"
};

export default {
  name: "FlowHandleButton",
  components: {
    ArrowDown
  },
  props: {
    promiseCode: {
      type: String,
      default: ""
    },
    row: {
      type: Object,
      default: () => ({})
    },
    flowName: {
      type: String,
      default: ""
    },
    btns: {
      type: Array,
      default: () => [
        { title: "办理", method: "deal" },
        { title: "催办", method: "press" },
        { title: "删除", method: "delete" }
      ]
    }
  },
  emits: ["click", "delete"],
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    showMore() {
      return this.btns.length > (this.isSystem ? 2 : 3);
    },
    userId() {
      const userInfo = this.$getStorage && this.$getStorage("userInfo");
      return userInfo ? userInfo.userId : null;
    },
    userInfo() {
      return this.$getStorage ? this.$getStorage("userInfo") : null;
    },
    isSystem() {
      const username = this.userInfo && this.userInfo.username;
      return username === "system" || username === "super";
    },
    isCreatePerson() {
      if (this.userInfo && this.row.createUser) {
        return this.userInfo.userId == this.row.createUser;
      }
      return false;
    }
  },
  methods: {
    disabledBtn({ method, disabled }) {
      if (method == "deal") {
        // 办理
        if (
          (this.row.taskStatus == 1 &&
            this.row?.matterTaskTodo?.userId === this.userId) ||
          (this.row.taskStatus == 4 && this.isCreatePerson)
        ) {
          return false;
        } else {
          return true;
        }
      } else if (method == "press") {
        // 催办
        if (this.row.flowStatus == 0 || this.row.flowStatus == 2) {
          return true;
        } else {
          // 流程节点到自己的不能催办
          if (
            this.row.taskStatus == 1 &&
            this.row?.matterTaskTodo?.userId === this.userId
          ) {
            return true;
          } else {
            return false;
          }
        }
      } else if (method == "delete") {
        if (this.isSystem) return false;
        // 拒签也置灰
        if (Object.prototype.hasOwnProperty.call(this.row, "signStatus") && this.row.signStatus == 3) {
          return false;
        }
        let statuss = ["wait"];
        return (
          ((!this.status && this.row.flowStatus == 0) ||
            statuss.includes(this.status) ||
            this.row.taskStatus === 4) &&
          this.isCreatePerson
        );
      } else {
        return disabled;
      }
    },
    handleClick({ method, confirm, title }) {
      // 需要二次提醒
      if (method === "delete" || confirm) {
        this.$confirm(`确认${title}吗?`, "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteHandle(this.row);
          })
          .catch(() => {});
      } else if (method === "deal") {
        this.editHandle(this.row);
      } else if (method == "press") {
        // 催办二次确认
        this.$confirm("确认催办？催办会给当前处理人发送提醒，此操作不可撤回。", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.pressHandle(this.row);
          })
          .catch(() => {});
      } else if (method == "view") {
        this.viewHandle(this.row);
      } else {
        this.$emit(method, this.row);
      }
    },
    handleCommand(command) {
      const btn = this.btns.find((item) => item.method === command);
      this.handleClick(btn);
    },
    viewHandle(row) {
      let status = flowPageStatus[row.taskStatus];
      status = "fine";
      let task = row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun;
      this.$emit("click", row, status, task, "view");
    },
    editHandle(row) {
      let status = flowPageStatus[row.taskStatus];
      let task = row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun;
      this.$emit("click", row, status, task, "view");
    },
    pressHandle(row) {
      // 后端期望接收数组格式，且需要在row末尾添加businessId和pacId
      const data = {
        ...row,
        businessId: row.id,
        pacId: row.procMatterRun?.pacId || ""
      };
      sendMessage([data]).then((res) => {
        if (res && res.success) {
          this.$message.success("催办成功");
        } else {
          this.$message.error((res && res.message) || "催办失败");
        }
      }).catch(() => {
        this.$message.error("催办失败");
      });
    },
    deleteHandle(row) {
      if (!row.id) return;
      // 管理员删除
      if (this.isSystem) {
        deleteTaskData(row.id).then((res) => {
          if (res && res.success) {
            this.$message.success("删除成功");
            this.$emit("delete", row);
          } else {
            this.$message.error((res && res.message) || "删除失败");
          }
        }).catch(() => {
          this.$message.error("删除失败");
        });
      } else if (row.taskStatus === 4 || row.flowStatus === 0) {
        // 待发删除
        deleteWait(row.id).then((res) => {
          if (res && res.success) {
            this.$message.success("删除成功");
            this.$emit("delete", row);
          } else {
            this.$message.error((res && res.message) || "删除失败");
          }
        }).catch(() => {
          this.$message.error("删除失败");
        });
      } else {
        this.$emit("delete", row);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.list-button-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  > * {
    padding: 0 8px;
  }
  .el-dropdown {
    .el-dropdown-link {
      height: 100%;
      color: #014acb;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
}
</style>

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
        plain
        @click="handleClick(item, row)"
      >
        {{ item.title }}
      </el-link>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          更多<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in btns.slice(2, btns.length)"
            :key="index"
            :command="item.method"
            :disabled="disabledBtn(item)"
          >
            {{ item.title }}
          </el-dropdown-item>
        </el-dropdown-menu>
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
        plain
        @click="handleClick(item, row)"
      >
        {{ item.method == "delete" && isSystem ? "管理员" : "" }} {{ item.title }}
      </el-link>
    </template>
    <!--流程的按钮权限-->
    <!-- <slot name="button" />
    <el-link
      type="primary"
      v-if="
        row.flowName == '管理局文秘分发' &&
        isUploadOaPerson(row) &&
        btns.includes('uploadOa') &&
        !isSystem &&
        !isMdgAdmin
      "
      :disabled="row.uploadOaLoading || row.isReportedOa === 1 ? true : false"
      @click="uploadOaMessage(row)"
    >
      <i v-if="row.uploadOaLoading" class="el-icon-loading"></i>
      上报OA
    </el-link>
    <el-divider
      :disabled="!showView"
      direction="vertical"
      v-if="
        row.flowName == '管理局文秘分发' &&
        isUploadOaPerson(row) &&
        btns.includes('uploadOa') &&
        !isSystem &&
        !isMdgAdmin
      "
    ></el-divider>
    <el-link type="primary" @click="viewHandle(row)" v-if="btns.includes('view')">
      查看
    </el-link>
    <el-divider
      :disabled="!showView"
      direction="vertical"
      v-if="btns.includes('view') && !isSystem && !isMdgAdmin"
    ></el-divider>
    <el-link
      type="primary"
      @click="editHandle(row)"
      :disabled="!showEdit"
      v-if="btns.includes('deal') && !isSystem && !isMdgAdmin"
    >
      办理
    </el-link>
    <el-divider
      direction="vertical"
      v-if="btns.includes('press') && !isSystem && !isMdgAdmin"
    ></el-divider>
    <el-link
      type="primary"
      @click="pressHandle(row)"
      :disabled="!showPress"
      v-if="btns.includes('press') && !isSystem && !isMdgAdmin"
    >
      催办
    </el-link>

    <el-divider
      direction="vertical"
      v-if="btns.includes('delete') && !isSystem && !isMdgAdmin"
    ></el-divider>
    <el-link
      v-if="showDelete && btns.includes('delete') && !isSystem && !isMdgAdmin"
      type="danger"
      plain
      @click="deleteHandle(row)"
    >
      删除
    </el-link>
    <el-link
      v-if="!showDelete && btns.includes('delete') && !isSystem && !isMdgAdmin"
      disabled
      type="danger"
    >
      删除
    </el-link>

    <el-divider direction="vertical" v-if="isSystem"></el-divider>
    <el-link v-if="isSystem" type="danger" plain @click="deleteHandle(row)">
      管理员删除
    </el-link> -->
  </div>
</template>
<script>
import flow from "@/utils/flow";
import enums from "@/config/enums";
import { mapGetters } from "vuex";
import { sendMessage } from "@/views/common/flow/api";
import { BaseMixin } from "@/mixins/BaseMixin";

const flowPageStatus = {
  0: "mine",
  1: "todo",
  2: "done",
  3: "cc", //"wait",
  4: "wait", //"sent",
  5: "sent", //"fine",
  6: "fine",
  7: "term"
};
export default {
  name: "FlowHandle-Button",
  mixins: [BaseMixin],
  props: {
    promiseCode: {
      type: String,
      default: ""
    },
    /**流程业务信息 */
    row: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**流程业务信息 */
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

  data() {
    return {
      /**当前业务数据对应流程状态，mine我的模板(初始) todo待办 done已办 wait待发 sent已发 fine办结 term终止 cc抄送 */
      status: null,

      /**当前数据的按钮名称 */
      btntext: "查看",
      realtext: "查看",
      /**任务 */
      task: null,

      /**待办列表 */
      todolist: [],
      /**已办列表 */
      donelist: [],
      /**待发列表 */
      readysendlist: [],
      /**已发列表 */
      oversendlist: [],
      /**办结列表 */
      finishedlist: [],
      /**抄送列表 */
      cclist: [],

      FLOW_PAGE_ENUM: enums.FLOW_PAGE_ENUM
    };
  },

  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    showMore() {
      return this.btns.length > (this.isSystem ? 2 : 3) ? true : false;
    },
    userId() {
      return this.$getStorage("userInfo").userId;
    },
    disabledBtn() {
      return ({ method, disabled }) => {
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
          if (this.row.hasOwnProperty("signStatus") && this.row.signStatus == 3) {
            return false;
          }
          let statuss = ["wait"];
          //1 待办 2 已办 3 抄送 4 待发 5 已发 6 办结 7 终止
          return (
            ((!this.status && this.row.flowStatus == 0) ||
              statuss.includes(this.status) ||
              this.row.taskStatus === 4) &&
            this.isCreatePerson
          );
        } else {
          return disabled;
        }
      };
    },
    buttonResources() {
      const route = this.$route;
      const { query } = route;
      // if set path, the sidebar will highlight the path you set
      let permCode;
      if (query && query.permCode) {
        permCode = query.permCode;
      }

      let items = this.getMenuButtonItems(this.menuRoutes, permCode);
      return items.map((x) => x.value);
    },

    showView() {
      // console.log(this.status);
      if (!this.status) {
        return false;
      }
      let statuss = ["wait", "done", "sent", "fine", "cc", "todo"];
      return statuss.includes(this.status);
    },
    showEdit() {
      if (this.isMdgAdmin) return false;
      let bool = false;
      let userInfo = this.$getStorage("userInfo");
      // 流程节点到自己的代办能办理  或者 自己创建的待发能办理
      // ||(this.row.taskStatus == 3 && this.isCreatePerson)
      if (
        (this.row.taskStatus == 1 &&
          this.row?.matterTaskTodo?.userId === userInfo.userId) ||
        (this.row.taskStatus == 4 && this.isCreatePerson)
      ) {
        bool = true;
      } else {
        bool = false;
      }
      // signStatus 0 1 2 3 4 5 6   未签收 部分签收 已签收  拒签  签收退回 5完成(代表的是当前的子流程完全结束了)  6发起之后文秘之前
      let data = this.row;
      if (bool && data.hasOwnProperty("signStatus")) {
        console.log("我是收发文");
        const { documentType, unitType } = this.$route.meta;
        if (data.flowStatus == 2) {
          bool = false;
        } else if (data.flowStatus == 0) {
          // console.log(" 操作按钮data.flowStatus", data.flowStatus);
          // console.log(" 操作按钮documentType", documentType);
          // console.log(" 操作按钮data.signStatus", data.signStatus);
          // 拒签 跟 退回 收文就不能 点击办理
          if (documentType == 1 && (data.signStatus == 3 || data.signStatus == 4)) {
            // console.log(" 拒签 跟 退回");
            bool = false;
          } else {
            // console.log("排除拒签 ");
            bool = true;
          }
        } else {
          // 区分发文  界面还是收文界面
          // documentType 1 收文  2 发文
          if (documentType == 2) {
            // 判断 是不是 已经发文了
            if (data.signStatusList.length > 0) {
              // signStatus 0 1 2 3 4 5 6   未签收 部分签收 已签收  拒签  签收退回 5完成(代表的是当前的子流程完全结束了)  6发起之后文秘之前
              // data.signStatus == 2 ||
              if (data.signStatus == 0 && data.flowName == "文秘结束流程") {
                bool = false;
                return;
              }
              if (
                data.signStatus == 3 ||
                data.signStatus == 4 ||
                data.signStatus == 5 ||
                data.signStatus == 0 ||
                data.signStatus == 6
              ) {
                bool = true; //可以编辑
              } else {
                bool = false; //不可以编辑
              }
            } else {
              bool = true;
            }
          } else {
            if (data.hasOwnProperty("signStatus") && data.signStatus == 3) {
              bool = false;
            }
          }
        }
      }
      // console.log("showEdit", bool);
      return bool;
    },
    showPress() {
      let bool = false;
      //“未提交” “已完成”的 催办按钮置灰不显示
      if (this.row.flowStatus == 0 || this.row.flowStatus == 2) {
        return false;
      }
      let userInfo = this.$getStorage("userInfo");
      // 流程节点到自己的不能催办
      if (
        this.row.taskStatus == 1 &&
        this.row?.matterTaskTodo?.userId === userInfo.userId
      ) {
        bool = false;
      } else {
        bool = true;
      }
      return bool;
    },
    showDelete() {
      if (this.isMdgAdmin) return false;
      // 拒签也置灰
      if (this.row.hasOwnProperty("signStatus") && this.row.signStatus == 3) {
        return false;
      }
      let statuss = ["wait"];
      //1 待办 2 已办 3 抄送 4 待发 5 已发 6 办结 7 终止
      return (
        ((!this.status && this.row.flowStatus == 0) ||
          statuss.includes(this.status) ||
          this.row.taskStatus === 4) &&
        this.isCreatePerson
      );
    },
    isCreatePerson() {
      // console.log("是不是创建人", this.row);
      // 判断当前登录人是不是创建人
      let delPromise = true;
      let userInfo = this.$getStorage("userInfo");
      if (userInfo) {
        if (userInfo.userId == this.row.createUser) {
          delPromise = true;
        } else {
          delPromise = false;
        }
      } else {
        delPromise = false;
      }
      return delPromise;
    }
  },
  watch: {},
  methods: {
    /**
     * @description: 点击按钮触发的事件
     */
    handleClick({ method, confirm, title }) {
      // 需要二次提醒
      if (method === "delete" || confirm) {
        this.$confirm(`确认${title}吗?`, "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            console.log("🚀 ~ handleClick ~ method:", method);
            this.deleteHandle(this.row);
          })
          .catch(() => {});
      } else if (method === "deal") {
        this.editHandle(this.row);
      } else if (method == "press") {
        this.pressHandle(this.row);
      } else if (method == "view") {
        this.viewHandle(this.row);
      } else {
        this.$emit(method, this.row);
      }
    },
    /**
     * @description: 点击更多按钮触发的事件
     */
    handleCommand(command) {
      const btn = this.btns.find((item) => item.method === command);
      this.handleClick(btn);
    },
    // 后期处理   判断当前人是不是  管理文秘分发
    isUploadOaPerson(row) {
      let user = this.$getStorage("userInfo");
      let isUploadOaPerson = false;
      if (user && user.userId) {
        if (row.receivingDepartment2 == user.userId) {
          isUploadOaPerson = true;
        }
      }
      return isUploadOaPerson;
    },
    uploadOaMessage(row) {
      this.$emit("uploadOaMessage", row);
    },
    // ===================================
    getDelCode() {
      const route = this.$route;
      const { query } = route;
      let permCode;
      if (query && query.permCode) {
        permCode = query.permCode + "_delete";
      }
      console.log(`删除权限code`, permCode + "_delete");
      return permCode + "_delete";
    },
    //通过permCode获取按钮权限
    getMenuButtonItems(menus, permCode) {
      if (!permCode) {
        return null;
      }
      if (menus.length === 0) {
        return [];
      }
      let item = menus.find((x) => x.permCode === permCode);
      if (item && item.children && item.children.length) {
        return item.children.filter((x) => x.permType === 2);
      } else {
        let childs = [];
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];
          if (menu.children && menu.children.length > 0) {
            childs.push(...menu.children);
          }
        }
        return this.getMenuButtonItems(childs, permCode);
      }
    },
    clickHandle(row, status, task) {
      this.$emit("click", row, status, task);
    },
    getFlowData() {
      let row = this.row;
      if (!row || !row.id) {
        return;
      }
      // this.status = "mine";

      // console.log("this.FLOW_PAGE_ENUM", this.FLOW_PAGE_ENUM);
      flow.getTodoList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item) {
          this.status = this.FLOW_PAGE_ENUM.todo;
          this.btntext = "办理";
          this.realtext = "待办";
          this.task = item;
        }
      });
      flow.getDoneList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = this.FLOW_PAGE_ENUM.done;
          this.btntext = "已办";
          this.realtext = "查看";
          this.task = item;
          console.log("getDoneList", this.status, this.btntext, this.task);
        }
      });
      flow.getReadysendList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = this.FLOW_PAGE_ENUM.wait;
          this.btntext = "待发";
          this.realtext = "办理";
          this.task = item;
        }
      });
      flow.getOversendList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = this.FLOW_PAGE_ENUM.sent;
          this.btntext = "已发";
          this.realtext = "查看";
          this.task = item;
          console.log("getOversendList", this.status, this.btntext, this.task);
        }
      });
      flow.getFinishedList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = this.FLOW_PAGE_ENUM.fine;
          this.btntext = "办结";
          this.realtext = "查看";
          this.task = item;
          console.log("getFinishedList", this.status, this.btntext, this.task);
        }
      });
      flow.getCcList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = this.FLOW_PAGE_ENUM.cc;
          this.btntext = "抄送";
          this.realtext = "查看";
          this.task = item;
          console.log("getCcList", this.status, this.btntext, this.task);
        }
      });
    },
    /**获取list页面 */
    getListVueComp(v) {
      let listVueComp = null;
      while (v.$parent) {
        if (v.$parent.oprateRow) {
          return v.$parent;
        }
        return this.getListVueComp(v.$parent);
      }
      return null;
    },
    /** 查看*/
    viewHandle(row) {
      // console.log("viewHandle", row);
      //如果是暂存数据，将状态重置一下，改成已办
      let status = flowPageStatus[row.taskStatus];
      // if (status === "wait") {

      // }
      status = "fine";
      let task = row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun;
      console.log(row, status, task);
      this.$emit("click", row, status, task, "view");
      // this.$emit("view", row, true);
    },
    /** 编辑*/
    editHandle(row) {
      let status = flowPageStatus[row.taskStatus];
      let task = row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun;
      console.log(row, status, task);
      this.$emit("click", row, status, task, "view");
    },
    /** 催办*/
    pressHandle(row) {
      // let status = flowPageStatus[row.taskStatus];
      // let task =
      //   row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun;
      // console.log(row, status, task);
      // this.$emit("click", row, status, task);
      row.businessId = row.procMatterRun.businessId;
      row.pacId = row.procMatterRun.pacId;
      this.$confirm("确认催办？催办会给当前处理人发送提醒，此操作不可撤回。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sendMessage([row]).then((res) => {
            console.log(res);
            if (res.success) {
              this.$message({
                type: "success",
                message: "催办成功!"
              });
            } else {
              this.$message({
                type: "error",
                message: "催办失败：" + res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消催办"
          });
        });
    },
    /** 删除*/
    deleteHandle(row) {
      console.log(row, this.status, this.task);
      if (!this.isSystem) {
        // this.$emit("click", this.row, this.status, this.task);
        if (row.id) {
          let status = flowPageStatus[row.taskStatus];
          if (status === "wait") {
            flow.deleteWait(row.id).then((res) => {
              if (res.success) {
                this.$emit("delete", row);
              }
            });
          } else {
            this.$emit("delete", row);
          }
        }
      } else {
        if (row.id) {
          this.$emit("delete", row);
          flow
            .deleteTaskData(row.id)
            .then((res) => {
              if (res.success) {
              }
            })
            .catch((err) => {
              console.error("管理员删除流程错误", row.id, err);
            });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .wbench-el-dialog.is-fullscreen {
  .el-dialog__body {
    height: calc(100% - 45px);
  }
}
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
    }
  }
}
</style>

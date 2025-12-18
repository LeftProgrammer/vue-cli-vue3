<template>
  <div class="investGeneralPay" style="width: 100%; height: 100%; padding: 15px">
    <TreeTableLayout
      :page="pageParams"
      :showExportBtn="false"
      @query="getTableData"
      @reset="reset"
      @page-size-change="handelPageSizeChange"
      @page-current-change="handelCurrentChange"
    >
      <template #form>
        <el-form :model="pageParams" :inline="true">
          <el-form-item label="流程名称:">
            <el-input v-model="pageParams.todoTitle" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="发起时间:">
            <el-date-picker
              v-model="pageParams.startTimeAndEndTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-form>
      </template>

      <template #opratebtns>
        <el-button v-if="showSelect" type="primary" @click="batchUrge">
          <el-icon style="margin-right: 4px"><Bell /></el-icon>
          批量催办
        </el-button>
      </template>

      <template #table>
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper" :style="{ width: treeWidth + 'px' }">
              <el-tree
                ref="tree"
                class="tree"
                :highlight-current="true"
                :data="treeData"
                :current-node-key="type"
                node-key="id"
                @node-click="handelNodeClick"
              />
            </div>
            <DragLine
              :minMoveX="0"
              :useTransform="false"
              @move-start="handleMoveStart"
              @moving="handleMoving"
              @move-end="handelMoveEnd"
            />
          </div>

          <div class="table-wrapper">
            <el-table
              v-if="showTable"
              ref="multipleTable"
              :data="tableData"
              height="100%"
              border
              @selection-change="handleSelectionChange"
              @header-dragend="handleHeaderDragEnd"
            >
              <el-table-column
                v-if="showSelect"
                type="selection"
                width="55"
                align="center"
              />

              <el-table-column
                label="序号"
                type="index"
                width="80"
                align="center"
                :index="getIndex"
              />

              <el-table-column
                v-if="showUrge"
                label="页面名称"
                prop="pageName"
                align="left"
                min-width="180"
              />
              <el-table-column
                v-if="showUrge"
                label="催办节点"
                prop="nodeName"
                align="left"
                min-width="180"
              />
              <el-table-column
                v-if="showUrge"
                label="消息接收人"
                prop="receiver"
                align="left"
                width="120"
              />
              <el-table-column
                v-if="showUrge"
                label="催办时间"
                prop="urgeDate"
                align="center"
                width="180"
              >
                <template #default="{ row }">
                  <span>{{ dateFormat(row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="showUrge"
                label="催办说明"
                prop="urgeInfo"
                min-width="180"
                align="left"
              />
              <el-table-column
                v-if="showUrge"
                label="催办结果"
                prop="urgeResult"
                align="left"
                min-width="180"
              >
                <template #default="{ row }">
                  <span :style="{ color: row.urgeFlag !== '0' ? 'red' : '' }">
                    {{ row && (row.urgeResult || "") }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                v-if="!showUrge"
                label="流程名称"
                min-width="180"
                align="left"
              >
                <template #default="{ row }">
                  <div>{{ getBusinessName(row) }}</div>
                </template>
              </el-table-column>

              <el-table-column
                v-if="type === 'cc'"
                label="发起人"
                prop="createUserName"
                align="left"
                width="120"
              >
                <template #default="{ row }">
                  <span>
                    {{
                      (row && row.matter && row.matter.createUserName) ||
                      row.startorName ||
                      ""
                    }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column
                v-if="!showUrge"
                label="发起时间"
                align="center"
                width="180"
              >
                <template #default="{ row }">
                  <span>{{ getStartTime(row) }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-if="type === 'todo' || type === 'done'"
                label="到达时间"
                prop="createTime"
                align="center"
                width="180"
              >
                <template #default="{ row }">
                  <span>{{ dateFormat(row.createTime) }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-if="type === 'todo' || type === 'done'"
                label="当前节点"
                prop="procTaskName"
                align="center"
                width="180"
              />

              <el-table-column
                v-if="!showUrge"
                label="操作"
                width="160"
                align="center"
              >
                <template #default="{ row }">
                  <el-link
                    v-if="type === 'todo' || type === 'wait'"
                    type="primary"
                    @click="todoHandle(row, 'edit')"
                  >
                    办理
                  </el-link>
                  <el-link v-else type="primary" @click="todoHandle(row, 'view')">
                    查看
                  </el-link>

                  <span v-if="showSelect" style="margin-left: 10px">
                    <el-divider direction="vertical" />
                    <el-link type="primary" @click="urge(row)">催办</el-link>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>

    <FlowDialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @child-evt="childEvtHandle"
      @closed="closeHandle"
    />
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import { Bell } from "@element-plus/icons-vue";
import TreeTableLayout from "@/components/ContentLayout/TreeTable/index.vue";
import DragLine from "@/views/archives/shared_component/DragLine/index.vue";
import FlowDialog from "@/components/FlowHandle/Dialog/index.vue";
import { dateFormat, computeTimeDuration } from "@/utils";
import { sendMessage } from "./api";
import { page } from "@/api/common";

export default {
  name: "CommonFlow",
  components: { TreeTableLayout, DragLine, FlowDialog, Bell },
  data() {
    return {
      pageParams: {
        total: 0,
        current: 1,
        pageSize: 20,
        size: 20,
        todoTitle: "",
        startTimeAndEndTime: [],
      },
      showTable: true,
      tableData: [],
      flowInfo: {
        businessId: "",
        page: "mine",
        status: "",
      },
      treeWidth: 267,
      dragStartTreeWidth: null,
      treeData: [
        { label: "待发事项", id: "wait" },
        { label: "待办事项", id: "todo" },
        { label: "抄送给我", id: "cc" },
        { label: "已办事项", id: "done" },
        { label: "我发起的", id: "sent" },
        { label: "我催办的", id: "urge" },
      ],
      type: "wait",
      url: {
        list: "/api/process/packages/self/proc-task-page/todo",
        todolist: "/api/process/packages/self/proc-task-page/todo",
        cclist: "/api/process/packages/self/proc-page/cc",
        donelist: "/api/process/packages/self/proc-task-page/done",
        sentlist: "/api/process/packages/self/proc-page/done",
        urgelist: "/api/urge/result/page",
        waitlist: "/api/process/packages/self/proc-page/todo",
      },
      flowShow: false,
      multipleSelection: [],
    };
  },
  computed: {
    showUrge() {
      return this.type === "urge";
    },
    showSelect() {
      return this.type === "sent";
    },
    storageTaskKey() {
      return `flow_task_row_${this.flowInfo.businessId}_v3`;
    },
  },
  watch: {
    type: {
      handler(newValue, oldValue) {
        this.showTable = false;
        this.pageParams.todoTitle = "";
        this.pageParams.startTimeAndEndTime = [];
        this.pageParams.current = 1;
        this.pageParams.pageSize = 20;
        this.pageParams.size = 20;

        if (newValue !== oldValue) {
          if (newValue === "wait") {
            this.url.list = this.url.waitlist;
            this.flowInfo.page = "wait";
          } else if (newValue === "todo") {
            this.url.list = this.url.todolist;
            this.flowInfo.page = "todo";
          } else if (newValue === "cc") {
            this.url.list = this.url.cclist;
            this.flowInfo.page = "cc";
          } else if (newValue === "done") {
            this.url.list = this.url.donelist;
            this.flowInfo.page = "done";
          } else if (newValue === "sent") {
            this.url.list = this.url.sentlist;
            this.flowInfo.page = "sent";
          } else if (newValue === "urge") {
            this.url.list = this.url.urgelist;
            this.flowInfo.page = "urge";
          }

          this.getTableData();
          this.$nextTick(() => {
            this.showTable = true;
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    dateFormat,
    computeTimeDuration,
    handelPageSizeChange(page) {
      this.pageParams.current = 1;
      this.pageParams.pageSize = page.pageSize;
      this.pageParams.size = page.pageSize;
      this.getTableData();
    },
    handelCurrentChange(page) {
      const nextCurrent = page && page.current;
      if (!nextCurrent || nextCurrent === this.pageParams.current) return;
      this.pageParams.current = nextCurrent;
      this.getTableData();
    },
    handelNodeClick(data) {
      const nextType = data && data.id;
      if (!nextType || nextType === this.type) return;
      this.type = nextType;
    },
    handleSelectionChange(val) {
      const newData = [];
      (val || []).forEach(i => {
        newData.push({ businessId: i.businessId, pacId: i.pacId });
      });
      this.multipleSelection = newData;
    },
    batchUrge() {
      this.sendMsg(this.multipleSelection);
    },
    urge(row) {
      this.sendMsg([row]);
    },
    sendMsg(rows) {
      if (!rows || !rows.length) {
        ElMessage.warning("请选择要催办的数据");
        return;
      }
      ElMessageBox.confirm(
        "确认催办？催办会给当前处理人发送提醒，此操作不可撤回。",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => sendMessage(rows))
        .then(res => {
          if (res && res.success) {
            ElMessage.success("催办成功!");
          } else {
            ElMessage.error("催办失败：" + ((res && res.message) || ""));
          }
        })
        .catch(() => {
          ElMessage.info("已取消催办");
        });
    },
    getStartTime(row) {
      let time = "";
      if (this.type === "done" || this.type === "todo") {
        time = (row && row.matter && row.matter.createTime) || "";
      } else if (this.type === "cc" || this.type === "wait" || this.type === "sent") {
        time = (row && row.createTime) || "";
      }
      return dateFormat(time);
    },
    getBusinessName(row) {
      if (this.type === "todo") {
        return (row && (row.todoTitle || (row.matter && row.matter.businessName))) || "";
      } else if (this.type === "cc") {
        return (row && (row.todoTitle || row.businessName)) || "";
      } else if (this.type === "done") {
        return (row && (row.todoTitle || row.doneTitle)) || "";
      } else if (this.type === "sent") {
        return (row && (row.todoTitle || row.businessName)) || "";
      } else if (this.type === "wait") {
        return (row && (row.todoTitle || row.businessName)) || "";
      }
      return "";
    },
    closeHandle() {
      localStorage.removeItem(this.storageTaskKey);
      this.flowShow = false;
    },
    childEvtHandle() {
      this.$bus.emit("updateTodoNum");
      this.getTableData();
      this.flowShow = false;
    },
    todoHandle(row, actionType) {
      if (!row) return;
      this.flowInfo.status = row.suspended;
      this.flowInfo.taskId = row.procTaskId;
      this.flowInfo.procTaskId = row.procTaskId;
      this.flowInfo.businessId = row.businessId;

      if (actionType === "edit") {
        this.flowInfo.page = row.type || this.flowInfo.page;
      } else {
        this.flowInfo.page = "fine";
        this.$setStorage("flow_page_type", "fine");
      }

      const flowConfigId = row.flowConfigId || (row.matter && row.matter.flowConfigId);
      this.flowInfo.flowConfigId = flowConfigId;

      localStorage.removeItem(this.storageTaskKey);
      localStorage.setItem(this.storageTaskKey, JSON.stringify({ flowInfo: this.flowInfo }));
      this.flowShow = true;
    },
    reset() {
      this.pageParams = {
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        todoTitle: "",
        startTimeAndEndTime: [],
      };
      this.getTableData();
    },
    async getTableData(pageInfo, businessId) {
      const pageParams = Object.assign({}, this.pageParams, pageInfo || {});

      if (pageParams.startTimeAndEndTime && pageParams.startTimeAndEndTime.length > 0) {
        pageParams.matterSentStartTime = pageParams.startTimeAndEndTime[0];
        pageParams.matterSentEndTime = pageParams.startTimeAndEndTime[1];
        delete pageParams.startTimeAndEndTime;
      }

      if (this.type === "done") {
        pageParams.doneTitle = pageParams.todoTitle;
      } else {
        pageParams.businessName = pageParams.todoTitle;
      }

      if (businessId) pageParams.businessId = businessId;
      else delete pageParams.businessId;
      try {
        const res = await page(this.url.list, pageParams);
        if (res && res.success) {
          const records = (res.data && res.data.records) || [];
          this.tableData = await this.loadAfter(records);
          this.pageParams.total = (res.data && res.data.total) || 0;
          if (businessId && records && records[0]) {
            this.todoHandle(records[0], "edit");
          }
        } else {
          ElMessage.error((res && res.message) || "查询失败");
        }
      } catch (e) {
        // request.js 内部对“节流/过于频繁”的请求会 reject(errorCode=10000) 且全局不提示，这里也不再误报
        if (e && e.errorCode === 10000) return;
        ElMessage.error("查询失败");
        console.error(e);
      }
    },
    handelMoveEnd(moveX) {
      const base = this.dragStartTreeWidth !== null ? this.dragStartTreeWidth : this.treeWidth;
      this.treeWidth = base + moveX;
      this.dragStartTreeWidth = null;
    },
    handleMoveStart() {
      this.dragStartTreeWidth = this.treeWidth;
    },
    handleMoving(moveX) {
      if (this.dragStartTreeWidth === null) {
        this.dragStartTreeWidth = this.treeWidth;
      }
      this.treeWidth = this.dragStartTreeWidth + moveX;
    },
    async loadAfter(records) {
      const tableData = [...(records || [])];
      if (tableData.length > 0) {
        for (let i = 0; i < tableData.length; i++) {
          const row = tableData[i];
          const title = row.title || row.flowName || row.businessName;
          if (!title) continue;

          row.title = title;

          const endTime = dateFormat(row.matter && row.matter.createTime);
          const index1 = title.indexOf("-");
          const index2 = title.indexOf("（");
          const index3 = title.indexOf(" ");
          const index4 = title.indexOf("）");

          if (index1 > 0) {
            row.flowName = title.substring(0, index1);
          }

          if (index2 >= 0 && index3 > index2) {
            row.startorName = row.createUserName || title.substring(index2 + 1, index3);
          }

          if (index3 >= 0 && index4 > index3) {
            row.startorTime = title.substring(index3 + 1, index4) || endTime;
          } else {
            row.startorTime = endTime;
          }

          const index5 = title.indexOf("：");
          if (index5 >= 0) {
            row.curNodeName = title.substring(index5 + 1);
          }

          if (row.startorTime && endTime) {
            const { days } = computeTimeDuration(row.startorTime, endTime);
            row.takeTime = (days || 0) + 1;
          }
        }
      }
      return tableData;
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        const t = this.$refs.multipleTable;
        if (t && t.doLayout) {
          t.doLayout();
        }
      });
    },
    getIndex(index) {
      const curpage = this.pageParams.current;
      const limitpage = this.pageParams.pageSize;
      return index + 1 + (curpage - 1) * limitpage;
    },
  },
};
</script>

<style scoped lang="scss">
.investGeneralPay {
  height: 100%;
  overflow: hidden;

  .content {
    width: 100%;
    display: flex;
    height: 100%;

    .left-content {
      height: 100%;
      position: relative;

      &:hover {
        .tree-wrapper {
          border-right-color: rgba(var(--el-color-primary-rgb), 0.8);
        }
      }
    }

    .tree-wrapper {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      border: 1px solid var(--el-border-color);
      padding: 8px;
      box-sizing: border-box;
    }

    .table-wrapper {
      flex: 1;
      width: 0;
      border: none;
    }
  }
}
</style>

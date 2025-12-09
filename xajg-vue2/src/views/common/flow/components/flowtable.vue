<template>
  <div class="flow-table">
    <el-row class="w-100pre">
      <el-form :model="query" :inline="true" class="w-100pre">
        <el-col :span="5" class="" v-if="showSearchName">
          <el-form-item label="流程名称:" size="middle" prop="todoTitle">
            <el-input
              v-model="query.todoTitle"
              placeholder="请输入"
              class="w-215"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="" v-if="showSearchName">
          <el-form-item label="发起时间:" size="middle">
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 250px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col
          v-if="showSearchName"
          :span="showSearchName ? 13 : 24"
          class="flex justify-end"
        >
          <el-form-item size="middle">
            <el-button
              v-if="showSelect"
              type="primary"
              icon="el-icon-bell"
              @click="batchUrge"
              >批量催办</el-button
            >
            <el-button type="primary" icon="el-icon-search" @click="getTableData(true)"
              >查询
            </el-button>
            <el-button @click="reset" icon="el-icon-refresh-left" class="reset-btn" style="border: 1px solid #1298fa;
          background: #e9f5ff;
          color: #1298fa;"
              >重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="height: calc(100% - 60px)"
      border
      @selection-change="handleSelectionChange"
      v-if="showTable"
    >
      <el-table-column
        label="序号"
        type="index"
        :width="$calculateWidth(80)"
        align="center"
        :index="getIndex"
      />
      <el-table-column v-if="showSelect" type="selection" width="55"> </el-table-column>
      <el-table-column
        v-if="showUrge"
        label="页面名称"
        prop="pageName"
        align="center"
        width="90"
      />
      <el-table-column
        v-if="showUrge"
        label="催办节点"
        prop="nodeName"
        align="center"
        width="200"
      />
      <el-table-column
        v-if="showUrge"
        label="消息接收人"
        prop="receiver"
        align="center"
        width="100"
      />
      <el-table-column
        v-if="showUrge"
        label="催办时间"
        prop="urgeDate"
        align="center"
        width="180"
      >
        <template #default="{ row }">
          <span>
            {{ timeFormat(row.urgeDate) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="showUrge" label="催办说明" prop="urgeInfo" align="center" />
      <el-table-column
        v-if="showUrge"
        label="催办结果"
        prop="urgeResult"
        align="center"
        width="200"
      >
        <template #default="{ row }">
          <span :style="{ color: row.urgeFlag !== '0' ? 'red' : '' }">
            {{ row?.urgeResult || row.urgeResult || "" }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          /> -->
      <el-table-column v-if="!showUrge" label="流程名称" align="center">
        <template slot-scope="{ row }">
          <div>{{ getBusinessName(row) }}</div>
        </template>
      </el-table-column>
      >
      <!-- <el-table-column
        label="流程状态"
        prop="allData.flowStatus"
        align="center"
        width="auto"
        min-width="7%"
      >
        <template slot-scope="scope">
          <flow-status :row="scope.row" :flowName="flowName"></flow-status>
        </template>
      </el-table-column> -->
      <el-table-column
        label="发起人"
        prop="createUserName"
        align="center"
        width="120"
        v-if="type === 'cc'"
      >
        <template #default="{ row }">
          <span>
            {{ row?.matter?.createUserName || row.startorName || "" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="!showUrge" label="发起时间" align="center" width="160">
        <template #default="{ row }">
          <span>
            {{ getStartTime(row) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="type === 'todo' || type === 'done'"
        label="到达时间"
        title="待办"
        prop="createTime"
        align="center"
        width="160"
      >
        <template #default="{ row }">
          <span>
            {{ dateFormat(row.createTime, "yyyy-MM-DD HH:mm:ss") }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="type === 'todo' || type === 'done'"
        label="当前节点"
        title="待办"
        prop="procTaskName"
        align="center"
        width="180"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        v-if="!showUrge"
        prop="name"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <el-link
            v-if="type === 'todo' || type === 'wait'"
            @click="todoHandle(row, 'edit')"
            type="primary"
          >
            办理
          </el-link>
          <el-link v-else @click="todoHandle(row, 'view')" type="primary"> 查看 </el-link>
          <span v-if="showSelect" style="margin: 5px">
            <el-divider direction="vertical"></el-divider>
            <el-link @click="urge(row)" type="primary"> 催办 </el-link>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="closeHandle"
    ></flow-dialog>
  </div>
</template>

<script>
import { ListMixin } from "@/mixins/ListMixin";
import { dateFormat, computeTimeDuration } from "@/utils";
import FlowDialog from "@/components/FlowHandle/Dialog";
import { socket } from "@szgc/plt-core";
import { managementPage, getDatalistByIds, sendMessage } from "../api";
import { page } from "@/api/common";

export default {
  name: "common-flowtable",
  mixins: [ListMixin],
  components: { FlowDialog },
  data() {
    return {
      multipleSelection: [],
      showTable: true,
      /**流程弹窗 */
      flowShow: false,
      // /**流程状态 */
      // flowPage: "mine",
      /**流程弹窗信息 */
      flowInfo: {
        /**供应计划流程：流程id */
        businessId: "",
        // flowCfgId: "P1131979769345212416",
        /**状态 */
        page: "mine", //待办是todo，已办done，已发sent，

        status: ""
      },
      query: {},
      startTimeAndEndTime: [],
      pageParams: {
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0
      },
      url: {
        list: "/api/process/packages/self/proc-task-page/todo", //api/process/packages/self/todo
        todolist: "/api/process/packages/self/proc-task-page/todo", //api/process/packages/self/todo
        cclist: "/api/process/packages/self/proc-page/cc",
        donelist: "/api/process/packages/self/proc-task-page/done", //已办事项 对应 已办任务
        // donelist: "/api/process/packages/self/done",
        sentlist: "/api/process/packages/self/proc-page/done", //我发起的 对应 已发

        // /proc-task-pag
        //http://localhost:8087/api/process/packages/self/proc/1138485896262189056/all/logs
        urgelist: "/api/urge/result/page",
        waitlist: "/api/process/packages/self/proc-page/todo" //我发起的 对应 已发
      }
    };
  },

  mounted() {
    socket.connect();
    // this.getList();
    socket.on("NOTICE", (data) => {
      if (data.noticeType == "20" && this.type == "todo") {
        this.url.list = this.url.todolist;
        this.flowInfo.page = "todo";
        this.pageParams = Object.assign(this.pageParams, {
          size: 20,
          pageSize: 20,
          current: 1
        });
        this.getTableData();
      }
    });

    // 做签收监听
    window.addEventListener("message", this.signListener, false);
  },
  destroyed() {
    window.removeEventListener("message", this.signListener, false, null);
  },
  methods: {
    signListener(event) {
      // 处理接收到的消息
      if (Object.prototype.hasOwnProperty.call(event.data, "flowShow")) {
        console.log("处理接收到的消息", event.data);
        this.flowShow = event.data.flowShow;
      }
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    // 获取流程名称
    getBusinessName(row) {
      if (this.type == "todo") {
        return row.todoTitle || row.matter.businessName;
        // return row.matter.businessName
      } else if (this.type == "cc") {
        return row.todoTitle || row.businessName;
      } else if (this.type == "done") {
        return row.todoTitle || row.doneTitle;
      } else if (this.type == "sent") {
        return row.todoTitle || row.businessName;
      } else if (this.type == "wait") {
        return row.todoTitle || row.businessName;
      } else {
        return "";
      }
    },
    getTableData() {
      this.tableData = [];
      let query = { ...this.pageParams };
      console.log("this.type", this.type, query);
      if (this.type == "todo") {
        query.todoTitle = this.query.todoTitle;
      } else if (this.type == "done") {
        query.doneTitle = this.query.todoTitle;
      } else {
        query.businessName = this.query.todoTitle;
      }
      let start = new Date(this.startTimeAndEndTime?.[0]);
      let end = new Date(this.startTimeAndEndTime?.[1]);
      start.setHours(0);
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
      query.matterSentStartTime = start;
      query.matterSentEndTime = end;
      page(this.url.list, query).then(async (res) => {
        if (res.success) {
          if (typeof this.loadAfter === "function") {
            this.tableData = await this.loadAfter(this.pageParams, res.data.records);
          } else {
            this.tableData = res.data.records;
          }
          this.pageParams.total = res.data.total;
          this.$emit("loadAfter", this.pageParams);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    /**重置表格数据 */
    reset() {
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.pageParams.businessName = "";
      this.pageParams.matterSentStartTime = "";
      this.pageParams.matterSentEndTime = "";
      this.query = {};
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    // 批量催办
    batchUrge() {
      this.sendMsg(this.multipleSelection);
    },
    // 催办
    urge(row) {
      this.sendMsg([row]);
    },
    sendMsg(row) {
      this.$confirm(
        "确认催办？催办会给当前处理人发送提醒，此操作不可撤回。",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          sendMessage(row).then((res) => {
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
    handleSelectionChange(val) {
      const newData = [];
      val.map((i) => {
        newData.push(Object.assign({}, { businessId: i.businessId, pacId: i.pacId }));
      });
      this.multipleSelection = newData;
      console.log(this.multipleSelection);
    },
    showEdit(row) {
      let bool = false;
      // signStatus 0 1 2 3 4 5 6 未签收(只有再文秘盖章节点才会显示) 部分签收 已签收  拒签 退回 完成 被收文退后再退回到发起人
      console.log("请等待收文单位完结流程", row);
      if (
        row.signStatus != 0 &&
        (row.signStatus == 4 ||
          row.signStatus == 5 ||
          row.signStatus == 3 ||
          row.signStatus == 6 ||
          !row.signStatus)
      ) {
        bool = true; //可以办理
      } else {
        bool = false; //不可以办理
      }
      return bool;
    },
    //获取开始时间
    getStartTime(row) {
      let time = "";
      if (this.type === "done" || this.type === "todo") {
        time = row.matter?.createTime || "";
      } else if (this.type === "cc" || this.type === "wait" || this.type === "sent") {
        time = row.createTime;
      }
      return dateFormat(time, "yyyy-MM-DD HH:mm");
    },
    //获取处理时间
    getDealTime(row) {
      if (this.type !== "done") {
        return "";
      }
      // let dealTime = "";
      // let logsRes = await alllogs(row.businessId);
      // if (logsRes.success) {
      //   let logs = logsRes.data;
      //   let log = logs.find(
      //     (x) => x.logMsg.indexOf("【" + row.curNodeName + "】") >= 0
      //   );
      //   if (log) {
      //     dealTime = dateFormat(log.createTime, "yyyy-MM-DD HH:mm:ss");
      //   }
      // }
      return row.dealTime;
    },
    getTime(row) {
      let createTime = row.createTime || row?.matter?.createTime;
      return createTime ? dateFormat(createTime, "yyyy-MM-DD HH:mm:ss") : "";
    },
    dateFormat: dateFormat,
    computeTimeDuration: computeTimeDuration,
    /**弹窗关闭事件 */
    closeHandle() {
      localStorage.removeItem(this.storageTaskKey);
      this.flowShow = false;
    },
    /**点击事件 */
    childEvtHandle() {
      // 更新待办数量
      this.$bus.emit("updateTodoNum");
      if (typeof this.getTableData === "function") this.getTableData();
      this.flowShow = false;
    },
    /**办理 */
    async todoHandle(row, type) {
      // 收发文有一个特殊情况 就是一对if一 发文到文秘的之后会发给收文  发文这边会等待收文这边的流程状态进行 但是发文的数据还是在当前的办理人当中的 所以需要单独做一件事情就是  在这里去判断当前的流程 对应的收文是不是已经签收状态  如果不是已经签收状态就 就提示 并且 不能打开弹窗
      // 这里目前只能每个点击都请求数据
      // if (type == "edit") {
      //   this.$setStorage("flow_page_type", "todo");
      //   console.log("edit", row);
      //   let params = {
      //     id: row.businessId || ""
      //   };
      //   const { data, success } = await managementPage(params);
      //   console.log("data", data);
      //
      //   if (!success) {
      //     this.$message.error("获取流程信息失败");
      //     return;
      //   }
      //   if (data && Array.isArray(data) && data.length > 0) {
      //     const flowInfo = data[0];
      //     // documentType==2  发文
      //     console.log("flowInfo.documentType", flowInfo);
      //     if (flowInfo.flowName == "文秘结束流程") {
      //       if (flowInfo.documentType == 2 && !this.showEdit(flowInfo)) {
      //         this.$message.warning("请等待收文单位完结流程！");
      //         return;
      //       }
      //     }
      //   }
      // }
      this.flowInfo.status = row.suspended;
      this.flowInfo.taskId = row.procTaskId;
      this.flowInfo.procTaskId = row.procTaskId;
      this.flowInfo.businessId = row.businessId;
      if (type == "edit") {
        this.flowInfo.page = row.type || this.flowInfo.page;
      } else {
        this.flowInfo.page = "fine";
        this.$setStorage("flow_page_type", "fine");
      }

      let flowConfigId = row.flowConfigId || (row.matter && row.matter.flowConfigId);

      this.flowInfo.flowConfigId = flowConfigId;
      console.log("this.flowInfo", this.flowInfo, row);

      //移除业务列表中的缓存业务数据
      localStorage.removeItem(this.storageTaskKey);
      //添加待办任务的流程数据
      localStorage.setItem(
        this.storageTaskKey,
        JSON.stringify({ flowInfo: this.flowInfo })
      );
      this.flowShow = true;
    },
    /**加载完成后事件 */
    async loadAfter(page, _tableData) {
      console.log("loadAfter start", _tableData);
      let tableData = [..._tableData];
      if (tableData && tableData.length > 0) {
        for (let i = 0; i < tableData.length; i++) {
          let row = tableData[i];
          let flowName = "";
          let startorName = "";
          let startorTime = "";
          let curNodeName = "";
          let title = row.title || row.flowName || row.businessName;
          if (title) {
            row.title = title;
            let endTime = this.dateFormat(
              row.matter && row.matter.createTime,
              "yyyy-MM-DD HH:mm:ss"
            );

            //图纸分发流程-默认流程模板（陈亮 2023-08-18 13:15:34）：【监理文秘】\n确认签收
            //供应计划流程-供应计划流程模板（陈亮 2023-08-18 14:46:12）
            let index1 = title.indexOf("-");
            let index2 = title.indexOf("（");
            let index3 = title.indexOf(" ");
            let index4 = title.indexOf("）");
            flowName = title.substring(0, index1);
            startorName = row.createUserName || title.substring(index2 + 1, index3);
            startorTime = title.substring(index3 + 1, index4) || endTime;
            if (title.indexOf("：") >= 0) {
              let index5 = title.indexOf("：");
              curNodeName = title.substring(index5 + 1, title.length);
            }
            row.flowName = flowName;
            row.startorName = startorName;
            row.startorTime = startorTime;
            row.curNodeName = curNodeName;
            if (startorTime && endTime) {
              let {
                durationText,
                days,
                hours,
                minutes,
                seconds
              } = this.computeTimeDuration(startorTime, endTime);
              row.takeTime = days + 1;
            }
          }
        }
      }
      // this.tableData = [...tableData];
      console.log("tableData middle", tableData);
      // 将收发文的标题填充到流程名称前面
      const ids = tableData.map((obj) => obj.businessId);
      // const { data } = await getDatalistByIds(ids);
      // console.log("idsdata", data);
      // const idsMap = {};
      // data.forEach((obj) => {
      //   idsMap[obj.id] = obj;
      // });
      // tableData.forEach((row) => {
      //   const d = idsMap[row.businessId];
      //   if (d) {
      //     // row.data = { ...row.data, ...d };
      //     row.title = d.title + " " + row.title;
      //   }
      // });
      this.$emit("loadAfter", page);
      return tableData;
    }
  },
  computed: {
    showSearchName() {
      return this.type !== "urge";
    },
    /**流程数据传递key */
    storageTaskKey() {
      return "flow_task_row_" + this.flowInfo.businessId + "_v2";
    },
    //是否显示选择框
    showSelect() {
      console.log("showSelect", this.type);
      if (this.type === "sent") {
        return true;
      } else {
        return false;
      }
    },
    showUrge() {
      if (this.type === "urge") {
        return true;
      } else {
        return false;
      }
    }
  },
  props: {
    type: {
      type: String,
      default: "todo"
    }
  },
  watch: {
    type: {
      handler(newValue, oldValue) {
        console.log("todolist");
        this.showTable = false;
        this.$set(this.query, "todoTitle", "");
        this.$set(this.pageParams, "matterSentStartTime", "");
        this.$set(this.pageParams, "matterSentEndTime", "");
        this.$set(this.pageParams, "current", 1);
        this.$set(this.pageParams, "pageSize", 20);
        this.$set(this.pageParams, "businessName", "");
        this.startTimeAndEndTime = [];
        console.log("type watch", newValue, oldValue);
        if (newValue != oldValue) {
          switch (newValue) {
            case "wait":
              this.url.list = this.url.waitlist;
              this.flowInfo.page = "wait";
              break;
            case "todo":
              this.url.list = this.url.todolist;
              this.flowInfo.page = "todo";
              break;
            case "cc":
              this.url.list = this.url.cclist;
              this.flowInfo.page = "cc";
              break;
            case "done":
              this.url.list = this.url.donelist;
              this.flowInfo.page = "done";
              break;
            case "sent":
              this.url.list = this.url.sentlist;
              this.flowInfo.page = "sent";
              break;
            case "urge":
              this.url.list = this.url.urgelist;
              this.flowInfo.page = "urge";
              break;
          }
          this.pageParams = Object.assign(this.pageParams, {
            size: 20,
            pageSize: 20,
            current: 1
          });
          this.getTableData();
          this.$nextTick(() => {
            this.showTable = true;
          });
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.flow-table {
  height: 100%;
}

::v-deep .el-range-separator {
  font-size: 12px !important;
}
</style>

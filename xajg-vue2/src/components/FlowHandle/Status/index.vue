<template>
  <!--流程的流程状态-->
  <el-tag v-show="statusName" effect="plain" :type="linktype" @click="clickHandle">{{
    statusName
  }}</el-tag>
</template>
<script>
import flow from "@/utils/flow";
export default {
  name: "FlowHandle-Status",
  props: {
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
    }
  },
  created() {},
  mounted() {
    this.getFlowData();
  },
  components: {},
  computed: {
    statusName() {
      let row = this.row;
      let name = "未提交";
      this.linktype = "primary";
      if (!row) {
        return name;
      }
      // //1 待办 2 已办 3 抄送 4 待发 5 已发 6 办结 7 终止
      // if (row.taskStatus === 4) {
      //   return "未提交";
      // }
      if (row.flowStatus == 1) {
        this.linktype = "primary";
        return "流转中";
      }
      if (row.flowStatus == 2) {
        this.linktype = "success";
        return "已完成";
      }
      if (row.flowStatus == 3) {
        this.linktype = "primary";
        return "流转中";
      }
      return name;
    }
  },
  data() {
    return {
      /*状态 */
      linktype: "",

      /**当前业务数据对应流程状态 */
      status: null,
      /**当前数据的按钮名称 */
      btntext: "查看",
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
      finishedlist: []
      //mine我的模板(初始) todo待办 done已办 wait待发 sent已发 fine办结 term终止 cc抄送
    };
  },
  watch: {},
  methods: {
    clickHandle() {
      this.$emit("click", this.row, this.status, this.task);
    },
    getFlowData() {
      let row = this.row;
      if (!row || !row.id) {
        return;
      }
      let data = {
        clientType: "web",
        businessName: this.flowName,
        current: 1,
        pageSize: 200,
        clientTypeOnly: true
      };
      if (this.status) {
        return;
      }
      flow.getTodoList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item) {
          this.status = "todo";
          this.btntext = "待办";
          this.task = item;
        }
      });
      flow.getDoneList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item) {
          this.status = "done";
          this.btntext = "已办";
          this.task = item;
        }
      });
      flow.getReadysendList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item) {
          this.status = "wait";
          this.btntext = "待发";
          this.task = item;
        }
      });
      flow.getOversendList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item) {
          this.status = "sent";
          this.btntext = "已发";
          this.task = item;
        }
      });
      flow.getFinishedList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item) {
          this.status = "fine";
          this.btntext = "办结";
          this.task = item;
        }
      });

      // console.log("flow.getTodoList", flow.getTodoList(this.businessName));
      // todo(data).then((res) => {
      //   if (res.success) {
      //     this.todolist = res.data.records;
      //     let item = res.data.records.find((x) => x.businessId === row.id);
      //     if (item) {
      //       this.status = "todo";
      //       this.btntext = "待办";
      //       this.task = item;
      //     }
      //   }
      // });

      // if (this.status) {
      //   return;
      // }
      // done(data).then((res) => {
      //   if (res.success) {
      //     this.donelist = res.data.records;
      //     let item = res.data.records.find((x) => x.businessId === row.id);
      //     if (item) {
      //       this.status = "done";
      //       this.btntext = "已办";
      //       this.task = item;
      //     }
      //   }
      // });

      // if (this.status) {
      //   return;
      // }
      // readysend(data).then((res) => {
      //   if (res.success) {
      //     this.readysendlist = res.data.records;
      //     let item = res.data.records.find((x) => x.businessId === row.id);
      //     if (item) {
      //       this.status = "wait";
      //       this.btntext = "待发";
      //       this.task = item;
      //     }
      //   }
      // });

      // if (this.status) {
      //   return;
      // }
      // oversend(data).then((res) => {
      //   if (res.success) {
      //     this.oversendlist = res.data.records;
      //     let item = res.data.records.find((x) => x.businessId === row.id);
      //     if (item) {
      //       this.status = "sent";
      //       this.btntext = "已发";
      //       this.task = item;
      //     }
      //   }
      // });

      // if (this.status) {
      //   return;
      // }
      // finished(data).then((res) => {
      //   if (res.success) {
      //     this.finishedlist = res.data.records;
      //     let item = res.data.records.find((x) => x.businessId === row.id);
      //     if (item) {
      //       this.status = "fine";
      //       this.btntext = "办结";
      //       this.task = item;
      //     }
      //   }
      // });
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
</style>

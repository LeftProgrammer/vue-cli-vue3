<template>
  <div>
    <!--流程的按钮权限-->
    <el-button
      type="text"
      @click="clickHandle(row, status, task)"
      v-show="status"
      :title="btntext"
    >
      {{ realtext }}
    </el-button>
    <!--- 已发起，其他人的流程数据 -->
    <!-- <el-button
      type="text"
      @click="clickHandle(row, status)"
      v-show="!status && row.flowStatus === 1"
    >
      {{ "查看" }}
    </el-button> -->
    <!--- 未发起数据 -->
    <el-button
      type="text"
      @click="clickHandle(row, 'mine')"
      v-show="!status && row.flowStatus === 0"
    >
      {{ "发起" }}
    </el-button>
  </div>
</template>
<script>
import { todo, done, readysend, oversend, finished } from "@/api/flow";
import flow from "@/utils/flow";
export default {
  name: "FlowHandle",
  props: {
    /**流程业务信息 */
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /**流程业务信息 */
    flowName: {
      type: String,
      default: "",
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.getFlowData();
    });
  },
  components: {},
  computed: {},
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
    };
  },
  watch: {},
  methods: {
    clickHandle(row, status, task) {
      this.$emit("click", row, status, task);
    },
    getFlowData() {
      return;
      let row = this.row;
      console.log("getFlowData", row);
      if (!row || !row.id) {
        return;
      }
      let data = {
        clientType: "web",
        businessName: this.flowName,
        current: 1,
        pageSize: 200,
        clientTypeOnly: true,
      };
      if (this.status) {
        return;
      }
      flow.getTodoList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item) {
          this.status = "todo";
          this.btntext = "办理";
          this.realtext = "待办";
          this.task = item;
        }
      });
      flow.getDoneList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = "done";
          this.btntext = "已办";
          this.realtext = "查看";
          this.task = item;
          console.log("getDoneList", this.status, this.btntext, this.task);
        }
      });
      flow.getReadysendList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = "wait";
          this.btntext = "待发";
          this.realtext = "办理";
          this.task = item;
        }
      });
      flow.getOversendList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = "sent";
          this.btntext = "已发";
          this.realtext = "查看";
          this.task = item;
          console.log("getOversendList", this.status, this.btntext, this.task);
        }
      });
      flow.getFinishedList(this.flowName, (records) => {
        let item = records.find((x) => x.businessId === row.id);
        if (item && !this.status) {
          this.status = "fine";
          this.btntext = "办结";
          this.realtext = "查看";
          this.task = item;
          console.log("getFinishedList", this.status, this.btntext, this.task);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .wbench-el-dialog.is-fullscreen {
  .el-dialog__body {
    height: calc(100% - 45px);
  }
}
</style>

<template>
  <!--流程的流程状态-->
  <el-tag v-show="statusName" effect="plain" :type="tagType" @click="clickHandle">{{ statusName }}</el-tag>
</template>

<script>
export default {
  name: "FlowHandleStatus",
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    flowName: {
      type: String,
      default: "",
    },
  },
  emits: ["click"],
  data() {
    return {
      status: null,
      task: null,
    };
  },
  computed: {
    statusName() {
      const row = this.row || {};
      const flowStatus = row.flowStatus;
      if (flowStatus == 1) return "流转中";
      if (flowStatus == 2) return "已完成";
      if (flowStatus == 3) return "流转中";
      return "未提交";
    },
    tagType() {
      const row = this.row || {};
      const flowStatus = row.flowStatus;
      if (flowStatus == 2) return "success";
      return "primary";
    },
  },
  watch: {
    row: {
      handler(newVal) {
        if (newVal && newVal.matterTaskTodo) {
          this.task = newVal.matterTaskTodo;
          this.status = "todo";
        } else if (newVal && newVal.procMatterTaskDone) {
          this.task = newVal.procMatterTaskDone;
          this.status = "done";
        } else {
          this.task = null;
          this.status = null;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    clickHandle() {
      this.$emit("click", this.row, this.status, this.task);
    },
  },
};
</script>

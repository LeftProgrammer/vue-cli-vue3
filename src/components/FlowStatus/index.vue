<template>
  <el-tag v-show="statusName" effect="plain" :type="tagType" @click="clickHandle">{{ statusName }}</el-tag>
</template>

<script>
export default {
  name: "FlowStatus",
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
    statusMeta() {
      const row = this.row;
      if (!row) {
        return { name: "未提交", type: "primary" };
      }
      if (row.flowStatus == 1) {
        return { name: "流转中", type: "primary" };
      }
      if (row.flowStatus == 2) {
        return { name: "已完成", type: "success" };
      }
      if (row.flowStatus == 3) {
        return { name: "流转中", type: "primary" };
      }
      return { name: "未提交", type: "primary" };
    },
    statusName() {
      return (this.statusMeta && this.statusMeta.name) || "";
    },
    tagType() {
      return (this.statusMeta && this.statusMeta.type) || "primary";
    },
  },
  methods: {
    clickHandle() {
      this.$emit("click", this.row, this.status, this.task);
    },
  },
};
</script>

<template>
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
  },
  emits: ["click"],
  computed: {
    statusName() {
      const row = this.row || {};
      const flowStatus = row.flowStatus;
      if (flowStatus === 1 || flowStatus === 3) return "流转中";
      if (flowStatus === 2) return "已完成";
      return "未提交";
    },
    tagType() {
      const row = this.row || {};
      const flowStatus = row.flowStatus;
      if (flowStatus === 2) return "success";
      return "primary";
    },
  },
  methods: {
    clickHandle() {
      this.$emit("click", this.row);
    },
  },
};
</script>

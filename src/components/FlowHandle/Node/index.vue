<template>
  <span v-show="nodeName" @click="clickHandle">{{ nodeName }}</span>
</template>

<script>
export default {
  name: "FlowHandleNode",
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["click"],
  computed: {
    nodeName() {
      const row = this.row || {};
      const task = row.matterTaskTodo || row.task || null;
      return (task && task.procTaskName) || row.nodeName || "";
    },
  },
  methods: {
    clickHandle() {
      this.$emit("click", this.row);
    },
  },
};
</script>

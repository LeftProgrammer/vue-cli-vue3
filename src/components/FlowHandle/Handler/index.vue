<template>
  <span v-show="handlerName" @click="clickHandle">{{ handlerName }}</span>
</template>

<script>
export default {
  name: "FlowHandleHandler",
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["click"],
  computed: {
    handlerName() {
      const row = this.row || {};
      const task = row.matterTaskTodo || row.task || null;
      return (task && task.currentHandlerNames) || "";
    },
  },
  methods: {
    clickHandle() {
      this.$emit("click", this.row);
    },
  },
};
</script>

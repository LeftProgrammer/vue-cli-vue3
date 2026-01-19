<template>
  <!--流程的当前节点-->
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
    nodeName() {
      const task = this.task;
      if (task && task.procTaskName) {
        return task.procTaskName;
      }
      const row = this.row || {};
      return row.nodeName || "";
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

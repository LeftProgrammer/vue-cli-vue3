<template>
  <!--流程的当前处理人-->
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
    handlerName() {
      const task = this.task;
      if (task && task.currentHandlerNames) {
        return task.currentHandlerNames;
      }
      if (task && task.matter && task.matter.currentHandlerNames) {
        return task.matter.currentHandlerNames;
      }
      return "";
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

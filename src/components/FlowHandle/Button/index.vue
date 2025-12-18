<template>
  <div class="flow-handle-button">
    <el-link
      v-for="(item, index) in btns"
      :key="index"
      :type="item && item.type ? item.type : 'primary'"
      :underline="false"
      @click="handleClick(item)"
    >
      {{ item && item.title ? item.title : '' }}
    </el-link>
  </div>
</template>

<script>
export default {
  name: "FlowHandleButton",
  props: {
    row: {
      type: Object,
      default: () => ({}),
    },
    flowName: {
      type: String,
      default: "",
    },
    btns: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["click"],
  methods: {
    handleClick(item) {
      this.$emit("click", item, this.row, this.flowName);
    },
  },
};
</script>

<style scoped lang="scss">
.flow-handle-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>

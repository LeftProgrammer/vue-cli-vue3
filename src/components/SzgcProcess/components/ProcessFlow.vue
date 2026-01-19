<template>
  <div class="process-flow">
    <div class="flow-filter">
      <el-checkbox v-model="showRunning">进行中</el-checkbox>
      <el-checkbox v-model="showPassed">已通过</el-checkbox>
      <el-checkbox v-model="showPending">未完成</el-checkbox>
    </div>
    <div class="flow-chart-container">
      <slot name="chart">
        <el-empty description="流程图展示区域" />
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProcessFlow",
  props: {
    businessId: {
      type: String,
      default: "",
    },
    flowConfigId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showRunning: true,
      showPassed: true,
      showPending: true,
    };
  },
};
</script>

<style scoped lang="scss">
.process-flow {
  height: 100%;
  display: flex;
  flex-direction: column;

  .flow-filter {
    padding: 12px;
    display: flex;
    justify-content: center;
    gap: 16px;
    border-bottom: 1px solid #e4e7ed;
  }

  .flow-chart-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    min-height: 300px;
  }
}
</style>

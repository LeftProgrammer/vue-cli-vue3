<template>
  <div class="monitor-management">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="监控设备管理" name="equipment">
        <equipment-management :disable-permission-check="true" />
      </el-tab-pane>
      <el-tab-pane label="人员通行设备管理" name="entranceGuard">
        <entrance-guard v-if="activeTab === 'entranceGuard'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EquipmentManagement from "@/views/safetyManagement/fireproofManagement/equipmentManagement/index.vue";
import EntranceGuard from "@/views/safetyManagement/entranceGuard/index.vue";

export default {
  name: "MonitorManagement",
  components: {
    EquipmentManagement,
    EntranceGuard,
  },
  data() {
    return {
      activeTab: "equipment",
    };
  },
};
</script>

<style scoped lang="scss">
.monitor-management {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    ::v-deep .el-tabs__content {
      flex: 1;
      overflow: hidden;

      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>

<template>
  <equipment-management :disable-permission-check="true" />
</template>
<script>
import EquipmentManagement from "@/views/safetyManagement/fireproofManagement/equipmentManagement/index.vue";
export default {
  name: "MonitorManagement",
  components: {
    EquipmentManagement,
  },
};
</script>

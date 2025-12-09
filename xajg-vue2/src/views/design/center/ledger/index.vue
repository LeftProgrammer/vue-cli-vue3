<template>
  <!--设计供应台账-->
  <div class="design-center-ledger">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="设计图纸" name="1">
        <design-list v-if="activeName === '1'" :type="activeName"></design-list>
      </el-tab-pane>
      <el-tab-pane label="设计报告" name="2">
        <design-list v-if="activeName === '2'" :type="activeName"></design-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DesignList from "./components/list.vue";
// import DesignReport from "./components/designReport.vue";
export default {
  name: "design-center-ledger",
  components: {
    DesignList,
    // DesignReport,
  },
  data() {
    return {
      activeName: "1",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="scss" scoped>
.design-center-ledger {
  height: 100%;
  padding: 15px;

  ::v-deep {
    .el-tabs {
      height: 100%;

      .el-tabs__content {
        height: calc(100% - 40px - 15px);

        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
}
</style>

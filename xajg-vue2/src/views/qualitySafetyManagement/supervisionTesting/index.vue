<template>
  <!--监理单位抽检-->
  <div class="design-center-ledger">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="试验检测台账" name="1">
        <Qualified v-if="activeName === '1'"></Qualified>
      </el-tab-pane>
      <el-tab-pane label="不合格检测台账" name="2">
        <Unqualified v-if="activeName === '2'"></Unqualified>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Unqualified from "./unqualified/index.vue";
import Qualified from "./qualified/index.vue";
export default {
  name: "design-center-ledger",
  components: {
    Unqualified,
    Qualified,
  },
  props: ["activeNameProps"],
  data() {
    return {
      activeName: this.activeNameProps || "1",
    };
  },
  mounted() {
    console.log(this.activeNameProps);
  },
  activeName: {
    handler(value) {
      console.log("watch");
      // this.isComponent = value;
      // let a = this.components.find((item) => item.code == value);
      // this.tableType=a.type
      // this.dialogTitle = a.name;
      this.reset();
      this.getPointList();
      this.getDeviceList();
    },
    immediate: true,
    deep: true,
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name;
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

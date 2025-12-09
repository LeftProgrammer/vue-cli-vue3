<template>
  <div class="page-measure-system-tab">
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="item.dictName"
        :name="item.dictId"
        v-for="item in dictList"
        :key="item.dictId"
        lazy
      >
        <QualitySystem :typeName="item.dictName" :type="item.dictCode" />
      </el-tab-pane>
      <!-- <el-tab-pane label="质量管理制度" name="质量管理制度" lazy>
        <QualitySystem type="质量管理制度" />
      </el-tab-pane>
      <el-tab-pane label="质量管理体系" name="质量管理体系" lazy>
        <QualitySystem type="质量管理体系" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import QualitySystem from "./components/QualitySystem";
import { getDictItemList } from "@/api/dict";
export default {
  name: "QualitySystemTab",
  components: {
    QualitySystem,
  },
  data() {
    return {
      activeName: "质委会议纪要",
      dictList: [],
    };
  },

  async mounted() {
    await this.getDictItemList("zltxgl");
    this.activeName = this.dictList[0].dictId;
  },
  methods: {
    // 查表格数据
    async getDictItemList(type) {
      try {
        const { data, success, message } = await getDictItemList(type);

        if (!success) {
          this.$message.error("获取字典失败：" + message);
          return false;
        }
        this.dictList = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取字典失败");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-measure-system-tab {
  height: 100%;
  overflow: hidden;
  .el-tabs {
    height: 100%;
    /deep/ .el-tabs__content {
      height: 100%;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>

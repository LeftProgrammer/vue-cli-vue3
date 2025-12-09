<template>
  <div class="CustomTable">
    <szgc-model-view
      v-if="isShow"
      ref="modelView"
      :top-show="false"
      :view-id="viewId"
      :label-width="'160px'"
      :last-width="'120px'"
      size="medium"
    >
      <!-- <template slot="columns">
        <el-table-column label="工程部位" align="center">
          <template slot-scope="{ row }">
            <el-button @click="clickHandle(row)">111</el-button>
          </template>
        </el-table-column>
      </template> -->
      <template slot="btn" slot-scope="{ row, $index }">
        <el-button
          v-if="loginInfo.systemManager || loginInfo.superManager"
          type="text"
          @click="clickHandle(row, $index)"
        ><i class="el-icon-delete" /> 删除</el-button>
        <!-- 待发删除 -->
        <el-button
          v-if="(!loginInfo.systemManager && !loginInfo.superManager) && row.flowStatusCode === 0"
          type="text"
          @click="handelPreSendDelete(row, $index)"
          size="small"
        ><i class="el-icon-delete" /> 删除</el-button>
      </template>
    </szgc-model-view>
  </div>
</template>

<script>
import { SzgcModelView } from '@szgc/wbench';
import { delProcess,resetBoomApplyStatus } from '@/api/blast.js';
import { mapGetters } from 'vuex';
import {deleteWait} from "@/api/flow";
export default {
  name: "CustomTable",
  components: {
    SzgcModelView,
  },
  data() {
    return {
      isShow: true,
    };
  },
  computed: {
    viewId() {
      return this.$route.params.viewid;
    },
    ...mapGetters(['loginInfo'])
  },
  watch: {
    viewId() {
      this.isShow = false;
      this.$nextTick(() => {
        this.isShow = true;
      });
    },
  },
  mounted() {
    console.log(this.viewId);
  },
  methods: {
    clickHandle(row, $index) {
      // console.log(row, $index);
      this.$confirm('确认删除？')
        .then((_) => {
          this.delProcess(row.businessId);
          this.resetBoomApplyStatus(row.businessId);
        })
        .catch((_) => {});
    },
    handelPreSendDelete(row) {
      this.$confirm('确认删除？')
        .then((_) => 
          deleteWait(row.businessId)
        )
        .then((_) => {
          this.$message.success('删除成功');
          this.$refs.modelView.getTableData();
        })
        .catch((_) => {});
    },
    async delProcess(businessId) {
      try {
        const { data, success, message } = await delProcess(businessId);

        if (!success) {
          this.$message.error('删除流程失败：' + message);
          return false;
        }
        this.$message.success('删除成功');
        this.$refs.modelView.getTableData();
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error('删除流程失败');
        return false;
      }
    },
    async resetBoomApplyStatus(businessId) {
      try {
        const { data, success, message } = await resetBoomApplyStatus({
          businessId
        });

        if (!success) {
          this.$message.error('重置爆破申请单汇总状态失败：' + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error('重置爆破申请单汇总状态失败');
        return false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.CustomTable {
  width: 100%;
  height: 100%;
  padding: 20px;
  /deep/ {
    .wbench-button.el-button.el-button--primary {
      background-color: #409eff;
      border-color: #409eff;
    }
    .el-button.el-button--default:has(.el-icon-arrow-up, .el-icon-arrow-down) {
      width: 40px;
      height: 100%;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .model-view-el-table.el-table--border td,
    .model-view-el-table.el-table--border th {
      padding: 10px 0;
    }
    .search-box {
      border-bottom: 1px #bbbbbb dashed;
      margin-bottom: 20px;
    }

    .table-box .el-table.model-view-el-table {
      border-radius: 4px;
      .table-btn {
        color: #409eff;
        i {
          color: #409eff;
        }
      }
      th {
        background-color: #1298fa !important;
      }
      .el-table__header-wrapper .el-table__header {
        th.el-table__cell {
          background-color: #1298fa !important;
        }
      }
    }
  }
  // /deep/ .model-view-el-table th {
  //   background-color: white !important;
  //   color: #333;
  // }
  // /deep/ .el-table th > .cell {
  //   color: #333;
  // }
  /deep/ .el-icon-s-help:before {
    content: "\e723";
    font-size: 18px;
  }
  /deep/ .model-view-el-table.el-table td,
  .model-view-el-table.el-table th.is-leaf {
    border-color: #fff;
  }
  /deep/ .model-view-el-table.el-table--border {
    border-color: #fff;
  }
  /deep/ .el-table--border th {
    border-color: #fff !important;
  }
}
</style>

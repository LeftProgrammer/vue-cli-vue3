<template>
  <div class="page-archival-catalogue">
    <TreeTableLayout
      class="full-height-layout"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      :showPage="false"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="概算名称">
            <el-input v-model="searchData.nodeName" clearable placeholder="请输入" />
          </el-form-item>
          <el-form-item label="概算编码">
            <el-input v-model="searchData.code" clearable placeholder="请输入" />
          </el-form-item>
        </el-form>
      </template>
      <template slot="searchBtnsAppend">
        <el-button size="small" @click="onShowUnitClick">切换单位（元/万元）</el-button>
      </template>
      <template slot="table">
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper" :style="{ width: treeWidth + 'px' }">
              <el-tree
                ref="tree"
                :highlight-current="true"
                class="tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                node-key="id"
                :expand-on-click-node="false"
                :key="treeRefreshKey"
              >
                <span
                  slot-scope="{ data, node }"
                  class="custom-tree-node"
                  :title="data.nodeName"
                >
                  <i style="color: #014acb" :class="getNodeIcon(data)" />
                  <el-tooltip effect="dark" :content="data.nodeName" placement="top">
                    <span>{{ data.nodeName }}</span>
                  </el-tooltip>
                </span>
              </el-tree>
            </div>
            <DragLine @moveEnd="handelMoveEnd" :minMoveX="0"></DragLine>
          </div>

          <div class="table-wrapper">
            <el-table
              :data="tableData"
              stripe
              height="100%"
              border
              :row-class-name="tableRowClassName"
            >
              <el-table-column label="序号" align="center" width="54">
                <template #default="{ $index }">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="概算名称"
                show-overflow-tooltip
                align="left"
                header-align="center"
              />
              <el-table-column prop="code" label="概算编码" align="left" />
              <el-table-column prop="type" label="概算类型" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.type == 0" type="warning">非合同概算</el-tag>
                  <el-tag v-if="row.type == 1" type="success">合同概算</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="数量" align="right" />
              <el-table-column prop="unit" label="单位" align="center" />
              <el-table-column
                prop="estimateUnitPrice"
                label="概算单价(元)"
                align="right"
              />
              <el-table-column
                prop="estimateTotalPrice"
                :label="`概算总价(${priceUnit})`"
                align="right"
              >
                <template #default="{ row }">
                  {{ formatEstimateTotalPrice(row.estimateTotalPrice) }}
                </template>
              </el-table-column>

              <el-table-column
                prop="currentExecutionTotalPrice"
                :label="`当前执行总价(${priceUnit})`"
                align="right"
              >
                <template #default="{ row }">
                  {{ formatCurrentExecutionTotalPrice(row.currentExecutionTotalPrice) }}
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="180" fixed="right">
                <template #default="{ row }">
                  <el-link
                    v-if="row.settlementRecordDetailSubs.length > 0"
                    type="primary"
                    @click="view(row)"
                  >
                    查看执行明细
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>

    <ItemForm
      :visible="showItemDialog"
      :title="'概算执行详情'"
      :tableData="settlementRecordDetailSubs"
      @close="closeItemDialog"
    />
  </div>
</template>

<script>
import { getEstimateCatalogueManagerTree } from "@/api/estimate.js";
import ItemForm from "./itemform.vue";
import { dateFormat } from "@/utils";
import DragLine from "@/views/archives/shared_component/DragLine";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import { manager_flat } from "./api.js";
import Decimal from "decimal.js";

export default {
  name: "investment-estimate",
  components: {
    TreeTableLayout,
    DragLine,
    ItemForm
  },
  data() {
    return {
      priceUnit: "元",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      searchData: {},
      tableData: [],
      selectionNode: {},
      date: [],
      treeWidth: 267,
      showItemDialog: false,
      treeRefreshKey: 0,
      settlementRecordDetailSubs: []
    };
  },
  mounted() {
    this.getTreeData();
    this.getTableData();
  },
  methods: {
    dateFormat,
    // 根据当前显示单位(priceUnit)格式化金额
    // originalUnit: '元' | '万元' 表示该字段原始数据的单位
    formatByUnit(value, originalUnit) {
      const num = Number(value || 0);
      if (this.priceUnit === "万元") {
        const inWanYuan = originalUnit === "元" ? num / 10000 : num;
        return isNaN(inWanYuan) ? "-" : inWanYuan.toFixed(2);
      } else {
        const inYuan = originalUnit === "万元" ? num * 10000 : num;
        return isNaN(inYuan) ? "-" : String(inYuan);
      }
    },
    // 概算总价：原始单位为“万元”，使用 Decimal 计算并保留两位小数
    formatEstimateTotalPrice(value) {
      const num = new Decimal(value || 0);
      if (this.priceUnit === "万元") {
        return num.toFixed(2);
      }
      // 显示为“元”：万元 -> 元（保留两位小数）
      return num.times(10000).toFixed(2);
    },
    // 当前执行总价：原始单位为“元”，使用 Decimal 计算并保留两位小数
    formatCurrentExecutionTotalPrice(value) {
      const num = new Decimal(value || 0);
      if (this.priceUnit === "万元") {
        return num.div(10000).toFixed(2);
      }
      // 显示为“元”：直接两位小数
      return num.toFixed(2);
    },
    closeItemDialog() {
      this.showItemDialog = false;
    },

    handelMoveEnd(moveX) {
      this.treeWidth = this.treeWidth + moveX;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async getTreeData() {
      const res = await this.getEstimateCatalogueManagerTree();
      if (res?.length > 0) {
        this.treeData = res;
        this.treeRefreshKey++; // 增加key值，强制树组件重新渲染
      } else {
        this.treeData = [];
        this.treeRefreshKey++;
      }
    },
    getTableData() {
      manager_flat({ ...this.searchData }).then((res) => {
        this.tableData = res.data;
      });
    },
    async getEstimateCatalogueManagerTree() {
      try {
        const { data, success, message } = await getEstimateCatalogueManagerTree();

        if (!success) {
          this.$message.error("获取文件目录树失败：" + message);
          return false;
        }

        // 递归处理树数据，为item类型节点添加nodeName属性
        const processTreeData = (nodes) => {
          if (!nodes || !nodes.length) return;
          nodes.forEach((node) => {
            if (node.nodeType === "item") {
              node.nodeName = node.name;
              node.children = [];
            }
            // 递归处理子节点
            if (node.children && node.children.length > 0) {
              processTreeData(node.children);
            }
          });
        };

        processTreeData(data);
        this.treeData = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件目录树失败");
        return false;
      }
    },
    // 点击搜索按按钮
    handelSearchButtonClick() {
      this.getTableData();
    },

    handelResetButtonClick() {
      this.searchData = {};
      this.getTableData();
    },
    // 点击“显示单位”按钮
    onShowUnitClick() {
      this.priceUnit = this.priceUnit === "元" ? "万元" : "元";
    },
    /**
     * @description 树节点点击事件
     * @param data
     */
    handleNodeClick(data) {
      this.selectionNode = data;
      console.log("🚀 ~ handleNodeClick ~ data:", data);
      this.scrollToTop(data.code);
    },
    /**
     * @description 使数据滚动到顶部
     */
    scrollToTop(code) {
      console.log("🚀 ~ scrollToTop ~ id:", code);
      const index = this.tableData.findIndex((item) => item.code === code);
      console.log("🚀 ~ scrollToTop ~ index:", index);
      if (index == -1) return;
      const tableBody = document.getElementsByClassName("el-table__body-wrapper")[0];
      tableBody.scrollTop = index * 48;
    },

    // 点击查看节点
    view(row) {
      console.log("🚀 ~ view ~ row:", row.settlementRecordDetailSubs);
      this.settlementRecordDetailSubs = row.settlementRecordDetailSubs || [];
      this.showItemDialog = true;
    },

    tableRowClassName({ row }) {
      if (row.estimateTotalPrice === null || row.currentExecutionTotalPrice === null) {
        return "";
      }
      const estimateInYuan = new Decimal(row.estimateTotalPrice || 0).times(10000);
      const currentExecution = new Decimal(row.currentExecutionTotalPrice || 0);
      if (currentExecution.gte(estimateInYuan)) {
        return "warning-row";
      }
      return "";
    },
    getNodeIcon(data) {
      if (data.nodeType === "item") {
        // 为项目类型节点显示文档图标
        return "el-icon-document";
      } else if (data.children && data.children.length > 0) {
        // 有子节点的树显示打开的文件夹
        return "el-icon-folder-opened";
      } else {
        // 无子节点的树显示关闭的文件夹
        return "el-icon-folder";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page-archival-catalogue {
  /deep/ .warning-row {
    color: red;
  }

  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .full-height-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  // 确保内容区域占满所有可用空间
  /deep/ .tree-table-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  // 确保表单区域不会超出显示范围
  /deep/ .search-area {
    flex-shrink: 0; // 不缩小
  }

  // 让内容区域自动填充剩余空间
  /deep/ .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0; // 解决flex布局中的滚动问题
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    gap: 16px;

    .left-content {
      height: 100%;
      position: relative;
      flex-shrink: 0; // 不压缩左侧宽度
      /deep/ .el-tree-node__content {
        .custom-tree-node {
          flex: 1;
          overflow: hidden;
          display: flex;
          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &:hover {
        .drag-line {
          width: 5px;
          background-color: #e4e1e1;
        }
      }
    }

    .tree-wrapper {
      width: 100%;
      height: 100%;
      padding-right: 10px;
      overflow-y: auto;
      border: #e5e5e5 1px solid;
    }

    .table-wrapper {
      flex: 1;
      min-width: 0; // 让flex子项能够正确处理overflow
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      // 使表格填充容器并显示滚动条
      /deep/ .el-table {
        height: 100% !important;

        .el-table__body-wrapper {
          height: calc(100% - 48px) !important; // 减去表头高度
          overflow-y: auto !important; // 强制显示滚动条
        }
      }
    }
  }

  // 其他样式保持不变
  .command-content {
    position: absolute;
    right: 0px;
    z-index: 1;
  }

  .tree-wrapper {
    width: 267px;
    float: left;
    height: 100%;
    border: #e5e5e5 1px solid;
    overflow: auto;

    .tree-inner-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      height: 100%;
      overflow-y: hidden;

      .tree {
        overflow: auto;
        height: calc(100% - 80px);
        background-color: unset;
        color: #515b81;
        margin-top: 10px;

        .tree-icon {
          margin-right: 5px;

          &.el-icon-folder {
            color: #35a5ff;
          }

          &.el-icon-tickets {
            color: #ff6601;
          }
        }
      }
    }
  }

  .table-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
}
</style>

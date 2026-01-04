<template>
  <div class="treetable-content" :class="{ 'no-header': !$slots.headerrow }">
    <div v-if="$slots.headerrow" class="header-row">
      <slot name="headerrow"></slot>
    </div>
    <el-row
      class="content-row position-relative"
      :class="{ noSplitpane: !useSplitpane }"
    >
      <TableLayout
        ref="tableLayoutRef"
        :title="title"
        :page="page"
        :showForm="showForm"
        :showPage="showPage"
        :showSearchBtns="showSearchBtns"
        :showExportBtn="false"
        @pageSizeChange="onPageSizeChange"
        @pageCurrentChange="onPageCurrentChange"
        @reset="onReset"
        @query="onQuery"
        @initExportParams="onInitExportParams"
      >
        <template #form>
          <slot name="form" />
        </template>

        <template v-if="$slots.tree" #tree>
          <slot name="tree" />
        </template>

        <template #searchBtnsAppend>
          <slot name="searchBtnsAppend" />
        </template>

        <template #table="{ getIndex }">
          <slot name="table" :getIndex="getIndex" />
        </template>

        <template #opratebtns>
          <slot name="opratebtns" />
          <el-button v-if="showExportBtn" size="small" @click="handleExport">
            <svg-icon icon-class="export" class="icon" />
            导出列表
          </el-button>
        </template>
      </TableLayout>
    </el-row>
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table/index.vue";

export default {
  name: "TreeTableLayout",
  components: {
    TableLayout,
  },
  props: {
    // 是否展示分页器
    showPage: {
      type: Boolean,
      default: true,
    },
    // 是否展示 form 内容区
    showForm: {
      type: Boolean,
      default: true,
    },
    // 是否展示搜索区按钮
    showSearchBtns: {
      type: Boolean,
      default: true,
    },
    // 是否展示导出按钮
    showExportBtn: {
      type: Boolean,
      default: false,
    },
    // 分页参数
    page: {
      type: Object,
      default: () => ({
        size: 20,
        current: 1,
        total: 0,
      }),
    },
    // 标题
    title: {
      type: String,
      default: "树标题",
    },
    // 是否使用 splitpane（目前仅保留样式开关）
    useSplitpane: {
      type: Boolean,
      default: true,
    },
    // 树节点默认宽度（预留）
    defaultPercent: {
      type: Number,
      default: 16,
    },
    minPercent: {
      type: Number,
      default: 5,
    },
  },
  emits: [
    "pageSizeChange",
    "page-size-change",
    "pageCurrentChange",
    "page-current-change",
    "reset",
    "query",
    "initExportParams",
    "init-export-params",
  ],
  methods: {
    onPageSizeChange(val) {
      this.$emit("pageSizeChange", val);
      this.$emit("page-size-change", val);
    },
    onPageCurrentChange(val) {
      this.$emit("pageCurrentChange", val);
      this.$emit("page-current-change", val);
    },
    onReset(q) {
      this.$emit("reset", q);
    },
    onQuery(q) {
      this.$emit("query", q);
    },
    onInitExportParams(params) {
      this.$emit("initExportParams", params);
      this.$emit("init-export-params", params);
    },
    // 导出列表：直接调用内部 TableLayout 的导出逻辑
    handleExport() {
      const table = this.$refs.tableLayoutRef;
      if (table && typeof table.handleExport === "function") {
        table.handleExport();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.treetable-content {
  height: 100%;
  background: #fff;

  // el-tree 选中项背景颜色（保持旧项目风格）
  :deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    background-color: rgba(var(--el-color-primary-rgb), 0.12);
    font-weight: bold;

    .el-tree-node__label {
      color: var(--el-color-primary);
    }
  }

  // el-tree 聚焦样式
  :deep(.el-tree-node:focus > .el-tree-node__content) {
    background-color: #ffffff;
  }

  :deep {
    .el-tree-node__content {
      height: 32px;

      .el-tree-node__label {
        color: var(--el-text-color-regular);
        font-size: 14px;
        width: 100%;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .el-tree-node__expand-icon {
        padding: 4px;
        color: var(--el-text-color-secondary);
        font-size: 18px;
      }

      .is-leaf {
        color: transparent;
        cursor: default;
      }
    }

    .el-tree-node__content:hover {
      .el-tree-node__label {
        color: var(--el-color-primary);
      }

      background-color: rgba(var(--el-color-primary-rgb), 0.08);
    }
  }

  .header-row {
    height: 40px;
  }

  .content-row {
    height: calc(100% - 40px);

    :deep(.el-tree) {
      & > .el-tree-node > .el-tree-node__content > .el-tree-node__label,
      & > .el-tree-node > .el-tree-node__content > div > .el-tree-node__label {
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        line-height: 19px;
      }

      & > .el-tree-node.is-current > .el-tree-node__content .el-tree-node__label {
        color: var(--el-color-primary);
      }
    }

    .table {
      height: 100%;
    }

    &.noSplitpane {
      :deep(.splitter-pane-resizer) {
        pointer-events: none;
      }
    }
  }

  &.no-header {
    .content-row {
      height: calc(100% - 0px);
    }
  }
}
</style>

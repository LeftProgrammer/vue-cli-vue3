<template>
  <div class="treetable-content" :class="{ 'no-header': !$slots.headerrow }">
    <div class="header-row" v-if="$slots.headerrow">
      <slot name="headerrow"></slot>
    </div>
    <el-row class="content-row position-relative" :class="{ noSplitpane: !useSplitpane }">
      <!-- slot="paneR" -->
      <template>
        <table-layout
          :title="title"
          :page="$props.page"
          :showForm="$props.showForm"
          :showPage="$props.showPage"
          :showSearchBtns="$props.showSearchBtns"
          @pageSizeChange="(val) => $emit('pageSizeChange', val)"
          @pageCurrentChange="(val) => $emit('pageCurrentChange', val)"
          @reset="(q) => $emit('reset', q)"
          @query="(q) => $emit('query', q)"
        >
          <template v-slot:form>
            <template v-if="$slots.form">
              <slot name="form"></slot>
            </template>
          </template>
          <template v-slot:tree>
            <template v-if="$slots.tree">
              <slot name="tree"></slot>
            </template>
          </template>

          <template slot="searchBtnsAppend">
            <template v-if="$slots.searchBtnsAppend">
              <slot name="searchBtnsAppend"></slot>
            </template>
          </template>

          <template v-slot:table="{ getIndex }">
            <template v-if="$slots.table">
              <slot name="table" :getIndex="getIndex"></slot>
            </template>
          </template>
          <template v-slot:opratebtns>
            <template v-if="$slots.opratebtns">
              <slot name="opratebtns"></slot>
              <el-button
                v-if="showExportBtn"
                size="mini"
                @click="handleExport"
              >
                <svg-icon icon-class="export" class="icon" />
                导出列表
              </el-button>
            </template>
          </template>
        </table-layout>
      </template>
    </el-row>
  </div>
</template>

<script>
import VueSplitpane from "vue-splitpane";
import TableLayout from "@/components/ContentLayout/Table";
export default {
  name: "ContentLayout-TreeTable",
  components: {
    TableLayout,
    VueSplitpane
  },
  data() {
    return {
      drawer: false
    };
  },
  methods: {
    /**
     * 导出列表
     * */
    handleExport() {
      let columns = [];
      console.log(this.$slots.table);
      if (Array.isArray(this.$slots.table) && this.$slots.table.length > 0) {
        columns = this.$slots.table[0].componentOptions.children
          .filter((x) => x.componentOptions && x.componentOptions.propsData.prop)
          .map((x) => {
            return { ...x.componentOptions.propsData, ...x.data.attrs };
          });
      }
      console.log(columns);
      //数据过滤
      let excelColumns = [];
      let propsSet = new Set(); // 用于存储已经出现过的prop字段
      let flag = false;
      if (columns) {
        columns.forEach((col) => {
          if (propsSet.has(col.prop)) {
            console.log(`重复的prop字段: ${col.prop}`);
            // 在这里可以处理重复字段的逻辑，例如抛出异常或者给出提示信息
            this.$message.warning(`重复的字段: ${col.prop}`);
            flag = true;
          } else {
            propsSet.add(col.prop);
            let tempObj = {
              label: col.label,
              prop: col.prop
            };
            // 继续处理tempObj对象
            // 将以 excel. 开头的属性转换为普通属性
            Object.keys(col).forEach((key) => {
              if (key.startsWith("excel.")) {
                const newKey = key.substring(6);
                tempObj[newKey] = col[key];
              }
            });
            excelColumns.push(tempObj);
          }
        });
        if (flag) {
          // 异常情况中断请求
          return;
        }
      }
      let exportParams = {
        url: "",
        params: {},
        filename: "列表",
        columns: excelColumns
      };
      this.$emit("initExportParams", exportParams);
      console.log("handleExport", exportParams);

      this.$handleExport(exportParams.url, exportParams.params, exportParams.filename);
    },
    //表格序号
    indexMethod(index) {
      console.log("indexMethod", index);
      return 1000;
    }
  },
  props: {
    /**是否展示分页器 */
    showPage: {
      type: Boolean,
      default: true
    },
    /**是否展示form内容区 */
    showForm: {
      type: Boolean,
      default: true
    },
    /**
     * 是否展示搜索区按钮
     */
    showSearchBtns: {
      type: Boolean,
      default: true
    },
    /**
     * 是否展示导出按钮
     */
    showExportBtn: {
      type: Boolean,
      default: false
    },
    /**
     * 分页器参数
     */
    page: {
      type: Object,
      default: () => {
        return {
          size: 20,
          current: 1,
          total: 0
        };
      }
    },
    /**标题 */
    title: {
      type: String,
      default: "树标题"
    },
    /** 是否使用split，分割拖拽*/
    useSplitpane: {
      type: Boolean,
      default: true
    },
    /** 树节点默认宽度*/
    defaultPercent: {
      type: Number,
      default: 16
    },
    minPercent: {
      type: Number,
      default: 5
    }
  },
  watch: {
    "$slots.tree": {
      handler(val) {
        console.log("$slots.tree", val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.treetable-content {
  height: 100%;
  background: #fff;

  // el-tree 选中项背景颜色
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    // 设置颜色
    background-color: #e6f9ff; // 背景色
    font-weight: bold; // 字体加粗
    .el-tree-node__label {
      color: #1298fa; // 节点的字体颜色
    }
  }

  // el-tree 鼠标聚焦样式
  ::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: #ffffff;
  }

  ::v-deep {
    .el-tree-node__content {
      height: 32px;

      .el-tree-node__label {
        color: #86909c;
        font-size: 14px;
        width: 100%;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .is-current {
        background-color: #e8f9ff;
      }
      .el-tree-node__expand-icon {
        padding: 4px;
        color: #545d6d;
        font-size: 18px;
      }

      .is-leaf {
        color: transparent;
        cursor: default;
      }
    }
    .el-tree-node__content:hover {
      .el-tree-node__label {
        color: #5bacf8;
      }

      background-color: #e8f9ff;
    }
  }

  .header-row {
    height: 40px;
  }

  .content-row {
    height: calc(100% - 40px);
    // min-height: 480px;

    ::v-deep {
      .el-tree {
        & > .el-tree-node {
          & > .el-tree-node__content {
            & > .el-tree-node__label {
              font-size: 16px;
              font-weight: 500;
              color: #4e5969;
              line-height: 19px;
            }
            & > div > .el-tree-node__label {
              font-size: 16px;
              font-weight: 500;
              color: #4e5969;
              line-height: 19px;
            }
          }

          &.is-current {
            & > .el-tree-node__content {
              .el-tree-node__label {
                color: #1298fa;
              }
            }
          }
        }
      }

      .splitter-paneL {
        overflow-y: auto;
      }

      &.noSplitpane {
        .splitter-pane-resizer {
          pointer-events: none;
        }
      }
    }

    .table {
      height: 100%;
    }
  }

  &.no-header {
    .content-row {
      height: calc(100% - 0px);
    }
  }
}
</style>

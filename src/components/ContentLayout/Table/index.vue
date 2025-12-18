<template>
  <div
    :id="eleid"
    class="table-content"
    :class="{
      'no-form': !$slots.form,
      'no-header': !$slots.opratebtns,
      'no-page': !showPage,
      'search-open': !searchOpen,
      'design-app': pageType === 'DesignApplication',
    }"
  >
    <el-row class="w-100pre h-100pre">
      <div
        v-if="$slots.form"
        ref="searchFormRef"
        class="search-form"
        :class="{ 'design-app-form': pageType === 'DesignApplication' }"
      >
        <div class="search-inputform">
          <slot name="form"></slot>
        </div>
        <div
          v-if="showSearchBtns"
          class="search-btns"
          :class="{ 'search-open-btn': showSearchOpenBtn }"
        >
          <el-button
            v-if="showSearchBtn"
            type="primary"
            @click="query"
          >
            查询
          </el-button>
          <div v-if="!showSearchBtn" style="width: 90px"></div>
          <el-button :icon="RefreshLeft" @click="reset">
            重置
          </el-button>
          <slot name="searchBtnsAppend"></slot>
          <template v-if="showSearchOpenBtn">
            <el-button
              v-if="searchOpen"
              :icon="ArrowDown"
              class="search-btn"
              @click="searchOpenHandle()"
            />
            <el-button
              v-else
              :icon="ArrowUp"
              class="search-btn"
              @click="searchOpenHandle()"
            />
          </template>
        </div>
      </div>

      <div
        v-if="$slots.form && pageType !== 'DesignApplication'"
        class="divider"
      ></div>

      <div ref="tableRef" class="table position-relative">
        <!-- 左侧树抽屉按钮 -->
        <div
          v-if="$slots.tree"
          class="position-absolute top-0 left-0 index-10 pointer"
          style="top: 50%"
          @click.stop="openDrawer"
        >
          <img
            v-show="!drawer"
            src="@/assets/img/system/slider_open.png"
            alt=""
          />
        </div>
        <span v-if="$slots.tree">
          <div
            v-if="drawer"
            class="w-100pre position-absolute h-100pre top-0 left-0 index-99"
            style="background: rgba(0, 0, 0, 0.5)"
            @click.stop="closeAnimation"
          ></div>

          <div
            id="animated-element"
            class="h-100pre position-absolute animated-element bg-fff index-500"
          >
            <div class="position-absolute top-0 index-600" style="right: -34px">
              <img
                v-show="drawer"
                class="w-34 h-38"
                src="@/assets/img/system/slider_close.png"
                alt=""
                @click.stop="closeAnimation"
              />
            </div>
            <slot name="tree"></slot>
          </div>
        </span>

        <div v-if="$slots.opratebtns" class="table-header">
          <div class="add-btns">
            <slot v-if="!isMdgAdmin" name="opratebtns"></slot>

            <el-button v-if="showExportBtn" @click="handleExport">
              <svg-icon icon-class="export" class="icon" />
              导出列表
            </el-button>
          </div>
        </div>

        <div class="table-cnotent">
          <slot name="table" :getIndex="indexMethod"></slot>
          <slot name="card"></slot>
        </div>

        <div v-if="showPage" class="pagination-container">
          <el-pagination
            :current-page="pageParams.current"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { ArrowDown, ArrowUp, RefreshLeft } from "@element-plus/icons-vue";

export default {
  name: "ContentLayoutTable",
  props: {
    userSlot: {
      type: Boolean,
      default: false,
    },
    minPercent: {
      type: Number,
      default: 5,
    },
    // 页面类型（例如 DesignApplication）
    pageType: {
      type: String,
      default: "",
    },
    // 是否展示 form 区
    showForm: {
      type: Boolean,
      default: true,
    },
    // 是否展示搜索区按钮
    showSearchBtns: {
      type: Boolean,
      default: true,
    },
    // 是否展示查询按钮
    showSearchBtn: {
      type: Boolean,
      default: true,
    },
    // 是否展示导出按钮
    showExportBtn: {
      type: Boolean,
      default: false,
    },
    // 搜索区是否默认展开
    defaultOpenSearch: {
      type: Boolean,
      default: true,
    },
    // 是否展示分页
    showPage: {
      type: Boolean,
      default: true,
    },
    // 分页参数
    page: {
      type: Object,
      default: () => ({
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
      }),
    },
    // 列表名称
    title: {
      type: String,
      default: "列表",
    },
    tableContentClassName: {
      type: String,
      default: "table-content",
    },
  },
  data() {
    return {
      ArrowDown,
      ArrowUp,
      RefreshLeft,
      pageParams: {
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
      },
      drawer: false,
      // 搜索栏展开按钮是否展示
      showSearchOpenBtn: false,
      // 搜索栏是否展开
      searchOpen: false,
      tableContentDom: null,
      tableDom: null,
      searchFormDom: null,
      eleid: "table_" + new Date().getTime(),
      componentContainer: null,
    };
  },
  computed: {
    userInfo() {
      return this.$getStorage && this.$getStorage("userInfo");
    },
    // 超级管理账号，只有查看权限；无其他权限
    isMdgAdmin() {
      return this.userInfo && this.userInfo.username === "mdgglj";
    },
  },
  watch: {
    page: {
      handler(val, oldValue) {
        if (!val) return;
        if (val.size || val.pageSize) {
          const size = val.size ? val.size : val.pageSize;
          this.pageParams.size = size;
          this.pageParams.pageSize = size;
          this.pageParams.current = val.current;
        }
        if (val.total !== undefined) {
          this.pageParams.total = val.total;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    const tableContentDom = document.querySelector(
      `.${this.tableContentClassName}`
    );
    if (tableContentDom) {
      this.tableContentDom = tableContentDom;
      const tableDom = this.$refs.tableRef;
      const searchFormDom = this.$refs.searchFormRef;
      if (tableDom && searchFormDom) {
        this.tableDom = tableDom;
        this.searchFormDom = searchFormDom;

        const searchInputFormDom = searchFormDom.querySelector(
          ".search-inputform"
        );
        if (searchInputFormDom) {
          const height = window
            .getComputedStyle(searchInputFormDom)
            .getPropertyValue("height");
          if (height && parseFloat(height) > 60) {
            this.showSearchOpenBtn = true;
          }
        }
      }
      this.initTableStyle();
    }
    window.onresize = this.initTableStyle;
    this.$nextTick(() => {
      this.searchOpenHandle(this.defaultOpenSearch);
    });

    this.componentContainer = document.querySelector(`#${this.eleid}`);
  },
  methods: {
    openDrawer() {
      if (!this.componentContainer) {
        console.error("this.componentContainer is null");
        return;
      }
      this.drawer = true;
      const element = this.componentContainer.querySelector("#animated-element");
      if (!element) return;
      element.style.visibility = "visible";
      element.style.width = "300px";
    },
    closeAnimation() {
      if (!this.componentContainer) {
        console.error("this.componentContainer is null");
        return;
      }
      const element = this.componentContainer.querySelector("#animated-element");
      if (!element) return;
      element.style.width = "0";
      setTimeout(() => {
        this.drawer = false;
        element.style.visibility = "hidden";
      }, 300);
    },
    // 导出列表
    handleExport() {
      let columns = [];
      const tableSlot = this.$slots && this.$slots.table;
      const slotVNodes = typeof tableSlot === "function" ? tableSlot({ getIndex: this.indexMethod }) : [];
      if (Array.isArray(slotVNodes) && slotVNodes.length > 0) {
        const firstVNode = slotVNodes[0];
        const defaultSlot = firstVNode && firstVNode.children && firstVNode.children.default;
        const children = typeof defaultSlot === "function" ? defaultSlot() : [];
        columns = children
          .filter((x) => x && x.props && x.props.prop)
          .map((x) => ({
            ...(x.props || {}),
          }));
      }

      const excelColumns = [];
      const propsSet = new Set();
      let hasDuplicate = false;
      if (columns && columns.length) {
        columns.forEach((col) => {
          if (propsSet.has(col.prop)) {
            console.log(`重复的prop字段: ${col.prop}`);
            this.$message && this.$message.warning(`重复的字段: ${col.prop}`);
            hasDuplicate = true;
          } else {
            propsSet.add(col.prop);
            const tempObj = {
              label: col.label,
              prop: col.prop,
            };
            Object.keys(col).forEach((key) => {
              if (key.startsWith("excel.")) {
                const newKey = key.substring(6);
                tempObj[newKey] = col[key];
              }
            });
            excelColumns.push(tempObj);
          }
        });
        if (hasDuplicate) {
          return;
        }
      }

      const exportParams = {
        url: "",
        params: {},
        filename: "列表",
        columns: excelColumns,
      };
      this.$emit("initExportParams", exportParams);
      this.$handleExport &&
        this.$handleExport(
          exportParams.url,
          exportParams.params,
          exportParams.filename
        );
    },
    // 表格序号
    indexMethod(index) {
      const curpage = this.pageParams.current; // 当前页码
      const limitpage = this.pageParams.pageSize; // 每页条数
      return index + 1 + (curpage - 1) * limitpage;
    },
    // 搜索条件收起/展开
    searchOpenHandle(defaultOpenSearch) {
      this.searchOpen = !this.searchOpen;
      if (typeof defaultOpenSearch === "boolean") {
        this.searchOpen = !defaultOpenSearch;
      }
      this.$nextTick(() => {
        this.initTableStyle();
      });
    },
    // 查询
    query() {
      this.pageParams.current = 1;
      this.$emit("query", this.pageParams);
    },
    // 重置
    reset() {
      this.$emit("reset", this.pageParams);
    },
    // 分页：每页大小切换
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.pageParams.size = val;
      this.$emit("pageSizeChange", this.pageParams);
    },
    // 分页：当前页切换
    handleCurrentChange(val) {
      this.pageParams.current = val;
      this.$emit("pageCurrentChange", this.pageParams);
    },
    // 根据搜索区高度重算 table 高度
    initTableStyle() {
      const tableContentDom = document.querySelector(
        `.${this.tableContentClassName}`
      );
      if (tableContentDom) {
        this.tableContentDom = tableContentDom;
        const tableDom = this.$refs.tableRef;
        const searchFormDom = this.$refs.searchFormRef;
        if (tableDom && searchFormDom) {
          this.tableDom = tableDom;
          this.searchFormDom = searchFormDom;
        }
      }
      if (this.searchOpen) {
        if (this.tableDom) {
          this.tableDom.style.height = "";
        }
      } else if (this.searchFormDom && this.tableDom) {
        const height = window
          .getComputedStyle(this.searchFormDom)
          .getPropertyValue("height");
        this.tableDom.style.height = `calc(100% - ${height} - 17px)`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$width: 80px;
$height: 32px;

.table-content {
  height: 100%;
  width: 100%;
  background: #fff;

  > .el-row {
    width: 100%;
    height: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;

    .search-form {
      height: auto;
      display: flex;

      .search-inputform {
        height: $height + 16;
        overflow: hidden;

        ::v-deep .el-form-item {
          height: $height;
          margin-bottom: 20px;
          min-width: 20%;
          white-space: nowrap;

          .el-form-item__label {
            height: 100%;
            width: 80px;
            line-height: $height;
            white-space: nowrap;
          }

          .el-form-item__content {
            height: 100%;
            min-width: 200px;
            width: calc(100% - 80px);
            line-height: $height;

            .el-select {
              height: 100%;
              width: 240px;
            }

            .el-input {
              height: 100%;
              width: 240px;

              .el-input__inner {
                height: 100%;
              }
            }

            .el-cascader {
              height: 100%;
              line-height: $height;
            }

            .el-date-editor {
              height: 100%;
              width: 240px !important;

              .el-range-separator {
                line-height: 24px;
              }
            }
          }
        }
      }

      .search-btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 16px;
        width: $width * 2 + 20;
        height: $height;

        &.search-open-btn {
          width: $width * 2 + 40 + 20;
        }

        button {
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 14px;

          i {
            font-size: 14px;
          }

          &.search-btn {
            width: 40px;
          }
        }

        .reset-btn {
          border: 1px solid var(--el-color-primary);
          background: #fff;
          color: var(--el-color-primary);
        }
      }
    }

    .divider {
      border-top: 1px #bbbbbb dashed;
      border-left: none;
      border-bottom: none;
      border-right: none;
      margin: 0 auto 16px;
    }
  }

  .table {
    flex: 1;
    min-height: 0;
    height: calc(100% - 40px - #{$height});

    .table-header {
      height: $height;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .add-btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: $height;

        ::v-deep button {
          padding: 8px 14px;

          svg {
            width: 14px;
            height: 14px;
          }
        }
      }

      .table-title {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .title {
        margin-left: 10px;
        font-size: 18px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #333333;
        line-height: 21px;
      }

      .table-btns {
        ::v-deep button {
          height: $height;
          font-size: 14px;

          i {
            font-size: 14px;
          }

          svg {
            width: 14px;
            height: 14px;
          }
        }
      }
    }

    .table-cnotent {
      height: calc(100% - #{$height} - #{$height} - 30px);

      ::v-deep.el-table::before {
        height: 0;
      }

      ::v-deep .el-tag {
        border-radius: 14px;
        padding: 0 15px;
        height: 24px;
        line-height: 24px;
        font-size: 14px;

        &.el-tag--primary {
          background: #fff;
          color: var(--el-color-primary);
          border-color: var(--el-color-primary);
        }

        &.el-tag--warning {
          background: #fff;
          color: #ff7d00;
          border-color: #ff7d00;
        }

        &.el-tag--success {
          background: #ffffff;
          color: #00b42a;
          border-color: #00b42a;
        }

        &.el-tag--info {
          background: #f2f3f5;
          color: #86909c;
          border-color: #c9cdd4;
        }

        &.el-tag--danger {
          background: #ffe3e3;
          color: #f53f3f;
          border-color: #f53f3f;
        }
      }

      ::v-deep .el-link:hover {
        &::after {
          border: none;
        }
      }

      ::v-deep .el-table--border::after,
      ::v-deep .el-table--group::after,
      ::v-deep .el-table::before {
        background: #ebeef5 !important;
        z-index: 1;
      }

      ::v-deep .el-table {
        height: 100%;

        .el-table__header {
          background-color: #ebeff5;
          overflow: hidden;

          .el-table__cell {
            background-color: #ebeff5;
            border-color: #e7e7e7;
            text-align: center;
            height: 48px;

            .cell {
              color: #1d2129;
            }
          }
        }

        .el-table__body-wrapper {
          height: calc(100% - 56px) !important;
          overflow: hidden;
          box-sizing: border-box;

          .el-scrollbar__wrap {
            overflow-x: hidden;
            box-sizing: border-box;
          }

          .el-scrollbar__view {
            overflow-x: hidden;
          }

          .el-table__body {
            .el-table__row {
              .el-table__cell {
                height: 48px;
              }
            }

            tr.hover-row td {
              background: transparent;
            }

            tr:hover td {
              background: #edf3fe;
            }
          }
        }

        .el-table__fixed-body-wrapper {
          overflow-x: hidden;
          box-sizing: border-box;

          .el-table__row {
            .el-table__cell {
              height: 48px;
            }
          }
        }
      }

      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .pagination-container {
    height: $height;
    display: flex;
    justify-content: flex-end;

    ::v-deep .el-pagination {
      padding-top: 1px;
      padding-bottom: 1px;
      text-align: right;

      .el-pager li.active {
        background-color: var(--el-color-primary);
      }
    }
  }

  &.no-header {
    .table {
      height: calc(100% - 61px);

      .table-cnotent {
        height: calc(100% - #{$height});
      }
    }
  }

  &.no-form {
    .table {
      height: 100%;

      .table-cnotent {
        height: calc(100% - #{$height} - #{$height} - 20px);
      }
    }
  }

  &.no-page {
    .table {
      height: 100%;

      .table-cnotent {
        height: calc(100% - #{$height} - #{$height});
      }
    }
  }

  &.no-form.no-header {
    height: 100%;

    .table {
      height: 100%;

      .table-cnotent {
        height: calc(100% - #{$height});
      }
    }
  }

  &.no-page.no-header {
    .table {
      height: calc(100% - #{$height} - 40px);

      .table-cnotent {
        height: 100%;
      }
    }
  }

  &.no-form.no-header.no-page {
    height: 100%;

    .table {
      height: 100%;

      .table-cnotent {
        height: 100%;
      }
    }
  }

  // 设计应用页面样式
  &.design-app {
    height: calc(100% - 52px);
  }

  &.search-open {
    > .el-row .search-form .search-inputform {
      height: auto;
      overflow: visible;
    }
  }
}

.design-app-form {
  margin-bottom: -8px;
}

.table {
  ::v-deep .el-drawer__wrapper {
    position: absolute;
  }

  ::v-deep .v-modal {
    position: absolute;
  }
}

::v-deep .el-tree {
  height: 100% !important;
  overflow: auto;
}

#animated-element {
  width: 0;
  transition: width 0.5s ease;
  visibility: hidden;
}
</style>

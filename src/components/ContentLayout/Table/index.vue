<template>
  <div class="table-content">
    <el-row class="table-row">
      <div v-if="$slots.form" class="search-form">
        <div class="search-inputform">
          <slot name="form"></slot>
        </div>
        <div class="search-btns" v-if="showSearchBtns">
          <el-button
            v-if="showSearchBtn"
            type="primary"
            size="small"
            @click="onQuery"
          >
            查询
          </el-button>
          <el-button size="small" @click="onReset">重置</el-button>
          <slot name="searchBtnsAppend"></slot>
        </div>
      </div>

      <div v-if="$slots.form" class="divider"></div>

      <div class="table" ref="tableRef">
        <div v-if="$slots.opratebtns" class="table-header">
          <div class="add-btns">
            <slot name="opratebtns"></slot>
          </div>
        </div>
        <div class="table-content-inner">
          <slot name="table" :getIndex="indexMethod"></slot>
        </div>
        <div v-if="showPage" class="pagination-container">
          <el-pagination
            :current-page="pageState.current"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageState.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageState.total"
            background
            @size-change="onSizeChange"
            @current-change="onCurrentChange"
          />
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "ContentLayoutTable",
  props: {
    page: {
      type: Object,
      default: () => ({
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
      }),
    },
    title: {
      type: String,
      default: "",
    },
    showPage: {
      type: Boolean,
      default: true,
    },
    showSearchBtns: {
      type: Boolean,
      default: true,
    },
    showSearchBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      pageState: {
        pageSize: this.page.pageSize || this.page.size || 20,
        size: this.page.size || this.page.pageSize || 20,
        current: this.page.current || 1,
        total: this.page.total || 0,
      },
    };
  },
  watch: {
    page: {
      deep: true,
      handler(val) {
        if (!val) return;
        this.pageState.pageSize = val.pageSize || val.size || this.pageState.pageSize;
        this.pageState.size = val.size || val.pageSize || this.pageState.size;
        this.pageState.current = val.current || this.pageState.current;
        if (typeof val.total === "number") {
          this.pageState.total = val.total;
        }
      },
    },
  },
  methods: {
    indexMethod(index) {
      const cur = this.pageState.current || 1;
      const size = this.pageState.pageSize || 20;
      return index + 1 + (cur - 1) * size;
    },
    onQuery() {
      this.$emit("query", { ...this.pageState });
    },
    onReset() {
      this.$emit("reset", { ...this.pageState });
    },
    onSizeChange(val) {
      this.pageState.pageSize = val;
      this.pageState.size = val;
      this.$emit("pageSizeChange", { ...this.pageState });
    },
    onCurrentChange(val) {
      this.pageState.current = val;
      this.$emit("pageCurrentChange", { ...this.pageState });
    },
  },
};
</script>

<style scoped lang="scss">
.table-content {
  height: 100%;
  background: #fff;
}

.table-row {
  height: 100%;
}

.search-form {
  display: flex;
  align-items: flex-start;
  padding: 16px 16px 0;
}

.search-inputform {
  flex: 1;
}

.search-btns {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.divider {
  border-top: 1px #bbbbbb dashed;
  margin: 0 16px 16px;
}

.table {
  height: calc(100% - 40px);
  padding: 0 16px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.table-header {
  height: 32px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.add-btns {
  display: flex;
  align-items: center;
}

.table-content-inner {
  flex: 1;
  overflow: hidden;
}

.pagination-container {
  margin-top: 12px;
  text-align: right;
}
</style>

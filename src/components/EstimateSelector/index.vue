<template>
  <el-dialog
    v-model="dialogShow"
    v-draggable
    :title="title"
    custom-class="wbench-el-dialog"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
    @closed="closedHandle"
  >
    <el-form label-width="auto">
      <el-row>
        <el-col :span="12">
          <el-form-item label="概算名称/编码">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入关键字搜索"
              prefix-icon="el-icon-search"
              clearable
              @input="handleSearch"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="filteredTableData"
      tooltip-effect="dark"
      style="width: 100%; overflow: auto"
      height="40vh"
      :fit="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="code" label="概算编码" width="120" />
      <el-table-column prop="name" label="概算名称" show-overflow-tooltip min-width="180" />
      <el-table-column prop="unit" label="单位" width="80" align="center" />
      <el-table-column prop="quantity" label="工程量" width="100" align="center" />
      <el-table-column prop="estimateUnitPrice" label="单价" width="120" align="right">
        <template #default="scope">
          {{ formatAmount(scope.row.estimateUnitPrice) }}
        </template>
      </el-table-column>
      <el-table-column prop="estimateTotalPrice" label="合价" width="120" align="right">
        <template #default="scope">
          {{ formatAmount(scope.row.estimateTotalPrice) }}
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "EstimateSelector",
  props: {
    estimateList: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: undefined,
    },
  },
  emits: ["update:visible", "update:modelValue", "confirm", "close"],
  data() {
    return {
      title: "概算项选择",
      dialogShow: false,
      loading: false,
      tableData: [],
      filteredTableData: [],
      selectedData: [],
      searchKeyword: "",
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
    };
  },
  watch: {
    estimateList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.initializeData();
        }
      },
      immediate: true,
    },
    visible: {
      handler(newVal) {
        if (this.modelValue !== undefined) {
          return;
        }
        this.dialogShow = newVal;
      },
      immediate: true,
    },
    modelValue: {
      handler(newVal) {
        if (newVal === undefined) {
          return;
        }
        this.dialogShow = newVal;
      },
      immediate: true,
    },
    dialogShow: {
      handler(newVal) {
        this.$emit("update:visible", newVal);
        if (this.modelValue !== undefined) {
          this.$emit("update:modelValue", newVal);
        }
      },
    },
  },
  created() {
    if (this.estimateList && this.estimateList.length > 0) {
      this.initializeData();
    }
  },
  methods: {
    initializeData() {
      this.tableData = [...this.estimateList];
      this.updateFilteredData();
    },
    updateFilteredData() {
      let data = [...this.tableData];

      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        data = data.filter(
          (item) =>
            item.code?.toLowerCase().includes(keyword) || item.name?.toLowerCase().includes(keyword)
        );
      }

      const comparator = (a, b) => {
        const aCode = a && a.code != null ? String(a.code) : "";
        const bCode = b && b.code != null ? String(b.code) : "";
        const aSeg = aCode.split(".");
        const bSeg = bCode.split(".");
        const len = Math.max(aSeg.length, bSeg.length);
        for (let i = 0; i < len; i++) {
          const ai = aSeg[i];
          const bi = bSeg[i];
          if (ai === undefined) return -1;
          if (bi === undefined) return 1;
          const an = Number(ai);
          const bn = Number(bi);
          const aIsNum = !isNaN(an);
          const bIsNum = !isNaN(bn);
          const av = aIsNum ? an : ai;
          const bv = bIsNum ? bn : bi;
          if (av < bv) return -1;
          if (av > bv) return 1;
        }
        return 0;
      };

      data.sort(comparator);
      this.totalCount = data.length;
      this.filteredTableData = data;
    },
    handleSearch() {
      this.updateFilteredData();
    },
    handleSelectionChange(selection) {
      this.selectedData = selection;
    },
    handleConfirm() {
      this.$emit("confirm", this.selectedData);
      this.dialogShow = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.updateFilteredData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.updateFilteredData();
    },
    formatAmount(amount) {
      return amount
        ? amount.toLocaleString("zh-CN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00";
    },
    handleCancel() {
      this.dialogShow = false;
      this.$emit("close");
    },
    closedHandle() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="scss"></style>

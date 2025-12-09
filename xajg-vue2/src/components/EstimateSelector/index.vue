<template>
  <el-dialog
    v-draggable
    :title="title"
    custom-class="wbench-el-dialog"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
    @close="closedHandle"
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
      <el-table-column
        prop="name"
        label="概算名称"
        show-overflow-tooltip
        min-width="180"
      />
      <el-table-column prop="unit" label="单位" width="80" align="center" />
      <el-table-column
        prop="quantity"
        label="工程量"
        width="100"
        align="center"
      />
      <el-table-column
        prop="estimateUnitPrice"
        label="单价"
        width="120"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatAmount(scope.row.estimateUnitPrice) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="estimateTotalPrice"
        label="合价"
        width="120"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatAmount(scope.row.estimateTotalPrice) }}
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
    </div>
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
  },
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
    // 监听 estimateList 的变化，确保数据加载顺序正确
    estimateList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.initializeData();
        }
      },
      immediate: true, // 确保组件创建时就触发
    },
    visible: {
      handler(newVal) {
        this.dialogShow = newVal;
      },
      immediate: true,
    },
  },

  created() {
    // 初始化时先尝试加载数据
    if (this.estimateList && this.estimateList.length > 0) {
      this.initializeData();
    }
  },
  methods: {
    // 初始化数据
    initializeData() {
      this.tableData = [...this.estimateList];
      this.updateFilteredData();
    },

    // 更新过滤后的数据
    updateFilteredData() {
      let data = [...this.tableData];

      // 根据关键词搜索过滤
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        data = data.filter(
          (item) =>
            item.code?.toLowerCase().includes(keyword) ||
            item.name?.toLowerCase().includes(keyword)
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

    // 处理搜索
    handleSearch() {
      this.updateFilteredData();
    },

    // 处理选择变化
    handleSelectionChange(selection) {
      this.selectedData = selection;
    },

    // 处理确认按钮
    handleConfirm() {
      this.$emit("confirm", this.selectedData);
    },

    // 处理重置按钮

    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.updateFilteredData();
    },

    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.updateFilteredData();
    },

    // 格式化金额
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

<style scoped lang="scss">
</style>

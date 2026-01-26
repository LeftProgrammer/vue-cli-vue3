<template>
  <div class="page-archive-document">
    <TreeTableLayout
      :page="searchData"
      title="文件列表"
      :show-page="showPage"
      :show-search-btns="showSearchBtns"
      @pageSizeChange="handlePageSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleSearch"
      @reset="handleReset"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item v-if="showBackBtn">
            <el-button icon="el-icon-back" @click="goBack">返回</el-button>
          </el-form-item>
          <el-form-item v-if="showSearchBtns" label="文件编号">
            <el-input
              v-model="searchData.documentCode"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item v-if="showSearchBtns" label="文件题名">
            <el-input
              v-model="searchData.documentTitle"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item v-if="showSearchBtns" label="文件日期">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleDateChange"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-if="showOperateBtns" slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-right: 10px"
          @click="handleAdd"
        >新增</el-button>
        <el-button
          icon="el-icon-document"
          style="margin-right: 10px"
          @click="handleDownloadTemplate"
        >模板下载</el-button>
        <el-upload
          ref="importUpload"
          :action="importAction"
          :data="importData"
          :headers="importHeaders"
          :show-file-list="false"
          :before-upload="beforeImport"
          :on-success="handleImportSuccess"
          :on-error="handleImportError"
          :disabled="!volumeInfo.volumeId"
          accept=".xlsx,.xls"
        >
          <el-button
            icon="el-icon-upload2"
            :loading="importLoading"
            :disabled="!volumeInfo.volumeId"
          >导入</el-button>
        </el-upload>
        <el-button
          icon="el-icon-download"
          style="margin-left: 10px"
          :loading="exportLoading"
          :disabled="!volumeInfo.volumeId"
          @click="handleExport"
        >导出</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="selectedRows.length === 0"
          style="margin-left: 10px"
          @click="handleBatchDelete"
        >批量删除</el-button>
      </template>
      <template slot="table">
        <el-table
          ref="tableRef"
          v-loading="loading"
          :data="tableData"
          height="100%"
          stripe
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="showOperateBtns"
            type="selection"
            width="50"
            align="center"
          />
          <el-table-column label="序号" align="center" width="60">
            <template #default="{ $index }">
              {{ $index + 1 + (searchData.current - 1) * searchData.pageSize }}
            </template>
          </el-table-column>
          <el-table-column
            prop="documentTitle"
            label="文件题名"
            min-width="250"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-link
                :underline="false"
                type="primary"
                @click="handleView(row)"
              >
                {{ row.documentTitle }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="documentCode"
            label="文件编号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sortNo"
            label="顺序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="securityLevel"
            label="密级"
            width="80"
            align="center"
          >
            <template #default="{ row }">
              {{ getSecurityLevelName(row.securityLevel) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="responsible"
            label="责任者"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="documentDate"
            label="日期"
            width="110"
            align="center"
          />
          <el-table-column
            prop="pageNo"
            label="页号"
            width="100"
            align="center"
          />
          <el-table-column
            prop="retentionPeriod"
            label="保管期限"
            width="100"
            align="center"
          />
          <el-table-column
            v-if="showActionColumn"
            label="操作"
            width="140"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <list-button
                :data="row"
                :btns="[
                  { title: '编辑', method: 'edit' },
                  { title: '删除', method: 'delete' },
                ]"
                @edit="handleEdit"
                @delete="handleDelete"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TreeTableLayout>

    <!-- 新增/编辑弹窗 -->
    <DocumentForm
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :is-view="isView"
      :document-id="currentDocumentId"
      :volume-id="volumeInfo.volumeId"
      :volume-title="volumeInfo.volumeTitle"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { getDocumentPage, deleteDocument, deleteDocumentBatch } from "@/api/archivesManage";
import { getToken } from "@/utils/auth";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import DocumentForm from "./form.vue";
import enums from "@/config/enums";

export default defineComponent({
  name: "ArchiveDocument",
  components: {
    TreeTableLayout,
    ListButton,
    DocumentForm,
  },
  props: {
    // 案卷ID（作为组件使用时传入）
    volumeId: {
      type: [String, Number],
      default: "",
    },
    // 案卷档号
    volumeCode: {
      type: String,
      default: "",
    },
    // 案卷题名
    volumeTitle: {
      type: String,
      default: "",
    },
    // 是否显示返回按钮
    showBackBtn: {
      type: Boolean,
      default: true,
    },
    // 是否显示分页
    showPage: {
      type: Boolean,
      default: true,
    },
    // 是否显示搜索按钮
    showSearchBtns: {
      type: Boolean,
      default: true,
    },
    // 是否显示操作按钮（新增、导入）
    showOperateBtns: {
      type: Boolean,
      default: true,
    },
    // 是否显示操作列（编辑、删除）
    showActionColumn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      volumeInfo: {
        volumeId: "",
        volumeCode: "",
        volumeTitle: "",
      },
      tableData: [],
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        documentTitle: "",
        documentCode: "",
        startDate: "",
        endDate: "",
      },
      dateRange: [],
      // 密级
      securityLevelList: enums.SECURITY_LEVEL_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      dialogVisible: false,
      dialogTitle: "",
      isView: false,
      currentDocumentId: "",
      // 导入相关
      importLoading: false,
      // 导出相关
      exportLoading: false,
      // 多选相关
      selectedRows: [],
    };
  },
  computed: {
    // 导入接口地址
    importAction() {
      return "/api/archives/document/import";
    },
    // 导入附加参数
    importData() {
      return {
        volumeId: this.volumeInfo.volumeId,
      };
    },
    // 导入请求头
    importHeaders() {
      return {
        "X-Token": getToken(),
      };
    },
  },
  created() {
    // 优先从 props 获取案卷信息，否则从路由参数获取
    const volumeId = this.volumeId || this.$route.query.volumeId;
    const volumeCode = this.volumeCode || this.$route.query.volumeCode;
    const volumeTitle = this.volumeTitle || this.$route.query.volumeTitle;
    if (volumeId) {
      this.volumeInfo = {
        volumeId,
        volumeCode: volumeCode || "",
        volumeTitle: volumeTitle || "",
      };
      this.getList();
    } else {
      this.$message.warning("缺少案卷信息");
      this.goBack();
    }
  },
  methods: {
    // 字典转义 - 密级
    getSecurityLevelName(value) {
      const item = this.securityLevelList.find((i) => i.value === value);
      return item ? item.label : value || "无";
    },
    // 返回上一页
    goBack() {
      // 如果是作为组件使用，触发事件通知父组件
      if (this.volumeId) {
        this.$emit("back");
      } else {
        this.$router.push("/archives/archive-volume");
      }
    },
    // 获取列表数据
    async getList() {
      this.loading = true;
      try {
        const params = {
          current: this.searchData.current,
          pageSize: this.searchData.pageSize,
          entity: {
            volumeId: this.volumeInfo.volumeId,
            documentTitle: this.searchData.documentTitle,
            documentCode: this.searchData.documentCode,
            startDate: this.searchData.startDate,
            endDate: this.searchData.endDate,
          },
        };
        const { success, data, message } = await getDocumentPage(params);
        if (success) {
          this.tableData = data.records || [];
          this.searchData.total = data.total || 0;
        } else {
          this.$message.error(message || "查询失败");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("查询失败");
      } finally {
        this.loading = false;
      }
    },
    // 日期范围变化
    handleDateChange(val) {
      if (val && val.length === 2) {
        this.searchData.startDate = val[0];
        this.searchData.endDate = val[1];
      } else {
        this.searchData.startDate = "";
        this.searchData.endDate = "";
      }
    },
    // 查询
    handleSearch() {
      this.searchData.current = 1;
      this.getList();
    },
    // 重置
    handleReset() {
      this.searchData = {
        total: 0,
        current: 1,
        pageSize: 20,
        documentTitle: "",
        documentCode: "",
        startDate: "",
        endDate: "",
      };
      this.dateRange = [];
      this.$nextTick(() => {
        this.getList();
      });
    },
    // 分页大小变化
    handlePageSizeChange(page) {
      this.searchData.current = 1;
      this.searchData.pageSize = page.pageSize;
      this.getList();
    },
    // 页码变化
    handleCurrentChange(page) {
      this.searchData.current = page.current;
      this.getList();
    },
    // 新增
    handleAdd() {
      this.dialogTitle = "新增";
      this.isView = false;
      this.currentDocumentId = "";
      this.dialogVisible = true;
    },
    // 查看
    handleView(row) {
      this.dialogTitle = "详情";
      this.isView = true;
      this.currentDocumentId = row.id;
      this.dialogVisible = true;
    },
    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑";
      this.isView = false;
      this.currentDocumentId = row.id;
      this.dialogVisible = true;
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除该文件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const { success, message } = await deleteDocument(row.id);
            if (success) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.error(message || "删除失败");
            }
          } catch (error) {
            console.error(error);
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },
    // 表单提交成功回调
    handleFormSuccess() {
      this.getList();
    },
    // 模板下载
    handleDownloadTemplate() {
      const link = document.createElement("a");
      link.href = "/static/template/文件管理导入模板.xls";
      link.download = "文件管理导入模板.xls";
      link.click();
    },
    // 导入前校验
    beforeImport(file) {
      if (!this.volumeInfo.volumeId) {
        this.$message.warning("请先选择案卷");
        return false;
      }
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        this.$message.error("只能上传 Excel 文件（.xlsx 或 .xls）");
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("文件大小不能超过 10MB");
        return false;
      }
      this.importLoading = true;
      return true;
    },
    // 导入成功
    handleImportSuccess(response) {
      this.importLoading = false;
      if (response.success) {
        const { successCount, failCount, failRows } = response.data;
        if (failCount === 0) {
          this.$message.success(`导入成功，共 ${successCount} 条`);
        } else if (successCount === 0) {
          const rows = failRows.map((r) => r.rowIndex).join("、");
          this.$message.error(`导入失败：共 ${failCount} 条（第 ${rows} 行）`);
        } else {
          const rows = failRows.map((r) => r.rowIndex).join("、");
          this.$message.warning(
            `导入完成：成功 ${successCount} 条，失败 ${failCount} 条（第 ${rows} 行）`
          );
        }
        if (successCount > 0) {
          this.getList();
        }
      } else {
        this.$message.error(response.message || "导入失败");
      }
    },
    // 导入失败
    handleImportError(error) {
      this.importLoading = false;
      console.error("导入失败:", error);
      this.$message.error("导入失败，请稍后重试");
    },
    // 导出Excel
    handleExport() {
      if (!this.volumeInfo.volumeId) {
        this.$message.warning("请先选择案卷");
        return;
      }
      this.$confirm("确定导出当前案卷下所有文件数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.exportLoading = true;
          const token = getToken();
          const volumeId = this.volumeInfo.volumeId;
          const url = `/api/archives/document/export?volumeId=${volumeId}&X-Token=${token}`;
          window.open(url, "_blank");
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    // 多选变化
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    // 批量删除
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先选择要删除的文件");
        return;
      }
      this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 个文件吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const ids = this.selectedRows.map((row) => row.id);
            const { success, data, message } = await deleteDocumentBatch(ids);
            if (success) {
              this.$message.success(data || "删除成功");
              this.selectedRows = [];
              this.getList();
            } else {
              this.$message.error(message || "删除失败");
            }
          } catch (error) {
            console.error(error);
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },
  },
});
</script>

<style lang="scss" scoped>
.page-archive-document {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .danger-btn {
    color: #f56c6c;

    &:hover {
      color: #f78989;
    }
  }
}
</style>

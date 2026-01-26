<template>
  <div class="page-archive-volume">
    <!-- 文件管理组件 -->
    <ArchiveDocument
      v-if="showDocument"
      :volume-id="currentVolume.id"
      :volume-code="currentVolume.volumeCode"
      :volume-title="currentVolume.volumeTitle"
      :show-back-btn="true"
      :show-page="true"
      :show-search-btns="false"
      :show-operate-btns="true"
      :show-action-column="true"
      @back="handleDocumentBack"
    />

    <!-- 案卷列表 -->
    <TreeTableLayout
      v-show="!showDocument"
      :page="searchData"
      title="案卷列表"
      @pageSizeChange="handlePageSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleSearch"
      @reset="handleReset"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="案卷档号">
            <el-input
              v-model="searchData.volumeCode"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="案卷题名">
            <el-input
              v-model="searchData.volumeTitle"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <!-- <el-form-item label="案卷类别">
            <el-select v-model="searchData.volumeCategory" clearable placeholder="请选择">
              <el-option
                v-for="item in volumeCategoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchData.status" clearable placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!currentProject.id"
          @click="handleAdd"
        >新增</el-button>
        <el-button
          icon="el-icon-download"
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
          :disabled="!currentProject.id"
          accept=".xlsx,.xls"
          style="display: inline-block; margin-left: 10px;"
        >
          <el-button icon="el-icon-upload2" :loading="importLoading" :disabled="!currentProject.id">导入</el-button>
        </el-upload>
        <el-button
          icon="el-icon-download"
          :loading="exportLoading"
          :disabled="!currentProject.id"
          style="margin-left: 10px;"
          @click="handleExport"
        >导出</el-button>
      </template>
      <template slot="table">
        <div class="content">
          <div class="left-content">
            <div class="tree-wrapper">
              <el-input
                v-model="treeFilterText"
                placeholder="输入关键字过滤"
                clearable
                prefix-icon="el-icon-search"
                class="filter-input"
              />
              <el-tree
                ref="projectTree"
                :data="projectTreeData"
                :props="treeProps"
                :filter-node-method="filterNode"
                node-key="id"
                highlight-current
                default-expand-all
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              >
                <template #default="{ data }">
                  <span class="custom-tree-node" :title="data.projectName">
                    <i
                      class="el-icon-folder"
                      style="color: #409eff; margin-right: 5px"
                    />
                    <span>{{ data.projectName }}</span>
                  </span>
                </template>
              </el-tree>
            </div>
          </div>
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              :data="tableData"
              height="100%"
              stripe
              border
            >
              <el-table-column label="序号" align="center" width="60">
                <template #default="{ $index }">
                  {{
                    $index + 1 + (searchData.current - 1) * searchData.pageSize
                  }}
                </template>
              </el-table-column>
              <el-table-column
                prop="volumeCode"
                label="案卷档号"
                min-width="150"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="handleView(row)"
                  >
                    {{ row.volumeCode }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="sortNo"
                label="顺序号"
                width="80"
                align="center"
              />
              <el-table-column
                prop="volumeTitle"
                label="案卷题名"
                min-width="200"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="handleView(row)"
                  >
                    {{ row.volumeTitle }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="retentionPeriod"
                label="保管期限"
                width="90"
                align="center"
              >
                <template #default="{ row }">
                  {{ getRetentionPeriodName(row.retentionPeriod) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="copies"
                label="套数"
                width="70"
                align="center"
              />
              <el-table-column
                prop="startDate"
                label="起始日期"
                width="110"
                align="center"
              />
              <el-table-column
                prop="endDate"
                label="终止日期"
                width="110"
                align="center"
              />
              <el-table-column
                prop="filingUnitName"
                label="立卷单位"
                min-width="150"
                show-overflow-tooltip
              />
              <el-table-column
                prop="filingPerson"
                label="组卷人"
                width="90"
                align="center"
              />
              <el-table-column
                prop="archiveDate"
                label="归档日期"
                width="110"
                align="center"
              />
              <el-table-column
                prop="status"
                label="状态"
                width="90"
                align="center"
              >
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ getStatusName(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="totalFiles"
                label="总件数"
                width="80"
                align="center"
              />
              <el-table-column
                prop="totalPages"
                label="总页数"
                width="80"
                align="center"
              />
              <el-table-column
                label="操作"
                width="220"
                align="center"
                fixed="right"
              >
                <template #default="{ row }">
                  <list-button
                    :data="row"
                    :btns="[
                      { title: '文件', method: 'files' },
                      { title: '编辑', method: 'edit' },
                      { title: '删除', method: 'delete' },
                    ]"
                    @edit="handleEdit"
                    @files="handleFiles"
                    @delete="handleDelete"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>

    <!-- 新增/编辑弹窗 -->
    <VolumeForm
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :is-view="isView"
      :volume-id="currentVolumeId"
      :project-id="currentProject.id"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { getVolumePage, deleteVolume } from "@/api/archivesManage";
import { getProjectList } from "@/api/archivesManage";
import { getToken } from "@/utils/auth";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import ArchiveDocument from "@/views/archives/archive_document/index.vue";
import VolumeForm from "./form.vue";
import enums from "@/config/enums";

export default defineComponent({
  name: "ArchiveVolume",
  components: {
    TreeTableLayout,
    ListButton,
    ArchiveDocument,
    VolumeForm,
  },
  data() {
    return {
      loading: false,
      // 是否显示文件管理
      showDocument: false,
      // 当前选中的案卷（用于文件管理）
      currentVolume: {},
      treeFilterText: "",
      projectTreeData: [],
      treeProps: {
        children: "children",
        label: "projectName",
      },
      currentProject: {},
      tableData: [],
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        volumeCode: "",
        volumeTitle: "",
        volumeCategory: "",
        status: "",
      },
      // 案卷类别
      volumeCategoryList: enums.VOLUME_CATEGORY_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      // 保管期限
      retentionPeriodList: enums.RETENTION_PERIOD_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      // 密级
      securityLevelList: enums.SECURITY_LEVEL_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      // 状态
      statusList: enums.VOLUME_STATUS_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      dialogVisible: false,
      dialogTitle: "",
      isView: false,
      currentVolumeId: "",
      // 导入相关
      importLoading: false,
      // 导出相关
      exportLoading: false,
    };
  },
  computed: {
    // 导入接口地址
    importAction() {
      return "/api/archives/volume/import";
    },
    // 导入附加参数
    importData() {
      return {
        projectId: this.currentProject.id,
      };
    },
    // 导入请求头
    importHeaders() {
      return {
        "X-Token": getToken(),
      };
    },
  },
  watch: {
    treeFilterText(val) {
      this.$refs.projectTree.filter(val);
    },
  },
  created() {
    this.getProjectTreeData();
  },
  methods: {
    // 字典转义 - 案卷类别
    getVolumeCategoryName(value) {
      const item = this.volumeCategoryList.find((i) => i.value === value);
      return item ? item.label : value || "-";
    },
    // 字典转义 - 保管期限
    getRetentionPeriodName(value) {
      const item = this.retentionPeriodList.find((i) => i.value === value);
      return item ? item.label : value || "-";
    },
    // 字典转义 - 密级
    getSecurityLevelName(value) {
      const item = this.securityLevelList.find((i) => i.value === value);
      return item ? item.label : value || "-";
    },
    // 字典转义 - 状态
    getStatusName(value) {
      const item = this.statusList.find((i) => i.value === value);
      return item ? item.label : value || "-";
    },
    // 获取项目树数据
    async getProjectTreeData() {
      try {
        const { success, data, message } = await getProjectList();
        if (success) {
          this.projectTreeData = data || [];
          // 默认选中第一个项目
          if (this.projectTreeData.length > 0) {
            this.$nextTick(() => {
              const firstNode = this.projectTreeData[0];
              this.$refs.projectTree.setCurrentKey(firstNode.id);
              this.currentProject = firstNode;
              this.getList();
            });
          }
        } else {
          this.$message.error(message || "获取项目列表失败");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("获取项目列表失败");
      }
    },
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true;
      return data.projectName.indexOf(value) !== -1;
    },
    // 点击树节点
    handleNodeClick(data) {
      this.currentProject = data;
      this.searchData.current = 1;
      this.getList();
    },
    // 获取列表数据
    async getList() {
      if (!this.currentProject.id) return;
      this.loading = true;
      try {
        const params = {
          current: this.searchData.current,
          pageSize: this.searchData.pageSize,
          entity: {
            projectId: this.currentProject.id,
            volumeCode: this.searchData.volumeCode,
            volumeTitle: this.searchData.volumeTitle,
            volumeCategory: this.searchData.volumeCategory,
            status: this.searchData.status,
          },
        };
        const { success, data, message } = await getVolumePage(params);
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
    // 获取状态标签类型
    getStatusType(status) {
      const map = {
        0: "info",
        1: "warning",
        2: "success",
      };
      return map[status] || "info";
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
        volumeCode: "",
        volumeTitle: "",
        volumeCategory: "",
        status: "",
      };
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
      if (!this.currentProject.id) {
        this.$message.warning("请先选择档案项目");
        return;
      }
      this.dialogTitle = "新增案卷";
      this.isView = false;
      this.currentVolumeId = "";
      this.dialogVisible = true;
    },
    // 查看
    handleView(row) {
      this.dialogTitle = "详情";
      this.isView = true;
      this.currentVolumeId = row.id;
      this.dialogVisible = true;
    },
    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑";
      this.isView = false;
      this.currentVolumeId = row.id;
      this.dialogVisible = true;
    },
    // 文件管理
    handleFiles(row) {
      this.currentVolume = {
        id: row.id,
        volumeCode: row.volumeCode,
        volumeTitle: row.volumeTitle,
      };
      this.showDocument = true;
    },
    // 从文件管理返回
    handleDocumentBack() {
      this.showDocument = false;
      this.currentVolume = {};
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除该案卷吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const { success, message } = await deleteVolume(row.id);
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
    // 下载导入模板
    handleDownloadTemplate() {
      window.open("/static/template/案卷管理导入模板.xls", "_blank");
    },
    // 导入前校验
    beforeImport(file) {
      if (!this.currentProject.id) {
        this.$message.warning("请先选择档案项目");
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
        const { successCount, failCount, failRows } = response.data || {};
        if (failCount > 0 && failRows && failRows.length > 0) {
          const failRowNums = failRows.map((r) => r.row).join(", ");
          this.$message.warning(
            `导入完成，成功 ${successCount} 条，失败 ${failCount} 条（第 ${failRowNums} 行）`
          );
        } else {
          this.$message.success(`导入成功，共导入 ${successCount} 条数据`);
        }
        this.getList();
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
      if (!this.currentProject.id) {
        this.$message.warning("请先选择档案项目");
        return;
      }
      this.exportLoading = true;
      try {
        const token = getToken();
        const params = new URLSearchParams({
          "X-Token": token,
          projectId: this.currentProject.id,
        });
        // 添加筛选条件
        if (this.searchData.volumeCode) {
          params.append("volumeCode", this.searchData.volumeCode);
        }
        if (this.searchData.volumeTitle) {
          params.append("volumeTitle", this.searchData.volumeTitle);
        }
        window.open(`/api/archives/volume/export?${params.toString()}`, "_blank");
      } catch (error) {
        console.error("导出失败:", error);
        this.$message.error("导出失败");
      } finally {
        this.exportLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page-archive-volume {
  height: 100%;
  overflow: hidden;

  .content {
    width: 100%;
    display: flex;
    height: 100%;
    gap: 16px;

    .left-content {
      height: 100%;
      position: relative;
      /deep/ .el-tree-node__content {
        .custom-tree-node {
          flex: 1;
          overflow: hidden;
          display: flex;
          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .tree-wrapper {
        width:275px;
        height: 100%;
        overflow-y: auto;
        border: #e5e5e5 1px solid;
        .filter-input {
          padding: 5px;
        }
        /deep/ .el-tree {
          height: calc(90% - 46px) !important;
        }
      }
    }

    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }

  .volume-form {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 10px;
  }

  .danger-btn {
    color: #f56c6c;

    &:hover {
      color: #f78989;
    }
  }
  /deep/ .el-dialog__body {
    max-height: 65vh !important;
  }
}
</style>

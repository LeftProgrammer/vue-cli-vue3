<template>
  <div class="page-archive-project">
    <TreeTableLayout
      :page="searchData"
      title="档案项目列表"
      @pageSizeChange="handlePageSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleSearch"
      @reset="handleReset"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="项目编码">
            <el-input
              v-model="searchData.projectCode"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input
              v-model="searchData.projectName"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <!-- <el-form-item label="全宗号">
            <el-input
              v-model="searchData.fondsCode"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="档案门类">
            <el-select
              v-model="searchData.archiveCategory"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in archiveCategoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="状态">
            <el-select
              v-model="searchData.status"
              clearable
              placeholder="请选择"
            >
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
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </template>
      <template slot="table">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="100%"
          stripe
          border
        >
          <el-table-column label="序号" align="center" width="60">
            <template #default="{ $index }">
              {{ $index + 1 + (searchData.current - 1) * searchData.pageSize }}
            </template>
          </el-table-column>
          <el-table-column
            prop="projectCode"
            label="项目编码"
            min-width="150"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-link
                :underline="false"
                type="primary"
                @click="handleView(row)"
              >
                {{ row.projectCode }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="项目名称"
            min-width="200"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-link
                :underline="false"
                type="primary"
                @click="handleView(row)"
              >
                {{ row.projectName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="fondsCode"
            label="全宗号"
            width="120"
            align="center"
          />
          <el-table-column
            prop="archiveCategory"
            label="档案门类"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              {{ getArchiveCategoryName(row.archiveCategory) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="responsibleUnitName"
            label="责任单位"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ getStatusName(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="updaterName"
            label="更新人"
            width="120"
            align="center"
          />
          <el-table-column
            prop="updateDate"
            label="更新时间"
            width="160"
            align="center"
          >
            <template #default="{ row }">
              {{ dateFormat(row.updateDate, "YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
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
    <el-dialog
      v-if="dialogVisible"
      v-draggable
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      width="1000px"
      :close-on-click-modal="false"
      @closed="handleDialogClosed"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        :disabled="isView"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目编码" prop="projectCode">
              <el-input
                v-model="formData.projectCode"
                placeholder="请输入项目编码"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="formData.projectName"
                placeholder="请输入项目名称"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="全宗号" prop="fondsCode">
              <el-input
                v-model="formData.fondsCode"
                placeholder="请输入全宗号"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="档案门类" prop="archiveCategory">
              <el-select
                v-model="formData.archiveCategory"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in archiveCategoryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任单位">
              <el-input
                v-model="formData.responsibleUnitName"
                placeholder="请选择责任单位"
                readonly
                @click.native="handleSelectUnit"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handleSelectUnit"
                />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select
                v-model="formData.status"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注(限200字)"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          isView ? "关闭" : "取消"
        }}</el-button>
        <el-button
          v-if="!isView"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 责任单位选择弹窗 -->
    <el-dialog
      v-draggable
      title="选择责任单位"
      :visible.sync="unitDialogVisible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <CorSelect v-if="unitDialogVisible" single @childEvt="handleUnitSelect" />
    </el-dialog>
  </div>
</template>

<script>
import { dateFormat } from "@/utils";

import { defineComponent } from "vue";
import {
  getProjectPage,
  getProjectDetail,
  saveProject,
  updateProject,
  deleteProject,
} from "@/api/archivesManage";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import CorSelect from "@/components/CorSelect/index";
import enums from "@/config/enums";
import ListButton from "@/components/ListButton";

export default defineComponent({
  name: "ArchiveProject",
  components: {
    TreeTableLayout,
    CorSelect,
    ListButton,
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      tableData: [],
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        projectCode: "",
        projectName: "",
        fondsCode: "",
        archiveCategory: "",
        status: "",
      },
      // 档案门类
      archiveCategoryList: enums.ARCHIVE_CATEGORY_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      // 状态
      statusList: enums.ARCHIVE_PROJECT_STATUS_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
      dialogVisible: false,
      dialogTitle: "",
      isView: false,
      formData: {},
      formRules: {
        projectCode: [
          { required: true, message: "请输入项目编码", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        fondsCode: [
          { required: true, message: "请输入全宗号", trigger: "blur" },
        ],
        archiveCategory: [
          { required: true, message: "请选择档案门类", trigger: "change" },
        ],
      },
      unitDialogVisible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    dateFormat,
    // 字典转义 - 档案门类
    getArchiveCategoryName(value) {
      const item = this.archiveCategoryList.find((i) => i.value === value);
      return item ? item.label : value || "-";
    },
    // 字典转义 - 状态
    getStatusName(value) {
      const item = this.statusList.find((i) => i.value === value);
      return item ? item.label : value || "-";
    },
    // 获取列表数据
    async getList() {
      this.loading = true;
      try {
        const params = {
          current: this.searchData.current,
          pageSize: this.searchData.pageSize,
          entity: {
            projectCode: this.searchData.projectCode,
            projectName: this.searchData.projectName,
            fondsCode: this.searchData.fondsCode,
            archiveCategory: this.searchData.archiveCategory,
            status: this.searchData.status,
          },
        };
        const { success, data, message } = await getProjectPage(params);
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
        projectCode: "",
        projectName: "",
        fondsCode: "",
        archiveCategory: "",
        status: "",
      };
      this.$nextTick(() => {
        this.getList();
      });
    },
    handleView(row) {
      this.dialogTitle = "详情";
      this.isView = true;
      this.formData = { ...row };
      this.dialogVisible = true;
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
    // 初始化表单数据
    initFormData() {
      return {
        projectCode: "",
        projectName: "",
        fondsCode: "",
        archiveCategory: "",
        responsibleUnitId: "",
        responsibleUnitName: "",
        status: 0,
        remark: "",
      };
    },
    // 新增
    handleAdd() {
      this.dialogTitle = "新增";
      this.isView = false;
      this.formData = this.initFormData();
      this.dialogVisible = true;
    },
    // 编辑
    async handleEdit(row) {
      this.dialogTitle = "编辑";
      this.isView = false;
      await this.getDetail(row.id);
      this.dialogVisible = true;
    },
    // 获取详情
    async getDetail(id) {
      try {
        const { success, data, message } = await getProjectDetail(id);
        if (success) {
          this.formData = { ...data };
        } else {
          this.$message.error(message || "获取详情失败");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("获取详情失败");
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除该档案项目吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const { success, message } = await deleteProject(row.id);
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
    // 选择责任单位
    handleSelectUnit() {
      if (this.isView) return;
      this.unitDialogVisible = true;
    },
    // 责任单位选择回调
    handleUnitSelect({ data }) {
      this.unitDialogVisible = false;
      if (data && data.length > 0) {
        this.formData.responsibleUnitId = data[0].corpId;
        this.formData.responsibleUnitName = data[0].corpName;
      }
    },
    // 提交表单
    handleSubmit() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        this.submitLoading = true;
        try {
          const api = this.formData.id ? updateProject : saveProject;
          const { success, message } = await api(this.formData);
          if (success) {
            this.$message.success(this.formData.id ? "修改成功" : "新增成功");
            this.dialogVisible = false;
            this.getList();
          } else {
            this.$message.error(message || "操作失败");
          }
        } catch (error) {
          console.error(error);
          this.$message.error("操作失败");
        } finally {
          this.submitLoading = false;
        }
      });
    },
    // 弹窗关闭
    handleDialogClosed() {
      this.$refs.formRef?.resetFields();
    },
  },
});
</script>

<style lang="scss" scoped>
.page-archive-project {
  height: 100%;
  overflow: hidden;

  .danger-btn {
    color: #f56c6c;

    &:hover {
      color: #f78989;
    }
  }
}
</style>

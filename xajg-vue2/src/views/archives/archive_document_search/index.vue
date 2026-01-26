<template>
  <div class="page-archive-document-search">
    <TreeTableLayout
      :page="searchData"
      title="文件检索"
      @pageSizeChange="handlePageSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleSearch"
      @reset="handleReset"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="文件编号">
            <el-input
              v-model="searchData.documentCode"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="文件题名">
            <el-input
              v-model="searchData.documentTitle"
              clearable
              placeholder="请输入"
            />
          </el-form-item>

          <!-- <el-form-item label="关键词">
            <el-input
              v-model="searchData.keywords"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="责任者">
            <el-input
              v-model="searchData.responsible"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="密级">
            <el-select
              v-model="searchData.securityLevel"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in securityLevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件日期">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
              value-format="yyyy-MM-dd"
              @change="handleDateChange"
            />
          </el-form-item> -->
        </el-form>
      </template>
      <template slot="table">
        <el-table
          v-loading="loading"
          :data="tableData"
          height="100%"
          stripe
          border
        >
          <el-table-column label="序号" align="center" width="60" fixed="left">
            <template #default="{ $index }">
              {{ $index + 1 + (searchData.current - 1) * searchData.pageSize }}
            </template>
          </el-table-column>
          <el-table-column
            prop="fondsCode"
            label="全宗号"
            width="100"
            align="center"
          />
          <el-table-column
            prop="volumeCode"
            label="案卷档号"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="projectCode"
            label="分类号"
            width="100"
            align="center"
          />
          <el-table-column
            prop="projectName"
            label="项目名称"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sortNo"
            label="顺序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="copies"
            label="套数"
            width="60"
            align="center"
          />
          <el-table-column
            prop="documentTitle"
            label="文件题名"
            min-width="150"
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
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="responsible"
            label="责任者"
            width="90"
            align="center"
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
            width="80"
            align="center"
          />
          <el-table-column
            prop="filingUnitId"
            label="立卷单位"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="retentionPeriod"
            label="保管期限"
            width="100"
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
          <!-- <el-table-column
            label="操作"
            width="80"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <list-button
                :data="row"
                :btns="[
                  { title: '查看', method: 'view' },
                ]"
                @view="handleView"
              />
            </template>
          </el-table-column> -->
        </el-table>
      </template>
    </TreeTableLayout>

    <!-- 文件详情弹窗 -->
    <DocumentForm
      :visible.sync="dialogVisible"
      title="详情"
      :is-view="true"
      :document-id="currentDocumentId"
      :volume-id="currentVolumeId"
      :volume-title="currentVolumeTitle"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { searchDocument } from "@/api/archivesManage";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
// import ListButton from "@/components/ListButton";
import DocumentForm from "@/views/archives/archive_document/form.vue";
import enums from "@/config/enums";

export default defineComponent({
  name: "ArchiveDocumentSearch",
  components: {
    TreeTableLayout,
    DocumentForm,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        documentTitle: "",
        documentCode: "",
        keywords: "",
        responsible: "",
        securityLevel: "",
        startDate: "",
        endDate: "",
      },
      dateRange: [],
      dialogVisible: false,
      currentDocumentId: "",
      currentVolumeId: "",
      currentVolumeTitle: "",
      // 密级
      securityLevelList: enums.SECURITY_LEVEL_ENUM.map((item) => ({
        value: item.value,
        label: item.name,
      })),
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 字典转义 - 密级
    getSecurityLevelName(value) {
      const item = this.securityLevelList.find((i) => i.value === value);
      return item ? item.label : value || "无";
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
    // 获取列表数据
    async getList() {
      this.loading = true;
      try {
        const params = {
          current: this.searchData.current,
          pageSize: this.searchData.pageSize,
          entity: {
            documentTitle: this.searchData.documentTitle,
            documentCode: this.searchData.documentCode,
            keywords: this.searchData.keywords,
            responsible: this.searchData.responsible,
            securityLevel: this.searchData.securityLevel,
            startDate: this.searchData.startDate,
            endDate: this.searchData.endDate,
          },
        };
        const { success, data, message } = await searchDocument(params);
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
        documentTitle: "",
        documentCode: "",
        keywords: "",
        responsible: "",
        securityLevel: "",
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
    // 查看详情
    handleView(row) {
      this.currentDocumentId = row.id;
      this.currentVolumeId = row.volumeId;
      this.currentVolumeTitle = row.volumeTitle;
      this.dialogVisible = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.page-archive-document-search {
  height: 100%;
  overflow: hidden;
}
</style>

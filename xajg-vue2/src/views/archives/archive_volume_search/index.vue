<template>
  <div class="page-archive-volume-search">
    <!-- 文件管理组件 -->
    <ArchiveDocument
      v-if="showDocument"
      :volume-id="currentVolume.id"
      :volume-code="currentVolume.volumeCode"
      :volume-title="currentVolume.volumeTitle"
      :show-back-btn="true"
      :show-page="true"
      :show-search-btns="false"
      :show-operate-btns="false"
      :show-action-column="false"
      class="document-component"
      @back="handleDocumentBack"
    />

    <!-- 案卷检索列表 -->
    <TreeTableLayout
      v-show="!showDocument"
      :page="searchData"
      title="案卷检索"
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
          <el-table-column prop="fondsCode" label="全宗号" width="100" align="center" />
          <el-table-column prop="volumeCode" label="案卷档号" min-width="120" show-overflow-tooltip>
            <template #default="{ row }">
              <el-link :underline="false" type="primary" @click="handleVolume(row)">
                {{ row.volumeCode }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="projectCode" label="分类号" width="100" align="center" />
          <el-table-column prop="projectName" label="项目名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="sortNo" label="顺序号" width="80" align="center" />
          <el-table-column prop="copies" label="套数" width="60" align="center" />
          <el-table-column prop="volumeTitle" label="案卷题名" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <el-link :underline="false" type="primary" @click="handleVolume(row)">
                {{ row.volumeTitle }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="totalPages" label="总页数" width="80" align="center" />
          <el-table-column prop="totalFiles" label="总件数" width="80" align="center" />
          <el-table-column prop="retentionPeriod" label="保管期限" width="100" align="center" />
          <el-table-column prop="securityLevel" label="密级" width="80" align="center">
            <template #default="{ row }">
              {{ getSecurityLevelName(row.securityLevel) }}
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="起始日期" width="110" align="center" />
          <el-table-column prop="endDate" label="终止日期" width="110" align="center" />
          <el-table-column prop="filingUnitName" label="立卷单位" min-width="150" show-overflow-tooltip />
          <el-table-column prop="filingPerson" label="组卷人" width="90" align="center" />
          <el-table-column prop="archiveDate" label="归档日期" width="110" align="center" />
          <el-table-column prop="checker" label="检查人" width="90" align="center" />
          <el-table-column prop="checkDate" label="检查日期" width="110" align="center" />
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template #default="{ row }">
              <list-button
                :data="row"
                :btns="[{ title: '文件', method: 'files' }]"
                @files="handleFiles"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TreeTableLayout>

    <!-- 案卷详情弹窗 -->
    <VolumeForm
      :visible.sync="dialogVisible"
      title="详情"
      :is-view="true"
      :volume-id="currentVolumeId"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { searchVolume } from "@/api/archivesManage";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import ArchiveDocument from "@/views/archives/archive_document/index.vue";
import VolumeForm from "@/views/archives/archive_volume/form.vue";
import enums from "@/config/enums";

export default defineComponent({
  name: "ArchiveVolumeSearch",
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
      tableData: [],
      searchData: {
        total: 0,
        current: 1,
        pageSize: 20,
        volumeCode: "",
        volumeTitle: "",
      },
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
      // 案卷详情弹窗
      dialogVisible: false,
      currentVolumeId: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
    // 获取状态标签类型
    getStatusType(status) {
      const map = {
        0: "info",
        1: "warning",
        2: "success",
      };
      return map[status] || "info";
    },
    // 获取列表数据
    async getList() {
      this.loading = true;
      try {
        const params = {
          current: this.searchData.current,
          pageSize: this.searchData.pageSize,
          entity: {
            volumeCode: this.searchData.volumeCode,
            volumeTitle: this.searchData.volumeTitle,
          },
        };
        const { success, data, message } = await searchVolume(params);
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
        volumeCode: "",
        volumeTitle: "",
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
    // 查看案卷详情
    handleVolume(row) {
      this.currentVolumeId = row.id;
      this.dialogVisible = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.page-archive-volume-search {
  height: 100%;
  overflow: hidden;

  .document-component {
    padding-bottom: 10px;
  }
}
</style>

<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      title="门禁设备管理"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <!-- <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="设备编码:">
            <el-input
              v-model="query.deviceSn"
              placeholder="请输入设备编码"
              clearable
            />
          </el-form-item>
          <el-form-item label="设备名称:">
            <el-input
              v-model="query.deviceName"
              placeholder="请输入设备名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="设备状态:">
            <el-select v-model="query.deviceStatus" placeholder="请选择" clearable>
              <el-option label="在线" :value="1" />
              <el-option label="离线" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位:">
            <el-cascader
              v-model="query.belongUnit"
              clearable
              :props="unitTreeProps"
              :show-all-levels="false"
              :options="unitTree"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item label="安装位置:">
            <el-input
              v-model="query.installLocation"
              placeholder="请输入安装位置"
              clearable
            />
          </el-form-item>
        </el-form>
      </template> -->

      <template slot="opratebtns">
        <el-button icon="el-icon-plus" type="primary" @click="addHandle">
          新增
        </el-button>
        <el-button
          icon="el-icon-refresh"
          type="success"
          :loading="syncLoading"
          @click="handleSync"
        >
          同步
        </el-button>
      </template>

      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            align="center"
          />
          <el-table-column
            label="设备编码"
            prop="deviceSn"
            align="center"
            width="180"
          />

          <el-table-column
            label="设备名称"
            prop="deviceName"
            align="left"
            header-align="center"
            min-width="150"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-link type="primary" @click="viewHandle(row)">
                {{ row.deviceName }}
              </el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="设备状态"
            prop="deviceStatus"
            align="center"
            width="100"
          >
            <template #default="{ row }">
              <el-tag
                :type="row.deviceStatus === 1 ? 'success' : 'info'"
                size="small"
              >
                {{ row.deviceStatus === 1 ? "在线" : "离线" }}
              </el-tag>
            </template>
          </el-table-column> -->
          <el-table-column
            label="所属单位"
            prop="belongUnitName"
            align="left"
            header-align="center"
            min-width="160"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{
                row.belongUnitName || getUnitName(row.belongUnit)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="安装位置"
            prop="installLocation"
            align="left"
            header-align="center"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            label="操作"
            width="180"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <el-link type="primary" @click="editHandle(row)">编辑</el-link>
              <el-divider direction="vertical" />
              <el-link type="danger" @click="handleDeleteRow(row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <!-- 编辑/查看弹窗 -->
    <dataform
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :data="currentRow"
      :type="dialogType"
      :unit-tree="unitTree"
      @closed="closedDialog"
      @ok="onFormSuccess"
    />
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import { page, remove, sync, unitAllList } from "./api";
import dataform from "./dataform.vue";

export default {
  name: "EntranceGuardManagement",
  components: {
    TableLayout,
    dataform,
  },
  data() {
    return {
      unitListAll: [],
      unitTreeProps: {
        expandTrigger: "hover",
        children: "children",
        emitPath: false,
        label: "corpName",
        value: "corpId",
      },
      unitTree: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {
        deviceSn: "",
        deviceName: "",
        deviceStatus: null,
        belongUnit: "",
        installLocation: "",
      },
      // 弹窗相关
      dialogVisible: false,
      dialogType: "edit",
      currentRow: {},
      // 同步状态
      syncLoading: false,
    };
  },
  mounted() {
    this.getUnitAll();
    this.getTableData();
  },
  methods: {
    /**
     * 将扁平数组转换成树形结构
     */
    buildUnitTree(data) {
      if (!Array.isArray(data)) {
        return [];
      }
      const map = {};
      data.forEach((item) => {
        map[item.corpId] = { ...item, children: [] };
      });
      const treeData = [];
      data.forEach((item) => {
        const currentNode = map[item.corpId];
        if (item.corpPid && map[item.corpPid]) {
          map[item.corpPid].children.push(currentNode);
        } else {
          treeData.push(currentNode);
        }
      });
      // 删除没有子节点的children字段
      const removeEmptyChildren = (node) => {
        if (node.children && node.children.length === 0) {
          delete node.children;
        }
        node.children?.forEach(removeEmptyChildren);
      };
      treeData.forEach(removeEmptyChildren);
      return treeData;
    },

    async getUnitAll() {
      try {
        const result = await unitAllList();
        const { data, success } = result;
        if (!success) {
          this.unitListAll = [];
          this.$message.error("获取单位列表失败");
          return;
        }
        this.unitListAll = data;
        const unitList = data.sort((a, b) => a.corpSort - b.corpSort);
        this.unitTree = this.buildUnitTree(unitList);
      } catch (err) {
        console.error("获取单位失败:", err);
      }
    },

    getUnitName(unitId) {
      const unit = this.unitListAll.find((item) => item.corpId === unitId);
      return unit ? unit.corpName : "";
    },

    getIndex(index) {
      return (
        (this.pageParams.current - 1) * this.pageParams.pageSize + index + 1
      );
    },

    reset() {
      this.query = {
        deviceSn: "",
        deviceName: "",
        deviceStatus: null,
        belongUnit: "",
        installLocation: "",
      };
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },

    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
    },

    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.getTableData();
    },

    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },

    getTableData() {
      const params = {
        current: this.pageParams.current,
        pageSize: this.pageParams.pageSize,
        entity: { ...this.query },
      };
      // 处理空值
      Object.keys(params.entity).forEach((key) => {
        if (params.entity[key] === "" || params.entity[key] === null) {
          delete params.entity[key];
        }
      });
      page(params)
        .then((res) => {
          if ((res.success || res.code === 200) && res.data) {
            this.tableData = res.data.list || res.data.records || [];
            this.pageParams.total = res.data.total || 0;
          } else {
            this.$message.error(res.message || "获取数据失败");
          }
        })
        .catch((error) => {
          console.error("获取数据失败:", error);
          this.$message.error("获取数据失败");
        });
    },

    // 新增
    addHandle() {
      this.currentRow = {};
      this.dialogType = "edit";
      this.dialogVisible = true;
    },

    // 查看
    viewHandle(row) {
      this.currentRow = { ...row };
      this.dialogType = "view";
      this.dialogVisible = true;
    },

    // 编辑
    editHandle(row) {
      this.currentRow = { ...row };
      this.dialogType = "edit";
      this.dialogVisible = true;
    },

    // 关闭弹窗
    closedDialog() {
      this.dialogVisible = false;
      this.currentRow = {};
    },

    // 表单提交成功
    onFormSuccess() {
      this.dialogVisible = false;
      this.getTableData();
    },

    // 同步设备
    async handleSync() {
      try {
        await this.$confirm("确认从第三方系统同步门禁设备数据吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        });
        this.syncLoading = true;
        const res = await sync();
        if (res.success || res.code === 200) {
          this.$message.success(res.data || "同步成功");
          this.getTableData();
        } else {
          this.$message.error(res.message || "同步失败");
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("同步失败:", error);
          this.$message.error("同步失败");
        }
      } finally {
        this.syncLoading = false;
      }
    },

    // 删除
    async handleDeleteRow(row) {
      try {
        await this.$confirm("确认删除该门禁设备吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        const res = await remove(row.id);
        if (res.success || res.code === 200) {
          this.$message.success("删除成功");
          this.getTableData();
        } else {
          this.$message.error(res.message || "删除失败");
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除失败:", error);
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
}
</style>

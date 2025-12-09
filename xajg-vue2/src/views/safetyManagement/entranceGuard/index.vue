<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="姓名:">
            <el-input
              v-model="query.personName"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="所属单位:">
            <el-cascader
              clearable
              v-model="query.unit"
              :props="unitTreeProps"
              :show-all-levels="false"
              :options="unitTree"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="通行日期:">
            <el-date-picker
              v-model="query.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              placeholder="选择日期"
              clearable
            />
          </el-form-item>
          <el-form-item label="通行类型:">
            <el-select v-model="query.recordType" placeholder="请选择" clearable>
              <el-option label="入场" value="1"></el-option>
              <el-option label="出场" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template slot="opratebtns" />

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
            label="姓名"
            prop="personName"
            align="center"
            width="120"
          />
          <el-table-column
            label="所属单位"
            prop="unit"
            align="left"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{
                unitListAll.find((item) => item.corpId == row.unit)?.corpName
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="入场时间" width="180" align="center">
            <template #default="{ row }">
              <span>{{
                row.recordType === 1
                  ? dateFormat(row.recordTime, "yyyy-MM-DD HH:mm")
                  : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入场道闸" width="180" align="center">
            <template #default="{ row }">
              <span>{{ row.recordType === 1 ? row.deviceCode : "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出场时间" width="180" align="center">
            <template #default="{ row }">
              <span>{{
                row.recordType === 0
                  ? dateFormat(row.recordTime, "yyyy-MM-DD HH:mm")
                  : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出场道闸" width="180" align="center">
            <template #default="{ row }">
              <span>{{ row.recordType === 0 ? row.deviceCode : "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="通行类型" align="center" width="120">
            <template #default="{ row }">
              <span v-if="row.recordType === 1">入场</span>
              <span v-else>出场</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-link type="primary" @click="editHandle(row)"> 编辑</el-link>
              <el-divider direction="vertical" />
              <el-link type="danger" @click="handelDeleteRow(row)"
                >删除
              </el-link>
            </template>
          </el-table-column> -->
        </el-table>
      </template>
    </table-layout>
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import { page, unitAllList } from "./api";
import { dateFormat } from "@/utils";
export default {
  name: "ModelConfig",
  components: {
    TableLayout,
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
      type: "",
      title: "",
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      operateRow: {
        dialogShow: false,
        data: {},
        isView: false,
      },
      tableData: [],
      query: {
        personName: "",
        unit: "",
        date: [],
        recordType: "",
      },
      unitOptions: [],
    };
  },
  mounted() {
    this.getUnitAll();
    this.getTableData();
  },
  methods: {
    // 获取当前人的所属机构，同时构建树形结构
    /**
     * 将扁平数组转换成树形结构
     * @param {Array} data 扁平数组数据
     * @returns {Array} 树形结构数组
     */
    buildUnitTree(data) {
      if (!Array.isArray(data)) {
        return [];
      }

      // 创建一个映射表，用于快速查找节点
      const map = {};
      data.forEach((item) => {
        map[item.corpId] = { ...item, children: [] };
      });

      // 构建树形结构
      const treeData = [];

      data.forEach((item) => {
        const currentNode = map[item.corpId];

        // 如果有父节点且父节点存在于映射表中，则添加到父节点的children中
        if (item.corpPid && map[item.corpPid]) {
          map[item.corpPid].children.push(currentNode);
        } else {
          // 没有父节点或父节点不在数据中，则作为根节点
          treeData.push(currentNode);
        }
      });
      // 遍历树形结构，删除没有子节点的节点的children字段
      treeData.forEach((node) => {
        const removeEmptyChildren = (node) => {
          if (node.children && node.children.length === 0) {
            delete node.children; // 删除没有子节点的children字段
          }
          node.children?.forEach(removeEmptyChildren); // 递归处理子节点
        };
        removeEmptyChildren(node);
      });
      return treeData;
    },
    async getUnitAll() {
      try {
        const result = await unitAllList();
        const { data, success } = result;
        console.log("获取单位", data);
        if (!success) {
          this.unitListAll = [];
          this.$message.error("获取单位列表失败");
          return;
        }
        this.unitListAll = data;
        console.log("unitListAll", this.unitListAll);
        let unitList = data
          // .filter((item) => {
          //   return item.corpLeaf !== 0;
          // })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
        this.belongUnit = unitList;
        // 构建单位树形结构
        this.unitTree = this.buildUnitTree(unitList);
        console.log("unitTree", this.unitTree);
        return unitList;
      } catch (err) {
        console.log("err", err);
      }
    },
    dateFormat(date, format) {
      return dateFormat(date, format);
    },

    onSuccess() {
      this.operateRow.dialogShow = false;
      this.getTableData();
    },
    // 获取序号
    getIndex(index) {
      return (
        (this.pageParams.current - 1) * this.pageParams.pageSize + index + 1
      );
    },

    // 关闭对话框
    closedDialog() {
      console.log("对话框已关闭");
      // 此处不需要做任何操作，因为对话框通过内部的visible属性自行控制
    },

    // 详情查看
    view(row) {
      this.$nextTick(() => {
        if (this.$refs.form && this.$refs.form.loadDialog) {
          this.$refs.form.loadDialog(row, "view");
        }
      });
    },

    // 重置查询条件
    reset() {
      this.query.personName = "";
      this.query.unit = "";
      this.query.date = [];
      this.query.recordType = "";
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },

    // 处理分页大小变化
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
    },

    // 处理当前页变化
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.getTableData();
    },

    // 查询表格数据
    getTableData() {
      this.pageParams.entity = { ...this.query };
      delete this.pageParams.entity.date;
      if (this.query.date && this.query.date.length > 0) {
        this.pageParams.entity.startDate = this.query.date[0];
        this.pageParams.entity.endDate = this.query.date[1];
      }
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params)
        .then((res) => {
          if (res.success && res.data) {
            this.tableData = res.data.records;
            this.pageParams.total = res.data.total;
          } else {
            this.$message.error(res.message || "获取数据失败");
          }
        })
        .catch((error) => {
          console.error("获取数据失败", error);
          this.$message.error("获取数据失败");
        });
    },

    // 处理新增
    addHandle() {
      this.$nextTick(() => {
        if (this.$refs.form && this.$refs.form.loadDialog) {
          this.$refs.form.loadDialog({}, "add");
        }
      });
    },

    // 处理编辑
    editHandle(row) {
      this.$nextTick(() => {
        if (this.$refs.form && this.$refs.form.loadDialog) {
          this.$refs.form.loadDialog(row, "edit");
        }
      });
    },

    // 处理删除
    deleteHandle(row) {
      deleteDustPoint(row).then((res) => {
        if (!res.success) {
          return this.$message.error(
            "删除失败：" + (res.message || "未知错误")
          );
        }
        this.$message.success("删除成功");
        this.getTableData();
      });
    },

    // 确认删除
    async handelDeleteRow(row) {
      try {
        await this.$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        this.deleteHandle(row);
      } catch (e) {
        console.error(e);
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

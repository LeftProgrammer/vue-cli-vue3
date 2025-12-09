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
          <el-form-item label="测点编码:">
            <el-input v-model="query.code" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="测点名称:">
            <el-input v-model="query.name" placeholder="请输入" clearable />
          </el-form-item>
        </el-form>
      </template>

      <template slot="opratebtns">
        <el-button icon="el-icon-plus" type="primary" @click="addHandle()">
          新增
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
            label="测点编码"
            prop="code"
            align="left"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            label="测点名称"
            prop="name"
            align="left"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-link type="primary" @click="view(row)">{{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="PM2.5(μg/m³)" align="center" width="120">
            <template #default="{ row }">
              <el-link type="primary" @click="processLine(row, 'pm25')">{{ row.latestRecord?.pm25 }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="PM10(μg/m³)"
            align="center"
            show-overflow-tooltip
            width="120"
          >
            <template #default="{ row }">
              <el-link type="primary" @click="processLine(row, 'pm10')">{{ row.latestRecord?.pm10 }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
            label="温度(℃)"
            align="center"
            prop="createDate"
            width="120"
          >
            <template #default="{ row }">
              <el-link type="primary" @click="processLine(row, 'temperature')">{{ row.latestRecord?.temperature }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="湿度(%rh)"
            align="center"
            prop="createDate"
            width="120"
          >
            <template #default="{ row }">
              <el-link type="primary" @click="processLine(row, 'humidity')">{{ row.latestRecord?.humidity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="createDate"
            align="center"
            width="180"
          >
            <template #default="{ row }">
              <span>{{ dateFormat(row.createDate, "yyyy-MM-DD HH:mm") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-link type="primary" @click="editHandle(row)"> 编辑</el-link>
              <el-divider direction="vertical" />
              <el-link type="danger" @click="handelDeleteRow(row)">删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <ModelConfigForm ref="form" @success="onSuccess" />
    <ProcessLine ref="processLine" />
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import ModelConfigForm from "./dataform";
import { getDustPointPage, deleteDustPoint } from "./api";
import { dateFormat } from "@/utils";
import ProcessLine from "./processline";

export default {
  name: "ModelConfig",
  components: {
    TableLayout,
    ModelConfigForm,
    ProcessLine,
  },
  data() {
    return {
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
        modelName: "",
        isCombineid: "",
      },
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    processLine(row, dataType) {
      this.$nextTick(() => {
        if (this.$refs.processLine && this.$refs.processLine.loadDialog) {
          this.$refs.processLine.loadDialog(row, dataType);
        }
      });
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
      this.query.name = "";
      this.query.code = "";
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
      const params = JSON.parse(JSON.stringify(this.pageParams));
      console.log("获取表格数据");
      getDustPointPage(params)
        .then((res) => {
          console.log("获取表格结果", res);
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

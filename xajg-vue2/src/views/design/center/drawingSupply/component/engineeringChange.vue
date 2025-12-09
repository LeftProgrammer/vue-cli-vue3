<template>
  <div>
    <!--查询条件 -->
    <el-row :gutter="20">
      <el-form :from="query" label-width="auto" ref="form">
        <el-col :span="6">
          <el-form-item label="变更申请编号:" size="mini" :span="6">
            <el-input
              v-model="query.projectChangeCode"
              placeholder="请输入编号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="图纸编号:" size="mini" :span="6">
            <el-input  v-model="query.code" placeholder="请输入编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="flex flex-row-reverse">
            <el-button @click="serch" type="primary" icon="el-icon-search">
              查询
            </el-button>
            <el-button
              @click="reset"
              icon="el-icon-refresh-left"
              class="reset-btn"
              >重置</el-button
            >
          </div>
        </el-col>
      </el-form>
    </el-row>
    <!-- 列表页 -->
    <div class="my-10">
      <i class="iconfont icon-menu font-14 mr-5"></i>
      <span>工程变更申请列表</span>
    </div>

    <el-table
      ref="multipleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      :border="true"
    >
      <el-table-column
        label="变更申请编号"
        prop="projectChangeCode"
        align="center"
      >
      </el-table-column>
      <el-table-column label="图纸编号" prop="code" align="center">
      </el-table-column>
      <el-table-column label="图纸名称" prop="drawingName" align="center">
      </el-table-column>
      <el-table-column label="版本" prop="version" align="center">
      </el-table-column>
      <el-table-column
        label="计划供应日期"
        sortable
        prop="planDate"
        align="center"
      >
        <template slot-scope="{ row }">
          <span> {{ timeFormat(row.planDate, "yyyy-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属标段" prop="sectionName" align="center">
      </el-table-column>
      <el-table-column label="申请单位" prop="changeUnit" align="center">
      </el-table-column>
      <el-table-column
        label="申请发起日期"
        sortable
        prop="actualDate"
        align="center"
      >
        <template slot-scope="{ row }">
          {{
            row.actualDate ? timeFormat(row.actualDate, "YYYY-MM-DD") : ""
          }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pt-20 flex flex-row-reverse">
      <el-pagination
        :current-page="pageParams.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        @size-change="handleSizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>
<script>
import { engineeringChange } from "../api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
export default {
  props: {
    // 表格标题
    title: {
      type: String,
      default: "标题",
    },
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      pageParams: {
        current: 1,
        total: 0,
        pageSize: 10,
      },
      query: {},
      designClassify: [],
      ditProfession: [],
      tableData: [],
      chooseId: "",
      currentRow: null,
    };
  },
  created() {
    this.getDESIGNCLASSIFY();
    this.getFlowPROFESSION();
  },

  mounted() {},
  //
  methods: {
    serch() {
      this.getEngineeringChange();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getEngineeringChange();
    },
    currentChange(val) {
      this.pageParams.current = val;
      this.getEngineeringChange();
    },

    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.total = 0;
      this.pageParams.pageSize = 10;
      this.getEngineeringChange();
    },

    handleCurrentChange(val) {
      this.currentRow = val;
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM");
    },
    /**获取分类字典 */
    async getDESIGNCLASSIFY() {
      const { data } = await getDictItemList("DESIGN_CLASSIFY");
      this.designClassify = data;
      // console.log("获取分类字典", data);
    },
    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.ditProfession = data;
      // console.log("flowStatusOptions", data);
    },
    // 请求列表数据
    async getEngineeringChange() {
      try {
        const params = {
          ...this.pageParams,
          entity: {
            type: 1,
            flowStatus: 2,
            ...this.query,
          },
        };
        const result = await engineeringChange(params);
        const { success, data } = result;
        if (success && data?.records?.length > 0) {
          this.tableData = data.records;
          this.pageParams.total = data.total;

          data?.records?.forEach(async (element, index) => {
            let name = await this.$getSectionNameById(element.sectionId);
            this.$set(this.tableData[index], "sectionName", name);
          });
        } else {
          this.tableData = [];
          this.pageParams.total = 0;
          console.error("请求计划变更失败:", result.message);
        }
      } catch (error) {
        console.error("请求计划变更失败:", error);
        // 在这里添加错误处理代码，例如显示错误消息给用户
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table__header .el-checkbox {
  display: none;
}

/deep/ .el-radio__label {
  display: none;
}
.reset-btn {
  margin-right: 10px !important;
}
</style>

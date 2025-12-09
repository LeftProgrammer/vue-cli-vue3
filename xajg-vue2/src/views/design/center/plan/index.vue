<template>
  <div class="page-leave">
    <table-layout
      :page="pageParams"
      title="供应计划列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="getTableData"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="计划年度:">
            <el-date-picker
              value-format="yyyy"
              v-model="query.year"
              type="year"
              placeholder="选择年"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="流程状态:">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.flowStatus"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in flowStatusOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="发起日期:" size="mini" prop="startTime">
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
        >
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
            label="计划年度"
            prop="year"
            header-align="center"
            align="center"
            width="120"
            excel.sort="1"
            excel.dateFormat="yyyy-MM"
          >
            <template slot-scope="{ row }">
              <span>{{ row.year ? timeFormat(row.year, "YYYY") : "" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="计划名称"
            prop="name"
            header-align="center"
            align="left"
            min-width="200"
            excel.sort="2"
          >
            <template slot-scope="{ row }">
              <!-- <el-tooltip
                :content="row.name ? row.name : ''"
                placement="top"
                effect="dark"
              > -->
              <el-link
                type="primary"
                class="text-ellipsis"
                @click="
                  handelShowDialog(
                    row,
                    'fine',
                    row.procMatterTaskDone ||
                      row.matterTaskTodo ||
                      row.procMatterRun,
                    'view'
                  )
                "
              >
                {{ row.name ? row.name : "" }}
              </el-link>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column
            label="计划开始日期"
            prop="startDate"
            align="center"
            width="120"
            excel.sort="3"
            excel.dateFormat="yyyy-MM-dd"
          >
            <template slot-scope="{ row }">
              {{ row.startDate ? timeFormat(row.startDate, "YYYY-MM-DD") : "" }}
            </template>
          </el-table-column>
          <el-table-column
            label="计划结束日期"
            prop="endDate"
            align="center"
            width="120"
            excel.sort="4"
            excel.dateFormat="yyyy-MM-dd"
          >
            <template slot-scope="{ row }">
              {{ row.endDate ? timeFormat(row.endDate, "YYYY-MM-DD") : "" }}
            </template>
          </el-table-column>
          <el-table-column
            label="发起人"
            width="120"
            prop="createUsername"
            align="center"
            excel.sort="5"
          >
          </el-table-column>
          <el-table-column
            label="发起时间"
            prop="createDate"
            align="center"
            width="180"
            excel.sort="6"
            excel.dateFormat="yyyy-MM-dd HH:mm"
          >
            <template slot-scope="{ row }">
              {{ row.createDate ? timeFormat(row.createDate,"yyyy-MM-DD HH:mm") : "" }}
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            width="120"
            align="center"
            excel.sort="7"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
          >
            <template #default="{ row }">
              <flow-status :row="row" :flowName="flowName"></flow-status>
            </template>
          </el-table-column>
          <el-table-column
            label="当前节点"
            prop="flowName"
            align="center"
            width="180"
            excel.sort="8"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.flowName ? row.flowName : ''"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis-clamp">
                  {{ row.flowName ? row.flowName : "" }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <flow-button
                :row="row"
                :promiseCode="'design-center-plan_delete'"
                :flowName="flowName"
                @click="handelShowDialog"
                @delete="deletedata"
                v-if="!flowShow"
              ></flow-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import { remove, page } from "./api";
import enums from "@/config/enums";
import { dateFormat } from "@/utils";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";

export default {
  name: "designPlan",
  mixins: [FlowListMixin],
  components: {
    TableLayout,
  },
  computed: {
    exportParams() {
      this.pageParams.entity = this.query;
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.beginTime = this.startTimeAndEndTime[0];
        this.pageParams.entity.endTime = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.beginTime = "";
        this.pageParams.entity.endTime = "";
      }
      return this.pageParams;
    },
  },
  data() {
    return {
      startTimeAndEndTime: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      options: [],
      tableData: [],
      query: {
        name: "",
        year: "",
        flowStatus: null,
        beginTime: null,
        endTime: null,
      },
      showDialog: false,
      formData: {
        id: null,
        applyDate: null,
        applyDept: "",
        applyDeptId: 0,
        applyDuty: "",
        applyDutyId: 0,
        applyNo: "",
        applyUser: "",
        applyUserId: 0,
        bizStatus: "",
        bpmStatus: 0,
        deleteStatus: 0,
        leaveCategory: "",
        leaveCategoryText: "",
        leaveEndtime: null,
        leaveHours: 0,
        leaveReason: "",
        leaveStarttime: null,
        uploadFile: "",
        uploadFileList: [],
      },

      currentSection: [],
      dictList: [],
      readonly: false,

      /**人员选择 */
      persons: [],
      /**组织机构选择 */
      deptShow: false,
      /**岗位 */
      dutyOptions: [],
      /**请假类型 */
      leaveCategoryOptions: [],

      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS

      /**流程弹窗 */
      flowShow: false,
      /**流程状态 */
      flowPage: "mine", //待办是todo，已办done，已发sent，
      // flowId: "P1137336714621091842",
      /**流程弹窗信息 */
      flowInfo: {
        /**供应计划流程：流程id */
        businessId: "",
        // flowCfgId: "P1131979769345212416",
        /**状态 */
        status: false,
      },
      //编辑通过当前人待办做判断。流程数据不运输删除
    };
  },
  created() {
    // if(this.query.salaryMonth){
    //   this.query.salaryMonth
    // }
    this.getTableData();
    this.getFlowStatus();
    // window.addEventListener("message", this.getMessage, false);
  },
  methods: {
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/design/plan/export";
      exportParams.filename = "计划报审";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },

    /**获取流程状态字典 */
    async getFlowStatus() {
      // const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      let data = [];
      // console.log("enums.FLOW_STATUS_ENUM", enums.FLOW_STATUS_ENUM);
      let options = enums.FLOW_STATUS_ENUM;
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name,
        });
      }
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    // 查询表格数据
    getTableData(pageInfo) {
      this.tableData = [];
      this.pageParams.entity = this.query;
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.beginTime = this.startTimeAndEndTime[0];
        this.pageParams.entity.endTime = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.beginTime = "";
        this.pageParams.entity.endTime = "";
      }
      this.pageParams = Object.assign(this.pageParams, pageInfo);
      page(this.pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        }
      });
    },
    deletedata(row) {
      if (!row.id) {
        return;
      }
      remove({
        id: row.id,
      }).then((res) => {
        if (res.success) {
          this.getTableData();
        } else {
          this.$message.error("数据删除异常，" + res.message);
        }
      });
    },
    async handelDeleteRow(row) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        this.deletedata(row.id);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  // padding: 15px;

  .table {
    height: 80%;

    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
</style>

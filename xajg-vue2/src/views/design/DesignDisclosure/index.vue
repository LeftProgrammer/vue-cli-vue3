<template>
  <div
    class="page-leave"
    :style="{ padding: pageType === 'DesignApplication' ? '0' : '15px' }"
  >
    <table-layout
      :page="pageParams"
      :pageType="pageType"
      title="交底通知列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="queryBtn()"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" ref="query" :inline="true">
          <el-form-item label="交底编号:" prop="code" size="mini">
            <el-input v-model="query.code" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="图纸名称:" prop="drawingName" size="mini">
            <el-input
              v-model="query.drawingName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="流程状态:"
            prop="flowStatus"
            size="mini"
          >
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

          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="交底日期:"
            size="mini"
            prop=""
          >
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
      <template slot="opratebtns" v-if="pageType !== 'DesignApplication'">
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
            width="54"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="交底编号"
            prop="code"
            align="left"
            width="180"
            header-align="center"
            excel.sort="1"
          >
                        <template slot-scope="{ row }">
              <el-link
                type="primary"
                class="text-ellipsis"
                :title="row.code"
                @click="handelShowDialog(row,'fine',row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun,'view')"
                >{{ row.code }}</el-link
              >
            </template>
          </el-table-column>
          <el-table-column
            label="图纸名称"
            prop="drawingName"
            align="left"
            header-align="center"
            excel.sort="2"
          >
            <!-- <template slot-scope="{ row }">
              <el-link
                type="primary"
                class="text-ellipsis"
                :title="row.drawingName"
                @click="handelShowDialog(row,'fine',row.procMatterTaskDone || row.matterTaskTodo || row.procMatterRun,'view')"
                >{{ row.drawingName }}</el-link
              >
            </template> -->
          </el-table-column>
          <el-table-column
            label="交底时间"
            prop="actualExplainDate"
            align="center"
            width="180"
            excel.sort="3"
            excel.dateFormat="yyyy-MM-dd HH:mm"
          >
            <template slot-scope="{ row }">
              {{
                row.actualExplainDate
                  ? timeFormat(row.actualExplainDate, "YYYY-MM-DD HH:mm")
                  : ""
              }}
            </template>
          </el-table-column>

<!--          <el-table-column-->
<!--            label="会议纪要"-->
<!--            prop="metingMinutes"-->
<!--            align="left"-->
<!--            excel.sort="4"-->
<!--            excel.handler="excelHandleCovert"-->
<!--            excel.args="file"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              <span-->
<!--                type="text"-->
<!--                class="text-0096 text-ellipsis pointer"-->
<!--                @click="showMeetFile(scope.row.metingMinutes)"-->
<!--                >{{ getMetingText(scope.row.metingMinutes) }}</span-->
<!--              >-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            label="发起人"
            width="120"
            prop="createUsername"
            align="center"
            v-if="pageType !== 'DesignApplication'"
            excel.sort="5"
          >
            <template slot-scope="{ row }">
              <!-- <el-tooltip
                :content="row.createUsername ? row.createUsername : ''"
                placement="top"
                effect="dark"
              > -->
                <span class="text-ellipsis">
                  {{ row.createUsername ? row.createUsername : "" }}
                </span>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column
            label="发起时间"
            prop="createDate"
            align="center"
            width="180"
            v-if="pageType !== 'DesignApplication'"
            excel.sort="6"
            excel.dateFormat="yyyy-MM-dd HH:mm"
          >
            <template slot-scope="{ row }">
              {{
                row.createDate
                  ? timeFormat(row.createDate, "YYYY-MM-DD HH:mm")
                  : ""
              }}
            </template>
          </el-table-column>

          <el-table-column
            label="流程状态"
            prop="flowStatus"
            align="center"
            width="120"
            v-if="pageType !== 'DesignApplication'"
            excel.sort="7"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
          >
            <template slot-scope="{ row }">
              <flow-status :row="row" :flowName="flowName"></flow-status>
            </template>
          </el-table-column>
          <el-table-column
            label="当前节点"
            prop="flowName"
            align="center"
            width="180"
            v-if="pageType !== 'DesignApplication'"
            excel.sort="8"
          >
            <template slot-scope="{ row }">
              <!-- <el-tooltip
                :content="row.flowName ? row.flowName : ''"
                placement="top"
                effect="dark"
              > -->
                <span class="text-ellipsis">
                  {{ row.flowName ? row.flowName : "" }}
                </span>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" prop="name" align="left">
            <template #default="{ row }">
              <div class="flex justify-center">
                  <!-- :btns="
                    pageType === 'DesignApplication'
                      ? ['view']
                      : ['deal', 'press', 'delete']
                  " -->
                <flow-button
                  :row="row"
                  :promiseCode="'design-DesignDisclosure_delete'"
                  :flowName="flowName"
                  @click="handelShowDialog"
                  @delete="deletedata"
                ></flow-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      ref="flowDialog"
      @closed="closed"
    ></flow-dialog>
  </div>
</template>

<script>
import { remove, update, page } from "./api";
import { dateFormat } from "@/utils";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import bimShow from "@/components/Bim/Show";
import { getByCode } from "@/components/PbsSelect/api";
export default {
  name: "DesignDisclosure",
  mixins: [FlowListMixin],
  components: { TableLayout, bimShow },
  props: {
    /**页面类型 设计应用：DesignApplication */
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      startTimeAndEndTime: [],
      DitSpeciality: [], //专业字典
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      options: [],
      tableData: [],
      query: {},
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

      // /**流程名称 */
      // flowName: "图纸供应流程",

      /**流程弹窗 */
      flowShow: false,
      // /**流程状态 */
      // flowPage: "mine", //待办是todo，已办done，已发sent，
      // flowId: "P1138462007083663363",
      /**流程弹窗信息 */
      flowInfo: {
        /**供应计划流程：流程id */
        // businessId: "",
        // flowCfgId: "P1131979769345212416",
        /**状态 */
        status: false,
      },
      //编辑通过当前人待办做判断。流程数据不运输删除
    };
  },

  created() {
    this.getTableData();
    this.getFlowStatus();
    // window.addEventListener("message", this.getMessage, false);
  },
  computed: {
    exportParams() {
      this.pageParams.entity = this.query;
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startDate = this.startTimeAndEndTime[0];
        this.pageParams.entity.endDate = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startDate = "";
        this.pageParams.entity.endDate = "";
      }
      return this.pageParams;
    },
  },
  methods: {
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/design/explain/export";
      exportParams.filename = "设计交底";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    queryBtn() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    getMetingText(val) {
      let text = "";
      if (val) {
        let arr = JSON.parse(val);
        text = arr[0].name;
      }
      return text;
    },
    showMeetFile(val) {
      if (val) {
        let arr = JSON.parse(val);
        console.log("arr", arr);
        this.$previewFileById(arr[0]);
      }
    },
    closed() {
      // console.log("关闭节点", this.$refs["flowDialog"]);
      this.getTableData();
      this.flowShow = false;
      return;
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
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    getPbsName(val) {
      let text = "*";
      let a = val?.split("&&&")[0];
      if (a) {
        text = a;
      }
      return text;
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
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
    // 查询表格数据
    getTableData(pageParams, pbsCode) {
      this.query.pbsCode = pbsCode;
      this.pageParams.entity = this.query;
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startDate = this.startTimeAndEndTime[0];
        this.pageParams.entity.endDate = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startDate = "";
        this.pageParams.entity.endDate = "";
      }
      // 设计应用页面查询已完成的
      if (this.pageType === "DesignApplication") {
        this.pageParams.entity.flowStatus = 2;
      }
      page(this.pageParams).then((data) => {
        this.tableData = data?.data?.records || [];
        this.pageParams.total = data?.data?.total || 0;
        // 设计应用页面设置pbs名称
        if (
          this.tableData &&
          this.tableData.length > 0 &&
          this.pageType === "DesignApplication"
        ) {
          for (let i = 0; i < this.tableData.length; i++) {
            getByCode(this.getPbsName(this.tableData[i].pbsCode)).then(
              (res) => {
                try {
                  this.$set(this.tableData[i], "pbsName", res.data.name || "");
                } catch (e) {
                  // console.error(e);
                }
              }
            );
          }
        }
      });
    },
    /**设计应用-关联bim模型*/
    relevancyBim(pbsCode) {
      this.$emit("relevancyBim", pbsCode);
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  .table {
    height: 100%;

    /deep/ .el-table__row .cell button {
      padding: 5px 10px !important;
      margin: 0 5px;
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
.pagination-container {
  display: flex;
  .pagination {
    margin-left: auto;
  }
}

/deep/ .el-range-editor--mini.el-input__inner {
  height: inherit !important;
}
/deep/ .el-date-editor .el-range-separator {
  line-height: 32px !important;
}
</style>

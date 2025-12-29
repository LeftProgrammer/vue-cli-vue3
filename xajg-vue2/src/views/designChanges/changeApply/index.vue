<template>
  <div
    class="page-leave"
    :style="{ padding: pageType === 'DesignApplication' ? '0' : '15px' }"
  >
    <table-layout
      :page="pageParams"
      :show-export-btn="true"
      :page-type="pageType"
      title="变更文件列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="handleQuery"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="变更编号:" size="mini">
            <el-input v-model="query.changeCode" placeholder="请输入编号" />
          </el-form-item>
          <el-form-item label="变更工程名称:" size="mini" label-width="120px">
            <el-input v-model="query.changeName" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="所属标段:" size="mini">
            <el-select
              ref="flowStateRef"
              v-model="query.sectionId"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in sectionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="变更金额:" size="mini">
            <el-select
              ref="flowStateRef"
              v-model="query.flowStatus"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in levelOptions"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="pageType !== 'DesignApplication'"
            label="发起日期:"
            size="mini"
          >
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-if="pageType !== 'DesignApplication'" slot="opratebtns">
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
            align="center"
            width="54"
            :index="getIndex"
          />
          <el-table-column
            label="变更编号"
            prop="changeCode"
            width="180"
            excel.handler="excelHandleCovert"
          />
          <el-table-column
            label="变更工程名称"
            prop="changeName"
            excel.handler="excelHandleCovert"
          >
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                class="text-ellipsis"
                :title="row.changeName"
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
                {{ row.changeName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="所属标段"
            prop="sectionId"
            align="left"
            header-align="center"
          >
            <template slot-scope="scope">
              <span :title="scope.row.sectionId" class="text-ellipsis">{{
                sectionList.find((item) => item.id === scope.row.sectionId)
                  ? sectionList.find((item) => item.id === scope.row.sectionId)
                    .name
                  : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="变更金额"
            prop="level"
            align="center"
            width="180"
            excel.read-converter-exp="1=≥100万，＜500万,2=>=500"
          >
            <template slot-scope="{ row }">
              {{ getLevel(row.level) }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="pageType !== 'DesignApplication'"
            label="发起人"
            prop="createUser"
            align="center"
            width="120"
            excel.handler="excelHandleCovert"
            excel.args="user"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.createUsername ? scope.row.createUsername : "*"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="pageType !== 'DesignApplication'"
            label="发起时间"
            prop="createDate"
            align="center"
            width="180"
            excel.date-format="yyyy-MM-DD"
          >
            <template slot-scope="{ row }">
              {{
                row.createDate
                  ? timeFormat(row.createDate, "yyyy-MM-DD HH:mm")
                  : ""
              }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="pageType !== 'DesignApplication'"
            label="流程状态"
            prop="flowStatus"
            align="center"
            width="120"
            excel.read-converter-exp="0=未提交,1=流转中,2=已完成"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flow-name="flowName" />
            </template>
          </el-table-column>
          <el-table-column
            v-if="pageType !== 'DesignApplication'"
            label="当前节点"
            prop="flowName"
            align="center"
            width="180"
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
          <el-table-column label="操作" align="left" width="200">
            <template #default="{ row }">
              <div class="flex justify-center">
                <!-- :btns="
                    pageType === 'DesignApplication'
                      ? ['view']
                      : ['deal', 'press', 'delete']
                  " -->
                <flow-button
                  :promise-code="'design-center-drawingSupply_delete'"
                  :row="row"
                  :flow-name="flowName"
                  @click="handelShowDialog"
                  @delete="deletedata"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow"
      :flow-info="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    />
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import { remove, page, sectionList } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
// import bimShow from "@/components/Bim/Show";
import { getByCode } from "@/components/PbsSelect/api";

export default {
  name: "ChangeApply",
  components: { TableLayout },
  mixins: [FlowListMixin],
  props: {
    /**页面类型 设计应用：DesignApplication */
    pageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      levelOptions: [
        {
          dictId: "0",
          dictName: "<100万",
        },
        {
          dictId: "1",
          dictName: "≥100万，＜500万",
        },
        {
          dictId: "2",
          dictName: "＞=500万",
        },
        {
          dictId: "3",
          dictName: "无变化",
        },
      ],

      baseId: "",
      drawingCode: "",
      drawingName: "",
      startTimeAndEndTime: [],
      dialog: true,
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
      htxxOptions: [],
      currentSection: [],
      dictList: [],
      readonly: false,
      /**标段列表 */
      sectionList: [],

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
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      /**流程弹窗 */
      flowShow: false,
      // /**流程状态 */
      // flowPage: "mine", //待办是todo，已办done，已发sent，
      // flowId: "P1138462007083663363",
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
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    exportParams() {
      const entity = {
        ...this.query,
        type: 1,
        flowStatus: this.query.flowStatus,
      };

      if (this.startTimeAndEndTime?.length > 0) {
        entity.startDate = this.startTimeAndEndTime[0];
        entity.endDate = this.startTimeAndEndTime[1];
      } else {
        entity.startDate = "";
        entity.endDate = "";
      }

      return {
        ...this.pageParams,
        entity,
      };
    },
    showAdd() {
      let currentUser = this.$getStorage("userInfo");
      return currentUser.roles.includes("GLJZYFZR");
    },
  },
  created() {
    // this.getTableData();
    this.getDictItemList(this.designProfessionCode);
    // this.getFlowStatus();
    // 获取数据
    this.htxxOptions = [];
    this.getDictItems("htxx").then((datas) => {
      console.log(datas);
      this.htxxOptions = datas;
    });
    this.baseId = this.$route.query.baseId;
    this.drawingCode = this.$route.query.drawingCode;
    this.drawingName = this.$route.query.drawingName;
    console.log(this.baseId);
    // 获取标段列表
    this.getSectionList();
  },
  mounted() {
    if (this.baseId) {
      setTimeout(() => this.handelShowDialog(null, "mine"), 1000);
    }
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    getLevel(level) {
      return this.levelOptions.find((item) => item.dictId === level)?.dictName;
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/design/change/export";
      exportParams.filename = "设计变更";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
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
    getTypeText(value) {
      let text = "*";
      let a = this.designProfessionOptions.find(
        (item) => item.dictCode == value
      );
      if (a) {
        text = a.dictName;
      }
      return text;
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      let data = [];
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
    // 查询表格数据
    getTableData(pageInfo, pbsCode) {
      this.query.pbsCode = pbsCode;
      this.tableData = [];
      this.query.type = 1;
      this.pageParams.entity.flowStatus = this.query.flowStatus;
      this.pageParams.entity = { ...this.query };
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startDate = this.startTimeAndEndTime[0];
        this.pageParams.entity.endDate = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startDate = "";
        this.pageParams.entity.endDate = "";
      }
      this.pageParams = Object.assign(this.pageParams, pageInfo);
      // 设计应用页面查询已完成的
      if (this.pageType === "DesignApplication") {
        this.pageParams.entity.flowStatus = 2;
      }
      page(this.pageParams).then((res) => {
        let tableData = res.data.records;
        this.$set(this, "tableData", tableData);
        this.pageParams.total = res.data.total;
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
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designProfessionOptions = res.data;
            }
          });
        }
      }
    },
    deletedata(row) {
      let params = {
        id: row.id,
      };
      remove(params).then((res) => {
        this.getTableData();
      });
    },
    /**设计应用-关联bim模型*/
    relevancyBim(pbsCode) {
      this.$emit("relevancyBim", pbsCode);
    },
    /**获取施工标段列表 */
    getSectionList() {
      this.sectionList = [];
      sectionList({}).then((res) => {
        if (res.success) {
          console.log("sectionList", res.data);
          this.sectionList = res.data;
        }
      });
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

<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      :class="{ showDayPlan: showDayPlan }"
      :title="showPlan ? baseData.name : '进度填报'"
      :page="pageParams"
      :showPage="!showPlan && !showDayPlan"
      :showSearchBtns="!showPlan && !showDayPlan"
      @query="showDayPlan ? queryDayGantt() : getTableData()"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item v-if="showDayPlan || showPlan">
            <el-button
              v-if="showPlan || showDayPlan"
              icon="el-icon-back"
              @click="back"
            >
              返回
            </el-button>
          </el-form-item>
          <el-form-item label="计划名称:" v-if="!showPlan && !showDayPlan">
            <el-input v-model="pageParams.entity.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="标段:" v-if="!showPlan && !showDayPlan">
            <el-select
              v-model="pageParams.entity.sectionId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sectionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-form
          style="margin-top: 16px"
          :model="pageParams.entity"
          :inline="true"
          v-if="showDayPlan"
        >
          <el-form-item label="填报日期 ">
            <el-date-picker
              v-model="pageParams.entity.reportDate"
              type="date"
              placeholder="选择日期"
              @change="reportDateChange"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-dropdown
          v-if="showPlan"
          style="margin-right: 10px"
          split-button
          @command="handleCommand"
        >
          {{
            ganttDateType == "day"
              ? "日视图"
              : ganttDateType == "month"
              ? "月视图"
              : ganttDateType == "quarter"
              ? "季视图"
              : ganttDateType == "year"
              ? "年视图"
              : ""
          }}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="day">日视图</el-dropdown-item>
            <el-dropdown-item command="month">月视图</el-dropdown-item>
            <el-dropdown-item command="quarter">季视图</el-dropdown-item>
            <el-dropdown-item command="year">年视图</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table
          v-if="!showPlan && !showDayPlan"
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            label="序号"
            type="index"
            :width="$calculateWidth(54)"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="计划名称"
            prop="name"
            header-align="center"
            align="left"
            :min-width="$calculateWidth(190)"
          />

          <el-table-column
            label="计划类型"
            prop="type"
            align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="scope">
              <span>{{ $DictionaryParsing(jdjhlxList, scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="编制人"
            prop="organizerFullname"
            align="center"
            :width="$calculateWidth(120)"
          />
          <el-table-column
            label="创建时间"
            prop="createDate"
            align="center"
            :width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              {{ dateFormat(row.createDate, "YYYY-MM-DD HH:mm") }}
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            align="center"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flowName="scope.row.flowName" />
            </template>
          </el-table-column>
          <el-table-column
            label="录入人"
            align="center"
            prop="personsFullname"
            :width="$calculateWidth(120)"
          />

          <el-table-column
            label="录入时间"
            prop="inputDate"
            align="center"
            :width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              {{
                row.inputDate
                  ? dateFormat(row.inputDate, "YYYY-MM-DD HH:mm")
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template #default="{ row }">
              <el-link
                :disabled="row.flowStatus != 2"
                type="primary"
                @click="viewPlan(row, 1)"
              >
                日报
              </el-link>
              <el-divider direction="vertical"></el-divider>
              <el-link
                :disabled="row.flowStatus != 2"
                type="primary"
                @click="viewPlan(row, 2)"
              >
                进度填报
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <gantt
          v-else-if="showPlan"
          ref="gantt"
          class="w-100pre h-100pre"
          @ganttHandleClick="ganttHandleClick"
        ></gantt>
        <dayReportGantt
          v-else-if="showDayPlan"
          ref="dayReportGantt"
          class="w-100pre h-100pre"
          :reportDate="pageParams.entity.reportDate"
          @ganttHandleClick="ganttHandleClick"
        ></dayReportGantt>
      </template>
    </table-layout>
    <planModal
      v-if="showPlan && showPlanDetail"
      :visible="showPlan && showPlanDetail"
      :data="planDetailData"
      :baseId="baseData.id"
      :type="planModalType"
      @sureson="sureson"
    />
    <planDayModal
      v-if="showDayPlan && showPlanDetail"
      :visible="showDayPlan && showPlanDetail"
      :data="planDetailData"
      :baseId="baseData.id"
      :type="planModalType"
      :reportDate="pageParams.entity.reportDate"
      @sureson="sureson"
    />
    <historyModal
      ref="historyModal"
      :visible="showHistoryModal"
      :data="historyDetailData"
      @sureson="showHistoryModal = false"
    />
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    />
  </div>
</template>

<script>
import { page, remove } from "./api";
import { getSectionByCorpId } from "@/api//measure.js";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import enums from "@/config/enums";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import planModal from "./planModal";
import planDayModal from "./planDayModal";
import dayReportGantt from "./dayReportGantt";
import gantt from "./gantt";
import { subPlan } from "./api";
import historyModal from "./historyModal.vue";
import moment from "moment";
export default {
  name: "ConstructionReport",
  components: {
    TableLayout,
    planModal,
    planDayModal,
    gantt,
    dayReportGantt,
    historyModal,
  },
  mixins: [FlowListMixin],
  beforeRouteLeave(to, from, next) {
    this.showPlan = false;
    this.showDayPlan = false;
    next();
  },
  data() {
    return {
      pageParams: {
        orderProperties: [
          {
            property: "createDate",
            asc: false,
          },
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
          reportDate: new Date(), // 默认值为当前日期
          // params: {}
        },
      },
      tableData: [],
      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      jdjhlxList: [],
      // gantt
      showPlan: false,
      showDayPlan: false,
      baseData: {},
      ganttData: [],
      showPlanDetail: false,
      planDetailData: {},
      planModalType: "",
      sectionList: [],
      ganttDateType: "day",
      showHistoryModal: false,
      historyDetailData: [],
    };
  },
  created() {
    this.getFlowStatus();
    this.getDictItemList();
  },
  mounted() {
    // this.reportDateChange(new Date())
  },
  methods: {
    dateFormat,
    /**获取字典 */
    async getDictItemList() {
      const jdjhlx = await getDictItemList("jdjhlx");
      this.jdjhlxList = jdjhlx.data;
      // 获取标段
      this.current = this.$getStorage("userInfo");
      await this.getSectionList(this.current.corpId);
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSectionByCorpId({
          corpId: corporateId,
        });

        if (!success) {
          this.$message.error("查询标段失败：" + message);
          return false;
        }
        this.sectionList = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询标段失败");
        return false;
      }
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    queryDayGantt(flag) {
      this.ganttData.forEach((item) => {
        if (item.planDetails && this.pageParams.entity.reportDate) {
          const data = item.planDetails.find(
            (x) =>
              x.reportDate ==
              dateFormat(this.pageParams.entity.reportDate, "YYYY-MM-DD")
          );
          item.reportNum = data ? data.reportNum : "";
          item.remark = data ? data.remark : "";
          item.reportId = data ? data.id : "";
        } else {
          item.reportNum = null;
          item.remark = "";
        }
      });
      this.$refs.dayReportGantt.restGanttConfig(this.ganttData, flag);
    },
    reset() {
      this.pageParams = {
        orderProperties: [
          {
            property: "createDate",
            asc: false,
          },
        ],
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0,
        entity: {
          params: {},
        },
      };
      if (this.showDayPlan) {
        this.queryDayGantt();
      } else {
        this.getTableData();
      }
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo);
      if (pageParams.entity.createDate?.length > 0) {
        pageParams.entity.startCreateDate = pageParams.entity.createDate[0];
        pageParams.entity.endCreateDate = pageParams.entity.createDate[1];
        delete pageParams.createDate;
      }
      page(pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        }
      });
    },
    reportDateChange() {
      this.queryDayGantt();
    },
    /**获取流程状态字典 */
    getFlowStatus() {
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
    },
    deletedata(row) {
      console.log(row);
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
    // gantt=================================================
    viewPlan(row, type) {
      this.baseData = row;
      // this.$set(this.pageParams.entity, "reportDate", "");
      if (type == 2) {
        //进度填报
        this.showPlan = true;
      } else {
        //日报
        this.showDayPlan = true;
      }
      this.ganttDateType = "day";
      this.getGanttData();
    },
    getGanttData(flag) {
      subPlan({ id: this.baseData.id }).then((res) => {
        this.ganttData = res.data.map((x) => {
          x.parent = x.pid;
          x.planDay =x.planDay ||  moment(x.endDate).diff(moment(x.startDate), "days");
          x.start_date = x.startDate.split("-").reverse().join("-");
          x.end_date = x.endDate.split("-").reverse().join("-");
          return x;
        });
        if (this.showDayPlan) this.queryDayGantt(flag);
        else {
          this.$refs.gantt.restGanttConfig(res.data);
        }
      });
    },
    handleCommand(command) {
      this.ganttDateType = command;
      this.$refs.gantt.changeScale(command);
    },
    sureson() {
      this.showPlanDetail = false;
      this.getGanttData(true);
    },
    importSuccess() {
      this.getGanttData();
    },
    downTemp() {},
    ganttHandleClick(id, type) {
      if (type == "history") {
        const data = id ? this.ganttData.find((x) => x.id == id) || {} : {};
        if (!data.planDetails || data.planDetails.length < 1) {
          this.$message.info("暂未填报");
          return;
        }
        this.historyDetailData = data.planDetails;
        this.showHistoryModal = true;
      } else {
        this.planModalType = type;
        this.planDetailData = id ? this.ganttData.find((x) => x.id == id) : {};
        this.showPlanDetail = true;
      }
    },
    back() {
      if (this.showDayPlan) {
        // this.$refs.dayReportGantt.destructor();
        this.showDayPlan = false;
      } else {
        // this.$refs.gantt.destructor();
        this.showPlan = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>

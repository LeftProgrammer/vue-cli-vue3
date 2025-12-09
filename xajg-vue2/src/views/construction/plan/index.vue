<template>
  <div style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      :title="showPlan ? baseData.name : '进度计划'"
      :page="pageParams"
      :showPage="!showPlan"
      :showSearchBtns="!showPlan"
      @query="getTableData"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams.name" :inline="true">
          <el-form-item label="计划名称:" v-if="!showPlan">
            <el-input v-model="pageParams.entity.name" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="标段:" v-if="!showPlan">
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
          <el-form-item v-if="showPlan">
            <el-button
              icon="el-icon-back"
              size="medium"
              @click="showPlan = false"
            >
              返回
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 新增按钮 -->
      <template slot="opratebtns">
        <el-button
          v-if="!showPlan"
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
        >
          新增
        </el-button>
        <div v-if="showPlan" class="construction_plan_btns">
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="ganttHandleClick(null, 'add')"
            >
              新增
            </el-button>
            <el-upload
              class="upload-demo"
              action="/api/construction/plan/import"
              :on-success="importSuccess"
              :on-error="importError"
              :show-file-list="false"
              :data="{ id: baseData.id }"
              style="display: inline-block; margin: 0 10px"
            >
              <el-button>导入</el-button>
            </el-upload>
            <el-button @click="downTemp()"> 下载模版</el-button>
          </div>
          <el-dropdown split-button @command="handleCommand">
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
        </div>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <el-table
          v-if="!showPlan"
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
            :min-width="$calculateWidth(190)"
          >
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                class="text-ellipsis"
                @click="
                  edit(
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
            </template>
          </el-table-column>

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
            align="center"
            prop="organizerFullname"
            :width="$calculateWidth(120)"
          />
          <el-table-column
            label="所属标段"
            prop="sectionId"
            excel.handler="excelHandleCovert"
            excel.args="section"
            align="center"
            width="180"
          >
            <template slot-scope="{ row }">
              <div class="text-ellipsis">
                {{ getText(sectionList, getCodeName(row, "sectionId")) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            header-align="center"
            align="center"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flowName="scope.row.flowName"/>
            </template>
          </el-table-column>
          <el-table-column
            label="录入人"
            prop="personsFullname"
            align="center"
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
            width="215"
            align="center"
          >
            <template #default="{ row }">
              <flow-button
                :row="row"
                :flowName="row.flowName"
                :btns="[
                  { title: '办理', method: 'deal' },
                  { title: '催办', method: 'press' },
                  { title: '删除', method: 'delete' },
                  {
                    title: '进度计划',
                    method: 'viewPlan',
                    disabled: row.flowStatus != 2,
                  },
                ]"
                @click="edit"
                @delete="deletedata"
                @viewPlan="viewPlan"
              >
                <!-- <template #button>
                  <el-link
                    type="primary"
                    :disabled="row.flowStatus != 2"
                    @click="viewPlan(row)"
                  >
                    进度计划
                  </el-link>
                  <el-divider direction="vertical" />
                </template> -->
              </flow-button>
            </template>
          </el-table-column>
        </el-table>
        <gantt
          v-else
          ref="gantt"
          class="w-100pre h-100pre"
          @ganttHandleClick="ganttHandleClick"
        ></gantt>
      </template>
    </table-layout>
    <planModal
      v-if="showPlanDetail"
      :visible="showPlanDetail"
      :data="planDetailData"
      :baseId="baseData.id"
      :type="planModalType"
      @sureson="sureson"
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
import { page, remove, subDelete } from "./api";
import { getSectionByCorpId } from "@/api//measure.js";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import enums from "@/config/enums";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import planModal from "./planModal";
import gantt from "./gantt";
import { subPlan } from "./api";
import moment from "moment";

export default {
  name: "ConstructionPlan",
  components: { TableLayout, planModal, gantt },
  mixins: [FlowListMixin],
  beforeRouteLeave(to, from, next) {
    this.showPlan = false;
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
          // params: {}
        },
      },
      tableData: [],
      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      jdjhlxList: [],
      // gantt
      showPlan: false,
      baseData: {},
      ganttData: [],
      showPlanDetail: false,
      planDetailData: {},
      planModalType: "",
      sectionList: [],
      ganttDateType: "day",
    };
  },
  created() {
    this.getFlowStatus();
    this.getDictItemList();
  },
  mounted() {
  },
  methods: {
    dateFormat,
    /**获取字典 */
    getCodeName(row, type) {
      let name = row[type] || row.designSupply?.[type] || "";
      return name;
    },
    getText(options, value) {
      let a = [];
      if (value) {
        value = value.split(",");
        a = value.map((x) => {
          let item = options.find((y) => y.id == x);
          if (item) {
            return item.name;
          }
        });
      }
      return a.toString();
    },
    async getCurrent() {
      console.log("this.currentSection", this.$getStorage("userInfo"));
      this.current = this.$getStorage("userInfo");
      console.log("获取当前登陆人的单位", this.current);
      await this.getSectionList(this.current.corpId);
      if (this.sectionList.length === 0) {
        this.$message.error("查询标段失败");
      }
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
    async getDictItemList() {
      const jdjhlx = await getDictItemList("jdjhlx");
      this.jdjhlxList = jdjhlx.data;
      // 获取标段
      const { data } = await this.getCurrent();
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
      this.getTableData();
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
    viewPlan(row) {
      this.baseData = row;
      this.showPlan = true;
      this.ganttDateType = "day";
      this.getGanttData();
    },
    getGanttData() {
      subPlan({ id: this.baseData.id }).then((res) => {
        this.ganttData = res.data.map((x) => {
          x.parent = x.pid;
          x.planDay = x.planDay || moment(x.endDate).diff(moment(x.startDate), "days");
          x.start_date = x.startDate && x.startDate.split("-").reverse().join("-");
          x.end_date = x.endDate && x.endDate.split("-").reverse().join("-");
          return x;
        });
        this.$refs.gantt.restGanttConfig(res.data);
      });
    },
    handleCommand(command) {
      this.ganttDateType = command;
      this.$refs.gantt.changeScale(command);
    },
    sureson() {
      this.showPlanDetail = false;
      this.getGanttData();
    },
    importSuccess(e) {
      console.log(e)
      if (e.success) {
        this.$message.success("导入成功");
      } else {
        this.$message.warning(e.message);
      }
      this.getGanttData();
    },
    importError(e) {
    },
    /**
     * @description 下载模板
     */
    downTemp() {
      console.log("下载模板");
      let fileName = "进度计划导入模板.xlsx";
      var link = document.createElement("a");
      link.href = "/static/template/进度计划导入模板.xlsx";
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    ganttHandleClick(id, type) {
      if (type == "delete") {
        this.$confirm("确定删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        })
          .then(() => {
            subDelete({ id }).then((res) => {
              this.getGanttData();
            });
          })
          .catch(() => {
          });
      } else {
        this.planModalType = type;
        this.planDetailData = id ? this.ganttData.find((x) => x.id == id) : {};
        this.showPlanDetail = true;
      }
    },
    edit(row, status, task, type) {
      this.handelShowDialog(row, status, task);
    },
  },
};
</script>

<style scoped lang="scss">
.table-content {
  /deep/ .add-btns .construction_plan_btns {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .el-dropdown {
      margin-right: 28%;
    }
  }
}
</style>

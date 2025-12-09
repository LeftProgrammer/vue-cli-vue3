<template>
  <div class="page-leave">
<!--    <el-row :gutter="20">-->
<!--      <el-col :span="18" class="position-relative">-->
<!--        <el-date-picker-->
<!--          v-model="currentMonth"-->
<!--          type="month"-->
<!--          @change="changeMonth"-->
<!--          value-format="yyyy-MM"-->
<!--          placeholder="选择月"-->
<!--          class="picker-month position-absolute top-12"-->
<!--        >-->
<!--        </el-date-picker>-->
<!--        <el-calendar v-model="currentDate">-->
<!--          <template slot="dateCell" slot-scope="{ data }">-->
<!--            <div-->
<!--              @click="selectDay(data.day, data)"-->
<!--              class="flex h-100pre flex-column justify-between"-->
<!--            >-->
<!--              <p class="date" :data-date="data.day">-->
<!--                {{ data.day.split("-")[2] }}-->
<!--              </p>-->
<!--              <div style="margin-left: auto" class="current-value">-->
<!--                <span class="font-30 custom-day mr-10"></span-->
<!--                ><span class="font-12 font-w-550 mr-10 unit">份</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </template></el-calendar-->
<!--        >-->
<!--      </el-col>-->
<!--      <el-col :span="6">-->
<!--        <div class="h-53 flex align-center justify-between">-->
<!--          <div class="font-w-600">-->
<!--            {{ currentDateText }}-->
<!--          </div>-->
<!--          &lt;!&ndash; <div-->
<!--            class="iconfont icon-add poniter"-->
<!--            @click="handelShowDialog(null, 'mine')"-->
<!--          ></div> &ndash;&gt;-->
<!--          <el-button-->
<!--            type="primary"-->
<!--            icon="el-icon-plus"-->
<!--            @click="handelShowDialog(null, 'mine')"-->
<!--          >-->
<!--            新增-->
<!--          </el-button>-->
<!--        </div>-->
<!--        &lt;!&ndash; 日志 &ndash;&gt;-->
<!--        <div class="log">-->
<!--          <div class="text-center flex" v-if="logLists.length == 0">-->
<!--            &lt;!&ndash; <el-tooltip-->
<!--              description="暂无日志"-->
<!--              :image-size="200"-->
<!--              class="auto text-center"-->
<!--            >111</el-tooltip> &ndash;&gt;-->
<!--            <el-empty-->
<!--              description="暂无日志"-->
<!--              class="auto w-200 text-center"-->
<!--            ></el-empty>-->
<!--          </div>-->

<!--          <div v-else>-->
<!--            <div-->
<!--              v-for="item in logLists"-->
<!--              :key="item.id"-->
<!--              class="bg-fff rounded-5 px-10 py-20 mb-20 logItem"-->
<!--            >-->
<!--              <div class="flex align-center justify-between">-->
<!--                <div class="font-w-600">-->
<!--                  {{ item.createUsername }}-->
<!--                </div>-->
<!--                <div class="" style="color: #8ad482">-->
<!--                  <flow-status :row="item" :flowName="flowName"></flow-status>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="bottom-line"></div>-->
<!--              <div class="flex align-center mb-5 justify-between font-14">-->
<!--                &lt;!&ndash; <div class="">{{ getPbsName(item.pbsCode) }}</div> &ndash;&gt;-->
<!--                <div class="">{{ item.pbsName }}</div>-->
<!--                <div class="">-->
<!--                  {{ $DictionaryParsing(classs, item.workTime) }}-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="flex align-center mb-5 justify-between font-14">-->
<!--                <div class="">{{ item.constructionUnit || "" }}</div>-->
<!--                <div class="">-->
<!--                  {{ getSelectText(sectionOptions, item.section) }}-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="bottom-line"></div>-->
<!--              <div class="opration flex justify-end">-->
<!--                <flow-button-->
<!--                  :row="item"-->
<!--                  :flowName="flowName"-->
<!--                  @click="handelShowDialog"-->
<!--                  @delete="deleteLog(item)"-->
<!--                ></flow-button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <table-layout
        :page="pageParams"
        title="施工日志列表"
        @pageSizeChange="handleSizeChange"
        @pageCurrentChange="handleCurrentChange"
        @reset="reset"
        @query="queryBtn()"
        :showExportBtn="true"
        @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" ref="query" :inline="true">
          <el-form-item
              label="日期:"
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
          <el-form-item label="标段:">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
                v-model="query.section"
                placeholder="请选择"
                clearable
            >
              <el-option
                  v-for="item in sectionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
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
                width="60"
                prop=""
                align="center"
                :index="getIndex"
            />
            <el-table-column
                label="日期"
                prop="logsDate"
                align="center"
                width="120"
                excel.dateFormat="yyyy-MM-dd"
            >
              <template slot-scope="{ row }">
                {{
                  row.logsDate
                      ? timeFormat(row.logsDate, "YYYY-MM-DD")
                      : ""
                }}
              </template>
            </el-table-column>

            <el-table-column
                label="标段名称"
                prop="section"
                align="left"
                header-align="center"
                excel.handler="excelHandleCovert"
                excel.args="section"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  :content="getSelectText(sectionOptions, row.section)"
                  placement="top"
                  effect="dark"
                >
                  <span class="text-ellipsis-clamp">
                    {{ getSelectText(sectionOptions, row.section) }}
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
                label="施工单位"
                prop="constructionUnit"
                align="left"
                header-align="center"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  :content="row.constructionUnit"
                  placement="top"
                  effect="dark"
                >
                  <span class="text-ellipsis-clamp">
                    {{ row.constructionUnit }}
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
                label="发起人"
                width="80"
                prop="createUsername"
                align="center"
            />
            <el-table-column
                label="发起日期"
                prop="createDate"
                align="center"
                width="160"
                excel.dateFormat="yyyy-MM-dd HH:mm:ss"
            >
              <template slot-scope="{ row }">
                {{
                  row.createDate
                      ? timeFormat(row.createDate, "YYYY-MM-DD HH:mm:ss")
                      : ""
                }}
              </template>
            </el-table-column>

            <el-table-column
                label="流程状态"
                prop="flowStatus"
                align="left"
                width="100"
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
            />
            <el-table-column label="操作" width="210" prop="" align="left">
              <template #default="{ row }">
                <div class="flex justify-left">
                  <flow-button
                      :row="row"
                      :promiseCode="'design-DesignDisclosure_delete'"
                      :flowName="flowName"
                      :btns=" ['view', 'deal', 'press', 'delete']"
                      @click="handelShowDialog"
                      @delete="deleteLog(row)"
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
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import { byMonth, remove, logList, sectionList,page } from "./api-v3";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import { mapGetters } from "vuex";
import { dateFormat } from "@/utils";
import { getDictItemList } from "@/api/dict";
import TableLayout from '@/components/ContentLayout/Table/index.vue';
import { getByCode } from '@/components/PbsSelect/api';
import treeTableLayout from '@/components/ContentLayout/TreeTable/index.vue';
const status = {
  1: "todo",
  2: "done",
  3: "wait",
  4: "sent",
  5: "fine",
};
export default {
  components: { TableLayout },
  mixins: [FlowListMixin],

  data() {
    return {
      startTimeAndEndTime: [],
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      query: {
        section: ''
      },
      currentMonth: "",
      flowShow: false,
      flowInfo: {},
      currentDate: "",
      currentDateText: "",
      logLists: [], //日志列表
      classs: [], //班次列表
      sectionOptions: [],
    };
  },
  created() {
    this.getTableData(); //这个是为了冲掉混入里面的tableData请求
    // this.getToday();
    this.getClass();
    this.getFlowStatus();
    this.getSectionList();
  },
  // 监听 currentMonth
  watch: {
    // currentMonth: {
    //   handler(newVal) {
    //     console.log("月份发生变化", newVal);
    //     this.getLogNum();
    //   },
    //   deep: true,
    // },
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    /**新增按钮权限 */
    // isShowButton() {
    //   // const roles = this.$store.getters.loginInfo.roles;
    //   // return roles ? roles.includes("service-specialist") : false;
    //   return true;
    // },
    buttonResources() {
      const route = this.$route;
      const { query } = route;
      // if set path, the sidebar will highlight the path you set
      let permCode;
      if (query && query.permCode) {
        permCode = query.permCode;
      }
      let items = this.getMenuButtonItems(this.menuRoutes, permCode);
      return items.map((x) => x.value);
    },
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
  mounted() {
    window.addEventListener("message", this.getMessage, false);
    this.$nextTick(() => {
      // 使用dom 获取  el-calendar__button-group 按钮组 对按钮组下的每一个按钮进行点击事件监听
      let dom = document.querySelector(
        ".el-calendar__button-group .el-button-group"
      );
      console.log("dom", dom.children);
      for (let i = 0; i < dom.children.length; i++) {
        dom.children[i].addEventListener("click", (e) => {
          let day = dateFormat(
            new Date(this.currentDate).getTime(),
            "yyyy-MM-DD"
          );
          this.currentDateText = `${day.split("-")[1]}月${day.split("-")[2]}日`;
          this.currentMonth = dateFormat(
            new Date(this.currentDate).getTime(),
            "yyyy-MM"
          );
          console.log("e", day);
        });
      }
    });
  },
  methods: {
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = '/api/schedule/construction/log/information/v3/export';
      exportParams.filename = '施工日志2';
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns
    },
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    queryBtn() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    //通过permCode获取按钮权限
    getMenuButtonItems(menus, permCode) {
      if (!permCode) {
        return null;
      }
      if (menus.length === 0) {
        return [];
      }
      let item = menus.find((x) => x.permCode === permCode);
      if (item && item.children && item.children.length) {
        return item.children.filter((x) => x.permType === 2);
      } else {
        let childs = [];
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];
          if (menu.children && menu.children.length > 0) {
            childs.push(...menu.children);
          }
        }
        return this.getMenuButtonItems(childs, permCode);
      }
    },
    getSelectText(dict, value) {
      let text = "*";
      let a = dict.find((item) => item.id == value);
      if (a) {
        text = a.name;
      }
      return text;
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          console.log("sectionList", res.data);
          this.sectionOptions = res.data;
        }
      });
    },
    getTableData() {
      this.pageParams.entity = this.query;
      if (this.startTimeAndEndTime?.length > 0) {
        this.pageParams.entity.startDate = this.startTimeAndEndTime[0];
        this.pageParams.entity.endDate = this.startTimeAndEndTime[1];
      } else {
        this.pageParams.entity.startDate = "";
        this.pageParams.entity.endDate = "";
      }
      page(this.pageParams).then((data) => {
        this.tableData = data?.data?.records || [];
        this.pageParams.total = data?.data?.total || 0;
        // if (
        //     this.tableData &&
        //     this.tableData.length > 0
        // ) {
        //   for (let i = 0; i < this.tableData.length; i++) {
        //     getByCode(this.getPbsName(this.tableData[i].pbsCode)).then(
        //         (res) => {
        //           try {
        //             this.$set(this.tableData[i], "pbsName", res.data.name || "");
        //           } catch (e) {
        //             // console.error(e);
        //           }
        //         }
        //     );
        //   }
        // }
      });
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },
    // 数据更改重新调用
    // getDefault() {
      // this.getLogNum();
      // this.getToday();
    // },
    /**获取班次字典 */
    async getClass() {
      const { data } = await getDictItemList("CLASS");
      this.classs = data;
      console.log("classs", data);
    },
    getPbsName(val) {
      let text = "*";
      console.log("getPbsName", val);
      let a = val?.split("&&&")[1];
      if (a) {
        text = a;
      }
      return text;
    },
    // 切换月份
    changeMonth(val) {
      // 使默认数据为当月的第一天
      console.log("切换月份", val);
      this.currentDate = val + "-01";
    },
    // 默认进来  设置当前月份  以及当天
    getToday() {
      this.currentMonth = dateFormat(new Date().getTime(), "yyyy-MM");
      let day = dateFormat(new Date().getTime(), "yyyy-MM-DD");
      this.currentDate = day;
      this.selectDay(day, "current-month");
    },
    // 点击日历单元格
    selectDay(day, data) {
      this.currentDateText =
        day.split("-")[1] + "月" + day.split("-")[2] + "日";
      // 修改月份
      this.currentMonth = `${day.split("-")[0]}-${day.split("-")[1]}`;
      if (data?.type === "current-month") {
        setTimeout(() => {
          this.getLogData();
        }, 0);
      }
    },
    // 请求月份 下的日志数量
    // getLogNum() {
    //   setTimeout(async () => {
    //     let first = document.querySelector(".el-calendar-day .date");
    //     let logsDate = first.getAttribute("data-date");
    //     let params = {
    //       logsDate,
    //     };
    //     console.log("请求日志数量参数", params);
    //     let res = await byMonth(params);
    //     let souce = [];
    //     if (res.success && res.data?.length > 0) {
    //       souce = res.data;
    //     } else {
    //       // this.$message.error("暂无数据");
    //       return;
    //     }
    //     let currentValueDom = document.getElementsByClassName("current-value");
    //     // 拿到所有 的格子
    //     let allDom = document.getElementsByClassName("custom-day");
    //     for (let index = 0; index < allDom.length; index++) {
    //       const element = allDom[index];
    //       if (souce[index] == 0) {
    //         currentValueDom[index].style.display = "none";
    //       } else {
    //         currentValueDom[index].style.display = "block";
    //         element.innerHTML = souce[index];
    //       }
    //     }
    //     this.getLogData();
    //   }, 0);
    // },

    async getLogData() {
      // 判断当前日期是不是 标准类型
      console.log("this.currentDate", this.currentDate);
      let date = new Date(this.currentDate);
      let params = {
        logsDate: "",
      };
      if (date.getTimezoneOffset() === -480) {
        params.logsDate = dateFormat(new Date(date).getTime(), "yyyy-MM-DD");
      } else {
        // 提示这不是中国标准时间
        this.$message.error("这不是中国标准时间");
      }
      logList(params).then((res) => {
        // console.log("日志列表", res);
        if (res.success && res.data?.length > 0) {
          this.logLists = res.data;
        } else {
          this.logLists = [];
          // this.$message.error("暂无数据");
        }
        console.log("请求日志列", this.logLists);
      });
    },

    details(row, type) {
      console.log("row", row);
      //mine我的模板(初始) todo待办 done已办 wait待发 sent已发 fine办结
      let all_flowdata = this.$getStorage("all_flowdata");
      console.log("all_flowdata", all_flowdata);
      let index = null;
      let count = 0;
      let task = "";
      for (let key in all_flowdata) {
        const element = all_flowdata[key];
        count++;
        if (element.length) {
          for (let j = 0; j < element.length; j++) {
            const item = element[j];
            if (row.id == item.businessId) {
              index = count;
              task = item;
              continue;
            }
          }
        }
      }
      console.log("数据梳理", status[index], task);
      if (task) {
        this.handelShowDialog(row, type ? "wait" : "sent", task);
      }
    },

    //刷新列表数据
    childEvtHandle(data) {
      console.log("childEvtHandle", data);
      this.getTableData();
      this.flowShow = false;
    },

    // 删除日志 方法
    async deleteLog(row) {
      // 只有当前的状态时是未提交 也就是状态时1 并且是本人
      let res = await remove({ id: row.id });
      if (res.success) {
        console.log("删除成功");
        this.getTableData();
      } else {
        // 删除失败
        this.$message.error("删除失败");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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
/deep/ .el-row {
  margin: 0 !important;
}
.bottom-line {
  margin: 10px 0;
  height: 1px;
  background-color: #e5e5ee;
}
.log {
  //height: 750px;
  width: 100%;
  //overflow: auto;
}

/deep/ .el-calendar {
  background-color: transparent;
}
/deep/.el-calendar__body {
  background-color: #fff;
}
/deep/.el-calendar__header {
  justify-content: flex-start;
}
/deep/.el-calendar__title {
  // display: none;
  color: transparent;
  width: 150px;
  position: relative;
}

.picker-month {
  width: 150px;
  z-index: 1000;
}
/deep/ .el-input--small .el-input__inner {
  height: 28px;
  line-height: 28px;
}

.custom-day {
  color: #38b1df;
}
.unit {
  color: #000;
}
/deep/ .el-calendar-table td.is-selected {
  background-color: #38b1df;
  .custom-day,
  .unit {
    color: #fff !important;
  }
}
/deep/ .el-calendar-table td.is-selected:hover {
  background-color: #f2f8fe;
  .custom-day {
    color: #38b1df !important;
  }
  .unit {
    color: #000 !important;
  }
}

.date {
  font-weight: 550;
  color: #000;
}
.logItem {
  border: #e8e8e8 1px solid;
}
</style>

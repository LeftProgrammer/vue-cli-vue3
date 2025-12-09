<template>
  <div class="section-content-page">
    <div class="header"></div>
    <el-row :gutter="20">
      <el-col :span="15" class="position-relative">
        <el-date-picker
          v-model="currentMonth"
          type="month"
          @change="changeMonth"
          value-format="yyyy-MM"
          placeholder="选择月"
          class="picker-month position-absolute top-12"
        >
        </el-date-picker>

        <el-select @visible-change="$visibleChange($event, 'el-popper')"
          style="position: absolute; left: 430px; top: 12px"
          v-model="unitId"
          placeholder="请选择监理单位"
          clearable
          @change="getDefault"
        >
          <el-option
            v-for="item in unitOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <el-calendar v-model="currentDate">
          <template slot="dateCell" slot-scope="{ data }">
            <div
              v-if="isShowDay(data)"
              @click="selectDay(data.day, data)"
              class="flex h-100pre flex-column justify-between"
            >
              <p class="date" :data-date="data.day">
                {{ data.day.split("-")[2] }}
              </p>
              <div style="margin-left: auto" class="current-value">
                <span class="font-30 custom-day mr-10"></span
                ><span class="font-12 font-w-550 mr-10 unit">/份</span>
              </div>
            </div>
          </template>
        </el-calendar>
      </el-col>
      <el-col :span="9" class="content-area">
        <div class="h-53 flex align-center justify-between">
          <div class="font-w-600 timer-div">
            <i class="timer el-icon-time"></i>
            {{ currentDateText }}
          </div>
          <!-- <div
            class="iconfont icon-add poniter"
            @click="handelShowDialog(null, 'mine')"
          ></div> -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >
            新增
          </el-button>
        </div>
        <!-- 日志 -->
        <div class="log">
          <div class="flex" v-if="logLists.length == 0">
            <!-- <el-tooltip
              description="暂无日志"
              :image-size="200"
              class="auto text-center"
            ></el-tooltip> -->
            <el-empty
              description="暂无日志"
              class="auto w-200 text-center"
            ></el-empty>
          </div>

          <div v-else>
            <div
              v-for="item in logLists"
              :key="item.id"
              class="bg-fff rounded-5 px-10 py-20 mb-20 logItem"
            >
              <div class="flex align-center justify-between">
                <div class="font-w-600">
                  {{ item.createUsername }}
                </div>
                <div class="" style="color: #8ad482">
                  <flow-status :row="item" :flowName="flowName"></flow-status>
                </div>
              </div>
              <div class="bottom-line"></div>
              <div class="flex align-center mb-15 justify-start font-14">
                <div class="content-label">班次：</div>
                <div class="content-value">
                  {{ $DictionaryParsing(classs, item.workTime) }}
                </div>
              </div>
              <div class="flex align-center mb-15 justify-start font-14">
                <div class="content-label">施工标段：</div>
                <div class="content-value">
                  {{ getSelectText(sectionOptions, item.section) }}
                </div>
              </div>
              <div class="flex align-center mb-15 justify-start font-14">
                <div class="content-label">工程部位：</div>
                <div class="content-value">{{ item.pbsName }}</div>
              </div>
              <div class="flex align-center mb-15 justify-start font-14">
                <div class="content-label">监理单位：</div>
                <div class="content-value">{{ item.supervisionUnit }}</div>
              </div>
              <div class="bottom-line"></div>
              <div class="opration flex justify-end">
                <flow-button
                  :row="item"
                  :flowName="flowName"
                  @click="handelShowDialog"
                  @delete="deleteLog(item)"
                ></flow-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import { byMonth, remove, logList, sectionList } from "./api";
import { dateFormat } from "@/utils";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import { mapGetters } from "vuex";
import { getDictItemList } from "@/api/dict";

const status = {
  1: "todo",
  2: "done",
  3: "wait",
  4: "sent",
  5: "fine"
};
export default {
  mixins: [FlowListMixin],

  data() {
    return {
      sectionId: "",
      unitId: "",
      currentMonth: "",
      flowShow: false,
      flowInfo: {},
      currentDate: "",
      currentDateText: "",
      logLists: [], //日志列表
      workTime: [],
      sectionOptions: [],
      unitOptions: []
    };
  },
  created() {
    this.getTableData(); //这个是为了冲掉混入里面的tableData请求
    this.getToday();
    this.getClass();
    this.getFlowStatus();
    this.getSectionList();
    this.getUnitOptions();
  },
  // 监听 currentMonth
  watch: {
    currentMonth: {
      handler(newVal) {
        console.log("月份发生变化", newVal);
        this.getLogNum();
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters(["loginInfo"])
  },
  mounted() {
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

    //
  },
  destroyed() {
    localStorage.removeItem("SupervisionLogsDate");
  },
  methods: {
    // 上月 不需要显示
    isShowDay(date) {
      if (date.type === 'current-month') {
        return true
      } else {
        return false
      }
    },
    handleAdd() {
      this.handelShowDialog(null, "mine");
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
    getUnitOptions(){
      this.unitOptions = [];
      logList({}).then((res) => {
        if (res.success) {
          console.log("unitOptions", res.data);
          this.unitOptions = res.data;
        }
      });
    },
    getTableData() {
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },
    // 数据更改重新调用
    getDefault() {
      this.getLogNum();
      this.getToday();
    },
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

    // 获取日志数量
    // getLogNum() {
    //   let params = {
    //     month: this.currentMonth,
    //   };
    //   logList(params).then((res) => {
    //     console.log("日志数量", res);
    //     this.logLists = res.data;
    //   });
    // },
    // 切换月份
    changeMonth(val) {
      // 使默认数据为当月的第一天
      console.log("切换月份", val);
      this.currentDate = val + "-01";
    },
    // 默认进来  设置当前月份  以及当天
    getToday() {
      let supervisionLogsDate = localStorage.getItem("SupervisionLogsDate");
      if (!supervisionLogsDate) {
        supervisionLogsDate = new Date();
      }
      this.currentMonth = dateFormat(supervisionLogsDate, "yyyy-MM");
      let day = dateFormat(supervisionLogsDate, "yyyy-MM-DD");
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
    getLogNum() {
      setTimeout(async () => {
        let first = document.querySelector(".el-calendar-day .date");
        let logsDate = first.getAttribute("data-date");
        let params = {
          logsDate: logsDate,
          supervisionUnit: this.unitId
        };
        console.log("请求日志数量参数", params);
        let res = await byMonth(params);
        let souce = [];
        if (res.success && res.data?.length > 0) {
          souce = res.data;
        } else {
          // this.$message.error("暂无数据");
          return;
        }
        let currentValueDom = document.getElementsByClassName("current-value");
        // 拿到所有 的格子
        let allDom = document.getElementsByClassName("custom-day");
        for (let index = 0; index < allDom.length; index++) {
          const element = allDom[index];
          if (souce[index] == 0) {
            currentValueDom[index].style.display = "none";
          } else {
            currentValueDom[index].style.display = "block";
            element.innerHTML = souce[index];
          }
        }
        this.getLogData();
      }, 0);
    },

    async getLogData() {
      localStorage.setItem("SupervisionLogsDate", this.currentDate);
      // 判断当前日期是不是 标准类型
      console.log("this.currentDate", this.currentDate);
      let date = new Date(this.currentDate);
      let params = {
        logsDate: "",
        supervisionUnit: this.unitId
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
      this.getDefault();
      this.flowShow = false;
    },

    // 删除日志 方法
    async deleteLog(row) {
      // 只有当前的状态时是未提交 也就是状态时1 并且是本人
      let res = await remove({ id: row.id });
      if (res.success) {
        console.log("删除成功");
        this.getDefault();
      } else {
        // 删除失败
        this.$message.error("删除失败");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-row {
  margin: 0 !important;
}

/deep/ th:first-child {
  border-left: 1px solid #ebeef5;
}

/deep/ th:last-child {
  border-right: 1px solid #ebeef5;
}

/deep/ .el-calendar__body {
  padding: 0;
}

/deep/ .el-calendar__header {
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

/deep/ .el-calendar__button-group {
  margin-left: 30px;

  button {
    height: 36px;
  }
}

.content-area {
  background: #f7f8fa;
  border-radius: 4px;
}

.content-label {
  color: #4e5969;
}

.content-value {
  color: #626262;
  font-weight: 550;
}

/deep/ .el-empty__description p {
  height: 45px;
}

.bottom-line {
  margin: 10px 0;
  height: 1px;
  background-color: #e5e5ee;
}

.log {
  max-height: 70vh;
  width: 100%;
  overflow: auto;
}

/deep/ .el-calendar {
  background-color: transparent;
}

/deep/ .el-calendar__body {
  background-color: #fff;
}

/deep/ .el-calendar__header {
  justify-content: flex-start;
}

/deep/ .el-calendar__title {
  // display: none;
  color: transparent;
  width: 150px;
  position: relative;
}

.picker-month {
  width: 150px;
  z-index: 1000;
  margin-left: 20px;
}

/deep/ .el-input--small .el-input__inner {
  height: 28px;
  line-height: 28px;
}

.custom-day {
  color: #000;
}

.unit {
  color: #000;
}

/deep/ .el-calendar-table td.is-today {
  .date {
    border: 1px solid #38b1df;
    border-radius: 50%;
  }
}

/deep/ .el-calendar-table td.is-selected {
  background-color: unset;

  .date {
    background-color: #38b1df;
    border-radius: 50%;
    color: white;
    font-weight: 500;
  }

  .custom-day {
    color: #38b1df;
  }
}

/deep/ .el-calendar-table td.is-selected:hover {
  background-color: #f2f8fe;
}

.unit {
  color: #696969 !important;
}

.date {
  font-weight: 550;
  color: #000;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.logItem {
  border: #e8e8e8 1px solid;
}

/deep/ .el-calendar-table .el-calendar-day {
  height: 10vh;
}

.timer-div {
  display: flex;
  line-height: 25px;
}

.timer {
  width: 25px;
  height: 25px;
  content: url("@/assets/img/timer.png");
}

::v-deep .prev{
  pointer-events: none;
}

::v-deep .next{
  pointer-events: none;
}
</style>

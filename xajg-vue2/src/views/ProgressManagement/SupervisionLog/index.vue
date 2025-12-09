<template>
  <div class="section-content-page">
    <div class="header"></div>
    <el-row :gutter="20">
      <el-col :span="18" class="position-relative">
        <el-date-picker
          v-model="currentMonth"
          type="month"
          @change="changeMonth"
          value-format="yyyy-MM"
          placeholder="选择月"
          class="picker-month position-absolute top-12"
        >
        </el-date-picker>
        <el-calendar v-model="currentDate">
          <template slot="dateCell" slot-scope="{ data }">
            <div
              @click="selectDay(data.day, data)"
              class="flex h-100pre flex-column justify-between"
            >
              <p class="date" :data-date="data.day">
                {{ data.day.split("-")[2] }}
              </p>
              <div style="margin-left: auto" class="current-value">
                <span class="font-30 custom-day mr-10"></span
                ><span class="font-12 font-w-550 mr-10 unit">份</span>
              </div>
            </div>
          </template></el-calendar
        >
      </el-col>
      <el-col :span="6">
        <div class="h-53 flex align-center justify-between">
          <div class="font-w-600">
            {{ currentDateText }}
          </div>
          <div
            class="iconfont icon-add poniter"
            @click="add(), (formDisabled = false)"
          ></div>
        </div>
        <!-- 日志 -->
        <div class="log">
          <div class="flex" v-if="logLists.length == 0">
            <el-tooltip
              description="暂无日志"
              :image-size="200"
              class="auto text-center"
            ></el-tooltip>
          </div>

          <div v-else>
            <div
              v-for="item in logLists"
              :key="item.id"
              class="bg-fff rounded-5 px-10 py-20 mb-20"
            >
              <div class="flex align-center justify-between">
                <div class="font-w-600">{{ item.createUsername }}</div>
                <div class="" style="color: #8ad482">已提交</div>
              </div>
              <div class="bottom-line"></div>
              <div class="flex align-center mb-5 justify-between font-14">
                <div class="">{{ getPbsName(item.pbsCode) }}</div>
                <div class="">
                  {{ $DictionaryParsing(classs, item.workTime) }}
                </div>
              </div>
              <div class="">
                {{ item.supervisionUnit || "***" }}
              </div>
              <div class="bottom-line"></div>
              <div class="opration flex justify-end">
                <div
                  @click="details(item, false), (formDisabled = true)"
                  class="iconfont icon-view text-0096 font-w-600 pointer"
                ></div>
                <div
                  @click="details(item, true), (formDisabled = false)"
                  class="iconfont icon-edit text-0096 font-w-600 mx-10 pointer"
                ></div>
                <el-popconfirm
                  @confirm="deleteLog(item)"
                  title="这是一段内容确定删除吗？"
                >
                  <div
                    slot="reference"
                    class="iconfont icon-delete font-w-600 pointer"
                    style="color: red"
                  ></div>
                </el-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="监理日志"
      ref="dialog"
      :visible.sync="dialogShow"
      @closed="dialogShow = false"
    >
      <tableForm
        :formDisabled="formDisabled"
        ref="tableForm"
        class=""
      ></tableForm>
      <div slot="footer" class="dialog-footer flex justify-end">
        <span>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { byMonth, remove, logList, save } from "./api";
import { dateFormat } from "@/utils";
import tableForm from "./tableForm";
import { mapGetters } from "vuex";
import { getDictItemList } from "@/api/dict";

const status = {
  1: "todo",
  2: "done",
  3: "wait",
  4: "sent",
  5: "fine",
};
export default {
  components: { tableForm },
  data() {
    return {
      formDisabled: false, //禁用表单
      currentMonth: "",
      dialogShow: false,
      flowInfo: {},
      currentDate: "",
      currentDateText: "",
      logLists: [], //日志列表
      workTime: [],
    };
  },
  created() {
    this.getClass();
    this.getToday();
  },
  // 监听 currentMonth
  watch: {
    currentMonth: {
      handler(newVal) {
        console.log("月份发生变化", newVal);
        this.getLogNum();
      },
      deep: true,
    },
  },

  computed: {
    ...mapGetters(["loginInfo"]),
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
  methods: {
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
    getLogNum() {
      let params = {
        month: this.currentMonth,
      };
      logList(params).then((res) => {
        console.log("日志数量", res);
        this.logLists = res.data;
      });
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
    getLogNum() {
      setTimeout(async () => {
        let first = document.querySelector(".el-calendar-day .date");
        let logsDate = first.getAttribute("data-date");
        let params = {
          logsDate,
        };
        console.log("请求日志数量参数", params);
        let res = await byMonth(params);
        let souce = [];
        if (res.success && res.data?.length > 0) {
          souce = res.data;
        } else {
          this.$message.error("暂无数据");
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

    add() {
      // 控制弹窗
      this.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.tableForm.add();
      });
    },

    details(row) {
      // 控制弹窗
      this.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.tableForm.edit(row);
      });
    },

    // 删除日志 方法
    async deleteLog(row) {
      debugger;
      // 只有当前的状态时是未提交 也就是状态时1 并且是本人
      if (row.flowStatus == 1) {
        if (row.createUser != this.$getStorage("userInfo").userId) {
          this.$message.error("只有本人才能删除日志");
          return;
        }
      } else {
        this.$message.warning("当前流程状态下不能删除");
        return;
      }
      let res = await remove({ id: row.id });
      if (res.success) {
        console.log("删除成功");
        this.getDefault();
      } else {
        // 删除失败
        this.$message.error("删除失败");
      }
    },

    /*接收到父级的消息处理完后返回给父级*/
    save() {
      // 获取table的数据
      // 校验表单
      let ok = this.$refs.tableForm.checkForm();
      console.log("ok", ok);
      if (!ok) return;
      let data = this.$refs.tableForm.formData;
      console.log("保存字段", data);
      save(data)
        .then((res) => {
          const { success, message, data } = res;
          console.log("保存成功", res);
          if (success) {
            console.log("保存成功", res);
            this.$message.success("新增成功");
            this.getDefault();
          } else {
            this.$message.error("新增失败：" + message);
          }
          this.dialogShow = false;
        })
        .catch((err) => {
          this.dialogShow = false;
          this.$message.error("新增失败");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-row {
  margin: 0 !important;
}
.bottom-line {
  margin: 10px 0;
  height: 1px;
  background-color: #e5e5ee;
}
.log {
  height: 750px;
  width: 100%;
  overflow: auto;
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

.date {
  font-weight: 550;
  color: #000;
}
</style>

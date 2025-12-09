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
                   style="position: absolute;left: 430px;top: 12px;"
                   v-model="sectionId"
                   placeholder="请选择标段"
                   clearable
                   @change="getLogNum"
        >
          <el-option
            v-for="item in sectionOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
            <icon class="timer"></icon>
            {{ currentDateText }}
          </div>
          <!-- <div
            class="iconfont icon-add poniter"
            @click="handelShowDialog(null, 'mine')"
          ></div> -->
          <el-button
            type="primary"
            :disabled="isSystem"
            icon="el-icon-plus"
            @click="addHandle(), (type = 'add')"
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
                  {{ getProjectName(item.belongProjectId) }}
                </div>
              </div>
              <div class="bottom-line"></div>
              <div class="flex flex-wrap">
                <div v-if="isShowFiled(item,'DSKW')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">洞身开挖(m)：</div>
                  <div class="content-value">
                    {{ getTotal(item,'dskw') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'DSZH')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">洞身支护(m)：</div>
                  <div class="content-value">
                    {{ getTotal(item,'dszh') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'DSCC')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">洞身衬砌(m)：</div>
                  <div class="content-value">
                    {{ getTotal(item,'dscc') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'DDWYJ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">多点位移计（套）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'ddwyj') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'MGYLJ_T')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">锚杆应力计(套)：</div>
                  <div class="content-value">
                    {{ getTotal(item,'mgyljT') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'TSFKW')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">土石方开挖（m³）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'tsfkw') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'BPZH_MG')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">边坡支护-锚杆（根）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'bpzhMg') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'BPZH_MGS')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">边坡支护-锚杆束（束）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'bpzhMgs') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'BPZH_MS')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">边坡支护-锚索（束)：</div>
                  <div class="content-value">
                    {{ getTotal(item,'bpzhMs') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'LMDCJYJLM')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">路面垫层及永久路面（m）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'lmdcjyjlm') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'ECCC')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">二次衬砌（m）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'eccc') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'QBQW')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">清表清危（m³）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'qbqw') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'ZDW')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">主动网（m²）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'zdw') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'BDW')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">被动网（m）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'bdw') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'MG')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">锚杆（根）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'mg') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'MGS')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">锚杆束（束）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'mgs') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'MS')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">锚索（束）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'ms') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'WXZ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">微芯桩（套）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'wxz') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'GNSS')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">GNSS（套）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'gnss') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'MGYLJ_Z')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">锚杆应力计（支）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'mgyljZ') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'MSCLJ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">锚索测力计（支）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'msclj') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'ZJKW')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">桩基开挖（m）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'zjkw') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'ZJJZ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">桩基浇筑（m）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'zjjz') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'QTJZ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">桥台浇筑（m³）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'qtjz') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'JJDJZ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">交界墩浇筑（m）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'jjdjz') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'GJGZZ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">钢结构制作（吨）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'gjgzz') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'GXBZ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">空心板制（块）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'gxbz') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'GZJZ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">拱座浇筑（m³）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'gzjz') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'TFKW')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">土方开挖（m³）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'tfkw') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'ZJSG')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">桩基施工（m）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'zjsg') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'ZTJGHNT')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">主体结构混凝土（m³）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'ztjghnt') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'ECJGQZ')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">二次结构砌筑（m³）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'ecjgqz') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'JGGC')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">机电工程（%）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'jggc') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'ZXGC')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">装修工程（%）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'zxgc') }}
                  </div>
                </div>

                <div v-if="isShowFiled(item,'YLGC')" class="flex align-center mb-15 justify-start font-14 w-50pre">
                  <div class="content-label">园林工程（%）：</div>
                  <div class="content-value">
                    {{ getTotal(item,'ylgc') }}
                  </div>
                </div>

              </div>
              <div class="bottom-line"></div>
              <div class="opration flex justify-end">
                <list-button
                  :data="item"
                  @delete="deleteHandle"
                  @view="view"
                  @edit="edit"
                ></list-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <dataform
      :type="type"
      :title="title"
      :selectDateStr="dateFormat(currentDate, 'yyyy-MM-DD')"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="oprateRow.dialogShow = false"
      @ok="getLogNum"
    >
    </dataform>
  </div>
</template>

<script>
import { byMonth, remove, logList, sectionList } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import { mapGetters } from "vuex";
import { getDictItemList } from "@/api/dict";
import dataform from './dataform.vue';
import { getConfigureList } from '@/views/progressImage/designQuantities/api';

const status = {
  1: "todo",
  2: "done",
  3: "wait",
  4: "sent",
  5: "fine"
};
export default {
  components: { dataform },
  mixins: [ListMixin],

  data() {
    return {
      type: "",
      title: "实际工程量",
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
      projectOptions: [],
      oprateRow: {},
      unitOptions: []
    };
  },
  async created() {
    await this.getProject();

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
  methods: {
    dateFormat,
    getTotal(row, filed) {
      let total = 0;
      row.detailList.forEach(item => total += Number(item[filed] ? item[filed] : 0))
      return total;
    },
    isShowFiled(row, field){
      let project = this.projectOptions.find(item=>item.id==row.belongProjectId)
      return project?.quantityTarget?.split(",").includes(field);
    },
    async getProject() {
      const { data } = await getConfigureList();
      this.projectOptions = data
    },
    getProjectName(id){
      let project = this.projectOptions.find(item=>item.id==id)
      return project?project.belongProject:'';
    },
    // 上月 不需要显示
    isShowDay(date) {
      if (date.type === 'current-month') {
        return true
      } else {
        return false
      }
    },
    /**新增 */
    addHandle() {
      this.title = "新增-进度填报";
      // if (this.query.unitId == null) {
      //   this.$message.warning("请选择左侧单位");
      //   return;
      // }
      this.oprateRow.data = null;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    edit(row) {
      this.type = "edit";
      this.title = "编辑-进度填报";
    },
    view(row) {
      this.type = "view";
      this.title = "查看-进度填报";
    },
    /** 删除*/
    deleteHandle(row) {
      remove({
        id: row.id,
      }).then((res) => {
        if (!res.success) {
          return this.$message.error("删除失败：" + res.message);
        }
        this.$message.success("删除成功");
        this.getLogNum();
      });
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
      this.currentMonth = dateFormat(new Date(), "yyyy-MM");
      let day = dateFormat(new Date(), "yyyy-MM-DD");
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
        let constructionDate = first.getAttribute("data-date");
        let params = {
          constructionDate: constructionDate,
          sectionId: this.sectionId
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
      // 判断当前日期是不是 标准类型
      console.log("this.currentDate", this.currentDate);
      let date = new Date(this.currentDate);
      let params = {
        constructionDate: "",
        sectionId: this.sectionId
      };
      if (date.getTimezoneOffset() === -480) {
        params.constructionDate = dateFormat(new Date(date).getTime(), "yyyy-MM-DD");
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

.w-50pre{
  width: 50%;
}
</style>

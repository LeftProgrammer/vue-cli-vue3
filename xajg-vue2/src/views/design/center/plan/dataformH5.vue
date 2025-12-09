<template>
  <div class="page-leave apph5-parent">
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="60px"
        :disabled="readonly"
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="计划月度" prop="month">
              <el-date-picker
                v-model="formData.month"
                type="month"
                placeholder="选择月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入计划名称"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划开始日期" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="选择开始日期"
                :picker-options="startDatePickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划结束日期" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                placeholder="选择结束日期"
                :picker-options="endDatePickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业主单位文秘" prop="secretary">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                v-model="formData.secretary"
                class="w-100pre"
              >
                <el-option
                  :label="item.realName"
                  :value="item.userId"
                  v-for="(item, index) in secretaryList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="uploadFile">
              <uploadFile :readonly="readonly" v-model="formData.uploadFile">
              </uploadFile>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>计划任务项列表</div>
      <el-divider></el-divider>
      <el-form ref="dataFormtable">
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          :span-method="arraySpanMethod"
        >
          <el-table-column
            label="序号"
            width="80"
            align="center"
            prop="sortNum"
          >
            <template slot-scope="{ row }">
              <span v-show="row.isClassify === true">{{ row.sortNum }}</span>
              <el-input
                v-show="row.isClassify !== true"
                v-model="row.sortNum"
                placeholder="请输入序号"
                :disabled="true"
                readonly
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            class-name="taskname"
            label="任务项名称"
            width="200"
            prop="taskName"
            align="center"
          >
            <template slot-scope="{ row }">
              <span v-show="row.isClassify === true">{{ row.taskName }}</span>
              <el-form-item :error="row.error">
                <el-input
                  class="custom-rule"
                  type="textarea"
                  :rows="1"
                  placeholder="请输入任务项名称"
                  v-show="row.isClassify !== true"
                  v-model="row.taskName"
                  :disabled="readonly"
                  maxlength="150"
                  show-word-limit
                  @blur="tableParValueChange(row)"
                  :autosize="{ minRows: 1, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="专业"
            prop="profession"
            align="center"
            width="130"
          >
            <template slot-scope="{ row }">
              <span v-if="ishowselect(row)">
                <span v-show="row.isClassify === true">{{
                  row.profession
                }}</span>
                <el-select
                  @visible-change="$visibleChange($event, 'el-popper')"
                  ref="professionRef"
                  v-show="row.isClassify !== true"
                  v-model="row.profession"
                  placeholder="请选择专业"
                  clearable
                  :disabled="readonly"
                >
                  <el-option
                    v-for="item in designProfessionOptions"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            class-name="taskname"
            label="计划供应日期"
            prop="planStartDate"
            align="center"
            width="160"
          >
            <template slot-scope="{ row }">
              <span v-if="ishowselect(row)">
                <span v-show="row.isClassify === true">
                  {{
                    row.planTime ? timeFormat(row.planTime, "YYYY-MM-DD") : ""
                  }}
                </span>
                <el-form-item :error="row.dateError">
                  <el-date-picker
                    class="custom-rule"
                    placeholder="请选择"
                    v-show="row.isClassify !== true"
                    v-model="row.planTime"
                    :disabled="readonly || isCanchooseDate"
                    style="width: 140px"
                    :picker-options="getPickerOptions(row)"
                    @blur="tableParValueChange(row)"
                  >
                  </el-date-picker>
                </el-form-item>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="工程部位" prop="projectPbs" width="280" align="center">
            <template slot-scope="{ row }">
              <span v-if="ishowselect(row)">
                <span v-show="row.isClassify === true">
                  {{ row.projectPbsName }}
                </span>
                <el-form-item :error="row.pbsError">
                  <pbs-select
                    v-show="row.isClassify !== true"
                    v-model="row.projectPbs"
                    :readonly="readonly"
                    @change="tableParValueChange(row)"
                  ></pbs-select>
                </el-form-item>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="负责人" prop="charge" width="200" align="center">
            <template slot-scope="scope">
              <span v-if="ishowselect(scope.row)">
                <span v-show="scope.row.isClassify === true">
                  {{ scope.row.charge }}
                </span>
                <user
                  v-show="scope.row.isClassify !== true"
                  v-model="scope.row.charge"
                  :multiple="false"
                  :readonly="readonly"
                ></user>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否为现场需解决事项"
            prop="bIsScene"
            align="center"
            width="90"
          >
            <template slot-scope="scope">
              <span v-if="ishowselect(scope.row)">
                <span v-show="scope.row.isClassify === true">
                  {{ scope.row.bIsScene }}
                </span>
                <el-checkbox
                  v-show="scope.row.isClassify !== true"
                  :checked="scope.row.bIsScene"
                  @change="(val) => bIsSceneChangeHandle(val, scope)"
                  :disabled="readonly"
                ></el-checkbox>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="100" align="center">
            <template slot-scope="{ row }">
              <span v-if="ishowselect(row)">
                <span v-show="row.isClassify === true">{{ row.remark }}</span>
                <el-input
                  type="textarea"
                  :rows="1"
                  placeholder="请输入备注"
                  v-show="row.isClassify !== true"
                  v-model="row.remark"
                  :disabled="readonly"
                  maxlength="20"
                  show-word-limit
                  :autosize="{ minRows: 1, maxRows: 6 }"
                ></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="250" align="center">
            <template slot-scope="scope">
              <!-- <el-button
              type="text"
              @click="handelAdd2(scope.$index, scope.row, tableData)"
              :disabled="readonly"
            >
              新增下级分类
            </el-button> -->
              <el-button
                type="text"
                v-if="ishowClass(scope.row)"
                @click="handelAdd(scope.$index, scope.row, tableData, 'class')"
                :disabled="readonly"
              >
                新增下级分类
              </el-button>
              <el-button
                v-if="ishowTask(scope.row)"
                type="text"
                @click="handelAdd(scope.$index, scope.row, tableData, 'task')"
                :disabled="readonly"
              >
                新增下级任务
              </el-button>
              <el-button
                @click.native.prevent="
                  deleteRow(scope.$index, tableData, 'task')
                "
                type="text"
                size="small"
                :class="deleteRed ? '' : 'el-delete'"
                :disabled="
                  readonly ||
                  scope.row.id === '0' ||
                  (scope.row.children && scope.row.children.length > 0)
                "
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-row>
    <user-select
      :show.sync="personDialog.show"
      :users="personDialog.selection"
      @user-checked="getUsers"
    />
  </div>
</template>

<script>
import { list, save } from "./api";
import { dateFormat } from "@/utils";
import UserSelect from "@/components/newUserSelect/index.vue";
import PbsSelect from "@/components/PbsSelect/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { numberParseChina } from "@/utils/math";
import { getId } from "@/api/common";
import { unitList } from "../drawingSend/components/api";
import { getSecretary } from "../../../../components/UniTable/api";

export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    UserSelect,
    PbsSelect,
  },
  data() {
    return {
      addAble: true,
      options: [],
      //月度计划列表
      tableData: [],
      query: {
        applyUser: "",
        applyDate: "",
        pageSize: 20,
        current: 1,
        total: 0,
      },
      showDialog: false,
      formData: {
        id: null,
        deleteStatus: 0,
        uploadFile: "[]",
      },
      orignDate: "",
      formDataRules: {
        startDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        endDate: [{ required: true, message: "请选择日期", trigger: "change" }],
        month: [{ validator: this.validFile, required: true }],
        name: [{ required: true, message: "请填写计划名称", trigger: "blur" }],
        secretary: [
          { required: true, message: "请选择业主单位文秘", trigger: "change" },
        ],
      },

      /**表单是否只读 */
      readonly: false,

      /**人员选择 */
      personDialog: {
        selection: [],
        show: false,
      },
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },

      //当前选择行
      curRow: null,

      /**组织机构选择 */
      deptShow: false,
      /**岗位 */
      dutyOptions: [],
      /**请假类型 */
      leaveCategoryOptions: [],
      /**分类类型 */
      designClassifyOptions: [],
      /**设计分类类型字典code */
      designClassifyCode: "DESIGN_CLASSIFY",
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      businessId: "",
      pacId: "",

      /**接口地址：对应list接口 */
      url: {
        list: "/api/design/plan/page",
        // list: "/api/design/plan/list",
      },
      specialDate: new Date("2023-09-15"), // 传入的特殊日期
      monthList: [],
      secretaryList: [],
    };
  },
  mounted() {
    this.getMonthList();
  },
  computed: {
    deleteRed() {
      let bool = false;
      //新增
      if (this.readonly) {
        bool = true;
      }
      return bool;
    },
    isCanchooseDate() {
      // 如果开始时间 结束时间都有值 就返回true 否则返回false
      return this.formData.startDate && this.formData.endDate ? false : true;
    },
    startDatePickerOptions() {
      return {
        disabledDate: (date) => {
          // 在这个函数中定义日期的限制逻辑，使用this.specialDate来访问父组件传入的特殊日期
          if (this.formData?.endDate) {
            return date > this.formData.endDate;
          } else {
            return false;
          }
        },
      };
    },
    endDatePickerOptions() {
      return {
        disabledDate: (date) => {
          // 在这个函数中定义日期的限制逻辑，使用this.specialDate来访问父组件传入的特殊日期
          if (this.formData?.startDate) {
            return date < this.formData.startDate;
          } else {
            return false;
          }
        },
      };
    },
  },
  created() {
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    // console.log("this.$route", JSON.stringify(this.$route.query.fromappform));
    this.getSecretaryList();
    // 来自app
    this.$nextTick(() => {
      // appUrlList 只要是app 就一定会传递这个参数
      if (this.fromapp) {
        //this.appformDisabled = true;
        // const titleElement = document.getElementById("dynamicTitle");
        // // 设置动态标题
        // titleElement.textContent = "详情";
        if (this.$route.query.businessId) {
          this.getDataById(this.$route.query.businessId);
          this.readonly = true;
        }
      }
    });
  },
  methods: {
    // 通过 id 获取当前数据
    getDataById(id) {
      let params = {
        id: id,
      };
      list(params).then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          this.setFormData(res.data[0]);
        }
      });
    },
    validFile(rule, value, callback) {
      if (value && this.monthList != []) {
        let date = new Date(value);
        let a = this.monthList.find((x) => x == date.getTime());
        console.log("yuefen", a, this.orignDate);
        if (a == this.orignDate) {
          callback();
          return;
        } else {
          if (this.formData.flowStatus == 1 && this.formData.flowStatus == 2) {
            callback();
          } else {
            if (a) {
              callback(new Error("计划月度重复,请重新选择"));
            } else {
              callback();
            }
          }
        }
      } else {
        callback(new Error("请选择计划月度"));
      }
    },

    /*
     * 获取月份数据
     */
    getMonthList() {
      let params = {
        deleteStatus: 0,
      };
      list(params).then((data) => {
        if (data) {
          let planList = data.data;
          let result = [];
          planList.forEach((plan) => {
            result.push(plan?.month);
          });
          this.monthList = result;
          console.log("获取月份数据", result);
        } else {
          //新增时
          console.log("月份数据获取失败");
        }
      });
    },

    getPickerOptions(row) {
      return {
        disabledDate: (date) => {
          // 在这个函数中定义日期的限制逻辑，使用传入的特殊日期
          return date < this.formData.startDate || date > this.formData.endDate;
        },
      };
    },
    changeDate(value) {
      console.log("计划开始时间  结束之间是否填写", value);
    },

    // 是否展示 选项
    ishowselect(row) {
      let bool = true;
      // 判断row 是不是又type 属性，没有就返回false
      if (row.hasOwnProperty("type")) {
        if (row.type == "class") {
          bool = false;
        } else {
          bool = true;
        }
      } else {
        bool = false;
      }
      return bool;
    },
    // 是否展示分类按钮
    ishowClass(row) {
      let bool = true;
      if (row.hasOwnProperty("type")) {
        if (row.type == "class") {
          bool = true;
        } else {
          bool = false;
        }
      } else {
        bool = true;
      }
      return bool;
    },
    ishowTask(row) {
      let bool = true;
      // 判断row 是不是又type 属性，没有就返回false
      if (row.hasOwnProperty("type")) {
        if (row.type == "class") {
          bool = true;
        } else {
          bool = false;
        }
      } else {
        bool = true;
      }
      return bool;
    },
    //table 校验
    tableParValueChange(row) {
      if (row.taskName && row.taskName !== "") {
        console.log("通过");
        this.$set(row, "error", "");
      } else {
        console.log("不通过");
        this.$set(row, "error", "任务名称不能为空");
      }
      if (row.planTime && row.planTime !== "") {
        console.log("通过");
        this.$set(row, "dateError", "");
      } else {
        console.log("不通过");
        this.$set(row, "dateError", "计划供应日期不能为空");
      }
      if (row.projectPbs && row.projectPbs !== "") {
        console.log("通过");
        this.$set(row, "pbsError", "");
      } else {
        console.log("不通过");
        this.$set(row, "pbsError", "工程部位不能为空");
      }
    },
    /**选择是否现场需求 */
    bIsSceneChangeHandle(checked, scope) {
      scope.row.bIsScene = checked;
      scope.row.isScene = checked ? 1 : 0;
    },
    /** 人员选择回调*/
    getUsers(data) {
      // this.formData.applyUserId = data.valueText || "";
      // this.formData.applyUser = data.text || "";
      //更新子表
      if (this.curRow) {
        this.curRow.charge = data.valueText || "";
        this.curRow.chargeName = data.text || "";
      }
      console.log("this.curRow", this.curRow, data);
      this.$set(this.tableData, this.curRow.$index, { ...this.curRow });
      // this.$forceUpdate();
    },
    /** 选择人员点击*/
    showPerson(row, index) {
      if (this.readonly) {
        return;
      }
      this.personDialog.selection = row.charge ? [row.charge] : [];
      if (row.isScene) {
        row.bIsScene = true;
      } else {
        row.bIsScene = false;
      }
      row.$index = index;
      this.curRow = row;
      this.personDialog.show = true;
    },
    /** 选择人员清空时*/
    clearEvt(row, type) {
      if (type === "person") {
        row.charge = "";
        row.chargeName = "";
      }
      if (type === "pbs") {
        row.projectPbs = "";
        row.projectPbsName = "";
      }
      console.log("clearEvt", row, type);
    },

    /** 选择PBS */
    showPbs(row, index) {
      if (this.readonly) {
        return;
      }
      this.pbsDialog.selection = row.projectPbs ? [row.projectPbs] : [];
      row["$index"] = index;
      this.curRow = row;
      this.pbsDialog.show = true;
    },

    /**列表行合并 */
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.isClassify) {
        if (columnIndex === 0 || columnIndex === 8) {
          return [1, 1];
        } else if (columnIndex === 1) {
          return [1, 7];
        } else {
          return [0, 0];
        }
      }
    },

    /**
     * 获取表单数据
     */
    getFormData() {
      this.getFlowRow().then((row) => {
        console.log("获取表单数据", row);
        this.setFormData(row);
      });
    },
    setFormData(row) {
      if (row) {
        this.orignDate = row.month;
        this.formData = row;
        // this.addAble = false; //新增标识
        let detailList = this.formData.designPlanDetailList;
        this.getDictItemList(this.designClassifyCode, () => {
          this.getSubTableData(row.id, detailList);
        });
      } else {
        //新增时
        this.getDictItemList(this.designClassifyCode, () => {
          this.getSubTableData(this.businessId);
        });
      }
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate();
      });
    },
    /**获取子表数据 */
    getSubTableData(businessId, detailList) {
      let tableData = [];
      // console.log("this.designClassifyOptions", this.designClassifyOptions);
      // console.log("numberParseChina", numberParseChina);
      for (let i = 0; i < this.designClassifyOptions.length; i++) {
        const option = this.designClassifyOptions[i];
        let row = {
          id: "0",
          pid: "0",
          taskName: option.dictName,
          sortNum: numberParseChina(i),
          baseId: businessId,
          classify: option.dictCode,
          classifyName: option.dictName,
          isScene: 0,
          bIsScene: false,
          isClassify: true,
        };
        if (detailList && detailList.length > 0) {
          let curDetailList = detailList.filter(
            (x) => x.classify === option.dictCode
          );
          for (let i = 0; i < curDetailList.length; i++) {
            let child = curDetailList[i];
            child.isClassify = false;
            child.children = this.computeChildren(child.id, detailList);
          }
          //计算children
          row.children = curDetailList.filter((x) => x.pid === "0");
          tableData.push(row);
          tableData.push(...curDetailList);
        } else {
          tableData.push(row);
        }
      }
      console.log("tableData", tableData);
      this.tableData = tableData;
    },
    //计算children
    computeChildren(pid, detailList) {
      let children = detailList.filter((x) => x.pid === pid);
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        child.isClassify = false;
        child.children = this.computeChildren(child.id, detailList);
      }
      return children;
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback, event) {
      console.log("save fields", fields);
      let detailList = fields.designPlanDetailList;
      const isMaintenance = event.data.btnKey === "maintenance";
      if (detailList && detailList.length > 0) {
        fields.designPlanDetailList = detailList.map((x) => {
          x.isScene = x.bIsScene ? 1 : 0;
          return x;
        });
      }
      //  校验table表格
      // 获取所有得 类名为custom-rule的 输入框 然后看里面的error是否为空

      console.log("tableData", this.tableData);
      let isok = true;
      this.tableData.forEach((item, index) => {
        if (item.pid == 0 && item.id == 0) {
        } else {
          console.log("item", item.taskName);
          if (!item.taskName) {
            isok = false;
            this.$set(item, "error", "任务名称不能为空");
          }
          if (item.type === "task") {
            if (!item.planTime) {
              isok = false;
              this.$set(item, "dateError", "计划供应日期不能为空");
            }
          }
          if (item.type === "task") {
            if (!item.projectPbs) {
              isok = false;
              this.$set(item, "pbsError", "工程部位不能为空");
            }
          }
        }
      });
      console.log("isok", isok);
      //做业务数据的保存,修改。
      if (!isok) return;
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: 'maintenance'
          },
          event.origin
        );
        return
      }
      save(fields)
        .then((res) => {
          const { success, message, data } = res;

          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            // this.$message.success("新增成功");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designClassifyCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designClassifyOptions = items;
            callback && callback();
          });
        } else {
          callback && callback();
        }
      }

      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designProfessionOptions = items;
            // console.log("DESIGN_PROFESSION", items);
          });
        } else {
        }
      }
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**新增下级分类 */
    /**新增下级 */
    handelAdd(index, row, rows, type) {
      //新增任务 之前必须要先选时间 不然  会出现bug
      if (!this.formData.startDate || !this.formData.endDate) {
        this.$message.warning("请选择计划开始、截至时间");
        return;
      }
      console.log("handelAdd", row);
      //记录子级元素个数
      let i = index;
      if (row.children && row.children.length > 0) {
        let childs = rows.filter((x) => {
          if (row.isClassify === true) {
            if (row.classify === x.classify) {
              return true;
            }
          } else {
            if (x.isClassify === true) {
              return false;
            }
            if (row.classify !== x.classify) {
              return false;
            }
            if (x.sortNum.indexOf(row.sortNum) === 0) {
              return true;
            }
          }
          return false;
        });
        i += childs.length;
      } else {
        i += 1;
        row.children = [];
      }
      //计算序号
      let sortNum = this.getSortNum(row);
      getId()
        .then((res) => {
          if (res.success) {
            let newId = res.data;
            let newRow = {
              id: newId,
              pid: row.id,
              taskName: "",
              sortNum: sortNum,
              baseId: row.baseId,
              classify: row.classify,
              classifyName: row.classifyName,
              isClassify: false,
              type: type,
              planTime: "",
            };
            row.children.push(newRow);
            rows.splice(i, 0, newRow);
            console.log("handelAdd", index, this.tableData, row);
            this.$set(this.tableData, index, { ...row });
            this.$forceUpdate();
          } else {
            console.error("获取唯一id异常");
          }
        })
        .catch((err) => {
          console.error("获取唯一ID异常");
        });
    },
    getSortNum(row, type = "add") {
      //计算序号
      let sortNum = "1";
      let count = 0;
      if (row.children && row.children.length) {
        count = row.children.length;
      }
      if (row.isClassify === false) {
        if (row.sortNum) {
          sortNum = row.sortNum + "." + (count + 1);
        }
      } else {
        sortNum = (count + 1).toString();
      }
      return sortNum;
    },
    /**删除子级 */
    async deleteRow(index, rows) {
      console.log("deleteRow", index, rows);
      let _rows = [...rows];
      try {
        let row = rows[index];
        if (row && row.children && row.children.length > 0) {
          this.$message("当前节点存在子级，无法删除！");
          return;
        }
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        //父级的children删除数据
        for (let i = 0; i < rows.length; i++) {
          const item = rows[i];
          if (item.id === row.pid && item.children) {
            for (let j = 0; j < item.children.length; j++) {
              item.children.splice(j, 1);
              if (item.children.length === 0) {
                //父节点更新，刷新 删除 按钮的可点击状态
                this.$set(this.tableData, i, {
                  ...item,
                });
              }
              break;
            }
          }
        }

        //删除数据
        rows.splice(index, 1);

        let sortNumArrs = row.sortNum.split(".");
        let sortNumLen = sortNumArrs.length;
        //更新后续行数据的序号
        for (let i = 0; i < rows.length; i++) {
          const _row = rows[i];
          //如果是其它分类的 跳过，当前分类前面的行 跳过
          if (
            (_row.classify === row.classify && i < index) ||
            _row.classify != row.classify
          ) {
            continue;
          }
          //如果是不同级别，高级别的数据的序号，将不更新
          let _sortNumArrs = _row.sortNum.split(".");
          let _sortNumLen = _sortNumArrs.length;
          if (_sortNumLen < sortNumLen) {
            continue;
          }
          // if (row.pid !== _row.pid) {
          //   continue;
          // }

          console.log("_row", _row, i, _row.sortNum);
          //更新序号，只有最底级的任务是可以删除的，肯定是同级别的序号
          const preRow = rows[i - 1];
          let preSortNumArrs = [];
          //如果前一个是顶级分类
          if (!preRow.isClassify) {
            preSortNumArrs = preRow.sortNum.split(".");
          }

          let preSortNumLen = preSortNumArrs.length;
          //前一个是后一个父级
          if (preRow.id === _row.pid) {
            // _row.sortNum = preRow.sortNum + ".1";
            _sortNumArrs = [...preSortNumArrs, "1"];
          } else if (preSortNumLen > _sortNumLen) {
            //前一个是后一个下一级（侄子级别）
            _sortNumArrs[_sortNumLen - 1] =
              parseInt(preSortNumArrs[_sortNumLen - 1]) + 1;
          } else {
            //同级别
            for (let index = 0; index < _sortNumLen; index++) {
              if (index < _sortNumLen - 1) {
                _sortNumArrs[index] = preSortNumArrs[index];
              } else {
                _sortNumArrs[index] = parseInt(preSortNumArrs[index]) + 1;
              }
            }
          }
          _row.sortNum = _sortNumArrs.join(".");
          console.log("_row", _row, i, _row.sortNum);
        }
      } catch (e) {
        console.error(e);
      }
    },
    handelShowDialog() {
      this.showDialog = true;
    },
    //获取管理局文秘
    getSecretaryList() {
      this.secretaryList = [];
      unitList()
        .then((result) => {
          const { data, success } = result;
          if (!success) {
            this.$message.error("获取单位列表失败");
          }
          let unitList = data
            .filter((item) => {
              return item.corpLeaf !== 0 && item.corpType == "yzdw";
            })
            .sort((a, b) => {
              return a.corpSort - b.corpSort;
            });
          if (unitList.length == 1) {
            let unit = unitList[0];
            let params = {
              corpId: unit.corpId,
              roleName: "文秘",
            };
            getSecretary(params).then((res) => {
              const { data, success } = res;
              if (!success) {
                this.$message.error("获取业主单位文秘失败");
              } else {
                this.secretaryList = data;
              }
            });
          } else {
            this.$message.error("获取单位列表失败");
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    beforeSubmit() {
      let res = true;
      let extData = {};
      if (this.formData.secretary) {
        extData["yzdwwm"] = {
          type: "user",
          value: this.formData.secretary,
        };
      }
      this.sendFlowJson = extData;
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    },
  },
  watch: {
    tableData: {
      handler() {
        if (this.tableData && this.tableData.length) {
          this.formData.designPlanDetailList = this.tableData
            .filter((x) => x.isClassify === false)
            .map((x) => {
              x.bIsScene = x.isScene ? true : false;
              return x;
            });
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px !important;

  .table {
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

::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}

.el-delete {
  color: red;
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;

    .el-input__count {
      height: 25px;
      line-height: 25px;
      bottom: 3px;
      // background: transparent;
      // bottom: -3px;
    }
  }
}

/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
}

/deep/ .el-button .is-disabled {
  background-color: transparent !important;
}

::v-deep .el-textarea .el-input__count {
  color: #909399;
  background: #fff;
  position: absolute;
  font-size: 12px;
  bottom: 7px;
  right: 10px;
  height: 24px;
  overflow: hidden;
}
</style>

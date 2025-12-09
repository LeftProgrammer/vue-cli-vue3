<template>
  <div class="page-leave">
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
        label-width="160px"
        :disabled="readonly"
      >
        <el-col :span="12">
          <el-form-item label="计划月度:" prop="month">
            <el-date-picker
              @change="getPlanListByMonth"
              v-model="formData.month"
              type="month"
              placeholder="选择月"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划名称:" prop="name">
            <el-input
              disabled
              v-model="formData.name"
              placeholder="请输入计划名称"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="修改理由:" size="mini" prop="remark">
            <el-input
              v-model="formData.remark"
              maxlength="100"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 6 }"
              type="textarea"
              placeholder="请输入"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="业主单位文秘:" prop="secretary">
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
      </el-form>
    </el-row>
    <el-row>
      <div style="display: flex; justify-content: space-between">
        <div>计划任务项列表</div>
        <el-button
          v-if="!readonly"
          type="primary"
          icon="el-icon-plus"
          @click="addTask"
        >
          新增任务
        </el-button>
      </div>
      <el-divider></el-divider>
    </el-row>
    <el-form ref="dataFormtable">
      <el-row class="table">
        <el-table ref="multipleTable" border :data="tableData">
          <el-table-column
            label="分类"
            prop="classify"
            align="center"
            width="150"
            class="custom-column"
          >
            <template slot-scope="{ row }">
              <span v-if="row.show">{{
                  $DictionaryParsing(designClassifyOptions, row.classify)
                }}</span>
              <el-form-item
                :error="row.classifyerror"
                v-else
                class="custom-select"
              >
                <el-select
                  @visible-change="$visibleChange($event, 'el-popper')"
                  class="w-100pre"
                  v-model="row.classify"
                  placeholder="请选择"
                  clearable
                  :disabled="readonly"
                  @change="changeDesignClassify(row)"
                >
                  <el-option
                    v-for="item in designClassifyOptions"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.dictCode"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            class-name="taskname"
            label="任务项名称"
            prop="taskName"
            align="center"
          >
            <template slot-scope="{ row }">
              <span v-if="row.show">{{ row.taskName }}</span>
              <el-form-item :error="row.taskNameerror" v-else>
                <el-input
                  class="custom-rule"
                  v-model="row.taskName"
                  placeholder="请输入任务项名称"
                  :disabled="readonly"
                  maxlength="150"
                  show-word-limit
                  @blur="tableParValueChange(row)"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="专业"
            prop="profession"
            align="center"
            width="140"
          >
            <template slot-scope="{ row }">
              <span v-if="row.show">{{
                  $DictionaryParsing(designProfessionOptions, row.profession)
                }}</span>
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                v-else
                ref="professionRef"
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
            </template>
          </el-table-column>
          <el-table-column
            label="计划供应日期"
            prop="planStartDate"
            align="center"
            value-format="yyyy-MM-dd"
            width="160"
            class-name="planTime"
          >
            <template slot-scope="{ row }">
              <span v-if="row.show && row.showPlanTime">
                {{ row.planTime ? timeFormat(row.planTime, "YYYY-MM-DD") : "" }}
              </span>
              <el-form-item :error="row.planTimeError" v-else>
                <el-date-picker
                  :disabled="readonly"
                  size="small"
                  placeholder="请选择"
                  style="width: 135px"
                  v-model="row.planTime"
                  @change="changeDesignPlanTime(row)"
                >
                </el-date-picker>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="工程部位" prop="projectPbs" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.show">
                <bim-show :pbsCode="row.projectPbs"></bim-show>
              </span>
              <el-form-item :error="row.projectPbsError" v-else>
                <pbs-select
                  v-model="row.projectPbs"
                  :readonly="readonly"
                  @change="changeDesignPbs(row)"
                ></pbs-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            width="230"
            label="负责人"
            prop="charge"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-form-item v-if="row.show">
                <user
                  v-model="row.charge"
                  :multiple="false"
                  :readonly="row.showCharge"
                ></user>
              </el-form-item>
              <el-form-item v-else>
                <user
                  v-model="row.charge"
                  :multiple="false"
                  :readonly="readonly"
                ></user>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="是否为现场需解决事项"
            prop="isScene"
            align="center"
            width="80"
          >
            <template slot-scope="{ row }">
              <span
                v-if="row.show"
                :class="row.isScene == 1 ? 'iconfont icon-checked' : ''"
              ></span>
              <el-checkbox
                v-else
                :checked="row.isScene == 1 ? true : false"
                @change="(val) => bIsSceneChangeHandle(val, row)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            label="修改状态"
            prop="changeType"
            align="center"
            width="60"
          >
            <template slot-scope="{ row }">
              <el-tag
                v-if="row.changeType != 0 && row.changeType != null"
                :type="
                  row.changeType == 1
                    ? 'warning'
                    : row.changeType == 2
                    ? 'danger'
                    : 'success'
                "
              >
                {{
                  row.changeType == 1
                    ? "修改"
                    : row.changeType == 2
                      ? "删除"
                      : "新增"
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="{ row, $index }">
              <div>
                <el-button
                  type="text"
                  :disabled="readonly"
                  v-if="row.showButton"
                  @click="handelEdit(row)"
                >编辑
                </el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="bottom"
                >
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="deleteRow($index, row)"
                  >
                    <el-button
                      v-if="row.showButton"
                      :disabled="readonly"
                      type="text"
                      slot="reference"
                      :style="{ color: readonly ? '#ccc' : 'red' }"
                    >
                      删除
                    </el-button>
                  </el-popconfirm>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <user-select
      :show.sync="personDialog.show"
      :users="personDialog.selection"
      @user-checked="getUsers"
    />
  </div>
</template>

<script>
import { save, listByMonth } from "./api";
import { dateFormat } from "@/utils";
import UserSelect from "@/components/newUserSelect/index.vue";
import DepSelect from "@/components/DepSelect/index.vue";
import PbsSelect from "@/components/PbsSelect/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import enums from "@/config/enums";
import MonthlyPlan from "./components/chooseMonth.vue";
import bimShow from "@/components/Bim/Show";
import { unitList } from "../drawingSend/components/api";
import { getSecretary } from "../../../../components/UniTable/api";

export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    UserSelect,
    DepSelect,
    PbsSelect,
    MonthlyPlan,
    bimShow,
  },
  data() {
    return {
      dialogPlanVisible: false,
      editTypes: [],
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
        uploadFile: "",
        uploadFileList: [],
        detailName: "",
        detailId: "",
        planTime: "",
        planTimeChange: "",
        designPlanDetailList: [],
      },
      formDataRules: {
        name: [{ required: false, message: "请填写计划名称", trigger: "blur" }],
        month: [{ required: true, message: "请选择计划月度", trigger: "blur" }],
        remark: [{ required: true, message: "请填写修改理由" }],
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
        list: "/api/design/planChange/page",
      },
      detailId: "",
      specialDate: new Date("2023-09-15"), // 传入的特殊日期
      secretaryList: [],
    };
  },
  computed: {
    isShow() {
      return (value) => {
        return value.includes(this.formData.type);
      };
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
    this.editTypes = enums["PLAN_EDIT_TYPE"];
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
          this.readonly = true;
        }
      }
    });
  },
  methods: {
    changeType(value) {
      this.formData.detailName = "";
      this.formData.planTime = "";
      this.$nextTick(() => {
        this.getSubTableData(this.businessId);
      });
    },
    // 切换组件  MonthlyPlan是关联计划组件  originalDrawing原图纸组件
    chooseComponent() {
      if (!this.formData.month) {
        this.$message.warning("请选择计划月度");
        return;
      }
      if (this.readonly) return;
      this.dialogPlanVisible = true;
      this.$nextTick(() => {
        let year = this.$dateFormat(this.formData.month, "yyyy");
        let month = this.$dateFormat(this.formData.month, "MM");
        let params = {
          year,
          month,
        };
        this.$refs["MonthlyPlan"].getList(params);
      });
    },
    sure() {
      let currentRow = this.$refs["MonthlyPlan"].currentRow;
      console.log("关闭选择", currentRow);
      this.$set(this.formData, "detailName", currentRow.taskName);
      if (currentRow?.planTime) {
        this.$set(
          this.formData,
          "planTime",
          this.$dateFormat(currentRow.planTime)
        );
      }
      this.$set(this.formData, "detailId", currentRow.id);
      // 单独校验
      this.$refs.dataFormRef.validateField("detailName", (errorMsg) => {
        console.log("errorMsg", errorMsg);
        if (!errorMsg) {
          // 字段验证通过，继续其他操作
        } else {
          // 字段验证失败，处理错误情况
        }
      });
      this.dialogPlanVisible = false;
    },
    // 是否展示

    //通过月份查询列表数据
    async getPlanListByMonth(month) {
      try {
        const Params = {
          month: month,
          flowStatus: 2,
          deleteStatus: 0,
        };
        const res = await listByMonth(Params);
        const { success, data, message } = res;
        if (success && data) {
          this.detailId = data.id;
          this.tableData = (data.designPlanDetailList || []).map((item) => ({
            ...item,
            show: true,
            showPlanTime: true,
            showCharge: true,
            showButton: item.changeType == 2 ? false : true,
          }));
          this.$set(this.formData, "name", data.name);
        } else {
          this.formData.name = "";
          this.$message.warning(message ? message : "暂无数据");
        }
      } catch (error) {
        console.error("请求失败", error);
        this.formData.name = "";
      }
    },
    getPickerOptions(row) {
      return {
        disabledDate: (date) => {
          // 在这个函数中定义日期的限制逻辑，使用传入的特殊日期
          return date < this.formData.startDate || date > this.formData.endDate;
        },
      };
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
      if (Object.prototype.hasOwnProperty.call(row, "type")) {
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
        this.$set(row, "taskNameerror", "");
      } else {
        this.$set(row, "taskNameerror", "必填");
      }
    },
    changeDesignClassify(row) {
      if (row.classify) {
        this.$set(row, "classifyerror", "");
      } else {
        this.$set(row, "classifyerror", "请选择");
      }
    },
    changeDesignPlanTime(row) {
      if (row.planTime) {
        this.$set(row, "planTimeError", "");
      } else {
        this.$set(row, "planTimeError", "请选择");
      }
    },
    changeDesignPbs(row) {
      if (row.projectPbs) {
        this.$set(row, "projectPbsError", "");
      } else {
        this.$set(row, "projectPbsError", "请选择");
      }
    },
    /**选择是否现场需求 */
    bIsSceneChangeHandle(checked, row) {
      row.bIsScene = checked;
      row.isScene = checked ? 1 : 0;
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
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        console.log("row", row);
        if (row) {
          if (row.type == 1) {
            if (row.month) {
              row.month = this.$dateFormat(row.month, "yyyy-MM");
            }
            if (row.planTime) {
              row.planTime = this.$dateFormat(row.planTime);
            }
            if (row.planTimeChange) {
              row.planTimeChange = this.$dateFormat(row.planTimeChange);
            }
          }
          this.$set(this, "formData", row);
          await this.getDictItemList(this.designClassifyCode);
          if (this.formData?.designPlanDetails.length > 0) {
            this.tableData = this.formData.designPlanDetails.map((item) => ({
              ...item,
              show: true,
              showPlanTime: true,
              showCharge: true,
              showButton: item.changeType == 2 ? false : true,
            }));
          } else {
            //this.getSubTableData(this.businessId);
          }
        } else {
          // 新增时
          await this.getDictItemList(this.designClassifyCode);
          //this.getSubTableData(this.businessId);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        // 在这里处理错误
      }
    },
    /**获取子表数据 */
    getSubTableData(businessId) {
      let tableData = [];
      let row = {
        taskName: "",
        sortNum: 1,
        baseId: businessId,
        classify: "",
        classifyName: "",
        isScene: 0,
        bIsScene: false,
        type: "task",
        isClassify: true,
      };
      tableData.push(row);
      this.$set(this, "tableData", tableData);
    },

    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      fields.month = new Date(fields.month);
      //做业务数据的保存,修改。
      let isok = true;
      this.tableData.forEach((item, index) => {
        if (!item.taskName) {
          this.$set(item, "taskNameerror", "请填写");
          isok = false;
        }
        if (!item.classify) {
          isok = false;
          this.$set(item, "classifyerror", "请选择");
        }
        if (!item.planTime) {
          isok = false;
          this.$set(item, "planTimeError", "请选择");
        }
        if (!item.projectPbs) {
          isok = false;
          this.$set(item, "projectPbsError", "请选择");
        }
      });
      if (isok) {
        fields.designPlanDetails = this.tableData;
      }
      if (!isok) return;
      save(fields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            // this.$message.success("新增成功");
          }
        })
        .catch((err) => {
          this.$message.error("新增失败");
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
      this.tableData.forEach((item, index) => {
        if (!item.taskName) {
          this.$set(item, "taskNameerror", "请填写");
          res = false;
        }
        if (!item.classify) {
          res = false;
          this.$set(item, "classifyerror", "请选择");
        }
        if (!item.planTime) {
          res = false;
          this.$set(item, "planTimeError", "请选择");
        }
        if (!item.projectPbs) {
          res = false;
          this.$set(item, "projectPbsError", "请选择");
        }
      });
      return res;
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
        }
      }
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    deleteRow(index, row) {
      if (row.id) {
        row.changeType = 2;
        row.showButton = false;
      } else {
        this.tableData.splice(index, 1);
      }
    },
    handelEdit(row) {
      //如果是新增的行不让修改类型
      if (row.id) {
        if (this.formData.id) {
          row.showPlanTime = false;
        } else {
          row.changeType = 1;
          row.showPlanTime = false;
        }
      } else {
        this.$message.warning("新增的行不允许修改");
      }
    },
    addTask() {
      this.tableData.push({
        changeType: 3,
        show: false,
        showPlanTime: false,
        showButton: true,
      });
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
  },
  watch: {
    "formData.designPlanId": {
      handler(val) {
        if (val) {
          this.getList();
        }
      },
      deep: true,
      immediate: true,
    },
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
// 解决 表格校验  样式问题
/deep/ .el-table .cell {
  overflow: visible !important;
}

/deep/ .custom-select {
  margin-bottom: 0 !important;
}

.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

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

/deep/ .el-button.is-disabled {
  color: #c0c4cc;
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

/deep/ .el-input .el-input__count .el-input__count-inner {
  background-color: transparent;
}

/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;
  }

  // .el-form-item__content ::before {
  //   content: "*";
  //   color: red;
  //   left: 10%;
  //   font-size: x-large;
  //   position: relative;
  //   top: 5px;
  // }
}

/deep/ .planTime {
  .el-form-item__content {
    top: 8px !important;
  }
}

/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
}

.readonly {
  ::v-deep .el-input-group__append {
    color: grey;
    border-color: #e4e7ed;
  }
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

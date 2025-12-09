<template>
  <div class="page-leave">
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否变更图纸" prop="isChange">
              <el-radio
                :disabled="isEdit"
                @change="changeStatus"
                v-model="formData.isChange"
                :label="'0'"
                >是</el-radio
              >
              <el-radio
                :disabled="isEdit"
                @change="changeStatus"
                v-model="formData.isChange"
                :label="'1'"
                >否</el-radio
              >
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.isChange == '0'">
            <el-form-item label="原图纸编号" prop="designSupply.code">
              <el-input
                :class="readonly ? 'customStyle' : ''"
                disabled
                placeholder="请选择"
                v-model="formData.designSupply.code"
              >
                <template slot="append">
                  <div @click="chooseComponent('originalDrawing', '图纸选择')">
                    选择
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图纸编号" prop="designSupply.code">
              <el-input
                show-word-limit
                type="textarea"
                maxlength="150"
                :disabled="orignDisabled || formData.isChange == '0'"
                v-model="formData.designSupply.code"
                placeholder="请输入编号"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图纸名称" prop="designSupply.name">
              <el-input
                show-word-limit
                type="textarea"
                maxlength="150"
                :disabled="formData.isChange == '1' ? false : true"
                v-model="formData.designSupply.name"
                placeholder="请输入图纸名称"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="formData.isChange == '1'">
            <el-form-item label="关联计划任务项" prop="planName">
              <el-input
                :class="readonly ? 'customStyle' : ''"
                disabled
                placeholder="请选择"
                v-model="planName"
              >
                <template slot="append">
                  <div
                    @click="chooseComponent('MonthlyPlan', '关联计划项选择')"
                  >
                    选择
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="designSupply.profession">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                :disabled="formData.isChange == '1' ? false : true"
                class="w-100pre"
                v-model="formData.designSupply.profession"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in DitSpeciality"
                  :key="item.value"
                  :label="item.dictName"
                  :value="item.dictCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工程部位" prop="designSupply.pbsCode">
              <pbs-select
                v-model="formData.designSupply.pbsCode"
                :readonly="formData.isChange == '0' ? true : readonly"
              ></pbs-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.isChange == '0'">
            <el-form-item label="变更图纸编号" prop="changeCode">
              <el-input placeholder="请输入" v-model="formData.changeCode">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.isChange == '0'">
            <el-form-item label="变更依据" prop="changeReasonFile">
              <uploadFile
                :readonly="readonly"
                v-model="formData.changeReasonFile"
                :maxSize="500"
              ></uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.isChange == '0'">
            <el-form-item label="关联计划任务项" prop="planName">
              <el-input
                :class="readonly ? 'customStyle' : ''"
                disabled
                placeholder="请选择"
                v-model="planName"
              >
                <template slot="append">
                  <div
                    @click="chooseComponent('MonthlyPlan', '关联计划项选择')"
                  >
                    选择
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="实际供应日期" prop="actualDate">
              <el-date-picker
                v-model="formData.actualDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" size="mini" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                show-word-limit
                maxlength="100"
                :autosize="{ minRows: 3, maxRows: 6 }"
                placeholder="请输入备注"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业主单位文秘:" prop="secretary">
              <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="formData.secretary" class="w-100pre">
                <el-option
                  :label="item.realName"
                  :value="item.userId"
                  v-for="(item, index) in secretaryList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div>
      <uploadFileTable
        :readonly="readonly"
        v-model="formData.designSupplyFileList"
        :maxSize="500"
      >
        <template slot="title">
          <div class="flex align-end">
            <div class="font-w-600">图纸文件列表</div>
            <div class="font-12 ml-20">请上传500M以内的文件</div>
          </div>
        </template>
      </uploadFileTable>
    </div>

    <el-dialog
      v-draggable
      width="80%"
      :title="dialogTitle"
      :visible.sync="dialogPlanVisible"
    >
      <components
        :page="'drawingSupply'"
        ref="components"
        :type="1"
        :is="component"
      ></components>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlanVisible = false">取 消</el-button>
        <el-button type="primary"  @click="sure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UserSelect from "@/components/newUserSelect/index.vue";
import DepSelect from "@/components/DepSelect/index.vue";
import bimShow from "@/components/Bim/Select/index.vue";
import MonthlyPlan from "@/components/MonthlyPlan/index.vue";
import engineeringChange from "./component/engineeringChange.vue";
import originalDrawing from "@/components/originalDrawing/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { getDictItemList } from "@/api/dict";
import { save } from "./api";
import { dateFormat } from "@/utils";
import { unitList } from "../drawingSend/components/api";
import { getSecretary } from "../../../../components/UniTable/api";
export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    UserSelect,
    DepSelect,
    bimShow,
    MonthlyPlan,
    originalDrawing,
    engineeringChange
  },
  data() {
    return {
      uploadApi: "/api/file/upload",
      isEdit: false, //新增的时候可选  修改的时候不可选
      imgsrc: "",
      canDeleteRow: false,
      component: "MonthlyPlan", //组件名称
      sonQuery: {
        month: ""
      },
      dialogPlanVisible: false,
      dialogTitle: "关联计划项选择",
      actualDate: true,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },

      //当前选择行
      curRow: null,

      orignlists: [],
      DitSpeciality: [],
      planName: "",
      orignDisabled: false,
      pageName: "",
      query: {
        applyUser: "",
        applyDate: "",
        pageSize: 20,
        current: 1,
        total: 0
      },
      showDialog: false,
      uploadFileList: [],
      formData: {
        id: "",
        designSupply: {
          id: "",
          name: "",
          code: "",
          pbsCode: "",
          profession: ""
        },
        isChange: "1",
        planId: "",
        actualDate: "",
        remark: "",
        designSupplyFileList: []
      },
      formDataRules: {
        "designSupply.name": [
          { required: true, message: "请输入图纸名称", trigger: "blur" }
        ],
        "designSupply.code": [
          { required: true, message: "请输入编号", trigger: "blur" }
        ],
        "designSupply.profession": [
          { required: true, message: "请选择专业", trigger: "blur" }
        ],
        "designSupply.pbsCode": [
          { required: true, message: "请选择工程部位", trigger: "change" }
        ],
        "designSupply.projectChangeCode": [
          { required: true, message: "请选择变更申请" }
        ],
        actualDate: [
          {
            required: true,
            message: "请选择日期"
          }
        ],
        secretary: [
          { required: true, message: "请选择业主单位文秘", trigger: "change" }
        ]
      },
      isAddOrEedit: false, //新增还是编辑

      currentSection: [],
      dictList: [],
      /**表单是否只读 */
      readonly: false,
      /**人员选择 */
      persons: [],
      personnelShow: false,
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
      url: {
        list: "/api/design/supply/detail/page"
      },
      projectChangeName: "",
      secretaryList: []
    };
  },

  async created() {
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getFlowPROFESSION();
    //获取数据
    this.getSecretaryList();
  },
  mounted() {
    this.formData.actualDate = this.$dateFormat();
  },
  watch: {
    "formData.designSupplyFileList": {
      handler(val) {
        console.log("表单文件", val);
      }
    }
  },
  computed: {
    // customStyle() {
    //   console.log("流程节点", this.readonly);
    //   // 判断当前的状态  是流转中 还是发起  这个是能 针对编号 因为 编号一旦选定就不能更改 工程变部位 就需要 再继续判断了
    //   let bool = false;
    //   //新增
    //   if (this.readonly) {
    //     bool = true;
    //   }
    //   return bool;
    // },
  },
  methods: {
    async sure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("关闭选择", currentRow);
      if (currentRow) {
        // 2023-08 xxxxx图纸
        if (this.component == "MonthlyPlan") {
          console.log("月度计划");
          this.planName = `${currentRow.month} ${currentRow.taskName}`;
          this.formData.planId =
            currentRow.pid +
            "&&&" +
            currentRow.id +
            "&&&" +
            currentRow.taskName +
            "&&&" +
            currentRow.month;
          this.formData.designSupply.pbsCode =
            currentRow.pbsCode || currentRow.projectPbs;
        } else if (this.component == "originalDrawing") {
          console.log("原图纸");
          this.formData.designSupply.profession = currentRow.profession;
          this.formData.designSupply.code = currentRow.code;
          this.formData.designSupply.name = currentRow.name;

          if (currentRow?.pbsCode) {
            this.formData.designSupply.pbsCode =
              currentRow.pbsCode || currentRow.projectPbs;
          } else {
            this.formData.designSupply.pbsCode = "";
          }
          this.formData.baseId = currentRow.id;

          // formData.designSupply.id = currentRow.id;
        } else if (this.component == "engineeringChange") {
          console.log("工程变更");
          this.$set(
            this.formData.designSupply,
            "projectChangeCode",
            currentRow.projectChangeCode
          );
          this.$set(this.formData.designSupply, "code", currentRow.code);
          this.$set(this.formData.designSupply, "name", currentRow.drawingName);
          this.$set(
            this.formData.designSupply,
            "profession",
            currentRow.profession
          );
          this.projectChangeName = currentRow.projectChangeCode;

          if (currentRow?.pbsCode) {
            this.formData.designSupply.pbsCode = currentRow.pbsCode;
          } else {
            this.formData.designSupply.pbsCode = "";
          }
          this.formData.baseId = currentRow.id;
        }
      }
      this.$nextTick(() => {
        this.dialogPlanVisible = false;
      });
    },
    // 切换组件  MonthlyPlan是关联计划组件  originalDrawing原图纸组件
    chooseComponent(com, title) {
      if (this.readonly) return;
      if (this.isEdit && com != "MonthlyPlan") {
        this.$message.warning("只读属性，无法修改");
        return;
      }
      this.dialogTitle = title;

      this.dialogPlanVisible = true;
      this.component = com;
      this.$nextTick(() => {
        if (com == "MonthlyPlan") {
          this.$refs.components.toDay();
        } else if (com == "engineeringChange") {
          this.$refs.components.reset();
        } else if (com == "originalDrawing") {
          this.$refs.components.default();
        } else {
          this.$message.error("组件使用错误");
          this.dialogPlanVisible = false;
          return;
        }
      });
    },
    changeStatus(value) {
      this.formData.designSupply = {};
      this.projectChangeName = "";
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate();
      });
    },
    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.DitSpeciality = data;
    },

    /**
     * 获取表单数据
     */

    async getFormData() {
      try {
        const row = await this.getFlowRow();
        console.log("获取表单数据", row);
        if (row) {
          this.isEdit = true;
          if (row.createUser == this.$getStorage("userInfo").userId) {
            this.canDeleteRow = false;
          } else {
            this.canDeleteRow = true;
          }
          console.log("row", row);
          row.actualDate = this.timeFormat(row.actualDate, "YYYY-MM-DD");
          if (row.planId && row.planId.includes("&&&")) {
            this.planName = `${row.planId.split("&&&")[3]} ${
              row.planId.split("&&&")[2]
            }`;
          }
          if (!row.designSupplyFileList) {
            row.designSupplyFileList = [];
          }
          this.formData = row;
          this.orignDisabled = row.isChange === 0 ? true : false;
        } else {
          this.isEdit = false;
        }
      } catch (error) {
        // 处理错误情况
        console.error("获取表单数据时出错", error);
      }
    },

    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      // console.log("save fields", fields);
      //做业务数据的保存,修改。
      if (this.formData.isChange == "1") {
        fields.baseId = "";
      }
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
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designClassifyOptions = res.data;
              callback && callback();
            }
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
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designProfessionOptions = res.data;
            }
          });
        }
      }
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
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
              roleName: "文秘"
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
          value: this.formData.secretary
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
    }
  }
};
</script>

<style scoped lang="scss">
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

.line {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0 10px 0;
}

/deep/ .customStyle .el-input-group__append {
  border: 1px solid #dcdfe6;
  color: #808080;
  cursor: default;
}
/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
/deep/ .is-disabled {
  .el-input__inner,
  .el-textarea__inner {
    color: #333;
  }
}
</style>

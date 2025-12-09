<template>
  <div style="padding: 10px">
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属单位" prop="unit">
              <el-select
                v-model="formData.unit"
                class="w-100pre"
                placeholder="请选择"
                :disabled="readonly"
                @change="handleUnitChange"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in belongUnit"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员" prop="safeStaffIds">
              <safe-staff
                v-model="formData.safeStaffIds"
                :multiple="true"
                :readonly="readonly"
                :disabled="!formData.unit || readonly"
                :unit-id="formData.unit"
                @change="selectChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进退场类型" prop="isOut">
              <el-select
                v-model="formData.isOut"
                class="w-100pre"
                :disabled="readonly"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option label="进场" :value="ENTRY_EXIT_TYPES.ENTRY" />
                <el-option label="退场" :value="ENTRY_EXIT_TYPES.EXIT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="
                formData.isOut == ENTRY_EXIT_TYPES.ENTRY
                  ? '进场日期'
                  : '退场日期'
              "
              prop="startEndDate"
            >
              <el-date-picker
                v-model="formData.startEndDate"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="readonly"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('needReview')" :span="12">
            <el-form-item label="是否需要监理审核" prop="needReview">
              <el-switch
                v-model="formData.needReview"
                :disabled="flowDisabled('needReview')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('professionalSupervisoryEngineer')" :span="12">
            <el-form-item
              label="专业监理工程师"
              prop="professionalSupervisoryEngineer"
            >
              <user
                v-model="formData.professionalSupervisoryEngineer"
                :readonly="flowDisabled('professionalSupervisoryEngineer')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('safetySupervisionEngineer')" :span="12">
            <el-form-item
              label="安全监理工程师"
              prop="safetySupervisionEngineer"
            >
              <user
                v-model="formData.safetySupervisionEngineer"
                :readonly="flowDisabled('safetySupervisionEngineer')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 进场时的必填附件 -->
        <el-row v-if="formData.isOut === ENTRY_EXIT_TYPES.ENTRY">
          <!-- <el-col :span="24">
            <el-divider content-position="left">进场附件材料</el-divider>
          </el-col> -->
          <el-col :span="12">
            <el-form-item
              label="安全技术交底材料"
              prop="technicalPersonnelData"
              :required="formData.isOut === ENTRY_EXIT_TYPES.ENTRY"
            >
              <uploadFile
                v-model="formData.technicalPersonnelData"
                :readonly="readonly"
                :limit="1"
                :max-size="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="三级安全教育培训材料"
              prop="safetyTrainingMaterials"
              :required="formData.isOut === ENTRY_EXIT_TYPES.ENTRY"
            >
              <uploadFile
                v-model="formData.safetyTrainingMaterials"
                :readonly="readonly"
                :limit="1"
                :max-size="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="安全生产责任书"
              prop="safetyResponsibilityBook"
              :required="formData.isOut === ENTRY_EXIT_TYPES.ENTRY"
            >
              <uploadFile
                v-model="formData.safetyResponsibilityBook"
                :readonly="readonly"
                :limit="1"
                :max-size="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="体检报告"
              prop="medicalReport"
              :required="formData.isOut === ENTRY_EXIT_TYPES.ENTRY"
            >
              <uploadFile
                v-model="formData.medicalReport"
                :readonly="readonly"
                :limit="1"
                :max-size="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { save, unitAllList } from "./api";
import { page } from "@/views/safetyManagement/staffManagement/api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import SafeStaff from "@/components/Organize/SafeStaff/index.vue";

// 进退场类型枚举
const ENTRY_EXIT_TYPES = {
  ENTRY: 1, // 进场
  EXIT: 2, // 退场
};

export default {
  name: "DataForm",
  components: {
    SafeStaff,
  },
  mixins: [FlowFormMixin],
  data() {
    return {
      ENTRY_EXIT_TYPES,
      formData: {},
      formDataRules: {
        startEndDate: [
          { required: true, message: "请选择进退场日期", trigger: "blur" },
        ],
        unit: [
          { required: true, message: "请选择所属单位", trigger: "change" },
        ],
        safeStaffIds: [
          { required: true, message: "请选择人员", trigger: "blur" },
        ],
        isOut: [
          { required: true, message: "请选择进退场类型", trigger: "change" },
        ],
        Review: [{ required: true, message: "请选择", trigger: "change" }],
        needReview: [
          {
            required: true,
            message: "请选择是否需要监理审核",
            trigger: "change",
          },
        ],
        safetySupervisionEngineer: [
          {
            required: true,
            message: "请选择安全监理工程师",
            trigger: "change",
          },
        ],
        professionalSupervisoryEngineer: [
          {
            required: true,
            message: "请选择专业监理工程师",
            trigger: "change",
          },
        ],
        // 进场时的必填附件验证规则
        technicalPersonnelData: [
          {
            validator: (rule, value, callback) => {
              if (
                this.formData.isOut === this.ENTRY_EXIT_TYPES.ENTRY &&
                (!value || value.length === 0)
              ) {
                callback(new Error("请上传专业技术人员资料"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        safetyResponsibilityBook: [
          {
            validator: (rule, value, callback) => {
              if (
                this.formData.isOut === this.ENTRY_EXIT_TYPES.ENTRY &&
                (!value || value.length === 0)
              ) {
                callback(new Error("请上传安全生产责任书"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        safetyTrainingMaterials: [
          {
            validator: (rule, value, callback) => {
              if (
                this.formData.isOut === this.ENTRY_EXIT_TYPES.ENTRY &&
                (!value || value.length === 0)
              ) {
                callback(new Error("请上传三级安全教育培训材料"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        medicalReport: [
          {
            validator: (rule, value, callback) => {
              if (
                this.formData.isOut === this.ENTRY_EXIT_TYPES.ENTRY &&
                (!value || value.length === 0)
              ) {
                callback(new Error("请上传体检报告"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/safe/staff/entryExit/page",
      },
      belongUnit: [],
      staffList: [],
      sectionList: [],
    };
  },
  computed: {
    // 审批字段的禁用
    flowDisabled() {
      return (field) => {
        let disabled = true;
        switch (field) {
          case "needReview":
            disabled =
              this.formData.matterTaskTodo?.procTaskName &&
              this.formData.matterTaskTodo?.procTaskName != "专业监理工程师";
            break;
          case "safetySupervisionEngineer":
            disabled =
              this.formData.id &&
              this.formData.matterTaskTodo?.procTaskName &&
              (this.formData.isOut == this.ENTRY_EXIT_TYPES.EXIT ||
                this.formData.matterTaskTodo?.procTaskName != "专业监理工程师");
            break;
          case "professionalSupervisoryEngineer":
            disabled =
              this.formData.id && this.formData.matterTaskTodo?.procTaskName;
            break;
        }
        return Boolean(disabled);
      };
    },
    // 审批字段的显示
    flowShow() {
      return (field) => {
        let show = true;
        switch (field) {
          case "needReview":
            show =
              this.formData.isOut == this.ENTRY_EXIT_TYPES.ENTRY &&
              this.formData.id;
            break;
          case "safetySupervisionEngineer":
            show =
              this.formData.isOut == this.ENTRY_EXIT_TYPES.EXIT ||
              this.formData.needReview == 1;
            break;
          case "professionalSupervisoryEngineer":
            show = this.formData.isOut == this.ENTRY_EXIT_TYPES.ENTRY;
            break;
        }
        return Boolean(show);
      };
    },
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
  },
  created() {
    this.getBelongTo();
  },
  mounted() {},
  // 页面离开时触发
  beforeDestroy() {
    if (this.fromapp) {
      const titleElement = document.getElementById("dynamicTitle");
      // 设置动态标题
      titleElement.textContent = "雄安调蓄工程建设管理系统";
    }
  },
  methods: {
    /**
     * @description 单位改变
     */
    selectChange(val) {
      console.log("tijiao", val);
      formData.safeStaffIds = val.join(",");
    },
    handleUnitChange(id) {
      page({
        current: 1,
        entity: {
          params: {},
          issuanceUnit: id,
          unit: id,
        },
        pageSize: 999,
        size: 999,
      }).then((res) => {
        this.staffList = res.data.records;
      });

      this.formData.safeStaffIds = "";
    },
    // 获取当前人的所属机构
    async getBelongTo() {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId,
      };
      try {
        // console.log("获取所有的单位");
        const result = await unitAllList();
        const { data, success } = result;
        if (!success) {
          this.$message.error("获取单位列表失败");
          return;
        }
        this.belongUnit = data
          .filter((x) => x.corpPid)
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
      } catch (err) {
        console.log("err", err);
      }
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey;
      if (btnKey === "submit") return;
      let extData = {};
      extData["isOut"] = {
        type: "int",
        value: this.formData.isOut, // 使用枚举值
      };
      extData["safetySupervisionEngineer"] = {
        type: "user",
        value: this.formData.safetySupervisionEngineer,
      };
      extData["professionalSupervisoryEngineer"] = {
        type: "user",
        value: this.formData.professionalSupervisoryEngineer,
      };
      this.sendFlowJson = extData;
    },
    async beforeSubmitButton() {
      let extData = {};
      extData["needReview"] = {
        type: "int",
        value: this.formData.needReview,
      };
      extData["safetySupervisionEngineer"] = {
        type: "user",
        value: this.formData.safetySupervisionEngineer,
      };
      this.sendFlowJson = extData;
    },
    save(fields, callback, event) {
      const isMaintenance = event.data.btnKey === "maintenance";
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: "maintenance",
          },
          event.origin
        );
        return;
      }
      console.log("提交之前", this.staffList);
      fields.names = this.staffList
        .filter((x) => fields.safeStaffIds.includes(x.id))
        .map((x) => x.name)
        .join(",");
      fields.safeStaffIds = fields.safeStaffIds.join(",");
      fields.needReview = fields.needReview ? 1 : 2;
      save(fields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow();
      if (row) {
        this.formData = row;
        this.formData.needReview = this.formData.needReview == 1;
        const ids = this.formData.safeStaffIds.split(",");
        this.$nextTick(() => {
          this.formData.safeStaffIds = ids;
        });
        console.log("获取表单", this.formData.safeStaffIds);
        this.handleUnitChange(this.formData.unit);
      }
    },
  },
};
</script>

<style scoped lang="scss">
// 单独处理  上传样式

/deep/.custom-disabled {
  .upload-demo {
    display: none;
  }
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
  display: flex;
  justify-content: center;
}

/deep/ .el-table {
  th.required.taskname {
    .cell::before {
      content: "*";
      width: 5px;
      height: 0px;
      margin-top: 2px;
      color: #ff4d51;
    }
  }
}

/deep/ .file-list {
  margin-top: 3px !important;

  .icon {
    background-color: transparent !important;
    margin-right: 5px;
  }
}

::v-deep .el-divider--horizontal {
  margin: 18px 0;
}

::v-deep .el-table__row {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}

/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}
</style>

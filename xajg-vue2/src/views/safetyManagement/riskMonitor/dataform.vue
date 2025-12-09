<template>
  <div style="padding: 10px">
    <el-row>
      <el-col :span="24" class="mb-15">
        <el-button
          type="primary"
          :disabled="readonly"
          @click="downloadTemplate()"
        >
          模板下载
        </el-button>
        <el-button
          type="primary"
          :disabled="readonly"
          @click="triggerFileInput()"
        >
          导入
        </el-button>
      </el-col>
    </el-row>
    <el-row>

      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工程部位:" prop="pbsCode">
              <pbsSelect v-model="formData.pbsCode" :readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险等级:" prop="riskLevel">
              <el-select
                v-model="formData.riskLevel"
                class="w-100pre"
                :disabled="readonly"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in riskLevelList"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效时间:" prop="effectiveDate">
              <el-date-picker
                v-model="formData.effectiveDate"
                style="width: 100%"
                :disabled="readonly"
                type="daterange"
                range-separator="-"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段" prop="sectionId">
              <el-select
                v-model="formData.sectionId"
                class="w-100pre"
                :disabled="readonly"
                clearable
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="潜在事故类型:" prop="accidentTypes">
              <el-input
                v-model="formData.accidentTypes"
                type="textarea"
                placeholder="请输入"
                :rows="3"
                :disabled="readonly"
                maxlength="50"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险描述:" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                placeholder="请输入"
                :rows="3"
                :disabled="readonly"
                maxlength="2000"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人:" prop="responsiblePerson">
              <el-input
                v-model="formData.responsiblePerson"
                type="textarea"
                placeholder="请输入"
                :rows="3"
                :disabled="readonly"
                maxlength="100"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控措施:" prop="measures">
              <el-input
                v-model="formData.measures"
                type="textarea"
                placeholder="请输入"
                :rows="3"
                :disabled="readonly"
                maxlength="2000"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="附件:" prop="attachment">
              <uploadFile
                v-model="formData.attachment"
                :readonly="readonly"
                :limit="1"
                :multiline="false"
                :max-size="20"
                @change="handleFileChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隐患位置" prop="location">
              <bimPoint
                v-model="formData.location"
                :readonly="readonly"
                type="point"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                placeholder="请输入"
                :rows="3"
                :disabled="readonly"
                maxlength="200"
                show-word-limit
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="施工生产经理"
              prop="constructionProductionManager"
            >
              <user
                v-model="formData.constructionProductionManager"
                :readonly="readonly"
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
          <el-col v-if="flowShow('needReview')" :span="12">
            <el-form-item label="是否需要监理审核" prop="needReview">
              <el-switch
                v-model="formData.needReview"
                :disabled="flowDisabled('needReview')"
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
          <el-col v-if="flowShow('supervisionDirector')" :span="12">
            <el-form-item label="监理总监" prop="supervisionDirector">
              <user
                v-model="formData.supervisionDirector"
                :readonly="flowDisabled('supervisionDirector')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        @change="handleFileUpload"
      >
    </el-row>
  </div>
</template>

<script>
import { save, getSection } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { fromApp } from "@/utils/index";
import { getDictItemList } from "@/api/dict";
import bimPoint from "@/components/Bim/Point/index";
import * as XLSX from "xlsx";

export default {
  name: "DataForm",
  components: { bimPoint },
  mixins: [FlowFormMixin],
  data() {
    return {
      isFormApp: false,
      showHiddenDangerRectifier: false,
      formData: {},
      formDataRules: {
        pbsCode: [{ required: true, message: "请选择工程", trigger: "change" }],
        description: [
          { required: true, message: "风险描述不能为空", trigger: "blur" },
        ],
        accidentTypes: [
          { required: true, message: "潜在事故类型不能为空", trigger: "blur" },
        ],
        riskLevel: [
          { required: true, message: "风险等级不能为空", trigger: "change" },
        ],
        responsiblePerson: [
          { required: true, message: "责任人不能为空", trigger: "blur" },
        ],
        measures: [
          { required: true, message: "管控措施不能为空", trigger: "blur" },
        ],
        effectiveDate: [
          { required: true, message: "有效时间不能为空", trigger: "change" },
        ],
        attachment: [
          { required: true, message: "请上传附件", trigger: "change" },
        ],
        location: [
          { required: true, message: "请选择隐患位置", trigger: "change" },
        ],
        sectionId: [
          { required: true, message: "请选择标段", trigger: "change" },
        ],
        constructionProductionManager: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        professionalSupervisoryEngineer: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        needReview: [{ required: true, message: "请选择", trigger: "change" }],
        safetySupervisionEngineer: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        supervisionDirector: [
          { required: true, message: "请选择", trigger: "change" },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/safe/risk/page",
      },
      yhjbList: [], //隐患级别
      riskLevelList: [], //隐患分类
      sectionList: [],
      downloadPath: "/static/template/危险源管理导入模板.xlsx",
    };
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
    // 审批字段的禁用
    flowDisabled() {
      return (field) => {
        let disabled = true;
        switch (field) {
          case "professionalSupervisoryEngineer":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName != "施工生产经理";
            break;
          case "needReview":
            disabled =
              this.flowInfo?.page != "todo" ||
              (this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != "专业监理工程师");
            break;
          case "safetySupervisionEngineer":
            disabled =
              this.flowInfo?.page != "todo" ||
              (this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != "专业监理工程师");
            break;
          case "supervisionDirector":
            disabled =
              this.flowInfo?.page != "todo" ||
              (this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != "专业监理工程师");
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
          case "professionalSupervisoryEngineer":
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.matterTaskTodo?.procTaskName && this.formData.id);
            break;
          case "needReview":
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != "施工生产经理");
            break;
          case "safetySupervisionEngineer":
            show =
              this.formData.id &&
              this.formData.needReview &&
              this.formData.matterTaskTodo?.procTaskName != "施工生产经理";
            break;
          case "supervisionDirector":
            console.log(this.formData);
            show =
              this.formData.id &&
              !this.formData.needReview &&
              this.formData.matterTaskTodo &&
              this.formData.matterTaskTodo?.procTaskName != "施工生产经理";
            break;
        }
        return Boolean(show);
      };
    },
  },
  created() {
    this.isFormApp = fromApp();
    //接收控件页面的值，点击 保存到服务器 执行
    this.getSectionList();
  },
  mounted() {
    this.getDictItemList();
  },
  // 页面离开时触发
  beforeDestroy() {
    if (this.fromapp) {
      const titleElement = document.getElementById("dynamicTitle");
      // 设置动态标题
      titleElement.textContent = "雄安调蓄工程建设管理系统";
    }
  },
  methods: {
    /**获取字典 */
    async getDictItemList() {
      const riskLevels = await getDictItemList("RISK_LEVEL");
      this.riskLevelList = riskLevels.data;
    },
    /**
     * @description 选中用户 回显部门
     * @param filed
     * @param value
     * @param record
     */
    handlerUserChange(filed, value, record) {
      this.$set(this.formData, filed, record.departName);
    },
    handleFileChange(value) {
      if (value) {
        this.$refs.dataFormRef?.clearValidate("attachment");
      }
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey;
      if (btnKey === "submit") return;
      let extData = {};
      extData["constructionProductionManager"] = {
        type: "user",
        value: this.formData.constructionProductionManager,
      };
      this.sendFlowJson = extData;
    },
    async beforeSubmitButton() {
      let extData = {};
      extData["professionalSupervisoryEngineer"] = {
        type: "user",
        value: this.formData.professionalSupervisoryEngineer,
      };
      extData["needReview"] = {
        type: "int",
        value: this.formData.needReview ? 1 : 2,
      };
      extData["safetySupervisionEngineer"] = {
        type: "user",
        value: this.formData.safetySupervisionEngineer,
      };
      extData["supervisionDirector"] = {
        type: "user",
        value: this.formData.supervisionDirector,
      };
      this.sendFlowJson = extData;
    },
    save(fields, callback, event) {
      if (
        this.formData.effectiveDate &&
        this.formData.effectiveDate.length == 2
      ) {
        this.formData.effectiveDateStart = this.formData.effectiveDate[0];
        this.formData.effectiveDateEnd = this.formData.effectiveDate[1];
      }
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
        // Object.assign(this.formData, row);
        this.formData = row;
        this.formData.needReview = this.formData.needReview == 1 ? true : false;
        this.$set(this.formData, "effectiveDate", [
          this.formData.effectiveDateStart,
          this.formData.effectiveDateEnd,
        ]);
      } else {
        // this.$set(this.formData, "hiddenDangerReportor", this.userInfo.userId);
        // this.$set(this.formData, "hiddenDangerReportorFullname", this.userInfo.realName);
        // this.$set(
        //   this.formData,
        //   "hiddenDangerReportorDeptName",
        //   this.userInfo.departName
        // );
      }
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSection({
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
    downloadTemplate() {
      const fileName = "危险源管理导入模板.xlsx";
      const link = document.createElement("a");
      link.href = this.downloadPath;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    triggerFileInput() {
      this.$nextTick(() => {
        this.$refs.fileInput && this.$refs.fileInput.click();
      });
    },
    handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      const fieldMap = {
        riskLevel: "*风险等级",
        effectiveDateStart: "*开始日期",
        effectiveDateEnd: "*结束日期",
        sectionId: "*标段",
        accidentTypes: "*潜在事故类型",
        description: "*风险描述",
        responsiblePerson: "*责任人",
        measures: "*管控措施",
        remark: "备注",
      };

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        if (!jsonData || !jsonData.length) {
          this.$message.warning("导入数据为空");
          return;
        }
        const row = jsonData[0];
        console.log('行信息',JSON.stringify(row));
        Object.keys(fieldMap).forEach((key) => {
          const header = fieldMap[key];
          if (!Object.prototype.hasOwnProperty.call(row, header)) {
            return;
          }

          // 风险等级：名称 -> 字典编码
          if (key === "riskLevel") {
            const levelName = row[header];
            const targetLevel = this.riskLevelList.find(
              (i) => i.dictName === levelName
            );
            if (targetLevel && targetLevel.dictCode) {
              this.$set(this.formData, "riskLevel", targetLevel.dictCode);
            } else {
              this.$message.warning(`错误的风险等级描述：${levelName}，请手工选择`);
              return;
            }
            return;
          }

          // 标段需由名称转换为 id
          if (key === "sectionId") {
            const sectionName = row[header];
            const target = this.sectionList.find((s) => s.name === sectionName);
            if (target && target.id) {
              this.$set(this.formData, "sectionId", target.id);
            } else {
              this.$message.warning(
                `未找到当前账号匹配的标段：${sectionName}，请手工选择`
              );
             }
          } else if (key === "effectiveDateStart" || key === "effectiveDateEnd") {
             let val = row[header];
             let dateObj = null;
             if (val instanceof Date) {
                dateObj = val;
             } else if (typeof val === 'number') {
                dateObj = new Date(Math.round((val - 25569) * 86400 * 1000));
             } else if (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '') {
                dateObj = new Date(Math.round((Number(val) - 25569) * 86400 * 1000));
             }
             
             if (dateObj && !isNaN(dateObj.getTime())) {
                 const year = dateObj.getFullYear();
                 const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                 const day = dateObj.getDate().toString().padStart(2, '0');
                 this.$set(this.formData, key, `${year}-${month}-${day}`);
             } else {
                 // Ensure string if not null/undefined to prevent e.match error
                 this.$set(this.formData, key, val === null || val === undefined ? "" : String(val));
             }
          } else {
            this.$set(this.formData, key, row[header]);
          }
        });
        if (
          this.formData.effectiveDateStart &&
          this.formData.effectiveDateEnd
        ) {
          this.$set(this.formData, "effectiveDate", [
            this.formData.effectiveDateStart,
            this.formData.effectiveDateEnd,
          ]);
        }
        this.$message.success("导入成功");
        this.$refs.fileInput && (this.$refs.fileInput.value = "");
      };
      reader.readAsArrayBuffer(file);
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

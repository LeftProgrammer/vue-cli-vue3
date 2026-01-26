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
            <el-form-item label="隐患名称" prop="hiddenDangerName">
              <el-input
                v-model="formData.hiddenDangerName"
                placeholder="请输入"
                :disabled="readonly"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程部位" prop="pbsCode">
              <pbs-select v-model="formData.pbsCode" :readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="整改期限" prop="rectifyDate">
              <el-date-picker
                v-model="formData.rectifyDate"
                :disabled="readonly"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隐患级别" prop="hiddenDangerLevel">
              <el-select
                v-model="formData.hiddenDangerLevel"
                :disabled="readonly"
                class="w-100pre"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in yhjbList"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隐患分类" prop="hiddenDangerCategory">
              <el-select
                v-model="formData.hiddenDangerCategory"
                class="w-100pre"
                :disabled="readonly"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in yhflList"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隐患位置" prop="locationDesc">
              <bimPoint
                v-model="formData.locationDesc"
                :readonly="readonly"
                type="point"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段" prop="sectionId">
              <el-select
                v-model="formData.sectionId"
                class="w-100pre"
                clearable
                :disabled="readonly"
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
          <el-col :span="24">
            <el-form-item label="隐患内容" prop="hiddenDangerContent">
              <el-input
                v-model="formData.hiddenDangerContent"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                :disabled="readonly"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件照片" prop="beforeFileToken">
              <uploadFile
                v-model="formData.beforeFileToken"
                accept=".png,.jpg,.jpeg"
                :limit="5"
                :max-size="50"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="整改要求及处理意见" prop="rectifyComment">
              <el-input
                v-model="formData.rectifyComment"
                type="textarea"
                :readonly="readonly"
                :autosize="{ minRows: 2, maxRows: 6 }"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col
            v-if="
              formData.id &&
                formData.hiddenDangerLevel == 'zdsgyh' &&
                formData.matterTaskTodo?.procTaskName &&
                formData.matterTaskTodo?.procTaskName != '确认安全隐患'
            "
            :span="24"
          >
            <el-form-item label="报批整改方案" prop="reportApprovalPlan">
              <el-input
                v-model="formData.reportApprovalPlan"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                maxlength="500"
                :disabled="
                  flowInfo?.page != 'todo' ||
                    formData.matterTaskTodo?.procTaskName != '整改方案报批'
                "
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col
            v-if="
              formData.flowStatus == 2 ||
                (formData.id &&
                  formData.hiddenDangerLevel == 'zdsgyh' &&
                  formData.matterTaskTodo?.procTaskName &&
                  formData.matterTaskTodo?.procTaskName != '确认安全隐患')
            "
            :span="24"
          >
            <el-form-item label="报批整改附件" prop="reportApprovalAttachment">
              <uploadFile
                v-model="formData.reportApprovalAttachment"
                accept=".png,.jpg,.jpeg"
                :limit="5"
                :max-size="50"
                :readonly="
                  flowInfo?.page != 'todo' ||
                    formData.matterTaskTodo?.procTaskName != '整改方案报批'
                "
              />
            </el-form-item>
          </el-col>
          <el-col
            v-show="
              formData.flowStatus == 2 ||
                (formData.id &&
                  formData.matterTaskTodo?.procTaskName == '提交整改证明材料' &&
                  formData.hiddenDangerLevel == 'zdsgyh')
            "
            :span="24"
          >
            <el-form-item label="整改措施" prop="rectifyMeasures">
              <el-input
                v-model="formData.rectifyMeasures"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                maxlength="2000"
                :disabled="
                  flowInfo?.page != 'todo' ||
                    formData.matterTaskTodo?.procTaskName != '提交整改证明材料'
                "
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col
            v-show="
              formData.flowStatus == 2 ||
                (formData.id &&
                  formData.matterTaskTodo?.procTaskName == '提交整改证明材料')
            "
            :span="24"
          >
            <el-form-item label="整改情况" prop="rectifySituation">
              <el-input
                v-model="formData.rectifySituation"
                :disabled="
                  flowInfo?.page != 'todo' ||
                    formData.matterTaskTodo?.procTaskName != '提交整改证明材料'
                "
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col
            v-show="
              formData.flowStatus == 2 ||
                (formData.id &&
                  formData.matterTaskTodo?.procTaskName == '提交整改证明材料')
            "
            :span="24"
          >
            <el-form-item label="附件照片" prop="afterFileToken">
              <uploadFile
                v-model="formData.afterFileToken"
                accept=".png,.jpg,.jpeg"
                :readonly="
                  flowInfo?.page != 'todo' ||
                    formData.matterTaskTodo?.procTaskName != '提交整改证明材料'
                "
                :limit="5"
                :max-size="50"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col
            v-show="formData.id && formData.matterTaskTodo?.procTaskName != '隐患审核'"
            :span="24"
          >
            <el-form-item label="是否需要监理审核" prop="supervision">
              <el-switch
                v-model="formData.supervision"
                :disabled="
                  flowInfo?.page != 'todo' ||
                  formData.matterTaskTodo?.procTaskName != '隐患整改'
                "
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item
              label="安全监理工程师"
              prop="safetySupervisionEngineer"
            >
              <user
                v-model="formData.safetySupervisionEngineer"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.matterTaskTodo?.procTaskName" :span="12">
            <el-form-item
              label="施工安全负责人"
              prop="constructionSafetyManager"
            >
              <user
                v-model="formData.constructionSafetyManager"
                :readonly="
                  flowInfo?.page != 'todo' ||
                    formData.matterTaskTodo?.procTaskName != '确认安全隐患'
                "
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- 上报 -->
          <el-col :span="12">
            <el-form-item
              label="隐患上报人"
              prop="hiddenDangerReportorFullname"
            >
              <el-input
                v-model="formData.hiddenDangerReportorFullname"
                disabled
                maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="上报人部门"
              prop="hiddenDangerReportorDeptName"
            >
              <el-input
                v-model="formData.hiddenDangerReportorDeptName"
                disabled
                maxlength="255"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="上报同行人"
              prop="anotherHiddenDangerReportorFullname"
            >
              <el-input
                v-model="formData.anotherHiddenDangerReportorFullname"
                :disabled="readonly"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { save, getSection } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { fromApp } from "@/utils/index";
import { getDictItemList } from "@/api/dict";
import bimPoint from "@/components/Bim/Point/index";

import { dateFormat } from "@/utils";
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
        pbsCode: [{ required: true, message: "请选择", trigger: "change" }],
        hiddenDangerLevel: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        rectifyDate: [{ required: true, message: "请选择", trigger: "change" }],
        hiddenDangerCategory: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        locationDesc: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        hiddenDangerChecker: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        hiddenDangerContent: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        reportApprovalPlan: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        hiddenDangerName: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        reportApprovalAttachment: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        // locationDesc: [{ required: true, message: "请输入", trigger: "change" }],
        safetySupervisionEngineer: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        constructionSafetyManager: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        sectionId: [
          { required: true, message: "请选择标段", trigger: "change" },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/safe/hiddenDanger/page",
      },
      yhjbList: [], //隐患级别
      yhflList: [], //隐患分类
      sectionList: [],
    };
  },
  computed: {
    // 是否展示审批人
    freeFlowInputShow() {
      let show = false;
      if (this.formData?.flowInfo?.page != "fine") {
        if (
          Object.keys(this.formData).length === 0 ||
          !this.formData?.flowStatus
        ) {
          show = true;
        }
      }
      return show;
    },
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
    showHiddenDangerSupervisor() {
      return this.formData.supervision;
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
      const hiddenDangerCategory = await getDictItemList("yhfl");
      const hiddenDangerLevel = await getDictItemList("yhjb");
      this.yhflList = hiddenDangerCategory.data;
      this.yhjbList = hiddenDangerLevel.data;
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
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey;
      if (btnKey === "submit") return;
      let extData = {};
      extData["safetySupervisionEngineer"] = {
        type: "user",
        value: this.formData.safetySupervisionEngineer,
      };
      // extData["constructionSafetyManager"] = {
      //   type: "user",
      //   value: this.formData.constructionSafetyManager
      // };
      extData["hiddenDangerLevel"] = {
        type: "string",
        value: this.formData.hiddenDangerLevel,
      };
      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    async beforeSubmitButton() {
      // if (this.formData.matterTaskTodo.procTaskName == "隐患整改") {
      let extData = {};
      //   extData["supervision"] = {
      //     type: "boolean",
      //     value: Boolean(this.formData.supervision)
      //   };
      extData["constructionSafetyManager"] = {
        type: "user",
        value: this.formData.constructionSafetyManager,
      };
      this.sendFlowJson = extData;
      // }
    },
    save(fields, callback, event) {
      this.formData.rectifyDate = dateFormat(
        this.formData.rectifyDate,
        "YYYY-MM-DD"
      );
      this.formData.rectifyState = this.formData.rectifyState || 1;
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
      } else {
        this.$set(this.formData, "hiddenDangerReportor", this.userInfo.userId);
        this.$set(
          this.formData,
          "hiddenDangerReportorFullname",
          this.userInfo.realName
        );
        this.$set(
          this.formData,
          "hiddenDangerReportorDeptName",
          this.userInfo.departName
        );
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

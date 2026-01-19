<template>
  <div style="padding: 10px">
    <el-form
      ref="dataFormRef"
      :model="formData"
      :rules="formDataRules"
      label-width="auto"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入"
              :disabled="readonly"
              maxlength="50"
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
              style="width: 100%"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定位" prop="locationDesc">
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
        <el-col :span="24">
          <el-form-item label="问题内容" prop="problemContent">
            <el-input
              v-model="formData.problemContent"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入"
              :disabled="readonly"
              maxlength="2000"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="整改要求及处理意见" prop="rectifyComment">
            <el-input
              v-model="formData.rectifyComment"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入"
              :disabled="readonly"
              maxlength="2000"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="24">
        <el-form-item label="整改前照片" prop="beforeFileToken">
          <uploadFile
            v-model="formData.beforeFileToken"
            accept=".png,.jpg,.jpeg"
            :limit="5"
            :max-size="50"
            :readonly="readonly"
          />
        </el-form-item>
      </el-col>
      <el-row>
        <el-col v-if="flowShow('rectifyMeasures')" :span="24">
          <el-form-item label="整改措施" prop="rectifyMeasures">
            <el-input
              v-model="formData.rectifyMeasures"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入"
              :disabled="flowDisabled('rectifyMeasures')"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col v-if="flowShow('rectifySituation')" :span="24">
          <el-form-item label="整改情况" prop="rectifySituation">
            <el-input
              v-model="formData.rectifySituation"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入"
              :disabled="flowDisabled('rectifySituation')"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col v-if="flowShow('afterFileToken')" :span="24">
          <el-form-item label="整改后照片" prop="afterFileToken">
            <uploadFile
              v-model="formData.afterFileToken"
              accept=".png,.jpg,.jpeg"
              :limit="5"
              :max-size="50"
              :readonly="flowDisabled('afterFileToken')"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="问题上报人" prop="problemReportorFullname">
            <el-input v-model="formData.problemReportorFullname" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上报人部门" prop="problemReportorDeptName">
            <el-input v-model="formData.problemReportorDeptName" disabled />
          </el-form-item>
        </el-col>
        <el-col v-if="flowShow('constructionQuality')" :span="12">
          <el-form-item label="施工质量负责人" prop="constructionQuality">
            <user
              v-model="formData.constructionQuality"
              :readonly="flowDisabled('constructionQuality')"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="flowShow('cualitySupervision')" :span="12">
          <el-form-item label="质量监理" prop="cualitySupervision">
            <user
              v-model="formData.cualitySupervision"
              :readonly="flowDisabled('cualitySupervision')"
              :enable-throttle="true"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { save, getSection } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { fromApp } from "@/utils/index";
import { dateFormat } from "@/utils";
import bimPoint from "@/components/Bim/Point/index";
export default {
  name: "DataForm",
  components: { bimPoint },
  mixins: [FlowFormMixin],
  data() {
    return {
      isFormApp: false,
      //合同信息字典
      formData: {},
      formDataRules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        pbsCode: [{ required: true, message: "请选择", trigger: "change" }],
        rectifyDate: [{ required: true, message: "请选择", trigger: "change" }],
        locationDesc: [{ required: true, message: "请输入", trigger: "blur" }],
        problemContent: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        constructionQuality: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        cualitySupervision: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        // problemChecker: [{ required: true, message: "请选择", trigger: "change" }],
        // problemRectifier: [{ required: true, message: "请选择", trigger: "change" }],
        // problemRectifyApprover: [
        //   { required: true, message: "请选择", trigger: "change" }
        // ],
        sectionId: [{ required: true, message: "请选择", trigger: "change" }],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/quality/Inspect/page",
      },
      sectionList: [],
    };
  },
  computed: {
    // 审批字段的禁用
    flowDisabled() {
      return (field) => {
        let disabled = true;
        switch (field) {
          case "constructionQuality":
            disabled =
              !(
                this.formData.id &&
                this.formData.matterTaskTodo?.procTaskName == "质量监理工程师"
              ) && !(!this.formData.id && this.formData.corpType == "jldw");
            break;
          case "cualitySupervision":
            disabled =
              !(this.formData.corpType == "yzdw" && !this.formData.id) &&
              !(
                this.formData.id &&
                this.formData.matterTaskTodo?.procTaskName == "施工质量负责人"
              );
            break;
          case "rectifyMeasures":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName != "施工质量负责人";
            break;
          case "rectifySituation":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName != "施工质量负责人";
            break;
          case "afterFileToken":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName != "施工质量负责人";
            break;
        }
        return Boolean(disabled);
      };
    },
    // 审批字段的显示
    flowShow() {
      return (field) => {
        let show = true;
        console.log("needShow", this.formData);
        let procTaskName = this.formData.matterTaskTodo?.procTaskName;
        switch (field) {
          case "constructionQuality":
            show =
              (this.formData.corpType == "jldw" && !this.formData.id) ||
              procTaskName;
            break;
          case "cualitySupervision":
            show =
              procTaskName ||
              (!this.formData.id && this.formData.corpType == "yzdw");
            break;
          case "rectifyMeasures":
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.matterTaskTodo &&
                this.formData.matterTaskTodo?.procTaskName != "质量监理工程师");
            break;
          case "rectifySituation":
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.matterTaskTodo &&
                this.formData.matterTaskTodo?.procTaskName != "质量监理工程师");
            break;
          case "afterFileToken":
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.id &&
                this.formData.matterTaskTodo &&
                this.formData.matterTaskTodo?.procTaskName != "质量监理工程师");
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
    this.isFormApp = fromApp();
    //接收控件页面的值，点击 保存到服务器 执行
    this.getSectionList();
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
      extData["constructionQuality"] = {
        type: "user",
        value: this.formData.constructionQuality,
      };
      extData["corpType"] = {
        type: "user",
        value: this.userInfo.corpDesc,
      };
      if (this.userInfo.corpDesc == "yzdw") {
        extData["createUser"] = {
          type: "user",
          value: this.formData.createUser,
        };
        extData["cualitySupervision"] = {
          type: "user",
          value: this.formData.cualitySupervision,
        };
      }

      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    async beforeSubmitButton() {
      let extData = {};
      extData["cualitySupervision"] = {
        type: "user",
        value: this.formData.cualitySupervision,
      };
      this.sendFlowJson = extData;
    },
    save(fields, callback, event) {
      this.formData.rectifyDate = dateFormat(
        this.formData.rectifyDate,
        "YYYY-MM-DD"
      );
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
        this.formData = row;
      } else {
        // this.$set(this.formData, "cualitySupervision", this.userInfo.userId);
        // this.$set(this.formData, "corpType", "yzdw");
        this.$set(this.formData, "corpType", this.userInfo.corpDesc);
        this.$set(this.formData, "problemReportor", this.userInfo.userId);
        this.$set(
          this.formData,
          "problemReportorFullname",
          this.userInfo.realName
        );
        this.$set(
          this.formData,
          "problemReportorDeptName",
          this.userInfo.departName
        );
        console.log(this.formData);
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

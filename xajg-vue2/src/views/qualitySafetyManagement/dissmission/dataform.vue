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
            <el-form-item label="质量缺陷名称" prop="name">
              <el-input
                v-model="formData.name"
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
            <el-form-item label="消缺期限" prop="resolveDate">
              <el-date-picker
                v-model="formData.resolveDate"
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
            <el-form-item label="消缺描述" prop="defectDesc">
              <el-input
                v-model="formData.defectDesc"
                placeholder="请输入"
                type="textarea"
                :rows="2"
                :disabled="readonly"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件照片" prop="attachments">
              <uploadFile
                v-model="formData.attachments"
                accept=".png,.jpg,.jpeg"
                :limit="5"
                :max-size="50"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <!-- 上报 -->
          <el-col :span="12">
            <el-form-item label="缺陷上报人" prop="defectReporterName">
              <el-input v-model="formData.defectReporterName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报人部门" prop="reporterPartName">
              <el-input v-model="formData.reporterPartName" disabled />
            </el-form-item>
          </el-col>
          <!-- 审核 -->
          <el-col :span="12">
            <el-form-item label="缺陷审核人" prop="defectAuditorAccount">
              <user
                v-model="formData.defectAuditorAccount"
                :readonly="readonly"
                @change="
                  (value, record) =>
                    handlerUserChange('auditorPartName', value, record)
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核人部门" prop="auditorPartName">
              <el-input v-model="formData.auditorPartName" disabled />
            </el-form-item>
          </el-col>
          <!-- 整改人 -->
          <el-col :span="12">
            <el-form-item label="缺陷整改人" prop="defectCorrectorAccount">
              <user
                v-model="formData.defectCorrectorAccount"
                :readonly="readonly"
                @change="
                  (value, record) =>
                    handlerUserChange('correctorPartName', value, record)
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="整改人部门" prop="correctorPartName">
              <el-input v-model="formData.correctorPartName" disabled />
            </el-form-item>
          </el-col>
          <!-- 整改审批 -->
          <el-col :span="12">
            <el-form-item label="整改审批人" prop="correctApproverAccount">
              <user
                v-model="formData.correctApproverAccount"
                :readonly="readonly"
                @change="
                  (value, record) =>
                    handlerUserChange('approverPartName', value, record)
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批人部门" prop="approverPartName">
              <el-input v-model="formData.approverPartName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import bimPoint from "@/components/Bim/Point/index";
import { save, getSection } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
const Decimal = require("decimal.js");
Decimal.set({ precision: 50 });
import { fromApp } from "@/utils/index";
import { dateFormat } from "@/utils";
export default {
  name: "DataForm",
  mixins: [FlowFormMixin],
  components: {
    bimPoint,
  },
  data() {
    return {
      isFormApp: false,
      showHiddenDangerRectifier: false,
      //合同信息字典
      ntkoClose: false, //签章组件关闭状态
      formData: {},
      formDataRules: {
        pbsCode: [{ required: true, message: "请选择", trigger: "change" }],
        resolveDate: [{ required: true, message: "请选择", trigger: "change" }],
        locationDesc: [{ required: true, message: "请输入", trigger: "blur" }],
        defectDesc: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        defectAuditorAccount: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        defectCorrectorAccount: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        correctApproverAccount: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        sectionId: [
          { required: true, message: "请选择标段", trigger: "change" },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/quality/dissmission/page",
      },
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
  },
  created() {
    this.isFormApp = fromApp();
    //接收控件页面的值，点击 保存到服务器 执行
    this.getSectionList();
  },
  mounted() {
    window.ntkoCloseEvent = () => {
      //发送时才触发
    };
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
      extData["qxsh"] = {
        type: "user",
        value: this.formData.defectAuditorAccount,
      };
      extData["qxzg"] = {
        type: "user",
        value: this.formData.defectCorrectorAccount,
      };
      extData["zgsp"] = {
        type: "user",
        value: this.formData.correctApproverAccount,
      };
      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    save(fields, callback, event) {
      this.formData.resolveDate = dateFormat(
        this.formData.resolveDate,
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
        this.$set(this.formData, "defectReporterAccount", this.userInfo.userId);
        this.$set(this.formData, "defectReporterName", this.userInfo.realName);
        this.$set(this.formData, "reporterPartName", this.userInfo.departName);
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

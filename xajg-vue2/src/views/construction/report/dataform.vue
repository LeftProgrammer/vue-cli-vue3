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
          <el-form-item label="计划名称" prop="name">
            <el-input v-model="formData.name" :disabled="readonly" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="计划版本" prop="version">
            <el-input
              v-model="formData.version"
              :disabled="readonly"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="formData.type"
              :disabled="readonly"
              class="w-100pre"
              placeholder="请选择"
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in jdjhlxList"
                :key="item.dictName"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编制人" prop="organizer">
            <user
              v-model="formData.organizer"
              :readonly="readonly"
              @change="
                (value, record) => handlerUserChange('organizerFullname', value, record)
              "
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标段" prop="sectionId">
            <el-select
              v-model="formData.sectionId"
              :disabled="readonly"
              class="w-100pre"
              placeholder="请选择"
              @visible-change="$visibleChange($event, 'el-popper')"
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
        <!-- <el-col :span="12">
          <el-form-item label="使用版本" prop="version">
            <el-input
              v-model="formData.version"
              placeholder="请输入"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="附件" prop="uploadFile">
            <uploadFile
              v-model="formData.uploadFile"
              :limit="5"
              :max-size="50"
              :readonly="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="录入人" prop="persons">
            <user
              v-model="formData.persons"
              :readonly="readonly"
              @change="
                (value, record) => handlerUserChange('personsFullname', value, record)
              "
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="录入时间" prop="inputDate">
            <el-date-picker
              v-model="formData.inputDate"
              :disabled="readonly"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { save, sectionList } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
const Decimal = require("decimal.js");
Decimal.set({ precision: 50 });
import { fromApp } from "@/utils/index";
import { dateFormat } from "@/utils";
export default {
  name: "DataForm",
  mixins: [FlowFormMixin],
  data() {
    return {
      isFormApp: false,
      //合同信息字典
      ntkoClose: false, //签章组件关闭状态
      formData: {},
      formDataRules: {
        pbsCode: [{ required: true, message: "请选择", trigger: "change" }],
        rectifyDate: [{ required: true, message: "请选择", trigger: "change" }],
        locationDesc: [{ required: true, message: "请输入", trigger: "blur" }],
        problemContent: [{ required: true, message: "请输入", trigger: "blur" }],
        problemChecker: [{ required: true, message: "请选择", trigger: "change" }],
        problemRectifier: [{ required: true, message: "请选择", trigger: "change" }],
        problemRectifyApprover: [{ required: true, message: "请选择", trigger: "change" }]
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/construction/plan/page"
      },
      jdjhlxList: [],
      sectionList: []
    };
  },
  computed: {
    showSign() {
      if (this.flowAuths?.stamp?.read) {
        return true;
      } else {
        return false;
      }
    },
    // 是否展示审批人
    freeFlowInputShow() {
      let show = false;
      if (this.formData?.flowInfo?.page != "fine") {
        if (Object.keys(this.formData).length === 0 || !this.formData?.flowStatus) {
          show = true;
        }
      }
      return show;
    },
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    }
  },
  created() {
    this.isFormApp = fromApp();
    //接收控件页面的值，点击 保存到服务器 执行
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
      this.$set(this.formData, filed, record.realName);
    },
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey;
      if (btnKey === "send" && !this.formData.uploadFile) {
        this.$message.warning("请先上传附件");
        return false;
      }
      if (btnKey === "submit") return;
      let extData = {};
      this.sendFlowJson = extData;
    },
    save(fields, callback, event) {
      this.formData.inputDate = dateFormat(this.formData.inputDate, "YYYY-MM-DD");
      const isMaintenance = event.data.btnKey === "maintenance";
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: "maintenance"
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
      this.jdjhlxList = await this.$store.dispatch("dict/get", "jdjhlx");
      // 获取标段
      const { data } = await sectionList({});
      this.sectionList = data;
      if (row) {
        this.formData = row;
      } else {
        // this.$set(this.formData, "problemReportor", this.userInfo.userId);
        // this.$set(this.formData, "problemReportorFullname", this.userInfo.realName);
        // this.$set(this.formData, "problemReportorDeptName", this.userInfo.departName);
      }
    }
  }
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

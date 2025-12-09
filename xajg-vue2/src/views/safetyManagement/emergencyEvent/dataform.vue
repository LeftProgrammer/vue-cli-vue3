<template>
  <div style="padding: 10px">
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                v-model="formData.type"
                :disabled="readonly"
                placeholder="请选择"
                @change="changeType"
                clearable
              >
                <el-option label="快报" value="kb"></el-option>
                <el-option label="后续报告" value="hxbg"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="编号" prop="code">
              <el-input
                v-model="formData.code"
                :disabled="isEdit"
                show-word-limit
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="突发事件信息名称" prop="name">
              <el-input
                v-model="formData.name"
                :disabled="isEdit"
                show-word-limit
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input
                v-model="formData.contactPerson"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input
                v-model="formData.contactPhone"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.type == 'kb'" :span="12">
            <el-form-item label="发现时间" prop="emergencyDate">
              <el-date-picker
                v-model="formData.emergencyDate"
                :disabled="isEdit"
                type="datetime"
                style="width: 100%"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.type == 'kb'" :span="12">
            <el-form-item label="事件单位" prop="unit">
              <el-select
                v-model="formData.unit"
                class="w-100pre"
                placeholder="请选择"
                :disabled="isEdit"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="formData.type == 'hxbg'" :span="12">
            <el-form-item label="发报单位" prop="unit">
              <el-select
                v-model="formData.unit"
                class="w-100pre"
                placeholder="请选择"
                :disabled="isEdit"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="formData.type == 'kb'" :span="24">
            <el-form-item label="发生地点" prop="address">
              <el-input
                v-model="formData.address"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.type == 'hxbg'" :span="24">
            <el-form-item label="事件进展情况描述" prop="eventProgress">
              <el-input
                v-model="formData.eventProgress"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div
          v-if="formData.type == 'kb'"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          "
        >
          <DefaultTitle title="事件现场负责人" />
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="siteCustodian">
              <el-input
                v-model="formData.siteCustodian"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="siteCustodianPhone">
              <el-input
                v-model="formData.siteCustodianPhone"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div
          v-if="formData.type == 'kb'"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          "
        >
          <DefaultTitle title="事件单位负责人" />
        </div>
        <el-row v-if="formData.type == 'kb'">
          <el-col :span="12">
            <el-form-item label="姓名" prop="unitCustodian">
              <el-input
                v-model="formData.unitCustodian"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="unitCustodianPhone">
              <el-input
                v-model="formData.unitCustodianPhone"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div
          v-if="formData.type == 'kb'"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          "
        >
          <DefaultTitle title="事件已死亡/失踪人数" />
        </div>
        <el-row v-if="formData.type == 'kb'">
          <el-col :span="12">
            <el-form-item label="死亡" prop="deathToll">
              <el-input
                v-model="formData.deathToll"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失踪" prop="missingNum">
              <el-input
                v-model="formData.missingNum"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div
          v-if="formData.type == 'kb'"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          "
        >
          <DefaultTitle title="事件受伤人数" />
        </div>
        <el-row v-if="formData.type == 'kb'">
          <el-col :span="12">
            <el-form-item label="重伤" prop="seriousInjury">
              <el-input
                v-model="formData.seriousInjury"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="轻伤" prop="minorInjury">
              <el-input
                v-model="formData.minorInjury"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.type == 'kb'">
          <el-col :span="6">
            <el-form-item
              label="初步估算直接经济损失（万元）"
              prop="economicLosses"
            >
              <el-input-number
                v-model="formData.economicLosses"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="突发事件简要经过" prop="eventBrief">
              <el-input
                v-model="formData.eventBrief"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="现场情况、原因分析及采取的主要措施"
              prop="majorMeasure"
            >
              <el-input
                v-model="formData.majorMeasure"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他情况" prop="otherSituation">
              <el-input
                v-model="formData.otherSituation"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="对应处室负责人" prop="emergencyEventManage">
              <user
                v-model="formData.emergencyEventManage"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="flowShow('professionalManagement')" :span="12">
            <el-form-item label="专业分管副总" prop="professionalManagement">
              <user
                v-model="formData.professionalManagement"
                :readonly="flowDisabled('professionalManagement')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { save, page, unitAllList } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { dateFormat } from "@/utils";
import { readonly } from "vue";
export default {
  name: "DataForm",
  mixins: [FlowFormMixin],
  data() {
    return {
      formData: {
        type: "kb", // 设置默认值
      },
      formDataRules: {
        type: [{ required: true, message: "请选择", trigger: "change" }],
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        emergencyDate: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        address: [{ required: true, message: "请输入", trigger: "blur" }],
        unit: [{ required: true, message: "请选择", trigger: "change" }],
        siteCustodian: [{ required: true, message: "请输入", trigger: "blur" }],
        siteCustodianPhone: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码",
            trigger: "blur",
          },
        ],
        unitCustodian: [{ required: true, message: "请输入", trigger: "blur" }],
        unitCustodianPhone: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码",
            trigger: "blur",
          },
        ],
        deathToll: [
          {
            required: true,
            pattern: /^[0-9]+$/,
            message: "请输入数字",
            trigger: "blur",
          },
        ],
        missingNum: [
          {
            required: true,
            pattern: /^[0-9]+$/,
            message: "请输入数字",
            trigger: "blur",
          },
        ],
        seriousInjury: [
          {
            required: true,
            pattern: /^[0-9]+$/,
            message: "请输入数字",
            trigger: "blur",
          },
        ],
        minorInjury: [
          {
            required: true,
            pattern: /^[0-9]+$/,
            message: "请输入数字",
            trigger: "blur",
          },
        ],
        economicLosses: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        eventBrief: [{ required: true, message: "请输入", trigger: "blur" }],
        majorMeasure: [{ required: true, message: "请输入", trigger: "blur" }],
        otherSituation: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        eventProgress: [{ required: true, message: "请输入", trigger: "blur" }],
        emergencyEventManage: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        contactPerson: [{ required: true, message: "请输入", trigger: "blur" }],
        contactPhone: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号码",
            trigger: "blur",
          },
        ],
        professionalManagement: [
          { required: true, message: "请选择", trigger: "change" },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/safe/event/page",
      },
      dialogVisible: false,
      tableData: [],
      unitList: [],
    };
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },

    isEdit() {
      if (this.formData.flowStatus == 2 || this.flowInfo?.page == "fine") {
        return Boolean(true);
      } else {
        return Boolean(false);
      }
    },

    // 审批字段的禁用
    flowDisabled() {
      return (field) => {
        let disabled = true;
        switch (field) {
          case "emergencyEventManage":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName != "对应处室负责人";
            break;
          case "professionalManagement":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName != "对应处室负责人";
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
          case "emergencyEventManage":
            show =
              this.formData.id &&
              (this.formData.matterTaskTodo?.procTaskName ||
                this.formData.flowStatus == 2);
            break;
          case "professionalManagement":
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.id &&
                this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName ==
                  "对应处室负责人") ||
              this.formData.professionalManagement != null;
            break;
        }
        return Boolean(show);
      };
    },
  },
  created() {
    this.getUnit();
  },
  methods: {
    changeType(val) {
      console.log("ssssssssssssss", val);
    },
    // 获取所有的单位
    async getUnit() {
      try {
        const result = await unitAllList();
        const { data, success } = result;
        if (!success) {
          this.$message.error("获取单位列表失败");
          return;
        }
        this.unitList = data
          .filter((x) => x.corpPid)
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
      } catch (err) {
        console.log("err", err);
      }
    },
    handlerUserChange(filed, value, record) {
      this.$set(this.formData, filed, record.realName);
      console.log("formdata", this.formData);
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow();
      if (row) {
        // Object.assign(this.formData, row);
        this.formData = row;
        this.formData.date = [
          new Date(row.startTime + ":00:00"),
          new Date(row.endTime + ":00:00"),
        ];
        console.log(this.formData);
      }
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
      fields.createUsername = this.userInfo.realName;
      delete fields.date;
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
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey;
      if (btnKey === "submit") return;
      let extData = {};
      extData["emergencyEventManage"] = {
        type: "user",
        value: this.formData.emergencyEventManage,
      };
      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    async beforeSubmitButton() {
      let extData = {};
      extData["professionalManagement"] = {
        type: "user",
        value: this.formData.professionalManagement,
      };
      this.sendFlowJson = extData;
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteRow(index) {
      this.tableData.splice(index, 1);
      this.multipleSelection.splice(index, 1);
    },
    handelAdd() {
      this.dialogVisible = false;
      this.tableData = JSON.parse(JSON.stringify(this.multipleSelection));
    },
  },
};
</script>

<style scoped lang="scss"></style>
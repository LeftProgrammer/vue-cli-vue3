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
            <el-form-item label="日期" prop="date">
              <el-date-picker
                v-model="formData.date"
                style="width: 100%"
                :disabled="isEdit"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-form-item label="天气" prop="weather">
              <el-input
                v-model="formData.weather"
                :disabled="isEdit"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="降雨量" prop="rainfall">
              <el-input
                v-model="formData.rainfall"
                :disabled="isEdit"
                show-word-limit
              >
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="监测站" prop="monitoringStation">
              <el-input
                v-model="formData.monitoringStation"
                :disabled="isEdit"
                show-word-limit
              >
                <template #append>雨量站</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          "
        >
          <DefaultTitle title="巡查排险情况" />
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="风险项目" prop="riskSituation">
              <el-input
                v-model="formData.riskSituation"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他项目">
              <span>无异常。</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          "
        >
          <DefaultTitle title="未来3天天气预报情况" />
        </div>
        <el-row>
          <div>
            填写工程沿线区域当天及未来3天天气预报降雨情况，区域无降雨时不填写
            <br />
            <br />
          </div>
          <el-col :span="12">
            <el-form-item label="日期范围" prop="dateThree">
              <el-date-picker
                v-model="formData.dateThree"
                style="width: 100%"
                :disabled="isEdit"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地点" prop="address">
              <el-input
                v-model="formData.address"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 2, maxRows: 3 }"
                show-word-limit
                maxlength="50"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="审批人" prop="teamLeader">
              <user
                v-model="formData.teamLeader"
                :readonly="readonly"
                @change="
                  (value, record) =>
                    handlerUserChange('teamLeaderName', value, record)
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起人" prop="createUsername">
              <el-input
                v-model="formData.createUsername"
                disabled
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
import { save, page } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { dateFormat } from "@/utils";
export default {
  name: "DataForm",
  mixins: [FlowFormMixin],
  data() {
    return {
      formData: {
        date: [new Date(), new Date()],
      },
      formDataRules: {
        date: [{ required: true, message: "请选择", trigger: "change" }],
        weather: [{ required: true, message: "请输入", trigger: "blur" }],
        teamLeader: [{ required: true, message: "请选择", trigger: "change" }],
        rainfall: [{ required: true, message: "请输入", trigger: "blur" }],
        monitoringStation: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        riskSituation: [
          { required: true, message: "请输入", trigger: "change" },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/safe/floodControlDaily/page",
      },
      dialogVisible: false,
      tableData: [],
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
  },
  mounted() {
    this.setDefaultTime();
  },
  created() {},
  methods: {
    handlerUserChange(filed, value, record) {
      this.$set(this.formData, filed, record.realName);
      console.log("formdata", this.formData);
    },
    setDefaultTime() {
      const start = new Date();
      const end = new Date();

      // 设置默认的开始时间和结束时间
      start.setHours(7, 0, 0, 0); // 07:00:00
      end.setHours(19, 0, 0, 0); // 19:00:00

      this.formData.date = [start, end];

      this.formData.createUsername = this.userInfo.realName;
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow();
      if (row) {
        // Object.assign(this.formData, row);
        this.formData = row;
        this.formData.date = [new Date(row.startTime), new Date(row.endTime)];
        if (row.startDate) {
          this.formData.dateThree = [
            new Date(row.startDate),
            new Date(row.endDate),
          ];
        }
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
      fields.startTime = dateFormat(fields.date[0], "yyyy-MM-DD HH:mm:ss");
      fields.endTime = dateFormat(fields.date[1], "yyyy-MM-DD HH:mm:ss");
      fields.startDate = fields.dateThree
        ? dateFormat(fields.dateThree[0], "yyyy-MM-DD")
        : "";
      fields.endDate = fields.dateThree
        ? dateFormat(fields.dateThree[1], "yyyy-MM-DD")
        : "";
      if(!fields.createUsername){
        fields.createUsername = this.userInfo.realName;
      }
      delete fields.date;
      delete fields.dateThree;
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
      extData["teamLeader"] = {
        type: "user",
        value: this.formData.teamLeader,
      };
      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
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
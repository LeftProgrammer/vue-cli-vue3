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
          <el-col :span="13">
            <el-form-item label="值班时间" prop="date">
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
          <el-col :span="12">
            <el-form-item label="带班领导" prop="teamLeader">
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
            <el-form-item label="值班人" prop="dutyPerson">
              <user
                v-model="formData.dutyPerson"
                :readonly="readonly"
                @change="
                  (value, record) =>
                    handlerUserChange('dutyPersonName', value, record)
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="值班情况" prop="dutySituation">
              <el-input
                v-model="formData.dutySituation"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="汛情、险情情况" prop="floodSituation">
              <el-input
                v-model="formData.floodSituation"
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
              label="工程突发事件情况"
              prop="engineeringEmergencies"
            >
              <el-input
                v-model="formData.engineeringEmergencies"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="需移交下班继续办理事项" prop="transferTodo">
              <el-input
                v-model="formData.transferTodo"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他注意事项" prop="otherThings">
              <el-input
                v-model="formData.otherThings"
                type="textarea"
                :disabled="isEdit"
                :autosize="{ minRows: 4, maxRows: 6 }"
                show-word-limit
                maxlength="500"
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
      formData: {},
      formDataRules: {
        date: [{ required: true, message: "请选择", trigger: "change" }],
        dutyPerson: [{ required: true, message: "请选择", trigger: "change" }],
        teamLeader: [{ required: true, message: "请选择", trigger: "change" }],
        dutySituation: [{ required: true, message: "请输入", trigger: "blur" }],
        floodSituation: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        engineeringEmergencies: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        transferTodo: [{ required: true, message: "请输入", trigger: "blur" }],
        otherThings: [{ required: true, message: "请输入", trigger: "change" }],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/safe/flood/page",
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
  created() {},
  methods: {
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
      fields.startTime = dateFormat(fields.date[0], "YYYY-MM-DD HH");
      fields.endTime = dateFormat(fields.date[1], "YYYY-MM-DD HH");
      if(!fields.createUsername){
        fields.createUsername = this.userInfo.realName;
      }
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
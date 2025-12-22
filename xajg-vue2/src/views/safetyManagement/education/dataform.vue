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
          <el-col :span="12">
            <el-form-item label="班组名称" prop="teamName">
              <el-input
                v-model="formData.teamName"
                placeholder="请输入"
                :disabled="readonly"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班组长" prop="teamLeader">
              <el-input
                v-model="formData.teamLeader"
                placeholder="请输入"
                :disabled="readonly"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="站班会地点" prop="location">
              <el-input
                v-model="formData.location"
                :disabled="readonly"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主持人" prop="compere">
              <el-input
                v-model="formData.compere"
                :disabled="readonly"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="天气情况" prop="weather">
              <el-input
                v-model="formData.weather"
                :disabled="readonly"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="站班会日期"
              prop="educationDate"
              :disabled="readonly"
            >
              <el-date-picker
                v-model="formData.educationDate"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应参与人数" prop="peopleNum">
              <el-input-number
                v-model.number="formData.peopleNum"
                :precision="0"
                :step="1"
                :min="0"
                :disabled="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际参与人数" prop="actualPeopleNum">
              <el-input-number
                v-model.number="formData.actualPeopleNum"
                :precision="0"
                :step="1"
                :min="0"
                :disabled="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细交底记录" prop="record">
              <el-input
                v-model="formData.record"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                :disabled="readonly"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="专业监理工程师"
              prop="professionalSupervisoryEngineer"
            >
              <user
                v-model="formData.professionalSupervisoryEngineer"
                :disabled="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="educationFileList" label-width="0">
              <uploadFileTable
                v-model="formData.educationFileList"
                :max-size="10"
                :readonly="readonly"
                :limit="500"
                accept="image/png,image/jpeg,image/jpg"
                :required="true"
                tips="请上传签字后的《班组安全活动记录表》，支持JPG、PNG、JPEG格式，大小10M以内"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="educationFileList1" label-width="0">
              <uploadFileTable
                v-model="formData.educationFileList1"
                :max-size="100"
                :readonly="readonly"
                :limit="500"
                accept="image/png,image/jpeg,image/jpg,video/mp4"
                :required="true"
                table-name="附件列表"
                tips="请上传班前安全教育相关照片或视频文件，支持JPG、PNG、JPEG、MP4格式，照片单张大小10M以内，视频不超过5分钟、大小100M以内"
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
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
export default {
  name: "DataForm",
  mixins: [FlowFormMixin],
  data() {
    return {
      formData: {},
      formDataRules: {
        unit: [{ required: true, message: "请选择", trigger: "change" }],
        teamName: [{ required: true, message: "请输入", trigger: "blur" }],
        teamLeader: [{ required: true, message: "请输入", trigger: "blur" }],
        location: [{ required: true, message: "请输入", trigger: "blur" }],
        compere: [{ required: true, message: "请输入", trigger: "blur" }],
        weather: [{ required: true, message: "请输入", trigger: "blur" }],
        educationDate: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        peopleNum: [{ required: true, message: "请输入", trigger: "blur" }],
        actualPeopleNum: [
          { required: true, message: "请输入", trigger: "change" },
        ],
        record: [{ required: true, message: "请输入", trigger: "blur" }],
        educationFileList: [
          { required: true, message: "请上传", trigger: "blur" },
        ],
        educationFileList1: [
          { required: true, message: "请上传", trigger: "blur" },
        ],
        professionalSupervisoryEngineer: [
          { required: true, message: "请选择", trigger: "change" },
        ],
      },
      //正在加载
      loading: false,
      url: {
        list: "/api/safe/dangerJob/page",
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
  },
  created() {
    this.getUnit();
  },
  methods: {
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow();
      if (row) {
        // Object.assign(this.formData, row);
        this.formData = row;
        this.formData.educationFileList1 =
          this.formData.educationFileList.filter((x) => x.fileType == 2);
        this.formData.educationFileList =
          this.formData.educationFileList.filter((x) => x.fileType == 1);
      } else {
        // page({
        //   current: 1,
        //   entity: {
        //     params: {
        //       type: 'tzry',
        //       state: '2'
        //     }
        //   },
        //   pageSize: 999,
        //   size: 20
        // }).then((res) => {
        //   this.staffData = res.data.records
        // })
      }
    },
    save(fields, callback, event) {
      const isMaintenance = event.data.btnKey === "maintenance";
      fields.educationFileList = [
        ...fields.educationFileList.map((x) => {
          x.fileType = 1;
          return x;
        }),
        ...fields.educationFileList1.map((x) => {
          x.fileType = 2;
          return x;
        }),
      ];
      delete fields.educationFileList1;
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
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey;
      if (btnKey === "submit") return;
      let extData = {};
      extData["professionalSupervisoryEngineer"] = {
        type: "user",
        value: this.formData.professionalSupervisoryEngineer,
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
  },
};
</script>

<style scoped lang="scss"></style>

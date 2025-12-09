<template>
  <div class="page-leave">
    <el-form
      ref="formData"
      :model="formData"
      :rules="formDataRules"
      label-width="auto"
      :disabled="formDisabled"
    >
      <el-row :gutter="gutter">
        <el-col :span="8">
          <el-form-item label="日期" size="mini" prop="logsDate">
            <el-date-picker
              v-model="formData.logsDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="班次" prop="workTime" align="center">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.workTime"
              placeholder="请选择班次"
              clearable
            >
              <el-option
                v-for="item in classs"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="天气情况" prop="weather" align="center">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.weather"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in weathers"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="监理人员" prop="supervisor">
            <el-input
              v-model="formData.supervisor"
              placeholder="请输入监理人员"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="记录人员:" prop="name">{{
            userName
          }}</el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="监理单位:" prop="supervisionUnit">
            {{ formData.supervisionUnit }}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="工程部位" prop="pbsCode" align="center">
            <el-input disabled placeholder="请选择" v-model="pbsName">
              <template slot="append">
                <div @click.stop="showPbs">选择</div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item label="备注" prop="remark" align="center">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="formData.remark"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="日志图片" prop="uploadFile">
            <el-upload
              ref="uploadFileRef"
              :file-list="uploadFileList"
              action="/api/attachments/single-upload"
              :before-upload="attachmentsBeforeUpload"
              :on-success="handelUploadSuccess"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :disabled="readonly"
              width="100%"
            >
              <el-button size="small" type="primary" icon="el-icon-upload"
                >文件上传</el-button
              >
              <div slot="tip" class="el-upload__tip">
                只能上传不超过 20MB 的文件
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <pbs-select
      :visible.sync="pbsDialog.show"
      :selection="pbsDialog.selection"
      @childEvt="pbsSelectedHandle"
      @closed="pbsDialog.show = false"
    />
  </div>
</template>

<script>
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import PbsSelect from "@/components/PbsSelect/index.vue";
import { getDictItemList } from "@/api/dict";
export default {
  components: {
    PbsSelect,
  },
  name: "dataform",
  props: {
    formDisabled: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      userName: "",
      gutter: 20,
      pbsName: "",
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },
      //当前选择行
      curRow: null,
      WorkTypes: [], //工种字典
      Equipments: [], //设备列表
      classs: [], //班次
      weathers: [], //天气
      uploadFileList: [],
      options: [],
      //月度计划列表
      tableData: [],
      showDialog: false,
      formData: {
        logsDate: "",
      },
      formDataRules: {
        logsDate: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        workTime: [
          { required: true, message: "请选择班次", trigger: "change" },
        ],
        drillingFootage: [
          { required: true, message: "请输入进尺", trigger: "blur" },
        ],
      },

      /**表单是否只读 */
      readonly: false,

      /**人员选择 */
      personDialog: {
        selection: [],
        show: false,
      },
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },

      //当前选择行
      curRow: null,

      /**组织机构选择 */
      deptShow: false,
      /**岗位 */
      dutyOptions: [],
      /**请假类型 */
      leaveCategoryOptions: [],
      /**分类类型 */
      designClassifyOptions: [],
      /**设计分类类型字典code */
      designClassifyCode: "DESIGN_CLASSIFY",
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      businessId: "",
      pacId: "",

      /**接口地址：对应list接口 */
      url: {
        list: "/api//design/plan/list",
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
  },
  created() {
    this.getWorkType();
    this.getEquipment();
    this.getClass();
    this.getWeather();
    // console.log("this.$route", this.$route);
  },
  watch: {
    uploadFileList(val) {
      let uploadFile = "";
      console.log("上传文件", val);
      val.forEach((item, index) => {
        if (val.length - 1 == index) {
          uploadFile = uploadFile + JSON.stringify(item);
        } else {
          uploadFile = uploadFile + JSON.stringify(item) + "&&&";
        }
      });
      this.formData.uploadFile = uploadFile;
    },
  },
  methods: {
    // 校验表单数据
    checkForm() {
      let flag = true;
      this.$refs["formData"].validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },

    add() {
      this.$nextTick(() => {
        console.log("this.$refs.formData", this.$refs.formData);
        this.$refs.formData.resetFields();
        this.formData = {};
        let userInfo = this.$getStorage("userInfo");
        this.userName = userInfo.realName;
        console.log("this.formData", userInfo);
        // this.formData.supervisionUnit = userInfo.departId;
        // 直接存单位名称
        this.uploadFileList = [];
        this.pbsName = null;
        this.formData.supervisionUnit = userInfo.departName;
      });
    },
    getPbsName(val) {
      let text = "*";
      console.log("getPbsName", val);
      let a = val?.split("&&&")[1];
      if (a) {
        text = a;
      }
      return text;
    },
    edit(row) {
      this.uploadFileList = [];
      console.log("row", row);
      if (row?.logsDate) {
        row.logsDate = this.timeFormat(row.logsDate, "yyyy-MM-DD");
      }
      // 处理文件
      this.uploadFileList = [];
      if (row?.uploadFile) {
        console.log("uploadFile", row.uploadFile);
        let List = [];
        let uploadFileList = row?.uploadFile?.split("&&&");
        uploadFileList.forEach((item) => {
          if (item) {
            List.push(JSON.parse(item));
          }
        });
        this.uploadFileList = List;
      }
      if (row?.pbsCode) {
        this.pbsName = this.getPbsName(row.pbsCode);
      }
      if (row.createUsername) {
        this.userName = row.createUsername;
      } else {
        this.userName = this.$store.state.user.loginInfo.realName;
      }
      this.formData = { ...row };
    },
    //
    /**获取班次字典 */
    async getWeather() {
      const { data } = await getDictItemList("WEATHER");
      this.weathers = data;
      console.log("weathers", data);
    },

    /**获取班次字典 */
    async getClass() {
      const { data } = await getDictItemList("CLASS");
      this.classs = data;
      console.log("classs", data);
    },
    /**获取工种字典 */
    async getWorkType() {
      const { data } = await getDictItemList("TYPE_OF_WORKk");
      this.WorkTypes = data;
      console.log("WorkTypes", data);
    },

    /**获取设备字典 */
    async getEquipment() {
      const { data } = await getDictItemList("EQUIPMENT");
      this.Equipments = data;
      console.log("Equipments", data);
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**
     * 附件上传成功
     */
    handelUploadSuccess(res) {
      this.uploadFileList.push(res.data);
    },
    /**
     * 附件删除
     */
    handleRemove(file) {
      this.uploadFileList = this.uploadFileList.filter(
        (item) => item.fileId !== file.fileId
      );
    },
    /**
     * 附件预览
     */
    handlePreview(file) {
      window.open(window.location.origin + `${file.requestUri}`, "_blank");
    },
    /**
     * 附件上传前
     */
    attachmentsBeforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 < 20;
      if (!isRightSize) {
        this.$message.error("文件大小超过 20MB");
        return false;
      }
      return isRightSize;
    },
    /** 选择PBS */
    showPbs() {
      if (this.formDisabled) {
        //警告查看页面不能选编辑
        this.$message.warning("警告查看页面不能选编辑");
        return;
      }
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      console.log("pbs", pbs);
      this.formData.pbsCode = pbs.code + "&&&" + pbs.name;
      this.pbsName = pbs.name;
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  .table {
    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}

.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}

.bottom-line {
  margin: 10px 0;
  height: 1px;
  background-color: #e5e5ee;
}
/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
</style>

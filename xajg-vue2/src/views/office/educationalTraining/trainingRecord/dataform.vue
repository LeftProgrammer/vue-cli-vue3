<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      v-draggable
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="50%"
      @closed="closedHandle"
    >
      <el-row>
        <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="formDataRules"
          label-width="120px"
          :disabled="readonly"
        >
          <el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="培训名称" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="formData.name"
                    show-word-limit
                    maxlength="100"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="关联培训计划" prop="trainName">
                  <el-input
                    disabled
                    placeholder="请选择"
                    v-model="formData.trainName"
                  >
                    <template slot="append" v-if="type !== 'view'">
                      <div @click.stop="showPbs">选择</div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="关联资料" prop="profileName">
                  <el-input
                    disabled
                    placeholder="请选择"
                    v-model="formData.profileName"
                  >
                    <template slot="append" v-if="type !== 'view'">
                      <div @click.stop="showPbs1">选择</div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="类型" prop="type">
                  <el-select
                    @visible-change="$visibleChange($event, 'el-popper')"
                    v-model="formData.type"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in DitSpeciality"
                      :key="item.dictId"
                      :label="item.dictName"
                      :value="item.dictId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="培训日期" prop="trainDate">
                  <el-date-picker
                    v-model="formData.trainDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="培训内容" prop="content">
                  <el-input
                    placeholder="请输入"
                    v-model="formData.content"
                    show-word-limit
                    maxlength="500"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="培训对象" prop="trainObject">
                  <el-input
                    placeholder="请输入"
                    v-model="formData.trainObject"
                    show-word-limit
                    maxlength="200"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="培训目的" prop="trainTarget">
                  <el-input
                    placeholder="请输入"
                    v-model="formData.trainTarget"
                    show-word-limit
                    maxlength="200"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="备注" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="formData.remark"
                    show-word-limit
                    maxlength="30"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="主持人" prop="mc">
                  <el-input v-model="formData.mc" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="参训人数" prop="peopleNum">
                  <el-input
                    type="number"
                    v-model="formData.peopleNum"
                    placeholder="请输入内容"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="培训地点" prop="address">
                  <el-input
                    v-model="formData.address"
                    placeholder="请输入内容"
                    show-word-limit
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="培训资料" prop="uploadFile">
                  <uploadFile
                    :readonly="readonly"
                    v-model="formData.uploadFile"
                    :limit="1"
                    :maxSize="500"
                    accept=".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx,.rtf.mp4,.flv,.flvx,.mvb,ppt,.xls,.xlsx,.pptx"
                  >
                  </uploadFile>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="培训图片" prop="signFigure">
                  <uploadFile
                    :readonly="readonly"
                    v-model="formData.signFigure"
                    :limit="1"
                    :listType="'picture-card'"
                    accept=".png,.jpg,.jpeg,.jpeg"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="培训签到表：" prop="signTable">
                  <uploadFile
                    :readonly="readonly"
                    v-model="formData.signTable"
                    :limit="1"
                    :maxSize="100"
                    accept=".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx,.rtf.mp4,.flv,.flvx,.mvb,ppt,.xls,.xlsx,.pptx"
                  >
                  </uploadFile>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
        </el-form>
      </el-row>

      <pbs-select
        :visible.sync="pbsDialog.show"
        :selection="pbsDialog.selection"
        :unitId="unitId"
        @childEvt="pbsSelectedHandle"
        @closed="pbsDialog.show = false"
      />
      <pbs-select1
        :visible.sync="pbsDialog1.show"
        :selection="pbsDialog1.selection"
        :unitId="unitId"
        @childEvt1="pbsSelectedHandle1"
        @closed="pbsDialog1.show = false"
      />

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="childEvtHandle" v-if="type != 'view'">
          确 定
        </el-button>
      </div>

      <cor-select :visible.sync="deptDialog.show" />
    </el-dialog>
    <el-dialog
      width="80%"
      title="关联培训计划选择"
      :visible.sync="dialogPlanVisible"
    >
      <components
        :page="'drawingSupply'"
        ref="components"
        :is="component"
      ></components>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlanVisible = false">取 消</el-button>
        <el-button type="primary"  @click="sure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showimg">
      <img width="100%" :src="showimgUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  add,
  save,
  remove,
  update,
  update1,
  page,
  list,
  detailList,
} from "./api";
import { dateFormat } from "@/utils";
import { getDictItemList } from "@/api/dict";
import CorSelect from "@/components/CorSelect/dialog/index.vue";
import { mapGetters } from "vuex";
import { numberParseChina } from "@/utils/math";
import PbsSelect from "@/components/PbsSelect/index3.vue";
import PbsSelect1 from "@/components/PbsSelect/index4.vue";
import ContentLayout from "@/components/ContentLayout/Table";
import { FormMixin } from "@/mixins/FormMixin";
import MonthlyPlan from "@/components/MonthlyPlan/index.vue";
export default {
  props: {
    readonly: {
      default: false,
    },
  },
  name: "dataform",
  mixins: [FormMixin],
  components: {
    CorSelect,
    PbsSelect,
    PbsSelect1,
    ContentLayout,
    MonthlyPlan,
  },
  data() {
    return {
      baseUrl: "",
      showimgUrl: "",
      component: "MonthlyPlan",
      uploadFileList1: [],
      uploadFileList2: [],
      uploadFileList3: [],
      dialogPlanVisible: false,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },
      /**PBS选择 */
      pbsDialog1: {
        selection: [],
        show: false,
      },
      DitSpeciality: [],
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      formData: {
        id: null,
      },
      formDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        point: [{ required: true, message: "请输入编码", trigger: "blur" }],
        type: [{ required: true, message: "请选择", trigger: "change" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        signTable: [{ required: true, message: "请选择", trigger: "change" }],
        signFigure: [{ validator: this.signFigurevalidFile, required: true }],
        mc: [{ required: true, message: "请输入主持人", trigger: "blur" }],
        peopleNum: [
          { required: true, message: "请输入参训人数", trigger: "blur" },
        ],
        trainDate: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
      },
      unitId: "",
      tableData: [],
      showimg: false,
      /**部门选择 */
      deptDialog: {
        selection: [],
        show: false,

        /**业务数据 */
        data: {},
        /**业务字段 */
        fields: [],
      },
      deptTypes: [],

      /**组织机构选择 */
      deptShow: false,

      /**类型字典 */
      jcxm: {
        code: "pxzllx",
        options: [],
      },
      plan: {},
      corpId: "",
      trainDetailId: "",
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
  },
  async created() {
    this.baseUrl = window.location.origin;
    this.jcxmDictItem(this.jcxm.code);
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    signFigurevalidFile(rule, value, callback) {
      if (!value) {
        callback(new Error("请上传培训图片"));
        return
      }
      let json = JSON.parse(value);
      console.log("json", json);
      if (json && Array.isArray(json) && json.length > 0) {
        callback();
      } else {
        callback(new Error("请上传培训图片"));
      }
    },
    /** 选择PBS */
    showPbs() {
      if (this.readonly) return;
      this.pbsDialog.show = true;
    },
    /** 选择PBS */
    showPbs1() {
      if (this.readonly) return;
      this.pbsDialog1.show = true;
    },
    sure() {
      let currentRow = this.$refs.components.currentRow;
      debugger;
      console.log("关联培训计划选择", currentRow);
      if (currentRow) {
        // 2023-08 xxxxx图纸
        if (this.component == "MonthlyPlan") {
          this.planId = `${currentRow.month} ${currentRow.taskName}`;
          this.formData.pbsCode = currentRow.id;
          this.formData.pbsName = currentRow.taskName;
        } else {
          this.formData.designSupply.code = currentRow.code;
          this.formData.designSupply.name = currentRow.name;
        }
      }
      this.$nextTick(() => {
        this.dialogPlanVisible = false;
      });
    },
    //获取监测项目字典
    async jcxmDictItem(code) {
      const { data } = await getDictItemList(code);
      this.DitSpeciality = data;
    },
    /** 选择PBS */
    showPbs() {
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      debugger;
      if (pbs) {
        this.plan = pbs;
        this.formData.trainPlanId = pbs.baseId;
        this.formData.trainDetailId = pbs.id;
        this.formData.trainName = pbs.name;
      } else {
        this.plan = "";
        this.formData.trainPlanId = "";
        this.formData.trainDetailId = "";
        this.formData.trainName = "";
      }
    },
    pbsSelectedHandle1(pbs) {
      if (pbs) {
        this.formData.profileId = pbs.id;
        this.formData.profileName = pbs.name;
      } else {
        this.formData.profileId = "";
        this.formData.profileName = "";
      }
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      //做业务数据的保存,修改。
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          if (this.type == "view") {
            this.dialogShow = false;
            return;
          }
          let fields = { ...this.formData };
          fields.corpId = this.treeNode.corpId;
          if (this.type == "add") {
            save(fields)
              .then((res) => {
                const { success, message, data } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$message.success("新增成功!");
                  this.$emit("ok");
                  let obj = {
                    id: this.plan.id,
                    state: 2,
                  };
                  this.updatePlan(obj);
                }
                this.closedHandle(1);
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("新增失败");
                debugger;
              });
          } else {
            update(fields)
              .then((res) => {
                const { success, message, data } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$message.success("保存成功!");
                  this.$emit("ok");
                  if (this.plan.id !== this.trainDetailId) {
                    let obj = {
                      id: this.trainDetailId,
                      state: 1,
                    };
                    this.updatePlan(obj);
                  }
                  let obj = {
                    id: this.plan.id,
                    state: 2,
                  };
                  this.updatePlan(obj);
                }
                this.closedHandle();
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("更新失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updatePlan(obj) {
      update1(obj);
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          let newData = { ...this.data };
          this.formData = newData;
          if (this.type == "add") {
            this.tableData = [];
          } else {
            this.cover = this.baseUrl + this.formData.signFigure;
            this.uploadFileList2 = JSON.parse(this.formData.signTable) || [];
            this.uploadFileList1 = JSON.parse(this.formData.uploadFile) || [];
            this.uploadFileList3 = JSON.parse(this.formData.signFigure) || [];
            let trainDate = dateFormat(this.formData.trainDate, "YYYY-MM-DD");
            this.$set(this.formData, "trainDate", trainDate);
          }
        }
        this.unitId = this.formData.unitId;
        this.trainDetailId = this.formData.trainDetailId;
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
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

/deep/.el-input {
  .el-input-group__append {
    color: #0096ff !important;
    border: 1px solid #0096ff;
    cursor: pointer;
  }
}

.subTabeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.el-select {
  width: 100%;
}
::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}

/deep/.avatar-uploader .el-upload-list__item {
  height: 70px;
  width: 70px;
}

/deep/.avatar-uploader .el-upload--picture-card {
  height: 70px;
  width: 70px;
  line-height: 70px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
<style scoped lang="scss">
.el-form {
  .el-row {
    margin-bottom: 8px;
  }
}
/deep/ .el-dialog__body {
  max-height: 60vh;
}
</style>

<template>
  <el-dialog
    title="查看-交底信息"
    custom-class="wbench-el-dialog"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    fullscreen
    @closed="closedHandle"
  >
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-form
      ref="dataFormRef"
      :model="formData"
      :rules="formDataRules"
      :disabled="readonly"
      label-width="auto"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="交底编号" prop="code">
            <el-input
              show-word-limit
              maxlength="20"
              v-model="formData.code"
              placeholder="请输入编号"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交底图纸编号" prop="drawingCode">
            <el-input
              disabled
              placeholder="请选择"
              v-model="formData.drawingCode"
            >
              <template slot="append">
                <div @click.stop="changeComponents('chooseFile')">选择</div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图纸名称" prop="drawingName">
            <el-input
              disabled
              v-model="formData.drawingName"
              placeholder=""
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="计划交底时间" size="mini" prop="explainDate">
            <el-date-picker
              v-model="formData.explainDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              default-time="12:00:00"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="会议地点" prop="place">
            <el-input
              show-word-limit
              maxlength="15"
              v-model="formData.place"
              placeholder="请输入"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="参会人" prop="persons" align="center">
            <el-form>
              <el-form-item label="" prop="persons" align="center">
                <user
                  v-model="formData.persons"
                  :multiple="true"
                  :readonly="true"
                ></user>
              </el-form-item>
            </el-form>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="交底内容" prop="content" align="center">
            <el-input
              type="textarea"
              show-word-limit
              maxlength="500"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="formData.content"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="会议要求" prop="stipulate" align="center">
            <el-input
              show-word-limit
              maxlength="50"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="formData.stipulate"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="附件" prop="uploadFile">
            <uploadFile :readonly="readonly" v-model="formData.uploadFile">
            </uploadFile>
          </el-form-item>
        </el-col>
        <!-- v-if="DesignDisclosureDate"  -->
        <el-col :span="12">
          <el-form-item label="交底日期" size="mini">
            <el-date-picker
              class="w-100pre"
              v-model="formData.actualExplainDate"
              type="date"
              placeholder="选择日期时间"
              :disabled="isDisabledMe"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议纪要" prop="metingMinutes">
            <uploadFile
              :readonly="isDisabledMe"
              v-model="formData.metingMinutes"
            >
            </uploadFile>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 关联文件选择 -->
    <el-dialog
      width="80%"
      v-draggable
      :visible.sync="dialogFormVisible"
      title="关联文件选择"
    >
      <components ref="components" :is="component"></components>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import DepSelect from "@/components/DepSelect/index.vue";
// import chooseFile from "./components/chooseFile.vue";
import { mapGetters } from "vuex";
export default {
  name: "designDisclosureDataform",
  mixins: [],
  components: {
    DepSelect,
  },
  data() {
    return {
      pbsName: "",
      dialogShow: false,
      component: "chooseFile",
      dialogFormVisible: false,
      month: "",
      freeFlowUsers: "",
      //当前选择行
      curRow: null,
      actualDate: true,
      dialogBim: false,
      DitSpeciality: [],
      formData: {},
      formDataRules: {
        code: [{ required: true, message: "请输入编号", trigger: "blur" }],
        drawingCode: [
          { required: true, message: "请输入编号", trigger: "blur" },
        ],
        explainDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: ["blur", "change"],
          },
        ],
        place: [{ required: true, message: "请输入", trigger: "blur" }],
        freeFlowUsers: [{ required: true, message: "请选择", trigger: "blur" }],
        persons: [{ required: true, message: "请选择", trigger: "change" }],
        content: [{ required: true, message: "请输入", trigger: "blur" }],
        actualExplainDate: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        metingMinutes: [
          { required: true, message: "请上传文件", trigger: "change" },
        ],
      },
      /**表单是否只读 */
      readonly: true,
      personnelShow: false,
      /**组织机构选择 */
      deptShow: false,
      /**分类类型 */
      designClassifyOptions: [],
      /**设计分类类型字典code */
      designClassifyCode: "DESIGN_CLASSIFY",
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      personsText: "",
      users: [],
      DesignDisclosureDate: false,
      url: {
        list: "/api/design/explain/page",
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    isDisabledMe() {
      console.log(
        "computed",
        this.formData.flowStatus,
        this.formData?.flowInfo?.page
      );
      let flag = false;
      if (this.formData?.flowInfo?.page == "fine") {
        flag = true;
      } else {
        flag = false;
      }
      return flag;
    },
  },
  async created() {
    this.getDictItemList(this.designClassifyCode);
    this.getFlowPROFESSION(this.designProfessionCode);
    //获取数据
  },
  mounted() {},
  watch: {
    "formData.metingMinutes": {
      handler(val) {
        if (!this.DesignDisclosureDate) return;
        let arr = JSON.parse(val);
        if (arr?.length > 0) {
          this.$refs.dataFormRef.clearValidate("metingMinutes");
        }
      },
      // deep: true,
    },
  },
  methods: {
    edit(row, disbled) {
      this.readonly = disbled;
      this.formData = row;
    },

    closedHandle() {
      this.dialogShow = false;
    },
    async beforeSend() {
      this.sendFlowJson = {
        spr: {
          type: "user",
          value: this.formData.freeFlowUsers,
        },
      };
    },

    async sure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("选中", currentRow);
      if (currentRow) {
        this.$set(this.formData, "pbsCode", currentRow.pbsCode || "");
        if (currentRow.pbsCode) {
          this.$set(this.formData, "pbsCode", currentRow.pbsCode);
        }
        this.$set(this.formData, "drawingName", currentRow.name);
        this.$set(this.formData, "drawingCode", currentRow.code);
        this.$set(this.formData, "baseId", currentRow.id);
      }
      this.dialogFormVisible = false;
    },
    changeComponents(component) {
      if (this.readonly) return;
      if (component == "meeting") {
        this.$message.warning("暂未开发");
        return;
      }
      this.component = component;
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },

    changeBim() {
      this.dialogBim = false;
      this.$nextTick(() => {
        this.dialogBim = true;
      });
    },

    /**获取流程状态字典 */
    async getFlowPROFESSION(code) {
      const { data } = await getDictItemList(code);
      this.DitSpeciality = data;
    },

    /**
     * 获取表单数据
     */
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        console.log("表单数据", row);
        //新增
        if (!row) {
          this.DesignDisclosureDate = false;
          this.$set(this.formDataRules.actualExplainDate[0], "required", false);
          // this.$nextTick(() => {
          //   this.freeFlowInputShow = true;
          // });
          return;
        } else {
          // if (row.flowStatus == 0) {
          //   this.freeFlowInputShow = true;
          // }
        }
        // 指定流程节点展示 ||流程结束
        const includesTechnical =
          row?.actualExplainDate_NodeAuths?.read ||
          row?.flowStatus == 2 ||
          false;
        if (includesTechnical) {
          this.$set(
            this.formDataRules["actualExplainDate"][0],
            "required",
            true
          );
          this.DesignDisclosureDate = true;
          if (row.actualExplainDate) {
            row.actualExplainDate = this.timeFormat(
              row.actualExplainDate,
              "YYYY-MM-DD"
            );
            this.$set(this.formData, "actualExplainDate", row.actualExplainDate);
          } else {
            let day = this.timeFormat(new Date(), "YYYY-MM-DD");
            this.$set(this.formData, "actualExplainDate", day);
          }
        } else {
          this.DesignDisclosureDate = false;
          this.$set(
            this.formDataRules["actualExplainDate"][0],
            "required",
            false
          );
          this.$set(this.formData, "actualExplainDate", "");
        }
        // Set formData
        this.$set(this, "formData", row);
        this.$refs.dataFormRef.clearValidate("actualExplainDate");

        // Set personsText if persons is available
      } catch (error) {
        // Handle any errors that occur during the getFlowRow() operation.
        console.error("Error while fetching data:", error);
      }
    },
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designClassifyCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designClassifyOptions = res.data;
              callback && callback();
            }
          });
        } else {
          callback && callback();
        }
      }

      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designProfessionOptions = res.data;
            }
          });
        }
      }
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;
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
/deep/ .el-input-group__append {
  border: 1px solid #dcdfe6;
  color: #808080;
}

/deep/ .el-append {
  border: 1px solid #dcdfe6;
  color: #808080;
}
</style>

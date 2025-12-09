<template>
  <div class="page-leave">
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请编号" prop="projectChangeCode">
              <el-input
                placeholder="请输入"
                v-model="formData.projectChangeCode"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图纸编号" prop="code">
              <el-input disabled placeholder="请选择" v-model="formData.code">
                <template slot="append">
                  <div @click="chooseComponent('drawingSupply')">选择</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图纸名称" prop="drawingName">
              <el-input
                disabled
                show-word-limit
                maxlength="30"
                v-model="formData.drawingName"
                placeholder="请输入图纸名称"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="profession">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                disabled
                class="w-100pre"
                v-model="formData.profession"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in DitSpeciality"
                  :key="item.value"
                  :label="item.dictName"
                  :value="item.dictCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程部位">
              <el-input
                disabled
                placeholder="请选择"
                v-model="formData.pbsCode"
              >
                <template slot="append">
                  <div @click.stop="showPbs">选择</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属标段:" size="mini" prop="sectionId">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                :disabled="sectionIdAble"
                ref="sectionIdRef"
                v-model="formData.sectionId"
                placeholder="请选择"
                filterable
                clearable
                style="width: 100%"
                :formatter="sectionIdFormatter"
              >
                <el-option
                  v-for="item in sectionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请变更单位:" size="mini" prop="changeUnit">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                style="width: 46.5%"
                v-model="formData.changeUnit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in unitOptions"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item v-show="false" label="实际供应日期:"> </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="变更内容:" size="mini" prop="changes">
              <el-input
                v-model="formData.changes"
                type="textarea"
                show-word-limit
                maxlength="500"
                :autosize="{ minRows: 3, maxRows: 6 }"
                placeholder="请输入"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="变更理由:" size="mini" prop="changeReason">
              <el-input
                v-model="formData.changeReason"
                type="textarea"
                show-word-limit
                maxlength="500"
                :autosize="{ minRows: 3, maxRows: 6 }"
                placeholder="请输入"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="四方确认材料" prop="sifangFile">
              <uploadFile
                :readonly="readonly"
                v-model="formData.sifangFile"
                :limit="1"
                :maxSize="50"
                accept=".png,.jpg,.jpeg,.pdf"
              ></uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="现场照片" prop="sitePhotoFile">
              <uploadFile
                :readonly="readonly"
                v-model="formData.sitePhotoFile"
                :limit="5"
                :maxSize="50"
                accept=".png,.jpg,.jpeg"
              ></uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其他附件" prop="otherFile">
              <uploadFile
                :readonly="readonly"
                v-model="formData.otherFile"
                :maxSize="50"
                accept=".png,.jpg,.jpeg"
              ></uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="变更估算费用" prop="changeEstimatedCost">
                  <el-input
                    class="custom-append"
                    placeholder="请选择"
                    v-model="formData.changeEstimatedCost"
                    @input="
                      () => {
                        formData.changeEstimatedCost = $formatValue(
                          formData.changeEstimatedCost
                        );
                      }
                    "
                  >
                    <template slot="append">
                      <div>万元</div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="变更工期估计" prop="changeDate">
                  <el-input
                    placeholder="请选择"
                    class="custom-append"
                    v-model="formData.changeDate"
                    @input="
                      () => {
                        formData.changeDate = inNumber(formData.changeDate);
                      }
                    "
                  >
                    <template slot="append">
                      <div>天</div>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计划供图时间:" size="mini" prop="planDate">
              <el-date-picker
                style="width: 46.5%"
                v-model="formData.planDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内部变更审批单:" size="mini" prop="temp">
              <el-button @click="generate()">生成</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <pbs-select
      :visible.sync="pbsDialog.show"
      :selection="pbsDialog.selection"
      @childEvt="pbsSelectedHandle"
      @closed="pbsDialog.show = false"
    />

    <el-dialog
      width="80%"
      title="关联文件选择"
      :visible.sync="dialogPlanVisible"
    >
      <originalDrawing
        :page="'drawingSupply'"
        ref="components"
        :type="1"
      ></originalDrawing>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlanVisible = false">取 消</el-button>
        <el-button type="primary"  @click="sure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saverequest, unitList, sectionList, sectionListByPage } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import UserSelect from "@/components/newUserSelect/index.vue";
import DepSelect from "@/components/DepSelect/index.vue";
import bimShow from "@/components/Bim/Select/index.vue";
import PbsSelect from "@/components/PbsSelect/index2.vue";
import originalDrawing from "@/components/originalDrawing/index.vue";
import { renderAsync } from "docx-preview";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import store from "@/store";
export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    UserSelect,
    DepSelect,
    bimShow,
    PbsSelect,
    originalDrawing
  },
  data() {
    const validFile = (rule, value, callback) => {
      if (
        this.formData.sifangfile.length === 0 ||
        this.formData.sifangfile === null ||
        typeof this.formData.sifangfile == "undefined"
      ) {
        callback(new Error("请上传四方确认材料"));
      }
    };
    const validFile2 = (rule, value, callback) => {
      if (
        this.formData.sitePhotoFile.length === 0 ||
        this.formData.sitePhotoFile === null ||
        typeof this.formData.sitePhotoFile == "undefined"
      ) {
        callback(new Error("请上传现场照片"));
      }
    };
    return {
      sectionIdAble: false,
      current: "", //当前登陆人
      prefix: "",
      /**施工标段 */
      sectionOptions: [],
      sectionList: [], //匹配申请单位的施工标段
      unitOptions: [], //申请单位
      imgsrc: "",
      canDeleteRow: false,
      pbsName: "",
      sonQuery: {
        month: ""
      },
      dialogPlanVisible: false,
      actualDate: true,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },

      //当前选择行
      curRow: null,

      orignlists: [],
      DitSpeciality: [],
      planName: "",
      orignDisabled: false,
      pageName: "",
      //月度计划列表
      tableData: [],
      pagetableData: [],
      query: {
        applyUser: "",
        applyDate: "",
        pageSize: 20,
        current: 1,
        total: 0
      },
      showDialog: false,
      sifangfile: [],
      sitePhotoFile: [],
      otherFile: [],
      formData: {
        id: "",
        isChange: "1",
        planId: "",
        actualDate: "",
        remark: "",
        designSupplyFileList: [],
        sifangfile: "",
        sitePhotoFile: "",
        otherFile: "",
        projectChangeCode: "",
        planDate: "",
        changeUnit: "",
        sectionId: "",
        pbsCode: ""
      },
      formDataRules: {
        projectChangeCode: [
          { required: true, message: "请输入申请编号", trigger: "blur" }
        ],
        drawingName: [
          { required: true, message: "请输入图纸名称", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入编号", trigger: "blur" }],
        changes: [{ required: true, message: "请输入", trigger: "blur" }],
        changeEstimatedCost: [
          {
            required: true,
            message: "请输入变更估算成本",
            trigger: ["change", "blur"]
          }
        ],
        changeDate: [
          {
            required: true,
            message: "请输入变更工期估算",
            trigger: ["change", "blur"]
          }
        ],

        changeReason: [{ required: true, message: "请输入", trigger: "blur" }],
        planDate: [
          {
            required: true,
            message: "请输入计划供图时间",
            trigger: ["change", "blur"]
          }
        ],
        changeUnit: [
          { required: true, message: "请输入申请变更单位", trigger: "change" }
        ],
        sectionId: [
          { required: true, message: "请输入所属标段", trigger: "change" }
        ],
        sifangfile: [
          { validator: validFile, required: true, trigger: ["change", "blur"] }
        ],
        sitePhotoFile: [
          {
            validator: validFile2,
            required: true,
            trigger: ["change", "blur"]
          }
        ],
        actualDate: [
          {
            required: true,
            message: "请选择日期"
          }
        ]
      },
      isAddOrEedit: false, //新增还是编辑

      currentSection: [],
      dictList: [],
      /**表单是否只读 */
      readonly: false,
      /**人员选择 */
      persons: [],
      personnelShow: false,
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
      url: {
        list: "/api/design/projectChange/page"
        // list: "/api/design/plan/list",
      }
    };
  },

  async created() {
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getFlowPROFESSION();
    this.getSectionListByPage(); //获取与单位关联的标段
    this.getUnitList(); //获取所有的单位
    //获取数据
  },
  mounted() {
    this.formData.actualDate = this.$dateFormat();
    //获取标段
    this.getSectionList();
    this.getCurrent();
  },
  methods: {
    //翻译列表所属标段 id=>name
    sectionIdFormatter(row, column) {
      var value = "";
      for (var i = 0; i < this.sectionOptions.length; i++) {
        var item = this.sectionOptions[i];
        if (row.sectionId == item.id) {
          value = item.name;
          break;
        }
      }
      return value;
    },
    /* 获取当前登录人信息*/
    async getCurrent() {
      console.log("this.currentSection", this.$getStorage("userInfo"));
      this.current = this.$getStorage("userInfo");
      this.formData.changeUnit = this.current.corpName; //申请变更单位(默认为当前登录人的)
      console.log("获取当前登陆人的单位", this.formData.changeUnit);
    },
    handlePreview() {},
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    /**获取施工标段(与变更单位匹配) */
    getSectionListByPage() {
      this.sectionList = [];
      sectionListByPage({}).then((res) => {
        if (res.success) {
          this.sectionList = res.data.records;
        }
      });
    },
    async getUnitList() {
      const { data, success } = await unitList();
      console.log("单位列表", success, data);
      if (success) {
        this.unitOptions = data;
      }
    },
    // zhengshui
    inNumber(value) {
      value = value.replace(/^0+(\d)|[^\d]+/g, "");
      return value;
    },
    previewFile(row) {
      row.blobType = row.uploadFile;
      this.$previewFile(row);
    },

    // 修改
    sure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("关闭选择", currentRow);
      this.formData.profession = currentRow.profession;
      this.formData.code = currentRow.code;
      this.formData.drawingName = currentRow.name;
      if (currentRow?.pbsCode) {
        this.formData.pbsCode = currentRow.pbsCode;
        this.pbsName = currentRow.pbsCode.split("&&&")[1];
      } else {
        this.pbsName = "";
        this.formData.pbsCode = "";
      }
      this.formData.baseId = currentRow.id;
      this.$nextTick(() => {
        this.dialogPlanVisible = false;
      });
    },
    // 切换组件  MonthlyPlan是关联计划组件  originalDrawing原图纸组件
    chooseComponent() {
      if (this.readonly) return;
      this.dialogPlanVisible = true;
      this.$nextTick(() => {
        this.$refs.components.default();
      });
    },

    changeStatus(value) {
      // 0 变更 1 否
      if (value == 0) {
        this.orignDisabled = true;
      } else {
        this.formData.id = "";
        this.orignDisabled = false;
        this.formData.code = "";
        this.formData.name = "";
      }
    },

    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.DitSpeciality = data;
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
    /**
     * 获取表单数据
     */
    getFormData() {
      this.getFlowRow().then((row) => {
        console.log("获取表单数据11", row);
        if (row) {
          if (row.createUser == this.$getStorage("userInfo").userId) {
            this.canDeleteRow = false;
          } else {
            this.canDeleteRow = true;
          }
          console.log("row", row);
          row.actualDate = this.timeFormat(row.actualDate, "YYYY-MM-DD");
          if (row.pbsCode) {
            this.pbsName = this.getPbsName(row.pbsCode);
          }
          if (!row?.sifangfile) {
            row.sifangfile = [];
          }
          if (!row?.sitePhotoFile) {
            row.sitePhotoFile = [];
          }
          if (!row?.otherFile) {
            row.otherFile = [];
          }
          this.formData = row;
          this.tableData = row;
          if (row.isChange == 0) {
            this.orignDisabled = true;
          } else {
            this.orignDisabled = false;
          }
        }
      });
    },

    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      // console.log("save fields", fields);
      //做业务数据的保存,修改。
      saverequest(fields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            // this.$message.success("新增成功");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
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
    /**删除子级 */
    async deleteRow(index) {
      this.formData.designSupplyFileList.splice(index, 1);
    },

    /** 选择PBS */
    showPbs() {
      if (this.readonly) {
        return;
      }
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      console.log("pbs", pbs);
      this.formData.pbsCode = pbs.code + "&&&" + pbs.name;
      this.pbsName = pbs.name;
    },
    generate() {
      alert("功能正在开发中~~");
    }
  },
  watch: {
    "formData.sifangfile": {
      handler(newVal) {
        if (newVal.length) {
          this.$refs["sifangfileRef"].clearValidate(["sifangfile"]);
        }
      },
      deep: true
    },
    "formData.changeUnit": {
      //选择变更单位后关联所属标段
      // handler(newVal) {
      //   let a = this.sectionList.filter((X) => X.secondUnitName == newVal);
      //   this.sectionOptions = a;
      //   if (this.sectionOptions.length != 0) {
      //     this.sectionIdAble = false;
      //     this.formData.sectionId = a[0].id;
      //   } else {
      //     //公司没标段时  关闭标段选择能力
      //     this.sectionIdAble = true;
      //     this.formData.sectionId = "";
      //   }
      // },
    }
  }
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

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

.line {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0 10px 0;
}
.mr-10 {
  margin-right: 10px;
}

/deep/.custom-append {
  .el-input-group__append {
    color: #333;
    border: 1px solid #dcdfe6;
    cursor: default;
  }
}
</style>

<template>
  <div class="page-leave">
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
      label-width="auto"
      :disabled="readonly"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="样品编号" prop="code">
            <el-input
              placeholder="请输入样品编号"
              v-model="formData.code"
              show-word-limit
              maxlength="50"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材料名称" prop="name">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="nameRef"
              v-model="formData.name"
              placeholder="请选择"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in nameList"
                :key="item.dictName"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="材料分类" prop="materialClass">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="materialClassRef"
              v-model="formData.materialClass"
              placeholder="请选择"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in typeList"
                :key="item.dictName"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="进场日期" prop="commencementDate">
            <el-date-picker
              v-model="formData.commencementDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="施工单位">
            <el-input disabled v-model="formData.contractor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属标段" prop="sectionId">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              :disabled="sectionIdAble"
              ref="sectionIdRef"
              v-model="formData.sectionId"
              :placeholder="placeholderSectionId"
              filterable
              clearable
              style="width: 100%"
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
        <el-col :span="12">
          <el-form-item label="实验室负责人审核" prop="checker">
            <user
              v-model="formData.checker"
              :readonly="readonly"
              :unitId="unitId"
            ></user>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用部位" prop="pbsCode">
            <pbs-select
              v-model="formData.pbsCode"
              :readonly="readonly"
            ></pbs-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="报检单" prop="uploadFile">
            <!-- :showNtko="getNodeAuth('uploadFile')" -->
            <uploadFile
              :limit="1"
              :maxSize="200"
              :readonly="readonly"
              v-model="formData.uploadFile"
              accept=".pdf,.doc,.docx"
            >
            </uploadFile>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他附件" prop="otherFile">
            <uploadFile
              :readonly="readonly"
              :maxSize="200"
              v-model="formData.otherFile"
            >
            </uploadFile>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      width="80%"
      title="关联文件选择"
      :visible.sync="dialogPlanVisible"
      v-draggable
    >
      <originalDrawing
        :page="'drawingSupply'"
        ref="components"
        :type="1"
      ></originalDrawing>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlanVisible = false">取 消</el-button>
        <el-button type="primary"  @click="sure">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saverequest, unitList, sectionList, sectionListByPage } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import PbsSelect from "@/components/PbsSelect/index.vue";
import originalDrawing from "@/components/originalDrawing/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import User from "@/components/Organize/User/index.vue";

export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    PbsSelect,
    originalDrawing,
    User
  },
  data() {
    return {
      //当前节点任务的名称
      todoProcTaskName: "",
      placeholderSectionId: "",
      sectionIdAble: true,
      current: "", //当前登陆人信息
      nameList: "",
      typeList: "",
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
      // actualDate: true,
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
      formData: {
        code: "",
        name: "",
        materialClass: "",
        commencementDate: "",
        contractor: "",
        sectionId: "",
        reportList: [],
        pbsCode: ""
      },
      formDataRules: {
        code: [{ required: true, message: "请输入编号", trigger: "blur" }],
        name: [
          { required: true, message: "请选择材料名称", trigger: "change" }
        ],
        sectionId: [
          { required: true, message: "请选择所属标段", trigger: "change" }
        ],
        checker: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ],
        uploadFile: [
          { required: true, message: "请上传检验报告", trigger: "blur" }
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

      /**接口地址：对应list接口 */
      url: {
        list: "/api/quality/material/page"
      }
    };
  },

  async created() {
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getFlowPROFESSION();
    this.getSectionListByPage(); //获取与单位关联的标段
    this.getUnitList(); //获取所有的单位
  },
  mounted() {
    //获取标段
    this.getSectionList();
    //获取材料类型
    this.getnameList();
    // 触发事件
  },
  methods: {
    /**获取当前任务名称 */
    getTodoProcTaskName(todo) {
      if (todo) {
        return todo.procTaskName;
      }
      return "";
    },
    /* 获取当前登录人信息*/
    async getCurrent() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
        }
        this.current = this.$getStorage("userInfo");
        this.formData.contractor = this.current.corpName; //申请变更单位(默认为当前登录人的)
        console.log("this.current", this.current);
        console.log("获取当前登陆人的单位", this.formData.contractor);
        console.log("this.sectionList", this.sectionOptions);
        // let a = this.sectionOptions.filter(
        //   (X) => X.secondUnit == this.current.corpId
        // );
        // this.sectionOptions = a;
        if (this.sectionOptions.length != 0 && this.sectionOptions.length > 1) {
          this.sectionIdAble = false;
          // this.formData.sectionId = a[0].id;
          this.placeholderSectionId = "请选择标段";
        } else if (this.sectionOptions.length == 1) {
          this.formData.sectionId = this.sectionOptions[0].id;
        } else {
          //公司没标段时  关闭标段选择能力
          this.sectionIdAble = true;
          this.formData.sectionId = "";
          this.placeholderSectionId = "无所属标段";
          console.log("当前登陆人关联单位无所属标段");
        }
      });
    },
    /**获取字典 */
    getnameList() {
      this.$store.dispatch("dict/get", "clmc").then((data) => {
        this.nameList = data;
      });
      this.$store.dispatch("dict/get", "clfl").then((data) => {
        this.typeList = data;
      });
    },
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
        console.log("this.unitOptions", this.unitOptions);
      }
    },
    // zhengshui
    inNumber(value) {
      value = value.replace(/^0+(\d)|[^\d]+/g, "");
      return value;
    },
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
        console.log("获取表单数据", row);
        //新增才获取，查看的时候不获取
        if (row) {
          if (row.createUser == this.$getStorage("userInfo").userId) {
            this.canDeleteRow = false;
          } else {
            this.canDeleteRow = true;
          }
          // row.commencementDate = this.$dateFormat(row.commencementDate?row.commencementDate : "")
          // row.actualDate = this.timeFormat(row.actualDate, "YYYY-MM-DD");
          if (row.pbsCode) {
            this.pbsName = this.getPbsName(row.pbsCode);
          }
          if (!row?.sifangfileList) {
            row.sifangfileList = [];
          }
          if (!row?.sitePhotosList) {
            row.sitePhotosList = [];
          }
          if (!row?.otherFile) {
            row.otherFile = "";
          }
          this.formData = row;
          this.todoProcTaskName = this.getTodoProcTaskName(row.matterTaskTodo);
          console.log("this.formData", this.formData);
          this.tableData = row;
          if (row.isChange == 0) {
            this.orignDisabled = true;
          } else {
            this.orignDisabled = false;
          }
        } else {
          //新增的时候
          this.getCurrent(); //获取当前登录人信息
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
      // this.formData.designSupplyFileList.splice(index, 1);
    },
    /** 选择PBS */
    showPbs() {
      if (this.readonly) return;
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      console.log("pbs", pbs);
      this.formData.pbsCode = pbs.code + "&&&" + pbs.name;
      this.pbsName = pbs.name;
    },
    generate() {
      alert("功能正在开发中~~");
    },
    beforeSubmit() {
      console.log("提交前");
      let res = true;
      let extData = {};
      if (this.formData.checker) {
        extData["sysfzr"] = {
          type: "user",
          value: this.formData.checker
        };
      }
      this.sendFlowJson = extData;
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    }
  },
  watch: {
    "formData.sifangfileList": {
      handler(newVal) {
        if (newVal.length) {
          this.$refs["sifangfileRef"].clearValidate(["sifangfileList"]);
        }
      },
      deep: true
    },
    "formData.uploadFile": {
      handler(val) {
        let arr = JSON.parse(val);
        if (arr.length > 0) {
          this.$refs.dataFormRef.clearValidate("uploadFile");
        }
      },
      deep: true
    }
  },
  computed: {
    /**
     * 是否ntko
     */
    showNtko() {
      if (this.todoProcTaskName === "【负责人】签字&盖章") {
        return true;
      }
      return false;
    },
    //只能选中本单位得人员
    unitId() {
      let unitId = [];
      if (this.formData.unit) {
        unitId = [this.formData.unit];
      } else {
        let corpId = this.$getStorage("userInfo").corpId;
        if (corpId) {
          unitId = [corpId];
        }
      }
      return unitId;
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
/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}
</style>

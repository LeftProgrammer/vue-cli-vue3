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
            <el-form-item label="样品名称" prop="name">
              <el-input disabled v-model="formData.name" style="width: 70%">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样品编号" prop="code">
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.code"
                placeholder="请输入样品编号"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报告编号" prop="reportCode">
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.reportCode"
                placeholder="请输入报告编号"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报告日期" prop="reportDate">
              <el-date-picker
                v-model="formData.reportDate"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 70%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结论" prop="testResult">
              <template>
                <el-radio v-model="formData.testResult" :label="1"
                  >合格</el-radio
                >
                <el-radio v-model="formData.testResult" :label="2"
                  >不合格</el-radio
                >
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试验人员" prop="testPerson">
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.testPerson"
                placeholder="请输入试验人员"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测日期" prop="testDate">
              <el-date-picker
                v-model="formData.testDate"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 70%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采样日期" prop="samplingDate">
              <el-date-picker
                v-model="formData.samplingDate"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 70%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="取样日期" prop="collectionDate">
              <el-date-picker
                v-model="formData.collectionDate"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 70%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="producer">
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.producer"
                placeholder="请输入生产厂家"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="品种强度等级"
              prop="strainStrength"
              v-if="!guifenAble"
            >
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.strainStrength"
                placeholder="请输入品种强度等级"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="specificationModel">
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.specificationModel"
                placeholder="请输入规格型号"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂批号" prop="manufacturingBatch">
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.manufacturingBatch"
                placeholder="请输入出厂批号"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代表数量" prop="representativeQuantity">
              <el-input
                v-model="formData.representativeQuantity"
                placeholder="请输入代表数量"
                style="width: 70%"
                show-word-limit
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程名称" prop="projectName">
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.projectName"
                placeholder="请输入工程名称"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属标段" prop="section">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                ref="sectionIdRef"
                v-model="formData.section"
                filterable
                clearable
                style="width: 70%"
                :disabled="sectionIdAble"
                :placeholder="placeholderSectionId"
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
            <el-form-item label="使用部位" prop="pbsCode">
              <pbs-select
                style="width: 70%"
                v-model="formData.pbsCode"
                :readonly="readonly"
              ></pbs-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="suNingJiAble">
            <el-form-item label="试验所用水泥品种" prop="cementVariety">
              <el-input
                show-word-limit
                maxlength="50"
                v-model="formData.cementVariety"
                placeholder="请输入试验所用水泥品种"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注说明" prop="remark">
              <el-input
                type="textarea"
                show-word-limit
                maxlength="200"
                v-model="formData.remark"
                placeholder="请输入备注"
                style="width: 70%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- :showNtko="getNodeAuths('uploadFile')" :handSign="true" -->

          <el-col :span="12">
            <el-form-item label="检测报告" prop="uploadFile">
              <uploadFile
                :readonly="readonly"
                v-model="formData.uploadFile"
                :limit="1"
                :maxSize="200"
                accept=".pdf,.docx,.doc"
                @change="updateFileHandle"
              ></uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他附件" prop="otherFile">
              <uploadFile
                :readonly="readonly"
                v-model="formData.otherFile"
                :maxSize="200"
              ></uploadFile>
              <!-- <el-upload
                ref="otherFileListRef"
                :file-list="formData.otherFileList"
                multiple
                :limit="10"
                action="/api/attachments/single-upload"
                :before-upload="attachmentsBeforeUpload"
                :on-success="handelUploadSuccess2"
                :on-remove="handleRemove2"
                :disabled="readonly"
                width="100%"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                >文件上传</el-button
                >
              </el-upload> -->
            </el-form-item>
          </el-col>
        </el-row>
        <div class="font-14 font-w-700" style="color: #626262">
          检测项目列表
        </div>
        <el-divider></el-divider>

        <el-table
          :data="tableData"
          style="width: 98%; margin-left: 1%"
          border
          fit
          :header-cell-style="{ textAlign: 'center' }"
        >
          <el-table-column label="检测项目" prop="name" align="left" />
          <el-table-column
            label="检测项目明细"
            prop="nameDetail"
            align="center"
            v-if="littleTableAble"
          />
          <el-table-column label="计量单位" prop="unit" align="center" />
          <el-table-column label="检测实际值" prop="value" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.value"
                @input="
                  () => {
                    scope.row.value = $formatValue(scope.row.value);
                  }
                "
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-row>

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
        <el-button type="primary"  @click="sure">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save, updateFile, sectionList, sectionAllList } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import PbsSelect from "@/components/PbsSelect/index.vue";
import originalDrawing from "@/components/originalDrawing/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    PbsSelect,
    originalDrawing
  },
  data() {
    return {
      littleTableAble: false,
      sectionOptions: [],
      imgsrc: "",
      canDeleteRow: false,
      pbsName: "",
      sonQuery: {
        month: ""
      },
      dialogPlanVisible: false,
      pbsDialog: {
        selection: [],
        show: false
      },
      // 当前选择行
      curRow: null,
      orignlists: [],
      DitSpeciality: [],
      planName: "",
      orignDisabled: false,
      pageName: "",
      // 月度计划列表
      tableData: [],
      tableData1: [
        {
          name: "比表面积",
          nameDetail: "",
          code: "specificSurfaceArea",
          value: "",
          unit: "㎡/kg"
        },
        {
          name: "凝结时间",
          nameDetail: "初凝",
          code: "initialSettingTime",
          value: "",
          unit: "min"
        },
        {
          name: "凝结时间",
          nameDetail: "终凝",
          code: "finalSettingTime",
          value: "",
          unit: "min"
        },
        {
          name: "安定性",
          nameDetail: "",
          code: "stability",
          value: "",
          unit: ""
        },
        {
          name: "标稠",
          nameDetail: "",
          code: "viscousAgent",
          value: "",
          unit: "%"
        },
        {
          name: "抗折强度",
          nameDetail: "3d",
          code: "flexuralStrength3d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "抗折强度",
          nameDetail: "7d",
          code: "flexuralStrength7d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "抗折强度",
          nameDetail: "28d",
          code: "flexuralStrength28d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "抗压强度",
          nameDetail: "3d",
          code: "compressiveStrength3d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "抗压强度",
          nameDetail: "7d",
          code: "compressiveStrength7d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "抗压强度",
          nameDetail: "28d",
          code: "compressiveStrength28d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "水化热值",
          nameDetail: "3d",
          code: "heatHydration3d",
          value: "",
          unit: "KJ/Kg"
        },
        {
          name: "水化热值",
          nameDetail: "7d",
          code: "heatHydration7d",
          value: "",
          unit: "KJ/Kg"
        },
        {
          name: "烧失量",
          nameDetail: "",
          code: "lossOnIgnition",
          value: "",
          unit: "%"
        },
        { name: "SO3", nameDetail: "", code: "so3", value: "", unit: "%" },
        { name: "MgO", nameDetail: "", code: "mgo", value: "", unit: "%" },
        {
          name: "碱含量",
          nameDetail: "",
          code: "alkaliContent",
          value: "",
          unit: "%"
        },
        {
          name: "氯离子",
          nameDetail: "",
          code: "chlorideIon",
          value: "",
          unit: "%"
        }
      ],
      tableData2: [
        {
          name: "比表面积",
          nameDetail: "",
          code: "specificSurfaceArea",
          value: "",
          unit: "㎡/kg"
        },
        {
          name: "凝结时间",
          nameDetail: "初凝",
          code: "initialSettingTime",
          value: "",
          unit: "min"
        },
        {
          name: "凝结时间",
          nameDetail: "终凝",
          code: "finalSettingTime",
          value: "",
          unit: "min"
        },
        {
          name: "安定性",
          nameDetail: "",
          code: "stability",
          value: "",
          unit: ""
        },
        {
          name: "标稠",
          nameDetail: "",
          code: "viscousAgent",
          value: "",
          unit: "%"
        },
        {
          name: "抗折强度",
          nameDetail: "3d",
          code: "flexuralStrength3d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "抗折强度",
          nameDetail: "28d",
          code: "flexuralStrength28d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "抗压强度",
          nameDetail: "3d",
          code: "compressiveStrength3d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "抗压强度",
          nameDetail: "28d",
          code: "compressiveStrength28d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "烧失量",
          nameDetail: "",
          code: "lossOnIgnition",
          value: "",
          unit: "%"
        },
        { name: "SO3", nameDetail: "", code: "so3", value: "", unit: "%" },
        { name: "MgO", nameDetail: "", code: "mgo", value: "", unit: "%" },
        {
          name: "碱含量",
          nameDetail: "",
          code: "alkaliContent",
          value: "",
          unit: "%"
        },
        {
          name: "氯离子",
          nameDetail: "",
          code: "chlorideIon",
          value: "",
          unit: "%"
        }
      ],
      tableData3: [
        {
          name: "细度",
          nameDetail: "",
          code: "residueOn45umSieve",
          value: "",
          unit: "%"
        },
        {
          name: "需水量比",
          nameDetail: "",
          code: "waterDemandRatio",
          value: "",
          unit: "%"
        },
        {
          name: "含水量",
          nameDetail: "",
          code: "moistureContent",
          value: "",
          unit: "%"
        },
        {
          name: "烧失量",
          nameDetail: "",
          code: "lossOnIgnition",
          value: "",
          unit: "%"
        },
        { name: "SO3", nameDetail: "", code: "so3", value: "", unit: "%" },
        {
          name: "碱含量",
          nameDetail: "",
          code: "alkaliContent",
          value: "",
          unit: "%"
        },
        { name: "f-Cao", nameDetail: "", code: "fcao", value: "", unit: "%" },
        {
          name: "28d活性指数",
          nameDetail: "",
          code: "activityIndex28days",
          value: "",
          unit: "%"
        },
        {
          name: "密度",
          nameDetail: "",
          code: "density",
          value: "",
          unit: "g/cm³"
        },
        {
          name: "SiO2+Al2O3+Fe2O3总质量分数",
          nameDetail: "",
          code: "massFraction",
          value: "",
          unit: "%"
        }
      ],
      tableData4: [
        {
          name: "45μm筛筛余量",
          nameDetail: "",
          code: "residueOn45umSieve",
          value: "",
          unit: "%"
        },
        {
          name: "比表面积",
          nameDetail: "",
          code: "specificSurfaceArea",
          value: "",
          unit: "㎡/kg"
        },
        {
          name: "需水量比",
          nameDetail: "",
          code: "waterDemandRatio",
          value: "",
          unit: "%"
        },
        {
          name: "28d活性指数",
          nameDetail: "",
          code: "activityIndex28days",
          value: "",
          unit: "%"
        },
        {
          name: "烧失量",
          nameDetail: "",
          code: "lossOnIgnition",
          value: "",
          unit: "%"
        },
        {
          name: "二氧化硅",
          nameDetail: "",
          code: "siliconDioxide",
          value: "",
          unit: "%"
        },
        {
          name: "含水率",
          nameDetail: "",
          code: "moistureContent",
          value: "",
          unit: "%"
        },
        { name: "SO3", nameDetail: "", code: "so3", value: "", unit: "%" },
        {
          name: "氯离子",
          nameDetail: "",
          code: "chlorideIon",
          value: "",
          unit: "%"
        }
      ],
      tableData5: [
        {
          name: "细度",
          nameDetail: "",
          code: "fineness",
          value: "",
          unit: "%"
        },
        {
          name: "初凝时间",
          nameDetail: "",
          code: "initialSettingTime",
          value: "",
          unit: "min"
        },
        {
          name: "终凝时间",
          nameDetail: "",
          code: "finalSettingTime",
          value: "",
          unit: "min"
        },
        {
          name: "含水率",
          nameDetail: "",
          code: "moistureContent",
          value: "",
          unit: "%"
        },
        {
          name: "1d抗压强度",
          nameDetail: "",
          code: "compressiveStrength1d",
          value: "",
          unit: "Mpa"
        },
        {
          name: "28d抗压强度比",
          nameDetail: "",
          code: "compressiveStrength28dRatio",
          value: "",
          unit: "%"
        }
      ],
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
        // representativeQuantity: "",
        section: "",
        name: "",
        id: "",
        isChange: "1",
        planId: "",
        actualDate: "",
        remark: "",
        designSupplyFileList: [],
        uploadFile: "",
        tableData: [],
        otherFile: "",
        testPerson: "",
        testResult: ""
      },
      formDataRules: {
        reportCode: [
          { required: true, message: "请输入报告编号", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入样品编号", trigger: "blur" }],
        reportDate: [
          { required: true, message: "请选择报告日期", trigger: "blur" }
        ],

        testResult: [
          { required: true, message: "请选择检测结论", trigger: "blur" }
        ],
        testPerson: [
          { required: true, message: "请输入试检人员", trigger: "blur" }
        ],
        testDate: [
          { required: true, message: "请选择检测日期", trigger: "blur" }
        ],
        uploadFile: [
          { required: true, message: "请上传检验报告", trigger: "blur" }
        ],
        section: [
          { required: true, message: "请选择所属标段", trigger: "change" }
        ]
      },
      isAddOrEedit: false, //新增还是编辑
      currentSection: [],
      dictList: [],
      /**表单是否只读 */
      readonly: false,
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
        list: "/api/quality/reagentTest/page"
        // list: "/api/design/plan/list",
      },
      //当前节点任务的名称
      todoProcTaskName: "",
      placeholderSectionId: "请选择标段",
      sectionIdAble: true,
      guifenAble: false,
      suNingJiAble: false
    };
  },

  async created() {
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getFlowPROFESSION();
    //this.clearValidate();
    //获取数据
  },
  mounted() {
    // this.formData.actualDate = this.$dateFormat();
    //获取标段
    // this.getSectionList();
    //根据名称获取表格
    this.getTable();
    // this.nextTick(()=>{
    // })
  },
  methods: {
    clearValidate() {
      // this.$refs["dataFormRef"].clearValidate("date");
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
      });
    },
    /**获取流程节点当前字段是否可以写 */
    getNodeAuths(fieldName) {
      // let write = false;
      // let fieldAuth = this.formData[fieldName + "_NodeAuths"];
      // if (fieldAuth && fieldAuth.write) {
      //   return true;
      // }
      // return false;
      return true;
    },
    /* 获取当前登录人信息*/
    async getCurrent() {
      this.sectionList = [];
      sectionAllList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
        }
        //获取当前登陆人单位关联的标段
        this.current = this.$getStorage("userInfo");
        this.formData.contractor = this.current.corpName; //申请变更单位(默认为当前登录人的)
        console.log("获取当前登陆人的单位", this.formData.contractor);
        // let a = this.sectionOptions.filter(
        //   (X) => X.secondUnit == this.current.corpId
        // );
        // this.sectionOptions = a;
        if (this.sectionOptions.length > 1) {
          this.sectionIdAble = false;
          // this.formData.section = a[0].id;
          this.placeholderSectionId = "请选择标段";
        } else if (this.sectionOptions.length == 1) {
          this.formData.section = this.sectionOptions[0].id;
        } else {
          //公司没标段时  关闭标段选择能力
          this.sectionIdAble = true;
          this.formData.section = "";
          this.placeholderSectionId = "无所属标段";
          console.log("当前登陆人对应单位无所属标段");
        }
      });
    },
    getTable() {
      //新增时
      if (!this.formData.reportCode) {
        //从缓存里取出材料名称
        this.formData.name = this.$getStorage("reagentsMaterialName");
        // this.formData.reportDate = new Date();
        // this.formData.testDate = new Date();
        // this.formData.samplingDate = new Date();
      }
      if (this.formData.name == "中热水泥") {
        this.tableData = this.tableData1;
      } else if (this.formData.name == "普通硅酸盐水泥") {
        this.tableData = this.tableData2;
      } else if (this.formData.name == "粉煤灰") {
        this.tableData = this.tableData3;
      } else if (this.formData.name == "硅粉") {
        this.tableData = this.tableData4;
        this.guifenAble = true;
      } else if (this.formData.name == "速凝剂") {
        this.tableData = this.tableData5;
        this.guifenAble = true;
        this.suNingJiAble = true;
      }
      this.$nextTick(() => {
        this.getCurrent();
        this.getLittleTable();
      });
    },
    getLittleTable() {
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].nameDetail) {
          this.littleTableAble = true;
          return;
        }
      }
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
    previewFile(row) {
      row.blobType = row.uploadFile;
      this.$previewFile(row);
    },
    // 确认按钮
    sure() {
      this.$refs.dataFormRef.validate((val) => {
        if (val) {
          this.submit();
        }
      });
    },
    submit() {
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
        if (row) {
          if (row.createUser == this.$getStorage("userInfo").userId) {
            this.canDeleteRow = false;
          } else {
            this.canDeleteRow = true;
          }
          if (row.collectionDate) {
            row.collectionDate = this.timeFormat(
              row.collectionDate,
              "YYYY-MM-DD"
            );
          }
          if (row.samplingDate) {
            row.samplingDate = this.timeFormat(row.samplingDate, "YYYY-MM-DD");
          }
          if (row.testDate) {
            row.testDate = this.timeFormat(row.testDate, "YYYY-MM-DD");
          }
          if (row.reportDate) {
            row.reportDate = this.timeFormat(row.reportDate, "YYYY-MM-DD");
          }
          console.log("row", row);
          row.actualDate = new Date();
          if (row.pbsCode) {
            this.pbsName = this.getPbsName(row.pbsCode);
          }
          if (!row?.designSupplyFileList) {
            row.designSupplyFileList = [];
          }
          this.$set(this, "formData", row);
          //给下面的表赋值
          if (this.formData.name == "中热水泥") {
            this.tableData = this.tableData1;
          } else if (this.formData.name == "普通硅酸盐水泥") {
            this.tableData = this.tableData2;
          } else if (this.formData.name == "粉煤灰") {
            this.tableData = this.tableData3;
          } else if (this.formData.name == "硅粉") {
            this.tableData = this.tableData4;
            this.guifenAble = true;
          } else if (this.formData.name == "速凝剂") {
            this.tableData = this.tableData5;
            this.guifenAble = true;
            this.suNingJiAble = true;
          }
          this.tableData.forEach((item) => {
            item.value = row[item.code];
          });
          console.log("this.formData", row);
          console.log("this.tableData", this.tableData);
          // this.tableData = row;
          if (row.isChange == 0) {
            this.orignDisabled = true;
          } else {
            this.orignDisabled = false;
          }
          this.getTable();
        }
      });
    },

    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          console.log("校验不通过");
          return false;
        }
      });
      var field = {};
      if (this.tableData) {
        this.tableData.forEach((item) => {
          if (item.value) {
            field[item.code] = item.value;
          }
        });
        fields = { ...this.formData, ...field };
      }
      // console.log("save fields", fields);
      //做业务数据的保存,修改。

      save(fields)
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
    updateFileHandle(fileData) {
      //签章完成后修改文件信息
      console.info("**********change************");
      const params = new URLSearchParams(); // 创建对象
      let fData = JSON.parse(fileData)[0];
      fData.url = fData.url.substr(0, fData.url.indexOf("?"));
      fData.signPosition = this.signPositionMsg;
      let fDataArrStr = "[" + JSON.stringify(fData) + "]";
      params.append("id", this.formData.id);
      params.append("fileData", fDataArrStr);
      updateFile(params).then((res) => {
        console.info(res);
        if (res.success) {
          this.formData.filePath = fDataArrStr;
        }
      });
    }
  },
  watch: {
    "formData.uploadFile": {
      handler(val) {
        let arr = JSON.parse(val);
        if (arr.length > 0) {
          //文件传了之后清除校验状态
          this.$refs.dataFormRef.clearValidate("uploadFile");
          // 重新添加校验规则
          // this.$nextTick(() => {
          //   this.$refs.dataFormRef.validateField('uploadFile');
          // });
        }
      }
    },
    "formData.testResult": {
      handler(val) {
        if (val) {
          //清除校验状态
          this.$refs.dataFormRef.clearValidate("testResult");
        }
      }
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
.el-table thead th {
  text-align: center;
}
</style>

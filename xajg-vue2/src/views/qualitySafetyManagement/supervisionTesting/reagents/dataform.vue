<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="true"
      :close-on-click-modal="true"
      append-to-body
      width="50%"
      @closed="closedHandle"
      v-draggable
    >
      <div class="page-leave">
        <el-row :gutter="20">
          <el-form
            ref="dataFormRef"
            :model="formData"
            :rules="formDataRules"
            label-width="auto"
            :disabled="!enterAble"
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
                  <!-- <el-input
                  show-word-limit
                  maxlength="30"
                  v-model="formData.drawingName"
                  placeholder="请输入图纸名称"
                  style="width: 70%"
                /> -->
                  <el-date-picker
                    v-model="formData.reportDate"
                    placeholder="请选择报告日期"
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
                    placeholder="请选择检测日期"
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
                    placeholder="请选择采样日期"
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
                    placeholder="请选择取样日期"
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
                    show-word-limit
                    maxlength="50"
                    v-model="formData.representativeQuantity"
                    placeholder="请输入代表数量"
                    style="width: 70%"
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
                  <!-- <el-input
                  show-word-limit
                  maxlength="30"
                  v-model="formData.drawingName"
                  placeholder="请输入所属标段"
                  style="width: 70%"
                /> -->
                  <el-select @visible-change="$visibleChange($event, 'el-popper')"
                    ref="sectionIdRef"
                    v-model="formData.section"
                    filterable
                    clearable
                    :disabled="sectionIdAble"
                    style="width: 70%"
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
                    :readonly="!enterAble"
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
              <!-- <el-col :span="12">
              <el-form-item label="使用部位" prop="pbsCode">
                <el-input
                  show-word-limit
                  maxlength="30"
                  v-model="formData.pbsCode"
                  placeholder="请输入图纸名称"
                  style="width: 70%"
                />
                <el-input
                  disabled
                  placeholder="请选择使用部位"
                  v-model="formData.pbsCode"
                  style="width: 70%"
                >
                  <template slot="append">
                    <div @click.stop="showPbs">选择</div>
                  </template>
                </el-input>
              </el-form-item>
            </el-col> -->
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
              <el-col :span="12">
                <el-form-item label="检测报告" prop="uploadFile">
                  <uploadFile
                    :readonly="readonly"
                    v-model="formData.uploadFile"
                    :limit="1"
                    :maxSize="200"
                    accept=".pdf,.docx,.doc"
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
        <!--
    <pbs-select
      :visible.sync="pbsDialog.show"
      :selection="pbsDialog.selection"
      @childEvt="pbsSelectedHandle"
      @closed="pbsDialog.show = false"
    /> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure(formData)" v-if="enterAble">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save, update, sectionList } from "./api";
import { FormMixin } from "@/mixins/FormMixin";
import PbsSelect from "@/components/PbsSelect/index.vue";
import ElQuarterPicker from "@/components/ElQuarterPicker/index.vue";
import { sectionAllList } from '../../reagentTesting/reagents/api';
export default {
  name: "dataform",
  mixins: [FormMixin],
  components: {
    PbsSelect,
    ElQuarterPicker,
  },
  data() {
    //文件自定义校验规则
    const validFile = (rule, value, callback) => {
      if (
        this.formData.uploadFile.length === 0 ||
        this.formData.uploadFile === null ||
        typeof this.formData.uploadFile == "undefined"
      ) {
        callback(new Error("请上传检验报告"));
      }
    };
    return {
      littleTableAble: false,
      tableData: [],
      tableData1: [
        {
          name: "比表面积",
          nameDetail: "",
          code: "specificSurfaceArea",
          value: "",
          unit: "㎡/kg",
        },
        {
          name: "凝结时间",
          nameDetail: "初凝",
          code: "initialSettingTime",
          value: "",
          unit: "min",
        },
        {
          name: "凝结时间",
          nameDetail: "终凝",
          code: "finalSettingTime",
          value: "",
          unit: "min",
        },
        {
          name: "安定性",
          nameDetail: "",
          code: "stability",
          value: "",
          unit: "",
        },
        {
          name: "标稠",
          nameDetail: "",
          code: "viscousAgent",
          value: "",
          unit: "%",
        },
        {
          name: "抗折强度",
          nameDetail: "3d",
          code: "flexuralStrength3d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "抗折强度",
          nameDetail: "7d",
          code: "flexuralStrength7d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "抗折强度",
          nameDetail: "28d",
          code: "flexuralStrength28d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "抗压强度",
          nameDetail: "3d",
          code: "compressiveStrength3d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "抗压强度",
          nameDetail: "7d",
          code: "compressiveStrength7d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "抗压强度",
          nameDetail: "28d",
          code: "compressiveStrength28d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "水化热值",
          nameDetail: "3d",
          code: "heatHydration3d",
          value: "",
          unit: "KJ/Kg",
        },
        {
          name: "水化热值",
          nameDetail: "7d",
          code: "heatHydration7d",
          value: "",
          unit: "KJ/Kg",
        },
        {
          name: "烧失量",
          nameDetail: "",
          code: "lossOnIgnition",
          value: "",
          unit: "%",
        },
        { name: "SO3", nameDetail: "", code: "so3", value: "", unit: "%" },
        { name: "MgO", nameDetail: "", code: "mgo", value: "", unit: "%" },
        {
          name: "碱含量",
          nameDetail: "",
          code: "alkaliContent",
          value: "",
          unit: "%",
        },
        {
          name: "氯离子",
          nameDetail: "",
          code: "chlorideIon",
          value: "",
          unit: "%",
        },
      ],
      tableData2: [
        {
          name: "比表面积",
          nameDetail: "",
          code: "specificSurfaceArea",
          value: "",
          unit: "㎡/kg",
        },
        {
          name: "凝结时间",
          nameDetail: "初凝",
          code: "initialSettingTime",
          value: "",
          unit: "min",
        },
        {
          name: "凝结时间",
          nameDetail: "终凝",
          code: "finalSettingTime",
          value: "",
          unit: "min",
        },
        {
          name: "安定性",
          nameDetail: "",
          code: "stability",
          value: "",
          unit: "",
        },
        {
          name: "标稠",
          nameDetail: "",
          code: "viscousAgent",
          value: "",
          unit: "%",
        },
        {
          name: "抗折强度",
          nameDetail: "3d",
          code: "flexuralStrength3d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "抗折强度",
          nameDetail: "28d",
          code: "flexuralStrength28d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "抗压强度",
          nameDetail: "3d",
          code: "compressiveStrength3d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "抗压强度",
          nameDetail: "28d",
          code: "compressiveStrength28d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "烧失量",
          nameDetail: "",
          code: "lossOnIgnition",
          value: "",
          unit: "%",
        },
        { name: "SO3", nameDetail: "", code: "so3", value: "", unit: "%" },
        { name: "MgO", nameDetail: "", code: "mgo", value: "", unit: "%" },
        {
          name: "碱含量",
          nameDetail: "",
          code: "alkaliContent",
          value: "",
          unit: "%",
        },
        {
          name: "氯离子",
          nameDetail: "",
          code: "chlorideIon",
          value: "",
          unit: "%",
        },
      ],
      tableData3: [
        {
          name: "细度",
          nameDetail: "",
          code: "residueOn45umSieve",
          value: "",
          unit: "%",
        },
        {
          name: "需水量比",
          nameDetail: "",
          code: "waterDemandRatio",
          value: "",
          unit: "%",
        },
        {
          name: "含水量",
          nameDetail: "",
          code: "moistureContent",
          value: "",
          unit: "%",
        },
        {
          name: "烧失量",
          nameDetail: "",
          code: "lossOnIgnition",
          value: "",
          unit: "%",
        },
        { name: "SO3", nameDetail: "", code: "so3", value: "", unit: "%" },
        {
          name: "碱含量",
          nameDetail: "",
          code: "alkaliContent",
          value: "",
          unit: "%",
        },
        { name: "f-Cao", nameDetail: "", code: "fcao", value: "", unit: "%" },
        {
          name: "28d活性指数",
          nameDetail: "",
          code: "activityIndex28days",
          value: "",
          unit: "%",
        },
        {
          name: "密度",
          nameDetail: "",
          code: "density",
          value: "",
          unit: "g/cm³",
        },
        {
          name: "SiO2+Al2O3+Fe2O3总质量分数",
          nameDetail: "",
          code: "massFraction",
          value: "",
          unit: "%",
        },
      ],
      tableData4: [
        {
          name: "45μm筛筛余量",
          nameDetail: "",
          code: "residueOn45umSieve",
          value: "",
          unit: "%",
        },
        {
          name: "比表面积",
          nameDetail: "",
          code: "specificSurfaceArea",
          value: "",
          unit: "㎡/kg",
        },
        {
          name: "需水量比",
          nameDetail: "",
          code: "waterDemandRatio",
          value: "",
          unit: "%",
        },
        {
          name: "28d活性指数",
          nameDetail: "",
          code: "activityIndex28days",
          value: "",
          unit: "%",
        },
        {
          name: "烧失量",
          nameDetail: "",
          code: "lossOnIgnition",
          value: "",
          unit: "%",
        },
        {
          name: "二氧化硅",
          nameDetail: "",
          code: "siliconDioxide",
          value: "",
          unit: "%",
        },
        {
          name: "含水率",
          nameDetail: "",
          code: "moistureContent",
          value: "",
          unit: "%",
        },
        { name: "SO3", nameDetail: "", code: "so3", value: "", unit: "%" },
        {
          name: "氯离子",
          nameDetail: "",
          code: "chlorideIon",
          value: "",
          unit: "%",
        },
      ],
      tableData5: [
        {
          name: "细度",
          nameDetail: "",
          code: "residueOn45umSieve",
          value: "",
          unit: "%",
        },
        {
          name: "初凝时间",
          nameDetail: "",
          code: "initialSettingTime",
          value: "",
          unit: "min",
        },
        {
          name: "终凝时间",
          nameDetail: "",
          code: "finalSettingTime",
          value: "",
          unit: "min",
        },
        {
          name: "含水率",
          nameDetail: "",
          code: "moistureContent",
          value: "",
          unit: "%",
        },
        {
          name: "1d抗压强度",
          nameDetail: "",
          code: "compressiveStrength1d",
          value: "",
          unit: "Mpa",
        },
        {
          name: "28d抗压强度比",
          nameDetail: "",
          code: "compressiveStrength28dRatio",
          value: "",
          unit: "%",
        },
      ],
      /**施工标段 */
      sectionOptions: [],
      //折叠面板默认打开第一个
      activeName: "1",
      dialogShow: false,
      // date: {
      //   name: null,
      //   params: {
      //     projectPbs: {
      //       name: "",
      //     },
      //   },
      // },
      dateRules: {
        date: [{ required: true, message: "请选择时间", trigger: "blur" }],
        uploadFile: [
          { required: true, message: "请上传报告文件", trigger: "blur" },
        ],
      },
      uploadFileList: [],
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },
      formData: {
        representativeQuantity: "",
        section: "",
        name: "",
        id: "",
        isChange: "1",
        planId: "",
        actualDate: "",
        remark: "",
        designSupplyFileList: [],
        tableData: [],
        otherFile: "",
        uploadFile: "",
        unqualifiedFile: "",
      },
      formDataRules: {
        reportCode: [
          { required: true, message: "请输入报告编号", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入样品编号", trigger: "blur" }],
        reportDate: [
          { required: true, message: "请选择报告日期", trigger: "blur" },
        ],

        testResult: [
          { required: true, message: "请选择检测结论", trigger: "blur" },
        ],
        testPerson: [
          { required: true, message: "请输入试检人员", trigger: "blur" },
        ],
        testDate: [
          { required: true, message: "请选择检测日期", trigger: "blur" },
        ],
        uploadFile: [
          { required: false, message: "请上传检验报告", trigger: "blur" },
        ],
        section: [
          { required: true, message: "请选择所属标段", trigger: "change" },
        ],
      },
      query: {
        name: "",
      },
      placeholderSectionId: "",
      sectionIdAble: true,
      guifenAble: false,
      suNingJiAble: false,
    };
  },
  computed: {},
  created() {},
  props: {
    enterAble: {
      type: Boolean,
      default: false,
    },
    view: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    date: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getTable();
      this.getCurrent();
    });
    // this.getTable()
  },
  methods: {
    /* 获取当前登录人信息*/
    async getCurrent() {
      sectionAllList({}).then((res) => {
        this.sectionOptions = [];
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
    getText(value) {
      value;
    },
    getTable() {
      //新增时
      if (!this.formData.name) {
        //从缓存里取出材料名称
        // this.formData.reportDate = new Date();
        // this.formData.testDate = new Date();
        // this.formData.samplingDate = new Date();
      }
      console.log("this.formData", this.formData);
      if (this.formData?.name.includes("中热水泥")) {
        this.tableData = this.tableData1;
      } else if (this.formData?.name.includes("普通硅酸盐水泥")) {
        this.tableData = this.tableData2;
      } else if (this.formData?.name.includes("粉煤灰")) {
        this.tableData = this.tableData3;
      } else if (this.formData?.name.includes("硅粉")) {
        this.tableData = this.tableData4;
        this.guifenAble = true;
      } else if (this.formData?.name.includes("速凝剂")) {
        this.tableData = this.tableData5;
        this.guifenAble = true;
        this.suNingJiAble = true;
      }
      // this.tableData.forEach((item) => {
      //   item.value = this.formData[item.code];
      // });
      this.dialogShow = this.visible;
      this.$nextTick(() => {
        this.getLittleDate();
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
    selectDate(val) {
      this.$refs["date"].clearValidate("date");
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
      var field = {};
      if (this.tableData) {
        this.tableData.forEach((item) => {
          if (item.value) {
            field[item.code] = item.value;
          }
        });
        field = { ...this.formData, ...field };
      }
      // console.log("save fields", fields);
      //做业务数据的保存,修改。
      save(field)
        .then((res) => {
          const { success, message, data } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            // callback && callback();
            this.$message.success("新增成功");
            this.$emit("sureson");
            this.closedHandle();
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });

      // update(this.formData).then((res) => {
      //   if (res.success) {
      //     this.$message.success("保存成功");
      //   } else {
      //     this.$message.error(res.message);
      //   }
      // });
    },
    closedHandle() {
      this.dialogShow = false;
      this.$nextTick(() => {
        this.$emit("childrenSure", this.dialogShow, this.formData.name);
      });
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {},
    showPbs() {
      if (this.data.isView) return;
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      this.date.pbsCode = pbs.code;
      this.date.params.projectPbs.name = pbs.name;
    },
    /**
     * 附件上传前
     */
    attachmentsBeforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 < 100;
      if (!isRightSize) {
        this.$message.warning("文件大小超过 100MB");
        return false;
      }
      return isRightSize;
    },
    getLittleDate() {
      if (this.formData) {
        this.tableData.forEach((item) => {
          item.value = this.formData[item.code];
        });
      }
    },
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
    },
    "formData.uploadFile": {
      handler(val) {
        let arr = JSON.parse(val);
        if (arr.length > 0) {
          this.$refs.dataFormRef.clearValidate("uploadFile");
        }
      },
    },
    "formData.testResult": {
      handler(val) {
        if (val) {
          //清除校验状态
          this.$refs.dataFormRef.clearValidate("testResult");
        }
      },
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  // padding: 15px;

  .table {
    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
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

/deep/ .wbench-el-dialog {
  .el-dialog__body {
    max-height: 70vh !important;
  }
}
</style>

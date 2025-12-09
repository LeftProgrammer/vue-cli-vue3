<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="50%"
      v-draggable
      @closed="closedHandle"
    >
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="不合格处理信息" name="1">
          <div style="margin-top: 10px;">
            <el-form
              ref="dataFormRef1"
              :model="formData"
              :rules="formDataRules"
              :disabled="!enterAble"
              label-width="auto"
            >
            <el-row :gutter="20">
              <el-col :span="12">
                  <el-form-item label="样品名称" prop="name">
                    <el-input
                      disabled
                      v-model="formData.name"
                      style="width: 70%"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="样品编号" prop="reportCode">
                    <el-input
                      disabled
                      v-model="formData.reportCode"
                      style="width: 70%"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="闭合日期" prop="closureDate">
                  <el-date-picker
                    v-model="formData.closureDate"
                    type="date"
                    value-format="timestamp"
                    style="width: 70%"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="复检报告编号" prop="recheckReportCode">
                  <el-input
                    v-model="formData.recheckReportCode"
                    style="width: 70%"
                    show-word-limit
                    maxlength="50"
                    placeholder="请输入复检报告编号"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="不合格项目" prop="unqualifiedProject">
                  <el-input
                    type="textarea"
                    show-word-limit
                    maxlength="500"
                    v-model="formData.unqualifiedProject"
                    placeholder="请输入不合格项目"
                    style="width: 86.5%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="规范及设计要求" prop="standard">
                  <el-input
                    type="textarea"
                    show-word-limit
                    maxlength="500"
                    v-model="formData.standard"
                    placeholder="请输入规范及设计要求"
                    style="width: 86.5%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="处理情况" prop="response">
                  <el-input
                    type="textarea"
                    show-word-limit
                    maxlength="500"
                    v-model="formData.response"
                    placeholder="处理情况"
                    style="width: 86.5%"
                  />
                </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="评价意见" prop="suggestion">
                    <el-input
                      type="textarea"
                      show-word-limit
                      maxlength="500"
                      v-model="formData.suggestion"
                      placeholder="请输入评价意见"
                      style="width: 86.5%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="unqualifiedRemark" show-overflow-tooltip>
                    <el-input
                      type="textarea"
                      show-word-limit
                      maxlength="500"
                      v-model="formData.unqualifiedRemark"
                      placeholder="备注"
                      style="width: 86.5%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" >
                  <el-form-item label="附件上传"  prop="unqualifiedFile">
                    <uploadFile :readonly="!enterAble" v-model="formData.unqualifiedFile" :maxSize="200"></uploadFile>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-collapse-item>
        <el-collapse-item title="检测信息" name="2">
          <el-form
            ref="dataFormRef2"
            :model="formData"
            :rules="formDataRules"
            :disabled="true"
            label-width="auto"
          >
            <div>
              <el-row :gutter="20">
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
                      placeholder="请选择报告日期"
                      type="date"
                      value-format="timestamp"
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
                      value-format="timestamp"
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
                      value-format="timestamp"
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
                      value-format="timestamp"
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
                  <el-form-item label="品种强度等级" prop="strainStrength" v-if="!guifenAble">
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
                      placeholder="请输入图纸名称"
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
                      maxlength="30"
                      v-model="formData.representativeQuantity"
                      placeholder="请输入代表数量"
                      style="width: 70%"
                      @input="() => {formData.representativeQuantity = $formatValue(formData.representativeQuantity);}"
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
                    <pbs-select style="width: 70%" v-model="formData.pbsCode" :readonly="true"></pbs-select>
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
                <el-col :span="12">
                  <el-form-item label="检测报告" prop="uploadFile" accept=".pdf,.docx,.doc">
                    <uploadFile :readonly="true" v-model="formData.uploadFile" :limit="1"  :maxSize="200"></uploadFile>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="其他附件" prop="otherFile">
                    <uploadFile :readonly="true" v-model="formData.otherFile"  :maxSize="200"></uploadFile>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="font-14  font-w-700" style="color: #626262;">检测项目列表</div>
              <el-divider ></el-divider>
              <el-table :data="tableData" style="width: 98%; margin-left: 1%;" border fit :header-cell-style="{textAlign:'center'}">
                <el-table-column label="检测项目" prop="name" align="left"/>
                <el-table-column label="检测项目明细" prop="nameDetail" align="center" v-if="littleTableAble" />
                <el-table-column label="计量单位" prop="unit" align="center" />
                <el-table-column label="检测实际值" prop="value"  align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.value"
                      @input="
                        () => {
                          scope.row.value = $formatValue(
                            scope.row.value
                          );
                        }
                      "
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </el-collapse-item>
      </el-collapse>
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
import { dateFormat } from "@/utils";
import PbsSelect from "@/components/PbsSelect/index.vue";
import ElQuarterPicker from "@/components/ElQuarterPicker/index.vue";
import { sectionAllList } from '../reagents/api';
export default {
  name: "dataform",
  mixins: [FormMixin],
  components: {
    PbsSelect,
    ElQuarterPicker,
  },
  data() {
    return {
      littleTableAble:false,
      tableData: [],
      tableData1: [
        {name:"比表面积",nameDetail:"",code:"specificSurfaceArea",value:"",unit:"㎡/kg"},
        {name:"凝结时间",nameDetail:"初凝",code:"initialSettingTime",value:"",unit:"min"},
        {name:"凝结时间",nameDetail:"终凝",code:"finalSettingTime",value:"",unit:"min"},
        {name:"安定性",nameDetail:"",code:"stability",value:"",unit:""},
        {name:"标稠",nameDetail:"",code:"viscousAgent",value:"",unit:"%"},
        {name:"抗折强度",nameDetail:"3d",code:"flexuralStrength3d",value:"",unit:"Mpa"},
        {name:"抗折强度",nameDetail:"7d",code:"flexuralStrength7d",value:"",unit:"Mpa"},
        {name:"抗折强度",nameDetail:"28d",code:"flexuralStrength28d",value:"",unit:"Mpa"},
        {name:"抗压强度",nameDetail:"3d",code:"compressiveStrength3d",value:"",unit:"Mpa"},
        {name:"抗压强度",nameDetail:"7d",code:"compressiveStrength7d",value:"",unit:"Mpa"},
        {name:"抗压强度",nameDetail:"28d",code:"compressiveStrength28d",value:"",unit:"Mpa"},
        {name:"水化热值",nameDetail:"3d",code:"heatHydration3d",value:"",unit:"KJ/Kg"},
        {name:"水化热值",nameDetail:"7d",code:"heatHydration7d",value:"",unit:"KJ/Kg"},
        {name:"烧失量",nameDetail:"",code:"lossOnIgnition",value:"",unit:"%"},
        {name:"SO3",nameDetail:"",code:"so3",value:"",unit:"%"},
        {name:"MgO",nameDetail:"",code:"mgo",value:"",unit:"%"},
        {name:"碱含量",nameDetail:"",code:"alkaliContent",value:"",unit:"%"},
        {name:"氯离子",nameDetail:"",code:"chlorideIon",value:"",unit:"%"},
      ],
      tableData2: [
        {name:"比表面积",nameDetail:"",code:"specificSurfaceArea",value:"",unit:"㎡/kg"},
        {name:"凝结时间",nameDetail:"初凝",code:"initialSettingTime",value:"",unit:"min"},
        {name:"凝结时间",nameDetail:"终凝",code:"finalSettingTime",value:"",unit:"min"},
        {name:"安定性",nameDetail:"",code:"stability",value:"",unit:""},
        {name:"标稠",nameDetail:"",code:"viscousAgent",value:"",unit:"%"},
        {name:"抗折强度",nameDetail:"3d",code:"flexuralStrength3d",value:"",unit:"Mpa"},
        {name:"抗折强度",nameDetail:"28d",code:"flexuralStrength28d",value:"",unit:"Mpa"},
        {name:"抗压强度",nameDetail:"3d",code:"compressiveStrength3d",value:"",unit:"Mpa"},
        {name:"抗压强度",nameDetail:"28d",code:"compressiveStrength28d",value:"",unit:"Mpa"},
        {name:"烧失量",nameDetail:"",code:"lossOnIgnition",value:"",unit:"%"},
        {name:"SO3",nameDetail:"",code:"so3",value:"",unit:"%"},
        {name:"MgO",nameDetail:"",code:"mgo",value:"",unit:"%"},
        {name:"碱含量",nameDetail:"",code:"alkaliContent",value:"",unit:"%"},
        {name:"氯离子",nameDetail:"",code:"chlorideIon",value:"",unit:"%"},
      ],
      tableData3: [
        {name:"细度",nameDetail:"",code:"residueOn45umSieve",value:"",unit:"%"},
        {name:"需水量比",nameDetail:"",code:"waterDemandRatio",value:"",unit:"%"},
        {name:"含水量",nameDetail:"",code:"moistureContent",value:"",unit:"%"},
        {name:"烧失量",nameDetail:"",code:"lossOnIgnition",value:"",unit:"%"},
        {name:"SO3",nameDetail:"",code:"so3",value:"",unit:"%"},
        {name:"碱含量",nameDetail:"",code:"alkaliContent",value:"",unit:"%"},
        {name:"f-Cao",nameDetail:"",code:"fcao",value:"",unit:"%"},
        {name:"28d活性指数",nameDetail:"",code:"activityIndex28days",value:"",unit:"%"},
        {name:"密度",nameDetail:"",code:"density",value:"",unit:"g/cm³"},
        {name:"SiO2+Al2O3+Fe2O3总质量分数",nameDetail:"",code:"massFraction",value:"",unit:"%"},
      ],
      tableData4: [
        {name:"45μm筛筛余量",nameDetail:"",code:"residueOn45umSieve",value:"",unit:"%"},
        {name:"比表面积",nameDetail:"",code:"specificSurfaceArea",value:"",unit:"㎡/kg"},
        {name:"需水量比",nameDetail:"",code:"waterDemandRatio",value:"",unit:"%"},
        {name:"28d活性指数",nameDetail:"",code:"activityIndex28days",value:"",unit:"%"},
       {name:"烧失量",nameDetail:"",code:"lossOnIgnition",value:"",unit:"%"},
        {name:"二氧化硅",nameDetail:"",code:"siliconDioxide",value:"",unit:"%"},
        {name:"含水率",nameDetail:"",code:"moistureContent",value:"",unit:"%"},
        {name:"SO3",nameDetail:"",code:"so3",value:"",unit:"%"},
        { name: "氯离子", nameDetail: "", code: "chlorideIon", value: "", unit: "%" },
      ],
      tableData5: [
        {name:"细度",nameDetail:"",code:"residueOn45umSieve",value:"",unit:"%"},
        {name:"初凝时间",nameDetail:"",code:"initialSettingTime",value:"",unit:"min"},
        {name:"终凝时间",nameDetail:"",code:"finalSettingTime",value:"",unit:"min"},
        {name:"含水率",nameDetail:"",code:"moistureContent",value:"",unit:"%"},
        {name:"1d抗压强度",nameDetail:"",code:"compressiveStrength1d",value:"",unit:"Mpa"},
        {name:"28d抗压强度比",nameDetail:"",code:"compressiveStrength28dRatio",value:"",unit:"%"},
      ],
      formDataRules: {
        closureDate: [{ required: true, message: "请输入闭合日期", trigger: "blur" },],
        unqualifiedProject: [{ required: true, message: "请输入不合格项目", trigger: ["change", "blur"] },],
        response: [{ required: true, message: "请输入处理情况", trigger: ["change", "blur"] },],
        suggestion: [{ required: true, message: "请输入评价意见", trigger: ["change", "blur"] },],
      },
      /**施工标段 */
      sectionOptions: [],
      //折叠面板默认打开第一个
      activeName: "1",
      activeNameOld: "2",
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
      formData:{},
      guifenAble:false,
      suNingJiAble:false,
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
    console.log("data", this.data);
    this.$nextTick(()=>{
      this.getTable()
    });
    //获取标段
    this.getSectionList();
    // this.getSectionListByPage(); //获取与单位关联的标段
  },
  methods: {
    clearValidate(){
     this.$nextTick(()=>{
      this.$refs.dataFormRef1.clearValidate();
      this.$refs.dataFormRef2.clearValidate();
     })
    },
    getTable(){
      if (this.formData.name.includes("中热水泥")) {
        this.tableData = this.tableData1;
      } else if(this.formData.name.includes("普通硅酸盐水泥")){
        this.tableData = this.tableData2;
      } else if(this.formData.name.includes("粉煤灰")){
        this.tableData = this.tableData3;
      } else if(this.formData.name.includes("硅粉")){
        this.tableData = this.tableData4;
        this.guifenAble = true;
      } else if(this.formData.name.includes("速凝剂")){
        this.tableData = this.tableData5;
        this.guifenAble = true;
        this.suNingJiAble= true;
      }
      this.tableData.forEach((item) => {
        item.value = this.formData[item.code];
      });
      this.dialogShow = this.visible
      this.$nextTick(() => {
        this.getLittleTable();
      })
    },
    getLittleTable(){
      for (var i = 0; i < this.tableData.length; i++) {
        if(this.tableData[i].nameDetail){
          this.littleTableAble = true;
          return
        }
      }
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionAllList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    selectDate(val) {
      this.$refs["date"].clearValidate("date");
    },
    // 确认按钮
    sure() {
      this.$refs.dataFormRef1.validate((val) => {
        if (val) {
          this.submit()
        }
      })
    },
    // 确认按钮
    submit(data) {
      if (!this.formData.closureDate|| !this.formData.unqualifiedProject|| !this.formData.response || !this.formData.suggestion) {
        this.$message.error("请检查必填项");
        return
      }
      // this.$refs[data].validate((valid) => {
      //   if (valid) {
      //     alert('submit!');
      //   } else {
      //     console.log('error submit!!');
      //     return false;
      //   }
      // });
      update(this.formData).then((res) => {
        if (res.success) {
          this.$message.success("保存成功");
          this.closedHandle();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    closedHandle() {
      this.$emit('childrenSure',{dialogShow:this.dialogShow,name:this.formData.name})
      this.dialogShow = false;
    },
    showPbs() {
      if (this.data.isView) return;
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      this.date.pbsCode = pbs.code;
      this.date.params.projectPbs.name = pbs.name;
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
  },
  watch: {
    "activeName":{
      handler(newVal,oldVal) {
        if (newVal) {
          if (newVal == "1") {
            this.activeNameOld = "2"
          }else{
            this.activeNameOld = "1"
          }
        }else {
          this.activeName = this.activeNameOld;
        }
      }
    },
    "formData": {
      handler(val) {
        if (val) {
          // val.closureDate = this.timeFormat(val.closureDate, "YYYY-MM-DD")
          // val.reportDate = this.timeFormat(val.reportDate, "YYYY-MM-DD");
          // val.testDate = this.timeFormat(val.testDate, "YYYY-MM-DD");
          // val.samplingDate = this.timeFormat(val.samplingDate, "YYYY-MM-DD");
          // val.collectionDate = this.timeFormat(val.collectionDate, "YYYY-MM-DD");
          // val.closureDate = this.timeFormat(val.closureDate)
          // val.reportDate = this.timeFormat(val.reportDate);
          // val.testDate = this.timeFormat(val.testDate);
          // val.samplingDate = this.timeFormat(val.samplingDate);
          // val.collectionDate = this.timeFormat(val.collectionDate);
          this.formData = val;
        }
      },
    },
  visible: {
      handler(newValue) {
        this.dialogShow=newValue
        // this.formData = this.data.data;

        // console.log("this.formData",this.formData);
        // if (!this.formData.unqualifiedFiles) {
        //   this.formData.unqualifiedFiles = []
        // }
        // if (this.date.name) {
        //   console.log("修改");
        //   this.uploadFileList = [
        //     {
        //       name: this.date.name,
        //       // url:
        //       //   "/api/attachments/download?attId=" + this.date.uploadFile,
        //     },
        //   ];
        // }
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
/deep/ .el-collapse-item__header {
  font-size: 16px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体粗细 */
  // font-weight: 700;
  /* 其他样式属性 */
}
// .el-divider--horizontal{
//      margin-left: 5%;
//      margin-right: 5%;
//  }

/deep/ .wbench-el-dialog {
  .el-dialog__body {
    max-height: 70vh !important;
  }
}
</style>

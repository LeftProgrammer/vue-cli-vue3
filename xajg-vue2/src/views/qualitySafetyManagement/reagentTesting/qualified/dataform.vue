<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="40%"
      @closed="closedHandle"
      v-draggable
    >
      <el-form
        v-if="type !== 'test' && type !== 'testView'"
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly"
      >
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item label="材料分类" prop="classification">
              <el-input v-model="nodeInfo.classification" :disabled="true" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="材料名称" prop="name">
              <el-input v-model="nodeInfo.name" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料编号" prop="code">
              <el-input
                v-model="formData.code"
                placeholder="请输入材料编号"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测日期" prop="testDate">
              <el-date-picker
                v-model="formData.testDate"
                type="date"
                placeholder="选择检测日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测人员" prop="testUser">
              <el-input
                v-model="formData.testUser"
                placeholder="请输入检测人员"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="材料批号" prop="batchCode">
              <el-input
                v-model="formData.batchCode"
                placeholder="请输入材料批号"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="所属标段" prop="section">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                ref="sectionIdRef"
                v-model="formData.section"
                placeholder="请选择"
                filterable
                clearable
                style="width: 100%"
                :disabled="showSection || readonly"
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
            <el-form-item label="所属单位" prop="constructionUnit">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.constructionUnit"
                placeholder="请选择"
                :disabled="showConstructionUnit || readonly"
              >
                <el-option
                  v-for="item in belongUnit"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结论" prop="testResult">
              <el-radio-group
                v-model="formData.testResult"
                @change="handleResultChange"
              >
                <el-radio :label="1">合格</el-radio>
                <el-radio :label="2">不合格</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="材料数量" prop="quantity">
              <el-input
                v-model="formData.quantity"
                placeholder="请输入材料数量"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="使用部位" prop="pbsCode">
              <pbs-select
                v-model="formData.pbsCode"
                :readonly="readonly"
                @change="selectCurrentPbs"
              ></pbs-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检测报告" prop="testReport">
              <uploadFile
                v-model="formData.testReport"
                :readonly="readonly"
                :limit="1"
                :maxSize="200"
                @change="handleFileChange"
              ></uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检测附件" prop="detectionFile">
              <uploadFile
                v-model="formData.detectionFile"
                :readonly="readonly"
                :limit="10"
                :maxSize="200"
              ></uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="不合格说明"
              prop="unqualifiedExplain"
              v-if="formData.testResult === 2"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入不合格说明"
                v-model="formData.unqualifiedExplain"
                maxlength="500"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form
        v-if="type === 'test' || type === 'testView'"
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly || type === 'testView'"
        label-position="right"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="检测信息" name="first">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="材料名称" prop="name">
                  <el-input v-model="nodeInfo.name" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材料编号" prop="code">
                  <el-input
                    v-model="formData.code"
                    placeholder="请输入材料编号"
                    maxlength="50"
                    show-word-limit
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材料检测" prop="needTest">
                  <el-radio-group
                    v-model="formData.needTest"
                    @change="handleNeedTestChange"
                  >
                    <el-radio :label="1">闭合</el-radio>
                    <el-radio :label="2">检测</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.needTest === 2">
                <el-form-item label="检测日期" prop="testDate">
                  <el-date-picker
                    v-model="formData.testDate"
                    type="date"
                    placeholder="选择检测日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.needTest === 2">
                <el-form-item label="检测人员" prop="testUser">
                  <el-input
                    v-model="formData.testUser"
                    placeholder="请输入检测人员"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.needTest === 2">
                <el-form-item label="检测结论" prop="testResult">
                  <el-radio-group
                    v-model="formData.testResult"
                    @change="handleResultChange"
                  >
                    <el-radio :label="1">合格</el-radio>
                    <el-radio :label="2">不合格</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="formData.needTest === 2">
                <el-form-item label="检测报告" prop="testReport">
                  <uploadFile
                    v-model="formData.testReport"
                    :readonly="readonly || type === 'testView'"
                    :limit="1"
                    :maxSize="200"
                    @change="handleFileChange"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="formData.needTest === 2">
                <el-form-item label="检测附件" prop="detectionFile">
                  <uploadFile
                    v-model="formData.detectionFile"
                    :readonly="readonly || type === 'testView'"
                    :limit="10"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="formData.needTest === 2">
                <el-form-item
                  label="不合格说明"
                  prop="unqualifiedExplain"
                  v-if="formData.testResult === 2"
                >
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入不合格说明"
                    v-model="formData.unqualifiedExplain"
                    maxlength="500"
                    show-word-limit
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="color: #989898">
                温馨提示:若材料不检测请直接选择【闭合】并点击底部【确定】关闭弹窗，若需要【检测】请完善检测信息.
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="报检信息" name="second">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="材料分类" prop="classification">
                  <el-input
                    v-model="nodeInfo.classification"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材料名称" prop="name">
                  <el-input v-model="nodeInfo.name" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材料编号" prop="code">
                  <el-input
                    v-model="formData.code"
                    placeholder="请输入材料编号"
                    maxlength="50"
                    show-word-limit
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材料批号" prop="batchCode">
                  <el-input
                    v-model="formData.batchCode"
                    placeholder="请输入材料批号"
                    maxlength="50"
                    show-word-limit
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属标段" prop="section">
                  <el-select @visible-change="$visibleChange($event, 'el-popper')"
                    ref="sectionIdRef"
                    v-model="formData.section"
                    placeholder="请选择"
                    filterable
                    clearable
                    style="width: 100%"
                    :disabled="true"
                  >
                    <el-option
                      v-for="item in sectionAllOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="施工单位" prop="constructionUnit">
                  <el-select @visible-change="$visibleChange($event, 'el-popper')"
                    class="w-100pre"
                    v-model="formData.constructionUnit"
                    placeholder="请选择"
                    :disabled="true"
                  >
                    <el-option
                      v-for="item in allUnit"
                      :key="item.corpId"
                      :label="item.corpName"
                      :value="item.corpId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材料数量" prop="quantity">
                  <el-input
                    v-model="formData.quantity"
                    placeholder="请输入材料数量"
                    maxlength="50"
                    show-word-limit
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.classification === 'wgcl'">
                <el-form-item label="生产厂家" prop="manufacturer">
                  <el-input
                    v-model="formData.manufacturer"
                    placeholder="请输入生产厂家"
                    maxlength="255"
                    show-word-limit
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="formData.classification === 'zccl'">
                <el-form-item label="材料产地" prop="originMaterials">
                  <el-input
                    v-model="formData.originMaterials"
                    placeholder="请输入材料产地"
                    maxlength="255"
                    show-word-limit
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="使用部位" prop="pbsCode">
                  <pbs-select
                    v-model="formData.pbsCode"
                    :readonly="true"
                    @change="selectCurrentPbs"
                  ></pbs-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="报检附件" prop="testFile">
                  <uploadFile
                    v-model="formData.testFile"
                    :readonly="true"
                    :limit="10"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
        v-if="type != 'view' && type != 'testView'"
      >
        <el-button type="primary" @click="childEvtHandle"> 确 定 </el-button>
      </div>

      <cor-select :visible.sync="deptDialog.show" />
    </el-dialog>
    <el-dialog
      width="80%"
      title="关联计划项选择"
      :visible.sync="dialogPlanVisible"
    >
      <components
        :page="'drawingSupply'"
        ref="components"
        :is="component"
      ></components>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlanVisible = false">取 消</el-button>
        <el-button
          type="primary"
          
          @click="sure"
          v-if="type != 'view' && type != 'testView'"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  save,
  update,
  corporates,
  sectionList,
  BelongTo
} from "./api";
import { dateFormat } from "@/utils";
import { getDictItemList } from "@/api/dict";
import CorSelect from "@/components/CorSelect/dialog/index.vue";
import { mapGetters } from "vuex";
import PbsSelect from "@/components/PbsSelect/index.vue";
import Unit from "@/components/Organize/Unit/index.vue";
import User from "@/components/Organize/User/index.vue";
import ContentLayout from "@/components/ContentLayout/Table";
import { FormMixin } from "@/mixins/FormMixin";
import MonthlyPlan from "@/components/MonthlyPlan/index.vue";
import { sectionAllList } from "@/views/qualitySafetyManagement/testDetection/api";
export default {
  name: "dataform",
  mixins: [FormMixin],
  components: {
    CorSelect,
    PbsSelect,
    ContentLayout,
    MonthlyPlan,
    User,
    Unit
  },
  data() {
    return {
      activeName: "first",
      component: "MonthlyPlan",
      dialogPlanVisible: false,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      pbsName: "",
      /**弹窗显示 */
      dialogShow: false,
      showSection: false,
      showConstructionUnit: false,
      formData: {
        name: null,
        testResult: 1,
        params: {
          projectPbs: {
            name: ""
          }
        }
      },
      formDataRules: {
        section: [
          { required: true, message: "请选择所属标段", trigger: "change" }
        ],
        // code: [{ required: true, message: "请输入编号", trigger: "change" }],
        testDate: [
          { required: true, message: "请选择检测日期", trigger: "blur" }
        ],
        testResult: [
          { required: true, message: "请选择检测结论", trigger: "blur" }
        ],
        testReport: [
          { required: true, message: "请上传检测报告", trigger: "change" }
        ],
        constructionUnit: [
          { required: true, message: "请选择所属单位", trigger: "change" }
        ],
        pbsCode: [
          { required: true, message: "请选择工程部位", trigger: "change" }
        ],
        needTest: [
          { required: true, message: "请选择材料检测", trigger: "blur" }
        ]
      },
      tableData: [],
      /**部门选择 */
      deptDialog: {
        selection: [],
        show: false,

        /**业务数据 */
        data: {},
        /**业务字段 */
        fields: []
      },
      deptTypes: [],

      /**组织机构选择 */
      deptShow: false,

      /**类型字典 */
      jcxm: {
        code: "jcxm",
        options: []
      },
      typeDictMap: [],
      sectionOptions: [],
      sectionAllOptions: [],
      allUnit: [],
      belongUnit: [],
      unitList: [],
      myUnitId: [],
      nodeInfo: {
        name: "",
        classification: ""
      }
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"])
  },
  async created() {
    // 外购材料和自产材料编号必填
    if (
      this.node.classification === "wgcl" ||
      this.node.classification === "zccl"
    ) {
      this.formDataRules.code = [
        { required: true, message: "请输入编号", trigger: "change" }
      ];
    }
    this.getSectionList();
    this.getBelongTo();
    this.getTypeDictMap();
    this.getUnit();
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => {}
    },
    node: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleFileChange(value) {
      // console.log("handleFileChange", value);
      if (value) {
        this.$refs.dataFormRef.clearValidate("testReport");
      }
    },
    handleResultChange(value) {
      if (value) {
        this.$refs.dataFormRef.clearValidate("testResult");
      }
    },
    handleNeedTestChange(value) {
      console.log(value);
      if (value === 1) {
        this.formData.testResult = 3;
      } else {
        this.formData.testResult = "";
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 收文单位
    getUnit() {
      let unitId = [];
      corporates().then((res) => {
        this.unitList = res.data
          .filter((item) => {
            return item.corpLeaf !== 0;
          })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
        if (
          this.unitList &&
          Array.isArray(this.unitList) &&
          this.unitList.length > 0
        ) {
          unitId = this.unitList.map((item) => item.corpId);
        }
        this.myUnitId = unitId;
      });
    },
    handlerFreeUser(value) {
      if (value) {
        this.$refs.dataFormRef.clearValidate("constructionUnitLaboratory");
      }
    },
    /**获取字典 */
    async getTypeDictMap() {
      const { data } = await getDictItemList("syjc");
      this.typeDictMap = data;
      this.getTypeDictName();
    },
    /** 字段code转name */
    getTypeDictName() {
      if (this.node.name) {
        for (let item of this.typeDictMap) {
          if (item.dictCode === this.node.name) {
            this.nodeInfo.name = item.dictName;
          }
        }
      }
      if (this.node.classification) {
        for (let item of this.typeDictMap) {
          if (item.dictCode === this.node.classification) {
            this.nodeInfo.classification = item.dictName;
          }
        }
      }
    },
    getFileName(fileName) {
      let name = "";
      let arr = JSON.parse(fileName);
      if (fileName && Array.isArray(arr) && arr.length > 0) {
        name = arr[0].name;
      }
      return name;
    },
    sure() {
      let currentRow = this.$refs.components.currentRow;
      if (currentRow) {
        // 2023-08 xxxxx图纸
        if (this.component == "MonthlyPlan") {
          this.planId = `${currentRow.month} ${currentRow.taskName}`;
          this.formData.pbsCode = currentRow.id;
          this.formData.pbsName = currentRow.taskName;
        } else {
          this.formData.designSupply.code = currentRow.code;
          this.formData.designSupply.name = currentRow.name;
          // formData.designSupply.id = currentRow.id;
        }
      }
      this.$nextTick(() => {
        this.dialogPlanVisible = false;
      });
    },
    // 切换组件  MonthlyPlan是关联计划组件  originalDrawing原图纸组件
    chooseComponent(com) {
      this.dialogPlanVisible = true;
      this.component = com;
      this.$nextTick(() => {
        if (com == "MonthlyPlan") {
          this.$refs.components.toDay();
        } else {
          this.$refs.components.default();
        }
      });
    },
    /**关闭弹窗 */
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    /**确认 */
    childEvtHandle() {
      //做业务数据的保存,修改。
      // console.log("this.form", this.formData);
      // return;

      // view   false  return
      if (this.type == "view") {
        this.dialogShow = false;
        return;
      }
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          if (!this.formData.name) {
            this.$set(this.formData, "name", this.node.name);
          }
          if (!this.formData.classification) {
            this.$set(
              this.formData,
              "classification",
              this.node.classification
            );
          }
          let fields = { ...this.formData };
          if (this.type == "add") {
            this.$set(fields, "source", 4);
            // if (!fields.name) {
            //   return this.$message.error("请上传文件");
            // }
            save(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$message.success("新增成功");
                  this.$emit("ok");
                }
                this.closedHandle();
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("新增失败");
              });
          } else {
            update(fields)
              .then((res) => {
                const { success, message } = res;
                if (!success) {
                  return this.$message.error("保存失败：" + message);
                } else {
                  this.$message.success("更新成功");
                  this.$emit("ok");
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
      // let qeq=this.type save  update"
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      this.sectionAllOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
          if (this.sectionOptions.length == 1) {
            this.formData.section = this.sectionOptions[0].id;
            this.showSection = true;
          }
        }
      });
      sectionAllList({}).then((res) => {
        if (res.success) {
          this.sectionAllOptions = res.data;
        }
      });
    },
    // 获取当前人的所属机构
    async getBelongTo() {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId
      };
      // const tempData = this.data;
      // if (tempData.unit) {
      //   params.userId = tempData.createUser;
      // }
      const res = await corporates(params);
      const { data, success } = res;
      if (!success) {
        this.allUnit = [];
      } else {
        this.allUnit = data;
      }

      try {
        const res = await BelongTo(params);
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取当前人的所属机构错误");
          // 源数据
          this.belongUnit = [];
          return;
        }
        if (Array.isArray(data) && data?.length > 0) {
          this.belongUnitSouce = data;
          // 从源数据中过滤出重复的单位
          this.belongUnit = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          if (this.belongUnit.length == 1) {
            // this.formData.constructionUnit = this.belongUnit[0].corpId;
            this.showConstructionUnit = true;
          }
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },
    selectCurrentPbs(code, pbs) {
      if (pbs) {
        this.formData.pbsName = pbs.name;
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          let newData = { ...this.data };
          this.$nextTick(() => {
            this.formData = newData;
            console.log("表单信息", this.formData);
            if (this.formData.classification) {
              this.node.classification = this.formData.classification;
            }
            if (this.formData.name) {
              this.node.name = this.formData.name;
            }
          });
          this.tableData = this.data.subDetail || [];
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true
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
</style>

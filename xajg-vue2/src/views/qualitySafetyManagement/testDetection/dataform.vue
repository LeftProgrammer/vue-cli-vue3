<template>
  <div>
    <el-dialog
      :title="title"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      :width="fromappform ? '100%' : '40%'"
      :top="fromappform ? '0vh' : '10%'"
      :style="fromappform ? 'height: 150vh' : ''"
      @closed="closedHandle"
      v-draggable
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
        :disabled="readonly"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="报检信息" name="first">
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
                  <el-input v-model="nodeInfo.name" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="材料编号"
                  prop="code"
                  :rules="
                    node.classification === 'wgcl' ||
                    node.classification === 'zccl'
                      ? formDataRules.code
                      : [{ required: false }]
                  "
                >
                  <el-input
                    v-model="formData.code"
                    placeholder="请输入材料编号"
                    maxlength="50"
                    show-word-limit
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
              <el-col :span="24">
                <el-form-item label="施工单位" prop="constructionUnit">
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
                <el-form-item label="材料数量" prop="quantity">
                  <el-input
                    v-model="formData.quantity"
                    placeholder="请输入材料数量"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="node.classification === 'wgcl'">
                <el-form-item label="生产厂家" prop="manufacturer">
                  <el-input
                    v-model="formData.manufacturer"
                    placeholder="请输入生产厂家"
                    maxlength="255"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="node.classification === 'zccl'">
                <el-form-item label="材料产地" prop="originMaterials">
                  <el-input
                    v-model="formData.originMaterials"
                    placeholder="请输入材料产地"
                    maxlength="255"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="使用部位" prop="pbsCode">
                  <pbs-select
                    v-model="formData.pbsCode"
                    :readonly="readonly"
                    @change="selectCurrentPbs"
                  ></pbs-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="报检附件" prop="testFile">
                  <uploadFile
                    v-model="formData.testFile"
                    :readonly="readonly"
                    :limit="10"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <span>报检通知</span>
                <el-divider></el-divider>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="施工单位"
                  prop="constructionUnitLaboratory"
                >
                  <!-- SelectedByDefault  表示不需要默认选中登录人的单位  而是选中 根节点 -->
                  <user
                    :SelectedByDefault="true"
                    v-model="formData.constructionUnitLaboratory"
                    :readonly="readonly"
                    :enableThrottle="true"
                    :multiple="true"
                    :unitId="myUnitId"
                  ></user>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="试验监理" prop="testSupervisionEngineer">
                  <user
                    :SelectedByDefault="true"
                    v-model="formData.testSupervisionEngineer"
                    :readonly="readonly"
                    :multiple="true"
                    :enableThrottle="true"
                    :unitId="myUnitId"
                  ></user>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="试验检测中心" prop="testCenter">
                  <user
                    :SelectedByDefault="true"
                    v-model="formData.testCenter"
                    :readonly="true"
                    :enableThrottle="true"
                    :multiple="true"
                    :unitId="myUnitId"
                  ></user>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="sgdwzjShow" label="施工单位自检" name="second">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="材料名称" prop="name">
                  <el-input v-model="nodeInfo.name" :disabled="true"/>
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
                <el-form-item label="检测日期" prop="testDate">
                  <el-date-picker
                    v-model="sgdwzj.testDate"
                    type="date"
                    placeholder="选择检测日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检测人员" prop="testUser">
                  <el-input
                    v-model="sgdwzj.testUser"
                    placeholder="请输入检测人员"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检测结论" prop="testResult">
                  <el-radio-group
                    v-model="sgdwzj.testResult"
                    @change="handleResultChange"
                  >
                    <el-radio :label="1">合格</el-radio>
                    <el-radio :label="2">不合格</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="检测报告" prop="testReport">
                  <uploadFile
                    v-model="sgdwzj.testReport"
                    :readonly="readonly || type === 'testView'"
                    :limit="1"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="检测附件" prop="detectionFile">
                  <uploadFile
                    v-model="sgdwzj.detectionFile"
                    :readonly="readonly || type === 'testView'"
                    :limit="10"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="不合格说明"
                  prop="unqualifiedExplain"
                  v-if="sgdwzj.testResult === 2"
                >
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入不合格说明"
                    v-model="sgdwzj.unqualifiedExplain"
                    maxlength="500"
                    show-word-limit
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-if="jldwcjShow" label="监理单位抽检" name="three">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="材料名称" prop="name">
                  <el-input v-model="nodeInfo.name" :disabled="true"/>
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
                  <el-radio-group v-model="jldwcj.needTest">
                    <el-radio :label="1">闭合</el-radio>
                    <el-radio :label="2">检测</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="jldwcj.needTest === 2">
                <el-form-item label="检测日期" prop="testDate">
                  <el-date-picker
                    v-model="jldwcj.testDate"
                    type="date"
                    placeholder="选择检测日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="jldwcj.needTest === 2">
                <el-form-item label="检测人员" prop="testUser">
                  <el-input
                    v-model="jldwcj.testUser"
                    placeholder="请输入检测人员"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="jldwcj.needTest === 2">
                <el-form-item label="检测结论" prop="testResult">
                  <el-radio-group
                    v-model="jldwcj.testResult"
                    @change="handleResultChange"
                  >
                    <el-radio :label="1">合格</el-radio>
                    <el-radio :label="2">不合格</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="jldwcj.needTest === 2">
                <el-form-item label="检测报告" prop="testReport">
                  <uploadFile
                    v-model="jldwcj.testReport"
                    :readonly="readonly || type === 'testView'"
                    :limit="1"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="jldwcj.needTest === 2">
                <el-form-item label="检测附件" prop="detectionFile">
                  <uploadFile
                    v-model="jldwcj.detectionFile"
                    :readonly="readonly || type === 'testView'"
                    :limit="10"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="jldwcj.needTest === 2">
                <el-form-item
                  label="不合格说明"
                  prop="unqualifiedExplain"
                  v-if="jldwcj.testResult === 2"
                >
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入不合格说明"
                    v-model="jldwcj.unqualifiedExplain"
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
          <el-tab-pane v-if="dsfsyjcShow" label="试验中心抽检" name="fourth">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="材料名称" prop="name">
                  <el-input v-model="nodeInfo.name" :disabled="true"/>
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
                  <el-radio-group v-model="dsfsyjc.needTest">
                    <el-radio :label="1">闭合</el-radio>
                    <el-radio :label="2">检测</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="dsfsyjc.needTest === 2">
                <el-form-item label="检测日期" prop="testDate">
                  <el-date-picker
                    v-model="dsfsyjc.testDate"
                    type="date"
                    placeholder="选择检测日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="dsfsyjc.needTest === 2">
                <el-form-item label="检测人员" prop="testUser">
                  <el-input
                    v-model="dsfsyjc.testUser"
                    placeholder="请输入检测人员"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="dsfsyjc.needTest === 2">
                <el-form-item label="检测结论" prop="testResult">
                  <el-radio-group
                    v-model="dsfsyjc.testResult"
                    @change="handleResultChange"
                  >
                    <el-radio :label="1">合格</el-radio>
                    <el-radio :label="2">不合格</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="dsfsyjc.needTest === 2">
                <el-form-item label="检测报告" prop="testReport">
                  <uploadFile
                    v-model="dsfsyjc.testReport"
                    :readonly="readonly || type === 'testView'"
                    :limit="1"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="dsfsyjc.needTest === 2">
                <el-form-item label="检测附件" prop="detectionFile">
                  <uploadFile
                    v-model="dsfsyjc.detectionFile"
                    :readonly="readonly || type === 'testView'"
                    :limit="10"
                    :maxSize="200"
                  ></uploadFile>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="dsfsyjc.needTest === 2">
                <el-form-item
                  label="不合格说明"
                  prop="unqualifiedExplain"
                  v-if="dsfsyjc.testResult === 2"
                >
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="请输入不合格说明"
                    v-model="dsfsyjc.unqualifiedExplain"
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
        </el-tabs>
      </el-form>

      <div slot="footer" class="dialog-footer" v-if="type != 'view'">
        <el-button type="primary" @click="childEvtHandle"> 确 定</el-button>
      </div>

      <cor-select :visible.sync="deptDialog.show"/>
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
          v-if="type != 'view'"
        >确 定
        </el-button
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
  BelongTo,
  getByBaseId,
  sectionAllList,
  selectById
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
      fromappform: false,
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
      formData: {
        name: null,
        params: {
          projectPbs: {
            name: ""
          }
        }
      },
      showConstructionUnit: false,
      showSection: false,
      formDataRules: {
        section: [
          { required: true, message: "请选择施工标段", trigger: "change" }
        ],
        code: [{ required: true, message: "请输入编号", trigger: "blur" }],
        constructionUnit: [
          { required: true, message: "请选择施工单位", trigger: "change" }
        ],
        pbsCode: [
          { required: true, message: "请选择工程部位", trigger: "change" }
        ],
        testFile: [{ required: true, message: "请上传", trigger: "change" }],
        constructionUnitLaboratory: [{ required: true, message: "请选择单位", trigger: "change" }],
        testSupervisionEngineer: [{ required: true, message: "请选择单位", trigger: "change" }],
        testCenter: [{ required: true, message: "请选择单位", trigger: "change" }],

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
      belongUnit: [],
      unitList: [],
      myUnitId: [],
      nodeInfo: {
        name: "",
        classification: ""
      },
      sgdwzj: {},
      jldwcj: {},
      dsfsyjc: {},
      sgdwzjShow: false,
      jldwcjShow: false,
      dsfsyjcShow: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"])
  },
  async created() {
    if (this.$route.query.fromappform === "1") {
      this.type = "view";
      this.title = "详情";
      this.fromappform = true;
      this.node = {};
      this.data = {};
      this.formData.id = this.$route.query.Id;
      this.visible = true;
      this.readonly = true;
      this.appInitForm();
      this.getJcxxByBaseId();
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
      default: () => {
      }
    },
    node: {
      type: Object,
      default: () => {
      }
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
    handleResultChange(value) {
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    async appInitForm() {
      const params = {
        id: this.$route.query.Id
      };
      const res = await selectById(params);
      const { data, success } = res;
      if (!success) {
        this.$message.error("未能查询到数据！");
      }
      if (data) {
        this.formData = data;
        if (this.formData.classification) {
          this.node.classification = this.formData.classification;
        }
        if (this.formData.name) {
          this.node.name = this.formData.name;
        }
        return;
      } else {
        this.formData = {};
      }
    },
    getJcxxByBaseId() {
      this.sgdwzj = {};
      this.jldwcj = {};
      this.dsfsyjc = {};
      this.sgdwzjShow = false;
      this.jldwcjShow = false;
      this.dsfsyjcShow = false;
      if (this.formData.id) {
        getByBaseId({ baseId: this.formData.id }).then((res) => {
          if (res.success) {
            this.sgdwzj = res.data.find(
              (item) => item.source.indexOf("2") > -1
            );
            if (this.sgdwzj && this.sgdwzj.testResult) {
              this.sgdwzjShow = true;
            }
            this.jldwcj = res.data.find(
              (item) => item.source.indexOf("3") > -1
            );
            if (this.jldwcj && this.jldwcj.testResult) {
              this.jldwcjShow = true;
            }
            this.dsfsyjc = res.data.find(
              (item) => item.source.indexOf("4") > -1
            );
            if (this.dsfsyjc && this.dsfsyjc.testResult) {
              this.dsfsyjcShow = true;
            }
          }
        });
      }
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
          this.$set(this.formData, "source", 1);
          let fields = { ...this.formData };
          if (this.type == "add") {
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
      if (this.type === "view") {
        sectionAllList({}).then((res) => {
          if (res.success) {
            this.sectionOptions = res.data;
          }
        });
        return;
      }
      sectionList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
          if (this.sectionOptions.length == 1) {
            this.formData.section = this.sectionOptions[0].id;
            this.showSection = true;
          }
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
      if (this.type === "view") {
        const res = await corporates(params);
        const { data, success } = res;
        if (!success) {
          this.belongUnit = [];
        } else {
          this.belongUnit = data;
        }
        return;
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
          // 从源数据中过滤出重复的单位
          this.belongUnit = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          if (this.belongUnit.length == 1) {
            this.formData.constructionUnit = this.belongUnit[0].corpId;
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
            this.getJcxxByBaseId();
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

/deep/ .el-divider--horizontal {
  margin: 9px 0;
}
</style>

<template>
  <div class="page-leave">
    <!-- <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row> -->
    <DefaultTitle title="基本信息" />
    <el-row :gutter="20">
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="变更编号" prop="changeCode">
              <div v-show="false">{{ changeCode }}</div>
              <div :class="{ readonly: readonly }">
                <div class="flex">
                  <el-input
                    v-model="code1"
                    :disabled="readonly"
                    @input="handleInput($event, 'code1')"
                  />
                  <div class="ml-16 mr-8">【</div>
                  <el-input
                    v-model="code2"
                    :disabled="readonly"
                    style="width: 200px"
                    @input="handleInput($event, 'code2')"
                  />
                  <div class="ml-8 mr-16">】</div>

                  <el-input
                    v-model="code3"
                    style="width: 300px"
                    :disabled="readonly"
                    @input="handleInput($event, 'code3')"
                  />
                  <div class="ml-16">号</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更工程名称" prop="changeName">
              <div :class="{ readonly: readonly }">
                <el-input
                  v-model="formData.changeName"
                  placeholder="请输入"
                  :disabled="readonly"
                  maxlength="100"
                  show-word-limit
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段" prop="sectionId">
              <el-select
                v-model="formData.sectionId"
                :disabled="readonly"
                class="w-100pre"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in sectionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更金额" prop="level">
              <div :class="{ readonly: readonly }">
                <el-select
                  v-model="formData.level"
                  clearable
                  :disabled="readonly"
                  filterable
                  placeholder="请选择"
                  style="width: 100%"
                  @visible-change="$visibleChange($event, 'el-popper')"
                >
                  <el-option
                    v-for="item in levelOptions"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设计成果编号" prop="drawingCode">
              <div
                class="choose-file-wrapper"
                :class="{ readonly: readonly }"
                @click="handleChooseFile"
              >
                <el-input
                  v-model="formData.drawingCode"
                  :readonly="true"
                  :disabled="readonly"
                  placeholder="请选择"
                >
                  <template slot="append">
                    <div
                      class="append-trigger"
                      @click.stop="changeComponents('chooseFile')"
                    >
                      <i class="el-icon-arrow-right" />
                    </div>
                  </template>
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设计成果名称" prop="drawingName">
              <el-input
                v-model="formData.drawingName"
                disabled
                placeholder=""
                width="100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更部位或桩号" prop="pbsCode">
              <el-input
                v-model="formData.pbsCode"
                placeholder="请输入"
                :disabled="readonly"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="变更理由、变更内容及变更工期估计"
              prop="changes"
            >
              <el-input
                v-model="formData.changes"
                type="textarea"
                :disabled="readonly"
                show-word-limit
                maxlength="1000"
                :autosize="{
                  minRows: 3,
                  maxRows: 6,
                }"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('isVicePresident')" :span="12">
            <el-form-item label="是否需要业务副总会签" prop="isVicePresident">
              <el-switch
                v-model="formData.isVicePresident"
                :disabled="flowDisabled('isVicePresident')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('vicePresident')" :span="12">
            <el-form-item label="业务副总" prop="vicePresident">
              <user
                v-model="formData.vicePresident"
                :multiple="true"
                :readonly="flowDisabled('vicePresident')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('departmentHead')" :span="12">
            <el-form-item label="相关处室会签" prop="departmentHead">
              <user
                v-model="formData.departmentHead"
                :multiple="true"
                :readonly="flowDisabled('departmentHead')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="uploadFile">
              <uploadFile
                v-model="formData.uploadFile"
                :readonly="readonly"
                :limit="3"
                :max-size="500"
                accept=".pdf,.docx,.doc"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div>
      <uploadFileTable
        v-model="formData.designSupplyFileList"
        :readonly="readonly"
        :max-size="500"
        table-name="图纸文件列表"
      />
    </div>

    <el-dialog
      v-draggable
      width="80%"
      title="关联通知选择"
      :visible.sync="dialogReceiveVisible"
    >
      <designReceive ref="receiveComponents" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="receiveSure">确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-draggable
      width="90%"
      :visible.sync="dialogFormVisible"
      title="关联文件选择"
    >
      <components :is="component" ref="components" :multiple="multiple" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save, getSection } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
// import UserSelect from "@/components/newUserSelect/index.vue";
import DepSelect from "@/components/DepSelect/index.vue";
// import bimShow from "@/components/Bim/Select/index.vue";
import originalDrawing from "./components/index.vue";
import chooseFile from "@/views/design/DesignDisclosure/components/chooseFile.vue";
import designReceive from "@/components/designReceive/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import lod from "lodash";
import {
  // getNtkoInstalled,
  // getNtkoExe,
  // ntkoClosed,
  // ntkoFormPreview,
  // ntkoFormSavePDF,
  getNtkoSignConfig,
  // ntkoFilePreview,
  getMinioUrl,
} from "@/utils/ntko";
import { updateFile } from "../../office/fundAllocation/api";
// import associatedDrawing from "@/views/design/availabilityofResults/components/associatedDrawing.vue";

export default {
  name: "Dataform",
  components: {
    // associatedDrawing,
    // UserSelect,
    DepSelect,
    // bimShow,
    originalDrawing,
    chooseFile,
    designReceive,
  },
  mixins: [FlowFormMixin],
  data() {
    return {
      multiple: true,
      dialogFormVisible: false,
      component: "chooseFile",
      sectionList: [],
      uploadApi: "/api/file/upload",
      imgsrc: "",
      canDeleteRow: false,
      sonQuery: {
        month: "",
      },
      dialogPlanVisible: false,
      dialogReceiveVisible: false,
      actualDate: true,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
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
        total: 0,
      },
      showDialog: false,
      uploadFileList: [],
      formData: {
        drawingCode: "",
        drawingName: "",
        id: "",
        isChange: "1",
        planId: "",
        actualDate: "",
        remark: "",
        designSupplyFileList: [],
        uploadFile: "", //附件上传
      },
      formDataRules: {
        changeCode: [
          {
            required: true,
            validator: this.customValidator,
          },
        ],
        changeName: [
          { required: true, message: "请输入变更工程名称", trigger: "blur" },
        ],
        sectionId: [{ required: true, message: "请选择", trigger: "change" }],
        contractId: [{ required: true, message: "请选择", trigger: "change" }],
        changeDrawingCode: [
          { required: true, message: "请输入变更图纸编号", trigger: "blur" },
        ],
        level: [{ required: true, message: "请选择", trigger: "change" }],
        baseId: [{ required: true, message: "请选择", trigger: "change" }],
        code: [{ required: true, message: "请选择", trigger: "change" }],
        changes: [{ required: true, message: "请输入", trigger: "change" }],
        changeEstimatedCost: [
          { required: true, message: "请输入变更估算成本", trigger: "blur" },
        ],
        changeDate: [{ required: true, message: "请输入", trigger: "blur" }],

        changeReason: [{ required: true, message: "请输入", trigger: "blur" }],
        freeFlowUsers: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        isVicePresident: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        vicePresident: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        departmentHead: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        actualDate: [
          {
            required: true,
            message: "请选择日期",
          },
        ],
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
        list: "/api/design/change/page",
        // list: "/api/design/plan/list",
      },
      levelOptions: [
        {
          dictId: "0",
          dictName: "<100万",
        },
        {
          dictId: "1",
          dictName: "≥100万，＜500万",
        },
        {
          dictId: "2",
          dictName: "＞=500万",
        },
        {
          dictId: "3",
          dictName: "无变化",
        },
      ],
      htxxOptions: [],
      code1: "",
      code2: "",
      code3: "",
      cmd: 0,
      ntkoClose: false, //签章组件关闭状态
      //签章坐标
      signPosition: {},
      //坐标坐标拷贝
      signPositionMsg: {},
      signMarkBooksMap: null,
      wordUrl: "",
      ntkoFile: {},
      compKey: new Date().getTime(),
      freeFlowInputShow: false,
      freeFlowUsers: "",
      isSigned: false,
    };
  },
  computed: {
    // 审批字段的禁用
    flowDisabled() {
      return (field) => {
        let disabled = true;
        switch (field) {
          case "isVicePresident":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName == "相关处室会签" ||
              this.formData.matterTaskTodo?.procTaskName == "综合处负责人" ||
              this.formData.matterTaskTodo?.procTaskName == "业务副总";
            break;
          case "vicePresident":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName == "相关处室会签" ||
              this.formData.matterTaskTodo?.procTaskName == "综合处负责人" ||
              this.formData.matterTaskTodo?.procTaskName == "业务副总";
            break;
          case "departmentHead":
            disabled =
              this.flowInfo?.page != "todo" ||
              this.formData.matterTaskTodo?.procTaskName == "相关处室会签" ||
              this.formData.matterTaskTodo?.procTaskName == "综合处负责人";
            break;
        }
        return Boolean(disabled);
      };
    },
    // 审批字段的显示
    flowShow() {
      return (field) => {
        let show = true;
        switch (field) {
          case "isVicePresident":
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.id &&
                this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != "综合处负责人");
            break;
          case "vicePresident":
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.matterTaskTodo?.procTaskName &&
                this.formData.isVicePresident &&
                this.formData.matterTaskTodo?.procTaskName != "综合处负责人");
            break;
          case "departmentHead":
            show =
              this.formData.flowStatus == 2 ||
              this.formData.matterTaskTodo?.procTaskName == "相关处室会签" ||
              this.formData.matterTaskTodo?.procTaskName == "业务副总" ||
              (this.formData.matterTaskTodo?.procTaskName &&
                !this.formData.isVicePresident &&
                this.formData.matterTaskTodo?.procTaskName != "综合处负责人");
            break;
        }
        return Boolean(show);
      };
    },
    // cumDrawingCode() {
    //   // 直接返回 formData.drawingCode
    //   return this.formData.drawingCode || "";
    // },
    changeCode() {
      return `${this.code1}|${this.code2}|${this.code3}`;
    },
    showSign() {
      if (this.flowAuths?.stamp?.read && !this.isSigned) {
        return true;
      } else {
        return false;
      }
    },
    ntkoFileJson() {
      let json = this.formData.ntkoFilePath
        ? JSON.parse(this.formData.ntkoFilePath)
        : {};
      console.log(json);
      return this.formData.ntkoFilePath
        ? JSON.parse(this.formData.ntkoFilePath)
        : {};
    },
  },

  watch: {
    // 监听 code1, code2, code3 变化，更新 changeCode
    code1() {
      this.formData.changeCode = this.changeCode;
    },
    code2() {
      this.formData.changeCode = this.changeCode;
    },
    code3() {
      this.formData.changeCode = this.changeCode;
    },
  },

  async created() {
    this.getSection();
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getFlowPROFESSION();
    // 获取数据
    this.htxxOptions = [];
    this.getDictItems("htxx").then((datas) => {
      console.log(datas);
      this.htxxOptions = datas;
    });
    //接收控件页面的值，点击 保存到服务器 执行
    window["OnSaveSuccess_" + this.compKey] = this.OnDataParentText;
    window["OnSaveWordSuccess_" + this.compKey] = this.OnWordDataParentText;
    window["h5SginCallBack_" + this.compKey] = this.h5SginCallBack;
    this.signMarkBooksMap = getNtkoSignConfig();

    // 来自app
    this.$nextTick(() => {
      // appUrlList 只要是app 就一定会传递这个参数
      if (this.fromapp) {
        //this.appformDisabled = true;
        // const titleElement = document.getElementById("dynamicTitle");
        // // 设置动态标题
        // titleElement.textContent = "详情";
        if (this.$route.query.businessId) {
          console.log("fromapp", this.fromapp, this.$route.query);
          this.readonly = true;
        }
      }
    });
  },
  mounted() {
    this.formData.actualDate = this.$dateFormat();
    window.ntkoCloseEvent = () => {
      //发送时才触发
      if (this.cmd == 2) {
        this.ntkoClose = true;
      }
    };
    let parentHref = window.parent.location.href;
    // 创建URLSearchParams对象，传入url参数
    const urlParams = new URLSearchParams(parentHref);
    const baseId = urlParams.get("baseId");
    const drawingName = urlParams.get("drawingName");
    const drawingCode = urlParams.get("drawingCode");
    if (baseId) {
      this.$set(this.formData, "baseId", baseId);
      this.$set(this.formData, "drawingName", drawingName);
      this.$set(this.formData, "drawingCode", drawingCode);
    }
  },
  methods: {
    sure() {
      // 单选是对象  多选就是得数组 所以 需要根据 multiple 来单独处理
      if (this.multiple) {
        this.multipleSure();
      } else {
        this.singleSure();
      }
    },
    // 多选
    async multipleSure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("选中", currentRow);
      if (currentRow && Array.isArray(currentRow) && currentRow.length > 0) {
        // 直接将选中的数据拼接成字符串
        this.formData.drawingCode = currentRow
          .map((item) => item.code)
          .join(",");
        this.formData.drawingName = currentRow
          .map((item) => item.name)
          .join(",");
      } else {
        this.formData.drawingCode = "";
        this.formData.drawingName = "";
      }
      this.dialogFormVisible = false;
    },
    // 单选
    async singleSure() {
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
      this.component = component;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.components.init();
      });
    },
    handleChooseFile() {
      if (this.readonly) return;
      this.changeComponents("chooseFile");
    },
    async getSection() {
      // 获取标段
      const { data } = await getSection({});
      this.sectionList = data;
    },
    // confirm 关联图纸回调  单选
    confirm(row) {
      let data = { ...row };
      console.log("关联图纸回调", data);
      this.$nextTick(() => {
        this.$set(this.formData, "baseId", data.id);
        this.$set(this.formData, "drawingName", data.name);
        this.$set(this.formData, "drawingCode", data.code);
        this.$set(this.formData, "pageType", data.pageType);
        this.$forceUpdate();
      });
    },

    previewFile(row) {
      this.$previewFileById(row);
    },
    async receiveSure() {
      let currentRow = this.$refs.receiveComponents.currentRow;
      console.log("关闭选择", currentRow);
      this.formData.noticeId = currentRow.id;
      this.formData.noticeCode = this.getCode(currentRow.code);
      this.$nextTick(() => {
        this.dialogReceiveVisible = false;
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
    chooseReceiveComponent() {
      if (this.readonly) return;
      this.dialogReceiveVisible = true;
      this.$nextTick(() => {
        this.$refs.receiveComponents.default();
      });
    },

    changeStatus(value) {
      // 0 变更 1 否
      if (value == 0) {
        this.orignDisabled = true;
        // this.$set(this.formDataRules.actualDate[0], "required", true);
      } else {
        this.formData.id = "";
        this.orignDisabled = false;
        this.formData.code = "";
        this.formData.name = "";
        // this.$set(this.formDataRules.actualDate[0], "required", false);
      }
    },

    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.DitSpeciality = data;
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        console.log("获取表单数据", row);

        if (row) {
          if (row.changeCode) {
            let code = row.changeCode.split("|");
            this.code1 = code[0];
            this.code2 = code[1];
            this.code3 = code[2];
          }
          const currentUser = this.$getStorage("userInfo").userId;

          this.canDeleteRow = row.createUser !== currentUser;
          console.log("row", row);

          row.actualDate = this.timeFormat(row.actualDate, "YYYY-MM-DD");

          if (!row.designSupplyFileList) {
            row.designSupplyFileList = [];
          }

          this.formData = row;
          this.tableData = row;
          this.formData.isVicePresident = this.formData.isVicePresident == 1;

          this.orignDisabled = row.isChange === 0 ? true : false;
          if (row.flowStatus == 1 || row.flowStatus == 2) {
            this.freeFlowInputShow = false;
          } else {
            this.freeFlowInputShow = true;
          }
          if (this.formData.filePath) {
            this.signPosition = this.formData.filePath
              ? JSON.parse(this.formData.filePath)[0]?.signPosition
              : null;
            this.signPositionMsg = lod.cloneDeep(
              JSON.parse(this.formData.filePath)[0].signPosition
            );
          }
        } else {
          this.$nextTick(() => {
            this.freeFlowInputShow = true;
          });
        }
      } catch (error) {
        console.error("Error in getFlowRow:", error);
      }
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback, event) {
      // console.log("save fields", fields);
      // if (
      //   !this.formData.filePath &&
      //   (this.formData.level == 1 || this.formData.level == 2)
      // ) {
      //   this.$message.warning("请先生成变更审批表");
      //   return;
      // }
      fields.isVicePresident = fields.isVicePresident ? 1 : 2;
      if (
        this.flowAuths?.stamp?.read &&
        this.flowAuths?.stamp?.required &&
        !this.isSigned &&
        this.postMessageData.btnKey !== "return" &&
        this.postMessageData.optKey !== "disagree"
      ) {
        this.$message.warning("请先完成签章");
        return;
      }
      const isMaintenance = event.data.btnKey === "maintenance";
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: "maintenance",
          },
          event.origin
        );
        return;
      }
      //做业务数据的保存,修改。
      save(fields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            //新增失败,如果是编号重复则先删除版式文件
            this.ntkoClose = false;
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
    handleInput(value, codeType) {
      let code = "";
      // 使用正则  替换掉| 为空
      if (value) {
        code = value.replace(/\|/g, "");
      }
      this[codeType] = code;
    },
    customValidator(rule, value, callback) {
      if (this.code1 && this.code2 && this.code3) {
        callback(); // 验证通过
      } else {
        callback(new Error("请输入")); // 验证失败，返回错误消息
      }
    },
    getCode(code) {
      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\|/, "-【");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\|/, "】-");

      return outputString;
    },
    //预览
    async preview(cmd) {
      this.cmd = cmd;
      if (!this.beforeSubmit(this.dataFormRef)) return;
      //判断插件是否安装
      // var ntkoed = getNtkoInstalled();
      //组装数据

      let formData = {
        changeCode: this.code1 + "【" + this.code2 + "】" + this.code3,
        changeDate: "",
        changeEstimatedCost: "",
        changeLevel: this.levelOptions.find(
          (item) => item.dictId === this.formData.level
        ).dictName,
        changeName: this.formData.changeName,
        changeReason: this.formData.changeReason,
        changes: this.formData.changes,
        contractCode: "",
        contractName: "",
        noticeCode: "",
        pbsCode: this.formData.pbsCode ? this.formData.pbsCode : "",
      };
      //获取合同
      if (this.formData.contractId) {
        let contract = this.htxxOptions.find(
          (item) => item.dictId === this.formData.contractId
        );
        formData.contractCode = contract.dictCode;
        formData.contractName = contract.dictName;
      }
      //获取修改通知单
      if (this.formData.baseId) {
        formData.noticeCode = this.formData.drawingCode;
      } else {
        formData.noticeCode = "";
      }
      // var ntkourl = window.location.host;
      // var ntkoprotocol = window.location.protocol;
      // var ntkoConfig = {
      //   ToolBars: true, //可以编辑 ntko
      //   compKey: this.compKey,
      // };
      console.log("模板打印内容", formData);
      // if (ntkoed) {
      //   ntkoClosed(cmd);
      //   //填充数据并预览
      //   if (cmd == 1) {
      //     if (this.formData.level === "2") {
      //       formData.fileName =
      //         "雄安调蓄较大设计变更审批表_" +
      //         formData.changeCode +
      //         ".doc";
      //       ntkoFormPreview(
      //         formData,
      //         "designChangeTemplateUp.docx",
      //         ntkoConfig
      //       );
      //     } else {
      //       formData.fileName =
      //         "雄安调蓄设计变更审批表_" +
      //         formData.changeCode +
      //         ".doc";
      //       ntkoFormPreview(
      //         formData,
      //         "designChangeTemplateDown.docx",
      //         ntkoConfig
      //       );
      //     }
      //   } else if (cmd == 3) {
      //     console.log("JSON.parse(this.formData.ntkoFilePath)");
      //     let jsonData = JSON.parse(this.formData.ntkoFilePath);
      //     if (jsonData) {
      //       console.log("jsonData", jsonData);
      //       jsonData.url = jsonData.requestRelativeUrl;
      //       jsonData.name = jsonData.fileName;
      //       jsonData.fileId = jsonData.fileId;
      //     }
      //     ntkoFilePreview(jsonData, ntkoConfig);
      //   } else if (cmd == 2) {
      //     //提交表单前调用 自动转pfd并保存到服务器
      //     if (this.formData.level === "2") {
      //       //提交表单前调用 自动转pfd并保存到服务器
      //       formData.fileName =
      //         "雄安调蓄较大设计变更审批表_" +
      //         formData.changeCode +
      //         ".pdf";
      //       ntkoFormSavePDF(formData, "designChangeTemplateUp.docx");
      //     } else {
      //       formData.fileName =
      //         "雄安调蓄设计变更审批表_" +
      //         formData.changeCode +
      //         ".pdf";
      //       ntkoFormSavePDF(formData, "designChangeTemplateDown.docx");
      //     }
      //     const sleep = (milliseconds) => {
      //       return new Promise((resolve) => setTimeout(resolve, milliseconds));
      //     };
      //     while (!this.ntkoClose) {
      //       await sleep(1000);
      //       console.info("ntko处理中");
      //     }
      //     console.info("path: " + this.formData.filePath);
      //     console.info("ntko end");
      //   } else {
      //     ntkoBrowser.openWindow(
      //       ntkoprotocol +
      //         "//" +
      //         ntkourl +
      //         "/ntko/officeTemplate/client.html?cmd=" +
      //         cmd,
      //       false
      //     );
      //   }
      // } else {
      //   getNtkoExe();
      // }
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSubmitButton(eventData) {
      console.log("🚀 ~ beforeSubmitButton ~ eventData:", eventData);
      // let btnKey = eventData?.btnKey
      // if (btnKey === 'submit') return
      let extData = {};

      extData["isVicePresident"] = {
        type: "number",
        value: this.formData.isVicePresident ? 1 : 2,
      };
      extData["departmentHead"] = {
        type: "user",
        value: this.formData.departmentHead,
      };
      extData["vicePresident"] = {
        type: "user",
        value: this.formData.vicePresident,
      };
      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
      // if (typeof this.preview === "function") {
      //   //发送前做模板的保存
      //   await this.preview(2);
      // } else {
      //   console.info("preview方法不存在");
      // }
    },
    changeFile(fileData) {
      this.$nextTick(function () {
        //签章完成后修改文件信息
        const params = new URLSearchParams(); // 创建对象
        let fData = JSON.parse(fileData)[0];
        // fData.url = fData.url.substr(0, fData.url.indexOf("?"));
        fData.signPosition = this.signPositionMsg;
        let fDataArrStr = "[" + JSON.stringify(fData) + "]";
        params.append("id", this.formData.id);
        params.append("fileData", fDataArrStr);
        updateFile(params).then((res) => {
          if (res.success) {
            this.formData.filePath = fDataArrStr;
          }
        });
        this.isSigned = true;
      });
    },
    OnWordDataParentText(varData, signPositionData) {
      let data = JSON.parse(varData);
      data.requestRelativeUrl = getMinioUrl(data.requestRelativeUrl);
      this.$set(this.formData, "ntkoFilePath", JSON.stringify(data));
    },
    /**
     * 电子签章文件，保存成功后
     */
    OnDataParentText(varData, signPositionData) {
      if (!varData || varData === "null") {
        this.$message.error("上传版式文件失败!");
        return;
      }
      console.log("OnDataParentText", varData);
      console.log("signPositionData", signPositionData);
      typeof varData === "string" && (varData = JSON.parse(varData));
      let name = varData.fileName;
      if (name.indexOf("\\") >= 0) {
        name = name.substring(name.lastIndexOf("\\") + 1);
      }
      let file = [
        {
          blobType: "application/pdf",
          fileId: varData.fileId,
          name: name,
          fileSize: varData.fileSize,
          url: varData.requestRelativeUrl,
          signPosition: JSON.parse(signPositionData), //签章的坐标信息
        },
      ];
      //上传pdf的返回值
      this.$set(this.formData, "filePath", JSON.stringify(file));
    },
    formatValue(val) {
      let checkPlan = "" + val;
      checkPlan = checkPlan
        .replace(/[^\d.-]/g, "") // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
        .replace(/^\./g, "") // 保证第一个为数字而不是.
        .replace("-", "$#$")
        .replace(".", "$@$")
        .replace(/\./g, "")
        .replace("$#$", "-")
        .replace("$@$", ".");
      if (checkPlan.indexOf("-") == 0) {
        checkPlan = "-" + checkPlan.substr(1); // 处理负数的整数和小数部分
      } else if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        checkPlan = parseFloat(checkPlan) + "";
      } else if (checkPlan.indexOf(".") >= 0) {
        //checkPlan = checkPlan.replace(/^()*(\d+)\.(\d{6}).*$/, "$1$2.$3"); // 只能输入两个小数
      }
      return checkPlan;
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

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

.append-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 12px;
}

.append-trigger i {
  pointer-events: none;
}

.line {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0 10px 0;
}

.mr-10 {
  margin-right: 10px;
}

/deep/ .custom-append {
  .el-input-group__append {
    color: #333;
    border: 1px solid #dcdfe6;
    cursor: default;
  }
}

/deep/ .current-row td {
  .el-link--inner {
    color: #fff;
  }
}

.readonly {
  ::v-deep .el-input-group__append {
    color: grey;
    border-color: #e4e7ed;
  }
}
</style>

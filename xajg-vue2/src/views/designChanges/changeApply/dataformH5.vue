<template>
  <div class="page-leave apph5-parent">
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
      label-width="60px"
      :disabled="readonly"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="变更编号" prop="changeCode">
            <div v-show="false">{{ changeCode }}</div>
            <div :class="{ readonly: readonly }">
              <div class="flex">
                <el-input
                  v-model="code1"
                  @input="handleInput($event, 'code1')"
                />
                <div class="ml-16 mr-8">【</div>
                <el-input
                  v-model="code2"
                  @input="handleInput($event, 'code2')"
                />
                <div class="ml-8 mr-16">】</div>

                <el-input
                  v-model="code3"
                  @input="handleInput($event, 'code3')"
                />
                <div class="ml-16">号</div>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="变更工程名称" prop="changeName">
            <div :class="{ readonly: readonly }">
              <el-input
                placeholder="请输入"
                maxlength="50"
                show-word-limit
                v-model="formData.changeName"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关联合同" prop="contractId">
            <div :class="{ readonly: readonly }">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                v-model="formData.contractId"
                clearable
                filterable
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in htxxOptions"
                  :key="item.dictId"
                  :label="item.dictName + '（' + item.dictCode + '）'"
                  :value="item.dictId"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="变更等级" prop="level">
            <div :class="{ readonly: readonly }">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                v-model="formData.level"
                clearable
                filterable
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in levelOptions"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictId"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="修改通知单编号或设计图纸图号" prop="baseId">
            <associatedDrawing
              :title="'关联图纸选择'"
              :pageType="formData.pageType === '2' ? '32' : '31'"
              :multiple="true"
              :formDisabled="readonly"
              :ids="formData.baseId"
              :names="formData.drawingName"
              :codes="formData.drawingCode"
              @confirm="confirm"
            ></associatedDrawing>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="变更部位或桩号" prop="pbsCode">
            <el-input
              placeholder="请输入"
              maxlength="50"
              show-word-limit
              v-model="formData.pbsCode"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item
            label="变更理由、变更内容及变更工期估计"
            size="mini"
            prop="changes"
          >
            <el-input
              v-model="formData.changes"
              type="textarea"
              show-word-limit
              maxlength="1000"
              :autosize="{ minRows: 3, maxRows: 6 }"
              placeholder="请输入"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="formData.filePath">
          <el-form-item label="变更审批表" prop="filePath">
            <uploadFile
              v-model="formData.filePath"
              :readonly="readonly"
              :limit="1"
              :maxSize="50"
              :showNtko="showSign"
              :isSingnForTable="false"
              :showDate="showSign"
              @changeNtkoFile="changeFile"
            ></uploadFile>
            <el-button
              icon="el-icon-edit-outline"
              @click="preview(3)"
              size="mini"
            >
              在线编辑
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!formData.filePath">
          <el-form-item label="变更审批表">
            <el-button @click="preview(1)" size="mini">生成</el-button>
            <!--              <div >-->
            <!--                {{ntkoFileJson.fileName}}-->
            <!--                <el-button-->
            <!--                  class="custom-btn"-->
            <!--                  type="text"-->
            <!--                  @click="preview(3)"-->
            <!--                >编辑</el-button>-->
            <!--              </div>-->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" size="mini" prop="uploadFile">
            <uploadFile
              :readonly="readonly"
              v-model="formData.uploadFile"
              :limit="3"
              :maxSize="500"
              accept=".pdf,.docx,.doc"
            ></uploadFile>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="freeFlowInputShow">
          <el-form-item label="项目组负责人" prop="freeFlowUsers">
            <user v-model="formData.freeFlowUsers" :readonly="readonly"></user>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <uploadFileTable
        :readonly="readonly"
        v-model="formData.designSupplyFileList"
        :maxSize="500"
      >
        <template slot="title">
          <div class="flex align-end">
            <div class="font-w-600">图纸文件列表</div>
            <div class="font-12 ml-20">请上传500M以内的文件</div>
          </div>
        </template>
      </uploadFileTable>
    </div>

    <el-dialog
      v-draggable
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
          >确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-draggable
      width="80%"
      title="关联通知选择"
      :visible.sync="dialogReceiveVisible"
    >
      <designReceive ref="receiveComponents"></designReceive>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="receiveSure"
          >确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import UserSelect from "@/components/newUserSelect/index.vue";
import DepSelect from "@/components/DepSelect/index.vue";
import bimShow from "@/components/Bim/Select/index.vue";
import originalDrawing from "./components/index.vue";
import designReceive from "@/components/designReceive/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import {
  getNtkoInstalled,
  getNtkoExe,
  ntkoClosed,
  ntkoFormPreview,
  ntkoFormSavePDF,
  getNtkoSignConfig,
  ntkoFilePreview,
  getMinioUrl,
} from "@/utils/ntko";
import { updateFile } from "../../office/fundAllocation/api";
import associatedDrawing from "@/views/design/availabilityofResults/components/associatedDrawing.vue";

export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    associatedDrawing,
    UserSelect,
    DepSelect,
    bimShow,
    originalDrawing,
    designReceive,
  },
  data() {
    return {
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
          dictId: "1",
          dictName: "≥100万，＜500万",
        },
        {
          dictId: "2",
          dictName: "＞=500万",
        },
      ],
      htxxOptions: [],
      code1: "SB",
      code2: dateFormat(new Date().getTime(), "yyyy"),
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
    changeCode() {
      this.formData.changeCode = `${this.code1}|${this.code2}|${this.code3}`;
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

  async created() {
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
    async sure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("关闭选择", currentRow);
      this.formData.profession = currentRow.profession;
      this.formData.code = currentRow.code;
      this.formData.drawingName = currentRow.name;
      if (currentRow?.pbsCode) {
        this.formData.pbsCode = currentRow.pbsCode;
        this.formData.pbsName = currentRow.pbsName;
      } else {
        this.formData.pbsCode = "";
        this.formData.pbsName = "";
      }
      this.formData.baseId = currentRow.id;
      this.$nextTick(() => {
        this.dialogPlanVisible = false;
      });
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
      if (
        !this.formData.filePath &&
        (this.formData.level == 1 || this.formData.level == 2)
      ) {
        this.$message.warning("请先生成变更审批表");
        return;
      }

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
          const { success, message, data } = res;
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
        } else {
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
      var ntkoed = getNtkoInstalled();
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
      var ntkourl = window.location.host;
      var ntkoprotocol = window.location.protocol;
      var ntkoConfig = {
        ToolBars: true, //可以编辑 ntko
        compKey: this.compKey,
      };
      console.log("模板打印内容", formData);
      // if (ntkoed) {
      //   ntkoClosed(cmd);
      //   //填充数据并预览
      //   if (cmd == 1) {
      //     if (this.formData.level === "2") {
      //       formData.fileName =
      //         "雄安水电站较大设计变更审批表_" +
      //         formData.changeCode +
      //         ".doc";
      //       ntkoFormPreview(
      //         formData,
      //         "designChangeTemplateUp.docx",
      //         ntkoConfig
      //       );
      //     } else {
      //       formData.fileName =
      //         "雄安水电站设计变更审批表_" +
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
      //         "雄安水电站较大设计变更审批表_" +
      //         formData.changeCode +
      //         ".pdf";
      //       ntkoFormSavePDF(formData, "designChangeTemplateUp.docx");
      //     } else {
      //       formData.fileName =
      //         "雄安水电站设计变更审批表_" +
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
    async beforeSend() {
      let resut = parseFloat(Math.abs(this.formData.changeEstimatedCost));
      // 根据变更等级控制流程走向
      if (this.formData.level === "0") {
        resut = 50;
      } else if (this.formData.level === "1") {
        resut = 150;
      } else {
        resut = 550;
      }
      this.sendFlowJson = {
        bgsqje: {
          type: "numerical",
          value: resut,
        },
        spr: {
          type: "user",
          value: this.formData.freeFlowUsers,
        },
      };
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

::v-deep .el-tag{
  max-width: 170px;
  overflow: auto;
}
</style>

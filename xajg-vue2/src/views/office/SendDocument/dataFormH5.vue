<template>
  <div class="page-leave apph5-parent">
    <el-row>
      <el-col :span="6">
        <div class="h-35 line-35">基本信息</div>
      </el-col>
      <el-col :span="18">
        <div class="flex align-center">
          <div
            v-if="htmlToPdftemplate"
            class="ml-16 flex align-center h-35 rounded-4 px-10"
            style="border: 1px solid #0096ff"
          >
            <div class="pointer text-ellipsis">雄安调蓄处理笺</div>
            <div v-if="fromapp" class="flex align-center">
              <span class="ml-20 pointer" @click="priviewOrsavePdf('priview')">
                <i class="el-icon-view" />
              </span>
              <span class="ml-15 pointer" @click="priviewOrsavePdf('save')">
                <i class="el-icon-download" />
              </span>
            </div>
            <div v-else>
              <el-tooltip
                class="item"
                effect="dark"
                content="预览"
                placement="bottom"
              >
                <span
                  class="ml-20 pointer"
                  @click="priviewOrsavePdf('priview')"
                >
                  <i class="el-icon-view" />
                </span>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="下载"
                placement="bottom"
              >
                <span class="ml-15 pointer" @click="priviewOrsavePdf('save')">
                  <i class="el-icon-download" />
                </span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="24"><el-divider></el-divider></el-col>
    </el-row>
    <el-row :gutter="10">
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="80px"
        :disabled="isAppH5 || isWmReadonly"
        label-position="left"
      >
        <el-col :span="24">
          <el-form-item label="文件编号" prop="code" error="请输入">
            <div v-show="false">{{ code }}</div>
            <div class="flex align-center">
              <el-input
                :value="`${code1}【${code2}】${code3} 号`"
                maxlength="50"
                show-word-limit
                @input="handleInput($event, 'code1')"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="showTotalNum">
          <el-form-item label="总号">
            <el-input
              show-word-limit
              maxlength="10"
              v-model="formData.totalNum"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文种" prop="type">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.type"
            >
              <el-option
                v-for="item in wzCodeOptions"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="方向" prop="status">
            <el-select class="w-100pre" v-model="formData.orientation">
              <el-option
                v-for="item in fxCodeOptions"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="归档文件类型" prop="archiveTypeId">
            <el-cascader
              :show-all-levels="false"
              class="w-100pre"
              v-model="formData.archiveTypeId"
              placeholder="归档文件类型:可搜索"
              :options="archiveFileTypes"
              :props="{
                label: 'nodeName',
                value: 'id',
                expandTrigger: 'hover',
              }"
              filterable
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="showSubcontractingFileType">
          <el-form-item label="分包文件类型" prop="subcontractingFileType">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.subcontractingFileType"
            >
              <el-option
                v-for="item in fblxOptions"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="showSectionId">
          <el-form-item label="标段" size="mini" prop="sectionId">
            <el-select
              multiple
              filterable
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.sectionId"
              placeholder="请选择"
              clearable
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
        <!-- 只有监理单位  发文 才展示 -->
        <!-- // let unitType = 2 // 监理 设计 施工 业主  第三方 type 1 2 3 4 5 -->
        <el-col :span="24" v-if="showFileType">
          <el-form-item label="文件类型" prop="fileType">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.fileType"
            >
              <el-option
                v-for="item in fileTypeOptions"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6 }"
              v-model="formData.title"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>

        <!-- 新增时候展示 -->
        <!-- v-if="showSend" -->
        <el-col :span="24">
          <el-form-item label="主送" prop="sendUnits">
            <uniTableApp
              :tableTitle="'主送单位'"
              ref="sendUnits"
              @chooseChange="setSentUnit"
              @deleteChange="deleteSendUniTable"
              @userChange="userChange"
              :selectedUniIds="unitId"
              :deleteUniId="deleteCopyUnit"
              :disableTable="isWmReadonly"
              :selfUnit="formData.unit"
              :pageType="pageType.unitType"
              :showOpration="false"
            ></uniTableApp>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="抄送">
            <uniTableApp
              :tableTitle="'抄送单位'"
              ref="copySend"
              @chooseChange="setSentUnit"
              @deleteChange="deleteCopyUniTable"
              @userChange="userChange"
              :selectedUniIds="unitId"
              :deleteUniId="deleteSendUnit"
              :disableTable="isWmReadonly"
              :selfUnit="formData.unit"
              :pageType="pageType.unitType"
              :showOpration="false"
            ></uniTableApp>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-if="pageType.unitType == 1 && pageType.documentType == 2"
        >
          <el-form-item label="关联进度计划">
            <progress-select
              v-model="formData.progressId"
              :readonly="isWmReadonly"
              :office="true"
              type="id"
              :toprogressName="progressName"
            ></progress-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <div></div>
        </el-col>
        <el-col :span="24" v-if="showOnlineEdit">
          <el-form-item label="">
            <el-radio-group
              v-model="formData.onlineEdit"
              @change="changeOnlineEdit"
            >
              <el-radio :label="'0'">在线编辑公文正文并生成公文文件</el-radio>
              <el-radio :label="'1'">上传已编制好的公文文件</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <span>
          <!-- 文秘节点 -->
          <el-col v-if="wmNode || freeFlow" :span="24">
            <el-form-item label="公文文件" prop="uploadFileContent">
              <uploadFile
                v-if="formData.onlineEdit == 1"
                :fromApplication="appformDisabled ? 'app' : 'web'"
                :readonly="true || isWmReadonly"
                v-model="formData.uploadFileContent"
                :limit="1"
                :flowName="formData.flowName"
                @change="handleFileChange"
                :handSign="true"
                :showNtko="showSign"
                @changeNtkoFile="changeFile"
              >
              </uploadFile>
              <span v-else>
                <el-button
                  icon="el-icon-edit-outline"
                  @click="preview(1)"
                  size="mini"
                  :disabled="canOnlineEdit"
                >
                  <!-- 预览文件 -->
                  在线编辑
                </el-button>
                <uploadFile
                  class="hideent"
                  :fromApplication="appformDisabled ? 'app' : 'web'"
                  :readonly="true"
                  :showNtko="showSign"
                  :flowName="formData.flowName"
                  :handSign="true"
                  @changeNtkoFile="changeFile"
                  v-model="formData.uploadFileContent"
                  @ntkoHandleEdit="ntkoHandleEdit"
                  :showNtkoHandleEdit="showNtkoHandleEdit"
                >
                </uploadFile>
              </span>
            </el-form-item>
          </el-col>
          <span v-else>
            <el-col :span="24" v-if="formData.onlineEdit == 1">
              <!-- 流程创建 可以编辑 和 流程中以及流程完成不可编辑 uploadFileContent  上传文件-->
              <el-form-item label="公文文件" prop="uploadFileContent">
                <uploadFile
                  :fromApplication="appformDisabled ? 'app' : 'web'"
                  :readonly="true || isReadonly"
                  v-model="formData.uploadFileContent"
                  :limit="1"
                  :flowName="formData.flowName"
                  @change="handleFileChange"
                >
                </uploadFile>
              </el-form-item>
            </el-col>
            <!-- 在线编辑 -->
            <span v-else>
              <el-col :span="24">
                <el-form-item label="红头名称" prop="name">
                  <el-input
                    v-model="formData.name"
                    maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="公文正文" prop="content">
                  <el-form class="mt-10">
                    <el-form-item label="" prop="content">
                      <el-button
                        icon="el-icon-edit-outline"
                        @click="preview(1)"
                        size="mini"
                        :disabled="canOnlineEdit"
                      >
                        <!-- 预览文件 -->
                        在线编辑
                      </el-button>
                      <uploadFile
                        class="hideent"
                        :fromApplication="appformDisabled ? 'app' : 'web'"
                        :readonly="readonly"
                        v-model="formData.uploadFileContent"
                        :limit="1"
                      >
                      </uploadFile>
                    </el-form-item>
                  </el-form>
                </el-form-item>
              </el-col>
            </span>
          </span>
        </span>
        <el-col :span="24">
          <el-form-item label="附件">
            <uploadFile
              :fromApplication="appformDisabled ? 'app' : 'web'"
              :readonly="isWmReadonly"
              v-model="formData.uploadFile"
              :limit="1000"
              :showNtko="showReceiveDocumentSign"
              @changeNtkoFile="receivechangeFile"
              @addFile="addFile"
              @deleteFile="deleteFile"
              :customFun="customFun"
            >
            </uploadFile>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工程部位" prop="pbsCode">
            <pbsSelect
              v-model="formData.pbsCode"
              :readonly="isWmReadonly"
            ></pbsSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="showRelatedReceiving">
          <el-form-item label="关联收文" prop="type">
            <el-input disabled v-model="formData.relatedReceivingName" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="showPerson">
          <el-form-item label="本单位审批人" prop="freeFlowUsers">
            <user
              v-model="formData.freeFlowUsers"
              :readonly="appformDisabled || false"
              @change="handlerFreeUser"
              :unitId="myUnitId"
            ></user>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="拟稿人" prop="draftMan">
            <el-input disabled v-model="formData.draftMan" />
          </el-form-item>
        </el-col>
        <!-- 监理发文、施工发文页面所属单位修改为下拉选择 单位部门在前 -->
        <span v-if="uniTypeComputed">
          <el-col :span="24">
            <el-form-item label="发文单位" prop="unit">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                @change="changeUnit"
                class="w-100pre"
                v-model="formData.unit"
                placeholder="请选择"
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

          <el-col :span="24">
            <el-form-item label="拟稿部门" prop="department">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.department"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.departId"
                  :label="item.departName"
                  :value="item.departName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </span>
        <span v-else>
          <el-col :span="24">
            <el-form-item label="发文单位">
              <el-input disabled v-model="corpName" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="拟稿部门">
              <el-input disabled v-model="formData.department" />
            </el-form-item>
          </el-col>
        </span>
      </el-form>
    </el-row>
    <div class="" v-if="isShowSignTabel">
      <div class="mb-10 font-w-600 text-333">最近签收状态</div>
      <el-table
        ref="multipleTable"
        :data="formData.signStatusList"
        height="100%"
        border
      >
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column
          label="收文单位"
          prop="sendUnits"
          width="250"
          align="center"
        >
          <template slot-scope="{ row, $index }">
            <div :title="getTableUnitName(row, $index)">
              {{ getTableUnitName(row, $index) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="签收状态"
          prop="signStatus"
          align="center"
          width="100"
        >
          <template slot-scope="{ row }">
            <div :class="signStyle(row)">
              <span class="iconfont" :class="getCheckSignStatus(row)">
                <span class="font-12">{{ getSignStatus(row) }}</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="签收/拒签日期"
          prop="updateDate"
          header-align="center"
          width="180"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{
              row.signDate
                ? $dateFormat(row.signDate, "yyyy-MM-DD HH:mm:ss")
                : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="reason"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{
              row.signStatus == 2 || row.signStatus == 5 ? "" : row.reason
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <htmlToPdftemplate
      :ref="`htmlToPdftemplate_${random}`"
      :documentType="documentType"
      :fromPage="'SendDocument'"
      :htlewidth="'calc(100% - 30px)'"
    >
    </htmlToPdftemplate>
  </div>
</template>

<script>
import {
  save,
  unitList,
  getSecretary,
  getSecretarys,
  BelongTo,
  getSecretarynew,
  setSign,
  updateFile,
  managementPage,
  getFileById,
  getDepartmentsByUnit,
  userInfoList,
  archiveFile,
  sectionList,
  archiveFileAll,
  getOwnerSendById,
  getOwnerReceiveById,
} from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";

import DepSelect from "@/components/DepSelect/index.vue";
import bimShow from "@/components/Bim/Select/index.vue";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import ProgressSelect from "@/components/ProgressSelect/index.vue";
import RelatedReceivingDocuments from "./components/RelatedReceivingDocuments.vue";
import htmlToPdftemplate from "./components/htmlToPdftemplate.vue";
import {
  getNtkoInstalled,
  getNtkoVersion,
  getMinioUrl,
  getNtkoSignParams,
  getNtkoExe,
  ntkoClosed,
  ntkoFormPreview,
  ntkoFormSavePDF,
  ntkoFileSign,
  ntkoFilePreview,
} from "@/utils/ntko";

// pdf
import * as PdfJs from "pdfjs-dist/legacy/build/pdf.js";
import { getDocument } from "pdfjs-dist";
import uniTableApp from "@/components/UniTable/indexApp.vue";
PdfJs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

async function getPdf(src) {
  const loadingTask = getDocument({
    url: src,
    disableFontFace: true, //禁用文本抗锯齿 ,提高渲染性能
  });
  const pdf = await loadingTask.promise;
  return pdf;
}

export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    htmlToPdftemplate,
    DepSelect,
    bimShow,
    ProgressSelect,
    RelatedReceivingDocuments,
    uniTableApp,
  },
  props: {
    disabledDeep: {
      default: false,
      type: Boolean,
    },
    level: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      isAppH5: false,
      archiveFileTypes: [], //归档类型
      subcontractingFileTypesOption: [], //分包文件类型
      sectionOptions: [],
      ownDepartmentsByUnit: [],
      //业主的部门id列表
      ownDepartIds: [],
      random: "",
      //是否文秘节点，文秘节点可以编辑一些信息
      wmNode: false,
      pdf: null,
      progressName: "",
      sendUnitChooseNames: [], //选中的单位 名称
      copyUnitChooseNames: [], //选中的单位 名称
      unitId: [], // 收文人 对应的单位
      pageType: "",
      freeFlowInputShow: false,
      freeFlowUsers: "",
      freeFlowDialogShow: false,
      showSentUsers: false,
      realName: "",
      unitOptions: [],
      code1: "",
      code2: "",
      code3: "",
      content: "",
      mode: "default", // or 'simple'
      tableData: [],
      formData: {
        onlineEdit: "1",
        unit: "",
        department: "",
        relatedReceivingName: "",
      },
      shouldValidateField: true, // 标志位
      formDataRules: {
        code: [
          {
            required: true,
            validator: this.customValidator,
          },
        ],
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入" }],
        sendUnits: [
          {
            required: true,
            message: "请添加主送单位且不能与抄送单位重复",
            trigger: "change",
          },
        ],
        uploadFileContent: [{ required: true, message: "请上传文件/生成文件" }],
        sendUser: [
          {
            required: true,
            message: "请选择收文人",
          },
        ],
        freeFlowUsers: [{ required: true, message: "请选择", trigger: "blur" }],
        content: [
          { required: true, message: "请在线编辑正文", trigger: "blur" },
        ],
        unit: [{ required: true, message: "请选择", trigger: "change" }],
        department: [{ required: true, message: "请选择", trigger: "change" }],
        pbsCode: [{ required: true, message: "请选择", trigger: "change" }],
        fileType: [{ required: false, message: "请选择", trigger: "change" }],
        archiveTypeId: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        subcontractingFileType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        sectionId: [{ required: true, message: "请选择", trigger: "change" }],
      },
      readonly: false,
      designClassifyOptions: [],
      /**设计分类类型字典code */
      designClassifyCode: "DESIGN_CLASSIFY",
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      designProfessionOptions: [],
      wzCode: "wz",
      wzCodeOptions: [],
      fxCode: "fx",
      fxCodeOptions: [],
      fileTypeCode: "fwwjlx",
      fileTypeOptions: [],
      fblxCode: "fblx",
      fblxOptions: [],
      businessId: "",
      url: {
        list: "/api/synthesis/manage/list",
      },
      users: [],
      personnelShow: false,
      belongUnitSouce: [], //备份 源所属机构
      belongUnit: [], //过滤出重复的单位
      departmentList: [], //单位对应的部门
      sendUnitChooseIds: [], // 主送单位已选中的单位
      copyUnitChooseIds: [], // 抄送单位已选中的单位
      deleteSendUnit: "", //删除的主送单位
      deleteCopyUnit: "", //删除的抄送单位
      formDataDisabled: "",
      //执行标识
      cmd: 0,
      //签章坐标
      signPosition: {},
      //坐标坐标拷贝
      signPositionMsg: {},
      myUnitId: [],
      appformDisabled: false,
      compKey: new Date().getTime(),
      canOnlineEdit: false,

      //单位-角色用户Map
      corpRoleUserMap: null,
    };
  },

  created() {
    window["OnSaveSuccess_" + this.compKey] = this.OnDataParentText;
    window["OnSaveWordSuccess_" + this.compKey] = this.OnSaveWordSuccess;
    this.getUnitList(); //获取所有的单位
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getDictItemList(this.wzCode);
    this.getDictItemList(this.fxCode);
    this.getDictItemList(this.fileTypeCode);
    this.getDictItemList(this.fblxCode);
    this.getMyUnitId();
    this.getArchiveFile();
    this.getSectionList();
    //获取数据
    // 获取当前页面得配置信息 用于区分是哪个类型得单位
    console.log("this.$route", JSON.stringify(this.$route.query));
    const { documentType, unitType } = this.$route.query;
    console.log("documentType**************", documentType, unitType);
    this.pageType = {
      unitType,
      documentType,
    };
    window.sendContentHandle = this.sendContentHandle;
  },
  computed: {
    freeFlow() {
      console.log("this.flowAuths?.swzylc?.read", this.flowAuths?.swzylc?.read);
      return this.flowAuths?.swzylc?.read || false;
    },
    //是否显示标段控制，只要选择 分包管理类 下的目录，都需要选择相关标段，标段可多选;此处为：11-分包管理类 的id：
    showSectionId() {
      return this.formData?.archiveTypeId?.includes("1263993833922756608");
    },
    //是否显示分包文件类型控制，若选择“分包管理类"下的"分包审批及备案"，则需要进一步选择，分包类型，此处为：分包审批及备案 的id：
    showSubcontractingFileType() {
      return this.formData?.archiveTypeId?.includes("1263994681981665280");
    },
    showPerson() {
      return false;
      if (this.fromAppForm) {
        return false;
      } else {
        return this.freeFlowInputShow;
      }
    },

    /**是否只读：涉及文秘节点控制编辑的 */
    isWmReadonly() {
      //app进来
      if (this.fromapp) {
        //待办
        if (!this.fromAppForm) {
          return !this.wmNode || this.readonly || !this.getH5();
        } else {
          //表单
          return true;
        }
      } else {
        // 区分收文还是发文    如果是收文  页面完全是不能点击的
        if (this.pageType.documentType == 1) {
          return true;
        }
        if (this.isStartNode) {
          return false;
        } else {
          // return !this.wmNode || this.readonly;
          if (this.wmNode) {
            return false;
          } else {
            return this.readonly;
          }
        }
      }
    },
    /**是否只读：不涉及文秘节点控制编辑的 */
    isReadonly() {
      //app进来
      if (this.fromapp) {
        //待办
        if (!this.fromAppForm) {
          return this.readonly;
        } else {
          //表单
          return true;
        }
      } else {
        // 区分收文还是发文    如果是收文  页面完全是不能点击的
        if (this.pageType.documentType == 1) {
          return true;
        }
        return this.readonly;
      }
    },
    documentType() {
      // 区分发文还是收文
      if (this.pageType.documentType == 2) {
        return "SendDocument";
      } else {
        return "ReceiveDocument";
      }
    },
    // 文件类型
    showFileType() {
      // 这里还要兼容老数据 老数据就不做校验
      if (this.pageType.documentType == 2 && this.pageType.unitType == 1) {
        // 展示的时候就是必选

        // this.$set(this.formDataRules, "fileType", [
        //   { required: true, message: "请选择", trigger: "change" },
        // ]);
        return true;
      } else {
        // 去除必选
        // this.$set(this.formDataRules, "fileType", [
        //   { required: false, message: "请选择", trigger: "change" },
        // ]);
        return false;
      }
    },
    htmlToPdftemplate() {
      // 发文/收文  除了发起不展示 其他都展示
      if (this.pageType.documentType == 2) {
        // 判断是不是包好 formData.flowStatus字段
        if (this.formData.hasOwnProperty("createDate")) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    // 是不是可以编辑
    showNtkoHandleEdit() {
      if (this.pageType.documentType == 1) {
        return false;
      }

      if (
        this.appformDisabled ||
        this.formData.signed === 1 ||
        this.formData.flowInfo?.page == "fine" ||
        this.formData.onlineEdit == "1" ||
        this.pageType.documentType == 1
      ) {
        return false;
      } else {
        return true;
      }
    },
    isShowSignTabel() {
      // 针对app 只有 查看  所以 只要有数据就展示无数据不展示
      if (this.formData?.signStatusList?.length > 0) {
        return true;
      } else {
        return false;
      }
    },

    // 是否展示 签收 拒签按钮
    showSignButton() {
      if (this.fromapp) {
        return false;
      }
      //signStatus===2  || 收文 自己 流程状态有值并且不等于1、2
      // 1 是 1对1      2是 一对多

      // 只有收文单位会出现显示的情况   况且还是在发起阶段

      // let unitType = 2 // 监理 设计 施工 业主  第三方 type 1 2 3 4 5
      // let documentType = 2 //1收文2发文
      if (
        this.formData?.flowInfo?.page === "fine" ||
        this.pageType.documentType == 2 ||
        this.formData.flowStatus > 0
      ) {
        return false;
      }

      let isCreate =
        this.$getStorage("userInfo").userId === this.formData.createUser;
      if (isCreate) {
        return true;
      } else {
        return false;
      }
    },
    // 是否 展示在线编辑公文正文并生成公文文件
    showOnlineEdit() {
      let bool = false;
      if (this.formDisabled) {
        bool = false;
      } else {
        if (this.pageType.documentType == 2) {
          bool = true;
        } else {
          bool = false;
        }
      }
      return bool;
    },
    // 是否展示showSend
    showSend() {
      if (this.pageType.documentType == 2) {
        if (this.formData.flowStatus >= 1) {
          return false;
        }
        return true;
      } else {
        return false;
      }
    },
    // 是否签章
    // console.log("this.flowAuths", this.flowAuths);
    showSign() {
      if (this.flowAuths?.stamp?.read || this.freeFlow) {
        return true;
      } else {
        return false;
      }
    },

    // 发文是否签章
    showReceiveDocumentSign() {
      if (this.flowAuths?.stamp?.read) {
        return true;
      } else {
        return false;
      }
    },

    showRelatedReceiving() {
      // let unitType = 2 // 监理 设计 施工 业主  第三方 type 1 2 3 4 5
      // let documentType = 2 //1收文2发文
      if (this.pageType.documentType == 2) {
        return true;
      } else {
        if (this.formData?.relatedReceivingName) {
          return true;
        } else {
          return false;
        }
      }
    },

    corpName() {
      let name = "";
      if (this.formData.unit) {
        // 通过id 获取当前的名称
        let item = this.unitOptions.find((x) => x.corpId == this.formData.unit);
        if (item) {
          name = item.corpName;
        }
      } else {
        let { realName, corpName, corpId, departName } =
          this.$getStorage("userInfo");
        this.formData.department = departName;
        name = corpName;
        this.formData.unit = corpId;
      }
      return name;
    },
    // let unitType = 2 // 监理 设计 施工 业主  第三方 type 1 2 3 4 5
    // let documentType = 2 //1收文2发文
    uniTypeComputed() {
      // 监理发文、施工发文页面所属单位修改为下拉选择
      let bool = false;
      if (this.pageType.documentType == 2) {
        if (this.formDataDisabled) {
          bool = false;
        } else {
          if (this.pageType.unitType == 1 || this.pageType.unitType == 3) {
            bool = true;
          } else {
            bool = false;
          }
        }
      } else {
        bool = true;
      }
      return bool;
    },

    // 是否显示总号
    showTotalNum() {
      let show = false;
      // 发文界面只有设计单位可以显示
      if (this.pageType.documentType == 2) {
        if (this.pageType.unitType == 2 || this.pageType.unitType == 5) {
          show = true;
        } else {
          show = false;
        }
      } else {
        // 收文界面 如果有值就显示
        if (this.formData?.totalNum) {
          show = true;
        } else {
          show = false;
        }
      }
      return show;
    },

    formDisabled() {
      // 首先是 发文页面的取决于
      // let documentType = 2 //1收文2发文
      let disabled = false;
      if (this.pageType.documentType == "2") {
        // 发文
        disabled = this.readonly;
      } else {
        // 收文   收文就直击禁用
        disabled = true;
      }
      this.formDataDisabled = disabled;
      return disabled;
    },
    code() {
      this.formData.code = `${this.code1}|${this.code2}|${this.code3}`;
      return `${this.code1}|${this.code2}|${this.code3}`;
    },
    userInfo() {
      // console.log("userInfo", this.$getStorage("userInfo"));
      return this.$getStorage("userInfo");
    },
  },
  watch: {
    "flowAuths.stamp.write": {
      handler(newValue, oldValue) {
        console.log("判断是不是文秘节点", newValue);
        this.wmNode = newValue || false;
      },
      immediate: true,
      deep: true,
    },
    // 发文单位选择 控制收文人选择
    "formData.sendUnits": {
      handler(newValue, oldValue) {
        if (!newValue) return;
        let a = newValue;
        if (this.formData.copySend) {
          a = a + "," + this.formData.copySend;
        }
        let originalArray = a.split(",");
        let uniqueArray = [...new Set(originalArray)];
        this.unitId = uniqueArray;
      },
      deep: true,
    },
    // 发文单位选择 控制收文人选择
    "formData.copySend": {
      handler(newValue, oldValue) {
        if (!newValue) return;
        let a = newValue;
        if (this.formData?.sendUnits) {
          a = a + "," + this.formData.sendUnits;
        }
        let originalArray = a.split(",");
        let uniqueArray = [...new Set(originalArray)];

        this.unitId = uniqueArray;
      },
      deep: true,
    },

    // 监听
    "formData.onlineEdit": {
      handler(newValue, oldValue) {
        // console.log("onlineEdit watch", newValue);
        if (this.pageType.documentType == 2) {
          // 正文上传/生成

          if (this.formDataRules?.uploadFileContent[0]) {
            this.$set(
              this.formDataRules?.uploadFileContent[0],
              "required",
              newValue == 1 ? true : false
            );
          }
          if (this.formDataRules?.content[0]) {
            // 正文标题
            this.$set(
              this.formDataRules.content[0],
              "required",
              newValue == 1 ? false : true
            );
          }
          if (newValue == 0) {
            this.$refs.dataFormRef.clearValidate("uploadFileContent");
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    //关闭控件页面回调
    window.ntkoCloseEvent = () => {
      //发送时才触发
      if (this.cmd == 2) {
        this.ntkoClose = true;
      }
      // alert("跨浏览器插件应用程序窗口已关闭!");
    };
  },
  methods: {
    async appInitForm() {
      const { documentType, unitType, businessId } = this.$route.query;
      let params = {
        pageSize: 20,
        current: 1,
        entity: {
          id: businessId,
          unitType: Number(unitType),
          documentType: Number(documentType),
        },
      };
      console.log("***************appInitForm", params);
      const { data, success } =
        documentType == 2
          ? await getOwnerSendById(params)
          : await getOwnerReceiveById(params);
      console.log("***************getOwnerById", data);
      if (!success) {
        this.$message.error("获取数据失败");
        return;
      }
      if (data && Array.isArray(data.records) && data.records.length > 0) {
        this.getFormData(data.records[0]);
      } else {
        this.getFormData({});
      }

      // this.getUnitList(); //获取所有的单位
    },
    async stopMixinGetFlowData() {
      const { documentType, unitType } = this.$route.query;
      // 业主 单位
      if (unitType == 4) {
        await this.appInitForm();
        return false;
      } else {
        return true;
      }
    },
    getH5() {
      return true;
      // 如果来自H5端，切状态是代发就直接可以编辑
      const u = navigator.userAgent,
        // isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
      if (isAndroid) {
        if (window.native) {
          //app内
          // alert(" isAndroid", isAndroid);
        } else {
          //浏览器内
          // alert(" 浏览器内2");
          if (this.formData.flowStatus == "0" || !this.formData.flowStatus) {
            return false;
          }
          return true;
        }
      }
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        console.log("获取标段", res);
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    getArchiveFile() {
      console.log("当前的状态", this.$route.meta.documentType == 2);
      let request =
        this.$route.meta.documentType == 2 ? archiveFile : archiveFileAll;
      request().then((res) => {
        console.log("archiveFile", res);
        const { success, data } = res;
        if (success && Array.isArray(data)) {
          // 处理树  将树叶children 变成null 递归函数
          this.archiveFileTypes = this.deepLoop(data);
        }
      });
    },
    deepLoop(data) {
      // 递归函数
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length <= 0) {
          // children若为空数组，则将children设为null
          data[i].children = null;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.deepLoop(data[i].children);
        }
      }
      return data;
    },
    /**获取发文单位 */
    getSendUnitList() {
      this.sendUnitOptions = [];
      sendUnitList({}).then((res) => {
        console.log("获取发文单位", res);
        if (res.success) {
          this.sendUnitOptions = res.data;
        }
      });
    },
    /**获取发文单位名称 */
    customFun() {
      console.log("自定同意");
    },
    // 将 vue 文件  转换成  pdf 然后生成 blob 在本地预览
    priviewOrsavePdf(type) {
      // 生成一个随机数
      this.random = Math.floor(Math.random() * 1000000);
      let data = this.formData;
      if (data.unit) {
        data.uniName = this.getsendUnitName(data.unit);
      }
      this.$nextTick(() => {
        // `htmlToPdftemplate_${random}`
        console.log(
          "模板htmlToPdftemplate",
          `htmlToPdftemplate_${this.random}`
        );
        this.$refs[`htmlToPdftemplate_${this.random}`].priviewOrsavePdf(
          type,
          data
        );
      });
    },
    OnSaveWordSuccess(data) {
      let wordData = JSON.parse(data);
      console.log("OnSaveWordSuccess页面", wordData);
      wordData.requestRelativeUrl = getMinioUrl(wordData.requestRelativeUrl);
      this.formData.wordUrl = JSON.stringify(wordData);
      console.log("最终得地址", wordData.requestRelativeUrl);
      console.log("this.formData.wordUrl", this.formData.wordUrl);
      this.$set(this.formData, "content", JSON.stringify(wordData));
      // 清除  conten的校验
      this.$refs.dataFormRef.clearValidate("content");
    },
    async getPdffile() {
      // 调用解析函数
      // const params = { fileInfoId: "1194575280413343744" };//无签章
      const params = { fileInfoId: "1194584702409768960" }; //有签章
      getFileById(params)
        .then(async (res) => {
          // console.log("资源", res);
          const blob = new Blob([res], {
            type: `application/pdf;charset=UTF-8`,
          });
          let url = window.URL.createObjectURL(blob);
          // console.log("url", url);
          // 注意，此处接受的src必须是浏览器可以直接访问pdf的路径
          const pdf = await getPdf(url);
          this.pdf = pdf;
          // 获取pdf的也页数
          let numPages = pdf.numPages;
          // 遍历每一页，提取文本信息
          for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const operatorList = await page.getOperatorList();
            const imgIndex = operatorList.fnArray.indexOf(
              PdfJs.OPS.paintImageXObject
            );
            const imgArgs = operatorList.argsArray[imgIndex];
            const { data } = page.objs.get(imgArgs[0]);
          }
        })
        .catch((error) => {
          console.error("下载文件失败:", error);
          // 在这里添加错误处理代码，例如显示错误消息给用户
        });
    },
    //只能选中本单位得人员 考虑多单位
    async getMyUnitId() {
      let unitId = [];
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId,
      };
      let res = await BelongTo(params);
      const { data, success } = res;
      if (!success) {
        return unitId;
      }
      if (data && Array.isArray(data) && data.length > 0) {
        unitId = data.map((item) => item.corpId);
      }
      this.myUnitId = unitId;
    },
    getCheckSignStatus(row) {
      if (row.signStatus == 2 || row.signStatus == 5) {
        return "icon-checked";
      } else if (row.signStatus == 3 && row.sendStatus == 2) {
        return "icon-checked";
      }
    },
    signStyle(row) {
      if (row.signStatus == 3) {
        return "reject";
      } else if (row.signStatus == 2 || row.signStatus == 5) {
        return "success";
      }
    },
    // 监理发文签章
    receivechangeFile(fileData, fileNtkoIndex) {
      console.log("fileData", fileData);
      let arrFileData = JSON.parse(fileData);
      arrFileData.forEach((item) => {
        if (item.signed == true || item.signed == 1) {
          item.signed = 1;
        } else {
          item.signed = 2;
        }
        item.size = item.size || item.fileSize;
      });
      console.log("最终 的数据", arrFileData);
      this.formData.uploadFile = JSON.stringify(arrFileData);
    },
    // ntko 回调
    changeFile(fileData) {
      //签章完成后修改文件信息
      console.info("**********change************", fileData);
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
          this.formData.uploadFileContent = fDataArrStr;
          if (fData.signed) {
            this.formData.signed = 1;
          } else {
            this.formData.signed = 2;
          }
        }
      });
    },
    getSignStatus(row) {
      // 一个住送单位 可以拒签  多单位不能拒签 只能是部分签收  和
      let status = row.signStatus;
      // 拒签的情况下  组合是 signStatus3   sendStatus 1

      let result = "";
      switch (status) {
        case 0:
          result = " 待签收";
          break;
        case 1:
          result = "部分签收";
          break;
        case 2:
          result = "已签收";
          break;
        case 3:
          result = "已拒签";
          break;
        case 4:
          result = "√已退回";
          break;
        case 5:
          result = "已签收";
          break;
        default:
          result = "待签收";
          break;
      }
      return result;
    },

    getTableUnitName(row, index) {
      // console.log("获取 table 单位u", index, row, this.ownDepartmentsByUnit);
      // 业主单独处理
      // console.log("row.sendUser", row.sendUser);
      let units = row.sendUser.split(",");
      if (this.pageType.unitType == 4) {
        if (!row.sendUnits) return;
        let arr = row.sendUnits.split(",");
        let names = this.unitOptions
          .filter((x) => arr.includes(x.corpId))
          .map((x) => x.corpName);
        return names.join(",") || row.sendUnits;
      }

      let a = units.find((x) => x.includes(row.createUser));
      // console.log("非业主单位", a, units);
      if (a) {
        let unitId = a.split("_")[2];
        let unitInfo = this.unitOptions.find((x) => x.corpId == unitId);
        return unitInfo?.corpName || "";
      } else {
        return "";
      }
    },
    // 根据单位id 获取名称
    getUnitName(row) {
      if (!row.sendUnits) return;
      let arr = row.sendUnits?.split(",");
      let names = [];
      this.unitOptions.forEach((x) => {
        if (arr.includes(x.corpId)) {
          names.push(x.corpName);
        }
      });
      return names.join(",") || row.sendUnits;
    },
    getSignPositon(flowName) {
      let rep = false;
      flowName = flowName.replace(/[\r\n\s]+/g, "");
      console.info("当前流程节点名称：", flowName);
      //坐标集合key为书签名称 value为x和y坐标对象
      var signPosition = JSON.parse(this.formData.filePath)[0].signPosition;
      console.info("书签坐标映射：", signPosition);
      for (var k in this.signMarkBooksMap) {
        if (this.signMarkBooksMap[k]["flowNodeName"] == flowName) {
          rep = true;
          var xy = signPosition[k];
          console.info("当前节点对应书签名称", k);
          this.signPosition["signX"] = xy.x;
          this.signPosition["signY"] = xy.y;
          break;
        }
      }
      return {
        rep: !rep ? false : true,
        signPosition: this.signPosition,
        flowName: flowName,
      };
    },

    // 拒签
    async rejectSign(status) {
      this.$prompt(`请输入${status == 3 ? "拒签" : "退回"}理由`, "提示", {
        customClass: "customClass",
        confirmButtonText: "确定",
        cancelButtonText: "",
        showCancelButton: false,
        inputType: "textarea",
        message: `${status == 3 ? "拒签" : "退回"}操作不可撤回，${
          status == 3 ? "拒签" : "退回"
        }后不可继续办理此条收文业务，请谨慎操作！`,
        inputErrorMessage: `请输入${status == 3 ? "拒签" : "退回"}理由`,
        closeOnClickModal: false,
        inputPattern: /[\s\S]+/, // 用于判断至少包含一个字符或者更多字符
        inputValidator: (value) => {
          if (value.length >= 500) {
            return `最多输入500字符的${status == 3 ? "拒签" : "退回"}理由`;
          }
          return true;
        },
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            // this.$emit("click", this.row, this.status, this.task);
            const { documentType, unitType } = this.$route.meta;
            let params = {
              id: this.formData.id,
              code: this.formData.code,
              documentType: documentType,
              signStatus: status,
              reason: instance.inputValue,
            };
            let result = await setSign(params, unitType);
            if (result.success) {
              done();
              return true;
            } else {
              this.$message.error(
                `${status == 3 ? "拒签" : "退回"}失败` +
                  (result.message ? ":" + result.message : "")
              );
              return false;
            }
          } else {
            done(false);
          }
        },
      })
        .then((res) => {
          console.log("确定", res);
          // 关闭弹窗
          // window.parent.postMessage("", "*");
          // 向父页面发送消息
          window.parent.postMessage(
            {
              flowShow: false,
            },
            "*"
          );
        })
        .catch((err) => {
          console.log("取消", err);
        });
    },

    // 签收
    async setSigned() {
      const { documentType, unitType } = this.$route.meta;
      let params = {
        id: this.formData.id,
        code: this.formData.code,
        documentType: documentType,
        signStatus: 2,
        reason: "",
      };
      let { data, success, message } = await setSign(params, unitType);
      if (success) {
        this.$nextTick(() => {
          window.parent.postMessage(
            {
              flowShow: false,
            },
            "*"
          );
        });
      } else {
        this.$message.error(message);
      }
      console.log("点击签收按钮", success, data);
    },
    //主送/抄送单位 设置收文人
    userChange() {
      // 把两个table 的人员全部拿到 然后合并在一起   组成    人员id_部门id_单位id,
      this.$nextTick(() => {
        let sendUnitTable = this.$refs.sendUnits.tableData;
        let copyUnitTable = this.$refs.copySend.tableData;
        let tableList = sendUnitTable.concat(copyUnitTable);
        console.log("tableList", tableList);
        let userIds = [];
        tableList.forEach((item) => {
          if (item.item) {
            userIds.push(
              `${item.item.userId}_${item.item.departId}_${item.item.corpId}`
            );
          }
        });
        let str = userIds.join(",");
        this.$set(this.formData, "sendUser", str);
      });
    },

    // 抄送单位 设置收文单位
    setCopyUnit(uniIds) {
      if (uniIds.length == 0) {
        this.$set(this.formData, "copySend", "");
      } else {
        let stringIds = uniIds.join(",");
        this.$set(this.formData, "copySend", stringIds);
      }
    },

    hasDuplicates(array) {
      let bool = new Set(array).size != array.length;
      console.log("bool", bool);
      return bool;
    },

    // 发送单位 设置发文单位
    setSentUnit(uniIds) {
      let sendUnitTable = this.$refs.sendUnits.tableData.map((x) => x.corpId);
      let copyUnitTable = this.$refs.copySend.tableData.map((x) => x.corpId);
      // 判断两个数组是不是有重复的数据
      if (
        sendUnitTable.some((x) => copyUnitTable.includes(x)) ||
        copyUnitTable.some((x) => sendUnitTable.includes(x)) ||
        this.hasDuplicates(sendUnitTable) ||
        this.hasDuplicates(copyUnitTable)
      ) {
        this.$message.error("发送单位和抄送单位不能重复");
        this.$set(this.formData, "sendUnits", "");
        this.$set(this.formData, "copySend", "");
        // 触发校验
        this.$refs.dataFormRef.validate("sendUnits");

        return;
      } else {
        this.$set(this.formData, "sendUnits", sendUnitTable.toString());
        this.$set(this.formData, "copySend", copyUnitTable.toString());
        // 清除校验
        this.$refs.dataFormRef.clearValidate("sendUnits");
      }

      return;
      if (uniIds.length == 0) {
        this.$set(this.formData, "sendUnits", "");
        // 触发校验
        this.$refs.dataFormRef.validate("sendUnits");
      } else {
        let stringIds = uniIds.join(",");
        this.$set(this.formData, "sendUnits", stringIds);
        // 清除校验
        this.$refs.dataFormRef.clearValidate("sendUnits");
      }
    },
    // 发送单位 处理已经被选中的单位
    handleSendUniTable(tableData) {
      let sendUnitChooseIds = tableData.map((x) => x.corpId);
      this.sendUnitChooseIds = sendUnitChooseIds;
      console.log("发送单位选中单位", this.sendUnitChooseIds);
      this.setSentUnit(sendUnitChooseIds);
    },
    // 发送单位 处理已删除的单位  被释放出来
    deleteSendUniTable(row, tableData) {
      this.deleteSendUnit = row.corpId;
      if (Array.isArray(tableData)) {
        let sendUnitChooseIds = tableData.map((x) => x.corpId);
        this.setSentUnit(sendUnitChooseIds);
      }
      this.userChange();
    },

    // 抄送单位 处理已经被选中的单位
    handleCopyUniTable(tableData) {
      let copyUnitChooseIds = tableData.map((x) => x.corpId);
      this.copyUnitChooseIds = copyUnitChooseIds;
      this.setCopyUnit(copyUnitChooseIds);
    },
    // 抄送单位 处理已删除的单位  被释放出来
    deleteCopyUniTable(row, tableData) {
      this.deleteCopyUnit = row.corpId;
      if (Array.isArray(tableData)) {
        let copyUnitChooseIds = tableData.map((x) => x.corpId);
        this.setSentUnit(copyUnitChooseIds);
      }
      this.userChange();
    },

    async setUnitDatas(row) {
      let ownDepart = [];
      // 过滤出业主单位的id
      let ownerUnit = this.unitOptions.find((item) => item.corpType == "yzdw");
      if (ownerUnit) {
        const { data, success } = await getDepartmentsByUnit(ownerUnit.corpId);
        // this.ownDepartmentsByUnit = data;
        ownDepart = data.map((x) => x.departId);
        this.ownDepartIds = ownDepart;
        // console.log("业主单位部门列表", ownDepart);
      }

      let sendUnits = (row["sendUnits"] || "").split(",");
      let copySends = (row["copySend"] || "").split(",");
      let units = [...sendUnits, ...copySends];
      let corpIds = [];
      for (let i = 0; i < units.length; i++) {
        const unitId = units[i];
        // 判断当前的id是不是在业主单位的部门里面
        let isOwnDept = ownDepart.find((x) => x === unitId);
        corpIds.push(isOwnDept ? ownerUnit.corpId : unitId);
      }
      if (corpIds.length > 0) {
        let corpId = corpIds.join(",");
        const { data, success } = await getSecretarys(corpId, "文秘");
        console.log("data角色用户的Map", data);
        if (success) {
          this.corpRoleUserMap = data;
          console.log("有数据", this.corpRoleUserMap);
        } else {
          this.corpRoleUserMap = {};
        }
      }
    },

    async setTable(row, type) {
      this.$nextTick(async () => {
        this.$refs[type].loading = true;
        let sendUnit = row[type];
        let sendUnitArr = [];
        if (sendUnit) {
          sendUnitArr = sendUnit.split(",");
        }
        let sendUnitTableData = [];
        // // 获取业主单位的所有部门
        // // console.log("所有的单位", this.unitOptions);
        // 过滤出业主单位的id
        let ownerUnit = this.unitOptions.find(
          (item) => item.corpType == "yzdw"
        );
        // // console.log("业主单位信息", ownerUnit);
        // let ownDepart = [];
        // if (ownerUnit) {
        //   const { data, success } = await getDepartmentsByUnit(
        //     ownerUnit.corpId
        //   );
        //   this.ownDepartmentsByUnit = data;
        //   ownDepart = data.map((x) => x.departId);
        //   // console.log("业主单位部门列表", ownDepart);
        // }
        // 过滤出所有的单位
        // const {} = await getDepartmentsByUnit();
        await Promise.all(
          sendUnitArr.map(async (item) => {
            let send = row.sendUnits?.split(",");
            let copy = row.copySend?.split(",");

            let table = [];
            let forUNIT = type === "sendUnits" ? send : copy;
            console.log("forUNIT", forUNIT);
            await Promise.all(
              forUNIT.map(async (val) => {
                console.log("val", val);
                // 判断当前的id是不是在业主单位的部门里面
                let isOwnDept = this.ownDepartIds.find((x) => x === val);
                let corpId = isOwnDept ? ownerUnit.corpId : val;

                let data = this.corpRoleUserMap[corpId];
                // let params = {
                //   corpId: isOwnDept ? ownerUnit.corpId : val,
                //   roleName: "文秘",
                // };

                // let res = await getSecretarynew(params);
                // let { data, success, message } = res;

                // if (!success) {
                //   this.$message.error(message);
                //   return;
                // }

                let sendUser = "";
                // console.log("row，sendUser", row.sendUser);
                if (row.sendUser) {
                  let sendUserArray = row.sendUser.split(",");
                  sendUserArray.forEach((x) => {
                    if (x.includes(val)) {
                      sendUser = x;
                    }
                  });
                  // console.log(
                  //   "sendUserArraysendUserArraysendUserArray",
                  //   sendUserArray,
                  //   val
                  // );
                }
                // console.log("sendUser____", sendUser);

                let useId = sendUser.split("_")[0] || row.sendUser;

                let userIten = data.find((x) => x.userId == useId);

                if (isOwnDept) {
                  data = data.filter((item) => item.departId == val);
                }
                // 兼容版本  如果当前人不在单位里面了，就把当前人的信息查询到然后放到data里面
                // 判断  useId是不是在 data里面
                let userItem = data.find((x) => x.userId == useId);
                // console.log("useId是不是在 data里面", data, userItem);

                if (!userItem) {
                  // 获取用户的信息
                  // userInfoList
                  let params = {
                    data: [useId],
                  };
                  const resUserList = await userInfoList(params);
                  if (!resUserList.success) {
                    this.$message.error("历史数据，人员获取失败");
                  }
                  // console.log("历史数", resUserList.data);
                  if (
                    resUserList.data &&
                    Array.isArray(resUserList.data) &&
                    resUserList.data.length > 0
                  ) {
                    data.push(resUserList.data[0]);
                  }
                }
                table.push({
                  corpId: val,
                  sendUser: useId,
                  sendUserOptions: data,
                  item: userIten,
                });
              })
            );
            sendUnitTableData = table;
          })
        );
        // console.log("sendUnitTableData", sendUnitTableData);
        this.$refs[type].initTable(sendUnitTableData);
        this.$refs[type].loading = false;
      });
    },

    // 选中关联收文回调
    relatedConfirm(row) {
      console.log("选中回调", row);
      this.formData.relatedReceiving = row.ids;
      this.formData.relatedReceivingName = row.titles;
    },

    // 获取当前人的所属机构
    getBelongTo() {
      // console.log("getBelongTo", getBelongTo);
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId,
      };
      BelongTo(params).then((res) => {
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取当前人的所属机构错误");
          //源数据
          this.belongUnitSouce = [];
          this.belongUnit = [];
          return;
        }
        if (Array.isArray(data) && data?.length > 0) {
          this.belongUnitSouce = data;
          // 从源数据中过滤出重复的单位
          this.belongUnit = this.belongUnitSouce.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          // 如果有单位 就是用单位 并使 部门   否则就 使用默认
          if (this.formData.unit) {
            let unit = this.belongUnitSouce.find(
              (x) => x.corpId == this.formData.unit
            );
            if (unit) {
              let departments = this.belongUnitSouce.filter(
                (x) => x.corpId == unit.corpId
              );
              this.departmentList = departments;
            }
          } else {
            // 过滤出 默认单位
            let unit = this.belongUnitSouce.find((x) => x.defaultOrg);
            if (unit) {
              let departments = this.belongUnitSouce.filter(
                (x) => x.corpId == unit.corpId
              );
              this.departmentList = departments;

              this.formData.unit = unit.corpId;
              this.$;
              this.formData.department = unit.departName;
            } else {
              this.formData.unit = "";
              this.formData.department = "";
            }
          }
        } else {
          this.belongUnitSouce = [];
          this.belongUnit = [];
        }
      });
    },

    changeDepartment() {
      console.log("changeDepartment");
      this.formData.department = "";
      this.$set(this.formData, "department", "");
    },
    changeUnit(e) {
      console.log("changeUnit", e);
      // 通过 e 这个id 去源数据中过滤跟这个相等的id 的部门
      // 区分是不是默认归宿  是默认归宿单位就赋值
      let departments = this.belongUnitSouce.filter((x) => x.corpId == e);
      this.departmentList = departments;
      this.$set(this, "departmentList", departments);
      console.log("单位部门", this.departmentList);
      let unit = this.belongUnit.find((x) => x.corpId == e);
      // 是默认归属
      if (unit?.defaultOrg) {
        this.formData.department = unit.departName;
      } else {
        if (departments.length == 1) {
          this.formData.department = departments[0].departName;
        } else {
          this.formData.department = "";
        }
      }
    },
    changeOnlineEdit() {
      // 来回切换 置空文件
      this.$set(this.formData, "uploadFileContent", "");
    },
    handleFileChange(value) {
      console.log("handleFileChange", value);
      if (value) {
        this.$refs.dataFormRef.clearValidate("uploadFileContent");
      }
    },
    handlerFreeUser(value) {
      console.log("freeFlowUsers", value);
      if (value) {
        this.$refs.dataFormRef.clearValidate("freeFlowUsers");
      }
    },

    // 单位选择回调
    handleSendUnitChange(value, items) {
      if (Array.isArray(items)) {
        let unitChooseNames = [];
        items.forEach((element) => {
          unitChooseNames.push(element.corpName);
        });
        this.sendUnitChooseNames = unitChooseNames;
      } else {
        this.sendUnitChooseNames = [];
      }
    },

    handleCopyUnitChange(value, items) {
      if (Array.isArray(items)) {
        let unitChooseNames = [];
        items.forEach((element) => {
          unitChooseNames.push(element.corpName);
        });
        this.copyUnitChooseNames = unitChooseNames;
      } else {
        this.copyUnitChooseNames = [];
      }
    },
    /**
     * 电子签章文件，保存成功后
     */
    OnDataParentText(varData) {
      console.log("电子签章文件，保存成功后", varData);
      if (!varData || varData === "null") {
        this.$message.error("上传版式文件失败!");
        return;
      }
      typeof varData === "string" && (varData = JSON.parse(varData));
      let name = varData.fileName;
      if (name && name.indexOf("\\") >= 0) {
        name = name.substring(name.lastIndexOf("\\") + 1);
      }
      let file = [
        {
          // blobType: varData.fileType,
          blobType: "application/pdf",
          fileId: varData.fileId,
          name: this.formData.title + ".pdf", //newfile.fileName,
          // name: name, //newfile.fileName,
          fileSize: varData.fileSize,
          url: getMinioUrl(varData.requestRelativeUrl),
        },
      ];
      console.log("上传pdf的返回值", file);
      //上传pdf的返回值
      this.formData.uploadFileContent = JSON.stringify(file);
    },

    // 通过id 获取单位名称
    getUnitChooseNames(ids) {
      let name = [];
      let arrIDS = [];
      if (!Array.isArray(ids)) {
        arrIDS = ids.split(",");
      } else {
        arrIDS = ids;
      }

      for (let i = 0; i < arrIDS.length; i++) {
        let item = this.unitOptions.find((x) => x.corpId == arrIDS[i]);
        if (item) {
          name.push(item.corpName);
        }
      }
      if (name.length == 0) {
        name = "";
      } else {
        name = name.join("、");
      }
      return name;
    },
    // 只校验某几个字段
    async validateField(fields) {
      // 验证指定字段数组
      try {
        let a = true;
        await this.$refs.dataFormRef.validateField(fields, (val) => {
          console.log("校验", val);
          if (val) {
            a = false;
          }
        });
        return a;
      } catch (error) {
        // 如果验证不通过，会抛出异常，你可以在这里处理验证失败的逻辑
        console.error("提交失败", error);
      }
    },
    // 版式文件预览
    async preview(cmd) {
      this.cmd = cmd;
      console.log("cmd", cmd);
      // if (!this.beforeSubmit(this.dataFormRef)) return;
      //只检验 其中的几个字段
      let bool = await this.validateField([
        "code",
        "title",
        "sendUnits",
        "name",
        "",
      ]);
      console.log("bool", bool);
      if (!bool) {
        return;
      }
      //判断插件是否安装
      var ntkoed = getNtkoInstalled();
      // var ntkoversion = getNtkoVersion();
      const {
        content,
        name,
        title,
        uploadFile,
        sendUnits,
        copySend,
        unit,
        wordUrl,
      } = this.formData;
      // 附件
      let uploadFileNames = [];
      if (uploadFile) {
        let arr = JSON.parse(uploadFile);
        uploadFileNames = arr.map((e, index) => {
          return index + 1 + "、" + e.name;
        });
      }
      // 获取当前日期 返回格式 2023-02-21
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const sendUnitsName = this.getUnitChooseNames(sendUnits);
      const copyUnitsName = this.getUnitChooseNames(copySend);

      //传入控件的数据
      let formData = {
        code1: this.code1,
        code2: this.code2,
        code3: this.code3,
        content: content,
        // content: content || "请在此处填前面书写",
        name,
        title,
        date: `${year}年${month}月${day}日`, //当前日期
        uploadFileNames: uploadFileNames,
        sendUnits: sendUnitsName,
        copySend: copyUnitsName,
        unit: this.getsendUnitName(unit),
        signDate: `${year}年${month}月${day}日`, //当前日期
      };
      let ntkotext = encodeURIComponent(JSON.stringify(formData)); //.replaceAll('"', "'");

      var ntkourl = window.location.host;
      var ntkoprotocol = window.location.protocol;
      var ntkoConfig = {
        ToolBars: true, //可以编辑 ntko
        compKey: this.compKey,
      };
      // if (ntkoed) {
      //   ntkoClosed(cmd);
      //   //填充数据并预览
      //   if (cmd == 1) {
      //     // ntkoFormPreview(formData, "sendDocTemplate.docx", ntkoConfig);
      //     // ntkoFormPreview(formData, "fundAllocationTemplate.docx");
      //     console.log("wordUrl", wordUrl);
      //     if (wordUrl) {
      //       let jsonData = JSON.parse(wordUrl);
      //       if (jsonData) {
      //         console.log("jsonData", jsonData);
      //         jsonData.url = jsonData.requestRelativeUrl;
      //         jsonData.name = jsonData.fileName;
      //         jsonData.fileId = jsonData.fileId;
      //       }
      //       if (!this.isStartNode) {
      //         jsonData.isRevision = true;
      //       }
      //       ntkoFilePreview(jsonData, ntkoConfig);
      //     } else {
      //       ntkoFormPreview(formData, "sendDocTemplate.docx", ntkoConfig);
      //     }
      //   } else if (cmd == 2) {
      //     //提交表单前调用 自动转pfd并保存到服务器
      //     ntkoFormSavePDF(formData, "sendDocTemplate.docx");
      //     const sleep = (milliseconds) => {
      //       return new Promise((resolve) => setTimeout(resolve, milliseconds));
      //     };
      //     while (!this.ntkoClose) {
      //       await sleep(1000);
      //       console.info("发文ntko处理中");
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

    ntkoHandleEdit() {
      this.preview(1);
    },
    getsendUnitName(unit) {
      let name = "";
      if (unit) {
        // 通过id 获取当前的名称
        let item = this.unitOptions.find((x) => x.corpId == unit);
        if (item) {
          name = item.corpName;
        }
      }
      return name;
    },
    customValidator(rule, value, callback) {
      if (this.shouldValidateField) {
        // 只有当 shouldValidateField 为 true 时才执行自定义校验
        if (this.code1 && this.code2 && this.code3) {
          callback(); // 验证通过
        } else {
          callback(new Error("请输入")); // 验证失败，返回错误消息
        }
      } else {
        callback(); // 不执行校验
      }
    },
    formatValue(value) {
      value = value.replace(/^(\-)*(\d+)\.(\d{0}).*$/, "$1$2.$3");
      return value;
    },
    handleInput(value, code) {
      console.log("handleInput", value, code);
      const result = value.toString().replace(/\|/g, "");
      this[code] = result;
    },

    async getUnitList() {
      const { data, success } = await unitList();
      if (!success) {
        this.$message.error("获取单位失败");
        return;
      }
      this.unitOptions = data
        .filter((item) => {
          return item.corpLeaf !== 0;
        })
        .sort((a, b) => {
          return a.corpSort - b.corpSort;
        });
      this.belongUnit = data;
    },
    /**
     * 获取表单数据
     */
    async getFormData(records) {
      console.log("获取表单数据////////////////", records);
      try {
        // 获取当前页面得配置信息 用于区分是哪个类型得单位
        const { documentType, unitType } = this.$route.query;

        let pageParams = {
          unitType,
          documentType,
        };
        const row = records || (await this.getFlowRow(pageParams));
        // console.log("rowrowrowrowrow", row);
        if (row) {
          if (row.code) {
            let code = row.code.split("|");
            this.code1 = code[0];
            this.code2 = code[1];
            this.code3 = code[2];
          }
          //
          this.$nextTick(() => {
            //兼容之前的版本   之前版本的数据的是  人员id&&&姓名  现在更改了组件只需要id即可
            // let sendunitId = [];
            if (row.sendUser) {
              // 判断是否包含字符 &&&
              if (row.sendUser.includes("&&&")) {
                row.sendUser = row.sendUser.split("&&&")[0];
              } else {
                // 从收文人里面获取收文单位
                // if (row.sendUser.includes("_")) {
                //   let splArr = row.sendUser.split(",");
                //   splArr.forEach((x) => {
                //     let unitId = x.split("_")[2] || "";
                //     // 判断当前的id 不在抄送 中
                //     if (!row.copySend.includes(unitId)) {
                //       sendunitId.push(unitId);
                //     }
                //   });
                // }
              }
            }
            // row.sendUnits = sendunitId;
            if (row.archiveTypeId) {
              row.archiveTypeId = row.archiveTypeId.split(",");
              row.archiveTypeId[0] = Number(row.archiveTypeId[0]); //数据字段类型不对 第一节是number 后面是字符串 fuck
            }
            if (row.sectionId) {
              row.sectionId = row.sectionId.split(",");
            }
            this.formData = row;
            console.log("表单数据", row);
            if (
              row.flowStatus == 2 ||
              row?.matterTaskTodo?.procTaskName?.includes("文秘盖章") ||
              row?.procMatterTaskDone?.procTaskName?.includes("文秘盖章") ||
              row?.procTaskName?.includes("文秘盖章")
            ) {
              this.showSentUsers = true;
              // 获取当前主送单位对应的人员 unitId
              // row.sendUnits 转换成数组
              let unitId = [];
              if (row.sendUnits) {
                unitId = row.sendUnits.split(",");
              }
              this.unitId = unitId;
            } else {
              this.showSentUsers = false;
            }
            // 审批人   2 发文     否则是收文
            let b = row.createUser == this.$getStorage("userInfo").userId;
            this.freeFlowInputShow = b && !this.readonly;

            // 只有在发文的待办才出发
            if (documentType == 2 && row.flowStatus < 1) {
              // 编辑的时候 有默认 所以设置默认
              this.getBelongTo();
            }

            if (this.formData.filePath) {
              this.signPosition = this.formData.filePath
                ? JSON.parse(this.formData.filePath)[0]?.signPosition
                : null;
              this.signPositionMsg = lod.cloneDeep(
                JSON.parse(this.formData.filePath)[0].signPosition
              );
            }
          });

          await this.setUnitDatas(row);

          this.setTable(row, "sendUnits");
          // 抄送单位
          this.setTable(row, "copySend");
          if (row.progressId) {
            let params = {
              pageSize: 10,
              current: 1,
              entity: {
                id: row.progressId,
              },
            };
            const { data, success } = await managementPage(params);
            console.log("获取计划数据", data);
            if (!success) {
              this.$message.error("获取计划数据错误");
              return "";
            }
            if (
              data?.records &&
              Array.isArray(data.records) &&
              data.records.length > 0
            ) {
              this.progressName =
                data.records[0].name + "(" + data.records[0].code + ")";
            }
          }
        } else {
          this.showSentUsers = false;
          //新增时
          this.code2 = dateFormat(new Date(), "yyyy");
          this.$nextTick(() => {
            this.freeFlowInputShow = true;
          });
          this.getBelongTo();
        }
        //
        let userInfo = this.$getStorage("userInfo");
        this.formData.draftMan = userInfo.realName;
        let reply = this.$getStorage("reply");
        if (reply) {
          this.formData.relatedReceiving = reply.id;
          this.formData.relatedReceivingName = reply.name;
        }
        this.$nextTick(() => {
          if (this.$refs.dataFormRef) this.$refs.dataFormRef.clearValidate();
          this.shouldValidateField = false;
          if (this.$refs.dataFormRef) {
            this.$refs.dataFormRef.clearValidate("code");
          }
          this.shouldValidateField = true;
          let flow_page_type = this.$getStorage("flow_page_type");
          console.log("this.re", this.readonly);
          if (this.pageType.documentType == 2) {
            if (flow_page_type == "fine") {
              this.canOnlineEdit = false;
            } else {
              if (this.wmNode) {
                this.canOnlineEdit = true;
              } else {
                this.canOnlineEdit = false;
              }
            }
          }
          this.canOnlineEdit = this.readonly;
          // flow_page_type !== "fine" && this.pageType.documentType == 2;
        });
      } catch (error) {
        this.showSentUsers = false;
        //新增时
        this.code2 = dateFormat(new Date(), "yyyy");
        console.error("获取表单数据出错:", error);
      }
    },
    async beforeSend() {
      let extData = {};
      extData["spr"] = {
        type: "user",
        value: this.formData.freeFlowUsers,
      };
      // 获取同单位下的文秘
      // let corpId = this.userInfo.corpId;
      let corpId = this.formData.unit;
      const res = await getSecretary(corpId);

      if (!res.success) {
        this.$message.error(res.message);
        return false;
      }
      let userIds = res.data
        .map((item) => {
          return item.userId;
        })
        .join(",");
      extData["wm"] = {
        type: "user",
        value: userIds,
      };
      // 发送之前 告诉后端是一对多还是一对一
      let swrsfdr = false;
      let fields = this.formData;
      let copyUnit = fields.copySend ? fields?.copySend?.split(",") : [];
      let sendUnits = fields.sendUnits ? fields?.sendUnits?.split(",") : [];
      let allUnits = [...copyUnit, ...sendUnits];
      if (allUnits.length == 1) {
        swrsfdr = true;
      } else {
        swrsfdr = false;
      }
      extData["swrsfdr"] = {
        type: "boolean",
        value: swrsfdr,
      };
      this.sendFlowJson = extData;
      // 只针对是否上传公文文件（onlineEdit 为 "0"）时进行下一步操作生成预览操作
      if (
        this.formData?.onlineEdit === "0" &&
        this.pageType.documentType == 2 &&
        typeof this.preview === "function"
      ) {
        // 发送前做模板的保存
        // await this.preview(2);
      }
    },

    custumValidate() {
      let a = this.$refs.copySend.checkRequired();
      let b = this.$refs.sendUnits.checkRequired();
      console.log("a/b", a, b);
      if (!a || !b) {
        return false;
      }
      let formData = this.formData;
      if (this.fromapp && formData.flowName == "文秘结束流程") {
        let isTrue = formData.documentType == 2 && !this.showEdit(formData);
        console.log("custumValidate formData", formData, isTrue);
        if (isTrue) {
          //关闭app父级的弹窗
          this.closeAppPopup();
          this.$message.warning("请等待收文单位完结流程！");
          return false;
        }
      }
      return true;
    },
    showEdit(row) {
      let bool = false;
      // signStatus 0 1 2 3 4 5 6 未签收(只有再文秘盖章节点才会显示) 部分签收 已签收  拒签 退回 完成 被收文退后再退回到发起人
      console.log("请等待收文单位完结流程", row);
      if (
        row.signStatus != 0 &&
        (row.signStatus == 4 ||
          row.signStatus == 5 ||
          row.signStatus == 3 ||
          row.signStatus == 6 ||
          !row.signStatus)
      ) {
        bool = true; //可以办理
      } else {
        bool = false; //不可以办理
      }
      return bool;
    },
    // 上传文件触犯发
    addFile(item) {
      console.log("addFileaddFile", item, this.formData.attachmentFileId);
      // 设置 源文件ids
      if (this.formData.attachmentFileId) {
        let json = this.formData.attachmentFileId.split(",");
        console.log("json", json);
        if (json.length > 0) {
          json.push(item.fileId); // 将新文件ID添加到数组
        }
        // 将数组转换为逗号分隔的字符串
        this.formData.attachmentFileId = json.join(",");
      } else {
        this.formData.attachmentFileId = item.fileId;
      }
      console.log(
        "this.formData.attachmentFileId",
        this.formData.attachmentFileId
      );
    },
    deleteFile(index) {
      console.log("deleteFile", index);
      // 设置 源文件ids
      if (this.formData.attachmentFileId) {
        let json = this.formData.attachmentFileId.split(",");
        json.splice(index, 1);
        this.formData.attachmentFileId = json.join(",");
      }
    },

    async sendSure() {
      // 发送之前 如果现在的状态是拒签 就提醒
      let confirmRes = true;
      confirmRes = await this.$confirm(
        `当前收文单位拒签，提交后将不能进行数据更改，请谨慎操作！`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        }
      ).catch(() => {}); // 添加错误捕获;
      return confirmRes;
    },
    /*接收到父级的消息处理完后返回给父级*/
    async save(fields, callback, event) {
      const { documentType, unitType } = this.$route.meta;
      console.log("getMessage event", fields, this.postMessageData.btnKey);
      const isMaintenance = event.data.btnKey === "maintenance";
      if (this.iframeEvent.data.btnKey === "return" && documentType == 2) {
        // 将所有的文件id 都换成源文件
        if (fields.attachmentFileId) {
          let json = this.formData.attachmentFileId.split(",");
          if (json.length > 0) {
            let uploadFile = JSON.parse(fields.uploadFile);
            console.log("filesfilesfilesfiles", uploadFile);
            if (
              Array.isArray(uploadFile) &&
              uploadFile.length === json.length
            ) {
              uploadFile.forEach((item, index) => {
                console.log("item", item);
                item.fileId = json[index];
                let url = item.url;
                let modifiedStr = url.replace(
                  /\/temp\/temp\/.*?\./,
                  `/temp/temp/${item.fileId}.`
                );
                item.url = modifiedStr;
                item.signed = 2;
              });
            } else {
              this.$message.error("源文件错误！");
            }
            console.log("uploadFile", uploadFile);
            fields.uploadFile = JSON.stringify([...uploadFile]);
          }
        }
      }
      // 将附件设置为未签状态
      if (fields.uploadFile) {
        let uploadFile = JSON.parse(fields.uploadFile);
        console.log("filesfilesfilesfiles", uploadFile);
        if (Array.isArray(uploadFile) && uploadFile.length > 0) {
          uploadFile.forEach((item, index) => {
            item.signed = 2;
          });
        }
        fields.uploadFile = JSON.stringify([...uploadFile]);
      }
      // 将公文设置为false
      let uploadFileContent = JSON.parse(fields.uploadFileContent);
      if (Array.isArray(uploadFileContent) && uploadFileContent.length > 0) {
        uploadFileContent[0].signed = false;
        fields.uploadFileContent = JSON.stringify(uploadFileContent);
      }

      // 在文秘盖章节点 并且是提交 设置当前发文的签收状态为0 即 待签收状态
      if (this.postMessageData.btnKey === "submit") {
        if (this.wmNode) {
          fields.signStatus = 0;
        }
      }
      // 在被退回 或者拒签之后的发送  就要设置状态为''了让页面显示空  不显示待签收
      if (this.postMessageData.btnKey === "send") {
        if (fields.signStatus == 3 || fields.signStatus == 4) {
          fields.signStatus = 6;
          console.log("修改状态为空");
        }
        // 将时间设置为创建时间
        if (fields.documentType == 2) {
          fields.createDate = new Date().getTime();
        }
      }
      fields.unitType = unitType;
      fields.documentType = documentType;
      // 判断是不是有有归属人key

      let confirmRes = true;
      if (
        documentType == 2 &&
        fields.hasOwnProperty("signStatus") &&
        fields.signStatus == 3 &&
        fields.flowStatus == 3 &&
        this.iframeEvent.data.btnKey != "return"
      ) {
        confirmRes = await this.sendSure();
      }
      if (!confirmRes) {
        return;
      }
      let data = this.$arrTostr({ ...fields });
      data.signStatusList = [];
      this.ntkoClose = false;
      if (this.postMessageData?.btnKey == "send") {
        // 确保文件确实已经上传
        if (!data.uploadFileContent) {
          this.$message.error("请上传文件");
          return;
        } else {
          let uploadFileContent = JSON.parse(data.uploadFileContent);
          if (
            Array.isArray(uploadFileContent) &&
            uploadFileContent.length == 0
          ) {
            this.$message.error("请上传文件");
            return;
          }
        }
      }
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: data,
            type: "maintenance",
          },
          event.origin
        );
        return;
      }
      console.log("保存", data);
      save(data, unitType)
        .then((res) => {
          const { success, message, data } = res;
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
      if (code === this.fileTypeCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.fileTypeOptions = res.data;
              callback && callback();
            }
          });
        } else {
          callback && callback();
        }
      }
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
      if (code === this.wzCode) {
        if (!this.wzCodeOptions || this.wzCodeOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.wzCodeOptions = res.data;
            }
          });
        } else {
        }
      }
      if (code === this.fxCode) {
        if (!this.fxCodeOptions || this.fxCodeOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.fxCodeOptions = res.data;
            }
          });
        }
      }
      if (code === this.fblxCode) {
        if (!this.fblxOptions || this.fblxOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.fblxOptions = res.data;
            }
          });
        }
      }
    },

    //获取在线编辑内容
    sendContentHandle(data) {
      console.log("在线编辑内容", data);
      this.$set(this.formData, "content", data);
      // this.formData.content = data;
    },
  },
  // 页面离开时触发
  beforeDestroy() {
    console.log("页面离开时触发");
    if (this.$route.query?.appDialogShow) {
      const titleElement = document.getElementById("dynamicTitle");
      // 设置动态标题
      titleElement.textContent = "雄安调蓄库工程智慧管理平台";
    }
  },
};
</script>
<style scoped lang="scss">
.box-card {
  // margin-bottom: 1rem;
  // border-radius: 7px;
  // border: 1px solid #c3c6cc;

  .control {
    float: right;
    margin: 3px 10px;

    .reduce {
      background-color: #e6a23c;
      display: inline-block;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      color: #fff;
    }
  }

  /deep/ .el-card__header {
    padding: 10px 10px 10px 20px;
    margin: 0 -10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;

    .clearfix {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .clearfix:after {
      display: none;
    }
  }

  /deep/ .el-card__body {
    padding: 10px;
  }
}
//

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

.line {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0 10px 0;
}

/deep/ .is-disabled {
  .el-input__inner,
  .el-textarea__inner {
    color: #333;
  }
}

/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}

/deep/ .page-leave.is-disabled .el-input-group__append {
  border: 1px solid #dcdfe6 !important;
  color: #333 !important;
  cursor: not-allowed;
}

.append-show {
  border: 1px solid #0096ff !important;
  color: #0096ff !important;
  cursor: pointer;
}

.append-notshow {
  border: 1px solid #dcdfe6 !important;
  color: grey !important;
  cursor: not-allowed;
  font-size: 14px;
}

.append-notshow:hover {
  border: 1px solid #dcdfe6 !important;
  background: none !important;
  color: grey !important;
  cursor: not-allowed;
}

/deep/ .customClass {
  width: 40% !important;
}

.reject {
  color: red;
}

.success {
  color: green;
}

.el-icon-view:hover {
  color: #0096ff;
}

.el-icon-download:hover {
  color: #0096ff;
}

.apph5-parent {
  /deep/ .el-form .el-form-item {
    display: flex;
    align-items: center;
  }

  /deep/ .el-form-item__content {
    flex: 1;
    margin-left: 0px !important;
  }
}
::v-deep .file-name {
  width: 220px !important;
}
</style>

<template>
  <div class="w-100pre h-100pre newForm">
    <el-dialog
      :title="diaTitle"
      :visible.sync="dialogShow"
      :top="dialogTop"
      :destroy-on-close="false"
      :fullscreen="true"
      style="height: 100vh"
      @closed="closed"
      :class="{ view: formDisabled }"
      :append-to-body="disabledDeep ? true : false"
      :show-close="showClose"
    >
      <el-row
        :gutter="20"
        class="h-100pre"
        style="margin-left: 0; margin-right: 0"
      >
        <el-col
          class="h-100pre"
          :span="flowRecord.length > 0 ? 20 : 24"
          style="box-shadow: 0 2px 4px 0 #cdcdcd, 0 0 6px 0 #cdcdcd"
        >
          <div class="page-leave over-h flex flex-column">
            <el-row class="">
              <el-col :span="24">
                <div class="flex justify-between">
                  <!-- <div @click="getPdffile">基本信息</div> -->
                  <div>基本信息</div>
                  <div>
                    <div class="flex align-center">
                      <div
                        v-if="htmlToPdftemplate"
                        class="ml-16 flex align-center h-35 rounded-4 px-10"
                        style="border: 1px solid #0096ff"
                      >
                        <span class="pointer">雄安调蓄处理笺 </span>
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
                          <span
                            class="ml-15 pointer"
                            @click="priviewOrsavePdf('save')"
                          >
                            <i class="el-icon-download" />
                          </span>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <el-divider></el-divider>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="pb-10 flex-1" style="overflow: auto">
              <el-form
                ref="dataFormRef"
                :model="formData"
                :rules="formDataRules"
                :disabled="formDisabled"
                :class="formDisabled ? 'formDisabled' : ''"
                label-position="right"
                label-width="auto"
              >
                <el-col :span="16">
                  <el-form-item label="文件编号" prop="code" error="请输入">
                    <div v-show="false">{{ code }}</div>
                    <div class="flex">
                      <el-input
                        v-model="code1"
                        maxlength="50"
                        show-word-limit
                        :disabled="formDisabled || formData.signStatus == 3"
                        @input="handleInput($event, 'code1')"
                      />
                      <div class="ml-16 mr-8">〔</div>
                      <el-input
                        v-model="code2"
                        style="width: 200px"
                        @input="handleInput($event, 'code2')"
                        :disabled="formDisabled || formData.signStatus == 3"
                      />
                      <div class="ml-8 mr-16">〕</div>

                      <el-input
                        style="width: 300px"
                        show-word-limit
                        maxlength="10"
                        v-model="code3"
                        :disabled="formDisabled || formData.signStatus == 3"
                        @input="handleInput($event, 'code3')"
                      />
                      <div class="ml-16">号</div>
                    </div>
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

                <el-col :span="12">
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
                <el-col :span="12">
                  <el-form-item label="方向" prop="status">
                    <el-select
                      @visible-change="$visibleChange($event, 'el-popper')"
                      class="w-100pre"
                      v-model="formData.orientation"
                    >
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
                <el-col :span="12" v-if="showSubcontractingFileType">
                  <el-form-item
                    label="分包文件类型"
                    prop="subcontractingFileType"
                  >
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

                <!-- 新增时候展示 -->
                <el-col :span="12">
                  <el-form-item label="主送" prop="sendUnits">
                    <uniTable
                      :tableTitle="'主送单位'"
                      ref="sendUnits"
                      @chooseChange="setSentUnit"
                      @deleteChange="deleteSendUniTable"
                      @userChange="userChange"
                      :selectedUniIds="copyUnitChooseIds"
                      :deleteUniId="deleteCopyUnit"
                      :disableTable="formDisabled || formData.signStatus == 3"
                      :pageType="4"
                    ></uniTable>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="抄送">
                    <uniTable
                      :tableTitle="'抄送单位'"
                      ref="copySend"
                      @chooseChange="setSentUnit"
                      @deleteChange="deleteCopyUniTable"
                      @userChange="userChange"
                      :selectedUniIds="sendUnitChooseIds"
                      :deleteUniId="deleteSendUnit"
                      :disableTable="formDisabled || formData.signStatus == 3"
                      :pageType="4"
                    ></uniTable>
                    <!-- :selfUnit="formData.unit" -->
                  </el-form-item>
                </el-col>

                <el-col
                  :span="24"
                  v-if="pageType.unitType === 1 && pageType.documentType === 2"
                >
                  <el-form-item label="关联进度计划">
                    <progress-select
                      v-model="formData.progressId"
                      :readonly="formDisabled"
                      type="id"
                    ></progress-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <div></div>
                </el-col>
                <el-col :span="24" v-if="!formDisabled">
                  <el-form-item label="">
                    <el-radio-group
                      v-model="formData.onlineEdit"
                      @change="changeOnlineEdit"
                    >
                      <el-radio :label="'0'"
                        >在线编辑公文正文并生成红头文件
                      </el-radio>
                      <el-radio :label="'1'">上传已编制好的公文文件</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <span>
                  <el-col :span="24" v-if="formData.onlineEdit == 1">
                    <el-form-item label="公文文件" prop="uploadFileContent">
                      <!-- :showNtko="formDisabled ? false : true" -->
                      <uploadFile
                        :fromApplication="appformDisabled ? 'app' : 'web'"
                        :readonly="formDisabled"
                        v-model="formData.uploadFileContent"
                        :flowName="formData.flowName"
                        :limit="1"
                        :multiline="false"
                        @change="handleFileChange"
                      >
                      </uploadFile>
                    </el-form-item>
                  </el-col>
                  <span v-else>
                    <!-- 当发文之后就只有文件展示 -->
                    <el-col :span="24" v-if="formData.sendStatus == 1">
                      <el-form-item label="公文文件" prop="uploadFileContent">
                        <uploadFile
                          :readonly="true"
                          v-model="formData.uploadFileContent"
                        >
                        </uploadFile>
                      </el-form-item>
                    </el-col>
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
                        <el-form-item label="公文文件" prop="uploadFileContent">
                          <uploadFile
                            v-if="formData.onlineEdit == 1"
                            :fromApplication="appformDisabled ? 'app' : 'web'"
                            :readonly="formDisabled"
                            v-model="formData.uploadFileContent"
                            :limit="1"
                            :flowName="formData.flowName"
                            @change="handleFileChange"
                            :handSign="true"
                          >
                          </uploadFile>
                          <span v-else>
                            <el-button
                              icon="el-icon-edit-outline"
                              @click="preview(1)"
                              size="mini"
                            >
                              <!-- 预览文件 -->
                              在线编辑
                            </el-button>
                            <uploadFile
                              class="hideent"
                              :fromApplication="appformDisabled ? 'app' : 'web'"
                              :readonly="false"
                              :flowName="formData.flowName"
                              v-model="formData.uploadFileContent"
                              @ntkoHandleEdit="preview(1)"
                            >
                            </uploadFile>
                          </span>
                        </el-form-item>
                      </el-col>
                    </span>
                  </span>
                </span>

                <el-col :span="24">
                  <el-form-item label="附件">
                    <uploadFile
                      :fromApplication="appformDisabled ? 'app' : 'web'"
                      :readonly="formDisabled"
                      v-model="formData.uploadFile"
                      :limit="1000"
                    >
                    </uploadFile>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="工程部位" prop="pbsCode">
                    <pbsSelect
                      v-model="formData.pbsCode"
                      :readonly="formDisabled"
                    ></pbsSelect>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="`关联收文`" prop="type">
                    <el-input
                      disabled
                      v-if="disabledDeep"
                      v-model="formData.relatedReceivingName"
                    >
                    </el-input>
                    <RelatedReceiving
                      v-else
                      :level="level"
                      :ref="`${date}_RelatedReceivingDocuments`"
                      :formDisabled="formDisabled"
                      :relatedIds="formData.relatedReceiving"
                      :titles="formData.relatedReceivingName"
                      @relatedConfirm="relatedConfirm"
                      :showModal="false"
                    >
                    </RelatedReceiving>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="拟稿人" prop="draftMan">
                    <el-input
                      disabled
                      v-model="formData.draftMan"
                      v-if="containsChinese(formData.draftMan)"
                    ></el-input>
                    <user
                      v-else
                      ref="draftMan"
                      v-model="formData.draftMan"
                      :readonly="formDisabled"
                      @change="chooseCreateUsername"
                    ></user>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="拟稿部门" prop="department">
                    <el-input disabled v-model="formData.department" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="发文单位" prop="unit">
                    <el-input disabled v-model="unitName" />
                  </el-form-item>
                </el-col>
              </el-form>

              <el-col :span="24">
                <!-- v-if="isShowSignTabel" -->
                <div class="">
                  <div class="mb-10 font-w-600 text-333">最近签收状态</div>
                  <el-table
                    ref="multipleTable"
                    :data="formData.signStatusList"
                    height="180"
                    border
                  >
                    <el-table-column
                      label="序号"
                      type="index"
                      width="80"
                      align="center"
                    />
                    <el-table-column
                      label="收文单位"
                      prop="sendUnits"
                      align="center"
                    >
                      <template slot-scope="{ row }">
                        <span
                          class="text-ellipsis"
                          :title="row.belongUnitName"
                        >
                          {{ row.belongUnitName }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="签收状态"
                      prop="signStatus"
                      align="center"
                      width="120"
                    >
                      <template slot-scope="{ row }">
                        <div :class="signStyle(row)">
                          <span
                            class="iconfont"
                            :class="getCheckSignStatus(row)"
                          >
                            <span class="font-12">{{
                              getSignStatus(row)
                            }}</span>
                          </span>
                        </div>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column
              label="签收人"
              prop="sendUser"
              header-align="center"
              align="center"
            /> -->
                    <el-table-column
                      label="签收/拒签日期"
                      prop="updateDate"
                      header-align="center"
                      width="200"
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
                        <span>{{ row.reason }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>

        <el-col class="h-100pre" :span="4" v-if="receiptFlowRecords.length > 0">
          <el-tabs
            v-model="tabActiveName"
            type="card"
            @tab-click="tabHandleClick"
            class="tabs-card"
          >
            <el-tab-pane label="本流程" name="send">
              <div
                class="flowRecord p-10 h-100pre"
                style="
                  box-shadow: 0 2px 4px 0 #cdcdcd, 0 0 6px 0 #cdcdcd;
                  overflow: auto;
                "
              >
                <el-timeline>
                  <el-timeline-item
                    v-for="item in flowRecord"
                    :key="item.logId"
                    :timestamp="
                      item.createTime
                        ? $dateFormat(item.createTime, 'YYYY-MM-DD HH:mm:ss')
                        : ''
                    "
                    placement="top"
                  >
                    <el-card>
                      <span>{{ item.logMsg }}</span>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-tab-pane>
            <el-tab-pane
              v-for="record in receiptFlowRecords"
              :key="record.sendUnits"
              :name="record.id"
              :label="record.sendUnitName + '收文'"
            >
              <div
                class="flowRecord p-10 h-100pre"
                style="
                  box-shadow: 0 2px 4px 0 #cdcdcd, 0 0 6px 0 #cdcdcd;
                  overflow: auto;
                "
              >
                <el-timeline>
                  <el-timeline-item
                    v-for="item in record.logs"
                    :key="item.logId"
                    :timestamp="item.timeStr"
                    placement="top"
                  >
                    <el-card>
                      <span>{{ item.logMsgFormat }}</span>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col class="h-100pre" :span="4" v-else>
          <div
            class="flowRecord p-10 h-100pre"
            style="
              box-shadow: 0 2px 4px 0 #cdcdcd, 0 0 6px 0 #cdcdcd;
              overflow: auto;
            "
          >
            <el-timeline>
              <el-timeline-item
                :timestamp="
                  item.createTime
                    ? $dateFormat(item.createTime, 'YYYY-MM-DD HH:mm:ss')
                    : ''
                "
                placement="top"
                v-for="item in flowRecord"
                :key="item.logId"
              >
                <el-card>
                  <span>{{ item.logMsg }}</span>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-col>
      </el-row>
      <div
        slot="footer"
        v-if="!formDisabled"
        class="dialog-footer flex justify-end"
      >
        <span>
          <!-- isSelf 2保存 1发文(后端用 但不保存在数据库)     sendStatus 0 保存  1已发  2已完成 0 回退 -->

          <span
            v-if="
              (formData.signStatus == 3 && formData.sendStatus == 1) ||
              (formData.signStatus == 4 && formData.sendStatus == 1)
            "
          >
            <el-button type="danger" @click="submit('2', '0')">退 回</el-button>
            <el-button type="primary" @click="submit('2', '2')"
              >完 成</el-button
            >
          </span>
          <span v-else>
            <el-button type="primary" @click="submit('2', '0')"
              >保 存</el-button
            >
            <el-button type="primary" @click="submit('1', '1')"
              >发 送</el-button
            >
          </span>
        </span>
      </div>
    </el-dialog>
    <htmlToPdftemplate
      ref="htmlToPdftemplate"
      documentType="SendDocument"
    ></htmlToPdftemplate>
  </div>
</template>

<script>
import {
  save,
  unitList,
  userInfoList,
  getSecretarys,
  getUserByCorpId,
  getOwnerById,
  logs,
  getDepartmentsByUnit,
  archiveFile,
  archiveFileAll,
  sectionList,
} from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import DepSelect from "@/components/DepSelect/index.vue";
import ProgressSelect from "@/components/ProgressSelect/index.vue";
import RelatedReceiving from "@/views/office/SendDocument/components/RelatedReceivingDocuments.vue";

import htmlToPdftemplate from "@/views/office/SendDocument/components/htmlToPdftemplate.vue";
import {
  getMinioUrl,
} from "@/utils/ntko";
import { BaseMixin } from "@/mixins/BaseMixin";

export default {
  props: {
    disabledDeep: {
      default: false,
      type: Boolean,
    },
    level: {
      default: 0,
      type: Number,
    },
    diaTitle: {
      default: "业主发文",
      type: String,
    },
    showModal: {
      default: true,
      type: Boolean,
    },
  },
  components: {
    DepSelect,
    ProgressSelect,
    htmlToPdftemplate,
    RelatedReceiving,
  },
  mixins: [BaseMixin],
  data() {
    return {
      archiveFileTypes: [], //归档类型
      subcontractingFileTypesOption: [], //分包文件类型
      sectionOptions: [],
      ownDepartmentsByUnit: [],
      components: "RelatedReceiving",
      date: Date.now(),
      showClose: true,
      dialogTop: "8vh",
      dialogWidth: "80%",
      createUsername: "",
      ntkoClose: false,
      formDisabled: false,
      dialogShow: false,
      sendUnitChooseNames: [], //选中的单位 名称
      copyUnitChooseNames: [], //选中的单位 名称
      unitId: [], // 收文人 对应的单位
      pageType: "",
      unitOptions: [],
      code1: "",
      code2: "",
      code3: "",
      mode: "default", // or 'simple'
      tableData: [],
      formData: {
        onlineEdit: "1",
        title: "",
        draftMan: "",
        unit: "",
      },
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
        uploadFileContent: [
          { required: true, validator: this.uploadFileContentValidator },
        ],
        createUsername: [{ required: true, message: "请选择" }],
        draftMan: [{ required: true, message: "请选择" }],
        sendUser: [
          {
            required: true,
            message: "请选择收文人",
          },
        ],
        content: [{ required: true, message: "请输入", trigger: "blur" }],
        pbsCode: [{ required: true, message: "请选择", trigger: "change" }],
        archiveTypeId: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        subcontractingFileType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        sectionId: [{ required: true, message: "请选择", trigger: "change" }],
      },
      wzCode: "wz",
      wzCodeOptions: [],
      fxCode: "fx",
      fxCodeOptions: [],
      fblxCode: "fblx",
      fblxOptions: [],
      url: {
        list: "/api/synthesis/oa/page",
      },
      sendUnitChooseIds: [], // 主送单位已选中的单位
      copyUnitChooseIds: [], // 抄送单位已选中的单位
      deleteSendUnit: "", //删除的主送单位
      deleteCopyUnit: "", //删除的抄送单位
      cmd: 0,
      appformDisabled: false,
      flowRecord: [],
      //业主发文对应的收文记录
      receiptFlowRecords: [],
      curReceiptLogs: null,
      tabActiveName: "send",
      //单位-角色用户Map
      corpRoleUserMap: null,
      btnKeyMap: {
        send: "发送|创建|启动",
        initial: "启动",
        save: "保存待发",
        edit: "修改",
        pause: "暂停",
        resume: "恢复",
        repeal: "撤销",
        terminate: "终止",
        remark: "备注",
        submit: "提交会签|提交",
        addadvise: "添加会签人",
        signature: "签收",
        dispatch: "转派",
        goto: "跳转",
        return: "退回",
        recall: "撤回",
        rollback: "回退",
        transmit: "转发",
        addMpders: "添加会签人员",
      },

      compKey: new Date().getTime(),
    };
  },

  created() {
    window["OnSaveSuccess_" + this.compKey] = this.OnDataParentText;
    window["OnSaveWordSuccess_" + this.compKey] = this.OnSaveWordSuccess;
    this.getDictItemList(this.designClassifyCode);
    this.getDictItemList(this.designProfessionCode);
    this.getDictItemList(this.wzCode);
    this.getDictItemList(this.fxCode);
    this.getDictItemList(this.fblxCode);
    this.getArchiveFile();
    this.getSectionList();
    //获取数据
    // 获取当前页面得配置信息 用于区分是哪个类型得单位
    const { documentType, unitType } = this.$route.meta;
    this.pageType = {
      unitType,
      documentType,
    };
  },

  computed: {
    //是否显示标段控制，只要选择 分包管理类 下的目录，都需要选择相关标段，标段可多选;此处为：11-分包管理类 的id：
    showSectionId() {
      return this.formData?.archiveTypeId?.includes("1263993833922756608");
    },
    //是否显示分包文件类型控制，若选择“分包管理类"下的"分包审批及备案"，则需要进一步选择，分包类型，此处为：分包审批及备案 的id：
    showSubcontractingFileType() {
      return this.formData?.archiveTypeId?.includes("1263994681981665280");
    },
    htmlToPdftemplate() {
      // 发文/收文  除了发起不展示 其他都展示
      if (this.pageType.documentType == 2) {
        if (this.formData.hasOwnProperty("createDate")) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    isShowSignTabel() {
      if (
        this.$route.query?.appDialogShow &&
        this.formData?.signStatusList?.length > 0
      ) {
        return true;
      }
      return this.formDisabled && this.formData?.signStatusList?.length > 0;
    },
    unitName() {
      let name = "";
      if (this.formData.unit) {
        // 通过id 获取当前的名称
        let item = this.unitOptions.find((x) => x.corpId == this.formData.unit);
        if (item) {
          name = item.corpName;
        }
      }
      return name;
    },
    code() {
      this.formData.code = `${this.code1}|${this.code2}|${this.code3}`;
      return `${this.code1}|${this.code2}|${this.code3}`;
    },

    custumChoose() {
      if (this.formData?.flowInfo?.page == "todo") {
        return "custumChoose";
      }
    },
  },

  async mounted() {
    //关闭控件页面回调
    window.ntkoCloseEvent = () => {
      console.log("ntkoCloseEvent", this.cmd);
      //发送时才触发
      if (this.cmd == 2) {
        this.ntkoClose = true;
      }
      // alert("跨浏览器插件应用程序窗口已关闭!");
    };
    // console.log("路由", this.$route);
    // 来自app
    if (this.$route.query?.appDialogShow) {
      this.appformDisabled = true;
      this.dialogShow = true;
      this.dialogWidth = "100%";
      this.dialogTop = "0vh";
      // this.showModal = false;
      this.unitType = this.$route.query.unitType;
      this.documentType = this.$route.query.documentType;
      this.showClose = false;
      await this.getUnitList(); //获取所有的单位
      await this.appInitForm();
      const titleElement = document.getElementById("dynamicTitle");
      if (titleElement) {
        // 设置动态标题
        // titleElement.textContent = "详情";
      }
    } else {
      this.getUnitList(); //获取所有的单位
    }
  },
  // 页面离开时触发
  beforeDestroy() {
    if (this.$route.query?.appDialogShow) {
      const titleElement = document.getElementById("dynamicTitle");
      if (titleElement) {
        // 设置动态标题
        titleElement.textContent = "雄安调蓄库工程智慧管理平台";
      }
    }
  },

  methods: {
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
      return
      let fn = this.diaTitle === "关联收文" ? archiveFileAll : archiveFile;
      fn().then((res) => {
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
    uploadFileContentValidator(rule, value, callback) {
      if (value) {
        let json = JSON.parse(value);
        console.log("json", json);
        callback();
      } else {
        if (this.formData.onlineEdit == 0) {
          callback(new Error("请在线编辑公文"));
        } else {
          callback(new Error("请上传公文文件"));
        }
      }
    },
    OnSaveWordSuccess(data) {
      console.log("OnSaveWordSuccess", data);
      var wordData = JSON.parse(data);
      var wordUrl = wordData.requestRelativeUrl;
      wordData.requestRelativeUrl = getMinioUrl(wordUrl);
      this.formData.wordUrl = JSON.stringify(wordData);
      this.$set(this.formData, "content", JSON.stringify(wordData));
      // 清除  conten的校验
      this.$refs.dataFormRef.clearValidate("content");
    },
    //初始化 单位-角色用户的Map
    async initCorpRoleUserMap(corpIdList, roleName) {
      console.log("初始化 单位-角色用户的Map", corpIdList, roleName);
      let corpId = "";
      if (Array.isArray(corpIdList)) {
        corpId = corpIdList.join(",");
      }
      const { data, success } = await getSecretarys(corpId, roleName);
      console.log("data角色用户的Map", data);
      if (success) {
        this.corpRoleUserMap = data;
        console.log("有数据", this.corpRoleUserMap);
      } else {
        this.corpRoleUserMap = {};
      }
    },
    async tabHandleClick(tab) {
      this.curReceiptLogs = null;
      if (tab.name && tab.name !== "send") {
        for (let i = 0; i < this.receiptFlowRecords.length; i++) {
          const record = this.receiptFlowRecords[i];
          if (tab.name === record.id) {
            record.logs = await this.getLogs(record);
            record.logs.map((log) => {
              log.timeStr =
                "【" +
                log.createUserName +
                "】 " +
                (log.btnKey ? "-" + this.btnKeyMap[log.btnKey] + "-" : "") +
                (log.createTime
                  ? this.$dateFormat(log.createTime, "YYYY-MM-DD HH:mm:ss")
                  : "");
              log.logMsgFormat = log.idea ? log.idea : log.logMsg;
            });
            this.curReceiptLogs = record.logs;
            this.$forceUpdate();
            break;
          }
        }
      }
    },
    beforeClose(done) {
      done();
      return;
    },
    // 选中关联收文回调
    relatedConfirm(row) {
      console.log("选中回调", row);
      this.formData.relatedReceiving = row.ids;
      this.formData.relatedReceivingName = row.titles;
    },
    // 获取流程日志
    async getLogs(row) {
      if (row?.id) {
        const { success, data } = await logs(row.id);
        if (!success) {
          this.$message.error("获取日志失败");
          return;
        }
        return data || [];
      } else {
        return [];
      }
    },
    // 将 vue 文件  转换成  pdf 然后生成 blob 在本地预览
    priviewOrsavePdf(type) {
      let data = this.formData;
      if (data.unit) {
        data.uniName = this.getsendUnitName(data.unit);
      }
      this.$refs.htmlToPdftemplate.priviewOrsavePdf(type, data);
    },

    // 查询表格数据
    async getTableData() {
      try {
        const { documentType, unitType } = this.$route.meta;
        let params = {
          ...this.pageParams,
          entity: {
            ...this.query,
            startDate: this.startTimeAndEndTime?.[0] || "",
            endDate: this.startTimeAndEndTime?.[1] || "",
            unitType,
            documentType,
          },
        };

        // 因为存在下的的code 是 | 所以需要转化成 -【】-
        if (params?.entity?.code) {
          params.entity.code = this.retCode(params.entity.code);
          // 判断最后一个字是不是 号 字  如果是 删除这个号字
          let stringWithoutSpaces = params.entity.code.replace(/\s/g, "");
          if (
            stringWithoutSpaces.charAt(stringWithoutSpaces.length - 1) == "号"
          ) {
            params.entity.code = stringWithoutSpaces.slice(0, -1);
          }
        }

        const res = await page(params);

        console.log("查询数据", res);
        const { success, data } = res;
        if (success) {
          this.tableData = data.records || [];
          this.pageParams.total = data.total || 0;
        } else {
          this.tableData = [];
          this.pageParams.total = 0;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error as needed
      }
    },

    async appInitForm() {
      console.log("来自app");
      // let params = {
      //   id: this.$route.query.businessId,
      //   unitType: this.unitType,
      //   documentType: this.documentType,
      // };

      let params = {
        date: new Date().getTime(),
        ...this.pageParams,
        entity: {
          id: this.$route.query.businessId,
          unitType: this.unitType,
          documentType: this.documentType,
        },
      };
      const { data, success } = await getOwnerById(params);
      if (!success) {
        this.$message.error("获取数据失败");
        return;
      }
      if (
        data.records &&
        Array.isArray(data.records) &&
        data.records.length > 0
      ) {
        this.edit(data.records[0], true);
      } else {
        this.edit({}, true);
      }
      this.getUnitList(); //获取所有的单位
    },

    containsChinese(str) {
      // 使用正则表达式匹配是否包含汉字
      var chineseRegex = /[\u4e00-\u9fa5]/;

      // 判断是否包含汉字
      return chineseRegex.test(str);
    },

    getCheckSignStatus(row) {
      if (row.signStatus == 2) {
        return "icon-checked";
      } else if (row.signStatus == 3 && row.sendStatus == 2) {
        return "icon-checked";
      }
    },
    signStyle(row) {
      if (row.signStatus == 3 || row.signStatus == 4) {
        return "reject";
      } else if (row.signStatus == 2) {
        return "success";
      }
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
          result = "已退回";
          break;
        case 5:
          result = "已签收";
          break;
        default:
          result = "已完成";
          break;
      }
      return result;
    },
    // 抄送单位 设置收文人
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
      // 判断 sendUnitTable 数组里面是不是有重复数据

      // 触发校验
      let copyUnitTable = this.$refs.copySend.tableData.map((x) => x.corpId);
      // 判断两个数组是不是有重复的数据 判断自己是否有重复单位
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
        this.$refs.dataFormRef?.clearValidate("sendUnits");
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

    handleInput(value, codeType) {
      let code = "";
      // 使用正则  替换掉| 为空
      if (value) {
        code = value.replace(/\|/g, "");
      }
      this[codeType] = code;
    },
    // 选择拟稿人
    chooseCreateUsername(value, item) {
      console.log("item", item);
      this.formData.department = item.departName || ""; //设置部门
      this.$set(this.formData, "unit", item.corpId || "");
    },
    // 选择人员之后 带出部门跟单位
    handleFileChange(value) {
      // console.log("handleFileChange", value);
      if (value) {
        this.$refs.dataFormRef?.clearValidate("uploadFileContent");
      }
    },
    // 切换是否在线编辑
    changeOnlineEdit() {
      // 来回切换 置空文件
      this.$set(this.formData, "uploadFileContent", "");
    },
    getTableUnitName(row) {
      console.log("获取 table 单位u", row, this.ownDepartmentsByUnit);
      // 业主单独处理
      // if (row.unitType == 4) {
      //   let arr = row.sendUser.split(",");
      //   let own = arr.find((x) => x.includes("1151191129069191168"));
      //   console.log("own", own);
      //   return;
      // }
      if (!row.sendUnits) return;
      let arr = row.sendUnits.split(",");
      let names = this.unitOptions
        .filter((x) => arr.includes(x.corpId))
        .map((x) => x.corpName);
      return names.join(",") || row.sendUnits;
    },
    // 根据单位id 获取名称
    getUnitName(unitIds) {
      if (!unitIds) return;
      let arr = unitIds.split(",");
      let names = this.unitOptions
        .filter((x) => arr.includes(x.corpId))
        .map((x) => x.corpName);
      return names.join(",") || unitIds;
    },
    closed() {
      // 清空所有的校验
      this.$refs.dataFormRef?.clearValidate();
      this.dialogShow = false;
      // 清除  reply
      this.$clearStorage("reply");
    },
    // 新增
    add() {
      this.formData = {
        onlineEdit: "1",
        title: "",
      };
      this.formDisabled = false;
      this.formData = {
        onlineEdit: "1",
        title: "",
        draftMan: "",
      };
      this.code1 = "";
      this.code3 = "";
      this.getFormData();
    },
    // 查看
    edit(row, disbled) {
      this.formDisabled = disbled;
      this.getFormData(row);
    },
    // 主送单位选择回调
    handleSendUnitChange(value, items) {
      if (value) {
        let a = value;
        if (this.formData.copySend) {
          a = a + "," + this.formData.copySend;
        }
        let originalArray = a.split(",");
        let uniqueArray = [...new Set(originalArray)];
        this.unitId = uniqueArray;
      }
      // console.log("handleUnitChange", value, items);
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
    // 抄送单位选择回调
    handleCopyUnitChange(value, items) {
      if (value) {
        let a = value;
        if (this.formData.sendUnits) {
          a = a + "," + this.formData.sendUnits;
        }
        let originalArray = a.split(",");
        let uniqueArray = [...new Set(originalArray)];
        this.unitId = uniqueArray;
      }
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
      console.log("OnDataParentText", varData);
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
          // name: name, //newfile.fileName,
          name: this.formData.title + ".pdf", //newfile.fileName,
          fileSize: varData.fileSize,
          url: varData.requestRelativeUrl,
        },
      ];
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
      this.cmd = cmd;
      //判断插件是否安装
      const {
        name,
        title,
        uploadFile,
        sendUnits,
        copySend,
        unit,
      } = this.formData;
      let wordUrl = '';
      if (this.formData.uploadFileContent) {
        wordUrl = this.formData.wordUrl;
      } else {
        this.$set(this.formData, "content", '');
      }
      const content = this.formData.content;
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
        content,
        name,
        title,
        date: `${year}年${month}月${day}日`, //当前日期
        uploadFileNames: uploadFileNames,
        sendUnits: sendUnitsName,
        copySend: copyUnitsName,
        unit: this.getsendUnitName(unit),
        signDate: `${year}年${month}月${day}日`, //当前日期
        wordUrl,
      };

    },
    customValidator(rule, value, callback) {
      if (this.code1 && this.code2 && this.code3) {
        callback(); // 验证通过
      } else {
        callback(new Error("请输入")); // 验证失败，返回错误消息
      }
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
    },
    /**
     * 获取表单数据
     */
    async getFormData(row) {
      this.tabActiveName = "send";
      try {
        console.log("获取表单数据", row);
        if (row) {
          let logList = await this.getLogs(row);
          console.log("initCorpRoleUserMap", logList);
          let qcLogList = [];
          // 保存操作，同一个人只显示最新一次
          logList.forEach((item, i) => {
            if (
              item.btnKey !== "保存" ||
              (item.btnKey === "保存" &&
                logList
                  .slice(i + 1)
                  .findIndex(
                    (inItem) => inItem.createUserId === item.createUserId
                  ) === -1)
            ) {
              qcLogList.push(item);
            }
          });
          this.flowRecord = qcLogList;
          if (row.code) {
            let code = row.code.split("|");
            this.code1 = code[0];
            this.code2 = code[1];
            this.code3 = code[2];
          }
          //
          this.$nextTick(async () => {
            //兼容之前的版本   之前版本的数据的是  人员id&&&姓名  现在更改了组件只需要id即可
            if (row.sendUser) {
              // 判断是否包含字符 &&&
              if (row.sendUser.includes("&&&")) {
                row.sendUser = row.sendUser.split("&&&")[0];
              }
            }
            // 如果是拒签 因为流程已经走过去了 存下的是个字符这个时候 页面可能修改编辑  但是 这个时候  收稿人是字符串不能解析出来
            if (
              (row.signStatus == 3 && row.sendStatus == 1) ||
              (row.signStatus == 4 && row.sendStatus == 1)
            ) {
              if (row.draftMan.length <= 5) {
                const { data, success } = await getUserByCorpId(row.unit);
                if (!success) {
                  this.$message.error("获取人员失败");
                  return;
                }
                let user = data.find((item) => item.realName == row.draftMan);
                if (user) {
                  row.draftMan = user.userId;
                } else {
                  row.draftMan = "";
                }
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
            console.log("表单数据", this.formData);

            // 获取当前主送单位对应的人员 unitId
            // row.sendUnits 转换成数组
            let unitId = [];
            if (row.sendUnits) {
              unitId = row.sendUnits.split(",");
            }
            this.unitId = unitId;
            //  这里要初始化组件数据
            // 需要做的事情  设置表格  设置 表格 单位候选项  单位数据    人员候选项   人员数据
            // 发送单位
            this.setTable(row, "sendUnits");
            // 抄送单位
            this.setTable(row, "copySend");

            //获取当前的签收列表对应的流程日志记录
            let receiptFlowRecords = (row.signStatusList || [])
              .filter((x) => x.signStatus !== 0)
              .map((x) => {
                x.sendUnitName = this.getUnitName(x.sendUnits);
                return x;
              });
            this.receiptFlowRecords = receiptFlowRecords;
          });
        } else {
          this.flowRecord = [];
          // 新增
          this.$nextTick(() => {
            this.$refs.sendUnits.initTable([]);
            this.$refs.copySend.initTable([]);
          });
          this.code2 = dateFormat(new Date(), "yyyy");
          let formData = {
            onlineEdit: "1",
            sendUnits: "",
            copySend: "",
            sendUser: "",
            relatedReceiving: "",
            relatedReceivingName: "",
          };

          let reply = this.$getStorage("reply");
          console.log('reply',reply)
          if (reply) {
            formData.relatedReceiving = reply.id;
            formData.relatedReceivingName = reply.name;
          }
          this.$set(this, "formData", formData);
          if (this.$refs.sendUnits) {
            this.$refs.sendUnits.orgName = "";
          }
          if (this.$refs.draftMan) {
            this.$refs.draftMan.userName = "";
          }
        }
        this.$nextTick(() => {
          this.$refs.dataFormRef?.clearValidate();
        });
      } catch (error) {
        //新增时
        this.code2 = dateFormat(new Date(), "yyyy");
        console.error("获取表单数据出错:", error);
      }
    },

    async setTable(row, type) {
      // formDisabled || formData.signStatus == 3
      // 为了节省请求的压力，查看的时候只需要主送单位  和抄送单位
      let corpIdList = [];
      if (this.formDisabled) {
        // 取出=
        let str = row.sendUnits + row.copySend;
        console.log("str", str, "row", row);
        let unitList = this.unitOptions.filter((x) => str.includes(x.corpId));
        corpIdList = unitList.map((x) => x.corpId);
      } else {
        corpIdList = this.unitOptions.map((x) => x.corpId);
      }

      await this.initCorpRoleUserMap(corpIdList, "文秘");
      if (!this.corpRoleUserMap) {
        console.error("没有获取到单位-角色用户对象Map数据！");
        return;
      }
      let sendUnit = row[type];
      let sendUnitArr = [];
      if (sendUnit) {
        sendUnitArr = sendUnit.split(",");
      }
      let sendUnitTableData = [];
      // 获取业主单位的所有部门
      // console.log("所有的单位", this.unitOptions);
      // 过滤出业主单位的id
      let ownerUnit = this.unitOptions.find((item) => item.corpType == "yzdw");
      // console.log("业主单位信息", ownerUnit);
      let ownDepart = [];
      if (ownerUnit) {
        const { data } = await getDepartmentsByUnit(ownerUnit.corpId);

        ownDepart = data.map((x) => x.departId);
        // console.log("业主单位部门列表", ownDepart);
      }

      sendUnitArr.forEach(async () => {
        let send = row.sendUnits.split(",");
        let copy = row.copySend.split(",");
        // 设置表格单位
        let table = [];
        let forUNIT = type === "sendUnits" ? send : copy;
        forUNIT.forEach(async (val) => {
          // 判断当前的id是不是在业主单位的部门里面
          let isOwnDept = ownDepart.find((x) => x === val);
          let corpId = isOwnDept ? ownerUnit.corpId : val;
          const data = this.corpRoleUserMap[corpId];

          //  从sendUser  中获取当前单位选中的人的id
          let sendUser = "";
          if (row.sendUser) {
            let sendUserArray = row.sendUser.split(",");
            // 然后循环 判断 是不是包含 当前的单位id
            sendUserArray.forEach((x) => {
              // 判断是否包含 val
              if (x.includes(val)) {
                sendUser = x;
              }
            });
          }
          // 把人员切割出来
          let useId = sendUser.split("_")[0];
          let userIten = data.find((x) => x.userId == useId);
          // 把数据赋值给当前的人员数据源
          table.push({
            corpId: val,
            sendUser: useId,
            sendUserOptions: data,
            item: userIten, //当前人员的数据
          });
        });
        sendUnitTableData = table;
      });
      this.$refs[type].initTable(sendUnitTableData);
    },

    //接受两个参数  isSelf sendStatus
    submit(isSelf, sendStatus) {
      // 1 发送  2 保存 3退回 4完成
      // console.log("submit");
      this.$refs.dataFormRef.validate((valid) => {
        let a = this.$refs.sendUnits.checkRequired("send");
        let b = this.$refs.copySend.checkRequired();
        // console.log("a/b", a, b);
        if (!a || !b) {
          console.log("校验不通过", valid);
          return;
        }
        console.log("validvalidvalid", valid);
        if (!valid) return;

        this.save(isSelf, sendStatus);
      });
    },
    // 发送/保存
    async save(isSelf, sendStatus) {
      // type 1发送  2保存
      console.log(" isSelf 1发送  2保存", isSelf);
      if (
        isSelf == 1 &&
        this.formData.onlineEdit == 0 &&
        typeof this.preview === "function"
      ) {
        //发送前做模板的保存
        // await this.preview(2);
      } else {
        // console.info("preview方法不存在");
      }
      let data = JSON.parse(JSON.stringify(this.formData));
      if (data.archiveTypeId && Array.isArray(data.archiveTypeId)) {
        data.archiveTypeId = data.archiveTypeId.toString();
      }
      if (data.sectionId && Array.isArray(data.sectionId)) {
        data.sectionId = data.sectionId.toString();
      }
      if (isSelf == 1 && !this.formDisabled) {
        let params = {
          data: [data.draftMan],
        };
        let res = await userInfoList(params);
        if (!res.success) {
          this.$message.error("获取拟稿人信息失败");
          return;
        }
        data.draftMan = res.data[0].realName;
      }
      const { documentType, unitType } = this.$route.meta;
      data.unitType = unitType;
      data.documentType = documentType;
      console.log("保存", data);
      data.isSelf = isSelf;
      data.sendStatus = sendStatus;
      //   如果是1 就要修改当前业务的signStatus 的状态为0
      if (isSelf == 1) {
        data.signStatus = 0;
      }
      // 确保文件确实已经上传
      if (isSelf == 1) {
        if (!data.uploadFileContent) {
          this.$message.error(
            data.onlineEdit == "0" ? "请在线编辑公文" : "请上传公文文件"
          );
          return;
        } else {
          let uploadFileContent = JSON.parse(data.uploadFileContent);
          if (
            Array.isArray(uploadFileContent) &&
            uploadFileContent.length == 0
          ) {
            this.$message.error(
              onlineEdit == "0" ? "请在线编辑公文" : "请上传公文文件"
            );
            return;
          }
        }
      }
      this.ntkoClose = false;

      console.log("data", data);
      save(data)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("失败：" + message);
          } else {
            this.$message.success(isSelf == 2 ? "保存成功" : "发送成功");
            this.dialogShow = false;
            this.$emit("submitOk");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error(err);
        });
    },

    /**获取字典 */
    getDictItemList(code) {
      if (code === this.wzCode) {
        if (!this.wzCodeOptions || this.wzCodeOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.wzCodeOptions = res.data;
            }
          });
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
  },

  watch: {
    diaTitle: {
      handler(newValue) {
        if (newValue === "关联收文") {
          this.getArchiveFile();
        }
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

/deep/ .el-dialog__body {
  max-height: 70vh;
  height: 70vh;
  overflow: hidden !important;
}

/deep/ .is-fullscreen {
  .el-dialog__body {
    max-height: 100vh;
    height: calc(100vh - 65px - 65px);
    overflow: hidden !important;
  }
}

.view {
  /deep/ .is-fullscreen {
    .el-dialog__body {
      height: calc(100vh - 65px);
    }
  }
}

/deep/ .el-form-item {
  margin-bottom: 25px !important;
}

/deep/ .el-dialog__close::before {
  color: #fff !important;
}

/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
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

.reject {
  color: red;
}

.success {
  color: green;
}

/deep/ .el-timeline-item__timestamp {
  color: #409eff;
}

.tabs-card {
  height: 100%;

  /deep/ .el-tabs__content {
    height: calc(100% - 41px - 15px);
    overflow-y: auto;
  }
}
</style>

<style scoped>
.fromapp .el-select .el-input .el-input__inner {
  height: 100% !important;
}
</style>

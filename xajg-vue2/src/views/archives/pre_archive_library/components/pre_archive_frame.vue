<template>
  <div class="page-pre-archive-frame">
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="formData"
      label-width="100px"
      :disabled="readonly"
    >
      <el-form-item label="审核人" prop="shr">
        <UserSelectInput
          v-model="formData.shr.value"
          placeholder="请选择"
          :userName="formData.shr.object?.realName"
        />
      </el-form-item>
      <div class="enclosure">
        <span>案卷列表</span>
        <!-- <div>
          <el-button size="small" type="primary" @click="handelAdd">添加</el-button>
        </div> -->
      </div>
    </el-form>
    <el-table :data="ajlb" max-height="280px">
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="ajtm" label="案卷题名" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="showRow(row)">{{
            row.ajtm.value
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="dh" label="档号" align="center">
        <template #default="{ row }">
          {{ row.dh?.value }}
        </template>
      </el-table-column>
      <el-table-column prop="hjh" label="互见号" align="center">
        <template #default="{ row }">
          <el-input
            v-model.trim="row.hjh.value"
            :disabled="!readonly || $route.query.page === 'fine'"
            type="text"
            placeholder="请填写"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" v-if="!readonly">
        <template #default="{ row, $index }">
          <div class="table-btn">
            <el-button type="text" @click="deleteFile(row)">删除</el-button>
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <el-dialog
      :visible.sync="showDialog"
      title="查看案卷"
      width="80%"
      top="50px"
      :close-on-click-modal="false"
      v-if="showDialog"
    >
      <el-form
        ref="dialogForm"
        :model="dialogFormData"
        label-width="120px"
        class="dialog-form"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="档号" prop="reference">
              <el-input v-model="dialogFormData.reference" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属节点" prop="nodeName">
              <el-input v-model="dialogFormData.nodeName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目代号" prop="projectCode">
              <el-input
                v-model="dialogFormData.projectCode"
                disabled
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="分类号" prop="typeCode">
              <el-input v-model="dialogFormData.typeCode" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="案卷题名" prop="recordsName">
              <el-input v-model="dialogFormData.recordsName" readonly />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="立卷单位" prop="filingCorpId">
              <el-input
                v-model="dialogFormData.filingCorpName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="起止日期" prop="Date">
              <el-date-picker
                v-model="dialogFormData.Date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                disabled
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="整编人" prop="filingUserId">
              <el-input
                v-model="dialogFormData.filingUserName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="8">
            <el-form-item label="整编日期" prop="filingDate">
              <el-date-picker
                v-model="dialogFormData.filingDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="所属合同" prop="contract">
              <el-input
                v-model="dialogFormData.contract"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="dialogFormData.projectName"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="子项目" prop="project">
              <el-input
                v-model="dialogFormData.project"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="单位工程" prop="unitEngineering">
              <el-input
                v-model="dialogFormData.unitEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分部工程" prop="branchEngineering">
              <el-input
                v-model="dialogFormData.branchEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="阶段" prop="stage">
              <el-input
                v-model="dialogFormData.stage"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="专业" prop="speciality">
              <el-input
                v-model="dialogFormData.speciality"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保管期限" prop="retentionPeriod">
              <el-select
                v-model="dialogFormData.retentionPeriod"
                disabled
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in retentionPeriodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密级" prop="classification">
              <el-select
                v-model="dialogFormData.classification"
                disabled
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in classificationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文件件数">
              <el-input
                :value="computedMultiArchiveDisabledFileNum"
                placeholder="请输入"
                readonly
              >
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总页数" prop="pageNum">
              <el-input
                :value="computedMultiArchiveDisabledPageNum"
                readonly
                placeholder="请输入"
              >
                <template slot="append">页</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文字材料页数" prop="docNum">
              <el-input
                :value="computedMultiArchiveDisabledDocNum"
                readonly
                placeholder="请输入"
              >
                <template slot="append">页</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="图纸张数" prop="picNum">
              <el-input
                :value="computedMultiArchiveDisabledPicNum"
                readonly
                placeholder="请输入"
              >
                <template slot="append">张</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="脊背宽度" prop="backboneWidth">
              <el-input
                v-model="dialogFormData.backboneWidth"
                placeholder="请输入"
                readonly
              >
                <template slot="append">CM</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="归档份数" prop="fileNum">
              <el-input
                v-model="dialogFormData.fileNum"
                placeholder="请输入"
                readonly
              >
                <template slot="append">份</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="整编人" prop="fileUserId">
              <UserSelectInput
                v-model="dialogFormData.fileUserId"
                placeholder="请选择"
                :userName="dialogFormData.fileUserName"
                disabled
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="整编日期" prop="fileDate">
              <el-date-picker
                v-model="dialogFormData.fileDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
                disabled
              />
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="备考说明" prop="notes">
              <el-input
                v-model="dialogFormData.notes"
                type="textarea"
                rows="3"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="enclosure">
        <span>卷内文件列表</span>
      </div>
      <el-table :data="fileList" max-height="280px">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="文件题名" prop="name" align="center">
          <template #default="{ row }">
            <el-button
              type="text"
              @click="showFileRow(row)"
              :title="row.name"
              >{{ row.name }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="code" label="文件编号" align="center" />
        <el-table-column
          prop="createCorpName"
          label="责任单位"
          align="left"
          width="120"
        />
        <el-table-column
          prop="createDate"
          label="成文日期"
          align="left"
          width="120"
        >
          <template #default="{ row }">
            {{ dateFormat(row.createDate) }}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="handelDialogClose">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showFileDialog" title="查看文档" top="50px">
      <el-form :model="fileDetail" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="文件题名" prop="name">
              <el-input
                v-model="fileDetail.name"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="责任单位" prop="createCorpName">
              <el-input
                v-model="fileDetail.createCorpName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成文日期" prop="createDate">
              <el-date-picker
                v-model="fileDetail.createDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input
                v-model="fileDetail.version"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传日期" prop="uploadDate">
              <el-date-picker
                v-model="fileDetail.uploadDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属合同" prop="contract">
              <el-input
                v-model="fileDetail.contract"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子项目" prop="childProject">
              <el-input
                v-model="fileDetail.childProject"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位工程" prop="unitEngineering">
              <el-input
                v-model="fileDetail.unitEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分部工程" prop="branchEngineering">
              <el-input
                v-model="fileDetail.branchEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="notes">
              <el-input
                v-model="fileDetail.notes"
                type="textarea"
                rows="3"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="enclosure">
          <span>附件列表</span>
        </div>
      </el-form>
      <el-table :data="fileDialogList" max-height="280px">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="filename" label="附件名称" align="center">
          <template #default="{ row }">
            <el-button
              type="text"
              :title="(row.attachment && row.attachment.fileName) || '-'"
              size="small"
              style="text-decoration: underline"
              @click="
                previewFile(
                  row.attId,
                  row.attachment && row.attachment.fileName
                )
              "
            >
              {{ (row.attachment && row.attachment.fileName) || "-" }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="uploadUserName" label="上传人" align="center" />
        <el-table-column prop="uploadDate" label="上传日期" align="center">
          <template #default="{ row }">
            {{ dateFormat(row.uploadDate) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="typeName" label="类型" align="center" /> -->
      </el-table>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showFileDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTodoReadBusiness,
  getArchiveAdvanceStoreDetail,
  getArchiveFileDetail,
  getFinishedReadBusiness,
  getFilePath,
} from "@/api/archives.js";
import { mapGetters } from "vuex";
import { dateFormat } from "@/utils";
import UserSelectInput from "@/components/UserSelectInput/index.vue";
export default {
  name: "PreArchiveFrame",
  components: { UserSelectInput },
  computed: {
    ...mapGetters(["loginInfo"]),
    computedPreArchiveDisabled() {
      return (
        this.tableMultipleSelection.length === 0 ||
        this.tableMultipleSelection.some(
          (item) => item.status !== "归档失败" && item.status !== "已组卷"
        )
      );
    },
    computedMultiArchiveDisabled() {
      return (
        this.tableMultipleSelection.length === 0 ||
        this.tableMultipleSelection.some(
          (item) => item.status !== "审核未通过" && item.status !== "已预审"
        )
      );
    },
    computedMultiArchiveDisabledFileNum() {
      return this.fileList?.length || 0;
    },
    computedMultiArchiveDisabledPageNum() {
      if (Array.isArray(this.fileList)) {
        return this.fileList.reduce((prev, item) => {
          prev += Number(item.pageNum);
          return prev;
        }, 0);
      } else {
        return 0;
      }
    },
    computedMultiArchiveDisabledDocNum() {
      if (Array.isArray(this.fileList)) {
        return this.fileList.reduce((prev, item) => {
          prev += Number(item.docNum);
          return prev;
        }, 0);
      } else {
        return 0;
      }
    },
    computedMultiArchiveDisabledPicNum() {
      if (Array.isArray(this.fileList)) {
        return this.fileList.reduce((prev, item) => {
          prev += Number(item.picNum);
          return prev;
        }, 0);
      } else {
        return 0;
      }
    },
  },
  data() {
    const requiredCheck = (rule, value, callback) => {
      if (!value.value) {
        return callback(new Error("请输入"));
      }
      callback();
    };
    return {
      formData: {
        shr: {
          type: "users",
          value: "",
        },

        ajlb: {
          children: [],
          type: "children",
          value: "",
        },
      },
      rules: {
        shr: {
          required: true,
          message: "请选择审核人",
          trigger: "change",
          validator: requiredCheck,
        },
      },
      ajlb: [],
      readonly: true,
      showDialog: false,
      dialogFormData: {
        Date: [],
      },
      title: "",
      dialogFormRules: {
        projectCode: {
          required: true,
          message: "请输入项目代号",
          trigger: "blur",
        },
        projectName: {
          required: true,
          message: "请输入项目名称",
          trigger: "blur",
        },
        typeCode: {
          required: true,
          message: "请输入分类号",
          trigger: "blur",
        },
        recordsSerialNumber: {
          required: true,
          message: "请输入案卷流水号",
          trigger: "blur",
        },
        recordsName: {
          required: true,
          message: "请输入案卷题名",
          trigger: "blur",
        },
        filingCorpId: {
          required: true,
          message: "请输入立卷单位",
          trigger: "blur",
        },
        filingDate: {
          required: true,
          message: "请选择整编日期",
          trigger: "blur",
        },
        retentionPeriod: {
          required: true,
          message: "请选择保管期限",
          trigger: "change",
        },
        classification: {
          required: true,
          message: "请选择密级",
          trigger: "change",
        },
        Date: {
          required: true,
          message: "请选择卷内文件",
          trigger: "blur",
          type: "array",
          // validator: requiredDateCheck
        },
        // pageNum: {
        //   required: true,
        //   message: "请输入总页数",
        //   trigger: "blur",
        // },
        // docNum: {
        //   required: true,
        //   message: "请输入文字材料页数",
        //   trigger: "blur",
        // },
        // picNum: {
        //   required: true,
        //   message: "请输入图纸张数",
        //   trigger: "blur",
        // },
        backboneWidth: {
          required: true,
          message: "请输入脊背宽度",
          trigger: "blur",
        },
        fileNum: {
          required: true,
          message: "请输入归档份数",
          trigger: "blur",
        },
        fileUserId: {
          required: true,
          message: "请选择整编人",
          trigger: "change",
        },
        fileDate: {
          required: true,
          message: "请选择整编日期",
          trigger: "change",
        },
      },
      retentionPeriodOptions: [
        {
          value: "10年",
          label: "10年",
        },
        {
          value: "30年",
          label: "30年",
        },
        {
          value: "永久",
          label: "永久",
        },
      ],
      classificationOptions: [
        {
          value: "绝密",
          label: "绝密",
        },
        {
          value: "机密",
          label: "机密",
        },
        {
          value: "秘密",
          label: "秘密",
        },
      ],
      fileDialogList: [],
      fileDetail: {},
      showFileDialog: false,
    };
  },
  async mounted() {
    const loading = this.$loading();
    const tableList = localStorage.getItem("tableMultipleSelection");
    localStorage.removeItem("tableMultipleSelection");
    if (tableList) {
      this.tableList = JSON.parse(tableList);
      this.initList(this.tableList);
    }
    const messageEventListener = window.addEventListener(
      "message",
      this.handelMessageEvent
    );
    this.$once("hook:beforeDestroy", () => {
      removeEventListener("message", messageEventListener);
    });
    if (this.$route.query.procTaskId && this.$route.query.page === "todo") {
      // 待办
      await this.getTodoReadBusiness();
    } else if (this.$route.query.page === "fine") {
      this.disabledSignBtn = true;
      await this.getFinishedReadBusiness();
    } else {
      // 发起流程
      this.readonly = false;
    }
    loading.close();
  },
  methods: {
    dateFormat,
    initList(list) {
      list.forEach((item) => {
        const pushData = {
          ajid: {
            value: item.id,
            type: "long",
          },
          ajtm: {
            value: item.recordsName,
            type: "longText",
          },
          hjh: {
            value: "",
            type: "shortText",
          },
        };
        this.formData.ajlb.children.push(structuredClone(pushData));
        this.ajlb.push(pushData);
      });
      this.showReferenceId(this.ajlb);
    },
    deleteFile(row) {
      this.ajlb = this.ajlb.filter((item) => item.id !== row.id);
      this.formData.ajlb = this.ajlb.map((item) => item.id);
    },

    /*接收到父级的消息处理完后返回给父级*/
    beforeSubmit(name) {
      let res = true;
      this.$refs[name].validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    },
    // 验证互见号
    validateHjh() {
      let res = true;
      this.ajlb.forEach((item) => {
        if (!item.hjh.value) {
          res = false;
        }
      });
      return res;
    },
    validateForm() {
      if (!this.beforeSubmit("dataFormRef")) return false;
      if (this.ajlb?.length === 0) {
        this.$message.error("请选择案卷");
        return false;
      }
      if (this.readonly && !this.validateHjh()) {
        // 审核时校验
        this.$message.error("请填写互见号");
        return false;
      }
      return this.formData;
    },
    async getTodoReadBusiness() {
      try {
        const { data, success, message } = await getTodoReadBusiness({
          businessId: this.$route.query.businessId,
          clientType: "web",
          procTaskId: this.$route.query.procTaskId,
        });

        if (!success) {
          this.$message.error("获取待办信息失败：" + message);
          return false;
        }
        this.formData = data.fields;
        this.ajlb = structuredClone(data.fields.ajlb.children);
        this.showReferenceId(this.ajlb);
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取待办信息失败");
        return false;
      }
    },
    async getFinishedReadBusiness() {
      try {
        const { data, success, message } = await getFinishedReadBusiness({
          businessId: this.$route.query.businessId,
          clientType: "web",
        });

        if (!success) {
          this.$message.error("获取已办结信息失败：" + message);
          return false;
        }
        this.formData = data.fields;
        this.ajlb = structuredClone(data.fields.ajlb.children);
        this.showReferenceId(this.ajlb);
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取已办结信息失败");
        return false;
      }
    },
    showReferenceId(list = []) {
      if (Array.isArray(list)) {
        list.forEach((item) => {
          this.getArchiveAdvanceStoreDetail(item.ajid.value).then((data) => {
            this.$set(item, "dh", {
              value: data.reference || "",
              type: "shortText",
            });
          });
        });
      }
    },
    /*向父级发送消息*/
    sendMessage(data, origin) {
      if (window.parent) {
        window.parent.postMessage(data, origin);
      }
    },
    handelMessageEvent(event) {
      const { data } = event;
      // console.log(event);
      if (data.btnKey === "send" || data.btnKey === "submit") {
        if (!this.validateForm()) return;
        const businessId = data.businessId || this.$route.query.businessId;
        const submitData = {};
        Object.keys(this.$options.data().formData).forEach((key) => {
          submitData[key] = this.formData[key];
        });
        if (Array.isArray(submitData.ajlb?.children)) {
          // 去除无关字段,组装案卷列表字段
          submitData.ajlb.children = this.ajlb.map((item) => {
            const data = {};
            ["ajid", "ajtm", "hjh"].forEach((key) => {
              data[key] = {
                value: item[key].value,
                type: item[key].type,
              };
            });
            return data;
          });
        }
        this.sendMessage(
          {
            businessId,
            type: data.type,
            page: data.page,
            btnKey: data.btnKey,
            data: submitData,
            message: "数据已接收",
          },
          event.origin
        );
      }
    },
    // 查询案卷详情
    async getArchiveAdvanceStoreDetail(id) {
      try {
        const { data, success, message } = await getArchiveAdvanceStoreDetail(
          id
        );

        if (!success) {
          this.$message.error("查询案卷详情失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询案卷详情失败");
        return false;
      }
    },
    // 点击查看
    async showRow(row) {
      const res = await this.getArchiveAdvanceStoreDetail(row.ajid.value);
      if (res) {
        this.dialogFormData = res;
        this.dialogFormData.filingDate = res.filingDate
          ? this.dateFormat(res.filingDate)
          : "";
        this.dialogFormData.fileDate = res.fileDate
          ? this.dateFormat(res.fileDate)
          : "";
        this.dialogFormData.Date =
          res.beginDate && res.endDate
            ? [this.dateFormat(res.beginDate), this.dateFormat(res.endDate)]
            : [];
        this.fileList = res.fileStoreList || [];
        this.title = "查看案卷";
        this.showDialog = true;
      }
    },
    handelDialogClose() {
      this.showDialog = false;
    },
    // 查询文件详情
    async getArchiveFileDetail(id) {
      try {
        const { data, success, message } = await getArchiveFileDetail({ id });

        if (!success) {
          this.$message.error("查询文件详情失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询文件详情失败");
        return false;
      }
    },
    async showFileRow(row) {
      const res = await this.getArchiveFileDetail(row.id);
      if (res) {
        this.fileDetail = res;
        this.fileDetail.uploadDate = this.dateFormat(res.uploadDate);
        this.fileDetail.createDate = this.dateFormat(res.createDate);
        this.fileDialogList = res.archiveFileAttachmentVoList || [];
        this.showFileDialog = true;
      }
    },
    async previewFile(fileInfoId, fileName, isDownload = 0) {
      try {
        const { data, success, message } = await getFilePath({
          fileInfoId,
          isDownload,
          fileName: fileName || "",
          fileSchema: 0,
        });
        if (!success) {
          this.$message.error("获取文件下载路径失败：" + message);
          return false;
        }
        window.open(data);
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件下载路径失败");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-pre-archive-frame {
  .enclosure {
    width: 100%;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    span {
      font-weight: 600;
      color: black;
    }
    span:before {
      content: "*";
      color: red;
      margin-right: 4px;
    }
  }
  // 隐藏上传的文件
  /deep/ .el-upload-list {
    display: none;
  }
}
</style>
<style>
body {
  height: auto !important;
}
.user-select .el-dialog {
  margin-top: 0 !important;
}
</style>

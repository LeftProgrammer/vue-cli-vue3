<template>
  <div class="page-add-catalogue-frame">
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="formData"
      label-width="150px"
      :disabled="readonly"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="归档单位技术负责人" prop="gddwjsfzr">
            <UserSelectInput
              v-model="formData.gddwjsfzr.value"
              placeholder="请选择"
              :userName="formData.gddwjsfzr.object?.realName"
              @change="handelValueChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监理档案负责人" prop="jldafzr">
            <UserSelectInput
              v-model="formData.jldafzr.value"
              placeholder="请选择"
              :userName="formData.jldafzr.object?.[0]?.realName"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="监理主管副总监" prop="jlzgfzj">
            <UserSelectInput
              v-model="formData.jlzgfzj.value"
              placeholder="请选择"
              :userName="formData.jlzgfzj.object?.[0]?.realName"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目负责人" prop="xmfzr">
            <UserSelectInput
              v-model="formData.xmfzr.value"
              placeholder="请选择"
              :userName="formData.xmfzr.object?.[0]?.realName"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="档案部门验收人" prop="dabmysr">
            <!-- <UserSelectInput
              v-model="formData.dabmysr.value"
              placeholder="请选择"
              :userName="formData.dabmysr.object?.[0]?.realName"
            /> -->
            <el-select
            v-model="formData.dabmysr.value"
            placeholder="请选择"
            :disabled="readonly"
            style="width:100%"
          >
            <el-option
              v-for="item in dabmysrOptions"
              :key="item.dictId"
              :label="item.dictName"
              :value="item.dictCode"
            >
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="enclosure">
        <span>案卷列表</span>
        <!-- <div>
          <el-button size="small" type="primary" @click="handelAdd">添加</el-button>
        </div> -->
      </div>
    </el-form>
    <el-table :data="ajlb" max-height="280px">
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="ajmc" label="案卷名称" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="showRow(row)">{{
            row.ajmc.value
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ajnfm" label="案卷内封面" align="center">
        <template #default="{ row, $index }">
          <el-button
            type="text"
            @click="previewFile(row.ajnfm.value, '案卷内封面')"
            >案卷内封面</el-button
          >
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="签章"
            placement="bottom"
            v-if="!disabledSignBtn"
          >
            <ntko
              v-if="readonly"
              handSign
              :file="coverToFileType(row, 'ajnfm', '案卷内封面')"
              flowName="flowName"
              :compKey="$index + '_1'"
              :useKeySign="false"
              showDate
              @h5SginCallBack="h5SginCallBack"
            ></ntko>
          </el-tooltip> -->
        </template>
      </el-table-column>
      <el-table-column prop="ajml" label="案卷目录" align="center">
        <template #default="{ row }">
          <el-button
            type="text"
            @click="previewFile(row.ajml.value, '案卷目录')"
            >案卷目录</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="ajnbkb" label="案卷内备考表" align="center">
        <template #default="{ row, $index }">
          <el-button
            type="text"
            @click="previewFile(row.ajnbkb.value, '案卷内备考表')"
            >案卷内备考表</el-button
          >
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="签章"
            placement="bottom"
            v-if="!disabledSignBtn"
          >
            <ntko
              handSign
              :file="coverToFileType(row, 'ajnbkb', '案卷内备考表')"
              flowName="flowName"
              :compKey="$index + '_2'"
              :useKeySign="false"
              showDate
              @h5SginCallBack="h5SginCallBack"
            ></ntko>
          </el-tooltip> -->
        </template>
      </el-table-column>
      <el-table-column prop="wdqzd" label="文档签证单" align="center">
        <template #default="{ row, $index }">
          <el-button
            type="text"
            @click="previewFile(row.wdqzd.value, '文档签证单')"
            >文档签证单</el-button
          >
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="签章"
            placement="bottom"
            v-if="!disabledSignBtn"
          >
            <ntko
              v-if="readonly"
              handSign
              :file="coverToFileType(row, 'wdqzd', '文档签证单')"
              flowName="flowName"
              :compKey="$index + '_3'"
              :useKeySign="false"
              showDate
              @h5SginCallBack="h5SginCallBack"
            ></ntko>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showDialog" :title="title" width="80%" top="0px">
      <el-form
        ref="dialogForm"
        :model="dialogFormData"
        label-width="100px"
        class="dialog-form"
      >
        <el-row v-if="isAdd">
          <el-col :span="12">
            <el-form-item label="档号" prop="reference">
              <el-input v-model="dialogFormData.reference" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属节点" prop="nodeName">
              <el-input v-model="dialogFormData.nodeName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目代号" prop="projectCode">
              <el-input
                v-model="dialogFormData.projectCode"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类号" prop="typeCode">
              <el-input v-model="dialogFormData.typeCode" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="案卷流水号" prop="recordsSerialNumber">
              <el-input
                v-model="dialogFormData.recordsSerialNumber"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="案卷题名" prop="recordsName">
              <el-input v-model="dialogFormData.recordsName" readonly />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="立卷单位" prop="filingCorpId">
              <el-input
                v-model="dialogFormData.filingCorpName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起止日期" prop="Date">
              <el-date-picker
                v-model="dialogFormData.Date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                disabled
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="立卷人" prop="filingUserId">
              <el-input
                v-model="dialogFormData.filingUserName"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="立卷日期" prop="filingDate">
              <el-date-picker
                v-model="dialogFormData.filingDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属合同" prop="contract">
              <el-input
                v-model="dialogFormData.contract"
                readonly
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子项目" prop="project">
              <el-input
                v-model="dialogFormData.project"
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
                v-model="dialogFormData.unitEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分部工程" prop="branchEngineering">
              <el-input
                v-model="dialogFormData.branchEngineering"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="阶段" prop="stage">
              <el-input
                v-model="dialogFormData.stage"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="speciality">
              <el-input
                v-model="dialogFormData.speciality"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保管期限" prop="retentionPeriod">
              <el-input
                v-model="dialogFormData.retentionPeriod"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密级" prop="classification">
              <el-input
                v-model="dialogFormData.classification"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总页数" prop="pageNum">
              <el-input
                v-model="dialogFormData.pageNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="照片张数" prop="picNum">
              <el-input
                v-model="dialogFormData.picNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="脊背宽度" prop="backboneWidth">
              <el-input
                v-model="dialogFormData.backboneWidth"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归档份数" prop="fileNum">
              <el-input
                v-model="dialogFormData.fileNum"
                placeholder="请输入"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="归档单位" prop="fileCorpId">
              <el-input
                v-model="dialogFormData.fileCorpId"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="整编人" prop="fileUserName">
              <el-input
                v-model="dialogFormData.fileUserName"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="整编日期" prop="fileDate">
              <el-input
                v-model="dialogFormData.fileDate"
                placeholder="请输入"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" prop="notes">
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
            <el-button type="text" @click="showFileRow(row)">{{
              row.name
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="文件编号" align="center" />
        <el-table-column
          prop="createCorpName"
          label="形成单位"
          align="left"
          width="120"
        />
        <el-table-column
          prop="createDate"
          label="形成日期"
          align="left"
          width="120"
        >
          <template #default="{ row }">
            {{ dateFormat(row.createDate) }}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">关 闭</el-button>
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
  getAdvanceData,
  getArchiveAdvanceStoreDetail,
  getSentReadBusiness,
  getSfssRole,
  getFinishedReadBusiness,
  getArchiveFileDetail,
  getFilePath,
  getDictList,
  updateSfssForm
} from "@/api/archives.js";
import { mapGetters } from "vuex";
import { dateFormat } from "@/utils";
import UserSelectInput from "@/components/UserSelectInput/index.vue";

export default {
  name: "MultiArchiveFrame",
  components: { UserSelectInput,  },
  computed: {
    ...mapGetters(["loginInfo"]),
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
        dabmysr: { type: "users", value: "" },
        gddwjsfzr: { type: "user", value: "" },
        jldafzr: { type: "users", value: "" },
        jlzgfzj: { type: "users", value: "" },
        xmfzr: { type: "users", value: "" },
        ajlb: {
          children: [],
          type: "children",
          value: "",
        },
        sftgjsfzr: { type: "boolean", value: false },
      },
      rules: {
        // gddwjsfzr: {
        //   required: true,
        //   message: "请选择归档单位技术负责人",
        //   trigger: "change",
        //   validator: requiredCheck,
        // },
        // jldafzr: {
        //   required: true,
        //   message: "请选择监理档案负责人",
        //   trigger: "change",
        //   validator: requiredCheck,
        // },
        // jlzgfzj: {
        //   required: true,
        //   message: "请选择监理主管副总监",
        //   trigger: "change",
        //   validator: requiredCheck,
        // },
        xmfzr: {
          required: true,
          message: "请选择项目负责人",
          trigger: "change",
          validator: requiredCheck,
        },
        dabmysr: {
          required: true,
          message: "请选择档案部门验收人",
          trigger: "change",
          validator: requiredCheck,
        },
      },
      ajlb: [],
      readonly: true,
      showDialog: false,
      dialogFormData: {},
      title: "",
      isAdd: false,
      isSHow: false,
      fileList: [],
      disabledSignBtn: false,
      fileDialogList: [],
      fileDetail: {},
      showFileDialog: false,
      taskStatus: null,
      dabmysrOptions: []
    };
  },
  async mounted() {
    this.getDictList('gdrxx')
    .then(list => {
      if (Array.isArray(list)) {
        this.dabmysrOptions = list.map(item => {
          item.dictCode = item.dictCode.slice(1)
          return item
        });
      }
    });
    const loading = this.$loading();
    const tableList = localStorage.getItem("tableMultipleSelection");
    localStorage.removeItem("tableMultipleSelection");
    const isReadonly = localStorage.getItem("multi_archive_flow_readonly");
    localStorage.removeItem("multi_archive_flow_readonly");
    if (tableList) {
      this.tableList = JSON.parse(tableList);
      const data = await this.getAdvanceData(
        this.tableList.map((item) => item.id)
      );
      this.initList(data);
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
    } else if (isReadonly === "1") {
      this.disabledSignBtn = true;
      await this.getSentReadBusiness();
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
      list.forEach((item, index) => {
        const pushData = {
          xh: {
            value: index,
            type: "integer",
          },
          ajid: {
            value: item.recordId,
            type: "long",
          },
          ajmc: {
            value: item.recordName,
            type: "longText",
          },
          ajml: { value: item.mlAttId, type: "long" },
          ajnbkb: { value: item.bkbAttId, type: "long" },
          ajnfm: { value: item.fmAttId, type: "long" },
          wdqzd: { value: item.qzdAttId, type: "long" },
        };
        this.formData.ajlb.children.push(structuredClone(pushData));
        this.ajlb.push(pushData);
      });
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
    validateForm() {
      if (!this.beforeSubmit("dataFormRef")) return false;
      if (this.ajlb?.length === 0) {
        this.$message.error("请选择案卷");
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
        this.taskStatus = data.task.status;
        this.ajlb = structuredClone(data.fields.ajlb.children);
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
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取已办结信息失败");
        return false;
      }
    },
    async getSentReadBusiness() {
      try {
        const { data, success, message } = await getSentReadBusiness({
          businessId: this.$route.query.businessId,
          clientType: "web",
        });
        if (!success) {
          this.$message.error("获取待办信息失败：" + message);
          return false;
        }
        this.formData = data.fields;
        this.ajlb = structuredClone(data.fields.ajlb.children);

        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取待办信息失败");
        return false;
      }
    },
    async getAdvanceData(ids) {
      try {
        const { data, success, message } = await getAdvanceData(ids);

        if (!success) {
          this.$message.error("获取三方四审文件失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取三方四审文件失败");
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
        this.dialogFormData.Date = res.beginDate
          ? [this.dateFormat(res.beginDate), this.dateFormat(res.endDate)]
          : [];
        this.fileList = res.fileStoreList || [];
        this.title = "查看案卷";
        this.isAdd = false;
        this.isSHow = true;
        this.showDialog = true;
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
    /*向父级发送消息*/
    sendMessage(data, origin) {
      if (window.parent) {
        window.parent.postMessage(data, origin);
      }
    },
    async updateSfssForm(ajlb) {
      try {
        let submitData = []
        if (Array.isArray(ajlb)) {
          
          submitData = ajlb.map((item) => {
            const data = {};
            ["Xh", "Ajid", "Ajmc", "Ajml", "Ajnbkb", "Ajnfm", "Wdqzd","M_BUSINESSID","Id"].forEach(
              (key) => {
                const tranformKey = key === "M_BUSINESSID" ? "M_BUSINESSID" : key.toLowerCase()
                data[`${key === "M_BUSINESSID" ? "mBusinessid" : "s" + key}`] = item[tranformKey].value
              }
            );
             return data
          });
         
        }
        const { data, success, message } = await updateSfssForm(submitData);

        if (!success) {
          this.$message.error("更新三方四审签章失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("更新三方四审签章失败");
        return false;
      }
    },
    async handelMessageEvent(event) {
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
            ["xh", "ajid", "ajmc", "ajml", "ajnbkb", "ajnfm", "wdqzd"].forEach(
              (key) => {
                data[key] = {
                  value: item[key].value,
                  type: item[key].type,
                };
              }
            );
            return data;
          });
        }
        let res = true;
        if (this.taskStatus === 5) {
           res = await this.updateSfssForm(this.ajlb)
        }
        if (!res) return
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
      if (data.btnKey === "return") {
        const businessId = data.businessId || this.$route.query.businessId;
        const submitData = {};
        Object.keys(this.$options.data().formData).forEach((key) => {
          submitData[key] = this.formData[key];
        });
        if (Array.isArray(submitData.ajlb?.children)) {
          // 去除无关字段,组装案卷列表字段
          submitData.ajlb.children = this.ajlb.map((item) => {
            const data = {};
            ["xh", "ajid", "ajmc", "ajml", "ajnbkb", "ajnfm", "wdqzd"].forEach(
              (key) => {
                data[key] = {
                  value: item[key].value,
                  type: item[key].type,
                };
              }
            );
            return data;
          });
        }
        // console.log(submitData,222222);
        this.sendMessage(
          {
            ...event.data,
            data: submitData,
          },
          event.origin
        );
      }
    },
    coverToFileType(row, varName, fileName) {
      return {
        name: fileName, //名称
        url: `/api/file/getFileForApp?fileInfoId=${row[varName].value}`,
        fileId: row[varName].value, //上传服务器上 唯一标识符
        blobType: "pdf", // 预览时候转成blob 的类型
      };
    },
    h5SginCallBack(varData, onSuccess) {
      this.$nextTick(() => {
        // console.info("h5签章回调数据：", varData);
        //文件保存
        if (varData) {
          let varName;
          const index = this.ajlb.findIndex((item) => {
            if (item.ajnfm.value === varData.oldfileid) {
              varName = "ajnfm";
              return true;
            }
            if (item.ajnbkb.value === varData.oldfileid) {
              varName = "ajnbkb";
              return true;
            }
            if (item.wdqzd.value === varData.oldfileid) {
              varName = "wdqzd";
              return true;
            }
            return false;
          });
          this.ajlb[index][varName].value = varData.fileId;
          this.formData.ajlb.children[index][varName].value = varData.fileId;
          if (typeof onSuccess === "function") onSuccess();
          this.$message.success("盖章成功！");
        }
      });
    },
    getCompKey() {
      return `${Math.floor(Math.random() * 10 ** 12)}`;
    },
    async handelValueChange(userId) {
      const res = await this.getSfssRole(userId);
      this.formData.sftgjsfzr.value = res;
    },
    async getSfssRole(userId) {
      const loading = this.$loading();
      try {
        const { data, success, message } = await getSfssRole({ userId });

        if (!success) {
          this.$message.error("查询用户角色失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询用户角色失败");
        return false;
      } finally {
        loading.close();
      }
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
    async getDictList(typeCode) {
      try {
        const { data, success, message } = await getDictList({ typeCode });

        if (!success) {
          this.$message.error("查询字典列表失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询字典列表失败");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-add-catalogue-frame {
  .dialog-form {
    height: 400px;
    overflow: auto;
  }
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

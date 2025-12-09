<template>
  <div class="page-add-catalogue-frame">
    <el-form ref="dataFormRef" :rules="rules" :model="formData" label-width="90px">
      <el-row>
        <el-col :span="12" :xs="24">
          <el-form-item label="编号" prop="bh">
            <el-input v-model="formData.bh.value" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="项目名称及施工单位" prop="xmmcjsgdwa">
            <el-input v-model="formData.xmmcjsgdwa.value" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="申报时间" prop="sbrq">
            <el-date-picker
              v-model="formData.sbrq.value"
              type="datetime"
              value-format="timestamp"
              placeholder="申报时间"
              style="width: 100%"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="指挥中心审批人" prop="zhzxspr">
            <UserSelectInput
              v-model="formData.zhzxspr.value"
              placeholder="请选择"
              :user-name="formData.zhzxspr.object?.realName"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="
            (task.utKey === 'UT_default' && formData.wgbool?.value === 'true') ||
            formData.bpldxzqrr.value
          "
          :span="12"
          :xs="24"
        >
          <el-form-item label="爆破领导小组确认人" prop="bpldxzqrr">
            <UserSelectInput
              v-model="formData.bpldxzqrr.value"
              placeholder="请选择"
              :user-name="formData.bpldxzqrr.object?.realName"
              :disabled="task.utKey !== 'UT_default'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" :xs="24">
          <el-form-item label="爆破作业汇总申请单" prop="qz">
            <el-button
              v-if="pdfData.fileId && formData.bh.value"
              type="text"
              :disabled="false"
              @click="previewFile(pdfData.fileId)"
              >{{ formData.bh.value ? `${formData.bh.value}.pdf` : "" }}</el-button
            >
            <!-- <el-tooltip
              v-if="isShowSignBtn && pdfData.fileId"
              class="item"
              effect="dark"
              content="签章"
              placement="bottom"
            >
              <ntko
                v-if="$route.query.page !== 'fine'"
                hand-sign
                :file="coverToFileType(pdfData.fileId, '案卷内封面')"
                flow-name="flowName"
                comp-key="1_1"
                :use-key-sign="false"
                show-date
                @h5SginCallBack="h5SginCallBack"
              />
            </el-tooltip> -->
            <el-button
              type="text"
              v-if="pdfData.fileId && pdfData.requestRelativeUri"
              @click="handelDownload(pdfData)"
              style="margin-left: 10px"
            >
              下载
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="enclosure">
        <span>汇总列表</span>
        <div v-if="!readonly">
          <el-button size="small" type="primary" @click="handelAddBtnClick"
            >添加</el-button
          >
        </div>
      </div>
    </el-form>
    <el-table :data="formData.hzlb.children" max-height="280px">
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="dw" label="施工单位" align="center">
        <template #default="{ row }">
          {{ row.dw.value }}
        </template>
      </el-table-column>
      <el-table-column prop="bpsj" label="爆破时间" align="center">
        <template #default="{ row }">
          {{ row.bpsj.value }}
        </template>
      </el-table-column>
      <el-table-column prop="bw" label="部位" align="center">
        <template #default="{ row }">
          {{ row.bw.value }}
        </template>
      </el-table-column>
      <el-table-column prop="zzylkg" label="总装药量(kg)" align="center">
        <template #default="{ row }">
          {{ row.zzylkg.value }}
        </template>
      </el-table-column>
      <el-table-column prop="bpfx" label="爆破方向" align="center">
        <template #default="{ row }">
          {{ row.bpfx.value }}
        </template>
      </el-table-column>
      <el-table-column prop="yxfw" label="影响范围" align="center">
        <template #default="{ row }">
          {{ row.yxfw.value }}
        </template>
      </el-table-column>
      <el-table-column prop="jlsptyr" label="监理审批同意人" align="center">
        <template #default="{ row }">
          {{ row.jlsptyr.value }}
        </template>
      </el-table-column>
      <el-table-column
        prop="xcaqfzrjlxfs"
        label="现场安全负责人及联系方式"
        align="center"
      >
        <template #default="{ row }">
          {{ row.xcaqfzrjlxfs.value }}
        </template>
      </el-table-column>
      <el-table-column v-if="!readonly" label="操作" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="handelDeleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showDialog" title="爆破申请表" fullscreen top="0px">
      <TreeTableLayout
        :page="searchData"
        title="汇总列表"
        @pageSizeChange="handelPageSizeChange"
        @pageCurrentChange="handelCurrentChange"
        @query="handelSearchButtonClick"
        @reset="handelResetButtonClick"
      >
        <template slot="form">
          <el-form :model="searchData" :inline="true">
            <el-form-item label="项目名称">
              <el-input v-model="searchData.bdmc" clearable placeholder="请输入" />
            </el-form-item>
            <el-form-item label="施工单位">
              <el-input v-model="searchData.sgdw" clearable placeholder="请输入" />
            </el-form-item>
            <!-- <el-form-item label="爆破日期">
              <el-date-picker
                v-model="searchData.bprq"
                type="date"
                value-format="timestamp"
                placeholder="申报时间"
              />
            </el-form-item>
            <el-form-item label="爆破时间">
              <el-select
                v-model="searchData.bpsj"
                clearable
                placeholder="请选择"
              >
                <el-option label="早晨7：00~7：30" value="早晨7：00~7：30" />
                <el-option
                  label="中午12：00~12：30"
                  value="中午12：00~12：30"
                />
                <el-option label="下午8：00~8：30" value="下午8：00~8：30" />
              </el-select>
            </el-form-item> -->
          </el-form>
        </template>
        <template slot="table">
          <div class="table-wrapper">
            <el-table
              ref="multipleSelectionTable"
              :data="tableData"
              height="100%"
              stripe
              border
              @selection-change="handleTableSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" align="center" width="80" />
              <el-table-column
                prop="mbh"
                show-overflow-tooltip
                label="编号"
                align="left"
              />
              <el-table-column prop="mbpzybw" label="项目名称" align="left" />
              <el-table-column prop="msgdw" label="施工单位" align="left" />
              <el-table-column prop="bpsjfw" label="爆破日期" align="left" />
              <!-- <el-table-column prop="bpsjfw" label="爆破时间" align="left" /> -->
              <el-table-column
                prop="mbpzybwa"
                show-overflow-tooltip
                label="爆破作业部位"
                align="left"
              />
              <el-table-column
                prop="mzygcm"
                show-overflow-tooltip
                label="作业高程(m)"
                align="left"
              />
              <el-table-column prop="mbplx" label="爆破类型" align="left" />
              <el-table-column prop="mzypz" label="炸药品种" align="left" />
              <el-table-column prop="mfsfx" label="飞石方向" align="left" />
              <el-table-column prop="mzzylkg" label="总装药量(kg)" align="left" />
              <el-table-column prop="mbplxr" label="爆破联系人" align="left" />
              <el-table-column
                prop="mbplxrdhstring"
                label="爆破联系人电话"
                align="left"
              />
            </el-table>
          </div>
        </template>
      </TreeTableLayout>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="showDialog = false">关闭</el-button>
        <el-button type="primary" @click="handelConfirmBtnClick">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTodoReadBusiness, getSentReadBusiness } from "@/api/archives.js";
import {
  getBoomPageList,
  getSerialNumber,
  checkSerialNumber,
  createBoomPdf,
  getAttachmentInfo
} from "@/api/blast.js";
import { getFilePath } from "@/api/user.js";

import { mapGetters } from "vuex";
import { dateFormat } from "@/utils";
import UserSelectInput from "@/components/UserSelectInput/index.vue";
// import Ntko from "@/components/Ntko";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import { BaseMixin } from "@/mixins/BaseMixin";
import { fromApp } from "@/utils/index";
export default {
  name: "MultiArchiveFrame",
  components: {
    UserSelectInput,
    // Ntko,
    TreeTableLayout
  },
  computed: {
    ...mapGetters(["loginInfo"])
  },
  mixins: [BaseMixin],
  watch: {
    "formData.sbrq.value": {
      handler: async function (current, prev) {
        if (
          this.formData.xmmcjsgdwa.value &&
          this.formData.sbrq.value &&
          !this.formData.bh.value &&
          !this.formData.qz.value &&
          this.$route.query.page === "mine"
        ) {
          const loading = this.$loading();
          const res = await this.getSerialNumber();
          if (res) {
            await this.createBoomPdf();
          }
          loading.close();
          return;
        }
        if (
          prev &&
          current &&
          current !== prev &&
          this.formData.bh.value &&
          this.formData.xmmcjsgdwa.value
        ) {
          // 修改申报时间
          const loading = this.$loading();
          this.pdfData = {};
          await this.createBoomPdf();
          loading.close();
          return;
        }
        if (!current) {
          // 删除申报时间
          this.pdfData = {};
          this.formData.qz.value = "";
          this.formData.bh.value = "";
          return;
        }
      }
    },
    "formData.hzlb.children": {
      handler: async function (current, prev) {
        if (
          this.formData.xmmcjsgdwa.value &&
          this.formData.sbrq.value &&
          !this.formData.bh.value &&
          !this.formData.qz.value &&
          this.$route.query.page === "mine"
        ) {
          const loading = this.$loading();
          const res = await this.getSerialNumber();
          if (res) {
            await this.createBoomPdf();
          }
          loading.close();
          return;
        }
        if (
          prev.length !== 0 &&
          current.length !== 0 &&
          this.formData.bh.value &&
          this.formData.xmmcjsgdwa.value
        ) {
          // 新增或删除汇总列表
          this.pdfData = {};
          const loading = this.$loading();
          await this.createBoomPdf();
          loading.close();
          return;
        }
        if (current.length === 0) {
          // 汇总列表删除时
          this.formData.xmmcjsgdwa.value = "";
          this.pdfData = {};
          this.formData.qz.value = "";
          this.formData.bh.value = "";
          return;
        }
      }
    }
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
        bh: {
          value: "",
          type: "serial"
        },
        xmmcjsgdwa: {
          value: "",
          type: "longText"
        },
        sbsj: {
          value: "",
          type: "shortText"
        },
        sbrq: {
          type: "date",
          value: null
        },
        zhzxspr: { type: "users", value: "" },
        bpldxzqrr: { type: "users", value: "" },
        hzlb: {
          children: [],
          type: "children",
          value: ""
        },
        qz: {
          value: "",
          type: "rh_h5_sign"
        },

        sftgjsfzr: { type: "boolean", value: false },
        wgbool: { type: "boolean", value: false },
        businessidList: {
          value: "",
          type: "longText"
        }
      },
      rules: {
        sbrq: {
          required: !fromApp(),
          message: "请选择申报时间",
          trigger: "change",
          validator: requiredCheck
        },
        zhzxspr: {
          required: !fromApp(),
          message: "请选择指挥中心审批人",
          trigger: "change",
          validator: requiredCheck
        },
        bpldxzqrr: {
          required: !fromApp(),
          message: "请选择爆破领导小组确认人",
          trigger: "change",
          validator: requiredCheck
        }
      },
      task: {},
      readonly: true,
      showDialog: false,
      tableData: [],
      searchData: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        bdmc: "",
        bprq: "",
        bpsj: "",
        sgdw: ""
      },
      isShowSignBtn: false,
      tableMultipleSelection: [],
      pdfData: {},
      hasSigned: false
    };
  },
  async mounted() {
    const loading = this.$loading();
    const tableList = localStorage.getItem("tableMultipleSelection");
    localStorage.removeItem("tableMultipleSelection");

    const messageEventListener = window.addEventListener(
      "message",
      this.handelMessageEvent
    );
    this.$once("hook:beforeDestroy", () => {
      removeEventListener("message", messageEventListener);
    });
    if (this.$route.query.procTaskId && this.$route.query.page === "todo") {
      this.isShowSignBtn = true;
      // 待办
      await this.getTodoReadBusiness();
    } else if (this.$route.query.page === "fine") {
      this.readonly = true;
      await this.getSentReadBusiness();
    } else {
      this.isShowSignBtn = true;
      // 发起流程
      this.readonly = false;
    }
    loading.close();
    this.resetAppScale();
  },
  methods: {
    resetAppScale() {
      if (!fromApp()) return;
      document.body.style.transform = "scale(1)";
      document.body.classList.toggle("fromapp", false);
    },
    dateFormat,
    /* 接收到父级的消息处理完后返回给父级*/
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
      if (!this.formData.qz.value) {
        this.$message.error("请签章");
        return false;
      }
      if (this.$route.query.page === "todo" && !this.hasSigned) {
        this.$message.error("请签章");
        return false;
      }
      return this.formData;
    },
    async getSerialNumber() {
      try {
        this.isShowSignBtn = false;
        const { data, success, message } = await getSerialNumber();

        if (!success) {
          this.$message.error("获取编号失败：" + message);
          return false;
        }
        this.formData.bh.value = data || "";
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取编号失败");
        return false;
      } finally {
        this.$nextTick(() => {
          this.isShowSignBtn = true;
        });
      }
    },
    async checkSerialNumber() {
      try {
        const { data, success, message } = await checkSerialNumber({
          serialNumber: this.formData.bh.value
        });

        if (!success) {
          this.$message.warning("流水号已过期请重新签章");
          return false;
        }

        return true;
      } catch (err) {
        console.error(err);
        this.$message.error("检查编号失败");
        return false;
      }
    },

    async getBoomPageList() {
      try {
        const { data, success, message } = await getBoomPageList(this.searchData);
        if (!success) {
          this.$message.error("查询列表失败：" + message);
          return false;
        }
        this.tableData = data.records || [];
        this.searchData.total = data.total;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询列表失败");
        return false;
      }
    },
    async createBoomPdf() {
      try {
        const { data, success, message } = await createBoomPdf({
          bh: this.formData.bh.value,
          list: this.formData.hzlb.children.map((item) => ({
            bpfx: item.bpfx.value,
            bpsj: item.bpsj.value,
            bw: item.bw.value,
            dw: item.dw.value,
            jlsptyr: item.jlsptyr.value,
            xcaqfzrjlxfs: item.xcaqfzrjlxfs.value,
            yxfw: item.yxfw.value,
            zzyl: item.zzylkg.value
          })),
          sbsj: this.formData.sbrq.value,
          xmmcjsgdw: this.formData.xmmcjsgdwa.value
        });

        if (!success) {
          this.$message.error("生成pdf签章文件失败：" + message);
          return false;
        }
        this.formData.qz.value = "";
        this.pdfData = data || {};
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("生成pdf签章文件失败");
        return false;
      }
    },
    async getTodoReadBusiness() {
      try {
        const { data, success, message } = await getTodoReadBusiness({
          businessId: this.$route.query.businessId,
          clientType: "web",
          procTaskId: this.$route.query.procTaskId
        });

        if (!success) {
          this.$message.error("获取待办信息失败：" + message);
          return false;
        }
        this.formData = data.fields;
        this.task = data.task;
        if (this.formData.qz.value) {
          await this.getAttachmentInfo(this.formData.qz.value);
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取待办信息失败");
        return false;
      }
    },
    async getAttachmentInfo(attId) {
      try {
        const { data, success, message } = await getAttachmentInfo({
          attId
        });
        if (!success) {
          this.$message.error("获取获取附件信息失败：" + message);
          return false;
        }
        this.pdfData = {
          ...data,
          attId: data.fileId,
          requestRelativeUri: `/api/file/getFileForApp?fileInfoId=${this.formData.qz.value}`
        };
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取获取附件信息失败");
        return false;
      }
    },
    async getSentReadBusiness() {
      try {
        const { data, success, message } = await getSentReadBusiness({
          businessId: this.$route.query.businessId,
          clientType: "web"
        });
        if (!success) {
          this.$message.error("获取已办信息失败：" + message);
          return false;
        }
        this.formData = data.fields;
        if (this.formData.qz.value) {
          await this.getAttachmentInfo(this.formData.qz.value);
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取已办信息失败");
        return false;
      }
    },
    // 点击查看
    async handelAddBtnClick() {
      this.searchData = this.$options.data().searchData;
      this.tableMultipleSelection = this.$options.data().tableMultipleSelection;
      await this.getBoomPageList();
      this.showDialog = true;
    },
    validateTableData(list) {
      if (this.formData.hzlb.children.length > 0 && Array.isArray(list)) {
        const firstChild = this.formData.hzlb.children[0];
        const validateStr = `${this.formData.xmmcjsgdwa.value}-${firstChild.mbpkssj.value}`;
        return list.every(
          (item) =>
            validateStr ===
            `${item.mbpzybw}-${item.msgdw}-${this.dateFormat(item.mbpkssj)}`
        );
      }
      const res = false;
      if (Array.isArray(list)) {
        if (list.length > 1) {
          const name = `${list[0].mbpzybw}-${list[0].msgdw}-${this.dateFormat(
            list[0].mbpkssj
          )}`;
          return list.every(
            (item) =>
              name === `${item.mbpzybw}-${item.msgdw}-${this.dateFormat(item.mbpkssj)}`
          );
        }
        if (list.length <= 1) {
          return true;
        }
      }
      return res;
    },
    async handelConfirmBtnClick() {
      if (!this.validateTableData(this.tableMultipleSelection)) {
        this.$message.error("项目名称及施工单位与爆破日期不一致");
        return;
      }
      if (
        Array.isArray(this.tableMultipleSelection) &&
        this.tableMultipleSelection.length > 0
      ) {
        this.formData.xmmcjsgdwa.value = `${
          this.tableMultipleSelection[0].mbpzybw || ""
        }-${this.tableMultipleSelection[0].msgdw || ""}`;
        // 合并id,避免同一个id多次选中
        const fileIdListMap = this.formData.hzlb.children.reduce((prev, item) => {
          prev[item.mbusinessid.value] = 1;
          return prev;
        }, {});
        this.tableMultipleSelection.forEach((item) => {
          if (!fileIdListMap[item.mbusinessid]) {
            this.formData.hzlb.children.push({
              dw: {
                value: item.msgdw,
                type: "shortText"
              },
              bpsj: {
                value: `${item.bpsjfw}`,
                type: "shortText"
              },
              bw: {
                value: item.mbpzybwa,
                type: "shortText"
              },
              zzylkg: {
                value: item.mzzylkg,
                type: "shortText"
              },
              bpfx: {
                value: item.mfsfx,
                type: "shortText"
              },
              yxfw: {
                value: item.yxfw,
                type: "shortText"
              },
              jlsptyr: {
                value: item.mjldwshr,
                type: "shortText"
              },
              xcaqfzrjlxfs: {
                value: `${item.mbplxr}-${item.mbplxrdhstring}`,
                type: "shortText"
              },
              mbusinessid: {
                value: item.mbusinessid,
                type: "shortText"
              },
              mbpkssj: {
                value: this.dateFormat(item.mbpkssj),
                type: "shortText"
              }
            });
          }
        });
      }
      this.$refs.multipleSelectionTable.clearSelection();
      this.showDialog = false;
    },
    async handelDeleteRow(row) {
      this.formData.hzlb.children = this.formData.hzlb.children.filter(
        (item) => item.mbusinessid.value !== row.mbusinessid.value
      );
    },
    async previewFile(fileInfoId, fileName, isDownload = 0) {
      try {
        const { data, success, message } = await getFilePath({
          fileInfoId,
          isDownload: 0,
          fileName: fileName || "",
          fileSchema: 0
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
    handelDownload(row) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = row.requestRelativeUri;
      a.download =
        `${this.formData.bh.value}.pdf` ||
        "未命名文件" + this.timeFormat(new Date(), "YYYYMMDDHHmmss");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    /* 向父级发送消息*/
    sendMessage(data, origin) {
      if (window.parent) {
        window.parent.postMessage(data, origin);
      }
    },
    async handelMessageEvent(event) {
      const { data } = event;
      // console.log(event);
      if (data.btnKey === "send" || data.btnKey === "submit") {
        if (!this.validateForm()) return;
        if (this.$route.query.page === "mine" && !(await this.checkSerialNumber())) {
          // 流水号过期, 重新获取流水号并签章
          const loading = this.$loading();
          const res = await this.getSerialNumber();
          if (res) {
            await this.createBoomPdf();
          }
          loading.close();
          return;
        }
        const businessId = data.businessId || this.$route.query.businessId;
        const submitData = {};
        Object.keys(this.$options.data().formData).forEach((key) => {
          submitData[key] = this.formData[key];
        });
        const wgbool = this.formData.hzlb.children.some(
          (item) => Number(item.zzylkg.value) >= 1000
        );
        this.sendMessage(
          {
            businessId,
            type: data.type,
            page: data.page,
            btnKey: data.btnKey,
            data: {
              ...submitData,
              wgbool: { type: "boolean", value: wgbool },
              sbsj: {
                type: "shortText",
                value: dateFormat(Number(this.formData.sbrq.value), "YYYY-MM-DD HH:mm")
              },
              sbrq: {
                type: "date",
                value: this.formData.sbrq.value
              },
              businessidList: {
                value:
                  submitData.businessidList.value ||
                  this.formData.hzlb.children
                    .map((item) => item.mbusinessid?.value)
                    .join(),
                type: "longText"
              }
            },
            message: "数据已接收"
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
        this.sendMessage(
          {
            ...event.data,
            data: submitData
          },
          event.origin
        );
      }
    },
    coverToFileType(fileId, fileName) {
      return {
        name: fileName, // 名称
        url: `/api/file/getFileForApp?fileInfoId=${fileId}`,
        fileId: fileId, // 上传服务器上 唯一标识符
        blobType: "pdf" // 预览时候转成blob 的类型
      };
    },
    h5SginCallBack(varData, onSuccess) {
      this.$nextTick(() => {
        // 文件保存
        if (varData) {
          // console.log(varData);
          this.pdfData.requestRelativeUri = `/api/file/getFileForApp?fileInfoId=${varData.fileId}`;
          this.pdfData.fileId = varData.fileId;
          this.formData.qz.value = varData.fileId;
          if (typeof onSuccess === "function") onSuccess();
          this.$message.success("盖章成功！");
          if (this.$route.query.page === "todo") {
            this.hasSigned = true;
          }
        }
      });
    },
    handelPageSizeChange(page) {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = page.pageSize;
      this.getBoomPageList();
    },
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.getBoomPageList();
    },
    handelSearchButtonClick() {
      this.searchData.pageNum = 1;
      this.searchData.nodeId = "";
      this.getBoomPageList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.queryData = metaData.queryData;
      // this.searchData.nodeId = this.selectionNode.id;
      this.searchData.nodeId = "";
      this.getBoomPageList();
    },
    handleTableSelectionChange(val) {
      this.tableMultipleSelection = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.page-add-catalogue-frame {
  .dialog-form {
    height: 400px;
    overflow: auto;
  }
  .table-wrapper {
    height: 100%;
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
  @media screen and (max-width: 768px) {
    .el-form {
      .el-form-item {
        display: flex;
        align-items: center;
        /deep/ {
          .el-form-item__label {
            text-align: justify;
            text-align-last: justify;
            line-height: 1.2;
          }
          .el-form-item__content {
            flex: 1;
            margin-left: 0 !important;
          }
        }
      }
    }
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

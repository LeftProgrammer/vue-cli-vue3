<template>
  <div class="page-data-maintenance-request-frame">
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="formData"
      label-width="130px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="维护文件" prop="whwj">
            <el-input
              v-model="formData.whwjm.value"
              placeholder="请选择"
              readonly
              @click.native="handelFlowSelect"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维护类型" prop="whsjlx">
            <el-select
              v-model="formData.whsjlx.value"
              clearable
              placeholder="请选择"
              style="width: 100%"
              :disabled="readonly"
              @change="handelSelectChange"
            >
              <el-option
                v-for="item in dataTypeList"
                :key="item.dictName"
                :label="item.dictName"
                :value="item.dictName"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="修改内容" prop="xgnr">
            <el-input
              v-model="formData.xgnr.value"
              type="textarea"
              rows="3"
              placeholder="请输入"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="修改原因" prop="xgyy">
            <el-input
              v-model="formData.xgyy.value"
              type="textarea"
              rows="3"
              placeholder="请输入"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="businessList.length > 1">
          <el-form-item label="流程业务" prop="ywid">
            <el-select
              v-model="formData.ywid.value"
              clearable
              placeholder="请选择"
              style="width: 100%"
              :disabled="readonly"
            >
              <el-option
                v-for="item in businessList"
                :key="item.businessId"
                :label="item.name"
                :value="item.businessId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="流程表单" prop="lcbd">
            <el-row :gutter="4">
              <el-col :span="16">
                <el-input
                  class="input--pointer"
                  v-model="formData.lcbdm.value"
                  placeholder="请编辑"
                  readonly
                  @click.native="
                    handlePreview({
                      id: formData.lcbd.value,
                      name: formData.lcbdm.value,
                    })
                  "
                  :disabled="(!selectedFlow?.id || !formData.ywid?.value)   &&  $route.query.page !== 'wait'"
                />
              </el-col>
              <el-col :span="4">
                <el-button
                  @click="handelEditButtonClick"
                  :disabled="(!selectedFlow?.id || !formData.ywid?.value)   &&  $route.query.page !== 'wait'"
                  >编辑</el-button
                >
              </el-col>
              <el-col :span="2" v-if="formData.lcbd.value && !readonly">
                <!-- <ntko
                  handSign
                  :file="coverToFileType()"
                  flowName="flowName"
                  :compKey="getCompKey()"
                  :useKeySign="false"
                  showDate
                  @h5SginCallBack="h5SginCallBack"
                  v-if="!readonly || showSignButton"
                ></ntko> -->
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <el-col :span="22">
          <el-form-item label="正文" prop="zw" v-if="showZwUpload">
            <!-- <el-upload
              action="/api/file/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove.bind(this, 'zw')"
              :before-remove="beforeRemove"
              :before-upload="beforeUpload"
              :on-success="handelUploadSuccess.bind(this, 'zw')"
              :file-list="zwList"
              :limit="1"
              :on-exceed="handleExceed"
              :disabled="readonly"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload> -->
            <uploadFile
              :readonly="readonly || $route.query.page === 'fine'"
              v-model="formData.zw.value"
              :limit="1"
              showNtko
              @changeNtkoFile="(event) => handelSigned('zw', event)"
            >
            </uploadFile>
          </el-form-item>
        </el-col>
        <el-col :span="22" v-if="showFjUpload">
          <el-form-item label="附件" prop="fj">
            <!-- <el-upload
              action="/api/file/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove.bind(this, 'fj')"
              :before-remove="beforeRemove"
              :before-upload="beforeUpload"
              :on-success="handelUploadSuccess.bind(this, 'fj')"
              :file-list="fjList"
              :on-exceed="handleExceed"
              :disabled="readonly"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              
            </el-upload> -->
            <uploadFile
              :readonly="readonly || $route.query.page === 'fine'"
              v-model="formData.fj.value"
              showNtko
              @changeNtkoFile="(event) => handelSigned('fj', event)"
            >
            </uploadFile>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="单位负责人" prop="dwfzr">
            <UserSelectInput
              v-model="formData.dwfzr.value"
              placeholder="请选择"
              :userName="formData.dwfzr.object?.realName"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发起单位文秘" prop="fqdwwm">
            <UserSelectInput
              v-model="formData.fqdwwm.value"
              placeholder="请选择"
              :userName="formData.fqdwwm.object?.realName"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="procTaskName === '监理单位文秘' || formData.jldw.value"
        >
          <el-form-item label="监理单位" prop="jldw">
            <UserSelectInput
              v-model="formData.jldw.value"
              placeholder="请选择"
              :userName="formData.jldw.object?.realName"
              :disabled="readonly && procTaskName !== '监理单位文秘'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监理单位文秘" prop="jldwwm">
            <UserSelectInput
              v-model="formData.jldwwm.value"
              placeholder="请选择"
              :userName="formData.jldwwm.object?.realName"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="procTaskName === '业主单位文秘' || formData.yzdw.value"
        >
          <el-form-item label="业主单位负责人" prop="yzdw">
            <UserSelectInput
              v-model="formData.yzdw.value"
              placeholder="请选择"
              :userName="formData.yzdw.object?.realName"
              :disabled="readonly && procTaskName !== '业主单位文秘'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业主单位文秘" prop="yzdwwm">
            <UserSelectInput
              v-model="formData.yzdwwm.value"
              placeholder="请选择"
              :userName="formData.yzdwwm.object?.realName"
              :disabled="readonly"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      class="dialog-body-np"
      title="责任单位"
      :visible.sync="showCorSelectDialog"
      append-to-body
      width="800px"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <CorSelect
        v-if="showCorSelectDialog"
        single
        @childEvt="handelCorpSelect"
      />
    </el-dialog>
    <el-dialog
      class="flow-select-dialog"
      title="流程表单"
      :visible.sync="showFlowSelectDialog"
      append-to-body
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      fullscreen
    >
      <CatalogueMaintenance @current-change="handelCurrentChange" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="showFlowSelectDialog = false">取 消</el-button>
        <el-button type="primary" @click="handelFlowSelectDialogConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="流程处理表单"
      custom-class="wbench-el-dialog flow-dialog"
      :visible.sync="flowShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      center
      fullscreen
      @closed="handleClosed"
      :before-close="beforeClosedDialog"
    >
      <SzgcProcessGetor
        ref="SzgcProcessGetor"
        v-if="flowShow"
        :top-show="false"
        :page="detailStatus"
        :dataAll="dataAll"
        @childEvt="childEvtHandle"
      ></SzgcProcessGetor>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flowShow = false">取 消</el-button>
        <el-button type="primary" @click="handelFlowDialogConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import UserSelectInput from "@/components/UserSelectInput/index.vue";
import CorSelect from "@/components/CorSelect/index";
import CatalogueMaintenance from "./catalogue_maintenance";
import { SzgcProcessGetor } from "@szgc/wbench";
import {
  makePdfByForm,
  getFilePath,
  getSentReadBusiness,
  getTodoReadBusiness,
  getWaitReadBusiness,
  getBusinessList,
  getBusinessType,
  getDictList
} from "@/api/archives.js";
const DataMaintenanceRequestFrame = defineComponent({
  name: "DataMaintenanceRequestFrame",
  components: {
    CorSelect,
    UserSelectInput,
    CatalogueMaintenance,
    SzgcProcessGetor,
  },
  data() {
    const requiredCheck = (rule, value, callback) => {
      if (!value.value) {
        return callback(new Error("请输入"));
      }
      callback();
    };
    return {
      readonly: true,
      formData: {
        whwj: {
          type: "code",
          value: "",
        },
        ywid: {
          type: "code",
          value: "",
        },
        zw: {
          type: "longText",
          value: "",
        },
        fj: {
          type: "longText",
          value: "",
        },
        zwm: {
          type: "longText",
          value: "",
        },
        fjm: {
          type: "longText",
          value: "",
        },
        dwgc: {
          type: "shortText",
          value: null,
        },
        whsjlx: {
          type: "shortText",
          value: null,
        },
        whsjlxzd: {
          type: "dictionary",
          value: null,
        },
        xgyy: {
          type: "longText",
          value: null,
        },
        xgnr: {
          type: "longText",
          value: null,
        },
        ssjd: {
          type: "shortText",
          value: null,
        },
        dwfzr: {
          type: "users",
          value: "",
        },
        jldw: {
          type: "users",
          value: "",
        },
        yzdw: {
          type: "users",
          value: "",
        },
        fqdwwm: {
          type: "users",
          value: "",
        },
        jldwwm: {
          type: "users",
          value: "",
        },
        yzdwwm: {
          type: "users",
          value: "",
        },
        lcbd: {
          type: "long",
          value: null,
        },
        lcbdm: {
          type: "shortText",
          value: null,
        },
        whwjm: {
          type: "longText",
          value: null,
        },
      },
      zwList: [],
      fjList: [],
      rules: {
        whwj: {
          required: true,
          message: "请输入维护文件",
          trigger: "change",
          validator: requiredCheck,
        },
        whsjlx: {
          required: true,
          message: "请选择数据维护类型",
          trigger: "change",
          validator: requiredCheck,
        },
        xgnr: {
          required: true,
          message: "请选择修改内容",
          validator: requiredCheck,
        },
        xgyy: {
          required: true,
          message: "请输入修改原因",
          validator: requiredCheck,
        },
        // zw: {
        //   required: true,
        //   message: "请上传文件",
        //   trigger: "change",
        // },
        dwfzr: {
          required: true,
          message: "请选择单位负责人",
          validator: requiredCheck,
        },
        yzdw: {
          required: true,
          message: "请选择业主单位",
          validator: requiredCheck,
        },
        fqdwwm: {
          required: true,
          message: "请选择发起单位文秘",
          validator: requiredCheck,
        },
        yzdwwm: {
          required: true,
          message: "请选择业主单位文秘",
          validator: requiredCheck,
        },
        jldw: {
          required: true,
          message: "请选择监理单位",
          validator: requiredCheck,
        },
        lcbd: {
          required: true,
          message: "请选择流程表单",
          validator: requiredCheck,
        },
        ywid: {
          required: true,
          message: "请选择流程业务",
          validator: requiredCheck,
        },
      },
      showCorSelectDialog: false,
      dataTypeList: [],

      showFlowSelectDialog: false,
      selectedFlow: {},
      currentSelected: null,
      flowShow: false,
      detailStatus: "mine",
      dataAll: {
        businessId: "",
        taskId: "",
      },
      packageId: "1224376020367310848",
      flowPageType: "mine",
      hasSigned: false,
      showSignButton: false,
      businessList: [],
      showZwUpload: false,
      showFjUpload: false,
      procTaskName: "",
    };
  },
  async mounted() {
    const loading = this.$loading();
    this.getDictList('whlx')
    .then(list => {
      if (Array.isArray(list)) {
        this.dataTypeList = list;
      }
    });
    const messageEventListener = window.addEventListener(
      "message",
      this.handelMessageEvent,
      false
    );
    this.$once("hook:beforeDestroy", function () {
      removeEventListener("message", messageEventListener);
    });

    if (this.$route.query.procTaskId && this.$route.query.page === "todo") {
      // 待办
      await this.getTodoReadBusiness();
      await this.getBusinessType(this.formData.whwj.value);
    } else if (this.$route.query.page === "wait") {
      this.readonly = false;
      await this.getWaitReadBusiness();
      await this.getBusinessType(this.formData.whwj.value);
    }  else if (this.$route.query.page === "fine") {
      this.readonly = true;
      this.disabledSignBtn = true;
      await this.getSentReadBusiness();
      await this.getBusinessType(this.formData.whwj.value);
    } else {
      // 发起流程
      this.readonly = false;
    }
    
    loading.close();
    if (this.$route.query.page === "todo") {
      this.showSignButton = true;
    }
  },
  beforeDestroy() {
    window.handelCurrentChange = null;
    window.handelFlowSelectDialogConfirm = null;
    window.makePdfByForm = null;
  },
  methods: {
    handelCreateCorpClick(name) {
      this.corpVar = name;
      this.showCorSelectDialog = true;
    },
    handelCorpSelect({ data }) {
      this.showCorSelectDialog = false;
      this.formData[`${this.corpVar}Name`] = data?.length
        ? data[0].corpName
        : "";
      this.formData[this.corpVar].value = data?.length ? data[0].corpId : "";
    },
    /*向父级发送消息*/
    sendMessage(data, origin) {
      if (window.parent) {
        window.parent.postMessage(data, origin);
      }
    },
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
      return this.formData;
    },
    handelMessageEvent(event) {
      const { data } = event;
      if (data.btnKey === "send" || data.btnKey === "submit" || data.btnKey === "save") {
        if (!this.validateForm()) return;
        const businessId = data.businessId || this.$route.query.businessId;
        const submitData = {};
        Object.keys(this.$options.data().formData).forEach((key) => {
          submitData[key] = this.formData[key];
        });
        if (submitData.zw.value) {
          // 将zw里面的singed重置为false，以便下一步重新签名
          const zw = JSON.parse(submitData.zw.value).map((item) => {
            item.signed = false;
            return item;
          });
          submitData.zw.value = JSON.stringify(zw);
        }
        if (submitData.fj.value) {
          // 将fj里面的singed重置为false，以便下一步重新签名
          const fj = JSON.parse(submitData.fj.value).map((item) => {
            item.signed = false;
            return item;
          });
          submitData.fj.value = JSON.stringify(fj);
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
        return;
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
            data: submitData,
          },
          event.origin
        );
        return;
      }
      if (data.type === "maintenance") {
        this.makePdfByForm(data.data);
        this.flowShow = false;
        return;
      }
    },
    beforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 < 500;
      if (!isRightSize) {
        this.$message.error("文件大小超过 500MB");
      }
      return isRightSize;
    },
    // 文件上传成功
    async handelUploadSuccess(varName, res) {
      this[`${varName}List`].push({
        name: res.data.fileName,
        id: res.data.fileId,
      });
      this.formData[`${varName}`].value = (
        this.formData[`${varName}`].value || ""
      )
        .split(",")
        .filter(Boolean)
        .concat([res.data.fileId])
        .join();
      this.formData[`${varName}m`].value = (
        this.formData[`${varName}m`].value || ""
      )
        .split(",")
        .filter(Boolean)
        .concat([res.data.fileName])
        .join();
    },
    // 上传文件失败
    fileError(err) {
      this.$message.error("上传失败：" + err.message);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    async handlePreview(file) {
      if (!file.id) {
        return;
      }
      // window.open(`/api/file/getFileForApp?fileInfoId=${file.attId}`, "_blank");
      try {
        const { data, success, message } = await getFilePath({
          fileInfoId: file.id,
          isDownload: 0,
          fileName: file.name || "",
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
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(varName, file) {
      this[`${varName}List`] = this[`${varName}List`].filter(
        (item) => item.id !== file.id
      );
      this.formData[`${varName}`].value = (
        this.formData[`${varName}`].value || ""
      )
        .split(",")
        .filter(Boolean)
        .filter((item) => item.id !== file.id)
        .join();
      this.formData[`${varName}m`].value = (
        this.formData[`${varName}m`].value || ""
      )
        .split(",")
        .filter(Boolean)
        .filter((item) => item.name !== file.name)
        .join();
    },
    h5SginCallBack(varData, onSuccess) {
      this.$nextTick(() => {
        // console.info("h5签章回调数据：", varData);
        //文件保存
        if (varData) {
          this.formData.lcbd.value = varData.fileId;
          if (typeof onSuccess === "function") onSuccess();
          this.$message.success("盖章成功！");
          this.hasSigned = true;
        }
      });
    },
    getCompKey() {
      return `${Math.floor(Math.random() * 101)}`;
    },
    coverToFileType() {
      return {
        name: this.formData.lcbdm.value, //名称
        url: `/api/file/getFileForApp?fileInfoId=${this.formData.lcbd.value}`,
        fileId: this.formData.lcbd.value, //上传服务器上 唯一标识符
        blobType: this.formData.lcbdm.value.split(".").pop(), // 预览时候转成blob 的类型
      };
    },
    handelFlowSelect() {
      this.currentSelected = null;
      // this.showFlowSelectDialog = true;
      const resolved = this.$router.resolve({
        name: "CatalogueMaintenanceFrame",
      });
      // console.log(resolved);
      const childWindow = window.open(resolved.href);
      window.handelCurrentChange = this.handelCurrentChange.bind(this);
      window.handelFlowSelectDialogConfirm =
        this.handelFlowSelectDialogConfirm.bind(this);
      // window.open()
    },
    handelFlowSelectDialogConfirm() {
      if (!this.currentSelected?.id) {
        this.$message.warning("请选择要维护的文件！");
        return;
      }
      this.showFlowSelectDialog = false;
      this.selectedFlow = structuredClone(this.currentSelected);
      this.formData.whwj.value = this.selectedFlow.id;
      this.formData.whwjm.value = this.selectedFlow.name;
      
      // this.zwList = [];
      // this.fjList = [];
      this.formData.fj.value = "";
      this.formData.zw.value = "";
      this.formData.lcbd.value = null;
      this.formData.lcbdm.value = null;
      this.formData.ywid.value = "";
      this.getBusinessList(this.selectedFlow.id);
      this.getBusinessType(this.formData.whwj.value);
    },
    handelCurrentChange(row) {
      console.log(structuredClone(row));
      this.currentSelected = row;
    },
    handelEditButtonClick() {
      // this.flowShow = true;
      console.log(this.formData);
      
      this.dataAll.businessId =
        this.formData.ywid.value || this.selectedFlow.businessId;
      this.detailStatus = "fine";
      const resolved = this.$router.resolve({
        name: "MimicryProcess",
        query: {
          businessId: this.formData.ywid.value || this.selectedFlow.businessId,
          detailStatus: "fine",
        },
      });
      // console.log(resolved);
      const childWindow = window.open(resolved.href);
      window.makePdfByForm = this.makePdfByForm.bind(this);
      // localStorage.setItem("catalogue_flow_readonly", "1");
      /**
       * @description 修复嵌套iframe的问题
       * @example https://www.bryanbraun.com/2021/03/24/infinitely-nested-iframes/
       */
      // const fixedNestedIframe = () => {
      //   const iframe = this.$refs.SzgcProcessGetor.$el.querySelector("iframe");
      //   if (!iframe) {
      //     requestAnimationFrame(fixedNestedIframe);
      //   } else {
      //     const src = iframe.src;
      //     this.iframe = iframe;
      //     if (src) {
      //       const urlInstance = new URL(src);
      //       const hash = urlInstance.hash;
      //       const hashArr = hash.split("?");
      //       const newQuery = hashArr.reverse().join("");
      //       iframe.src = `${urlInstance.origin}/?${newQuery}?${hashArr[0]}&maintenance=1`;
      //       iframe.addEventListener("load", () => {
      //         // 解决窗口过小，各个元素的显示问题
      //         iframe.contentWindow.document.querySelector("html").style.zoom =
      //           "0.9";
      //       });
      //     }

      //     return;
      //   }
      // };
      // requestAnimationFrame(fixedNestedIframe);
    },
    beforeClosedDialog(done) {
      done();
    },
    handleClosed() {
      this.flowShow = false;
    },
    childEvtHandle() {
      this.flowShow = false;
      // this.handelSearchButtonClick();
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
        this.procTaskName = data.task.procTaskName;
        // const zwNameList = data.fields.zwm.value.split(",").filter(Boolean);
        // this.zwList = data.fields.zw.value
        //   .split(",")
        //   .filter(Boolean)
        //   .map((item, index) => ({
        //     name: zwNameList[index],
        //     id: item,
        //   }));
        // const fjNameList = data.fields.fjm.value.split(",").filter(Boolean);
        // this.fjList = data.fields.fj.value
        //   .split(",")
        //   .filter(Boolean)
        //   .map((item, index) => ({
        //     name: fjNameList[index],
        //     id: item,
        //   }));
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取待办信息失败");
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
        // const zwNameList = data.fields.zwm.value.split(",").filter(Boolean);
        // this.zwList = data.fields.zw.value
        //   .split(",")
        //   .filter(Boolean)
        //   .map((item, index) => ({
        //     name: zwNameList[index],
        //     id: item,
        //   }));
        // const fjNameList = data.fields.fjm.value.split(",").filter(Boolean);
        // this.fjList = data.fields.fj.value
        //   .split(",")
        //   .filter(Boolean)
        //   .map((item, index) => ({
        //     name: fjNameList[index],
        //     id: item,
        //   }));
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取待办信息失败");
        return false;
      }
    },
    async getWaitReadBusiness() {
      try {
        const { data, success, message } = await getWaitReadBusiness({
          businessId: this.$route.query.businessId,
          clientType: "web",
        });
        if (!success) {
          this.$message.error("获取待发信息失败：" + message);
          return false;
        }
        this.formData = data.fields;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取待发信息失败");
        return false;
      }
    },
    sendMessageToChildIFrame() {
      if (window.frames) {
        this.iframe.contentWindow.postMessage(
          {
            btnKey: "maintenance",
            type: "maintenance",
          },
          this.iframe.src
        );
      }
    },
    handelFlowDialogConfirm() {
      this.sendMessageToChildIFrame();
    },
    async makePdfByForm(submitData) {
      const loading = this.$loading();
      try {
        const { data, success, message } = await makePdfByForm({
          data: JSON.stringify(submitData),
          businessId: this.formData.ywid.value || this.selectedFlow.businessId,
        });

        if (!success) {
          this.$message.error("生成表单数据失败：" + message);
          return false;
        }
        // this.zwList = data.zw || [];
        // this.fjList = data.fj || [];
        // this.formData.zw.value = data.zw?.map((item) => item.id).join() || "";
        // this.formData.fj.value = data.fj?.map((item) => item.id).join() || "";
        // this.formData.zwm.value =
        //   data.zw?.map((item) => item.name).join() || "";
        // this.formData.fjm.value =
        //   data.fj?.map((item) => item.name).join() || "";
        this.formData.zw.value = JSON.stringify(
          data.zw?.map((item) => ({
            fileId: item.id,
            name: item.name,
            blobType: item.name.split(".").pop(),
          })) || []
        );
        this.formData.fj.value = JSON.stringify(
          data.fj?.map((item) => ({
            fileId: item.id,
            name: item.name,
            blobType: item.name.split(".").pop(),
          })) || []
        );
        // console.log(this.formData.fj.value,this.formData.zw.value);
        this.formData.lcbd.value = data.pdfid;
        this.formData.lcbdm.value = data.pdfname;
        this.hasSigned = false;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("生成表单数据失败");
        return false;
      } finally {
        loading.close();
      }
    },
    async getBusinessList(id) {
      try {
        this.businessList = [];
        const { data, success, message } = await getBusinessList({
          id,
        });
        if (!success) {
          this.$message.error("获取文件业务失败：" + message);
          return false;
        }
        this.businessList = data;
        if (data.length === 1) {
          this.formData.ywid.value = data[0].businessId;
        }

        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件业务失败");
        return false;
      }
    },
    async getBusinessType(id) {
      if (!id) return;
      try {
        const { data, success, message } = await getBusinessType({
          id,
        });
        if (!success) {
          this.$message.error("获取文件业务是否需要附件失败：" + message);
          return false;
        }
        this.showZwUpload = data.zw;
        this.showFjUpload = data.fj;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件业务是否需要附件失败");
        return false;
      }
    },
    handelSigned(type, fileData) {
      this.formData[type].value = fileData;
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
    handelSelectChange(dictName) {
      this.formData.whsjlxzd.value = `whlx:${this.dataTypeList.find(item => item.dictName === dictName)?.dictCode}`;      
    }
  },
});
export default DataMaintenanceRequestFrame;
</script>

<style lang="scss" scoped>
.page-data-maintenance-request-frame {
  .input--pointer {
    /deep/ input {
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
body {
  height: auto !important;
}
.user-select .el-dialog {
  margin-top: 0 !important;
}
.el-dialog:has(.modal-main) {
  margin-top: 0 !important;
}
.flow-select-dialog {
  .el-dialog__body {
    height: calc(100% - 140px);
  }
}
/deep/ .flow-dialog {
  min-width: 1800px;
  min-height: 900px;
}

.wbench-el-dialog.is-fullscreen {
  .el-dialog__body {
    height: calc(100% - 45px);
  }
}
</style>

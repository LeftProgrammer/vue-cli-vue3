<template>
  <div class="page-add-catalogue-frame">
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="formData"
      label-width="100px"
      :disabled="readonly"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="文号" prop="wjbh">
            <el-input v-model="formData.wjbh.value" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属节点">
            <el-input v-model="formData.ssjdmc.value" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="文件题名" prop="wjtm">
            <el-input
              v-model="formData.wjtm.value"
              placeholder="请输入"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="印发日期" prop="wjtm">
            <el-input
              v-model="formData.wjtm.value"
              placeholder="请输入"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="责任单位" prop="xcdw">
            <el-input
              v-model="formData.xcdwName"
              placeholder="请输入"
              readonly
              @click.native="handelCreateCorpClick('xcdw')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成文日期" prop="xcrq">
            <!-- <el-input v-model="formData.createTime" placeholder="请输入" /> -->
            <el-date-picker
              v-model="formData.xcrq.value"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="版本号" prop="bbh">
            <el-input v-model="formData.bbh.value" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传日期" prop="scrq">
            <el-date-picker
              v-model="formData.scrq.value"
              type="date"
              value-format="timestamp"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属合同" prop="ssht">
            <el-input v-model="formData.ssht.value" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="子项目" prop="zxm">
            <el-input v-model="formData.zxm.value" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位工程" prop="dwgc">
            <el-input v-model="formData.dwgc.value" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分部工程" prop="fbgc">
            <el-input v-model="formData.fbgc.value" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="备注" prop="bz">
            <el-input
              v-model="formData.bz.value"
              type="textarea"
              rows="3"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上传单位" prop="wjly">
            <!-- <el-input
              v-model="formData.wjlyName"
              placeholder="请输入"
              readonly
              @click.native="handelCreateCorpClick('wjly')"
            /> -->
            <el-select
              v-model="formData.wjly.value"
              placeholder="请选择上传单位"
              style="width: 100%"
              :disabled="corpOptions.length <= 1"
            >
              <el-option
                v-for="item in corpOptions"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核人" prop="shr">
            <UserSelectInput
              v-model="formData.shr.value"
              placeholder="请选择"
              :user-name="formData.shr.object?.[0].realName"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="页数" prop="ys">
            <el-input-number
              v-model.number="formData.ys.value"
              :precision="0"
              :step="1"
              :min="0"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文字材料页数" prop="wzclys">
            <el-input-number
              v-model.number="formData.wzclys.value"
              :precision="0"
              :step="1"
              :min="0"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图纸张数" prop="tzzs">
            <el-input-number
              v-model.number="formData.tzzs.value"
              :precision="0"
              :step="1"
              :min="0"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-row>
      <div class="enclosure">
        <span>附件列表</span>
        <div>
          <!-- <el-button>新增</el-button> -->
          <el-upload
            class="upload-demo"
            action="/api/file/upload"
            :on-success="fileSuccess"
            :on-error="fileError"
            :on-progress="fileProgress"
            multiple
            :file-list="fjlb"
            :disabled="uploading"
          >
            <el-button size="small" type="primary" :loading="uploading">{{
              uploading ? "上传中(" + uploadPercentage + "%)" : "点击上传"
            }}</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
      </div>
    </el-form>
    <el-table :data="fjlb" max-height="280px">
      <el-table-column label="序号" align="center">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="fjmc" label="附件名称" align="center">
        <template #default="{ row }">
          <el-button
            type="text"
            :title="row.fjmc.value"
            @click="previewFile(row.fjid.value, row.fjmc.value)"
          >{{ row.fjmc.value }}</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="scr" label="上传人" align="center">
        <template #default="{ row }">
          <!-- <UserSelectInput
            v-model="row.scr.value"
            :disabled="readonly"
            :userName="row.scr.object?.realName"
            placeholder="请选择"
          /> -->{{ row.scr.object?.realName }}
        </template>
      </el-table-column>

      <el-table-column prop="scrqfj" label="上传日期" align="center">
        <template #default="{ row }">
          {{ dateFormat(row.scrqfj) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="lx" label="类型" align="center">
        <template #default="{ row }">
          <el-select
            v-model="row.lx.value"
            placeholder="请选择"
            :disabled="readonly"
          >
            <el-option
              v-for="item in lxOptions"
              :key="item.dictId"
              :label="item.dictName"
              :value="item.typeCode + ':' + item.dictCode"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="200">
        <template #default="{ row, $index }">
          <div class="table-btn">
            <el-button v-if="!readonly" type="text" @click="deleteFile(row)">删除</el-button>
            <el-button
              v-if="!readonly"
              type="text"
              :disabled="$index === 0"
              @click="moveUpFileAttachment(row.fjid.value)"
            >上移</el-button>
            <el-button
              v-if="!readonly"
              type="text"
              :disabled="$index + 1 === fjlb.length"
              @click="moveDownFileAttachment(row.fjid.value)"
            >下移</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      class="dialog-body-np"
      title="责任单位"
      :visible.sync="modalShow"
      append-to-body
      width="800px"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <CorSelect v-if="modalShow" single @childEvt="modalEvt" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getTodoReadBusiness,
  getDictList,
  getSentReadBusiness,
  getFilePath,
  getPageInfo,
  findUserBelongToList,
} from "@/api/archives.js";
import CorSelect from "@/components/CorSelect/index";
import { mapGetters } from "vuex";
import { dateFormat } from "@/utils";
// import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import UserSelectInput from "@/components/UserSelectInput/index.vue";
export default {
  name: "AddCatalogueFrame",
  components: { CorSelect, UserSelectInput, },
  // mixins: [FlowFormMixin],
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
        shr: {
          type: "users",
          value: "",
        },
        wjly: {
          type: "corporate",
          value: "",
        },
        fjlb: {
          children: [],
          type: "children",
          value: "",
        },
        dwgc: {
          type: "shortText",
          value: null,
        },
        ssjdmc: {
          type: "shortText",
          value: null,
        },
        zxm: {
          type: "longText",
          value: null,
        },
        ssht: {
          type: "longText",
          value: null,
        },
        bbh: {
          type: "shortText",
          value: null,
        },
        scrq: {
          type: "date",
          value: new Date().getTime(),
        },
        ssjd: {
          type: "shortText",
          value: null,
        },
        xcrq: {
          type: "date",
          value: "",
        },
        xcdw: {
          type: "corporate",
          value: "",
        },
        wjbh: {
          type: "shortText",
          value: null,
        },
        wjtm: {
          type: "longText",
          value: null,
        },
        fbgc: {
          type: "shortText",
          value: null,
        },
        bz: {
          type: "longText",
          value: null,
        },
        ys: {
          type: "long",
          value: 0,
        },
        wzclys: {
          type: "long",
          value: 0,
        },
        tzzs: {
          type: "long",
          value: 0,
        },
      },
      rules: {
        wjtm: {
          required: true,
          message: "请输入文件题名",
          trigger: "change",
          validator: requiredCheck,
        },
        scrq: {
          required: true,
          message: "请选择上传日期",
          trigger: "change",
          validator: requiredCheck,
        },
        xcdw: {
          required: true,
          message: "请选择责任单位",
          validator: requiredCheck,
        },
        xcrq: {
          required: true,
          message: "请输入成文日期",
          validator: requiredCheck,
        },
        shr: {
          required: true,
          message: "请选择审核人",
          validator: requiredCheck,
        },
        wjly: {
          required: true,
          message: "请选择上传单位",
          validator: requiredCheck,
        },
      },
      fjlb: [],
      modalShow: false,
      ssjd: "",
      lxOptions: [],
      corpVar: "",
      readonly: true,
      disabledSignBtn: false,
      corpOptions: [],
      uploading: false,
      uploadPercentage: 0,
    };
  },
  async mounted() {
    const loading = this.$loading();
    this.getDictList("wjgdfjlx");
    const currentNodeInfo = localStorage.getItem("currentNodeInfo");
    localStorage.removeItem("currentNodeInfo");
    const isReadonly = localStorage.getItem("catalogue_flow_readonly");
    localStorage.removeItem("catalogue_flow_readonly");
    if (currentNodeInfo && currentNodeInfo !== "undefined") {
      const nodeInfo = JSON.parse(currentNodeInfo || "{}");
      this.formData.ssjdmc.value = nodeInfo.nodeName;
      this.formData.ssjd.value = nodeInfo.id;
    }
    const messageEventListener = window.addEventListener(
      "message",
      this.handelMessageEvent
    );
    this.$once("hook:beforeDestroy", function () {
      removeEventListener("message", messageEventListener);
    });
    // this.sendMessage(
    //   {
    //     messageType: "iframeReady",
    //   },
    //   "/"
    // );
    await this.findUserBelongToList();
    if (this.$route.query.procTaskId && this.$route.query.page === "todo") {
      // 待办
      await this.getTodoReadBusiness();
    } else if (this.$route.query.page === "fine") {
      if (this.$route.query.maintenance === "1") {
        this.readonly = false;
        this.disabledSignBtn = true;
      } else {
        this.readonly = true;
        this.disabledSignBtn = true;
      }

      await this.getSentReadBusiness();
    } else if (isReadonly === "1") {
      this.disabledSignBtn = true;
      await this.getSentReadBusiness();
    } else {
      // 发起流程
      this.readonly = false;
      if (this.corpOptions.length > 0) {
        this.formData.wjly.value = this.corpOptions[0].corpId;
        this.formData.wjlyName = this.corpOptions[0].corpName;
      }
    }
    loading.close();
  },
  methods: {
    dateFormat,
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
    handelCreateCorpClick(name) {
      this.corpVar = name;
      this.modalShow = true;
    },
    modalEvt({ data }) {
      this.modalShow = false;
      this.formData[`${this.corpVar}Name`] = data?.length
        ? data[0].corpName
        : "";
      this.formData[this.corpVar].value = data?.length ? data[0].corpId : "";
    },
    fileProgress(event, file, fileList) {
      this.uploading = true;
      this.uploadPercentage = Math.floor(event.percent);
    },
    // 文件上传成功
    async fileSuccess(data) {
      this.uploading = false;
      const file = data.data;
      this.uploadPercentage = 0;
      const pushData = {
        xh: {
          value: `${this.formData.fjlb.children.length + 1}`,
          type: "shortText",
        },
        fjmc: {
          value: `${file.fileName}`,
          type: "longText",
        },
        fjid: {
          value: `${file.fileId}`,
          type: "shortText",
        },
        scr: {
          value: this.loginInfo.userId,
          type: "user",
          object: {
            realName: this.loginInfo.realName,
          },
        },

        lx: {
          value: "",
          type: "dictionary",
        },
        scrqfj: {
          value: new Date().getTime(),
          type: "date",
        },
      };
      this.formData.fjlb.children.push(structuredClone(pushData));
      this.fjlb.push(pushData);
      this.getPageInfo(this.fjlb.map((item) => item.fjid.value));
    },
    coverToFileType(row) {
      return {
        name: row.fjmc.value, //名称
        url: `/api/file/getFileForApp?fileInfoId=${row.fjid.value}`,
        fileId: row.fjid.value, //上传服务器上 唯一标识符
        blobType: row.fjmc.value.split(".").pop(), // 预览时候转成blob 的类型
      };
    },
    // 上传文件失败
    fileError(err) {
      this.uploading = false;
      this.uploadPercentage = 0;
      this.$message.error("上传失败：" + err.message);
    },
    deleteFile(row) {
      this.fjlb = this.fjlb.filter(
        (item) => item.fjid.value !== row.fjid.value
      );
      this.formData.fjlb.children = structuredClone(this.fjlb);
      this.getPageInfo(this.fjlb.map((item) => item.fjid.value));
    },
    moveUpFileAttachment(id) {
      const index = this.formData.fjlb.children.findIndex(
        (item) => item.fjid.value === id
      );
      if (index === 0) return;
      this.swapList(this.formData.fjlb.children, index, index - 1);
      this.fjlb = structuredClone(this.swapList(this.fjlb, index, index - 1));
    },
    moveDownFileAttachment(id) {
      const index = this.formData.fjlb.children.findIndex(
        (item) => item.fjid.value === id
      );
      if (index + 1 === this.formData.fjlb.children.length) return;
      this.swapList(this.formData.fjlb.children, index, index + 1);
      this.fjlb = structuredClone(this.swapList(this.fjlb, index, index + 1));
    },
    // 交换数组的项
    swapList(list, index1, index2) {
      if (Array.isArray(list)) {
        const temp = list[index1];
        list[index1] = list[index2];
        list[index2] = temp;
      }
      return list;
    },
    // getMessage(event) {
    //     console.log("getMessage111111", event);
    // },
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
      if (this.fjlb?.length === 0) {
        this.$message.error("请上传附件");
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
        this.formData.xcdwName = data.fields.xcdw.object?.corpName;
        this.formData.wjlyName = data.fields.wjly.object?.corpName;
        this.fjlb = structuredClone(data.fields.fjlb.children);
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
        this.formData.xcdwName = data.fields.xcdw.object?.corpName;
        this.formData.wjlyName = data.fields.wjly.object?.corpName;
        this.fjlb = structuredClone(data.fields.fjlb.children);
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取待办信息失败");
        return false;
      }
    },
    async getDictList(typeCode) {
      try {
        const { data, success, message } = await getDictList({ typeCode });

        if (!success) {
          this.$message.error("查询字典列表失败：" + message);
          return false;
        }
        this.lxOptions = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询字典列表失败");
        return false;
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
      if (data.btnKey === "send" || data.btnKey === "submit" || data.btnKey === 'maintenance') {
        if (!this.validateForm()) return;
        const businessId = data.businessId || this.$route.query.businessId;
        const submitData = {};
        Object.keys(this.$options.data().formData).forEach((key) => {
          submitData[key] = this.formData[key];
        });
        if (Array.isArray(submitData.fjlb?.children)) {
          // 去除无关字段,组装附件列表字段

          submitData.fjlb.children = this.fjlb.map((item) => {
            const data = {};
            ["xh", "fjmc", "fjid", "scr", "lx", "scrqfj"].forEach((key) => {
              data[key] = {
                value: item[key].value,
                type: item[key].type,
              };
            });
            return data;
          });
        }
        // delete submitData.fjlb
        // submitData.fields = {};
        // console.log(submitData);
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
      if (data.processType === "mine") {
        this.readonly = false;
      }
    },
    h5SginCallBack(varData, onSuccess) {
      this.$nextTick(() => {
        // console.info("h5签章回调数据：", varData);
        //文件保存
        if (varData) {
          const index = this.fjlb.findIndex(
            (item) => item.fjid.value === varData.oldfileid
          );
          this.fjlb[index].fjid.value = varData.fileId;
          this.formData.fjlb.children[index].fjid.value = varData.fileId;
          if (typeof onSuccess === "function") onSuccess();
          this.$message.success("盖章成功！");
        }
      });
    },
    getCompKey() {
      return `${Math.floor(Math.random() * 101)}`;
    },
    async getPageInfo(fileIdList = []) {
      try {
        const { data, success, message } = await getPageInfo(fileIdList);
        if (!success) {
          this.$message.error("获取文件页数失败：" + message);
          return false;
        }
        this.formData.ys.value = data.pageNum;
        this.formData.wzclys.value = data.docNum;
        this.formData.tzzs.value = data.picNum;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取文件页数失败");
        return false;
      }
    },
    async findUserBelongToList() {
      try {
        const { data, success, message } = await findUserBelongToList();
        if (!success) {
          this.$message.error("获取当前登录人单位失败：" + message);
          return false;
        }
        this.corpOptions = data || [];

        return true;
      } catch (error) {
        console.error(error);
        this.$message.error("获取当前登录人单位失败");
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-add-catalogue-frame {
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
.el-dialog:has(.modal-main) {
  margin-top: 0 !important;
}
</style>

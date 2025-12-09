<template>
  <div style="padding: 10px">
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>

    <el-row>
      <el-form ref="dataFormRef" :model="formData" :rules="formDataRules" label-width="auto" :disabled="readonly">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请单位" prop="unit">
              <el-select @visible-change="$visibleChange($event, 'el-popper')" class="w-100pre" v-model="formData.unit"
                placeholder="请选择" @change="unitChangeHandle">
                <el-option v-for="item in belongUnit" :key="item.corpId" :label="item.corpName" :value="item.corpId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="关联合同" prop="contractId" v-if="!isFormApp">
              <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="formData.contractId"
                @change="contractIdChangeHandle" clearable filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in htxxOptions" :key="item.dictId"
                  :label="item.dictName + '（' + item.dictCode + '）'" :value="item.dictId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联合同" prop="contractId" v-else>
              <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="formData.contractId"
                @change="contractIdChangeHandle" clearable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in htxxOptions" :key="item.dictId"
                  :label="item.dictName + '（' + item.dictCode + '）'" :value="item.dictId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="审批人（项目经理）" prop="manager" v-if="showSpr">
              <user v-model="formData.manager" :readonly="readonly" :unitId="unitId"></user>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="合同名称" prop="name">
              <el-input
                show-word-limit
                maxlength="100"
                v-model="formData.name"
                placeholder="请输入合同名称"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="code">
              <el-input
                show-word-limit
                maxlength="100"
                v-model="formData.code"
                placeholder="请输入合同编码"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24" v-if="formData.filePath">
            <el-form-item label="预览" prop="filePath">
              <uploadFile :fromApplication="appformDisabled ? 'app' : 'web'" v-model="formData.filePath"
                :readonly="readonly" :limit="1" :maxSize="50" :showNtko="showSign" :flowName="formData.flowName"
                @changeNtkoFile="changeFile"></uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item label="文件预览">
              <el-button @click="preview(1)" size="mini">预览 </el-button>
              <!-- <el-button @click="sign()" size="mini">签章 </el-button> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
          <div style="width: 50%; color: #000">资金调拨明细列表</div>
          <div style="width: 50%; text-align: right">
            <el-button type="primary" icon="el-icon-plus" @click="addDetailBtn()" :disabled="readonly">
              新增
            </el-button>
          </div>
        </el-row>

        <el-divider></el-divider>

        <el-row class="table">
          <el-table ref="multipleTable" border :data="tableData" style="max-height: 50vh; overflow: auto">
            <el-table-column label="序号" type="index" width="80" align="center" />
            <el-table-column label="收款单位" prop="collectingUnit" align="center" class-name="taskname required"
              width="300">
              <template slot-scope="{ row }">
                <el-form-item :error="row.collectingUnitError">
                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" v-model="row.collectingUnit"
                    placeholder="请输入收款单位" :disabled="readonly" maxlength="50" show-word-limit
                    @blur="tableParValueChange(row)" style="width: 100%"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="付款内容" prop="paymentContent" align="center" class-name="taskname required"
              width="300">
              <template slot-scope="{ row }">
                <el-form-item :error="row.paymentContentError">
                  <el-input type="textarea" v-model="row.paymentContent" placeholder="请输入付款内容"
                    :autosize="{ minRows: 1, maxRows: 6 }" :disabled="readonly" maxlength="100" show-word-limit
                    @blur="tableParValueChange(row)" style="width: 100%"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="金额（元）" class-name="taskname required" prop="amount" align="center" width="200">
              <template slot-scope="{ row }">
                <el-form-item :error="row.amountError">
                  <el-input-number v-model="row.amount" v-thousands style="width: 100%" placeholder="请输入金额"
                    :disabled="readonly" :precision="2" :step="1" :controls="false" @change="computeSum()"
                    @blur="tableParValueChange(row)"></el-input-number>
                  <!-- @change="computeSum()" -->
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="附件" prop="uploadFile" align="center">
              <template slot-scope="{ row }">
                <uploadFile :fromApplication="appformDisabled ? 'app' : 'web'"
                  :class="readonly ? 'custom-disabled' : ''" :readonly="readonly" v-model="row.uploadFile"
                  :accept="'.jpg,.png,.gif'" style="width: 100%">
                </uploadFile>
              </template>
            </el-table-column>

            <el-table-column label="操作" prop="name" width="100" align="center">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small"
                  class="el-delete" :disabled="readonly" :style="{ color: readonly ? '' : 'red' }">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row :gutter="20" style="margin-top: 18px">
          <el-col :span="12">
            <el-form-item label="合计" prop="total">
              <el-input v-model="formData.total" disabled>
                <template slot="append">
                  <div>元</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大写" prop="uppercase">
              <el-input v-model="formData.uppercase" disabled> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { save, getSecretary, updateFile, BelongTo, unitList } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import User from "@/components/Organize/User/index.vue";
import Unit from "@/components/Organize/Unit/index.vue";
const Decimal = require("decimal.js");
Decimal.set({ precision: 50 });
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
  getNtkoSignConfig,
} from "@/utils/ntko";
import { convertCurrency, formatAmount } from "@/utils/math";
import lod from "lodash";
import { fromApp } from '@/utils/index';
export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    User,
    Unit,
  },
  data() {
    return {
      isFormApp: false,
      showSpr: false, //是否显示审批人
      //合同信息字典
      htxxOptionsSouse: [],
      htxxOptions: [],
      ntkoClose: false, //签章组件关闭状态
      formData: {
        unit: "",
      },
      formDataRules: {
        manager: [
          { required: true, message: "请选择审批人", trigger: "change" },
        ],
        contractId: [
          { required: true, message: "请选择合同", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
        unit: [{ required: true, message: "请选择单位", trigger: "blur" }],
      },
      //正在加载
      loading: false,
      //资金调拨明细列表
      tableData: [],
      url: {
        list: "/api/schedule/fund/info/page",
      },
      //签章坐标
      signPosition: {},
      //坐标坐标拷贝
      signPositionMsg: {},
      signMarkBooksMap: null,
      cmd: 0,
      belongUnitSouce: [], //备份 源所属机构
      belongUnit: [], //过滤出重复的单位
      appformDisabled: false,
      hasSigned: false,
    };
  },

  created() {
    this.isFormApp = fromApp()
    //接收控件页面的值，点击 保存到服务器 执行
    window.OnSaveSuccess = this.OnDataParentText;
    // (arg1, arg2, arg3) => {
    //   this.OnDataParentText(arg1, arg2, arg3);
    // };

    // //更新文件信息
    // window.saveNewFileSuccess = (fileData) => {
    //   this.handleChangeFile(fileData);
    // };

    this.htxxOptions = [];
    this.getDictItems("htxx").then((datas) => {
      this.htxxOptionsSouse = datas;
    });
    this.signMarkBooksMap = getNtkoSignConfig();
  },
  mounted() {
    //关闭控件页面回调"1151192679288143872"
    window.ntkoCloseEvent = () => {
      //发送时才触发
      if (this.cmd == 2) {
        this.ntkoClose = true;
      }
      // alert("跨浏览器插件应用程序窗口已关闭!");
    };

    // 来自app
    // this.$nextTick(() => {
    //   // appUrlList 只要是app 就一定会传递这个参数
    //   if (this.fromapp) {
    //     this.readonly = true;
    //     this.appformDisabled = true;
    //     const titleElement = document.getElementById("dynamicTitle");
    //     // 设置动态标题
    //     titleElement.textContent = "详情";
    //   }
    //   // this.$bus.$on("changeNtkoFile", (data) => {
    //   //   this.changeFile(data);
    //   // });
    // });
  },
  methods: {
    // 单位选择控制 合同选择项目
    unitChangeHandle(e) {
      this.$set(this.formData, "manager", "");
      // 重置合同
      this.htxxOptions = [];
      this.$set(this.formData, "contractId", "");
      // 清除校验
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate("contractId");
      });
      //  从htxxOptionsSouse中过滤出本单位的合同
      console.log("源数据合同", this.htxxOptionsSouse, e);
      // 过滤出当前单位的名称
      let unit = this.belongUnit.find((x) => x.corpId == e);
      let unitName = "";
      if (unit) {
        unitName = unit.corpName;
      } else {
        unitName = "";
      }
      console.log("单位", unitName);
      const datas = this.htxxOptionsSouse.filter((item) => {
        return item.dictRemark == unitName;
      });
      console.log("列表合同", datas);
      this.htxxOptions = [...datas];
    },
    // 获取所有的单位
    async getUnitList() {
      const { data, success } = await unitList();
      if (!success) {
        this.$message.error("获取单位失败");
        return;
      }
      this.belongUnit = data.filter((item) => {
        return item.corpLeaf !== 0;
      });
      console.log("请求 单位 ", this.belongUnit);
    },
    // 获取当前人的所属机构
    async getBelongTo(row) {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId,
      };

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
          this.belongUnitSouce = data;
          // 从源数据中过滤出重复的单位
          this.belongUnit = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          console.log("this.belongUnitSouce", this.belongUnitSouce, row);
          // 从源数据中过滤出默认单位
          if (row?.unit) {
            await this.unitChangeHandle(row.unit);
          } else {
            let defaultUnit = this.belongUnitSouce.find((x) => x.defaultOrg);
            if (defaultUnit) {
              this.$set(this.formData, "unit", defaultUnit.corpId);
              await this.unitChangeHandle(defaultUnit.corpId);
            } else {
              this.formData.unit = "";
              this.$refs.dataFormRef.clearValidate("contractId");
            }
          }
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },
    //合同切换
    contractIdChangeHandle(val) {
      if (val) {
        let option = this.htxxOptions.find((x) => x.dictId == val);
        if (option) {
          this.formData.name = option.dictName;
          this.formData.code = option.dictCode;
        }
      }
    },

    async custumValidate() {
      if (
        this.showSign &&
        this.postMessageData.btnKey !== "return" &&
        this.postMessageData.optKey !== "disagree"
      ) {
        let bool = false;
        //关闭app父级的弹窗
        this.closeAppPopup();
        // 如果 this.showSign 为 true，则弹出确认提示
        let confirmSign = await this.$confirm(`是否完成电子签章?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        })
          // .then(() => {})
          .catch(() => { }); // 添加错误捕获;

        if (!confirmSign) {
          return false;
        }
        console.log("confirmSign", confirmSign)
        let filePath = this.formData.filePath;
        console.log("confirmSignconfirmSignconfirmSign", confirmSign);
        if (filePath) {
          // 只可能有一个文件
          let json = JSON.parse(filePath);
          if (Array.isArray(json) && json.length > 0) {
            let signedItem = json.find(
              (item) => item.signed == true || item.signed == 2
            );
            if (signedItem) {
              bool = true;
            } else {
              this.$message.error("请先完成文件签章！");
              bool = false;
            }
          }
          return bool;
        }
      } else {
        return true;
      }
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey;
      if (btnKey === "submit") return;
      let extData = {};
      extData["spr"] = {
        type: "user",
        value: this.formData.manager,
      };
      // 获取同单位下的文秘
      const res = await getSecretary(this.formData.unit, "文秘");
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
      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
      if (typeof this.preview === "function") {
        //发送前做模板的保存
        await this.preview(2);
      } else {
        console.info("preview方法不存在");
      }
    },
    changeFile(fileData) {
      this.$nextTick(function () {
        debugger;
        this.hasSigned = true;
        //签章完成后修改文件信息
        console.info("**********change************");
        console.info(fileData);
        const params = new URLSearchParams(); // 创建对象
        let fData = JSON.parse(fileData)[0];
        // fData.url = fData.url.substr(0, fData.url.indexOf("?"));
        fData.signPosition = this.signPositionMsg;
        let fDataArrStr = "[" + JSON.stringify(fData) + "]";
        params.append("id", this.formData.id);
        params.append("fileData", fDataArrStr);
        updateFile(params).then((res) => {
          console.info(res);
          if (res.success) {
            this.formData.filePath = fDataArrStr;
          }
        });
      });
    },
    formateNtkoData() {
      let titleName = "";
      let titleDom = window.parent.document.querySelector(".title");
      if (titleDom) {
        //标题
        titleName = titleDom.innerHTML + ".pdf";
      }
      // window.parent.document
      //   .querySelector(
      //     ".el-input.el-input--small.el-input-group.el-input-group--prepend"
      //   )
      //   .querySelector(".el-input__inner").value + ".pdf";
      //:是非法字符
      titleName = titleName.replaceAll(":", "");
      //传入控件的数据 key是书签名称 values是流程对应的名称
      var signMarkBooks = Object.keys(this.signMarkBooksMap);
      // 获取发文单位
      var unitInfo = this.belongUnit.find(
        (item) => item.corpId == this.formData.unit
      );
      var paymentMsg = this.tableData.map((e) => {
        return (
          "收款单位：" +
          e.collectingUnit +
          "\v\t\t" +
          "付款内容：" +
          e.paymentContent +
          "\v\t\t" +
          "金额：" +
          formatAmount(e.amount) +
          "元"
        );
      });
      let formData = {
        applyUnit: unitInfo?.corpName || "",
        contractName: this.formData.name,
        contractCode: this.formData.code,
        paymentMsg: paymentMsg,
        total: this.formData.total,
        upperTotal: this.formData.uppercase,
        // signPosition: this.formData.signPosition,
        signMarkBooks: signMarkBooks,
        fileName: titleName,
      };
      return formData;
    },
    // 预览/发送
    async preview(cmd) {
      this.cmd = cmd;
      if (!this.beforeSubmit(this.dataFormRef)) return;
      //判断插件是否安装
      var ntkoed = getNtkoInstalled();
      var ntkourl = window.location.host;
      var ntkoprotocol = window.location.protocol;
      // if (ntkoed) {
      //   ntkoClosed(cmd);
      //   var ntkoData = this.formateNtkoData();
      //   //填充数据并预览
      //   if (cmd == 1) {
      //     ntkoFormPreview(ntkoData, "fundAllocationTemplate.docx");
      //   } else if (cmd == 2) {
      //     //提交表单前调用 自动转pfd并保存到服务器
      //     ntkoFormSavePDF(ntkoData, "fundAllocationTemplate.docx");
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
      //       "//" +
      //       ntkourl +
      //       "/ntko/officeTemplate/client.html?cmd=" +
      //       cmd,
      //       false
      //     );
      //   }
      // } else {
      //   getNtkoExe();
      // }
    },
    /**
     * 电子签章文件，保存成功后
     * 新增时
     */
    OnDataParentText(varData, signPositionData) {
      if (!varData || varData === "null") {
        this.$message.error("上传版式文件失败!");
        return;
      }
      console.log("OnDataParentText", varData);
      console.log("signPositionData", signPositionData);
      typeof varData === "string" && (varData = JSON.parse(varData));
      let file = [
        {
          blobType: "application/pdf",
          // blobType: varData.fileType,
          fileId: varData.fileId,
          // name: name, //newfile.fileName,
          name: this.getFileName(),
          fileSize: varData.fileSize,
          url: varData.requestRelativeUrl,
          signPosition: JSON.parse(signPositionData), //签章的坐标信息
        },
      ];
      //上传pdf的返回值
      this.formData.filePath = JSON.stringify(file);
    },
    // 默认为 工程建设资金调拨申请表_生成时间，如：工程建设资金调拨申请表_20231208095611
    getFileName() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const seconds = currentDate.getSeconds().toString().padStart(2, "0");
      const formattedTime = `工程建设资金调拨申请表_${year}${month}${day}${hours}${minutes}${seconds}`;
      return formattedTime;
    },
    //计算金额总和
    computeSum() {
      let total = 0;
      let arr = this.tableData || [];
      for (let index = 0; index < arr.length; index++) {
        const row = arr[index];
        // 要相加的两个带有小数的数值
        const num1 = new Decimal(total);
        const num2 = new Decimal(row.amount || 0);
        // 使用 decimal.js 进行相加
        const result = num1.plus(num2);
        total = result;
      }
      this.formData.total = formatAmount(total);
      this.formData.uppercase = convertCurrency(total);
      this.$forceUpdate();
    },
    //table 校验
    tableParValueChange(row) {
      if (!row.collectingUnit) {
        this.$set(row, "collectingUnitError", "收款单位不能为空！");
        return;
      } else {
        this.$set(row, "collectingUnitError", null);
      }
      if (!row.paymentContent) {
        this.$set(row, "paymentContentError", "付款内容不能为空！");
        return;
      } else {
        this.$set(row, "paymentContentError", null);
      }
      if (!row.amount || row.amount == 0) {
        this.$set(row, "amountError", "金额不能为空！");
        return;
      } else {
        this.$set(row, "amountError", null);
      }
    },
    addDetailBtn() {
      this.tableData.push({});
    },
    save(fields, callback, event) {
      console.log("save formData", this.formData);
      console.log("save tableData", this.tableData);

      let arr = this.tableData || [];
      for (let index = 0; index < arr.length; index++) {
        const row = arr[index];
        if (
          !row.collectingUnit ||
          !row.paymentContent ||
          !row.amount ||
          row.amount == 0
        ) {
          this.$message.error("明细列表数据不能为空！");
          return;
        }
      }
      console.log(this.postMessageData);
      // FILE_PATH
      if (fields.filePath) {
        // 只可能有一个文件
        let json = JSON.parse(fields.filePath);
        if (Array.isArray(json) && json.length > 0) {
          json.forEach((item) => {
            item.signed = false;
          });
          fields.filePath = JSON.stringify(json);
        }
      }
      fields.detailList = this.tableData;
      console.log("保存", fields);
      const isMaintenance = event.data.btnKey === "maintenance";
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: 'maintenance'
          },
          event.origin
        );
        return
      }
      save(fields)
        .then((res) => {
          const { success, message } = res;
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
    async deleteRow(index, rows) {
      let row = rows[index];
      if (row && row.children && row.children.length > 0) {
        this.$message("当前节点存在子级，无法删除！");
        return;
      }
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      });

      //删除数据
      rows.splice(index, 1);
      //计算总金额
      this.computeSum();
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow();
      if (row) {
        if (row.flowStatus == 1 || row.flowStatus == 2) {
          await this.getUnitList();
          await this.unitChangeHandle(row.unit);
        } else {
          await this.getBelongTo(row);
        }
        console.log("获取表单数据", row);
        this.formData = row;
        this.tableData = this.formData.detailList;
        if (row.flowStatus == 1 || row.flowStatus == 2) {
          this.showSpr = false;
        } else {
          this.showSpr = true;
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
        this.getBelongTo();

        // 新增时
        this.tableData = [];
        this.showSpr = true;
      }
    },
  },
  watch: {},
  computed: {
    showSign() {
      // return true;
      if (this.flowAuths?.stamp?.read) {
        return true;
      } else {
        return false;
      }
    },

    //只能选中本单位得人员
    unitId() {
      let unitId = [];
      if (this.formData.unit) {
        unitId = [this.formData.unit];
      } else {
        let corpId = this.$getStorage("userInfo").corpId;
        if (corpId) {
          unitId = [corpId];
        }
      }
      return unitId;
    },
    // 是否展示审批人
    freeFlowInputShow() {
      let show = false;
      if (this.formData?.flowInfo?.page != "fine") {
        if (
          Object.keys(this.formData).length === 0 ||
          !this.formData?.flowStatus
        ) {
          show = true;
        }
      }
      return show;
    },
    /**当前登录用户 */
    userInfo() {
      // console.log("userInfo", this.$getStorage("userInfo"));
      return this.$getStorage("userInfo");
    },
  },
  // 页面离开时触发
  beforeDestroy() {
    if (this.fromapp) {
      const titleElement = document.getElementById("dynamicTitle");
      // 设置动态标题
      titleElement.textContent = "雄安调蓄工程建设管理系统";
    }
  },
};
</script>

<style scoped lang="scss">
// 单独处理  上传样式

/deep/.custom-disabled {
  .upload-demo {
    display: none;
  }
}

/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;

    .el-input__count {
      height: 25px;
      line-height: 25px;
      bottom: 3px;
      // background: transparent;
      // bottom: -3px;
    }
  }
}

/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
  display: flex;
  justify-content: center;
}

/deep/ .el-table {
  th.required.taskname {
    .cell::before {
      content: "*";
      width: 5px;
      height: 0px;
      margin-top: 2px;
      color: #ff4d51;
    }
  }
}

/deep/ .file-list {
  margin-top: 3px !important;

  .icon {
    background-color: transparent !important;
    margin-right: 5px;
  }
}

::v-deep .el-divider--horizontal {
  margin: 18px 0;
}

::v-deep .el-table__row {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}

/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}
</style>

<template>
  <div class="w-100pre h-100pre">
    <el-dialog
      v-draggable
      title="业主收文"
      :visible.sync="dialogShow"
      @closed="closed"
      :width="dialogWidth"
      :top="dialogTop"
      :close-on-click-modal="false"
      :modal="showModal"
    >
      <!-- :show-close="false"  关闭按钮可能 触发app弹窗问题  -->
      <div class="page-leave">
        <el-row :gutter="20">
          <el-form
            ref="dataFormRef"
            :model="formData"
            :rules="formDataRules"
            label-width="auto"
            :disabled="formDisabled"
            :class="formDisabled ? 'formDisabled' : ''"
          >
            <el-col :span="18">
              <el-form-item label="文件编号" prop="code" error="请输入">
                <div v-show="false">{{ code }}</div>
                <div class="flex">
                  <el-input v-model="code1" maxlength="50" show-word-limit />
                  <div class="ml-16 mr-8">〔</div>
                  <el-input v-model="code2" style="width: 200px" />
                  <div class="ml-8 mr-16">〕</div>

                  <el-input
                    style="width: 300px"
                    show-word-limit
                    maxlength="10"
                    v-model="code3"
                  />
                  <div class="ml-16">号</div>
                  <div class="w-100 ml-40" v-if="showTotalNum">总号</div>
                  <el-input
                    v-if="showTotalNum"
                    style="width: 400px"
                    show-word-limit
                    maxlength="10"
                    v-model="formData.totalNum"
                  />
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

            <el-col :span="12">
              <el-form-item label="主送" prop="sendUnits">
                <uniTable
                  :tableTitle="'主送单位'"
                  ref="sendUnits"
                  :disableTable="true"
                  :selfUnit="formData.unit"
                >
                </uniTable>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抄送">
                <uniTable
                  :tableTitle="'抄送单位'"
                  ref="copySend"
                  :selfUnit="formData.unit"
                  :disableTable="true"
                ></uniTable>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="工程部位">
                <pbs-select
                  v-model="formData.pbsCode"
                  :readonly="formDisabled"
                ></pbs-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="formData.relatedReceiving">
              <el-form-item label="关联收文" prop="type">
                <!-- 这里还需要优化 -->
                <el-input
                  disabled
                  v-if="appformDisabled"
                  v-model="formData.relatedReceivingName"
                >
                </el-input>
                <RelatedReceivingDocuments
                  v-else
                  :level="level"
                  :ref="`${date}_RelatedReceivingDocuments`"
                  :formDisabled="formDisabled"
                  :relatedIds="formData.relatedReceiving"
                  :titles="formData.relatedReceivingName"
                  @relatedConfirm="relatedConfirm"
                  :showModal="false"
                ></RelatedReceivingDocuments>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="!formDisabled">
              <el-form-item label="">
                <el-radio-group v-model="formData.onlineEdit">
                  <el-radio :label="'0'"
                    >在线编辑公文正文并生成公文文件
                  </el-radio>
                  <el-radio :label="'1'">上传已编制好的公文文件</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="公文正文" prop="uploadFileContent">
                <uploadFile
                  :fromApplication="appformDisabled ? 'app' : 'web'"
                  :readonly="true"
                  v-model="formData.uploadFileContent"
                  :limit="1"
                >
                </uploadFile>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="附件">
                <uploadFile
                  :fromApplication="appformDisabled ? 'app' : 'web'"
                  :readonly="formDisabled"
                  v-model="formData.uploadFile"
                >
                </uploadFile>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="拟稿部门" prop="department">
                <el-input disabled v-model="formData.department" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拟稿人" prop="draftMan">
                <el-input disabled v-model="formData.draftMan" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="发文单位" prop="unit">
                <el-input disabled v-model="corpName" />
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <template slot="footer" v-if="appformDisabled || formPageType == 'edit'">
        <el-row>
          <div class="flex">
            <div style="margin-left: auto" class="flex">
              <!--【拒签】功能 -->
              <!-- 针对一对一的收发文，增加退回功能 -->
              <!-- // signStatus 0 1 2 3 4 5 未签收 部分签收 已签收  拒签 退回 完成 -->
              <el-button
                v-if="formData.signStatus == 0 || formData.signStatus == 1"
                type="primary"
                @click="rejectSign(2)"
                >签收
              </el-button>
              <el-button
                v-if="formData.signStatus == 0 || formData.signStatus == 1"
                type="danger"
                @click="rejectSign(3, '拒签')"
                >拒签
              </el-button>
              <el-button
                type="danger"
                v-if="formData.signStatus == 2"
                @click="rejectSign(4, '退回')"
                >退回
              </el-button>
              <el-button
                v-if="formData.signStatus == 2"
                type="primary"
                @click="rejectSign(5, '完成')"
                >完成
              </el-button>
            </div>
          </div>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  unitList,
  setSign,
  getOwnerById,
  getSecretarynew,
  getDepartmentsByUnit,
  archiveFileAll,
  sectionList,
} from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import DepSelect from "@/components/DepSelect/index.vue";
import { BaseMixin } from "@/mixins/BaseMixin";
import ProgressSelect from "@/components/ProgressSelect/index.vue";
import RelatedReceivingDocuments from "@/views/office/SendDocument/components/RelatedReceivingDocuments.vue";
import {
  getNtkoInstalled,
  getNtkoVersion,
  getNtkoExe,
  ntkoClosed,
  ntkoFormPreview,
  ntkoFormSavePDF,
} from "@/utils/ntko";

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
  },
  name: "dataform",
  mixins: [BaseMixin],
  components: {
    DepSelect,
    ProgressSelect,
    RelatedReceivingDocuments,
  },
  data() {
    return {
      archiveFileTypes: [], //归档类型
      subcontractingFileTypesOption: [], //分包文件类型
      sectionOptions: [],
      date: Date.now(),
      showModal: true,
      dialogTop: "8vh",
      dialogWidth: "80%",
      formPageType: "edit",
      formDisabled: true,
      dialogShow: false,
      sendUnitChooseNames: [], //选中的单位 名称
      copyUnitChooseNames: [], //选中的单位 名称
      unitId: [], // 收文人 对应的单位
      pageType: "",
      freeFlowInputShow: false,
      showTextarea: true,
      realName: "",
      departmentName: "",
      unitOptions: [],
      code1: "",
      code2: "",
      code3: "",
      content: "",
      mode: "default", // or 'simple'
      canDeleteRow: false,
      // pbsName: "",
      dialogPlanVisible: false,
      actualDate: true,
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },
      tableData: [],
      formData: {
        onlineEdit: "1",
        title: "",
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
        sendUnits: [{ required: true, message: "请输入", trigger: "change" }],
        uploadFileContent: [{ required: true, message: "请上传文件/生成文件" }],
        sendUser: [
          {
            required: true,
            message: "请选择收文人",
          },
        ],
        content: [{ required: true, message: "请输入", trigger: "blur" }],
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
      fblxCode: "fblx",
      fblxOptions: [],
      businessId: "",
      url: {
        list: "/api/synthesis/manage/page",
      },
      users: [],
      personnelShow: false,
      appformDisabled: false,
    };
  },

  created() {
    window.OnSaveSuccess = this.OnDataParentText;
    this.getUnitList(); //获取所有的单位
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
    showReject() {
      if (this.formData.isMultiple == 1) {
        return true;
      } else {
        return false;
      }
    },
    // 是否显示总号
    showTotalNum() {
      let show = false;
      // 发文界面只有设计单位可以显示
      if (this.pageType.documentType == 2) {
        if (this.pageType.unitType == 2) {
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
        // this.formData.department = departName;
        // this.formData.createUsername = realName;
        // this.formData.unit = corpId;
        name = corpName;
      }
      return name;
    },
    code() {
      this.formData.code = `${this.code1}|${this.code2}|${this.code3}`;
      return `${this.code1}-${this.code2}-${this.code3}`;
    },

    custumChoose() {
      if (this.formData?.flowInfo?.page == "todo") {
        return "custumChoose";
      }
    },
  },
  mounted() {
    //关闭控件页面回调
    window.ntkoCloseEvent = () => {
      this.ntkoClose = true;
      // alert("跨浏览器插件应用程序窗口已关闭!");
    };
    console.log("路由", this.$route);
    if (this.$route.query?.appDialogShow) {
      this.appformDisabled = true;
      if (!this.dialogShow) {
        this.dialogShow = true;
      }
      this.dialogWidth = "100%";
      this.dialogTop = "0vh";
      this.showModal = false;
      this.formPageType = "view";
      this.unitType = this.$route.query.unitType;
      this.documentType = this.$route.query.documentType;
      const titleElement = document.getElementById("dynamicTitle");
      // 设置动态标题
      // titleElement.textContent = "详情";
      this.appInitForm();
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
      console.log("当前的状态", this.$route.meta.documentType == 2);
      archiveFileAll().then((res) => {
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

    async setTable(row, type) {
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
      console.log("业主单位信息", ownerUnit);
      let ownDepart = [];
      if (ownerUnit) {
        const { data, success } = await getDepartmentsByUnit(ownerUnit.corpId);
        ownDepart = data.map((x) => x.departId);
        // console.log("业主单位部门列表", ownDepart);
      }
      sendUnitArr.forEach(async (item) => {
        let send = row.sendUnits.split(",");
        let copy = row.copySend.split(",");
        let sendandcopyUnit = send.concat(copy);
        // 从 this.unitOptions  过滤出不在 sendandcopyUnit
        let unit = this.unitOptions.filter((e) => {
          return e.corpId == item && !sendandcopyUnit.includes(e.corpId);
        });
        // 未被选中的单位候选项
        // console.log("unit", unit);
        // 设置表格单位
        let table = [];
        let forUNIT = type === "sendUnits" ? send : copy;
        forUNIT.forEach(async (val) => {
          // 判断当前的id是不是在业主单位的部门里面
          let isOwnDept = ownDepart.find((x) => x === val);
          let params = {
            corpId: isOwnDept ? ownerUnit.corpId : val,
            roleName: "文秘",
          };
          let res = await getSecretarynew(params);
          const { data, success, message } = res;
          if (!success) {
            this.$message.error(message);
            return;
          }

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
    // 选中关联收文回调
    relatedConfirm(row) {
      console.log("选中回调", row);
      this.formData.relatedReceiving = row.ids;
      this.formData.relatedReceivingName = row.titles;
    },
    async appInitForm() {
      let params = {
        id: this.$route.query.businessId,
        unitType: this.unitType,
        documentType: this.documentType,
      };
      let res = await getOwnerById(params);
      const { data, success } = res;
      if (!success || !data || data.length === 0) {
        this.$message.error("未能查询到数据！");
      }
      if (data && Array.isArray(data) && data.length > 0) {
        this.edit(data[0], true);
        return;
      } else {
        this.edit({}, true);
      }
    },

    // 拒签
    async rejectSign(type, name) {
      const { documentType, unitType } = this.$route.meta;
      let params = {
        id: this.formData.id,
        code: this.formData.code,
        documentType: documentType,
        signStatus: type,
      };

      if (type == 2) {
        let result = await setSign(params);
        const { data, success } = result;
        if (!success) {
          this.$message.error(result.message);
        }
        if (success) {
          this.$message.success("签收成功");
          this.formData.signStatus = 2;
          this.closed();
          this.$emit("close");
        }
      } else if (type == 5) {
        let result = await setSign(params);
        const { data, success } = result;
        if (!success) {
          this.$message.error(result.message);
        }
        if (success) {
          this.formData.signStatus = type;
          this.closed();
          this.$emit("close");
        }
      } else {
        this.$prompt(`请输入${name}理由`, "提示", {
          customClass: "customClass",
          confirmButtonText: "确定",
          cancelButtonText: "",
          showCancelButton: false,
          inputType: "textarea",
          message: `${name}操作不可撤回，${name}后不可继续办理此条收文业务，请谨慎操作！`,
          inputErrorMessage: `请输入${name}理由`,
          closeOnClickModal: false,
          inputPattern: /[\s\S]+/, // 用于判断至少包含一个字符或者更多字符
          inputValidator: (value) => {
            if (value.length >= 500) {
              return `最多输入500字符的${name}理由`;
            }
            return true;
          },
          beforeClose: async (action, instance, done) => {
            if (action === "confirm") {
              // this.$emit("click", this.row, this.status, this.task);
              params.reason = instance.inputValue;
              let result = await setSign(params);
              if (result.success) {
                done();
                return true;
              } else {
                this.$message.error(result.message);
                return false;
              }
            } else {
              done(false);
            }
          },
        })
          .then((res) => {
            console.log("确定", res);
            this.dialogShow = false;
            this.$message.success(`${name}成功`);
            this.closed();
            this.$emit("close");
          })
          .catch((err) => {
            console.log("取消", err);
          });
      }
    },

    // 根据单位id 获取名称
    getUnitName(unitIds) {
      if (!unitIds) return;
      let arr = unitIds.split(",");
      let names = [];
      this.unitOptions.forEach((x) => {
        if (arr.includes(x.corpId)) {
          names.push(x.corpName);
        }
      });
      return names.join(",") || unitIds;
    },
    closed() {
      this.dialogShow = false;
    },

    // 查看
    edit(row, disbled) {
      console.error("edit");
      this.getFormData(row);
    },
    // 版式文件预览
    async preview(cmd) {
      //判断插件是否安装
      var ntkoed = getNtkoInstalled();
      var ntkoversion = getNtkoVersion();
      const { content, name, title, uploadFile, sendUnits, copySend, unit } =
        this.formData;
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
      //传入控件的数据
      let formData = {
        code1: this.code1,
        code2: this.code2,
        code3: this.code3,
        content,
        name,
        title,
        date: `${year}-${month}-${day}`, //当前日期
        uploadFileNames: uploadFileNames,
        sendUnits: this.sendUnitChooseNames,
        copySend: this.copyUnitChooseNames,
        unit,
      };
      let ntkotext = encodeURIComponent(JSON.stringify(formData)); //.replaceAll('"', "'");

      var ntkourl = window.location.host;
      var ntkoprotocol = window.location.protocol;
      // if (ntkoed) {
      //   ntkoClosed(cmd);
      //   //填充数据并预览
      //   if (cmd == 1) {
      //     // ntkoFormPreview(formData, "fundAllocationTemplate.docx");
      //     ntkoFormPreview(formData, "sendDocTemplate.docx");
      //   } else if (cmd == 2) {
      //     //提交表单前调用 自动转pfd并保存到服务器
      //     ntkoFormSavePDF(formData, "sendDocTemplate.docx");
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
    async getUnitList() {
      const { data, success } = await unitList();
      if (!success) {
        this.$message.error("获取单位失败");
        return;
      }
      this.unitOptions = data.filter((item) => {
        return item.corpLeaf !== 0;
      });
    },

    async getFormData(row) {
      try {
        // 获取当前页面得配置信息 用于区分是哪个类型得单位
        console.log("获取表单数据", row);
        if (!row) {
          this.$message.error("获取表单数据异常");
          return;
        }
        if (row.code) {
          let code = row.code.split("|");
          this.code1 = code[0];
          this.code2 = code[1];
          this.code3 = code[2];
        }
        //
        this.$nextTick(() => {
          //兼容之前的版本   之前版本的数据的是  人员id&&&姓名  现在更改了组件只需要id即可
          if (row.sendUser) {
            // 判断是否包含字符 &&&
            if (row.sendUser.includes("&&&")) {
              row.sendUser = row.sendUser.split("&&&")[0];
            }
          }
          if (row.archiveTypeId) {
            row.archiveTypeId = row.archiveTypeId.split(",");
            row.archiveTypeId[0] = Number(row.archiveTypeId[0]); //数据字段类型不对 第一节是number 后面是字符串 fuck
          }
          if (row.sectionId) {
            row.sectionId = row.sectionId.split(",");
          }
          this.formData = row;
          this.formData.createUsername = row.createUsername;
          // 获取当前主送单位对应的人员 unitId
          // row.sendUnits 转换成数组
          let unitId = [];
          if (row.sendUnits) {
            unitId = row.sendUnits.split(",");
          }
          this.unitId = unitId;
          this.setTable(row, "sendUnits");
          // 抄送单位
          this.setTable(row, "copySend");
        });
      } catch (error) {
        //新增时
        this.code2 = dateFormat(new Date(), "yyyy");
        console.error("获取表单数据出错:", error);
      }
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
        } else {
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

  // 页面离开时触发
  beforeDestroy() {
    if (this.$route.query?.appDialogShow) {
      const titleElement = document.getElementById("dynamicTitle");
      // 设置动态标题
      titleElement.textContent = "雄安调蓄工程建设管理系统";
    }
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

/deep/ .is-disabled.el-input-group.el-input-group--append.custumChoose {
  .el-input-group__append {
    background-color: #f5f7fa;
    color: #1298fa !important;
    border: 1px solid #1298fa !important;
    cursor: pointer !important;
  }
}

/deep/ .el-dialog__body {
  max-height: 70vh;
}

/deep/ .el-form.formDisabled {
  .el-input-group__append {
    background-color: #f5f7fa;
    color: #909399;
    border: 1px solid #dcdfe6;
  }
}
</style>

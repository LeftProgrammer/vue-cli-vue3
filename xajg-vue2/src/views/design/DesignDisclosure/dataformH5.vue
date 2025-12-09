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
      :disabled="readonly"
      label-width="85px"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="交底编号" prop="code">
            <el-input
              show-word-limit
              maxlength="20"
              v-model="formData.code"
              placeholder="请输入编号"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="成果编号" prop="drawingCode">
            <div :class="{ readonly: readonly }">
              <el-input disabled placeholder="请选择" v-model="cumDrawingCode">
                <template slot="append">
                  <div @click.stop="changeComponents('chooseFile')">选择</div>
                </template>
              </el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="成果名称" prop="drawingName">
            <el-input
              disabled
              v-model="formData.drawingName"
              placeholder=""
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="计划交底时间" prop="explainDate">
            <el-date-picker
              v-model="formData.explainDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              default-time="12:00:00"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="会议地点" prop="place">
            <el-input
              show-word-limit
              maxlength="15"
              v-model="formData.place"
              placeholder="请输入"
              width="100%"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <!--        兼容历史数据，如果是参会人则显示参会人-->
        <el-col :span="24" v-if="showMeetingType">
          <el-form-item label="参会人" prop="persons" align="center">
            <el-form>
              <el-form-item label="" prop="persons" align="center">
                <user
                  v-model="formData.persons"
                  :multiple="true"
                  :readonly="readonly"
                ></user>
              </el-form-item>
            </el-form>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="!showMeetingType && showSend">
          <el-form-item label="参会单位" prop="units">
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!showMeetingType && showSend">
          <el-form-item label="" prop="units">
            <uniTable
              :tableTitle="'参会单位'"
              ref="sendUnits"
              @chooseChange="setSentUnit"
              @deleteChange="deleteSendUniTable"
              @userChange="userChange"
              :disableTable="readonly"
              :disAdd="readonly"
              :selfUnit="selfUnit"
            ></uniTable>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!showMeetingType && !showSend">
          <el-form-item label="参会单位" prop="units">
            <unit
              v-model="formData.units"
              :readonly="readonly"
              :multiple="true"
              @change="handleSendUnitChange"
            ></unit>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="交底内容" prop="content" align="center">
            <el-input
              type="textarea"
              show-word-limit
              maxlength="500"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="formData.content"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="freeFlowInputShow">
          <el-form-item label="内部审批人" prop="freeFlowUsers" class="approver">
            <user v-model="formData.freeFlowUsers" :readonly="readonly"></user>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="会议要求" prop="stipulate" align="center">
            <el-input
              show-word-limit
              maxlength="50"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="formData.stipulate"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="附件" prop="uploadFile">
            <uploadFile
              :readonly="readonly"
              v-model="formData.uploadFile"
              :showNtko="showSign"
              :showDate="showSign"
              :limit="1"
              @changeNtkoFile="changeFile"
            >
            </uploadFile>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      ref="dataFormRef"
      :model="formData"
      :rules="formDataRules"
      label-width="auto"
      :disabled="isDisabledMe"
      v-if="DesignDisclosureDate"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="交底日期" prop="actualExplainDate">
            <el-date-picker
              class="w-100pre"
              v-model="formData.actualExplainDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期时间"
              :disabled="isDisabledMe"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="false">
          <el-form-item label="">
            <el-radio-group
              v-model="formData.meetingMethod"
              @change="changeMeetingMethod"
            >
              <el-radio :label="1">从发文中关联会议纪要</el-radio>
              <el-radio :label="0">上传会议纪要</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-if="formData.meetingMethod == 0">
          <el-form-item label="会议纪要" prop="metingMinutes">
            <uploadFile
              :readonly="isDisabledMe"
              v-model="formData.metingMinutes"
              :limit="1"
            >
            </uploadFile>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-else>
          <el-form-item label="关联会议纪要" prop="meetingCodes">
            <el-input placeholder="请选择" v-model="formData.meetingCodes">
              <template slot="append">
                <div @click.stop="changeMeetingComponents()">选择</div>
              </template>
            </el-input>
            <div>
              <div
                v-for="(file, index) in meetingUploadFiles"
                :key="index"
                class="file-list"
              >
                <div class="file-name text-ellipsis" :title="file.name">
                  {{ file.name }}
                </div>
                <div class="font-18 icon">
                  <span class="ml-15 pointer" @click="handlePriview(file)">
                    <i class="el-icon-view" />
                  </span>
                  <span class="ml-15 pointer" @click="handleDownload(file)">
                    <i class="el-icon-download" />
                  </span>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 关联文件选择 -->
    <el-dialog
      width="80%"
      v-draggable
      :visible.sync="dialogFormVisible"
      title="关联文件选择"
    >
      <components
        ref="components"
        :is="component"
        :multiple="multiple"
      ></components>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
    <!--    关联会议纪要-->
    <el-dialog
      width="80%"
      v-draggable
      :visible.sync="dialogMeetingVisible"
      title="关联会议纪要选择"
    >
      <meeting ref="componentMeeting"></meeting>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMeetingVisible = false">取 消</el-button>
        <el-button type="primary" @click="meetingSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { save, planList, supplyList, page } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import chooseFile from "./components/chooseFile.vue";
import meeting from "./components/meeting.vue";
import { mapGetters } from "vuex";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
// import { getSecretary, updateFile } from "../../office/fundAllocation/api";
import { getSecretarynew, unitList } from "../../office/SendDocument/api";
import UniTable from "./components/unitTable.vue";
export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: {
    chooseFile,
    meeting,
    UniTable,
  },
  data() {
    return {
      pbsName: "",
      multiple: true,
      component: "chooseFile",
      dialogFormVisible: false,
      month: "",
      //当前选择行
      curRow: null,
      actualDate: true,
      dialogBim: false,
      DitSpeciality: [],
      formData: {
        drawingList: [],
        meetingMethod: 1,
        meetingType: 1,
      },
      formDataRules: {
        code: [{ required: true, message: "请输入", trigger: "blur" }],
        drawingList: [{ required: true, message: "请输入", trigger: "change" }],
        explainDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: ["blur", "change"],
          },
        ],
        place: [{ required: true, message: "请输入", trigger: "blur" }],

        persons: [{ required: true, message: "请选择", trigger: "change" }],
        content: [{ required: true, message: "请输入", trigger: "blur" }],
        actualExplainDate: [
          { required: false, message: "请选择日期", trigger: "change" },
        ],
        metingMinutes: [
          { required: true, message: "请上传文件", trigger: "change" },
        ],
        meetingCodes: [
          { required: true, message: "请选择关联会议纪要", trigger: "change" },
        ],
        units: [{ required: true, message: "请输入", trigger: "change" }],
        freeFlowUsers: [
          { required: true, message: "请选择", trigger: "change" },
        ],
      },
      /**表单是否只读 */
      readonly: false,
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
      personsText: "",
      users: [],
      DesignDisclosureDate: false,
      url: {
        list: "/api/design/explain/page",
      },
      sendUnitChooseIds: [], // 主送单位已选中的单位
      deleteSendUnit: "", //删除的主送单位
      dialogMeetingVisible: false,
      meetingUploadFiles: [],
      sendUnitChooseNames: [], //选中的单位 名称
      unitOptions: [],
      freeFlowInputShow: false,
      freeFlowUsers: "",
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    // 发文单位
    selfUnit() {
      if (this.formData.unit) {
        return this.formData.unit;
      } else {
        let localStorage = this.$getStorage("userInfo");
        if (localStorage) {
          return localStorage.corpId;
        } else {
          this.$message.error("获取用户单位错误。切勿操作");
          return "";
        }
      }
    },
    showSign() {
      if (this.flowAuths?.stamp?.read) {
        return true;
      } else {
        return false;
      }
    },
    cumDrawingCode() {
      let name = "";
      // 从数组中 过滤出 每个对象 得code 然后 组成字符串 使用， 分割
      if (
        Array.isArray(this.formData.drawingList) &&
        this.formData.drawingList
      ) {
        name = this.formData.drawingList
          .map((item) => item.drawingCode)
          .join(",");
        this.formData.drawingName = this.formData.drawingList
          .map((item) => item.drawingName)
          .join(",");
        // this.getPbsName();
      } else {
        this.formData.pbsCode = "";
        this.formData.drawingName = "";
        this.pbsName = "";
      }
      return name;
    },
    isDisabledMe() {
      console.log(
        "computed",
        this.formData.flowStatus,
        this.formData?.flowInfo?.page
      );
      let flag = false;
      if (this.formData?.flowInfo?.page == "fine") {
        flag = true;
      } else {
        if (this.formData?.flowStatus == 2) {
          flag = true;
        } else {
          flag = false;
        }
      }
      return flag;
    },
    // 是否展示showSend
    showSend() {
      if (this.formData.flowStatus == 1 || this.formData.flowStatus == 2) {
        return false;
      }
      return true;
    },
    showMeetingMethod() {
      let bool = false;
      if (this.DesignDisclosureDate) {
        if (this.formData.flowStatus == 2) {
          bool = false;
        } else {
          bool = true;
        }
      } else {
        if (this.readonly) {
          bool = false;
        }
      }
      return bool;
    },
    showMeetingType() {
      let bool = false;
      if (this.formData.meetingType == 0) {
        bool = true;
      }
      return bool;
    },
  },
  async created() {
    this.getDictItemList(this.designClassifyCode);
    this.getFlowPROFESSION(this.designProfessionCode);
    this.getUnitList(); //获取所有的单位

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
  mounted() {},
  watch: {
    "formData.metingMinutes": {
      handler(val) {
        if (!this.DesignDisclosureDate) return;
        let arr = JSON.parse(val);
        if (arr?.length > 0) {
          this.$refs.dataFormRef.clearValidate("metingMinutes");
        }
      },
      // deep: true,
    },
    "formData.meetingMethod": {
      handler(newValue, oldValue) {
        if (!this.DesignDisclosureDate) return;
        console.log("onlineEdit watch", newValue);
        this.$refs.dataFormRef.clearValidate("metingMinutes");
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    changeFile(fileData) {
      this.$nextTick(function () {
        //签章完成后修改文件信息
        const params = new URLSearchParams(); // 创建对象
        let fData = JSON.parse(fileData)[0];
        // fData.url = fData.url.substr(0, fData.url.indexOf("?"));
        fData.signPosition = this.signPositionMsg;
        let fDataArrStr = "[" + JSON.stringify(fData) + "]";
        // params.append("id", this.formData.id);
        // params.append("fileData", fDataArrStr);
        this.formData.filePath = fDataArrStr;
        this.formData.uploadFile = fDataArrStr;
        // updateFile(params).then((res) => {
        //   if (res.success) {
        //     this.formData.filePath = fDataArrStr;
        //   }
        // });
      });
    },
    async getPbsName() {
      let name = "";
      // 从数组中过滤出每个对象得code然后组成字符串使用，分割
      if (
        Array.isArray(this.formData.drawingList) &&
        this.formData.drawingList.length > 0
      ) {
        let pbsCodes = this.formData.drawingList.map((item) => item.pbsCode);
        this.formData.pbsCode = pbsCodes.join(",");
        // 使用Promise.all等待所有异步操作完成
        let arrPbs = await Promise.all(
          pbsCodes.map(async (code) => {
            let res = await this.$getPbsInfoByCode(code);
            return res.name;
          })
        );
        name = arrPbs.join(",");
      }
      this.pbsName = name;
    },
    sure() {
      // 单选是对象  多选就是得数组 所以 需要根据 multiple 来单独处理
      if (this.multiple) {
        this.multipleSure();
      } else {
        this.singleSure();
      }
    },
    // 多选
    async multipleSure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("选中", currentRow);
      if (currentRow) {
        // 循环 currentRow  code 赋值给 drawingCode id赋值给 drawingId  name  赋值给 drawingName
        currentRow.forEach((element) => {
          element.drawingCode = element.code;
          element.drawingId = element.id;
          element.drawingName = element.name;
        });
        this.$set(this.formData, "drawingList", currentRow);
      } else {
        this.$set(this.formData, "drawingList", []);
      }
      this.dialogFormVisible = false;
    },
    // 单选
    async singleSure() {
      let currentRow = this.$refs.components.currentRow;
      console.log("选中", currentRow);
      if (currentRow) {
        this.$set(this.formData, "pbsCode", currentRow.pbsCode || "");
        if (currentRow.pbsCode) {
          this.$set(this.formData, "pbsCode", currentRow.pbsCode);
        }
        this.$set(this.formData, "drawingName", currentRow.name);
        this.$set(this.formData, "drawingCode", currentRow.code);
        this.$set(this.formData, "baseId", currentRow.id);
      }
      this.dialogFormVisible = false;
    },

    changeComponents(component) {
      if (this.readonly) return;
      this.component = component;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.components.init();
      });
    },

    changeBim() {
      this.dialogBim = false;
      this.$nextTick(() => {
        this.dialogBim = true;
      });
    },

    /**获取流程状态字典 */
    async getFlowPROFESSION(code) {
      const { data } = await getDictItemList(code);
      this.DitSpeciality = data;
    },

    /**
     * 获取表单数据
     */
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        console.log("表单数据", row);
        if (!row) {
          this.DesignDisclosureDate = false;
          this.$set(this.formDataRules.actualExplainDate[0], "required", false);
          this.$nextTick(() => {
            this.freeFlowInputShow = true;
          });
          return;
        }
        // 指定流程节点展示 ||流程结束
        const includesTechnical =
          row?.actualExplainDate_NodeAuths?.read ||
          row?.flowStatus == 2 ||
          false;
        if (includesTechnical) {
          this.$set(
            this.formDataRules["actualExplainDate"][0],
            "required",
            true
          );
          this.DesignDisclosureDate = true;
          if (row.actualExplainDate) {
            row.actualExplainDate = this.timeFormat(
              row.actualExplainDate,
              "YYYY-MM-DD"
            );
            this.$set(
              this.formData,
              "actualExplainDate",
              row.actualExplainDate
            );
          } else {
            let day = this.timeFormat(new Date(), "YYYY-MM-DD");
            this.$set(this.formData, "actualExplainDate", day);
          }
        } else {
          this.DesignDisclosureDate = false;
          this.$set(
            this.formDataRules["actualExplainDate"][0],
            "required",
            false
          );
          this.$set(this.formData, "actualExplainDate", "");
        }
        // Set formData
        if (!row.meetingMethod) {
          row.meetingMethod = 1;
        }
        if (row.metingMinutes) {
          this.meetingUploadFiles = JSON.parse(row.metingMinutes);
        }
        if (row.meetingCode) {
          row.meetingCodes = this.getCode(row.meetingCode);
        }
        if (row.flowStatus < 1 || !row.flowStatus) {
          this.setTable(row, "units");
        }
        this.$set(this, "formData", row);
        this.$refs.dataFormRef.clearValidate("actualExplainDate");
        this.$refs.dataFormRef.clearValidate("units");
        // this.getPbsName();
        // Set personsText if persons is available
        this.$nextTick(() => {
          // 自由流程第一人
          let b = row.createUser == this.$getStorage("userInfo").userId;
          console.log("是否显示自由流程第一人", b, this.readonly);
          this.freeFlowInputShow = b && !this.readonly;
        });
      } catch (error) {
        // Handle any errors that occur during the getFlowRow() operation.
        console.error("Error while fetching data:", error);
      }
    },
    /*接收到父级的消息处理完后返回给父级*/
    async save(fields, callback, event) {
      console.log("fields", fields);
      const isMaintenance = event.data.btnKey === "maintenance";

      //如果是参会单位则添加类型区分之前参会人
      if (fields.units) {
        fields.meetingType = 1;
      } else {
        fields.meetingType = 0;
      }
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
      //做业务数据的保存,修改。
      save(fields)
        .then((res) => {
          const { success, message, data } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            //this.$message.success("新增成功");
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
    // 发送单位 设置发文单位
    setSentUnit(uniIds) {
      console.log("unitIds", uniIds);
      let sendUnitTable = this.$refs.sendUnits.tableData.map((x) => x.corpId);
      // 判断两个数组是不是有重复的数据 判断自己是否有重复单位
      if (this.hasDuplicates(sendUnitTable)) {
        this.$message.error("发送单位不能重复");
        this.$set(this.formData, "units", "");
        // 触发校验
        this.$refs.dataFormRef.validate("units");
        return;
      } else {
        this.$set(this.formData, "units", sendUnitTable.toString());
        // 清除校验
        this.$refs.dataFormRef.clearValidate("units");
      }
      return;
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
    // 抄送单位 设置收文人
    userChange() {
      // 把两个table 的人员全部拿到 然后合并在一起   组成    人员id_部门id_单位id,
      this.$nextTick(() => {
        let tableList = this.$refs.sendUnits.tableData;
        console.log("tableList++++", tableList);
        let userIds = [];
        tableList.forEach((item) => {
          // if (item.item && item.type === "sgdw") {

          // }
          userIds.push(
            `${item.item.userId}_${item.item.departId}_${item.item.corpId}`
          );
        });
        console.log("userIds", userIds);
        let str = userIds.join(",");
        this.$set(this.formData, "persons", str);
        console.log("this.formData.persons", this.formData.persons);
      });
    },
    hasDuplicates(array) {
      let bool = new Set(array).size != array.length;
      console.log("bool", bool);
      return bool;
    },
    async beforeSend() {
      console.log('beforeSubmitButton')
      let res = true;
      let extData = {};
      if (this.formData.persons) {
        let tempArr = this.formData.persons.split(",");
        let users = [];
        console.log("tempArr", tempArr);
        tempArr.forEach((item) => {
          if (item) {
            let useId = item.split("_")[0];
            if (useId) {
              users.push(useId);
            }
          }
        });
        if (users) {
          let userIds = users.join(",");
          extData["sgdwwm"] = {
            type: "user",
            value: userIds,
          };
          console.log("提交前", extData.sgdwwm);
        } else {
          this.$message.error("收文人错误，请联系管理员！");
          return;
        }
      }
      if (this.postMessageData.btnKey === "send") {
        console.log(' if (this.postMessageData.btnKey === "send"');
        let userInfo = this.$getStorage("userInfo");
        let params = {
          corpId: userInfo.corpId,
          roleName: "文秘",
        };
        let Secretary = await getSecretarynew(params);
        const { data, success, message } = Secretary;
        if (!success || !Array.isArray(data) || data.length == 0) {
          this.$message.error("当前登陆人对应的监理单位未能查询到文秘人员！");
          return false;
        }
        this.formData.supervisionSecretary = data
          .map((x) => x.userId)
          .toString();
        extData["jldwwm"] = {
          type: "user",
          value: this.formData.supervisionSecretary,
        };
      } else {
        if (this.formData.supervisionSecretary) {
          extData["jldwwm"] = {
            type: "user",
            value: this.formData.supervisionSecretary,
          };
        }
      }
      console.log("extData", extData);
      this.sendFlowJson = extData;
      this.sendFlowJson.spr = {
        type: "user",
        value: this.formData.freeFlowUsers,
      };
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      console.log("resresresres", res);
      return res;
    },
    // 切换取会议纪要的方式
    changeMeetingMethod() {
      // 来回切换 置空文件
      this.$set(this.formData, "metingMinutes", "");
      this.$set(this.formData, "meetingCodes", "");
      this.$set(this.meetingUploadFiles, "meetingCodes", "");
      this.meetingUploadFiles = [];
    },
    changeMeetingComponents() {
      if (!this.DesignDisclosureDate) return;
      this.dialogMeetingVisible = true;
      this.$nextTick(() => {
        this.$refs.componentMeeting.init();
      });
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
    // 单选
    async meetingSure() {
      let currentRow = this.$refs.componentMeeting.currentRow;
      console.log("选中", currentRow);
      if (currentRow) {
        this.meetingUploadFiles = [];
        if (currentRow.uploadFileContent) {
          let uploadFileList = JSON.parse(currentRow.uploadFileContent);
          this.meetingUploadFiles = uploadFileList;
        }
        if (currentRow.uploadFile) {
          let uploadFileList = JSON.parse(currentRow.uploadFile);
          this.meetingUploadFiles.push(...uploadFileList);
        }
        this.$set(this.formData, "meetingCode", currentRow.code);
        this.$set(this.formData, "meetingCodes", this.getCode(currentRow.code));
        if (this.meetingUploadFiles) {
          this.$set(
            this.formData,
            "metingMinutes",
            JSON.stringify(this.meetingUploadFiles)
          );
        }
      }
      this.dialogMeetingVisible = false;
    },
    getCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\|/, "-【");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\|/, "】-");

      return outputString;
    },
    // 文件预览
    handlePriview(file) {
      if (file.url.indexOf("?") != -1) {
        file.url = file.url.substr(0, file.url.indexOf("?"));
      }
      console.log("文件预览", file);
      // 由于电子签章这里目前只能预览的office一套的文件 (.pdf .doc .ppt....) 二进制类型 application/...
      // 所以判断文件类型 来判断 当前的是走电子签章 预览 还是走自己的预览方法
      this.$previewFileById(file);
    },

    // 文件下载
    handleDownload(file) {
      console.log("文件下载", file);
      // 暂时先请求下载  因为的 min 下载 没有文件名称
      this.$downFileById(file);
      return;
      if (file.url) {
        window.open(getMinioUrl(file.url), "_blank");
      } else {
        this.$downFileById(file);
      }
    },
    setTable(row) {
      let sendUnit = row.units;
      let sendUnitArr = [];
      if (sendUnit) {
        sendUnitArr = sendUnit.split(",");
      }
      let sendUnitTableData = [];
      sendUnitArr.forEach(async (val) => {
        // 请求单位下的文秘
        let params = {
          corpId: val,
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
        if (row.persons) {
          let sendUserArray = row.persons.split(",");
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
        sendUnitTableData.push({
          corpId: val,
          sendUser: useId,
          sendUserOptions: data,
          item: userIten, //当前人员的数据
        });
      });
      this.$refs.sendUnits.initTable(sendUnitTableData);
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
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  // padding: 15px;
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
/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}

.readonly {
  ::v-deep .el-input-group__append {
    color: grey;
    border-color: #e4e7ed;
  }
}

.approver {
  ::v-deep .el-form-item__label {
    letter-spacing: 2px;
  }
}
</style>

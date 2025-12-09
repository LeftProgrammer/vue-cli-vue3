<template>
  <div class="page-leave">
    <el-form ref="dataFormRef" :model="formData" :rules="formDataRules" label-width="160px" :disabled="readonly">
      <el-row :gutter="gutter">
        <el-col :span="12">
          <el-form-item label="日期" size="mini" prop="logsDate">
            <el-date-picker v-model="formData.logsDate" type="date" value-format="yyyy-MM-dd"
                            placeholder="选择开始日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="施工标段" prop="section" align="center">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" class="w-100pre" v-model="formData.section"
                       placeholder="请选择" clearable :disabled="readonly" @change="handleSectionChange"
            >
              <el-option v-for="item in sectionFixedOptions" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="12" class="grid-cell">-->
        <!--          <el-form-item label="NO." prop="no">-->
        <!--            <el-input v-model="formData.no" type="text" clearable></el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->

        <el-col :span="12">
          <el-form-item label="班次" prop="workTime" align="center">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" class="w-100pre"
                       v-model="formData.workTime" placeholder="请选择班次" clearable :disabled="readonly"
            >
              <el-option v-for="item in classs" :key="item.dictCode" :label="item.dictName" :value="item.dictCode"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="记录人员:" prop="recordingPersonnel">{{ formData.recordingPersonnel }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="监理人员" prop="supervisor">
            <el-input v-model="formData.supervisor" placeholder="请输入监理人员" width="100%">
            </el-input>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="天气情况" prop="weather" align="center">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.weather"
              placeholder="请选择"
              clearable
              :disabled="readonly"
            >
              <el-option
                v-for="item in weathers"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-col> -->

        <el-col :span="24" class="grid-cell">
          <el-form-item label="工程项目/部位" prop="place">
            <el-input v-model="formData.place" type="text" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="grid-cell">
          <el-form-item label="水文与气象情况" prop="hydrometeorology">
            <el-input v-model="formData.hydrometeorology" type="textarea" clearable rows="3" maxlength="500"
                      show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="grid-cell">
          <el-form-item label="安全监理情况" prop="safetySupervision">
            <el-input type="textarea" v-model="formData.safetySupervision" rows="3" maxlength="500"
                      show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="grid-cell">
          <el-form-item label="施工进展情况" prop="constructionProgress">
            <el-input type="textarea" v-model="formData.constructionProgress" rows="3" maxlength="2000"
                      show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="grid-cell">
          <el-form-item label="监理工作情况" prop="supervisionWork">
            <el-input type="textarea" v-model="formData.supervisionWork" rows="3" maxlength="500"
                      show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="grid-cell">
          <el-form-item label="存在的问题需协调解决事项" prop="coordinationIssues">
            <el-input type="textarea" v-model="formData.coordinationIssues" rows="3" maxlength="500"
                      show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="grid-cell">
          <el-form-item label="其他有关事项" prop="otherIssues">
            <el-input type="textarea" v-model="formData.otherIssues" rows="3" maxlength="500"
                      show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="grid-cell">
          <el-form-item label="提醒下班监理人员注意事项" prop="notes">
            <el-input type="textarea" v-model="formData.notes" rows="3" maxlength="500" show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <div class="">
            <div class="flex align-center justify-between">
              <div class="font-w-600">
                <span style="color: red; margin-right: 5px">*</span>版式文件
              </div>
              <el-button :disabled="((tabelData && tabelData.length > 0 && formData.isSigned) ||
                formData.flowStatus == 2 ||
                readonly) && !($route.query.maintenance === '1')
                " type="primary" @click="createFile"
              >预览
              </el-button>
            </div>
            <div class="bottom-line"></div>
          </div>

          <el-form ref="dataFormtable" style="margin-bottom: 20px">
            <el-table ref="multipleTable" border :data="tabelData">
              <el-table-column label="文件名称" prop="name" align="center">
              </el-table-column>
              <el-table-column label="当前节点是否签章(名)" prop="isSigned" align="center">
                <template slot-scope="scope">
                  <i v-if="scope.row.isSigned" class="el-icon-check"></i>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="name" width="250" align="center">
                <template slot-scope="{ row }">
                  <el-button @click.native.prevent="handlePreview(row, $event)" type="text" size="small">
                    预览
                  </el-button>
                  <el-button @click.native.prevent="handleDownload(row, $event)" type="text" size="small">
                    下载
                  </el-button>
                  <!--                  <el-button-->
                  <!--                    @click.native.prevent="handleNtko(row, tableData)"-->
                  <!--                    type="text"-->
                  <!--                    size="small"-->
                  <!--                    :disabled="row.isSigned || (!isStampNode && !isStartNode) || fromAppForm"-->
                  <!--                  >-->
                  <!--                    签章-->
                  <!--                  </el-button>-->
                  <!-- <ntko :handSign="true" :file="row" :compKey="compKey" :useKeySign="false" :showDate="true"
                        :isIcon="false" :disabled="row.isSigned || (!isStampNode && !isStartNode) || fromAppForm"
                        @h5SginCallBack="h5SginCallBack"
                  ></ntko> -->
                  <el-button @click.native.prevent="handleCancelNtko(row, tableData)" type="text" size="small"
                             :disabled="(!isStampNode && !isStartNode) || !row.isSigned || fromAppForm"
                  >
                    撤销签章
                  </el-button>
                  <el-button @click.native.prevent="delFile" type="text" size="small"
                             :style="!formData.flowStatus || readonly || fromAppForm ? '' : 'color:red'"
                             :disabled="!formData.flowStatus || readonly || fromAppForm"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-col>

        <el-col :span="12">
          <el-form-item label="监理单位:" prop="supervisionUnit">
            <!--            {{ formData.supervisionUnit }}-->
            <el-select @visible-change="$visibleChange($event, 'el-popper')" class="w-100pre"
                       v-model="formData.supervisionUnit" placeholder="请选择" @change="handleSelectChange"
            >
              <el-option v-for="item in belongUnit" :key="item.corpName" :label="item.corpName" :value="item.corpName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工程部位" prop="pbsCode" align="center">
            <pbs-select v-model="formData.pbsCode" :readonly="readonly" @change="choosePbs"></pbs-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="freeFlowInputShow">
          <el-form-item label="审批人" prop="freeFlowUsers">
            <!--            <el-input-->
            <!--              disabled-->
            <!--              placeholder="请选择"-->
            <!--              v-model="formData.freeFlowUsers"-->
            <!--            >-->
            <!--              <template slot="append">-->
            <!--                <div @click="freeFlowDialogShow = true">选择</div>-->
            <!--              </template>-->
            <!--            </el-input>-->
            <user v-model="formData.freeFlowUsers" :readonly="readonly" :needSection="true"
                  :sectionId="formData.section"
            >
            </user>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="24">
          <el-form-item label="备注" prop="remark" align="center">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
              v-model="formData.remark"
            >
            </el-input>
          </el-form-item>
        </el-col> -->

        <!--        <el-col :span="12">-->
        <!--          <el-form-item label="日志图片" prop="uploadFile">-->
        <!--            <uploadFile-->
        <!--              v-if="!isFromApp"-->
        <!--              ref="uploadFileRef"-->
        <!--              :readonly="readonly"-->
        <!--              :accept="'.jpg,.jpeg,.png'"-->
        <!--              v-model="formData.uploadFile"-->
        <!--              :listType="'picture-card'"-->
        <!--            ></uploadFile>-->
        <!--            <uploadFile-->
        <!--              v-else-->
        <!--              ref="uploadFileRef"-->
        <!--              :readonly="readonly"-->
        <!--              v-model="formData.uploadFile"-->
        <!--              :listType="'picture-card'"-->
        <!--            ></uploadFile>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-row>
    </el-form>

    <!--    <user-select-->
    <!--      :show.sync="freeFlowDialogShow"-->
    <!--      @user-checked="getFreeFlowUsers"-->
    <!--      :multiEnable="true"-->
    <!--    />-->
  </div>
</template>

<script>
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { dateFormat, fromApp } from "@/utils";
import { mapGetters } from "vuex";
import PbsSelect from "@/components/PbsSelect/index.vue";
import { getDictItemList } from "@/api/dict";
import { save, sectionList, BelongTo, unitList } from "./api";
import {
  getMinioUrl,
  getNtkoExe,
  getNtkoInstalled,
  ntkoFileSign,
  ntkoFormSavePDF
} from "@/utils/ntko";
import { getByCode } from "@/components/PbsSelect/api";
import { sectionAllList } from '@/views/progress/ConstructionLog/api-v3';
// import ntko from '@/components/Ntko/index.vue';
import { UploadFileMixin } from "@/mixins/UploadFileMixin";

export default {
  components: {
    // ntko,
    PbsSelect,
  },
  name: "dataform",
  mixins: [FlowFormMixin, UploadFileMixin],
  data() {
    return {
      signMarkBooksMap: {
        recordingPersonnel: {
          flowNodeName: undefined,
          required: false
        },
        stamp: {
          flowNodeName: undefined,
          required: false
        }
      },
      signPosition: {},
      formattingDocumentsPrefix: "雄安调蓄库",
      isView: false,
      currentNode: "",
      /**施工标段 */
      sectionOptions: [],
      freeFlowInputShow: false,
      freeFlowUsers: "",
      freeFlowDialogShow: false,
      userName: "",
      gutter: 20,
      pbsName: "",
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false
      },
      //当前选择行
      curRow: null,
      WorkTypes: [], //工种字典
      Equipments: [], //设备列表
      classs: [], //班次
      weathers: [], //天气
      options: [],
      //月度计划列表
      tableData: [],

      formData: {
        logsDate: "",
        pbsCode: "",
        formattingDocuments: ""
      },
      formDataRules: {
        logsDate: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        workTime: [
          { required: true, message: "请选择班次", trigger: "change" }
        ],
        pbsCode: [{ required: true, message: "请选择PBS" }],
        supervisor: [{ required: true, message: "请输入", trigger: "blur" }],
        freeFlowUsers: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        section: [
          { required: true, message: "请选择施工标段", trigger: "change" }
        ],
        uploadFile: [{ required: true, message: "请上传", trigger: "change" }],
        no: [
          {
            required: true,
            message: "请输入NO"
          }
        ],
        place: [
          {
            required: true,
            message: "请输入工程项目/部位"
          }
        ]
      },

      /**表单是否只读 */
      readonly: false,
      /**人员选择 */
      personDialog: {
        selection: [],
        show: false
      },

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
      pacId: "",

      /**接口地址：对应list接口 */
      url: {
        list: "/api/schedule/supervision/log/equipment/list"
      },
      belongUnitSouce: [], //备份 源所属机构
      belongUnit: [], //过滤出重复的单位
      isFromApp: false,
      sectionFixedOptions: [],
      compKey: new Date().getTime() + ''
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    tabelData() {
      if (
        this.formData?.formattingDocuments &&
        Array.isArray(JSON.parse(this.formData?.formattingDocuments))
      ) {
        let table = JSON.parse(this.formData?.formattingDocuments);
        console.log("table", table);
        return table;
      } else {
        return [];
      }
    },
    isStampNode() {
      console.log("当前节点权限", this.flowAuths);
      if (this.flowAuths?.stamp?.read) {
        return true;
      } else {
        return false;
      }
    },
    sectionNames() {
      return this.$store.state.systemConfig?.progressSectionNames || [];
    }
  },
  created() {
    this.getWorkType();
    this.getEquipment();
    this.getClass();
    this.getWeather();
    this.getSectionList();
    // console.log("this.$route", this.$route);
    window.OnSaveSuccess = this.OnDataParentText;
    // window["h5SginCallBack_" + this.compKey] = this.h5SginCallBack;
  },
  mounted() {
    let supervisionLogsDate = localStorage.getItem("SupervisionLogsDate");
    if (supervisionLogsDate) {
      this.$set(this.formData, "logsDate", dateFormat(supervisionLogsDate));
    } else {
      this.$set(this.formData, "logsDate", dateFormat());
    }
    this.isFromApp = fromApp();
  },
  methods: {
    handleSectionChange(val) {
      let section = this.sectionOptions.find((item) => item.id === val);
      this.formData.sectionName = section.name;
    },
    // 选择pbs后得回调
    choosePbs(pbsCode, pbsInfo) {
      console.log("pbsCode, pbsInfo", pbsCode, pbsInfo);
      let nameArr = pbsInfo.pathName.substring(1).split("/");
      let bswjPbsName = "";
      if (nameArr.length >= 3) {
        bswjPbsName = nameArr[1] + nameArr[2];
      } else if (nameArr.length === 2) {
        bswjPbsName = nameArr[0] + nameArr[1];
      } else {
        bswjPbsName = nameArr[0];
      }
      this.formData.bswjPbsName = bswjPbsName;
    },
    // 文件预览
    previewFile(row) {
      console.log("预览文件", row);
      let file = row;
      if (file.url.indexOf("?") != -1) {
        file.url = file.url.substr(0, file.url.indexOf("?"));
      }
      file.url = getMinioUrl(file.url);
      console.log("文件预览", file);
      // 由于电子签章这里目前只能预览的office一套的文件 (.pdf .doc .ppt....) 二进制类型 application/...
      // 所以判断文件类型 来判断 当前的是走电子签章 预览 还是走自己的预览方法
      this.$previewFileById(file);
    },
    // 文件下载
    async downloadFile(row) {
      console.log(row);
      let file = row;
      console.log("文件下载", file);

      if (this.fromapp) {
        //移动端下载文件
        // let fileType = file.name.split(".")[file.name.split(".").length - 1];
        let url = await this.getMinioFilePath(file);
        let params = {
          action: "downloadfile",
          params: {
            fileId: file.fileId,
            // fileType: fileType,
            fileName: file.name,
            fileUrl: url,
          },
        };
        uni.postMessage({
          data: JSON.stringify(params),
        });
      } else {
        // 暂时先请求下载  因为的 min 下载 没有文件名称
        this.$downFileById(file);
      }
      return;
      if (file.url) {
        window.open(getMinioUrl(file.url), "_blank");
      } else {
        this.$downFileById(file);
      }
    },
    async createFile() {
      // 表单校验
      let res = true;
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      if (!res) return;
      // //判断插件是否安装
      // var ntkoed = getNtkoInstalled();
      // let formData = { ...this.formData };
      // formData.place = formData.place || "无";
      // formData.hydrometeorology = formData.hydrometeorology || "无";
      // formData.safetySupervision = formData.safetySupervision || "无";
      // formData.constructionProgress = formData.constructionProgress || "无";
      // formData.supervisionWork = formData.supervisionWork || "无";
      // formData.coordinationIssues = formData.coordinationIssues || "无";
      // formData.otherIssues = formData.otherIssues || "无";
      // formData.notes = formData.notes || "无";
      // let signMarkBooks = Object.keys(this.signMarkBooksMap);
      // formData.signMarkBooks = signMarkBooks;
      // formData.recordingPersonnel = "";
      // // 解析班次
      // let classItem = this.classs.find((x) => x.dictCode == formData.workTime);
      // console.log(formData);
      // if (classItem) {
      //   formData.workTime = classItem.dictName;
      // }
      // if (ntkoed) {
      //   ntkoFormSavePDF(formData, "supervisionLogTemplate.docx");
      // } else {
      //   getNtkoExe();
      // }
    },
    //电子签章
    handleNtko(file) {
      if (file.isSigned) {
        this.$message.warning("已经完成签章!");
        return;
      }
      console.info(
        "***************************************",
        this.formData.flowName
      );
      let flowName = this.formData.flowName;
      // flowName为空时，是开始节点
      console.info(flowName);
      //计算
      // let rep = this.getSignPositon(flowName);
      // if (!rep) {
      //   this.$message.error("获取签章坐标失败!");
      //   return;
      // }

      // var flowName = this.formData.flowName;
      let json = JSON.parse(this.formData.filePath);
      console.log("json", json);
      let stamp = json[0].signPosition.stamp;
      if (this.isStartNode) {
        stamp = json[0].signPosition.recordingPersonnel;
      }
      let signPosition = {};
      signPosition["signX"] = stamp.x;
      signPosition["signY"] = stamp.y;
      signPosition["page"] = stamp.p;
      console.log("this.formData.createUsername", this.userInfo);
      let userInfo = this.$getStorage("userInfo");
      if (userInfo) {
        ntkoFileSign(file, userInfo.username, this.compKey, signPosition);
      } else {
        this.$message.error("获取用户信息失败!");
      }
    },
    // 撤销签章
    async handleCancelNtko() {
      await this.$confirm(`确认撤销签章?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      console.log(this.formData);
      let json = JSON.parse(this.formData.lastVersionFilePath);
      json[0].isSigned = false;
      this.formData.filePath = this.formData.lastVersionFilePath;
      this.formData.lastVersionFilePath = "";
      this.formData.formattingDocuments = JSON.stringify(json);
      this.formData.signedNode = this.formData.signedNode.replace(
        this.currentNode + ",",
        ""
      );
    },
    async delFile() {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning"
      });
      this.formData.formattingDocuments = "[]";
      this.formData.filePath = "[]";
    },
    //计算签章位置
    getSignPositon(flowName) {
      let rep = false;
      if (flowName) flowName = flowName.replace(/[\r\n\s]+/g, "");
      console.info("当前流程节点名称：", flowName);
      //坐标集合key为书签名称 value为x和y坐标对象
      let json = JSON.parse(this.formData.filePath);
      console.log("json", json);
      var signPosition = json[0].stamp.signPosition;
      console.info("书签坐标映射：", signPosition);
      for (var k in this.signMarkBooksMap) {
        if (this.signMarkBooksMap2[k]["flowNodeName"] === flowName) {
          rep = true;
          var xy = signPosition[k];
          console.info("当前节点对应书签名称", k);
          this.signPosition["signX"] = xy.x;
          this.signPosition["signY"] = xy.y;
          this.signPosition["page"] = xy.p;
          break;
        }
      }
      if (!rep) {
        return false;
      } else {
        return true;
      }
    },
    // h5签章回调
    h5SginCallBack(varData) {
      console.log("h5签章回调数据：", varData);
      // varData = varData.param;
      //文件保存
      if (varData) {
        let oldFile = JSON.parse(this.formData.filePath)[0];
        console.log("oldFile", oldFile);
        let file = [
          {
            blobType: varData.fileType,
            fileId: varData.fileId,
            name: oldFile.name, //newfile.fileName,
            fileSize: varData.fileSize,
            url: varData.requestRelativeUrl.substring(
              0,
              varData.requestRelativeUrl.indexOf("?") > -1
                ? varData.requestRelativeUrl.indexOf("?")
                : varData.requestRelativeUrl.length
            ),
            signPosition: oldFile.signPosition, //签章的坐标信息
            isSigned: true
          }
        ];
        //上传pdf的返回值
        this.formData.lastVersionFilePath = this.formData.filePath;
        this.formData.filePath = JSON.stringify(file);
        this.formData.formattingDocuments = JSON.stringify(file);
        // console.log(this.formData.signedNode);
        // this.formData.signedNode =
        //   (this.formData.signedNode ? this.formData.signedNode : "") +
        //   this.currentNode +
        //   ",";
      }
      this.$message.success("盖章成功！");
    },
    /**
     * 电子签章文件，保存成功后
     */
    async OnDataParentText(varData, signPositionData) {
      if (!varData || varData === "null") {
        this.$message.error("上传版式文件失败!");
        return;
      }
      console.log("OnDataParentText", varData);
      console.log("signPositionData", signPositionData);
      typeof varData === "string" && (varData = JSON.parse(varData));
      let name =
        this.formData.sectionName +
        this.formData.bswjPbsName +
        dateFormat(this.formData.logsDate, "YYYY-MM-DD") +
        "监理日志.pdf";

      if (varData.requestRelativeUrl) {
        varData.requestRelativeUrl = varData.requestRelativeUrl.substring(
          0,
          varData.requestRelativeUrl.indexOf("?")
        );
      }
      let file = [
        {
          blobType: varData.fileType,
          fileId: varData.fileId,
          name: name, //newfile.fileName,
          fileSize: varData.fileSize,
          url: varData.requestRelativeUrl,
          signPosition: JSON.parse(signPositionData) //签章的坐标信息
        }
      ];
      //上传pdf的返回值
      this.formData.filePath = JSON.stringify(file);
      this.formData.formattingDocuments = JSON.stringify(file);
      // this.formData.signedNode =
      //   (this.formData.signedNode ? this.formData.signedNode : "") +
      //   this.currentNodeSignInfo +
      //   ",";
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          console.log("sectionList", res.data);
          this.sectionOptions = res.data;
        }
      });
      // console.log("sectionNames", this.sectionNames)
      this.sectionFixedOptions = [];
      sectionAllList({}).then((res) => {
        if (res.success) {
          this.sectionFixedOptions = res.data.filter(item => this.sectionNames.includes(item.name))
        }
      });
    },
    getFreeFlowUsers(data) {
      this.freeFlowUsers = data.valueText;
      this.$set(this.formData, "freeFlowUsers", data.text);
    },
    chengeUploadList(val) {
      console.log("chengeUploadList", val);
      this.formData.uploadFile = val;
    },
    // 校验表单数据
    checkForm() {
      let flag = true;
      this.$refs["dataFormRef"].validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },

    add() {
      this.$nextTick(() => {
        console.log("this.$refs.dataFormRef", this.$refs.dataFormRef);
        this.$refs.dataFormRef.resetFields();
        this.formData = {};
        let userInfo = this.$getStorage("userInfo");
        this.userName = userInfo.realName;
        console.log("this.formData", userInfo);
        // this.formData.supervisionUnit = userInfo.departId;
        // 直接存单位名称
        this.pbsName = null;
        this.formData.supervisionUnit = userInfo.corpName;
        this.formData.logsDate = dateFormat();
      });
    },
    async edit(row) {
      console.log("row", row);
      if (row?.logsDate) {
        row.logsDate = this.timeFormat(row.logsDate, "yyyy-MM-DD");
      }

      if (row?.createUsername) {
        this.userName = row.createUsername;
      } else {
        this.userName = this.$store.state.user.loginInfo.realName;
      }
      this.formData = { ...row };
    },
    //
    /**获取班次字典 */
    async getWeather() {
      const { data } = await getDictItemList("WEATHER");
      this.weathers = data;
      console.log("weathers", data);
    },

    /**获取班次字典 */
    async getClass() {
      const { data } = await getDictItemList("CLASS");
      this.classs = data;
      console.log("classs", data);
    },
    /**获取工种字典 */
    async getWorkType() {
      const { data } = await getDictItemList("TYPE_OF_WORKk");
      this.WorkTypes = data;
      console.log("WorkTypes", data);
    },

    /**获取设备字典 */
    async getEquipment() {
      const { data } = await getDictItemList("EQUIPMENT");
      this.Equipments = data;
      console.log("Equipments", data);
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    async beforeSend() {
      this.sendFlowJson = {
        spr: {
          type: "user",
          value: this.formData.freeFlowUsers
        }
      };
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback, event) {
      console.log("fields", fields);

      //判断 fields.formattingDocuments 字段如果是数组  且有数据就可以提交
      // 尝试解析字段为数组
      if (!fields?.formattingDocuments) {
        this.$message.warning("请点击预览生成版式文件");
        return;
      }
      let formattingDocuments = JSON.parse(fields.formattingDocuments);

      // 检查解析后的数组是否为真正的数组并且包含数据
      if (
        Array.isArray(formattingDocuments) &&
        formattingDocuments.length > 0
      ) {
        // 数组中有数据，执行相关操作
      } else {
        // 数组为空，返回
        this.$message.warning("请点击预览生成版式文件");
        return;
      }

      // 退回操作时不检验
      if (this.postMessageData.btnKey !== "return") {
        if (this.isStampNode || this.isStartNode) {
          // 是否签章
          if (
            !this.tabelData ||
            this.tabelData.length === 0 ||
            !this.tabelData[0].isSigned
          ) {
            this.$message.warning("请先完成文件签章");
            return;
          }
        }
      }

      console.log("this.iframeEvent", this.iframeEvent.data.page);
      console.log("this.iframeEvent", this.postMessageData.btnKey);
      if (
        this.iframeEvent?.data?.page == "mine" ||
        this.iframeEvent?.data?.page == "wait"
      ) {
        fields.newVersion = 1;
      }
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
      console.log("save fields", fields);
      localStorage.setItem("SupervisionLogsDate", this.formData.logsDate);
      if (this.isStartNode && this.postMessageData.btnKey === "send") {
        let json = JSON.parse(this.formData.filePath);
        json[0].isSigned = false;
        this.formData.filePath = JSON.stringify(json);
        this.formData.formattingDocuments = JSON.stringify(json);
      }
      //做业务数据的保存,修改。
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
    handleSelectChange(e) {
      console.log(e);
      this.$forceUpdate();
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
        userId: userInfo.userId
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
          if (row?.supervisionUnit) {
            // await this.unitChangeHandle(row.unit);
          } else {
            let defaultUnit = this.belongUnitSouce.find((x) => x.defaultOrg);
            if (defaultUnit) {
              this.$set(this.formData, "supervisionUnit", defaultUnit.corpName);
              // await this.unitChangeHandle(defaultUnit.corpId);
            } else {
              this.formData.supervisionUnit = "";
              // this.$refs.dataFormRef.clearValidate("contractId");
            }
          }
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        console.log("获取表单数据", row);
        if (!row) {
          const loginInfo = this.$getStorage("userInfo");
          this.formData.recordingPersonnel = loginInfo.realName;
          // this.formData.supervisionUnit = loginInfo.corpName;
          console.log("新增加", loginInfo);
          await this.getBelongTo();
          this.$nextTick(() => {
            this.freeFlowInputShow = true;
          });
          return;
        }

        // 判断当前节点是否签章
        if (row.fileList) {
          if (row.fileList[0] && row.signedNode) {
            console.log(row.signedNode.indexOf(this.currentNode) > -1);
            row.fileList[0].isSigned =
              row.signedNode.indexOf(this.currentNode) > -1;
          } else {
            row.fileList[0].isSigned = false;
          }
        }

        if (row.flowStatus == 1 || row.flowStatus == 2) {
          await this.getUnitList();
          // await this.unitChangeHandle(row.unit);
          // this.getContractList();
        } else {
          await this.getBelongTo(row);
        }

        console.log("表单数据", row);
        // Set recordingPersonnel based on createUsername or user loginInfo
        row.recordingPersonnel =
          row.createUsername || this.$store.state.user.loginInfo.realName;

        // Format logsDate
        row.logsDate = dateFormat(row.logsDate, "yyyy-MM-DD");

        const processUploadFile = () => {
          if (row.uploadFile) {
            this.$nextTick(() => {
              if (
                this.$refs.uploadFileRef &&
                typeof this.$refs.uploadFileRef.setImg === "function"
              ) {
                this.$refs.uploadFileRef.setImg(row.uploadFile);
              } else {
                // If the component or method is not available, retry up to 10 times
                if (processUploadFile.retryCount < 10) {
                  processUploadFile.retryCount++;
                  setTimeout(processUploadFile, 500);
                } else {
                  // If it exceeds 10 retries, log an error
                  console.error(
                    "UploadFile component is not available after 10 retries."
                  );
                }
              }
            });
          }
        };

        // Initialize the retry count
        processUploadFile.retryCount = 0;

        // Start the process
        processUploadFile();

        this.formData = row;
        this.$nextTick(async () => {
          // 自由流程第一人
          let b = row.createUser == this.$getStorage("userInfo").userId;
          console.log("是否显示自由流程第一人", b, this.readonly);
          this.freeFlowInputShow = b && !this.readonly;

          // 板式文件名称
          let section = this.sectionOptions.find(
            (item) => item.id === this.formData.section
          );
          this.formData.sectionName = section.name;
          let res = await getByCode(this.formData.pbsCode);
          if (res.success) {
            let nameArr = res.data.pathName.substring(1).split("/");
            let bswjPbsName = "";
            if (nameArr.length >= 3) {
              bswjPbsName = nameArr[1] + nameArr[2];
            } else if (nameArr.length === 2) {
              bswjPbsName = nameArr[0] + nameArr[1];
            } else {
              bswjPbsName = nameArr[0];
            }
            this.formData.bswjPbsName = bswjPbsName;
          }
        });
      } catch (error) {
        // Handle any errors that occur during the getFlowRow() operation.
        console.error("Error while fetching data:", error);
      }
    }
  }
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

.bottom-line {
  margin: 10px 0;
  height: 1px;
  background-color: #e5e5ee;
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
</style>

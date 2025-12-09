<template>
  <div class="page-leave">
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="160px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="日期" size="mini" prop="logsDate">
              <el-date-picker
                v-model="formData.logsDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开始日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="班次" prop="workTime" align="center">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.workTime"
                placeholder="请选择班次"
                clearable
                :disabled="readonly"
              >
                <el-option
                  v-for="item in classs"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          </el-col>

          <el-col :span="8">
            <el-form-item label="项目部领导" prop="projectLeader">
              <el-input
                v-model="formData.projectLeader"
                placeholder="请输入项目部领导"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="生产办(区)领导" prop="productionLeader">
              <el-input
                v-model="formData.productionLeader"
                placeholder="请输入生产办(区)领导"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="记录人员:">{{
              formData.RecordingPersonnel
            }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="施工标段" prop="section" align="center">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.section"
                placeholder="请选择"
                clearable
                :disabled="readonly"
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

          <el-col :span="8">
            <el-form-item label="施工单位:" prop="constructionUnit">
              {{ formData.constructionUnit }}
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="工程部位" prop="pbsCode" align="center">
              <template>
                <el-input disabled placeholder="请选择" v-model="pbsName">
                  <template slot="append">
                    <div @click.stop="showPbs">选择</div>
                  </template>
                </el-input>
              </template>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="" label-width="75px" prop="name">
              <template>
                <div class="flex font-w-550">
                  <div>
                    <span>总起止桩号：</span>
                    <span>{{ allStartStakeMark }}</span>
                  </div>
                  <div class="mx-50">
                    <span>最近施工起止桩号：</span>
                    <span>{{ recentlyStakeMark }}</span>
                  </div>
                  <div>
                    <span>施工方向：</span>
                    <span>{{ formData.constructionDirection }}</span>
                  </div>
                </div>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="本次进尺(m)" prop="drillingFootage">
              <el-input
                v-model="formData.drillingFootage"
                placeholder="请输入"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="起桩号" prop="name">
              <el-input
                v-model="formData.startStakeMark"
                placeholder="请输入"
                width="100%"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="止桩号：" prop="endStakeMark">
              <span> {{ endStakeMark }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="备注" prop="remark" align="center">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="formData.remark"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="日志图片" prop="uploadFile">
              <el-upload
                ref="uploadFileRef"
                :file-list="uploadFileList"
                action="/api/attachments/single-upload"
                :before-upload="attachmentsBeforeUpload"
                :on-success="handelUploadSuccess"
                :on-remove="handleRemove"
                :on-preview="handlePreview"
                :disabled="readonly"
                width="100%"
              >
                <el-button size="small" type="primary" icon="el-icon-upload"
                  >文件上传</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  只能上传不超过 20MB 的文件
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <el-row :gutter="20" class="table">
      <el-col :span="12">
        <div class="">
          <div class="flex align-center justify-between">
            <div class="font-w-600">人员投入</div>
            <div
              class="iconfont icon-add poniter"
              v-if="!readonly"
              @click="addPerson"
            ></div>
          </div>
          <div class="bottom-line"></div>
        </div>
        <el-table ref="multipleTable" border :data="formData.personList">
          <el-table-column label="工种" prop="type" align="center">
            <template slot-scope="{ row }">
              <span v-if="readonly">{{
                $DictionaryParsing(WorkTypes, row.type)
              }}</span>
              <el-select @visible-change="$visibleChange($event, 'el-popper')" v-else v-model="row.type">
                <el-option
                  v-for="item in WorkTypes"
                  :key="item.dictCode"
                  :value="item.dictCode"
                  :label="item.dictName"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="人数" prop="quantity" align="center">
            <template slot-scope="{ row }">
              <span v-if="readonly">{{ row.quantity }}</span>
              <el-input
                v-else
                v-model="row.quantity"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="备注" prop="remark" align="center">
            <template slot-scope="{ row }">
              <span v-if="readonly">{{ row.remark }}</span>
              <el-input
                v-else
                type="textarea"
                :rows="1"
                placeholder="请输入备注"
                v-model="row.remark"
                :disabled="readonly"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="delPerson(scope.$index, tableData)"
                type="text"
                size="small"
                :disabled="readonly"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="12">
        <div class="">
          <div class="flex align-center justify-between">
            <div class="font-w-600">设备投入</div>
            <div
              class="iconfont icon-add poniter"
              v-if="!readonly"
              @click="addEquipment"
            ></div>
          </div>
          <div class="bottom-line"></div>
        </div>
        <el-table ref="multipleTable" border :data="formData.equipmentList">
          <el-table-column label="设备" prop="type" align="center">
            <template slot-scope="{ row }">
              <span v-if="readonly">{{
                $DictionaryParsing(Equipments, row.type)
              }}</span>
              <el-select @visible-change="$visibleChange($event, 'el-popper')" v-else v-model="row.type">
                <el-option
                  v-for="item in Equipments"
                  :key="item.dictCode"
                  :value="item.dictCode"
                  :label="item.dictName"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="人数" prop="quantity" align="center">
            <template slot-scope="{ row }">
              <span v-if="readonly">{{ row.quantity }}</span>
              <el-input
                v-else
                v-model="row.quantity"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="备注" prop="remark" align="center">
            <template slot-scope="{ row }">
              <span v-if="readonly">{{ row.remark }}</span>
              <el-input
                v-else
                type="textarea"
                :rows="1"
                placeholder="请输入备注"
                v-model="row.remark"
                :disabled="readonly"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="delEquipment(scope.$index, tableData)"
                type="text"
                size="small"
                :disabled="readonly"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <pbs-select
      :visible.sync="pbsDialog.show"
      :selection="pbsDialog.selection"
      @childEvt="pbsSelectedHandle"
      @closed="pbsDialog.show = false"
    />
  </div>
</template>

<script>
import { save, sectionList, selectByPbs } from "./api";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { numberParseChina } from "@/utils/math";
import { getDictItemList } from "@/api/dict";
import PbsSelect from "@/components/PbsSelect/index.vue";
export default {
  name: "dataform",
  mixins: [FlowFormMixin],
  components: { PbsSelect },
  data() {
    return {
      recentlyStakeMark: "",
      allStartStakeMark: "", //总起止桩号
      pbsName: "",
      WorkTypes: [], //工种字典
      Equipments: [], //设备列表
      classs: [], //班次
      weathers: [], //天气

      uploadFileList: [],
      options: [],
      //月度计划列表
      tableData: [],
      formData: {
        id: null,
        personList: [], //人员列表
        equipmentList: [], //设备列表
      },
      formDataRules: {
        logsDate: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        workTime: [
          { required: true, message: "请选择班次", trigger: "change" },
        ],
        drillingFootage: [
          { required: true, message: "请输入进尺", trigger: "blur" },
        ],

        section: [{ required: true, message: "请选择", trigger: "blur" }],
        pbsCode: [{ required: true, message: "请选择", trigger: "blur" }],
      },

      /**表单是否只读 */
      readonly: false,

      /**人员选择 */
      personDialog: {
        selection: [],
        show: false,
      },
      /**PBS选择 */
      pbsDialog: {
        selection: [],
        show: false,
      },

      //当前选择行
      curRow: null,

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
      /**施工标段 */
      sectionOptions: [],
      businessId: "",
      pacId: "",

      /**接口地址：对应list接口 */
      url: {
        list: "/api//design/plan/list",
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    endStakeMark() {
      return (
        Number(this.formData?.drillingFootage) +
        Number(this.formData?.startStakeMark)
      );
    },
  },
  created() {
    this.getWorkType();
    this.getEquipment();
    this.getClass();
    this.getWeather();
    this.getSectionList();
    // console.log("this.$route", this.$route);
  },
  methods: {
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          console.log("sectionList", res.data);
          this.sectionOptions = res.data;
        }
      });
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

    // table 添加人员
    addPerson() {
      this.formData.personList.push({
        type: "",
        quantity: "",
        remark: "",
      });
      console.log("this.personList", this.formData);
    },
    delPerson(index, row) {
      this.formData.personList.splice(index, 1);
    },
    // table 添加设备
    addEquipment() {
      this.formData.equipmentList.push({
        type: "",
        quantity: "",
        remark: "",
      });
      console.log("this.equipmentList", this.formData);
    },
    delEquipment(index, row) {
      this.formData.equipmentList.splice(index, 1);
      console.log("this.equipmentList", this.formData);
    },

    /** 人员选择回调*/
    getUsers(data) {
      console.log("this.curRow", this.curRow, data);
      // this.formData.applyUserId = data.valueText || "";
      // this.formData.applyUser = data.text || "";
      //更新子表
      if (this.curRow) {
        this.curRow.charge = data.valueText || "";
        this.curRow.chargeName = data.text || "";
      }
      this.$set(this.tableData, this.curRow.$index, { ...this.curRow });
      // this.$forceUpdate();
    },
    /** 选择人员点击*/
    showPerson(row) {
      this.personDialog.selection = row.charge ? [row.charge] : [];
      this.curRow = row;
      this.personDialog.show = true;
    },
    /** 选择人员清空时*/
    clearEvt(row, type) {
      if (type === "person") {
        row.charge = "";
        row.chargeName = "";
      }
      if (type === "pbs") {
        row.projectPbs = "";
        row.projectPbsName = "";
      }
      console.log("clearEvt", row, type);
    },
    getPbsName(val) {
      let text = "*";
      console.log("getPbsName", val);
      let a = val?.split("&&&")[1];
      if (a) {
        text = a;
      }
      return text;
    },
    allMark(val) {
      let text = "*";
      console.log("allMark", val);
      let a = val?.split("&&&")[2];
      if (a) {
        text = a;
      }
      return text;
    },

    /**
     * 获取表单数据
     */
    getFormData() {
      this.getFlowRow().then((row) => {
        if (row) {
          console.log("表单数据", row);
          if (row.createUsername) {
            row.RecordingPersonnel = row.createUsername;
          } else {
            row.RecordingPersonnel = this.$store.state.user.loginInfo.realName;
          }
          row.logsDate = dateFormat(row.logsDate, "yyyy-MM-DD");
          console.log("row", row);
          if (row.pbsCode) {
            this.pbsName = this.getPbsName(row.pbsCode);
            this.allStartStakeMark = this.allMark(row.pbsCode);
            this.getSelectByPbs(row.pbsCode);
          }
          this.formData = row;
        } else {
          //新增时
          let loginInfo = this.$getStorage("userInfo");
          this.formData.RecordingPersonnel = loginInfo.realName;
          this.formData.constructionUnit = loginInfo.corpName;
          console.log("新增加", loginInfo);
          this.getDictItemList(this.designClassifyCode, () => {
            this.getSubTableData(this.businessId);
          });
        }
      });
    },
    /**获取子表数据 */
    getSubTableData(businessId, detailList) {
      let tableData = [];
      console.log("this.designClassifyOptions", this.designClassifyOptions);
      // console.log("numberParseChina", numberParseChina);
      for (let i = 0; i < this.designClassifyOptions.length; i++) {
        const option = this.designClassifyOptions[i];
        let row = {
          id: "0",
          pid: "0",
          taskName: option.dictName,
          sortNum: numberParseChina(i),
          baseId: businessId,
          classify: option.dictCode,
          classifyName: option.dictName,
          isClassify: true,
        };
        if (detailList && detailList.length > 0) {
          let curDetailList = detailList.filter(
            (x) => x.classify === option.dictCode
          );
          for (let i = 0; i < curDetailList.length; i++) {
            let child = curDetailList[i];
            child.isClassify = false;
            child.children = this.computeChildren(child.id, detailList);
          }
          //计算children
          row.children = curDetailList.filter((x) => x.pid === "0");
          tableData.push(row);
          tableData.push(...curDetailList);
        } else {
          tableData.push(row);
        }
      }
      console.log("tableData", tableData);
      this.tableData = tableData;
    },
    //计算children
    computeChildren(pid, detailList) {
      let children = detailList.filter((x) => x.pid === pid);
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        child.isClassify = false;
        child.children = this.computeChildren(child.id, detailList);
      }
      return children;
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      console.log("save fields", fields);

      fields.uploadFile = JSON.stringify(fields.uploadFileList);

      //做业务数据的保存,修改。
      save(fields)
        .then((res) => {
          const { success, message, data } = res;

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
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designClassifyCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designClassifyOptions = items;
            callback && callback();
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
          this.getDictItems(code).then((items) => {
            this.designProfessionOptions = items;
          });
        } else {
        }
      }
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**
     * 附件上传成功
     */
    handelUploadSuccess(res) {
      /**
       * fileId: "1131652491704795136"
        filename: "1131652491696406528.docx"
        name:"1-1软件著作权产品说明书模版.docx"
        relativePath: null
        requestUri: "/temporary/2023-07-20/1131652491696406528.docx"
        requestUrl: null
       */
      if (!this.formData.uploadFileList) {
        this.formData.uploadFileList = [];
      }
      this.formData.uploadFileList.push(res.data);
    },
    /**
     * 附件删除
     */
    handleRemove(file) {
      if (
        file.fileId &&
        this.formData.uploadFileList &&
        this.formData.uploadFileList.length
      ) {
        this.formData.uploadFileList = this.formData.uploadFileList.filter(
          (item) => item.fileId !== file.fileId
        );
      }
    },
    /**
     * 附件预览
     */
    handlePreview(file) {
      window.open(`/api/attachments/download?attId=${file.fileId}`, "_blank");
    },
    /**
     * 附件上传前
     */
    attachmentsBeforeUpload(file) {
      const isRightSize = file.size / 1024 / 1024 < 20;
      if (!isRightSize) {
        this.$message.error("文件大小超过 20MB");
        return false;
      }
      return isRightSize;
    },

    /** 选择PBS */
    showPbs() {
      if (this.readonly) {
        this.$message.warning("当前为只读模式，无法选择PBS");
        return;
      }
      this.pbsDialog.show = true;
    },
    pbsSelectedHandle(pbs) {
      console.log("pbs", pbs);
      this.pbsName = pbs.name;
      this.allStartStakeMark = pbs.startStakeMark + "~" + pbs.endStakeMark;
      this.formData.pbsCode =
        pbs.code + "&&&" + pbs.name + "&&&" + this.allStartStakeMark;
      this.formData.endStakeMark = pbs.endStakeMark;
      this.formData.constructionDirection = pbs.constructionDirection;
      this.getSelectByPbs(this.formData.pbsCode);
    },

    getSelectByPbs(code) {
      let param = {
        pbsCode: code,
      };
      selectByPbs(param).then((res) => {
        console.log("获取最近桩号", res);
        if (res.success && res.data?.startStakeMark) {
          this.recentlyStakeMark = res.data.startStakeMark;
          if (!this.startStakeMark) {
            this.startStakeMark = res.data.endStakeMark;
          }
        }
      });
    },
  },
  watch: {
    tableData: {
      handler() {
        if (this.tableData && this.tableData.length) {
          this.formData.designPlanDetailList = this.tableData.filter(
            (x) => x.isClassify === false
          );
        }
      },
      immediate: true,
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

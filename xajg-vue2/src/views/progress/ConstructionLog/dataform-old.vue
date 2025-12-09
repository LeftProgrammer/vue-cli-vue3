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
              <pbs-select
                v-model="formData.pbsCode"
                :readonly="readonly"
                @change="choosePbs"
              ></pbs-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="freeFlowInputShow">
            <el-form-item label="审批人" prop="freeFlowUsers">
              <el-input
                disabled
                placeholder="请选择"
                v-model="formData.freeFlowUsers"
              >
                <template slot="append">
                  <div @click="freeFlowDialogShow = true">选择</div>
                </template>
              </el-input>
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
                    <span>{{
                      $DictionaryParsing(
                        constructionOptions,
                        formData.constructionDirection
                      )
                    }}</span>
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
                type="number"
                @input="
                  formData.drillingFootage = formData.drillingFootage.replace(
                    /^(\-)*(\d+)\.(\d{3}).*$/,
                    '$1$2.$3'
                  )
                "
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="起桩号" prop="startStakeMark">
              <div class="flex">
                <!-- <el-input
                  v-model="startStakeMarkvalue1"
                  type="number"
                  placeholder="请输入"
                  width="100%"
                  @input="
                    startStakeMarkvalue1 = startStakeMarkvalue1.replace(
                      /^(\-)*(\d+)\.(\d{0}).*$/,
                      '$1$2.$3'
                    )
                  "
                >
                </el-input> -->
                <!-- <span class="mx-10">+</span> -->
                <el-input
                  type="number"
                  v-model="formData.startStakeMark"
                  placeholder="请输入"
                  width="100%"
                  @input="
                    formData.startStakeMark = formData.startStakeMark.replace(
                      /^(\-)*(\d+)\.(\d{3}).*$/,
                      '$1$2.$3'
                    )
                  "
                >
                </el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="止桩号：" prop="endStakeMark">
              <div>
                <!-- <span> {{ endStakeMark1 }}</span>
                <span class="mx-10">+</span> -->
                <span> {{ endStakeMark2 }}</span>
              </div>
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
              <uploadFile
                ref="uploadFileRef"
                :readonly="readonly"
                v-model="formData.uploadFile"
                :accept="'.jpg,.png,.gif'"
                listType="picture-card"
                :limit="100"
              >
              </uploadFile>
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
        <el-form ref="dataFormtable">
          <el-table ref="multipleTable" border :data="formData.personList">
            <el-table-column
              label="工种"
              prop="type"
              align="center"
              class-name="taskname"
            >
              <template slot-scope="{ row }">
                <span v-if="readonly">{{
                  $DictionaryParsing(WorkTypes, row.type)
                }}</span>

                <el-form-item v-else :error="row.typeError">
                  <el-select @visible-change="$visibleChange($event, 'el-popper')"
                    v-model="row.type"
                    @change="tableParValueChange(row, 'type', 'typeError')"
                  >
                    <el-option
                      v-for="item in WorkTypes"
                      :key="item.dictCode"
                      :value="item.dictCode"
                      :label="item.dictName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="人数"
              prop="quantity"
              align="center"
              class-name="taskname"
            >
              <template slot-scope="{ row }">
                <span v-if="readonly">{{ row.quantity }}</span>

                <el-form-item v-else :error="row.quantityError">
                  <el-input
                    placeholder="请输入"
                    @blur="
                      tableParValueChange(row, 'quantity', 'quantityError')
                    "
                    type="number"
                    v-model="row.quantity"
                    @input="
                      () => {
                        row.quantity = formatValue(row.quantity);
                      }
                    "
                  ></el-input>
                </el-form-item>
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
            <el-table-column
              label="操作"
              prop="name"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="delPerson(scope.$index, tableData)"
                  type="text"
                  size="small"
                  style="color: red"
                  :disabled="readonly"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
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
        <el-form ref="dataFormtable">
          <el-table ref="multipleTable" border :data="formData.equipmentList">
            <el-table-column
              label="设备"
              prop="type"
              align="center"
              class-name="taskname"
            >
              <template slot-scope="{ row }">
                <span v-if="readonly">{{
                  $DictionaryParsing(Equipments, row.type)
                }}</span>
                <el-form-item v-else :error="row.typeError">
                  <el-select @visible-change="$visibleChange($event, 'el-popper')"
                    v-model="row.type"
                    @change="tableParValueChange(row, 'type', 'typeError')"
                  >
                    <el-option
                      v-for="item in Equipments"
                      :key="item.dictCode"
                      :value="item.dictCode"
                      :label="item.dictName"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              prop="quantity"
              align="center"
              class-name="taskname"
            >
              <template slot-scope="{ row }">
                <span v-if="readonly">{{ row.quantity }}</span>
                <el-form-item v-else :error="row.quantityError">
                  <el-input
                    type="number"
                    v-model="row.quantity"
                    @blur="
                      tableParValueChange(row, 'quantity', 'quantityError')
                    "
                    @input="
                      () => {
                        row.quantity = formatValue(row.quantity);
                      }
                    "
                  ></el-input>
                </el-form-item>
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
            <el-table-column
              label="操作"
              prop="name"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="delEquipment(scope.$index, tableData)"
                  type="text"
                  size="small"
                  :disabled="readonly"
                  style="color: red"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
    </el-row>

    <user-select
      :show.sync="freeFlowDialogShow"
      @user-checked="getFreeFlowUsers"
      :multiEnable="true"
    />
  </div>
</template>

<script>
import { save, sectionList, selectByPbs } from "./api";
import { dateFormat } from "@/utils";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { getDictItemList } from "@/api/dict";
import UserSelect from "@/components/newUserSelect/index.vue";
export default {
  name: "dataform",
  components: {
    UserSelect
  },
  mixins: [FlowFormMixin],
  data() {
    return {
      /** */
      /** */
      freeFlowInputShow: false,
      freeFlowUsers: "",
      freeFlowDialogShow: false,
      startStakeMarkvalue1: "",
      startStakeMarkvalue2: "",
      endStakeMark1: "",
      endStakeMark2: "",
      recentlyStakeMark: "",
      allStartStakeMark: "", //总起止桩号
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
        startStakeMark: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        freeFlowUsers: [
          { required: true, message: "请选择", trigger: "change" },
        ],
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
      //
      constructionOptions: [],
      businessId: "",
      pacId: "",

      /**接口地址：对应list接口 */
      url: {
        list: "/api/schedule/construction/log/information/page",
      },
    };
  },
  computed: {},

  created() {
    this.getConstructionOptions();
    this.getWorkType();
    this.getEquipment();
    this.getClass();
    this.getWeather();
    this.getSectionList();
    // console.log("this.$route", this.$route);
  },
  mounted() {
    // this.formData.logsDate = dateFormat();
    this.$set(this.formData, "logsDate", dateFormat());
  },
  methods: {
    getFreeFlowUsers(data) {
      this.freeFlowUsers = data.valueText;
      this.$set(this.formData, "freeFlowUsers", data.text);
    },
    doSomething() {
      console.log("查看时候点击");
    },
    //table 校验
    tableParValueChange(row, field, errTips) {
      if (row[field] && row[field] !== "") {
        this.$set(row, errTips, "");
      } else {
        this.$set(row, errTips, "必填");
      }
    },
    formatValue(value) {
      value = value.replace(/[^0-9]/g, "");
      value = value.replace(/^(\-)*(\d+)\.(\d{1}).*$/, "$1$2.$3");
      return value;
    },
    chengeUploadList(val) {
      console.log("chengeUploadList", val);
      this.formData.uploadFile = val;
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
    },
    //

    /**获取班次字典 */
    async getConstructionOptions() {
      const { data } = await getDictItemList("sgfx");
      this.constructionOptions = data;
      console.log("constructionOptions", data);
    },

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
    async delPerson(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      });
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
    async delEquipment(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      });
      this.formData.equipmentList.splice(index, 1);
      console.log("this.equipmentList", this.formData);
    },

    /** 人员选择回调*/
    getUsers(data) {
      console.log("this.curRow", this.curRow, data);
      if (this.curRow) {
        this.curRow.charge = data.valueText || "";
        this.curRow.chargeName = data.text || "";
      }
      this.$set(this.tableData, this.curRow.$index, { ...this.curRow });
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
    // 选择pbs后得回调
    choosePbs(pbsCode, pbsInfo) {
      console.log("pbsCode, pbsInfo", pbsCode, pbsInfo);
      // 后端 没有存下 allStartStakeMark 字段
      this.allStartStakeMark =
        pbsInfo.startStakeMark + "~" + pbsInfo.endStakeMark;
      this.formData.endStakeMark = pbsInfo.endStakeMark;
      this.formData.constructionDirection = pbsInfo.constructionDirection;
      // 获取最近施工起止桩号
      this.getSelectByPbs(this.formData.pbsCode);
    },

    /**
     * 获取表单数据
     */
    async getFormData() {
      try {
        const row = await this.getFlowRow();
        if (!row) {
          const loginInfo = this.$getStorage("userInfo");
          this.formData.RecordingPersonnel = loginInfo.realName;
          this.formData.constructionUnit = loginInfo.corpName;
          console.log("新增加", loginInfo);
          this.$nextTick(() => {
            this.freeFlowInputShow = true;
          });
          return;
        }
        console.log("表单数据", row);
        // Set RecordingPersonnel based on createUsername or user loginInfo
        row.RecordingPersonnel =
          row.createUsername || this.$store.state.user.loginInfo.realName;

        // Format logsDate
        row.logsDate = dateFormat(row.logsDate, "yyyy-MM-DD");

        if (row.pbsCode) {
          // 获取总起止桩号 总起止桩号 就是现在
          const data = await this.$getPbsInfoByCode(row.pbsCode);
          this.choosePbs(row.pbsCode, data);
          // this.allStartStakeMark = await this.$getPbsInfoByCode(row.pbsCode);
          this.getSelectByPbs(row.pbsCode);
        }

        // Define a function to process uploadFile
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
    async beforeSend() {
      this.sendFlowJson = {
        spr: {
          type: "user",
          value: this.formData.freeFlowUsers,
        },
      };
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      console.log("save fields", fields);
      let isok = true;
      fields.personList.forEach((item, index) => {
        if (!item.type) {
          isok = false;
          this.$set(item, "typeError", "必填");
        }
        if (!item.quantity) {
          isok = false;
          this.$set(item, "quantityError", "必填");
        }
      });
      fields.equipmentList.forEach((item, index) => {
        if (!item.type) {
          isok = false;
          this.$set(item, "typeError", "必填");
        }
        if (!item.quantity) {
          isok = false;
          this.$set(item, "quantityError", "必填");
        }
      });
      console.log("isok", isok);
      //做业务数据的保存,修改。
      if (!isok) return;
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
    startStakeMarkvalue1: {
      handler(newvalue) {
        if (newvalue && this.startStakeMarkvalue2) {
          this.$set(
            this.formData,
            "startStakeMark",
            newvalue + this.startStakeMarkvalue2
          );
        } else {
          this.$set(this.formData, "startStakeMark", "");
        }
        // 这里也要做一个判断 以防万一  这个人先输入后面的在输入前面的
        // 整数部分
        let parInt = parseInt(
          (Number(this.formData.drillingFootage) +
            Number(this.startStakeMarkvalue2)) /
            1000
        );
        // 余数部分
        let flot = "";
        if (
          Number(this.formData.drillingFootage) +
            Number(this.startStakeMarkvalue2) >=
          1000
        ) {
          flot =
            (Number(this.formData.drillingFootage) +
              Number(this.startStakeMarkvalue2)) %
            1000;
        } else {
          flot =
            Number(this.formData.drillingFootage) +
            Number(this.startStakeMarkvalue2);
        }
        if (parInt > 0) {
          this.endStakeMark1 = Number(newvalue) + parInt;
        } else {
          this.endStakeMark1 = Number(newvalue);
        }
        this.endStakeMark2 = Number(flot).toFixed(3);
      },
      immediate: true,
      deep: true,
    },
    startStakeMarkvalue2: {
      handler(newvalue) {
        console.log("startStakeMarkvalue2", newvalue);
        if (this.startStakeMarkvalue1 && newvalue) {
          this.formData.startStakeMark = this.$set(
            this.formData,
            "startStakeMark",
            this.startStakeMarkvalue1 + Number(newvalue)
          );
        } else {
          this.$set(this.formData, "startStakeMark", "");
        }
        // 如果当前 startStakeMarkvalue2   +this.formData.drillingFootage 大于等于1000 就  endStakeMark1＋1
        // 整数部分
        let parInt = parseInt(
          (Number(newvalue) + Number(this.formData.drillingFootage)) / 1000
        );
        console.log("parInt", parInt);
        // 余数部分
        let flot = "";
        if (Number(newvalue) + Number(this.formData.drillingFootage) >= 1000) {
          flot =
            (Number(newvalue) + Number(this.formData.drillingFootage)) % 1000;
        } else {
          flot = Number(newvalue) + Number(this.formData.drillingFootage);
        }
        console.log("flot", flot);
        if (parInt > 0) {
          this.endStakeMark1 = Number(this.startStakeMarkvalue1) + parInt;
        } else {
          this.endStakeMark1 = Number(this.startStakeMarkvalue1);
        }
        this.endStakeMark2 = Number(flot).toFixed(3);
      },
      immediate: true,
      deep: true,
    },
    //

    "formData.startStakeMark": {
      handler(newvalue) {
        // 如果当前 startStakeMarkvalue2   +this.formData.drillingFootage 大于等于1000 就  endStakeMark1＋1
        // 整数部分
        // let parInt = parseInt(
        //   (Number(newvalue) + Number(this.startStakeMarkvalue2)) / 1000
        // );
        // // 余数部分
        // let flot = "";
        // if (Number(newvalue) + Number(this.startStakeMarkvalue2) >= 1000) {
        //   flot = (Number(newvalue) + Number(this.startStakeMarkvalue2)) % 1000;
        // } else {
        //   flot = Number(newvalue) + Number(this.startStakeMarkvalue2);
        // }
        // if (parInt > 0) {
        //   this.endStakeMark1 = Number(this.startStakeMarkvalue1) + parInt;
        // } else {
        //   this.endStakeMark1 = this.startStakeMarkvalue1;
        // }
        this.endStakeMark2 = (
          Number(
            this.formData.drillingFootage ? this.formData.drillingFootage : 0
          ) + Number(newvalue)
        ).toFixed(3);
      },
      immediate: true,
      deep: true,
    },
    "formData.drillingFootage": {
      handler(newvalue) {
        // 如果当前 startStakeMarkvalue2   +this.formData.drillingFootage 大于等于1000 就  endStakeMark1＋1

        this.endStakeMark2 = (
          Number(newvalue ? newvalue : 0) + Number(this.formData.startStakeMark)
        ).toFixed(3);
      },
      immediate: true,
      deep: true,
    },
    "formData.uploadFile": {
      handler(newvalue) {
        console.log("数据变化", newvalue);
      },
      deep: true,
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

/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;
  }
}
/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
}
</style>

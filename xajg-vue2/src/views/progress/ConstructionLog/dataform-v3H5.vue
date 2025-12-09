<template>
  <div class="page-leave apph5-parent">
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-form
        ref="dataFormRef"
        label-position="left"
        :model="formData"
        :rules="formDataRules"
        label-width="80px"
        size="small"
        :disabled="isAppH5"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="施工单位" prop="constructionUnit">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                :disabled="readonly"
                class="w-100pre"
                v-model="formData.constructionUnit"
                placeholder="请选择"
                @change="handleSelectChange"
              >
                <el-option
                  v-for="item in belongUnit"
                  :key="item.corpName"
                  :label="item.corpName"
                  :value="item.corpName"
                >
                </el-option>
              </el-select>
              <!--              {{ formData.constructionUnit }}-->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标段名称" prop="section" align="center">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                class="w-100pre"
                v-model="formData.section"
                placeholder="请选择"
                clearable
                :disabled="readonly"
                @change="handleSectionChange"
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="合同名称" prop="contractId">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
                v-model="formData.contractId"
                @change="contractIdChangeHandle"
                clearable
                filterable
                placeholder="请选择"
                style="width: 100%"
                :disabled="readonly"
              >
                <el-option
                  v-for="item in htxxOptions"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同编号" prop="contractCode">
              <el-input
                v-model="formData.contractCode"
                readonly
                width="100%"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="日期" size="small" prop="logsDate">
              <el-date-picker
                v-model="formData.logsDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开始日期"
                :disabled="readonly"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="班次" prop="workTime" align="left">
              <el-select
                @visible-change="$visibleChange($event, 'el-popper')"
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
          <el-col :span="24">
            <el-form-item label="天气" prop="weather" align="center">
              <el-input
                class="w-100pre"
                v-model="formData.weather"
                placeholder="请输入天气"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item label="气温" prop="temperature" align="center">
              <el-input
                class="w-100pre"
                v-model="formData.temperature"
                placeholder="请输入气温"
                maxlength="20"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <span style="line-height: 33px">℃</span>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="施工部位"
              prop="constructionSite"
              align="center"
            >
              <el-input
                class="w-100pre"
                v-model="formData.constructionSite"
                placeholder="请输入施工部位"
                maxlength="100"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="施工内容"
              prop="constructionContent"
              align="center"
            >
              <el-input
                class="w-100pre"
                type="textarea"
                v-model="formData.constructionContent"
                placeholder="请输入施工内容"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="2000"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <div class="">
              <div class="flex align-center justify-between">
                <div class="font-w-600">
                  <span style="color: red">*</span> 出勤人员
                </div>
                <el-button
                  v-if="!isAppH5 && !readonly"
                  type="primary"
                  @click="addPerson"
                  >新增
                </el-button>
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
                    <span v-if="isAppH5 || readonly">{{
                      $DictionaryParsing(WorkTypes, row.type)
                    }}</span>

                    <el-form-item v-else :error="row.typeError">
                      <el-select
                        @visible-change="$visibleChange($event, 'el-popper')"
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
                    <span v-if="isAppH5 || readonly">{{ row.quantity }}</span>

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

                <el-table-column
                  label="操作"
                  prop="name"
                  width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="delPerson(scope.$index, tableData)"
                      type="text"
                      size="small"
                      :style="!isAppH5 && !readonly ? 'color: red' : ''"
                      :disabled="isAppH5 || readonly"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-col>

          <el-col :span="24" style="margin-top: 20px">
            <div class="">
              <div class="flex align-center justify-between">
                <div class="font-w-600">
                  <span style="color: red">*</span> 投入机械设备
                </div>
                <el-button
                  v-if="!isAppH5 && !readonly"
                  type="primary"
                  @click="addEquipment"
                  >新增
                </el-button>
              </div>
              <div class="bottom-line"></div>
            </div>
            <el-form ref="dataFormtable">
              <el-table
                ref="multipleTable"
                border
                :data="formData.equipmentList"
              >
                <el-table-column
                  label="设备"
                  prop="type"
                  align="center"
                  class-name="taskname"
                >
                  <template slot-scope="{ row }">
                    <span v-if="isAppH5 || readonly">{{
                      $DictionaryParsing(Equipments, row.type)
                    }}</span>
                    <el-form-item v-else :error="row.typeError">
                      <el-select
                        @visible-change="$visibleChange($event, 'el-popper')"
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
                    <span v-if="isAppH5 || readonly">{{ row.quantity }}</span>
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

                <el-table-column
                  label="操作"
                  prop="name"
                  width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="
                        delEquipment(scope.$index, tableData)
                      "
                      type="text"
                      size="small"
                      :disabled="isAppH5 || readonly"
                      :style="!isAppH5 && !readonly ? 'color: red' : ''"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-col>

          <el-col :span="24" style="margin-top: 20px">
            <el-form-item
              label="生产内容"
              prop="productionContent"
              align="center"
            >
              <el-input
                class="w-100pre"
                type="textarea"
                v-model="formData.productionContent"
                placeholder="请输入生产内容"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="2000"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="检验检查内容"
              prop="checkContent"
              align="center"
            >
              <el-input
                class="w-100pre"
                type="textarea"
                v-model="formData.checkContent"
                placeholder="请输入检验检查内容"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="2000"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="其他内容" prop="otherContent" align="center">
              <el-input
                class="w-100pre"
                type="textarea"
                v-model="formData.otherContent"
                placeholder="请输入其他内容"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="2000"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="提请下班注意事项"
              prop="attentionMatters"
              align="center"
            >
              <el-input
                class="w-100pre"
                type="textarea"
                v-model="formData.attentionMatters"
                placeholder="请输入提请下班注意事项"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4 }"
                maxlength="2000"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="安全管理人员" prop="safeUser" align="center">
              <el-input
                class="w-100pre"
                v-model="formData.safeUser"
                placeholder="请输入安全管理人员"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="质量管理人员"
              prop="qualityUser"
              align="center"
            >
              <el-input
                class="w-100pre"
                v-model="formData.qualityUser"
                placeholder="请输入质量管理人员"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item
              label="生产管理人员"
              prop="productUser"
              align="center"
            >
              <el-input
                class="w-100pre"
                v-model="formData.productUser"
                placeholder="请输入生产管理人员"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="带班领导或审核人" prop="leaderUser">
              <user
                v-model="formData.leaderUser"
                :readonly="isAppH5 || readonly"
                :needSection="true"
                :sectionId="formData.section"
                :enableThrottle="true"
              ></user>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="接班人员" prop="carryUser">
              <user
                v-model="formData.carryUser"
                :readonly="isAppH5 || readonly"
                :needSection="true"
                :sectionId="formData.section"
                :enableThrottle="true"
              ></user>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="关联工程部位" prop="pbsCode" align="center">
              <pbs-select
                v-model="formData.pbsCode"
                :readonly="isAppH5 || readonly"
                @change="choosePbs"
              ></pbs-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <div class="">
              <div class="flex align-center justify-between">
                <div class="font-w-600">
                  <span style="color: red; margin-right: 5px">*</span>版式文件
                </div>
                <el-button
                  :disabled="
                    isAppH5 ||
                    (formData.fileList &&
                      formData.fileList.length > 0 &&
                      formData.fileList[0].isSigned) ||
                    isView ||
                    currentNode === 'leader' ||
                    currentNode === 'carry'
                  "
                  type="primary"
                  @click="createFile"
                  >预览
                </el-button>
              </div>
              <div class="bottom-line"></div>
            </div>
            <el-form ref="dataFormtable" style="margin-bottom: 20px">
              <el-table ref="multipleTable" border :data="formData.fileList">
                <el-table-column label="文件名称" prop="name" align="center">
                </el-table-column>
                <el-table-column
                  label="当前节点是否签章(名)"
                  prop="isSigned"
                  align="center"
                >
                  <template slot-scope="scope">
                    <i v-if="scope.row.isSigned" class="el-icon-check"></i>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  prop="name"
                  width="80"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      style="margin-left: 10px; margin-right: 10px"
                      @click.native.prevent="handlePreview(scope.row, $event)"
                      type="text"
                      size="small"
                    >
                      预览
                    </el-button>
                    <el-button
                      style="margin: 0"
                      @click.native.prevent="handleDownload(scope.row, $event)"
                      type="text"
                      size="small"
                    >
                      下载
                    </el-button>
                    <!--                    <el-button-->
                    <!--                      @click.native.prevent="handleNtko(scope.row, tableData)"-->
                    <!--                      type="text"-->
                    <!--                      size="small"-->
                    <!--                      :disabled="scope.row.isSigned || isView || fromAppForm"-->
                    <!--                    >-->
                    <!--                      签章-->
                    <!--                    </el-button>-->
                    <!-- <ntko
                      :handSign="true"
                      :file="scope.row"
                      :compKey="compKey"
                      :useKeySign="false"
                      :showDate="true"
                      :isIcon="false"
                      :disabled="
                        isAppH5 || scope.row.isSigned || isView || fromAppForm
                      "
                      @h5SginCallBack="h5SginCallBack"
                    ></ntko> -->
                    <el-button
                      @click.native.prevent="
                        handleCancelNtko(scope.row, tableData)
                      "
                      type="text"
                      size="small"
                      :disabled="
                        isAppH5 || !scope.row.isSigned || isView || fromAppForm
                      "
                    >
                      撤销签章
                    </el-button>
                    <el-button
                      @click.native.prevent="delFile(scope.$index, tableData)"
                      type="text"
                      size="small"
                      :style="
                        !isAppH5 &&
                        currentNode !== 'leader' &&
                        currentNode !== 'carry' &&
                        !isView &&
                        !fromAppForm
                          ? 'color: red'
                          : ''
                      "
                      :disabled="
                        isAppH5 ||
                        currentNode === 'leader' ||
                        currentNode === 'carry' ||
                        isView ||
                        fromAppForm
                      "
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { save, sectionList, selectByPbs, BelongTo, unitList } from "./api-v3";
import { dateFormat } from "@/utils";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { getDictItemList } from "@/api/dict";
import {
  getMinioUrl,
  getNtkoExe,
  getNtkoInstalled,
  ntkoFileSign,
  ntkoFormSavePDF,
} from "@/utils/ntko";
import { getByCode } from "@/components/PbsSelect/api";
// import ntko from "@/components/Ntko/index.vue";
import { UploadFileMixin } from "@/mixins/UploadFileMixin";

export default {
  name: "dataform",
  components: {  },
  mixins: [FlowFormMixin, UploadFileMixin],
  data() {
    return {
      isAppH5: false,
      /** */
      /** */
      signPosition: {},
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
        fileList: [], //文件列表
      },
      formDataRules: {
        logsDate: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        workTime: [
          { required: true, message: "请选择班次", trigger: "change" },
        ],
        weather: [{ required: true, message: "请输入天气", trigger: "blur" }],
        temperature: [
          { required: true, message: "请输入气温", trigger: "blur" },
        ],
        section: [{ required: true, message: "请选择", trigger: "change" }],
        sectionCode: [{ required: true, message: "请选择", trigger: "change" }],
        pbsCode: [{ required: true, message: "请选择", trigger: "change" }],
        leaderUser: [{ required: true, message: "请选择", trigger: "change" }],
        carryUser: [{ required: true, message: "请选择", trigger: "change" }],
        constructionSite: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        constructionContent: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        productionContent: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        checkContent: [{ required: true, message: "请输入", trigger: "blur" }],
        constructionUnit: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        contractId: [{ required: true, message: "请输入", trigger: "blur" }],
        contractCode: [{ required: true, message: "请输入", trigger: "blur" }],

        // freeFlowUsers: [
        //   { required: true, message: "请选择", trigger: "change" },
        // ],
      },

      /**表单是否只读 */
      readonly: false,
      checkContentReadonly: this.readonly,
      otherContentReadonly: this.readonly,
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
      sectionOptionsSouce: [],
      sectionOptions: [],
      //
      constructionOptions: [],
      businessId: "",
      pacId: "",
      createFileDisabled: false,
      /**接口地址：对应list接口 */
      url: {
        list: "/api/schedule/construction/log/information/v3/page",
      },
      compKey: new Date().getTime() + "",
      //签章对应流程
      signMarkBooksMap2: {
        productionRecorder: {
          flowNodeName: undefined,
          required: false,
        },
        // qualityRecorder: {
        //   'flowNodeName': '质量记录人',
        //   'required': false
        // },
        // productionRecorderSign: {
        //   'flowNodeName': '生产记录人签字',
        //   'required': false
        // },
        leader: {
          flowNodeName: "带班领导或审核人",
          required: false,
        },
        carry: {
          flowNodeName: "接班人员",
          required: false,
        },
      },
      currentNode: "productionRecorder",
      belongUnitSouce: [], //备份 源所属机构
      belongUnit: [], //过滤出重复的单位
      //合同信息字典
      htxxOptionsSouse: [],
      htxxOptions: [],
    };
  },
  computed: {
    currentNodeSignInfo() {
      return (
        this.currentNode +
        "(" +
        this.userInfo.realName +
        "\n" +
        dateFormat(new Date(), "YYYY.MM.DD") +
        ")"
      );
    },
    selectCode() {
      this.getSelectCode(this.sectionOptions, this.formData.section);
    },
    userInfo() {
      console.log("userInfo", this.$getStorage("userInfo"));
      return this.$getStorage("userInfo");
    },
    isView() {
      return this.formData?.flowInfo?.page === "fine";
    },
  },

  created() {
    this.getConstructionOptions();
    this.getWorkType();
    this.getEquipment();
    this.getClass();
    this.getWeather();
    this.getSectionList();
    // console.log("this.$route", this.$route);
    //接收控件页面的值，点击 保存到服务器 执行
    window.OnSaveSuccess = this.OnDataParentText;
    // window['h5SginCallBack_' + this.compKey] = this.h5SginCallBack;

    this.htxxOptions = [];
    this.getDictItems("htxx").then((datas) => {
      this.htxxOptionsSouse = datas;
    });
  },
  mounted() {
    // this.formData.logsDate = dateFormat();
    let constructionLogsDate = localStorage.getItem("ConstructionLogsDate");
    if (constructionLogsDate) {
      this.$set(this.formData, "logsDate", dateFormat(constructionLogsDate));
    } else {
      this.$set(this.formData, "logsDate", dateFormat());
    }
  },
  methods: {
    handleSectionChange(val) {
      let section = this.sectionOptions.find((item) => item.id === val);
      this.formData.sectionName = section.name;
    },
    handleSelectChange(unitName) {
      console.log(unitName);
      let unit = this.belongUnit.find((item) => item.corpName === unitName);
      this.$set(this.formData, "manager", "");
      // 重置合同
      this.htxxOptions = [];
      this.$set(this.formData, "contractId", "");
      this.$set(this.formData, "sectionId", "");
      this.$set(this.formData, "contractCode", "");
      // 清除校验
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate("contractId");
        this.$refs.dataFormRef.clearValidate("sectionId");
        this.$refs.dataFormRef.clearValidate("contractCode");
      });
      //  从htxxOptionsSouse中过滤出本单位的合同
      const datas = this.htxxOptionsSouse.filter((item) => {
        return item.dictRemark == unitName;
      });
      const datas1 = this.sectionOptionsSouce.filter((item) => {
        return item.secondUnit == unit.corpId;
      });
      console.log("列表合同", datas);
      this.htxxOptions = [...datas];
      this.sectionOptions = [...datas1];
      this.$forceUpdate();
    },
    //合同切换
    contractIdChangeHandle(val) {
      if (val) {
        let option = this.htxxOptions.find((x) => x.dictId == val);
        if (option) {
          this.formData.contractName = option.dictName;
          this.formData.contractCode = option.dictCode;
        }
      }
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
          if (row?.supervisionUnit) {
            // await this.unitChangeHandle(row.unit);
          } else {
            let defaultUnit = this.belongUnitSouce.find((x) => x.defaultOrg);
            if (defaultUnit) {
              this.$set(this.formData, "supervisionUnit", defaultUnit.corpName);
              await this.handleSelectChange(defaultUnit.corpName);
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
    // 文件预览
    previewFile(row) {
      console.log(row);
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
    //电子签章
    handleNtko(file) {
      if (file.isSigned) {
        this.$message.warning("已经完成签章!");
        return;
      }
      console.info("***************************************");
      let flowName = this.formData.flowName;
      // flowName为空时，是开始节点
      console.info(flowName);
      //计算
      let rep = this.getSignPositon(flowName);
      if (!rep) {
        this.$message.error("获取签章坐标失败!");
        return;
      }
      let signPosition = this.signPosition;
      console.info("签章坐标：", signPosition);
      // var flowName = this.formData.flowName;
      console.log(this.compKey);
      console.log("this.userInfo.username", this.userInfo.username);
      ntkoFileSign(file, this.userInfo.username, this.compKey, signPosition);
    },
    // h5签章回调
    h5SginCallBack(varData, onSuccess) {
      console.info("dataform-v3 h5签章回调数据：", varData);
      // varData = varData.param;
      //文件保存
      if (varData) {
        let oldFile = this.formData.fileList[0];
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
          },
        ];
        //上传pdf的返回值
        this.formData.lastVersionFilePath = this.formData.filePath;
        this.formData.filePath = JSON.stringify(file);
        this.formData.fileList = JSON.parse(this.formData.filePath);
        this.formData.fileList[0].isSigned = true;
        console.log(this.formData.signedNode);
        this.formData.signedNode =
          (this.formData.signedNode ? this.formData.signedNode : "") +
          this.currentNode +
          ",";

        // console.log("_uploadFile", this._uploadFile);
        // this.$bus.$emit("changeNtkoFile", this._uploadFile);
        this.$emit("changeNtkoFile", this._uploadFile);
        if (typeof onSuccess === "function") onSuccess();
      }
      this.$message.success("盖章成功！");
    },
    // 撤销签章
    async handleCancelNtko() {
      await this.$confirm(`确认撤销签章?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
        customClass: "confirmWinClass", //弹窗样式
      });
      console.log(this.formData);
      this.formData.filePath = this.formData.lastVersionFilePath;
      this.formData.lastVersionFilePath = "";
      this.formData.fileList = JSON.parse(this.formData.filePath);
      this.formData.fileList[0].isSigned = false;
      this.formData.signedNode = this.formData.signedNode.replace(
        this.currentNode + ",",
        ""
      );
    },
    //计算签章位置
    getSignPositon(flowName) {
      let rep = false;
      if (flowName) flowName = flowName.replace(/[\r\n\s]+/g, "");
      console.info("当前流程节点名称：", flowName);
      //坐标集合key为书签名称 value为x和y坐标对象
      var signPosition = JSON.parse(this.formData.filePath)[0].signPosition;
      console.info("书签坐标映射：", signPosition);
      for (var k in this.signMarkBooksMap2) {
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
    async createFile() {
      console.log("createFile");
      console.log(this.signMarkBooksMap2);
      // 表单校验
      let res = true;
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      if (!res) return;
      // 校验人员设备表格
      if (!this.validateTable(this.formData)) return;
      //判断插件是否安装
      var ntkoed = getNtkoInstalled();
      //传入控件的数据 key是书签名称 values是流程对应的名称
      // 出勤总  人，管理人员  人，作业人员  人（分工种）
      let personListStr = "";
      let total = 0;
      let personMap = this.mergeListToMap(this.formData.personList);
      personMap.forEach((value, key) => {
        let person = this.WorkTypes.find((item) => item.dictCode === key);
        total += Number(value);
        personListStr += person.dictName + value + "人，";
      });
      personListStr = "出勤总" + total + "人，" + personListStr;
      personListStr = personListStr.substring(0, personListStr.length - 1);
      if (total === 0) personListStr = "无";
      // 反铲1台，装载机1台，出渣车2台，手风钻6台，三臂凿岩台车1台
      let equipmentListStr = "";
      let equipmentMap = this.mergeListToMap(this.formData.equipmentList);
      equipmentMap.forEach((value, key) => {
        let equipment = this.Equipments.find((item) => item.dictCode === key);
        equipmentListStr += equipment.dictName + value + "台，";
      });
      equipmentListStr = equipmentListStr.substring(
        0,
        equipmentListStr.length - 1
      );
      if (!equipmentListStr) equipmentListStr = "无";
      console.log(this.signMarkBooksMap2);
      let signMarkBooks = Object.keys(this.signMarkBooksMap2);
      let workTime = this.classs.find(
        (item) => item.dictCode === this.formData.workTime
      );
      // let weather = this.weathers.find((item) => item.dictCode === this.formData.weather)
      let formData = {
        contractName: this.formData.contractName,
        contractCode: this.formData.contractCode,
        logsDate: dateFormat(this.formData.logsDate, "YYYY年MM月DD日"),
        workTime: workTime.dictName,
        weather: this.formData.weather + "，" + this.formData.temperature + "℃",
        constructionSite: this.formData.constructionSite,
        constructionContent: this.formData.constructionContent,
        productionContent: this.formData.productionContent,
        checkContent: this.formData.checkContent,
        otherContent: this.formData.otherContent,
        personList: personListStr,
        equipmentList: equipmentListStr,
        signMarkBooks: signMarkBooks,
        safeUser: this.formData.safeUser,
        qualityUser: this.formData.qualityUser,
        productUser: this.formData.productUser,
        attentionMatters: this.formData.attentionMatters,
        fileName:
          this.formData.sectionName +
          this.formData.bswjPbsName +
          dateFormat(this.formData.logsDate, "YYYY-MM-DD") +
          "施工日志.pdf",
      };
      // if (this.currentNode === 'productionRecorder') {
      //   formData.productionRecorder = this.getDateSign(this.currentNodeSignInfo);
      // } else{
      //   formData.productionRecorder = this.getDateSign(this.formData.signedNode.substring(this.formData.signedNode.indexOf('productionRecorder'),this.formData.signedNode.indexOf(',')));
      // }
      // if (this.currentNode === 'qualityRecorder') {
      //   formData.qualityRecorder = this.getDateSign(this.currentNodeSignInfo);
      // }
      console.log(formData);
      // if (ntkoed) {
        // ntkoFormSavePDF(formData, "ConstructionLogTemplate.docx");
        // const sleep = (milliseconds) => {
        //   return new Promise((resolve) => setTimeout(resolve, milliseconds));
        // };
        // while (!this.ntkoClose) {
        //   await sleep(1000);
        //   console.info('ntko处理中');
        // }
        // console.info('path: ' + this.formData.filePath);
        // console.info('ntko end');
      // } else {
      //   getNtkoExe();
      // }
    },
    getDateSign(info) {
      return info.substring(info.indexOf("(") + 1, info.indexOf(")"));
    },
    /** 将list重复的类型合并成map */
    mergeListToMap(list) {
      let map = new Map();
      list.forEach((item) => {
        if (map.has(item.type)) {
          map.set(
            item.type,
            Number(map.get(item.type)) + Number(item.quantity)
          );
        } else {
          map.set(item.type, Number(item.quantity));
        }
      });
      return map;
    },
    /**
     * 电子签章文件，保存成功后
     */
    OnDataParentText(varData, signPositionData) {
      if (!varData || varData === "null") {
        this.$message.error("上传版式文件失败!");
        return;
      }
      console.log("OnDataParentText", varData);
      console.log("signPositionData", signPositionData);
      typeof varData === "string" && (varData = JSON.parse(varData));
      let name = varData.fileName;
      if (name.indexOf("\\") >= 0) {
        name = name.substring(name.lastIndexOf("\\") + 1);
      }
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
          signPosition: JSON.parse(signPositionData), //签章的坐标信息
        },
      ];
      //上传pdf的返回值
      this.formData.filePath = JSON.stringify(file);
      let formFile = JSON.parse(this.formData.filePath);
      formFile[0].isSigned = false;
      this.formData.fileList = formFile;
      this.formData.signedNode =
        (this.formData.signedNode ? this.formData.signedNode : "") +
        this.currentNodeSignInfo +
        ",";
    },
    // sectionChange(value) {
    //   let text = '';
    //   let a = this.sectionOptions.find((item) => item.id == value);
    //   if (a) {
    //     this.formData.sectionCode = a.code;
    //   }
    // },

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
      this.sectionOptionsSouce = [];
      sectionList({}).then((res) => {
        if (res.success) {
          console.log("sectionList", res.data);
          this.sectionOptionsSouce = res.data;
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
        customClass: "confirmWinClass", //弹窗样式
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
        customClass: "confirmWinClass", //弹窗样式
      });
      this.formData.equipmentList.splice(index, 1);
      console.log("this.equipmentList", this.formData);
    },
    async delFile(index, row) {
      await this.$confirm(`确认删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
        customClass: "confirmWinClass", //弹窗样式
      });
      this.formData.fileList.splice(index, 1);
      this.formData.filePath = [];
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
          await this.getBelongTo();
          this.$nextTick(() => {
            this.freeFlowInputShow = true;
          });
          return;
        }

        // 指定流程节点编辑
        const checkContentWrite = row?.checkContent_NodeAuths?.write;
        if (checkContentWrite) {
          this.checkContentReadonly = false;
        } else {
          this.checkContentReadonly = this.readonly;
        }

        const otherContentWrite = row?.otherContent_NodeAuths?.write;
        if (otherContentWrite) {
          this.otherContentReadonly = false;
        } else {
          this.otherContentReadonly = this.readonly;
        }

        row.fileList = JSON.parse(row.filePath);

        // 获取当前节点
        for (let k in this.signMarkBooksMap2) {
          if (this.signMarkBooksMap2[k]["flowNodeName"] === row.flowName) {
            this.currentNode = k;
          }
        }
        console.log(this.currentNode);

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
          await this.handleSelectChange(row.constructionUnit);
          // this.getContractList();
        } else {
          await this.getBelongTo(row);
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
        console.log(this.formData);
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
      let user;
      if (this.currentNode === "productionRecorder") {
        user = this.formData.leaderUser;
      } else {
        user = this.formData.carryUser;
      }
      this.sendFlowJson = {
        spr: {
          type: "user",
          value: user,
        },
      };
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    async beforeCustomizationSubmit() {
      let user;
      if (this.currentNode === "productionRecorder") {
        user = this.formData.leaderUser;
      } else {
        user = this.formData.carryUser;
      }
      this.sendFlowJson = {
        spr: {
          type: "user",
          value: user,
        },
      };
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    // 校验人员设备表格
    validateTable(fields) {
      let isok = true;
      if (fields.personList.length === 0) {
        this.$message.warning("出勤人员至少需要填写1条信息!");
        return false;
      }
      if (fields.equipmentList.length === 0) {
        this.$message.warning("投入机械设备至少需要填写1条信息!");
        return false;
      }
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
      return isok;
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback, event) {
      console.log("save fields", fields);
      // 校验人员设备表格
      if (!this.validateTable(fields)) return;
      // 是否生成版式文件
      if (!this.formData.fileList || this.formData.fileList.length === 0) {
        this.$message.warning("请点击预览生成版式文件");
        return;
      }

      // 退回操作时不检验
      // 是否签章
      if (this.postMessageData.btnKey !== "return") {
        if (
          !this.formData.fileList ||
          this.formData.fileList.length === 0 ||
          !this.formData.fileList[0].isSigned
        ) {
          this.$message.warning("请先完成文件签章");
          return;
        }
      }

      // 是否选择质量记录人
      // if (this.freeFlowInputShow && !this.formData.freeFlowUsers) {
      //   this.$message.error('请先选择质量记录人');
      //   return;
      // }
      //做业务数据的保存,修改。
      const isMaintenance = event.data.btnKey === "maintenance";
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: "maintenance",
          },
          event.origin
        );
        return;
      }
      localStorage.setItem("ConstructionLogsDate", this.formData.logsDate);
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
    "formData.section": {
      handler(newvalue) {
        let a = this.sectionOptions.find((item) => item.id == newvalue);
        if (a) {
          this.formData.sectionCode = a.code;
        } else {
          this.formData.sectionCode = "";
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  /deep/ .el-input--mini .el-input__inner {
    height: 36px;
  }

  width: 100%;
  height: 100%;

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
::v-deep .el-form-item.is-required > .el-form-item__label::before {
  content: "*";
  left: 0px !important;
  color: red;
  position: absolute;
  margin-right: 0 !important;
  margin-top: 1px;
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

.apph5-parent {
  /deep/ .el-form .el-form-item {
    display: flex;
    align-items: center;
  }
  /deep/ .el-form-item__label {
    font-size: 12px;
    line-height: inherit;
    align-content: center !important;
  }

  /deep/ .el-form-item__content {
    flex: 1;
    margin-left: 0px !important;
  }
}
</style>

<template>
  <div class="page-leave">
    <table-layout
      :class="pageType.unitType == 1 ? 'height-60' : ''"
      :page="pageParams"
      :title="title"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="getTableData"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="文件编号:" size="mini">
            <el-input
              v-model="query.code"
              placeholder="请输入编号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="标题:" size="mini">
            <el-input
              v-model="query.title"
              placeholder="请输入标题"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="文种:" prop="type">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="query.type"
              clearable
            >
              <el-option
                v-for="item in wzCodeOptions"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="文件类型:"
            prop="fileType"
            v-if="pageType.unitType == 1 && pageType.documentType == 2"
          >
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="query.fileType"
            >
              <el-option
                v-for="item in fileTypeOptions"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收文单位:" prop="type">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="query.sendUnits"
              clearable
            >
              <el-option
                v-for="item in receiveUnitList"
                :label="item.corpName"
                :key="item.corpId"
                :value="item.corpId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流程状态:" size="mini">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.flowStatus"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in flowStatusOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="收文状态:" size="mini">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="query.signStatus"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in signStatusOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发文日期:" size="mini">
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发文单位:" prop="unit">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="query.unit"
              clearable
            >
              <el-option
                v-for="item in sendUnitList"
                :label="item.corpName"
                :key="item.corpId"
                :value="item.corpId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
        >
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table
          class="table-fixed"
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            label="序号"
            type="index"
            :width="$calculateWidth(50)"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            header-align="center"
            label="文件编号"
            prop="code"
            align="left"
            excel.handler="excelHandleCode"
            excel.sort="1"
            :width="$calculateWidth(190)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getCode(row.code)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getCode(row.code) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            label="标题"
            prop="title"
            align="left"
            excel.sort="2"
            :min-width="$calculateWidth(200)"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="scope.row.title"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ scope.row.title }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="文种"
            prop="type"
            align="center"
            excel.dictType="wz"
            excel.sort="3"
            :width="$calculateWidth(80)"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="$DictionaryParsing(wzCodeOptions, scope.row.type)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ $DictionaryParsing(wzCodeOptions, scope.row.type) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="文件类型"
            v-if="pageType.unitType == 1 && pageType.documentType == 2"
            prop="fileType"
            align="center"
            excel.sort="4"
            excel.dictType="fwwjlx"
            :width="$calculateWidth(100)"
          >
            <template slot-scope="scope">
              <div class="text-ellipsis-clamp" :title="scope.row.fileType">
                {{ $DictionaryParsing(fileTypeOptions, scope.row.fileType) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="发文部门"
            prop="department"
            align="center"
            :width="$calculateWidth(100)"
            excel.sort="5"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.department"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp" :title="row.department">
                  {{ row.department || "" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="发文日期"
            prop="createDate"
            align="center"
            :width="$calculateWidth(180)"
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
            excel.sort="6"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.createDate ? timeFormat(row.createDate) : ''"
                placement="top"
                effect="dark"
              >
                <div
                  class="text-ellipsis-clamp"
                  :title="row.createDate ? timeFormat(row.createDate) : ''"
                >
                  {{ row.createDate ? timeFormat(row.createDate) : "" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="发文单位"
            prop="unit"
            align="center"
            :width="$calculateWidth(200)"
            excel.handler="excelHandleCovert"
            excel.args="unit"
            excel.sort="7"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getUnitName(row.unit)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getUnitName(row.unit) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="收文单位"
            prop="sendUnits"
            align="center"
            :width="$calculateWidth(200)"
            excel.handler="excelHandleCovert"
            excel.args="unit"
            excel.sort="7"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getUnitName(row.sendUnits)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getUnitName(row.sendUnits) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="工程部位"
            prop="pbsCode"
            align="center"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
            excel.sort="8"
            :width="$calculateWidth(150)"
          >
            <template slot-scope="scope">
              <bim-show :pbsCode="scope.row.pbsCode"></bim-show>
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="flowStatus"
            align="center"
            :width="$calculateWidth(100)"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成,3=流转中"
            excel.sort="9"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flowName="flowName"></flow-status>
            </template>
          </el-table-column>
          <el-table-column
            label="收文状态"
            prop="signStatus"
            align="center"
            excel.readConverterExp="0=待签收,1=部分签收,2=已签收,3=已拒签,4=√已退回,5=已签收"
            excel.sort="10"
            :width="$calculateWidth(100)"
          >
            <template slot-scope="{ row }">
              <span
                class="iconfont"
                :class="
                  row.sendStatus == 1 && row.signStatus == 2
                    ? 'icon-checked'
                    : ''
                "
              >
                <span
                  class="font-12"
                  :style="{
                    color:
                      row.signStatus == 3 || row.signStatus == 4 ? 'red' : '',
                  }"
                >{{ getSignStatus(row) }}</span
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="当前节点"
            prop="flowName"
            align="center"
            :width="$calculateWidth(180)"
            excel.sort="11"
          >
            <template slot-scope="{ row }">
              <span class="text-ellipsis-clamp" :title="row.flowName">
                {{ row.flowName }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            :width="$calculateWidth(200)"
          >
            <template #default="{ row }">
              <div class="flex justify-center">
                <flow-button
                  :row="row"
                  :flowName="flowName"
                  @click="handelShowDialog"
                  @delete="deletedata"
                >
                </flow-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import { remove, page, corporates, getDepartmentsByUnit } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import { mapGetters } from "vuex";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import bimShow from "@/components/Bim/Show";

export default {
  name: "design-center-drawingSupply",
  mixins: [FlowListMixin],
  components: { TableLayout, bimShow },
  data() {
    return {
      OwnUnitDepart: [], //业主单位下的部门
      unitOptions: [], //所有的单位列表
      startTimeAndEndTime: [],
      dialog: true,
      visble: true,
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      options: [],
      tableData: [],
      query: {},
      showDialog: false,
      formData: {
        id: null,
        applyDate: null,
        applyDept: "",
        applyDeptId: 0,
        applyDuty: "",
        applyDutyId: 0,
        applyNo: "",
        applyUser: "",
        applyUserId: 0,
        bizStatus: "",
        bpmStatus: 0,
        deleteStatus: 0,
        leaveCategory: "",
        leaveCategoryText: "",
        leaveEndtime: null,
        leaveHours: 0,
        leaveReason: "",
        leaveStarttime: null,
        uploadFile: "",
        uploadFileList: [],
      },

      currentSection: [],
      dictList: [],
      readonly: false,

      /**人员选择 */
      persons: [],
      /**组织机构选择 */
      deptShow: false,
      /**岗位 */
      dutyOptions: [],
      /**请假类型 */
      leaveCategoryOptions: [],
      signStatusOptions: [
        {
          label: "待签收",
          value: 0,
        },
        {
          label: "部分签收",
          value: 1,
        },
        {
          label: "已签收",
          value: 2,
        },
        {
          label: "已拒签",
          value: 3,
        },
        {
          label: "已退回",
          value: 4,
        },
        {
          label: "已完成",
          value: 5,
        },
      ],

      /**流程状态 */
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      /**流程弹窗 */
      flowShow: false,
      // /**流程状态 */
      // flowPage: "mine", //待办是todo，已办done，已发sent，
      // flowId: "P1138462007083663363",
      /**流程弹窗信息 */
      flowInfo: {
        /**供应计划流程：流程id */
        businessId: "",
        // flowCfgId: "P1131979769345212416",
        /**状态 */
        status: false,
      },
      wzCode: "wz",
      wzCodeOptions: [],
      fileTypeCode: "fwwjlx",
      fileTypeOptions: [],
      //编辑通过当前人待办做判断。流程数据不运输删除
      title: "",
      receiveUnitList: [], //收文单位
      sendUnitList: [], //发文单位
      pageType: {
        unitType: "",
        documentType: "",
      },
      /** 单位类型枚举*/
      UnitTypeEnum: {
        jldw: 1,
        sjdw: 2,
        sgdw: 3,
        yzdw: 4,
        dsfdw: 5
      }
    };
  },
  computed: {
    ...mapGetters(["sidebar", "menuRoutes"]),
    exportParams() {
      const { documentType, unitType } = this.$route.meta;
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          startDate: this.startTimeAndEndTime?.[0] || "",
          endDate: this.startTimeAndEndTime?.[1] || "",
          unitType,
          documentType,
        },
      };
      // 因为存在下的的code 是 | 所以需要转化成 -【】-
      if (params?.entity?.code) {
        params.entity.code = this.retCode(params.entity.code);
        // 判断最后一个字是不是 号 字  如果是 删除这个号字
        let stringWithoutSpaces = params.entity.code.replace(/\s/g, "");
        if (
          stringWithoutSpaces.charAt(stringWithoutSpaces.length - 1) == "号"
        ) {
          params.entity.code = stringWithoutSpaces.slice(0, -1);
        }
      }
      return params;
    },
  },
  async created() {
    await this.getUnitList();
    await this.getOwnUnitDepart();
    console.log("获取配置信息", this.$route);
    const { title } = this.$route.meta;
    this.title = title;
    this.getTableData();
    this.getDictItemList(this.designProfessionCode);
    this.getDictItemList(this.wzCode);
    this.getDictItemList(this.fileTypeCode);
    this.getFlowStatus();
  },
  mounted() {
    // 获取当前页面得配置信息 用于区分是哪个类型得单位
    const { documentType, unitType } = this.$route.meta;
    this.pageType = {
      unitType,
      documentType,
    };
  },
  methods: {

    // 清空选择
    clearSelection() {
      console.log("清空选择");
      this.$refs.multipleTable.clearSelection();
    },

    async getOwnUnitDepart() {
      // console.log("从当前数据中过滤出业主单位", this.receiveUnitList);
      // 找出业主单位  从当前数据中过滤出业主单位
      let manergeUnit = this.receiveUnitList.find((x) => x.corpType == "yzdw");
      console.log("业主单位", manergeUnit);

      if (manergeUnit) {
        // 处理业主单位
        // 获取业主单位下的部门
        const { success, data } = await getDepartmentsByUnit(
          manergeUnit.corpId
        );
        if (success && data && Array.isArray(data)) {
          // 过滤掉配置文件的单位
          console.log("获取业主单位下的部门", data);
          let filterUnit = this.$store.state.customizedFilterunits;
          let ownDepart = [];
          data.forEach((item) => {
            let a = filterUnit.find((x) => x.cordId == item.departId);
            if (!a) {
              ownDepart.push(item);
            }
          });
          // console.log("获取业主单位下的部门", ownDepart);

          this.OwnUnitDepart = ownDepart;
          // 循环把当前的部门添加到下来项里面去
          let option = ownDepart.map((item) => {
            return {
              ...item,
              corpId: item.departId,
              corpName: `${item?.corpName}-${item?.departName}`,
            };
          });
          console.log("业主单位option", option);
          this.receiveUnitList = [...this.receiveUnitList, ...option];
        }
      }
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/synthesis/manage/export";
      exportParams.filename = this.title;
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    getSignStatus(row) {
      // 一个住送单位 可以拒签  多单位不能拒签 只能是部分签收  和
      let status = row.signStatus;
      // 拒签的情况下  组合是 signStatus3   sendStatus 1
      let result = "";
      switch (status) {
        case 0:
          result = "待签收";
          break;
        case 1:
          result = "部分签收";
          break;
        case 2:
          result = "已签收";
          break;
        case 3:
          result = "已拒签";
          break;
        case 4:
          result = "√已退回";
          break;
        case 5:
          result = "已签收";
          break;
        case 6:
          result = "";
          break;
        default:
          result = "";
          break;
      }
      return result;
    },
    getCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\|/, "-〔");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\|/, "〕-");

      return outputString + "\n" + "号";
    },
    // 根据单位id 获取名称
    getUnitName(unitIds) {
      // 如果在业主单位就需要匹配到业主单位下的部门
      let arr = unitIds.split(",");
      let names = [];
      arr.forEach((id) => {
        let depart = this.OwnUnitDepart.find((x) => x.departId === id);
        if (depart) {
          names.push(`${depart?.corpName}-${depart.departName}`);
        } else {
          let unit = this.receiveUnitList.find((x) => x.corpId === id);
          names.push(unit?.corpName);
        }
      });
      return names.join(",") || unitIds;
    },
    // 收文单位
    async getUnitList() {
      const { data, success } = await corporates();
      console.log("单位列表", success, data);
      if (success) {
        this.receiveUnitList = data
          .filter((item) => {
            return item.corpLeaf !== 0;
          })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
        // 处理数据源过滤，管理员 设计发文只显示设计单位、监理发文只显示监理单位、施工发文只显示施工单位、第三方发文只显示第三方单位
        let sendUnitList = [...this.receiveUnitList];
        console.log("getUnitList-sendUnitList", sendUnitList, this.pageType)
        if (this.isSystem || this.isMdgAdmin) {
          sendUnitList = sendUnitList.filter(x => this.UnitTypeEnum[x.corpType] === this.pageType.unitType);
        }
        this.sendUnitList = sendUnitList;
      }
    },

    /**获取字典数据 */
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    handleSizeChange(val) {
      console.log("aaa", val);
      this.pageParams = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log("aaa", val);
      this.pageParams = val;
      this.getTableData();
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      // const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      let data = [];
      // console.log("enums.FLOW_STATUS_ENUM", enums.FLOW_STATUS_ENUM);
      let options = enums.FLOW_STATUS_ENUM;

      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name,
        });
      }
      // data.push({
      //   id: 3,
      //   dictCode: 3,
      //   dictName: "待签收",
      // });

      this.flowStatusOptions = data;
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    retCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\-〔/, "|");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\〕-/, "|");

      return outputString;
    },
    // 查询表格数据
    getTableData() {
      this.tableData = [];
      const { documentType, unitType } = this.$route.meta;
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          startDate: this.startTimeAndEndTime?.[0] || "",
          endDate: this.startTimeAndEndTime?.[1] || "",
          unitType,
          documentType,
        },
      };
      // 因为存在下的的code 是 | 所以需要转化成 -【】-
      if (params?.entity?.code) {
        params.entity.code = this.retCode(params.entity.code);
        // 判断最后一个字是不是 号 字  如果是 删除这个号字
        let stringWithoutSpaces = params.entity.code.replace(/\s/g, "");
        if (
          stringWithoutSpaces.charAt(stringWithoutSpaces.length - 1) == "号"
        ) {
          params.entity.code = stringWithoutSpaces.slice(0, -1);
        }
      }
      page(params).then((data) => {
        this.tableData = data?.data?.records || [];
        this.pageParams.total = data?.data?.total || 0;
      });
    },
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.fileTypeCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.fileTypeOptions = res.data;
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
        }
      }
    },
    deletedata(row) {
      const { unitType } = this.$route.meta;
      if (
        (row.createUser == this.$getStorage("userInfo").userId) || this.isSystem
      ) {
        let params = {
          id: row.id,
        };
        remove(params, unitType).then((res) => {
          if (!res.success) {
            return this.$message.error("删除失败：" + res.message);
          }
          this.$message.success("删除成功");
          this.getTableData();
        });
      } else {
        this.$message.error("您没有删除权限");
      }
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
    height: 80%;

    /deep/ .el-table__row .cell button {
      padding: 5px 10px !important;
      margin: 0 5px;
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

.pagination-container {
  display: flex;

  .pagination {
    margin-left: auto;
  }
}

/deep/ .el-range-editor--mini.el-input__inner {
  height: inherit !important;
}

/deep/ .el-date-editor .el-range-separator {
  line-height: 32px !important;
}

/deep/ .table-content .table .table-cnotent .el-table .el-table__body-wrapper {
  height: calc(100% - 54px!important);
}

/deep/ .height-60 {
  height: calc(100% - 60px) !important;
}
</style>

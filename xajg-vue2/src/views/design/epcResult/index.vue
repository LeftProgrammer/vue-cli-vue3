<template>
  <div class="page-leave">
    <treeTableLayout
      :page="pageParams"
      :title="title"
      @query="handleQuery"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <!-- :showExportBtn="!(fromPage == 'hydroStandardForm')" -->
      <template slot="form">
        <el-form ref="form" :model="query" :inline="true">
          <el-form-item
            :label="fromPage == 'hydroStandardForm' ? '文件编号:' : '成果编号:'"
            size="mini"
          >
            <el-input
              v-model="query.code"
              placeholder="请输入编号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="fromPage == 'hydroStandardForm' ? '文件名称:' : '成果名称:'"
            size="mini"
          >
            <el-input
              v-model="query.name"
              placeholder="请输入名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="专业:" size="mini">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.profession"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in designProfessionOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="发起日期:"
            size="mini"
            v-if="!(fromPage == 'hydroStandardForm')"
          >
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="流程状态:"
            size="mini"
            v-if="!(fromPage == 'hydroStandardForm')"
          >
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              style="width: 100%"
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
          <el-form-item
            v-if="isSDResult"
            label="所属标段:"
            size="mini"
            prop="sectionId"
          >
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="query.sectionId"
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
          <el-form-item
            label="成果类型:"
            size="mini"
            v-if="fromPage == 'hydroStandardForm'"
          >
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              style="width: 100%"
              v-model="query.resultsType"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in sjcgOptionsList"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <!-- <template slot="opratebtns"> </template> -->
      <template slot="tree" v-if="!(fromPage == 'hydroStandardForm')">
        <el-tree
          default-expand-all
          ref="tree"
          node-key="corpId"
          :data="sjcgOptions"
          :props="defaultProps"
          @node-click="handleNodeClick"
          highlight-current
          :current-node-key="'1'"
        ></el-tree>
      </template>
      <template slot="opratebtns">
        <el-button
          v-if="!(fromPage == 'hydroStandardForm')"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          v-if="showTable"
          :row-key="(row) => row.id"
          @header-dragend="handleHeaderDragEnd"
          @selection-change="handleSlectCurrentChange"
          :highlight-current-row="!multiple"
          @current-change="handleCurrent"
        >
          <!-- fromPage=='hydroStandardForm' 需要展示成果类型 -->
          <el-table-column
            type="selection"
            :width="$calculateWidth(80)"
            align="center"
            v-if="multiple && fromPage == 'hydroStandardForm'"
          />
          <el-table-column
            v-if="fromPage == 'hydroStandardForm'"
            label="成果类型"
            header-align="center"
            prop="title"
            align="left"
            :min-width="$calculateWidth(110)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.name" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">
                  {{ $DictionaryParsing(sjcgOptionsList, row.resultsType) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="序号"
            type="index"
            :width="$calculateWidth(54)"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            :label="fromPage == 'hydroStandardForm' ? '文件编号' : '成果编号'"
            header-align="center"
            prop="code"
            align="left"
            :width="$calculateWidth(200)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getCodeName(row, 'code')"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getCodeName(row, "code") }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :label="fromPage == 'hydroStandardForm' ? '文件名称' : '成果名称'"
            header-align="center"
            prop="name"
            align="left"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getCodeName(row, 'name')"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getCodeName(row, "name") }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="成果类型"
            prop="resultsType"
            align="center"
            :excel.dictType="this.sjcgCodeList"
            :width="$calculateWidth(110)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="$DictionaryParsing(sjcgOptionsList, row.resultsType)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ $DictionaryParsing(sjcgOptionsList, row.resultsType) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            label="专业"
            prop="profession"
            align="center"
            excel.dictType="DESIGN_PROFESSION"
            :width="$calculateWidth(80)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="
                  $DictionaryParsing(
                    designProfessionOptions,
                    getCodeName(row, 'profession')
                  )
                "
                placement="top"
                effect="dark"
              >
                <span>{{
                  $DictionaryParsing(
                    designProfessionOptions,
                    getCodeName(row, "profession")
                  )
                }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="所属标段"
            prop="sectionId"
            excel.handler="excelHandleCovert"
            excel.args="section"
            align="center"
            :width="$calculateWidth(110)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="
                  getText(sectionOptions, getCodeName(row, 'sectionId'))
                "
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getText(sectionOptions, getCodeName(row, "sectionId")) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            label="工程部位"
            :width="$calculateWidth(150)"
            prop="pbsCode"
            align="center"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
          >
            <template slot-scope="{ row }">
              <bim-show :pbsCode="getCodeName(row, 'pbsCode')"></bim-show>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="金额(万元)"
            prop="money"
            align="right"
            header-align="center"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="$moneyFormat(Number(row.money))"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ $moneyFormat(Number(row.money)) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="发起人"
            prop="createUser"
            align="center"
            excel.handler="excelHandleCovert"
            excel.args="user"
            :width="$calculateWidth(80)"
          >
            <template slot-scope="{ row }"> {{ row.createUsername }}</template>
          </el-table-column>
          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="发起日期"
            prop="createDate"
            align="center"
            sortable
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
            :min-width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{ row.createDate ? timeFormat(row.createDate) : "" }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="fromPage == 'hydroStandardForm'"
            label="供应日期"
            prop="actualDate"
            align="center"
            sortable
            excel.dateFormat="yyyy-MM-dd"
            :min-width="$calculateWidth(130)"
          >
            <template slot-scope="{ row }">
              {{
                row.actualDate ? timeFormat(row.actualDate, "yyyy-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="交底状态"
            align="center"
            :width="$calculateWidth(110)"
          >
            <template>
              <span>待定</span>
            </template>
          </el-table-column> -->
          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="流程状态"
            prop="flowStatus"
            align="center"
            :width="$calculateWidth(80)"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flowName="flowName"></flow-status>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            label="当前节点"
            prop="flowName"
            align="center"
            :width="$calculateWidth(180)"
          >
            <template slot-scope="{ row }">
              <span class="text-ellipsis-clamp" :title="row.flowName">
                {{ row.flowName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!(fromPage == 'hydroStandardForm')"
            fixed="right"
            label="操作"
            align="center"
            width="200"
          >
            <template #default="{ row }">
              <div class=" ">
                <flow-button
                  :btns="
                    isSDResult
                      ? ['view', 'deal', 'press', 'delete', 'uploadOa']
                      : ['view', 'deal', 'press', 'delete']
                  "
                  :row="row"
                  :flowName="flowName"
                  @click="edit"
                  @delete="deletedata"
                  @uploadOaMessage="uploadOaMessage"
                ></flow-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTableLayout>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import treeTableLayout from "@/components/ContentLayout/TreeTable";
import {
  page,
  remove,
  sign,
  del,
  sectionList,
  unitList,
  cggyReportOa,
} from "./api";
import { getDictItemList, getDictItemTree } from "@/api/dict";
import { dateFormat } from "@/utils";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import bimShow from "@/components/Bim/Show";
import { reportOasw } from "@/views/office/ownerReceiveDocument/api";

export default {
  components: { treeTableLayout, bimShow },
  mixins: [FlowListMixin],
  props: {
    /**来自于form页面的关联图纸 */
    fromPageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      multiple: true, //默认为多选
      showTable: false,
      uploadOaLoading: false,
      fromPage: "", //当作为组件的时候会用到
      sectionOptions: [],
      flowStatusOptions: [],
      formData: {
        createDate: "",
      },
      startTimeAndEndTime: [],
      designProfessionCode: "DESIGN_PROFESSION",
      designProfessionOptions: [],
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {},
      flowShow: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "dictName",
      },
      wzCode: "wz",
      wzCodeOptions: [],

      sjcgCode: "design_sjcglx",
      sjcgOptions: [],

      sjcgCodeList: "design_sjcglx",
      sjcgOptionsList: [],

      title: "成果供应列表",
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
      currentRow: [], //被选中行
      sjbgArr: ["sjtz", "sjggtz", "ydb-sjtz", "ydbsjbgtz"], //设计变更成果类型
      myCustomSlection: [],
    };
  },
  computed: {
    /**
     * 水电标设计成果
     * @returns {boolean}
     */
    isSDResult() {
      return this.$route.meta?.pageType == 1;
    },
    exportParams() {
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          flowStatus: this.query.flowStatus,
          beginTime: "",
          endTime: "",
          pageType: this.$route.meta?.pageType || 1,
        },
      };
      if (this.isSDResult) {
        params.entity.designSupply = {
          ...this.query,
        };
      }
      if (this.$route.query?.baseId) {
        params.entity.id = this.$route.query.baseId;
        params.entity.noAuth = "1";
      }
      if (params.entity?.code) {
        // 清理掉前面后面的空格
        params.entity.code = params.entity.code.trim();
        // params.entity.code = params.entity.code.replace(/\s+/g, "");
      }
      if (params.entity?.name) {
        // 清理掉前面后面的空格
        // params.entity.name = params.entity.name.replace(/\s+/g, "");
        params.entity.name = params.entity.name.trim();
      }
      if (this.startTimeAndEndTime?.length > 0) {
        params.entity.beginTime = this.startTimeAndEndTime[0];
        params.entity.endTime = this.startTimeAndEndTime[1];
      }
      // if (this.$route.meta?.pageType === 0) {
      //   params.entity.pageType = 0;
      // }
      console.log("params", params);
      return params;
    },
  },
  async created() {
    this.getSectionList();
    // if (this.$route.meta?.pageType == 1) {
    //   this.customsectionOptions();
    // }
    this.getDictItemList(this.designProfessionCode);
    this.getDictItemList(this.wzCode);
    console.log("this.$route.meta,", this.$route);
    // 查询所有类型
    if (this.fromPageType) {
      // this.$route.meta.pageType = 0;
      this.query.pageType = 0;
    }
    console.log("查询字典", this.query);
    if (this.query.pageType == 0) {
      await this.getDictItemList("");
      if (this.fromPageType.indexOf("3") > -1) {
        // 变更图纸
        this.sjcgOptionsList = this.sjcgOptionsList.filter((item) =>
          this.sjbgArr.includes(item.dictCode)
        );
      }
      return;
    } else if (this.$route.meta?.pageType == 2) {
      this.sjcgCode = "cglx-ydbd";
      this.sjcgCodeList = "cglx-ydbd";
    } else if (this.$route.meta?.pageType == 3) {
      this.sjcgCode = "design_sjcglx";
      this.sjcgCodeList = "design_sjcglx";
    }
    //从哪里来的
    console.log("从哪里来的", this.fromPageType);
    this.getTableData();
    this.getDictItemList(this.sjcgCodeList);
    this.getDictItemList(this.sjcgCode);
  },
  mounted() {
    // 做拒签监听
    window.addEventListener(
      "message",
      (event) => {
        // 处理接收到的消息
        if (event.data.hasOwnProperty("flowShow")) {
          console.log("处理接收到的消息", event.data);
          this.flowShow = event.data.flowShow;
        }
      },
      false
    );
  },
  methods: {
    async uploadOaMessage(row) {
      console.log("上报OA", row);
      // this.$set(row, "uploadOaLoading", true)
      let rowData = this.tableData.find((item) => item.id === row.id);
      this.$set(rowData, "uploadOaLoading", true);
      let res = await cggyReportOa(row);
      this.$set(rowData, "uploadOaLoading", false);
      if (res.success) {
        console.log(res);
        this.$message.success("上报OA完成");
        this.getTableData();
      } else {
        this.$message.error("上报OA失败，相关信息：" + res.message);
      }
    },
    //翻译列表所属标段 id=>name
    sectionIdFormatter(row, column) {
      var value = "";
      for (var i = 0; i < this.sectionOptions.length; i++) {
        var item = this.sectionOptions[i];
        if (row.sectionId == item.id) {
          value = item.name;
          break;
        }
      }
      return value;
    },
    /**获取施工标段 */
    async customsectionOptions() {
      let sectionOptions = [];
      let sectionRes = await sectionList({});
      if (sectionRes.success) {
        sectionOptions = sectionRes.data;
        console.log("获取标段", sectionRes);
      }

      let units = [];
      let unitRes = await unitList();
      if (unitRes.success) {
        units = unitRes.data;
      }
      console.log("获取单位", units);
      //获取字典
      let excludeOptionNames = [];
      const gldwmc = await getDictItemList("gldwmc");
      console.log("获取字典", gldwmc);
      for (let i = 0; i < gldwmc.data.length; i++) {
        excludeOptionNames.push(gldwmc.data[i].dictName);
      }
      units = units.filter(
        (item) => !excludeOptionNames.includes(item.corpName)
      );
      console.log("unitsunitsunits", units);
      let a = sectionOptions.filter(
        (item) =>
          units.findIndex(
            (item1) =>
              item1.corpDesc == "sgdw" && item1.corpId == item.secondUnit
          ) > -1
      );
      console.log("this.sectionOptions ", a);
      this.myCustomSlection = a;
    },
    getCodeName(row, type) {
      let name = row[type] || row.designSupply?.[type] || "";
      return name;
    },
    // 单选
    handleCurrent(val) {
      if (this.multiple) {
        return;
      }
      console.log("单选", val);
      this.currentRow = val;
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    customRequest() {
      this.getTableData();
    },
    handleSlectCurrentChange(val, old) {
      console.log("handleCurrentChange", val);
      // 清理所有的校验
      this.currentRow = val;
    },
    add() {
      // 存下当前的类型
      if (this.query.resultsType) {
        this.$setStorage("resultsType", this.query.resultsType);
      } else {
        this.$clearStorage("resultsType");
      }
      this.handelShowDialog(null, "mine");
    },
    edit(row, status, task, type) {
      console.log("type", type);
      // if (row.resultsType && status == "fine") {
      //   this.$setStorage("resultsType", row.resultsType);
      // } else {
      //   this.$clearStorage("resultsType");
      //   this.$message.warning("历史数据待处理");
      //   return;
      // }
      this.$clearStorage("resultsType");
      this.handelShowDialog(row, status, task);
    },
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
    // 查询表格数据
    getTableData() {
      console.log(this.$route.meta?.pageType);
      this.showTable = false;
      this.tableData = [];
      let pageType = 0;
      console.log("this.query.pageType", this.query.pageType);
      if (this.fromPageType) {
        pageType = 0;
      } else {
        pageType = this.$route.meta?.pageType || 1;
      }
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          flowStatus: this.query.flowStatus,
          beginTime: "",
          endTime: "",
          pageType: pageType,
        },
      };
      console.log("this.fromPageType", this.fromPageType);
      if (this.fromPageType) {
        params.entity.resultsTyp = "sjtz,sjggtz,ydb-sjtz,ydbsjbgtz";
      }
      if (this.isSDResult) {
        params.entity.designSupply = {
          ...this.query,
        };
      }
      if (this.$route.query?.baseId) {
        params.entity.id = this.$route.query.baseId;
        params.entity.noAuth = "1";
      }
      if (params.entity?.code) {
        // 清理掉前面后面的空格
        params.entity.code = params.entity.code.trim();
        // params.entity.code = params.entity.code.replace(/\s+/g, "");
      }
      if (params.entity?.name) {
        // 清理掉前面后面的空格
        // params.entity.name = params.entity.name.replace(/\s+/g, "");
        params.entity.name = params.entity.name.trim();
      }
      if (this.startTimeAndEndTime?.length > 0) {
        params.entity.beginTime = this.startTimeAndEndTime[0];
        params.entity.endTime = this.startTimeAndEndTime[1];
      }
      console.log("params", params);
      console.log("this.fromPageType", this.fromPageType);
      if (params.entity.pageType == 0) {
        if (this.fromPageType.indexOf("3") > -1) {
          // params.entity.flowStatus = 2;
          if (!params.entity.resultsType) {
            params.entity.resultsType = this.sjbgArr.join(",");
          }
          params.entity.pageType = this.fromPageType;
        }
      }
      this.$nextTick(() => {
        page(params).then((res) => {
          const { data, success } = res;
          if (!success) {
            this.$message.error("列表获取失败");
            this.showTable = true;
            return;
          }
          console.log("page", data);
          this.tableData = data.records || [];
          // console.log("列表数据", this.tableData);
          this.pageParams.total = data.total;

          this.$nextTick(() => {
            // this.$refs.multipleTable.doLayout();
            this.$forceUpdate();
          });
          this.showTable = true;
          this.$nextTick(() => {
            if (this.$route.query?.baseId) {
              // 先获取文件数据
              let row = this.tableData[0];
              let task =
                row.procMatterTaskDone ||
                row.matterTaskTodo ||
                row.procMatterRun;
              setTimeout(() => this.edit(row, "fine", task), 1000);
            }
          });
        });
      });
    },

    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/design/supply/detail/export";
      exportParams.filename = this.isSDResult
        ? "成果供应-水电标段"
        : "成果供应-营地标段";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
      exportParams.params.entity.columns.find(
        (item) => item.prop === "resultsType"
      ).dictType = this.sjcgCodeList;
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
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

    arrayToTree(arr, idProp, parentIdProp) {
      const map = {};
      const result = [];

      arr.forEach((item) => {
        map[item[idProp]] = { ...item, children: [] };
      });

      arr.forEach((item) => {
        if (item[parentIdProp] && map[item[parentIdProp]]) {
          map[item[parentIdProp]].children.push(map[item[idProp]]);
        } else {
          result.push(map[item[idProp]]);
        }
      });

      return result;
    },

    handleNodeClick(data) {
      console.log("点击树节点", data);
      this.query.resultsType = data.dictCode;
      if (data.pid == "-") {
        this.query.resultsType = "";
      }
      console.log("*******", this.query.resultsType);
      this.getTableData();
    },
    getText(options, value) {
      let a = [];
      if (value) {
        value = value.split(",");
        a = value.map((x) => {
          let item = options.find((y) => y.id == x);
          if (item) {
            return item.name;
          }
        });
      }
      return a.toString();
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      let data = [];
      let options = enums.FLOW_STATUS_ENUM;
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name,
        });
      }
      this.flowStatusOptions = data;
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    reset() {
      // this.query = {};
      let pageType = this.query.pageType;
      this.query = {};
      this.query.pageType = pageType;

      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    deletedata(row) {
      console.log("----------", row.id);
      if (
        row.createUser == this.$getStorage("userInfo").userId ||
        this.isSystem
      ) {
        let params = {
          id: row.id,
        };
        del({ id: row.id }).then((res) => {
          if (!res.success) {
            return this.$message.error("删除失败：" + res.message);
          }
          this.$message.success("删除成功");
          this.getTableData();
        });
        // remove(params).then((res) => {
        //   if (!res.success) {
        //     return this.$message.error("删除失败：" + res.message);
        //   }
        //   this.$message.success("删除成功");
        // });
      } else {
        this.$message.error("您没有删除权限");
      }
    },
    /**获取字典 */
    async getDictItemList(code, callback) {
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
      if (code === this.sjcgCodeList) {
        if (!this.sjcgOptionsList || this.sjcgOptionsList.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              console.log("sjcgOptionsList", res.data);
              this.sjcgOptionsList = res?.data.filter(
                (item) =>
                  item.dictCode !== "sjcglx" && item.dictCode !== "sbcglx"
              );
            }
          });
        } else {
        }
      }
      if (code === this.sjcgCode) {
        if (!this.sjcgOptions || this.sjcgOptions.length == 0) {
          getDictItemTree(code).then((res) => {
            if (res.success) {
              this.sjcgOptions = res.data;
            }
          });
        } else {
        }
      }
      if (code == "") {
        let res = await Promise.all([
          getDictItemList("design_sjcglx"),
          getDictItemList("cglx-ydbd"),
        ]);
        console.log("获取成果类型字典d", res);
        let allDit = [];
        res.forEach((x) => {
          allDit = allDit.concat(x.data);
        });
        this.sjcgOptionsList = allDit.filter(
          (item) => item.dictCode !== "sjcglx" && item.dictCode !== "sbcglx"
        );
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
}

/deep/ .el-range-editor--mini.el-input__inner {
  height: inherit !important;
}

/deep/ .el-date-editor .el-range-separator {
  line-height: 32px !important;
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

/deep/ button.el-button.el-button--medium {
  // background-color: #0096ff;
  min-width: auto;
}

/deep/ .table-content .table .table-cnotent .el-table .el-table__body-wrapper {
  height: calc(100% - 54px) !important;
}

// 这里 是由于列表选中的时候 会触发校验 很奇怪！！
/deep/ .el-input__inner {
  border-color: #dcdfe6 !important;
}
</style>

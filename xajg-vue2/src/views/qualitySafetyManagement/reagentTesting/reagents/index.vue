<!-- 施工单位自检 -->
<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
      title="检测台账"
    >
      <template slot="tree">
        <el-tree
          :data="typeOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          ref="tree"
          node-key="dictId"
          :default-checked-keys="defaultChecked"
          :current-node-key="currentNodekey"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </template>
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="样品编号:" size="mini">
            <el-input
              v-model="query.code"
              placeholder="请输入样品编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="报告编号:" size="mini">
            <el-input
              v-model="query.reportCode"
              placeholder="请输入报告编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="检测结论:" size="mini">
            <!-- <el-input v-model="query.testResult" placeholder="请输入内容"></el-input> -->
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.testResult"
              placeholder="请选择检测结论"
              clearable
            >
              <el-option
                v-for="item in resultOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流程状态:" size="mini">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.flowStatus"
              placeholder="请选择流程状态"
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
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine'), (type = 'add')"
        >
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          :cell-style="rowRed"
          label-width="auto"
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column label="样品编号" align="center" prop="code" />
          <!-- <el-table-column label="样品编号" align="center" prop="code">
            <template slot-scope="{ row }">
              <el-button @click="downFile(row)" type="text" size="small">
                {{ row.name }}</el-button
              >
            </template>
          </el-table-column> -->
          <el-table-column label="检测日期" align="center" prop="testDate">
            <template slot-scope="{ row }">
              {{ row.testDate ? timeFormat(row.testDate, "YYYY-MM-DD") : "" }}
            </template>
          </el-table-column>
          <el-table-column label="检测结论" align="center" prop="testResult">
            <template slot-scope="{ row }">
              {{ row.testResult ? resultFormat(row.testResult) : "" }}
            </template>
          </el-table-column>
          <el-table-column label="报告编号" align="center" prop="reportCode" />
          <el-table-column label="报告日期" align="center" prop="reportDate">
            <template slot-scope="{ row }">
              {{
                row.reportDate ? timeFormat(row.reportDate, "YYYY-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="检测报告"
            width="180"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <el-button @click="downFile(row)" type="text" size="small">
                {{ getFileName(row.uploadFile) }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="试验人员" align="center" prop="testPerson" />
          <el-table-column label="生产厂家" align="center" prop="producer" />
          <el-table-column
            label="规格型号"
            align="center"
            prop="specificationModel"
          />
          <el-table-column label="工程名称" align="center" prop="projectName" />
          <el-table-column
            label="所属标段"
            align="center"
            prop="section"
            :formatter="sectionIdFormatter"
          />
          <el-table-column
            label="创建人员"
            align="center"
            prop="createUsername"
          />
          <el-table-column label="使用部位" prop="pbsCode" align="center">
            <template slot-scope="{ row }">
              <bim-show :pbsCode="getPbsCode(row.pbsCode)"></bim-show>
            </template>
          </el-table-column>
          <el-table-column label="流程状态" prop="flowStatus" align="center">
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flowName="flowName"></flow-status>
            </template>
          </el-table-column>
          <el-table-column label="当前节点" prop="flowName" align="center" />
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template #default="{ row }">
              <div class="flex justify-center">
                <flow-button
                  :promiseCode="'design-center-drawingSupply_delete'"
                  :row="row"
                  :flowName="flowName"
                  @click="handelShowDialog"
                  @delete="deleteHandle"
                ></flow-button>
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
import { add, remove, page, sectionList, sectionAllList } from './api';
import { getDictItemList, buildTree } from "@/api/dict";
import enums from "@/config/enums";
import { dateFormat } from "@/utils";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import TableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import bimShow from "@/components/Bim/Show";

export default {
  name: "monitoring-point",
  mixins: [FlowListMixin],
  components: {
    TableLayout,
    ListButton,
    dataform,
    bimShow,
  },
  data() {
    return {
      currentNodekey: "",
      defaultChecked: [],
      nameList: "", //材料名
      /**流程弹窗信息 */
      flowInfo: {
        /**供应计划流程：流程id */
        businessId: "",
        // flowCfgId: "P1131979769345212416",
        /**状态 */
        status: false,
      },
      /**流程弹窗 */
      flowShow: false,
      flowStatusOptions: [], //PROC_TASK_TODO_STATUS
      treeNode: {}, //点击树节点传递给子组件使用
      type: "",
      title: "监测点列表",
      DitSpeciality: [],
      defaultProps: {
        children: "children",
        label: "dictName",
      },
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      oprateRow: {},
      options: [],
      tableData: [],
      query: {
        type: null,
        params: {},
      },

      dictList: [],
      readonly: false,

      /**组织机构选择 */
      deptShow: false,
      typeDictMap: [],
      typeOptions: [],
      resultOptions: [
        { label: "合格", value: 1 },
        { label: "不合格", value: 2 },
      ],

      // url: { list: "" },
      /**接口地址：对应list接口 */
      // url: {
      //   list: "/api/design/plan/page",
      //   // list: "/api/design/plan/list",
      // },
      /**施工标段 */
      sectionOptions: [],
    };
  },
  computed: {},
  watch: {
    tableData() {
      // 解决横向滚动时，列没对齐的问题
      this.$nextTick(() => {
        setTimeout(() => {
          let lastColEl = document.querySelector('.el-table__header colgroup col:last-child')
          if (lastColEl) {
            // 最后一列的宽度加上滚动条的宽度
            lastColEl.width = Number(lastColEl.width) + 6 // 6为滚动条宽度
          }
        }, 1000)
      })
    }
  },
  created() {
    this.getTypeDictMap();
    // this.getTableData();
    this.getJCXM();
    this.getFlowStatus(); //获取流程
  },
  mounted() {
    this.getnameList(); //获取名称字典
    //获取标段列表
    this.getSectionList();
  },
  methods: {
    getFileName(fileName) {
      let name = "";
      let arr = JSON.parse(fileName);
      if (fileName && Array.isArray(arr) && arr.length > 0) {
        name = arr[0].name;
      }
      return name;
    },
    downFile(row) {
      console.log("rowddd", row);
      let arr = JSON.parse(row.uploadFile);
      if (Array.isArray(arr) && arr.length > 0) {
        this.$previewFileById(arr[0]);
      }
    },
    //列表点击检测报告直接下载
    // downloadFile(row) {
    //   window.open(`/api/attachments/download?attId=${row.fileId}`, "_blank");
    // },
    getPbsCode(val) {
      let text = "*";
      console.log("getPbsName", val);
      let a = val?.split("&&&")[0];
      if (a) {
        text = a;
      }
      return text;
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionAllList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    //翻译列表所属标段 id=>name
    sectionIdFormatter(row, column) {
      var value = "";
      for (var i = 0; i < this.sectionOptions.length; i++) {
        var item = this.sectionOptions[i];
        if (row.section == item.id) {
          value = item.name;
          break;
        }
      }
      return value;
    },
    //不合格行 red
    rowRed({ row, column, rowIndex, columnIndex }) {
      if (row.testResult == 2) {
        return "color:red";
      }
    },
    /**获取字典(材料名称) */
    getnameList() {
      this.$store.dispatch("dict/get", "clmc").then((data) => {
        this.nameList = data;
      });
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
      // console.log("flowStatusOptions", data);
    },
    // 按钮权限
    getDisabledBtns(rows) {
      for (let index in rows) {
        rows[index].disabledBtns = [];
        let userId = this.$store.getters.loginInfo.userId;
        if (rows[index].createUser !== userId) {
          rows[index].disabledBtns.push("edit");
          rows[index].disabledBtns.push("delete");
        }
      }
    },
    // downFile(row) {
    //   row.attId = row.uploadFile;
    //   this.$downFile(row);
    // },

    /**获取字典 */
    // async getTypeDictMap() {
    //   const { data } = await getDictItemList("fagl_falx_sjg");
    //   this.typeDictMap = data;
    //   this.typeOptions = buildTree(data, "-");
    //   console.log("获取左侧树",this.typeOptions);
    // },
    /**获取左侧树 */
    async getTypeDictMap() {
      const { data } = await getDictItemList("clmc_sx");
      this.typeDictMap = data;
      this.typeOptions = buildTree(data, "-");
      console.log("获取左侧树", this.typeOptions);
      this.currentNodekey = this.typeOptions[0].children[0].dictId;
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.currentNodekey); //一定要加这个选中了否则样式没有出来
      });

      this.firstGetTableData(this.typeOptions[0].children[0].dictName);
    },
    //首次进来默认选中第一个查询
    firstGetTableData(name) {
      //把选择的名称放在缓存里面
      this.$setStorage("reagentsMaterialName", name);
      this.query.name = name;
      this.getTableData();
    },
    getTypeDictName(id) {
      for (let item of this.typeDictMap) {
        if (item.dictId === id) {
          return item.dictName;
        }
      }
    },

    getTypes(val) {
      let names = "";
      let arr = JSON.parse(JSON.stringify(JSON.parse(val)));
      arr.forEach((element, index) => {
        names +=
          this.$DictionaryParsing(this.DitSpeciality, element) +
          (index == arr.length - 1 ? "" : "，");
      });
      //
      return names;
    },
    edit(row) {
      this.oprateRow.isView = false;
      this.type = "edit";
      this.title = "编辑-" + this.getDictName(this.query.type);
    },
    view(row) {
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "查看" + this.getDictName(this.query.type);
    },
    getDictName(id) {
      for (let item of this.typeDictMap) {
        if (item.dictId == id) {
          return item.dictName;
        }
      }
      return "";
    },
    /**获取字典 */
    async getJCXM() {
      const { data } = await getDictItemList("jcxm");
      this.DitSpeciality = data;
      console.log("flowStatusOptions", data);
    },
    reset() {
      //重置保留左侧树的选中;
      let name = this.query.name;
      this.query = {
        type: null,
        params: {},
      };
      this.query.name = name;
      this.query.current = 1;
      this.query.pageSize = 20;
      this.getTableData();
    },
    // 查询表格数据
    getTableData(type) {
      //必须带上名称
      if (this.query.name == null) {
        return;
      }
      this.pageParams.entity = this.query;
      this.pageParams.orderProperties = [
        {
          property: "createDate",
        },
      ];
      const params = JSON.parse(JSON.stringify(this.pageParams));
      console.log(params);
      page(params).then((data) => {
        this.tableData = data.data.records;
        console.log(this.tableData);
        this.pageParams.total = data.data.total;
        this.getDisabledBtns(this.tableData);
      });
    },
    // 节点单击事件
    handleNodeClick(node) {
      //叶子结点才加载数据
      if (!node.children) {
        //把选择的名称放在缓存里面
        this.query = {}
        this.$setStorage("reagentsMaterialName", node.dictName);
        this.query.name = node.dictName;
        this.getTableData();
      }
    },
    /**新增 */
    addHandle() {
      // this.oprateRow.dialogShow = true;
      this.flowShow = true;
    },
    /** 删除*/
    deleteHandle(row) {
      remove({
        id: row.id,
      }).then((res) => {
        if (!res.success) {
          return this.$message.error("删除失败：" + res.message);
        }
        this.$message.success("删除成功");
        this.getTableData();
      });
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    resultFormat(item) {
      if (item == 1) {
        return "合格";
      } else if (item == 2) {
        return "不合格";
      } else {
        return "";
      }
    },
    handleSizeChange(val) {
      this.pageParams = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams = val;
      this.getTableData();
    },
    async handelDeleteRow(row) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        this.deletedata(row.id);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
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

// /deep/ .el-table .el-table__body-wrapper {
//   overflow-x: auto;
// }
</style>

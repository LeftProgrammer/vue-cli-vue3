<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      :show-export-btn="true"
      title="检测记录列表"
      @initExportParams="initExportParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <template slot="tree">
        <el-tree
          ref="tree"
          :data="typeOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          node-key="dictId"
          highlight-current
          @node-click="handleNodeClick"
        />
      </template>
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="材料编号:" size="mini">
            <el-input
              v-model="query.code"
              placeholder="请输入材料编号"
            />
          </el-form-item>
          <el-form-item label="闭合日期:" size="mini" prop="startTime">
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            />
          </el-form-item>
          <el-form-item label="所属标段" size="mini" prop="section">
            <el-select
              v-model="query.section"
              class="w-100pre"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in sectionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="材料批号:" size="mini">
            <el-input
              v-model="query.batchCode"
              placeholder="请输入材料批号"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          type="primary"
          :icon="isMobile ? 'el-icon-circle-close' : 'el-icon-finished'"
          @click="selectClose"
        >
          {{ isMobile ? "取消" : "批量闭合" }}
        </el-button>
        <el-button
          v-if="isMobile"
          type="primary"
          icon="el-icon-check"
          @click="requestClose"
        >
          提交闭合
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" border>
          <el-table-column
            v-if="isMobile"
            type="selection"
            width="55"
            align="center"
            :selectable="selectableRow"
          />
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="50"
            align="center"
          />
          <el-table-column
            label="材料编号"
            align="center"
            prop="code"
            excel.sort="1"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.code" placement="top" effect="dark">
                <span class="text-ellipsis">{{ row.code }} </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="材料批号"
            align="center"
            prop="batchCode"
            excel.sort="2"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.batchCode"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis">
                  {{ row.batchCode }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="材料名称"
            align="center"
            prop="name"
            excel.dictType="syjc"
            excel.sort="3"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.name ? getTypeDictName(row.name) : '未知'"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis">
                  {{ row.name ? getTypeDictName(row.name) : "未知" }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="检测日期"
            align="center"
            prop="testDate"
            excel.dateFormat="yyyy-MM-dd"
            excel.sort="4"
          >
            <template slot-scope="{ row }">
              {{ row.testDate ? timeFormat(row.testDate, "yyyy-MM-DD") : "" }}
            </template>
          </el-table-column>
          <el-table-column
            label="检测报告"
            align="center"
            prop="testReport"
            excel.handler="excelHandleCovert"
            excel.args="file"
            excel.sort="6"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getFileName(row.testReport)"
                placement="top"
                effect="dark"
              >
                <span
                  class="text-ellipsis text-0096 pointer"
                  @click="previewFile(row.testReport)"
                >
                  {{ getFileName(row.testReport) }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="施工单位"
            align="center"
            prop="constructionUnit"
            excel.handler="excelHandleCovert"
            excel.args="unit"
            excel.sort="7"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="
                  row.constructionUnit ? getUnitName(row.constructionUnit) : ''
                "
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis">
                  {{
                    row.constructionUnit
                      ? getUnitName(row.constructionUnit)
                      : ""
                  }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="所属标段"
            align="center"
            prop="section"
            excel.handler="excelHandleCovert"
            excel.args="section"
            excel.sort="8"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.section ? getSelectionName(row.section) : ''"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis">
                  {{ row.section ? getSelectionName(row.section) : "" }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="使用部位"
            width="200"
            prop="pbsCode"
            align="center"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
            excel.sort="9"
          >
            <template slot-scope="scope">
              <bim-show :pbs-code="scope.row.pbsCode" />
            </template>
          </el-table-column>
          <el-table-column
            label="闭合日期"
            align="center"
            prop="closingDate"
            excel.dateFormat="yyyy-MM-dd"
            excel.sort="10"
          >
            <template slot-scope="{ row }">
              {{
                row.closingDate ? timeFormat(row.closingDate, "yyyy-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="{ row }">
              <div class="list-button-container flex justify-center">
                <el-link type="primary" plain @click="view(row)">
                  查看
                </el-link>
                <span v-if="!isSystem && !isMdgAdmin">
                  <el-divider direction="vertical" />
                  <el-link
                    type="primary"
                    plain
                    :disabled="editDisabled(row)"
                    @click="edit(row)"
                  >处理</el-link>
                </span>
                <span v-if="isSystem">
                  <el-divider direction="vertical" />
                  <el-link type="danger" plain @click="handelDeleteRow(row)">
                    管理员删除
                  </el-link>
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      v-if="oprateRow.dialogShow"
      :tree-node="treeNode"
      :node="node"
      :type="type"
      :title="title"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="getTableData"
    />
  </div>
</template>

<script>
import { remove, page, sectionList, corporates, closeMultiple } from "./api";
import { getDictItemList, buildTree } from "@/api/dict";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/TreeTable";
// import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import bimShow from "@/components/Bim/Show";

export default {
  name: "TestDetection",
  components: {
    TableLayout,
    // ListButton,
    dataform,
    bimShow,
  },
  mixins: [ListMixin],
  data() {
    return {
      isMobile: false,
      startTimeAndEndTime: [],
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
      options: [],
      tableData: [],
      query: {
        type: null,
        params: {},
      },
      node: {},
      dictList: [],

      /**组织机构选择 */
      deptShow: false,
      typeDictMap: [],
      typeOptions: [],
      unitList: [],
      url: { list: "" },
      /**施工标段 */
      sectionOptions: [],
      multipleSelection: [],
    };
  },
  computed: {
    exportParams() {
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
        },
      };
      return params;
    },
  },
  created() {
    this.getTypeDictMap();
    this.getTableData();
    //获取标段
    this.getSectionList();
    this.getUnit();
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    selectableRow(row) {
      const bool = this.editDisabled(row);
      return !bool;
    },
    handleSelectionChange(val) {
      //   选中得数据
      this.multipleSelection = val;
    },
    //   批量闭合
    selectClose() {
      this.isMobile = !this.isMobile;
      if (!this.isMobile) {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 发送闭合请求
    requestClose() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请至少选择一条检测记录");
        return;
      }
      let tips = this.multipleSelection.every(
        (item) => item.testResult != 1 && item.testResult != 2
      );
      this.$confirm(
        `确认要闭合所选材料报检？${!tips ? "(勾选数据包含已检测)" : ""}`,
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning",
        }
      )
        .then((_) => {
          console.log("关闭", _);
          let params = {
            ids: this.multipleSelection.map((item) => item.id).join(","),
          };
          closeMultiple(params).then((res) => {
            console.log("批量闭合", res);
            const { success } = res;
            if (success) {
              this.getTableData();
              this.isMobile = false;
              this.$message.success("闭合成功");
            } else {
              this.$message.error("闭合失败");
            }
          });
        })
        .catch((_) => {});
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    editDisabled(row) {
      let result = true;
      if (
        row.testSupervisionEngineer &&
        row.testSupervisionEngineer.indexOf(
          this.$getStorage("userInfo").userId
        ) > -1
      ) {
        result = false;
      }
      return result;
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/test/detection/export";
      exportParams.filename =
        "监理单位抽检-不合格" +
        (this.query.dictNamePath ? "-" + this.query.dictNamePath : "");
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    previewFile(fileName) {
      let arr = JSON.parse(fileName);
      if (Array.isArray(arr) && arr.length > 0) {
        this.$previewFileById(arr[0]);
      }
    },
    getFileName(fileName) {
      let name = "";
      let arr = JSON.parse(fileName);
      if (fileName && Array.isArray(arr) && arr.length > 0) {
        name = arr[0].name;
      }
      return name;
    },
    /**获取字典 */
    async getTypeDictMap() {
      const { data } = await getDictItemList("syjc");
      this.typeDictMap = data;
      this.typeOptions = buildTree(data, "-");
      // 默认展开第一级
      let thiss = this;
      this.$nextTick(() => {
        for (let i = 0; i < thiss.typeOptions.length; i++) {
          let item = thiss.typeOptions[i];
          let node = this.$refs.tree.getNode(item.dictId);
          node.expand();
        }
      });
    },
    /** 字段code转name */
    getTypeDictName(id) {
      for (let item of this.typeDictMap) {
        if (item.dictCode === id) {
          return item.dictName;
        }
      }
    },
    edit(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
      this.type = "edit";
      this.title = "处理-" + this.getTypeDictName(row.name);
    },
    view(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "查看-" + this.getTypeDictName(row.name);
    },
    // 收文单位
    getUnit() {
      corporates().then((res) => {
        this.unitList = res.data
          .filter((item) => {
            return item.corpLeaf !== 0;
          })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
      });
    },
    getUnitName(unitId) {
      if (!unitId) return;
      var name = "";
      this.unitList.forEach((x) => {
        if (x.corpId === unitId) {
          name = x.corpName;
        }
      });
      return name;
    },
    reset() {
      if (this.query.name) {
        const name = this.query.name;
        this.query = {
          name: name,
          params: {},
        };
      } else if (this.query.classification) {
        const classification = this.query.classification;
        this.query = {
          classification: classification,
          params: {},
        };
      } else {
        this.query = {
          params: {},
        };
      }
      this.startTimeAndEndTime = [];
      this.query.current = 1;
      this.query.pageSize = 20;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      if (this.startTimeAndEndTime?.length > 0) {
        this.$set(
          this.query.params,
          "beginClosingDate",
          this.startTimeAndEndTime[0]
        );
        this.$set(
          this.query.params,
          "endClosingDate",
          this.startTimeAndEndTime[1]
        );
      } else {
        this.$set(this.query.params, "beginCreateDate", null);
        this.$set(this.query.params, "endCreateDate", null);
      }
      this.$set(this.query, "source", "3");
      this.$set(this.query, "testResult", 2);
      this.pageParams.entity = this.query;
      // this.pageParams.orderProperties = [
      //   {
      //     property: "IF(ISNULL(entry_park_time), 0 ,1)",
      //     asc: "true",
      //   },
      //   {
      //     property: "closingDate",
      //     asc: "true",
      //   },
      // ];
      const params = JSON.parse(JSON.stringify(this.pageParams));
      // if (this.query.name) {
      //   params.entity.name = "*" + this.query.name + "*";
      // }
      console.log(params);
      page(params).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
    },
    // 节点单击事件
    handleNodeClick(node) {
      this.treeNode = node;
      var pNode = this.typeDictMap.filter((i) => {
        return i.dictCode === node.dictUpCode;
      });
      this.treeNode.pNode = pNode;
      this.$set(this.node, "name", node.dictCode);
      this.$set(
        this.node,
        "classification",
        pNode.length > 0 ? pNode[0].dictCode : ""
      );
      if (node.dictUpCode === "-") {
        this.query = {
          params: {},
        };
      } else if (node.children) {
        this.query = {
          classification: node.dictCode,
          params: {},
        };
      } else {
        this.query = {
          name: node.dictCode,
          params: {},
        };
      }
      this.pageParams.current = 1;
      let dictNamePath = "";
      node.dictPath
        .split(",")
        .slice(1)
        .forEach((item) => {
          dictNamePath +=
            this.typeDictMap.find((i) => i.dictCode === item).dictName + "-";
        });
      if (dictNamePath) {
        dictNamePath = dictNamePath.substring(0, dictNamePath.length - 1);
      }
      this.query.dictNamePath = dictNamePath;
      this.getTableData();
    },
    /**新增 */
    addHandle() {
      if (this.treeNode && this.treeNode.pNode) {
        this.$set(this.node, "name", this.treeNode.dictCode);
        this.$set(
          this.node,
          "classification",
          this.treeNode.pNode.length > 0 ? this.treeNode.pNode[0].dictCode : ""
        );
      }
      this.title = "新增-" + this.getTypeDictName(this.query.name);
      if (this.query.name == null) {
        this.$message.warning("请选择左侧具体的材料类型");
        return;
      }
      this.type = "add";
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
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
        this.deleteHandle(row);
      } catch (e) {
        console.error(e);
      }
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    // 施工标段解析成文字
    getSelectionName(value) {
      let data = this.sectionOptions.find((item) => item.id == value);
      if (data) {
        return data.name;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
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
</style>

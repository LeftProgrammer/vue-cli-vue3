<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      :show-export-btn="true"
      title="报检列表"
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
          <el-form-item label="日期:" size="mini" prop="startTime">
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
        <el-button type="primary" icon="el-icon-plus" @click="addHandle()">
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" border>
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
            label="材料分类"
            align="center"
            prop="classification"
            excel.dictType="syjc"
            excel.sort="2"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="
                  row.classification
                    ? getTypeDictName(row.classification)
                    : '未知'
                "
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis">
                  {{
                    row.classification
                      ? getTypeDictName(row.classification)
                      : "未知"
                  }}
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
            label="材料批号"
            align="center"
            prop="batchCode"
            excel.sort="4"
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
            label="所属标段"
            align="center"
            prop="section"
            excel.handler="excelHandleCovert"
            excel.args="section"
            excel.sort="5"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.section ? getSelectionName(row.section) : '未知'"
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis">
                  {{ row.section ? getSelectionName(row.section) : "未知" }}
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
            excel.sort="6"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="
                  row.constructionUnit
                    ? getUnitName(row.constructionUnit)
                    : '未知'
                "
                placement="top"
                effect="dark"
              >
                <span class="text-ellipsis">
                  {{
                    row.constructionUnit
                      ? getUnitName(row.constructionUnit)
                      : "未知"
                  }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="创建人"
            align="center"
            prop="createUsername"
            excel.sort="7"
          />
          <el-table-column
            label="创建日期"
            align="center"
            prop="createDate"
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
            excel.sort="8"
          >
            <template slot-scope="{ row }">
              {{
                row.createDate ? timeFormat(row.createDate, "yyyy-MM-DD") : ""
              }}
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
            label="施工自检结论"
            align="center"
            prop="constructionResult"
            excel.readConverterExp="0=未检测,1=合格,2=不合格"
          >
            <template slot-scope="{ row }">
              <div v-if="row.constructionResult != '4'">
                <el-tag
                  :type="
                    row.constructionResult == 1
                      ? 'success'
                      : row.constructionResult == 2
                        ? 'danger'
                        : 'info'
                  "
                >
                  {{
                    row.constructionResult == 1
                      ? "合格"
                      : row.constructionResult == 2
                        ? "不合格"
                        : "未检测"
                  }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          >
          <el-table-column
            label="监理抽检结论"
            align="center"
            prop="supervisionResult"
            excel.readConverterExp="0=未检测,1=合格,2=不合格"
          >
            <template slot-scope="{ row }">
              <!--              4就是什么  没有闭合 没有 检测-->
              <div v-if="row.supervisionResult != '4'">
                <el-tag
                  :type="
                    row.supervisionResult == 1
                      ? 'success'
                      : row.supervisionResult == 2
                        ? 'danger'
                        : 'info'
                  "
                >
                  {{
                    row.supervisionResult == 1
                      ? "合格"
                      : row.supervisionResult == 2
                        ? "不合格"
                        : "未检测"
                  }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          >
          <el-table-column
            label="试验中心抽检结论"
            align="center"
            prop="reagentResult"
            excel.readConverterExp="0=未检测,1=合格,2=不合格"
          >
            <template slot-scope="{ row }">
              <!--              4就是什么  没有闭合 没有 检测-->
              <div v-if="row.reagentResult != '4'">
                <el-tag
                  :type="
                    row.reagentResult == 1
                      ? 'success'
                      : row.reagentResult == 2
                        ? 'danger'
                        : 'info'
                  "
                >
                  {{
                    row.reagentResult == 1
                      ? "合格"
                      : row.reagentResult == 2
                        ? "不合格"
                        : "未检测"
                  }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          >
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <list-button
                :data="row"
                :from-parent="isCreateUser(row)"
                :custom-disabled-fun="customDisabledFun"
                @delete="handelDeleteRow"
                @view="view"
                @edit="edit"
              />
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
      @closed="oprateRow.dialogShow = false"
      @ok="getTableData"
    />
  </div>
</template>

<script>
import { remove, page, sectionList, sectionAllList, corporates } from "./api";
import { getDictItemList, buildTree } from "@/api/dict";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import bimShow from "@/components/Bim/Show";

export default {
  name: "TestDetection",
  components: {
    TableLayout,
    ListButton,
    dataform,
    bimShow,
  },
  mixins: [ListMixin],
  data() {
    return {
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
      sectionAllOptions: [],
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
    // 业务自定义 禁用
    customDisabledFun(row) {
      return !row.canDelete;
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/test/detection/export";
      exportParams.filename =
        "材料报检" +
        (this.query.dictNamePath ? "-" + this.query.dictNamePath : "");
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    isCreateUser(row) {
      let isCreate = true;
      let userInfo = this.$getStorage("userInfo");
      if (userInfo) {
        if (userInfo.userId == row.createUser) {
          isCreate = true;
        } else {
          isCreate = false;
        }
      } else {
        isCreate = false;
      }
      return isCreate;
    },
    getFileName(fileName) {
      let name = "";
      let arr = JSON.parse(fileName);
      if (fileName && Array.isArray(arr) && arr.length > 0) {
        name = arr[0].name;
      }
      return name;
    },
    downFile(row) {
      let arr = JSON.parse(row.uploadFile);
      if (Array.isArray(arr) && arr.length > 0) {
        this.$previewFileById(arr[0]);
      }
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
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
      this.type = "edit";
      this.title = "编辑-" + this.getTypeDictName(row.name);
    },
    view(row) {
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
      var name = "未知";
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
          "beginCreateDate",
          this.startTimeAndEndTime[0]
        );
        this.$set(
          this.query.params,
          "endCreateDate",
          this.startTimeAndEndTime[1]
        );
      } else {
        this.$set(this.query.params, "beginCreateDate", null);
        this.$set(this.query.params, "endCreateDate", null);
      }
      this.$set(this.query, "source", 1);
      this.pageParams.entity = this.query;
      this.pageParams.orderProperties = [
        {
          property: "createDate",
        },
      ];
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
      // 需求要求改为固定账号：试验检测中心收发文
      this.oprateRow.data = { testCenter: "1175575998972821504" };
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    /** 删除*/
    deleteHandle(row) {
      console.log(row);
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
      console.log(row);
      try {
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
      sectionAllList({}).then((res) => {
        if (res.success) {
          this.sectionAllOptions = res.data;
        }
      });
    },
    // 施工标段解析成文字
    getSelectionName(value) {
      let data = this.sectionAllOptions.find((item) => item.id == value);
      if (data) {
        return data.name;
      }
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .table-content .table .table-cnotent .el-table .el-table__body-wrapper {
  height: calc(100% - 80px) !important;
}

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

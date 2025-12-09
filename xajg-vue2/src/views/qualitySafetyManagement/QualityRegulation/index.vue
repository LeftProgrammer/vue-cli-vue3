<template>
  <div class="page-list">
    <table-layout
      title="质量管理制度列表"
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="制度名称:">
            <el-input v-model="pageParams.entity.regulationName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="制度编号:">
            <el-input v-model="pageParams.entity.regulationCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="签发单位:">
            <el-cascader
              v-model="pageParams.entity.issuanceUnit"
              :props="unitTreeProps"
              :show-all-levels="false"
              :options="unitTree"
            ></el-cascader>
            <!-- <el-select
              v-model="selectedUnitName"
              clearable
              popper-class="tree-select"
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option value="" label="">
                <el-tree
                  ref="unitTree"
                  :data="unitTree"
                  :props="unitTreeProps"
                  node-key="corpId"
                  highlight-current
                  :default-expand-all="true"
                  @node-click="handleUnitTreeNodeClick"
                >
                  <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span :class="{ 'disabled-node': data.corpLeaf === 0 }">{{
                      data.corpName
                    }}</span>
                  </span>
                </el-tree>
              </el-option>
            </el-select> -->
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
            width="54"
            align="center"
          />
          <el-table-column
            label="制度名称"
            align="left"
            header-align="center"
            prop="regulationName"
            excel.sort="2"
          >
            <template slot-scope="{ row }">
              <el-link type="primary" :underline="false" @click="view(row)">{{
                row.regulationName
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="制度编号"
            prop="regulationCode"
            align="left"
            header-align="center"
            width="350"
          />
          <el-table-column
            label="签发单位"
            prop="issuanceUnit"
            align="left"
            header-align="left"
            width="400"
          >
            excel.handler="excelHandleCovert" excel.args="issuanceUnit" excel.sort="5">
            <template slot-scope="{ row }">
              <!-- <el-tooltip
                :content="getUnitName(row.issuanceUnit)"
                placement="top"
                effect="dark"
              > -->
                <div class="text-ellipsis">
                  {{ getUnitName(row.issuanceUnit) }}
                </div>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column
            label="发文日期"
            align="center"
            prop="issuanceDate"
            width="120"
            excel.sort="6"
            excel.dateFormat="yyyy-MM-dd"
          >
            <template slot-scope="{ row }">
              {{ row.issuanceDate ? timeFormat(row.issuanceDate, "YYYY-MM-DD") : "" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <list-button
                :data="row"
                :btns="[
                  { title: '编辑', method: 'edit' },
                  { title: '删除', method: 'delete' }
                ]"
                @edit="edit"
                @delete="deleteHandle"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      :enterAble="enterAble"
      :unitTree="unitTree"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow"
      :date="type"
      :readonly="oprateRow.isView"
      @sureson="sureson"
    ></dataform>
  </div>
</template>

<script>
import { remove, page, unitAllList } from "./api";
import { getDictItemTree } from "@/api/dict";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import bimShow from "@/components/Bim/Show";

export default {
  name: "QualityRegulation",
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    dataform,
    bimShow
  },
  data() {
    return {
      showExportBtn: true,
      enterAble: true,
      title: "",
      type: "",
      belongUnit: [],
      unitTree: [], // 单位树形结构
      unitTreeProps: {
        expandTrigger: "hover",
        children: "children",
        emitPath: false,
        label: "corpName",
        value: "corpId"
      },
      selectedUnitName: ""
    };
  },
  computed: {
    exportParams() {
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query
        }
      };
      return params;
    }
  },
  created() {
    this.getTypeOptions();
    this.getUnitAll();
  },
  methods: {
    // 根据单位id 获取名称
    getUnitName(unitIds) {
      if (!unitIds) return;
      let arr = unitIds.split(",");
      let names = [];
      this.belongUnit.forEach((x) => {
        if (arr.includes(x.corpId)) {
          names.push(x.corpName);
        }
      });
      return names.join(",") || unitIds;
    },
    /**
     * 将扁平数组转换成树形结构
     * @param {Array} data 扁平数组数据
     * @returns {Array} 树形结构数组
     */
    buildUnitTree(data) {
      if (!Array.isArray(data)) {
        return [];
      }

      // 创建一个映射表，用于快速查找节点
      const map = {};
      data.forEach((item) => {
        map[item.corpId] = { ...item, children: [] };
      });

      // 构建树形结构
      const treeData = [];

      data.forEach((item) => {
        const currentNode = map[item.corpId];

        // 如果有父节点且父节点存在于映射表中，则添加到父节点的children中
        if (item.corpPid && map[item.corpPid]) {
          map[item.corpPid].children.push(currentNode);
        } else {
          // 没有父节点或父节点不在数据中，则作为根节点
          treeData.push(currentNode);
        }
      });
      // 遍历树形结构，删除没有子节点的节点的children字段
      treeData.forEach((node) => {
        const removeEmptyChildren = (node) => {
          if (node.children && node.children.length === 0) {
            delete node.children; // 删除没有子节点的children字段
          }
          node.children?.forEach(removeEmptyChildren); // 递归处理子节点
        };
        removeEmptyChildren(node);
      });
      return treeData;
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/protection/report/manage/export";
      let type = this.pageParams.entity.type;
      if (type == "yb") {
        type = "-月报";
      } else if (type == "jb") {
        type = "-季报";
      } else if (type == "nb") {
        type = "-年报";
      } else {
        type = "";
      }
      exportParams.filename = "环水保报告" + type;
      exportParams.params = this.pageParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    getFileName(fileName) {
      let name = "";
      let arr = JSON.parse(fileName);
      if (fileName && Array.isArray(arr) && arr.length > 0) {
        name = arr[0].name;
      }
      return name;
    },
    query() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
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
    reset() {
      this.selectedUnitName = "";
      this.pageParams.entity.issuanceUnit = "";
      if (this.pageParams.entity.type) {
        this.pageParams.current = 1;
        this.pageParams.pageSize = 20;
        const type = this.pageParams.entity.type;
        this.pageParams.entity = {
          type: type
        };
      } else {
        this.pageParams.current = 1;
        this.pageParams.pageSize = 20;
        this.pageParams.entity = {};
      }
      this.getTableData();
    },
    /**获取字典 */
    async getTypeOptions() {
      let res = await getDictItemTree("hsbg_bgml_sjg");
      const { success, data } = res;
      if (success) {
        this.typeOptions = data || [];
      } else {
        this.typeOptions = [];
      }
    },
    sureson() {
      this.oprateRow.dialogShow = false;
      this.getTableData();
    },
    handleNodeClick(node) {
      this.pageParams.entity = {};
      if (node.leaf) {
        // this.pageParams.entity.type = node.dictId;
        this.pageParams.entity.type = node.dictCode;
      } else {
        this.pageParams.entity.type = null;
      }
      this.pageParams.current = 1;
      this.getTableData();
    },
    getTableData() {
      page(this.pageParams).then((res) => {
        this.tableData = res.data.records;
        this.pageParams.total = res.data.total;
        this.getDisabledBtns(this.tableData);
      });
    },
    addHandle() {
      this.enterAble = true;
      this.type = this.pageParams.entity.type;
      this.title = "新增";
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    downFile(row) {
      let arr = JSON.parse(row.uploadFile);
      if (Array.isArray(arr) && arr.length > 0) {
        this.$previewFileById(arr[0]);
      }
    },
    getTypeDictName(id) {
      if (this.typeOptions && this.typeOptions.length > 0) {
        for (let item of this.typeOptions[0].children) {
          if (item.dictCode === id) {
            return item.dictName;
          }
        }
      } else {
        return "";
      }
    },
    view(val) {
      this.oprateRow.data = val;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = val.type;
      this.enterAble = false;
      this.title = "详情";
    },
    edit(val) {
      this.oprateRow.dialogShow = true;
      this.oprateRow.data = val;
      this.oprateRow.isView = false;
      this.type = val.type;
      this.enterAble = true;
      this.title = "编辑";
    },
    deleteHandle(row) {
      remove({ id: row.id }).then((res) => {
        if (res.success) {
          this.$message.success("删除成功");
          this.getTableData();
        }
      });
    },

    // 获取当前人的所属机构，同时构建树形结构
    async getUnitAll() {
      try {
        // console.log("获取所有的单位");
        const result = await unitAllList();
        const { data, success } = result;
        if (!success) {
          this.unitListAll = [];
          this.$message.error("获取单位列表失败");
          return;
        }
        let unitList = data
          // .filter((item) => {
          //   return item.corpLeaf !== 0;
          // })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
        this.belongUnit = unitList;
        // 构建单位树形结构
        this.unitTree = this.buildUnitTree(unitList);
        console.log("unitTree", this.unitTree);
        return unitList;
      } catch (err) {
        console.log("err", err);
      }
    },
    /**
     * 处理单位树节点点击事件
     * @param {Object} data 节点数据
     */
    handleUnitTreeNodeClick(data) {
      // 如果是叶子节点 (corpLeaf === 0)，则不可选择
      console.log("节点被点击", data);
      if (data.corpLeaf === 0) {
        return;
      }

      this.pageParams.entity.issuanceUnit = data.corpId;
      this.selectedUnitName = data.corpName;
      // 关闭下拉框
      this.$nextTick(() => {
        const select = this.$el.querySelector(".el-select");
        if (select && select.__vue__) {
          select.__vue__.visible = false;
        }
      });
    },

    /**
     * 处理下拉框显示变化
     * @param {Boolean} visible 是否显示
     */
    handleVisibleChange(visible) {
      if (visible) {
        this.$nextTick(() => {
          // 自定义下拉框行为
          this.$visibleChange(visible, "tree-select-popper");
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
}
/* 树形下拉选择器样式 */
.tree-select {
  .el-select-dropdown__wrap {
    max-height: 550px;
    overflow-x: hidden;
  }

  .tree-select-container {
    padding: 6px 0;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px !important;
    font-family: inherit !important;
  }

  .disabled-node {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  .el-tree-node__content {
    height: 34px;
  }
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #f5f7fa;
  }

  .el-tree-node__content:hover {
    background-color: #f5f7fa;
  }

  .el-tree {
    font-size: 14px !important;
    font-family: inherit !important;
  }

  .el-scrollbar {
    height: auto !important;
    max-height: 550px;
  }

  .el-select-dropdown__item {
    height: auto;
    padding: 0;
    font-size: 14px !important;
    font-family: inherit !important;
  }
}
</style>

<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      :show-search-btns="false"
      title="计划列表"
      :show-export-btn="true"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
      @initExportParams="initExportParams"
    >
      <template slot="tree">
        <el-tree
          ref="tree"
          :data="typeOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          node-key="corpId"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </template>
      <template slot="form">
        <!-- <el-form :model="query" :inline="true"> </el-form> -->
      </template>
      <template slot="opratebtns">
        <!-- 新增按钮只有在是自己单位的时候 才能点击新增 由于 业主单位近年来查看全部 所以业主单位进来点击的不是本单位的就不能点击新增 考虑多单位 -->
        <el-button
          v-if="addDisabled"
          icon="el-icon-plus"
          type="primary"
          @click="addHandle(), (type = 'add')"
        >
          新增
        </el-button>
        <span v-else />
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" border>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="年度"
            excel.dateFormat="yyyy"
            align="center"
            width="200"
            prop="year"
          >
            <template slot-scope="{ row }">
              {{ row.year ? timeFormat(row.year, "YYYY") : "" }}
            </template>
          </el-table-column>
          <el-table-column label="计划名称" align="center" prop="name">
            <template slot-scope="{ row }">
              <el-tooltip :content="row.name" placement="top" effect="dark">
                <div class="text-ellipsis">{{ row.name }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="培训次数"
            align="center"
            prop="num"
            width="200"
          />
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <list-button
                :data="row"
                @delete="deleteHandle"
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
import { add, remove, BelongTo, page } from "./api";
import { getDictItemList, buildTree, getCorporatesTree } from "@/api/dict";
import enums from "@/config/enums";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";

export default {
  name: "MonitoringPoint",
  components: {
    TableLayout,
    ListButton,
    dataform,
  },
  mixins: [ListMixin],
  data() {
    return {
      belongUnit: [], //登陆人的归宿单位
      treeNode: {}, //点击树节点传递给子组件使用
      type: "",
      title: "培训计划列表",
      DitSpeciality: [],
      defaultProps: {
        children: "children",
        label: "corpName",
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
        unitId: null,
      },

      dictList: [],
      readonly: false,

      /**组织机构选择 */
      deptShow: false,
      typeDictMap: [],
      typeOptions: [],

      url: { list: "" },
      userId: "",
      corpId: "",
      excludeOptionNames: [],
    };
  },
  computed: {
    addDisabled() {
      let inItem = this.belongUnit.find(
        (x) => x.corpId == this.treeNode.corpId
      );
      if (inItem) {
        return true;
      } else {
        return false;
      }
    },

    exportParams() {
      this.pageParams.entity = this.query;
      const params = { ...this.pageParams };
      return params;
    },
  },
  created() {
    this.getTypeDictMap();
    this.getJCXM();
    // 获取用户归属单位
    this.getBelongTo();
    this.userId = this.$getStorage("userInfo").userId;
    this.corpId = this.$getStorage("userInfo").corpId;
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/synthesis/train-plan/export";
      exportParams.filename = "培训计划";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    // 获取当前人的所属机构
    async getBelongTo() {
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
          // 从源数据中过滤出重复的单位
          this.belongUnit = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          console.log("this.belongUnitSouce", this.belongUnit);
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },
    /* 获取字典 */
    async getTypeDictMap() {
      const { data } = await getCorporatesTree();
      let sortData = data;
      if (data && Array.isArray(data) && data.length > 0) {
        data[0].children?.sort((a, b) => {
          return a.corpSort - b.corpSort;
        }) || [];
      }
      //获取字典
      this.excludeOptionNames = [];
      const gldwmc = await getDictItemList("gldwmc");
      for (let i = 0; i < gldwmc.data.length; i++) {
        this.excludeOptionNames.push(gldwmc.data[i].dictName);
      }
      sortData[0].children = sortData[0].children.filter(item => !this.excludeOptionNames.includes(item.corpName));
      this.typeDictMap = sortData;
      this.typeOptions = sortData;
    },

    getTypeDictName(id) {
      for (let item of this.typeDictMap) {
        if (item.dictId === id) {
          return item.dictName;
        }
      }
    },
    downLoad(row) {
      console.log("rowddd", row);
      let arr = JSON.parse(row.uploadFile);
      if (Array.isArray(arr) && arr.length > 0) {
        this.$downFileById(arr[0]);
      }
    },
    edit(row) {
      this.type = "edit";
      this.title = "编辑-培训计划";
    },
    view(row) {
      this.type = "view";
      this.title = "查看-培训计划";
    },
    /**获取字典 */
    async getJCXM() {
      const { data } = await getDictItemList("jcxm");
      this.DitSpeciality = data;
    },
    reset() {
      this.query = {
        unitId: this.treeNode.corpId || "",
      };
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    // 查询表格数据
    getTableData(type) {
      // if (this.query.unitId == null || this.query.unitId.length < 5) {
      //   this.$message.warning("请选择左侧单位");
      //   return;
      // }
      this.pageParams.entity = this.query;
      const params = { ...this.pageParams };
      setTimeout(() => {
        page(params).then((data) => {
          this.tableData = data.data.records;
          this.pageParams.total = data.data.total;
        });
      }, 500);
    },
    // 节点单击事件
    handleNodeClick(node) {
      this.treeNode = node;
      this.query = {
        unitId: node.corpId,
      };
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    /**新增 */
    addHandle() {
      this.title = "新增-培训计划";
      if (this.query.unitId == null) {
        this.$message.warning("请选择左侧单位");
        return;
      }
      this.oprateRow.data = {
        unitId: this.query.unitId,
      };
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
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
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

/deep/.el-range-editor--small .el-range-input {
  font-size: 12px;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
</style>
<style scoped lang="scss">
/deep/.el-range-editor--medium .el-range-input {
  font-size: 12px;
}
</style>

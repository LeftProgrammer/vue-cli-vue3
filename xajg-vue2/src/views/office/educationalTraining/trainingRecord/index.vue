<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="getTableData"
      @reset="reset"
      title="培训台账"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <template slot="tree">
        <el-tree
          :data="typeOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          ref="tree"
          node-key="corpId"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </template>
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="类型:" prop="type" class="ml-20">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="query.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in DitSpeciality"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="培训日期:" class="ml-20">
            <el-date-picker
              v-model="date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          v-if="addDisabled"
          icon="el-icon-plus"
          type="primary"
          @click="addHandle(), (type = 'add')"
        >
          新增
        </el-button>
        <span v-else></span>
      </template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          height="100%"
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            label="序号"
            :index="getIndex"
            type="index"
            :width="$calculateWidth(50)"
            align="center"
          />
          <el-table-column
            label="培训名称"
            align="center"
            prop="name"
            :min-width="$calculateWidth(300)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.name" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">{{ row.name }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            align="center"
            prop="type"
            excel.dictType="pxzllx"
            :width="$calculateWidth(150)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.type ? getTypes(row.type) : ''"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ row.type ? getTypes(row.type) : "" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="培训日期"
            align="center"
            prop="trainDate"
            :width="$calculateWidth(150)"
            excel.dateFormat="yyyy-MM-dd"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="
                  row.trainDate ? timeFormat(row.trainDate, 'YYYY-MM-DD') : ''
                "
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{
                    row.trainDate ? timeFormat(row.trainDate, "YYYY-MM-DD") : ""
                  }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="培训地点"
            align="center"
            prop="address"
            :width="$calculateWidth(275)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.address" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">{{ row.address }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="主持人"
            align="center"
            prop="mc"
            :width="$calculateWidth(200)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.mc" placement="top" effect="dark">
                <div class="text-ellipsis-clamp">{{ row.mc }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="参训人数"
            align="center"
            prop="peopleNum"
            :width="$calculateWidth(100)"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <list-button
                :data="row"
                @delete="deleteHandle"
                @view="view"
                @edit="edit"
              ></list-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <dataform
      :treeNode="treeNode"
      :type="type"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="oprateRow.dialogShow = false"
      @ok="getTableData"
    >
    </dataform>
  </div>
</template>

<script>
import { add, remove, BelongTo, page } from "./api";
import { getDictItemList, getCorporatesTree } from "@/api/dict";
import enums from "@/config/enums";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";

export default {
  name: "monitoring-point",
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    dataform,
  },
  data() {
    return {
      belongUnit: [], //登陆人的归宿单位
      treeNode: {}, //点击树节点传递给子组件使用
      type: "",
      title: "培训台账列表",
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
        type: null,
        params: {},
      },
      date: [],
      dictList: [],
      readonly: false,

      /**组织机构选择 */
      deptShow: false,
      typeDictMap: [],
      typeOptions: [],
      excludeOptionNames: [],

      url: { list: "" },
      userId: "",
      corpId: "",
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
      if (this.date && this.date.length > 0) {
        this.query.startDate = this.date[0] + " 00:00:00";
        this.query.endDate = this.date[1] + " 23:59:59";
      }
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      return params;
    },
  },
  created() {
    this.getTypeDictMap();
    this.getJCXM();
    this.getBelongTo();
    this.userId = this.$getStorage("userInfo").userId;
    this.corpId = this.$getStorage("userInfo").corpId;
  },
  methods: {

    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/synthesis/train-record/export";
      exportParams.filename = "培训台账";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },

    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
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
      // this.typeDictMap = sortData;
      //获取字典
      this.excludeOptionNames = [];
      const gldwmc = await getDictItemList("gldwmc");
      for (let i = 0; i < gldwmc.data.length; i++) {
        this.excludeOptionNames.push(gldwmc.data[i].dictName);
      }
      sortData[0].children = sortData[0].children.filter(item => !this.excludeOptionNames.includes(item.corpName));
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
    getTypes(val) {
      let name = "";
      this.DitSpeciality.forEach((element, index) => {
        if (val == element.dictId) {
          name = element.dictName;
        }
      });
      return name;
    },
    edit(row) {
      this.type = "edit";
      this.title = "编辑-培训台账";
    },
    view(row) {
      this.type = "view";
      this.title = "查看-培训台账";
    },
    /**获取字典 */
    async getJCXM() {
      const { data } = await getDictItemList("pxzllx");
      this.DitSpeciality = data;
      this.typeDictMap = data;
    },
    reset() {
      this.query = {
        unitId: this.treeNode.corpId || "",
      };
      this.date = [];
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      // if (this.query.unitId == null || this.query.unitId.length < 5) {
      //   this.$message.warning("请选择左侧单位");
      //   return;
      // }
      if (this.date && this.date.length > 0) {
        this.query.startDate = this.date[0] + " 00:00:00";
        this.query.endDate = this.date[1] + " 23:59:59";
      }
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
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
      this.title = "新增-培训台账";
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

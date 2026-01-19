<template>
  <div class="cost" style="width: 100%; height: 100%; padding: 15px">
    <table-layout
      :page="pageParams"
      @query="handleQuery"
      @reset="reset"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
    >
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="合同名称:">
            <el-input v-model="pageParams.entity.contractName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="合同编号:">
            <el-input v-model="pageParams.entity.contractCode" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="合同类型:">
            <el-select v-model="pageParams.entity.type">
              <el-option label="工程类" :value="1" />
              <el-option label="非工程类" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="发起单位:">
            <el-select v-model="pageParams.entity.unit">
              <el-option
                v-for="item in unitOptions"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发起日期:">
            <el-date-picker
              v-model="pageParams.entity.createDate"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form>
      </template>
      <!-- 数据表格 -->
      <template slot="table">
        <div class="content">
          <div class="table-wrapper">
            <el-table
              ref="multipleTable"
              :data="tableData"
              height="100%"
              border
              @header-dragend="handleHeaderDragEnd"
            >
              <el-table-column
                label="序号"
                type="index"
                :index="getIndex"
                width="50"
                align="center"
              />
              <el-table-column
                label="合同名称"
                prop="contractName"
                align="left"
                :min-width="$calculateWidth(190)"
              >
                <template slot-scope="{ row }">
                  <el-link type="primary" class="text-ellipsis-clamp" @click="view(row)">
                    {{ row.contractName }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column
                label="合同编号"
                prop="contractCode"
                align="left"
                :min-width="$calculateWidth(190)"
              />
              <el-table-column
                label="合同类型"
                prop="signStatus"
                align="center"
                :width="$calculateWidth(120)"
              >
                <template slot-scope="{ row }">
                  {{ row.type === 1 ? "工程类" : "非工程类" }}
                </template>
              </el-table-column>
              <el-table-column
                label="发起单位"
                prop="unit"
                align="left"
                :min-width="$calculateWidth(190)"
              />
              <el-table-column
                label="发起人"
                prop="createUsername"
                align="center"
                :width="$calculateWidth(120)"
              />
              <el-table-column
                label="发起日期"
                prop="signStatus"
                align="center"
                :width="$calculateWidth(120)"
              >
                <template slot-scope="{ row }">
                  {{ dateFormat(row.createDate, "YYYY-MM-DD") }}
                </template>
              </el-table-column>
              <el-table-column
                label="当前节点"
                prop="flowName"
                align="center"
                :width="$calculateWidth(180)"
              >
                <template slot-scope="{ row }">
                  <el-tooltip :content="row.flowName" placement="top" effect="dark">
                    <div class="text-ellipsis-clamp">{{ row.flowName }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="流程状态"
                prop="flowStatus"
                align="center"
                excel.readConverterExp="0=未提交,1=流转中,2=已完成"
                :width="$calculateWidth(120)"
              >
                <template slot-scope="scope">
                  <flow-status :row="scope.row" :flow-name="scope.row.flowName" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </table-layout>
    <!-- 新增弹框 -->
    <dataform
      v-if="oprateRow.dialogShow"
      :type="type"
      :title="title"
      :visible="oprateRow.dialogShow"
      :oprate-row="oprateRow"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="getTableData"
    />
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import { page, unitAllList } from "./api";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import { dateFormat } from "@/utils";
import dataform from "./dataform.vue";
export default {
  name: "ContractCost",
  components: { TableLayout, dataform },
  mixins: [FlowListMixin],
  data() {
    return {
      pageParams: {
        total: 0,
        current: 1,
        entity: {},
        pageSize: 20
      },
      typeList: [],
      unitOptions: [],
      tableData: [],
      title: "",
      oprateRow: {}
    };
  },
  computed: {
    userInfo() {
      return this.$getStorage("userInfo");
    }
  },
  created() {
    this.getUnitList();
  },

  methods: {
    dateFormat,
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    view(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "详情";
    },
    handelPageSizeChange(page) {
      this.pageParams.current = 1;
      this.pageParams.pageSize = page.pageSize;
      this.getTableData();
    },
    handelCurrentChange(page) {
      this.pageParams.current = page.current;
      this.getTableData();
    },
    /**
     * @description 获取字典
     */
    async getUnitList() {
      const { data, success } = await unitAllList();
      if (success) {
        this.unitOptions = data
          .filter((x) => x.corpPid)
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
      }
    },

    reset() {
      this.pageParams = {
        pageSize: 20,
        size: 20,
        current: 1,
        entity: {},
        total: 0
      };
      this.getTableData();
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    getTableData(pageInfo) {
      const pageParams = Object.assign(this.pageParams, pageInfo);
      if (pageParams.entity.createDate?.length > 0) {
        pageParams.entity.startCreateDate = pageParams.entity.createDate[0];
        pageParams.entity.endCreateDate = pageParams.entity.createDate[1];
        delete pageParams.createDate;
      }
      page(this.pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        }
      });
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
    }
  }
};
</script>

<style scoped lang="scss">
.cost {
  height: 100%;
  overflow: hidden;
  color: #fff;

  .content {
    width: 100%;
    display: flex;
    height: 100%;

    .left-content {
      height: 100%;
      position: relative;

      &:hover {
        .drag-line {
          width: 5px;
          background-color: #e4e1e1;
        }
      }
    }

    .tree-wrapper {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      border: #e5e5e5 1px solid;
    }

    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }
}
</style>

<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      title="合同登记列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="合同名称:">
            <el-input v-model="query.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="合同编号:">
            <el-input v-model="query.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="合同类型:">
            <el-select
              ref="flowStateRef"
              v-model="query.type"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in contractTypeList"
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
          icon="el-icon-plus"
          type="primary"
          @click="addHandle(), (type = 'add')"
        >
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            align="center"
          />
          <el-table-column label="合同名称" prop="name" align="left">
            <template slot-scope="{ row }">
              <el-link type="primary" @click="view(row)">{{
                row.name
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="合同编号"
            prop="code"
            align="left"
            header-align="center"
            width="180"
          />
          <el-table-column label="合同类型" align="center" prop="type">
            <template slot-scope="scoped">
              <span>{{
                $DictionaryParsing(contractTypeList, scoped.row.type)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="签约单位"
            prop="contractedUnit"
            align="center"
            width="120"
          />
          <el-table-column
            label="合同总价（元）"
            prop="amount"
            align="right"
            width="150"
          />
          <el-table-column
            label="签订日期"
            prop="startDate"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              {{ row.startDate ? timeFormat(row.startDate, "YYYY-MM-DD") : "" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="180" align="center">
            <template #default="{ row }">
              <list-button :data="row" @delete="deleteHandle" @edit="edit" />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

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
import { remove, page, getStaffList } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import { getDictItemList } from "@/api/dict";
import bimShow from "@/components/Bim/Show/index.vue";

export default {
  name: "ContractSign",
  components: {
    bimShow,
    TableLayout,
    ListButton,
    dataform,
  },
  mixins: [ListMixin],
  data() {
    return {
      type: "",
      title: "",
      DitSpeciality: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      oprateRow: {},
      options: [],
      tableData: [],
      query: {
        params: {},
      },
      date: [],
      dictList: [],
      readonly: false,
      deptShow: false,
      url: { list: "" },
      userId: "",
      staffList: [],
      contractTypeList: [],
      paymentMethodList: [],
    };
  },
  computed: {},
  created() {
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
    this.getStaffList();
    this.getDictItemList();
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    getNumber(e) {
      if (e) {
        return (e - 0).toFixed(2);
      }
    },
    edit(row) {
      this.type = "edit";
      this.oprateRow.dialogShow = true;
      this.oprateRow.data = row;
      this.title = "编辑";
      console.log(row);
    },
    view(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "详情";
    },
    reset() {
      this.query = {};
      this.date = [];
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
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
    /* 新增 */
    addHandle() {
      this.type = "addHandle";
      this.title = "新增";
      console.log("addHandle");
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
      if (!time) {
        return "";
      }
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
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

    // 获取当前人的所属机构
    async getStaffList() {
      let params = {};
      try {
        const res = await getStaffList(params);
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取人员错误");
          // 源数据
          this.staffList = [];
          return;
        }
        if (Array.isArray(data) && data?.length > 0) {
          // 从源数据中过滤出重复的单位
          this.staffList = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
          );
        } else {
          this.staffList = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },

    /**获取字典 */
    async getDictItemList() {
      const { data } = await getDictItemList("CONTRACT_TYPE");
      const paymentMethod = await getDictItemList("PAYMENT_METHOD");
      this.contractTypeList = data;
      this.paymentMethodList = paymentMethod.data;
    },

    getStaffNameById(staffId) {
      let item = this.staffList?.find((item) => item.id == staffId) || "";
      return item ? item.name : "";
    },
    getGender(agentCard) {
      if (!agentCard) {
        return "";
      }
      const idCardRegex =
        /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!idCardRegex.test(agentCard)) {
        return "";
      }
      try {
        const gender =
          parseInt(agentCard.slice(16, 17)) % 2 === 0 ? "女" : "男";
        return gender;
      } catch (error) {
        return "";
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

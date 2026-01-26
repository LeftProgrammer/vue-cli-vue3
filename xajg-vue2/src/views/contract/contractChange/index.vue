<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="合同名称:">
            <el-select
              v-model="query.contractId"
              clearable
              filterable
              placeholder="请选择"
              style="width: 100%"
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in htxxOptions"
                :key="item.id"
                :label="item.name + '（' + item.code + '）'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="变更编码:">
            <el-input v-model="query.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="变更类型:">
            <el-select
              v-model="query.changeType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="重大设计变更" value="zdsjbg" />
              <el-option label="一般设计变更" value="ybsjbg" />
              <el-option label="重大变更" value="zdbg" />
              <el-option label="一般变更" value="ybbg" />
            </el-select>
          </el-form-item>
          <el-form-item label="投资增减:">
            <el-select
              v-model="query.investmentImpact"
              placeholder="请选择投资增减"
              style="width: 100%"
            >
              <el-option label="增加" value="increase" />
              <el-option label="减少" value="decrease" />
            </el-select>
          </el-form-item>
          <el-form-item label="金额范围:">
            <el-select v-model="query.amountType" placeholder="请选择">
              <el-option label="绝对值" value="1" />
              <el-option label="自然数" value="2" />
            </el-select>
            <el-input v-model="query.amount1" placeholder="请输入">
              <template slot="append">以上</template>
            </el-input>
            <el-select v-model="query.symbol" placeholder="请选择">
              <el-option label="且" value="1" />
              <el-option label="或" value="2" />
            </el-select>
            <el-input v-model="query.amount2" placeholder="请输入">
              <template slot="append">以下</template>
            </el-input>
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
        <el-popover
          placement="bottom"
          width="210"
          trigger="click"
          popper-class="popover-tableCol"
        >
          <div class="all">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
              全选
            </el-checkbox>
          </div>
          <draggable
            v-model="tableColumnList"
            class="checkboxList"
            :options="{ group: 'items' }"
          >
            <div v-for="(item, index) in tableColumnList" :key="index">
              <el-checkbox
                v-model="item.checked"
                :name="item.value"
                :label="item.name"
                @change="(val) => handleCheckedChange(item, val)"
              />
            </div>
          </draggable>
          <el-button slot="reference" style="margin: 0 10px">
            显示字段
          </el-button>
        </el-popover>
        <el-button @click="exportFile(1)">
          <svg-icon icon-class="export" class="icon" />导出选中
        </el-button>
      </template>
      <template slot="table">
        <el-table
          v-if="!tableLoading"
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :selectable="selectableRow"
            width="55"
            fixed="left"
            align="center"
          />
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            fixed="left"
            align="center"
          />
          <el-table-column
            v-for="(item, index) in tableColumnList.filter((x) => x.checked)"
            :key="index"
            :label="item.name"
            :prop="item.value"
            sortable
            :align="item.align"
            min-width="180"
          >
            <template slot-scope="{ row }">
              <el-link
                v-if="item.slot == 'contractName'"
                type="primary"
                @click="view(row)"
              >
                {{ row.contractInfo.name }}
              </el-link>
              <span v-else-if="item.slot == 'contractCode'">
                {{ row.contractInfo.code }}
              </span>
              <span v-else-if="item.slot == 'contractedDateStr'">
                {{
                  row.contractInfo.contractedDate
                    ? timeFormat(row.contractInfo.contractedDate, "YYYY-MM-DD")
                    : ""
                }}
              </span>
              <span v-else-if="item.slot == 'endDateStr'">
                {{
                  row.contractInfo.endDate
                    ? timeFormat(row.contractInfo.endDate, "YYYY-MM-DD")
                    : ""
                }}
              </span>
              <span v-else-if="item.slot == 'type'">
                {{
                  $DictionaryParsing(contractTypeList, row.contractInfo.type)
                }}
              </span>
              <span v-else-if="item.slot == 'changeType'">
                {{ $DictionaryParsing(changeTypeList, row.changeType) }}
              </span>
              <span v-else-if="item.slot == 'paymentMethod'">
                {{ row.contractInfo.paymentMethod }}
              </span>
              <span v-else-if="item.slot == 'amount'">
                {{ row.contractInfo.amount }}
              </span>
              <span v-else-if="item.slot == 'partyB'">
                {{ row.contractInfo.partyB }}
              </span>
              <span v-else-if="item.slot == 'partyC'">
                {{ row.contractInfo.partyC }}
              </span>
              <span v-else-if="item.slot == 'investmentImpact'">
                {{
                  row.investmentImpact === "increase"
                    ? "增加"
                    : row.investmentImpact === "decrease"
                      ? "减少"
                      : ""
                }}
              </span>
              <span v-else-if="item.slot == 'changeAmount'">
                <span
                  :style="{
                    color: row.summary && row.changeAmount > 0 ? 'red' : '',
                  }"
                >
                  {{
                    row.summary
                      ? `变更${row.total ? "合" : "小"}计 ：${row.changeAmount}`
                      : row.changeAmount
                  }}
                </span>
              </span>
              <div
                v-for="item1 in row.attachment
                  ? JSON.parse(row.attachment)
                  : []"
                v-else-if="item.slot == 'attachment'"
                :key="item1.url"
              >
                {{ item1.name }}
              </div>
              <span v-else>
                {{ row[item.value] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            prop="name"
            width="180"
            fixed="right"
            align="center"
          >
            <template #default="{ row }">
              <list-button
                v-if="!row.summary"
                :data="row"
                @view="view"
                @delete="deleteHandle"
                @edit="edit"
              />
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
      :htxx-options="htxxOptions"
      @closed="closedDialog"
      @ok="getTableData"
    />
  </div>
</template>

<script>
import { remove, page } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import { getDictItemList } from "@/api/dict";
import { page as contractPage } from "@/views/contract/contractSign/api";
import draggable from "vuedraggable";

export default {
  name: "ContractChange",
  components: {
    TableLayout,
    ListButton,
    dataform,
    draggable,
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
      dictList: [],
      readonly: false,
      deptShow: false,
      url: { list: "" },
      userId: "",
      staffList: [],
      contractTypeList: [],
      paymentMethodList: [],
      changeTypeList: [],
      htxxOptions: [],
      multipleSelection: [],
      tableColumnList: [
        {
          name: "合同名称",
          value: "contractName",
          slot: "contractName",
          checked: true,
        },

        {
          name: "合同编号",
          value: "contractCode",
          checked: true,
          slot: "contractCode",
        },
        { name: "变更编码", value: "code", checked: true },
        { name: "工程部位", value: "pbsCode", checked: true },
        {
          name: "签约日期",
          value: "contractedDateStr",
          checked: true,
          slot: "contractedDateStr",
        },
        {
          name: "结束日期",
          value: "endDateStr",
          checked: true,
          slot: "endDateStr",
        },
        {
          name: "合同类型",
          value: "type",
          checked: true,
          slot: "type",
        },
        {
          name: "变更类型",
          value: "changeType",
          checked: true,
          slot: "changeType",
        },
        {
          name: "支付方式",
          value: "paymentMethod",
          checked: true,
          slot: "paymentMethod",
        },
        {
          name: "合同金额",
          value: "amount",
          slot: "amount",
          checked: true,
        },
        { name: "甲方单位", value: "partyA", checked: true },
        {
          name: "乙方单位",
          value: "partyB",
          checked: true,
          slot: "partyB",
        },
        {
          name: "丙方单位",
          value: "partyC",
          checked: true,
          slot: "partyC",
        },
        {
          name: "合同内容",
          value: "contractDetail",
          checked: true,
        },
        {
          name: "原合同内容",
          value: "contractContent",
          checked: true,
        },
        {
          name: "变更后合同内容",
          value: "changeContractContent",
          checked: true,
        },
        { name: "变更缘由", value: "changeContent", checked: true },
        { name: "变更依据", value: "changeBasis", checked: true },
        { name: "变更前金额", value: "changeBeforeAmount", checked: true },
        { name: "变更后金额", value: "changeAfterAmount", checked: true },
        {
          name: "投资增减",
          value: "investmentImpact",
          checked: true,
          slot: "investmentImpact",
        },
        {
          name: "排序",
          value: "sort",
          checked: true,
        },
        {
          name: "变更附件",
          value: "attachment",
          checked: true,
          slot: "attachment",
        },
        {
          name: "变更金额",
          value: "changeAmount",
          checked: true,
          slot: "changeAmount",
        },
      ],
      tableLoading: false,
    };
  },
  computed: {
    checkAll() {
      return this.tableColumnList.findIndex((x) => !x.checked) == -1;
    },
  },
  created() {
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
    this.getDictItemList();
    this.getContractPage();
  },
  methods: {
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
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        this.tableData = this.sortData(data.data.records || []);
        this.pageParams.total = data.data.total;
      });
    },
    doLayout() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableLoading = false;
      }, 300);
      this.$refs.multipleTable.doLayout();
    },
    handleCheckAllChange(val) {
      this.tableColumnList.forEach((x) => {
        x.checked = val;
      });
      this.doLayout();
    },
    handleCheckedChange(value, item) {
      this.doLayout();
    },
    sortData(data) {
      // 把 null/undefined 转成 Infinity，保证空值排后面
      const v = (val) => (val != null ? val : Infinity);

      // 1️⃣ 按 contractInfo.id 分组
      const groups = {};
      for (const item of data) {
        const gid = item.contractInfo.id;
        (groups[gid] = groups[gid] || []).push(item);
      }

      // 2️⃣ 对分组按【contractInfo.sort → contractInfo.createDate】排序
      const sortedGroupEntries = Object.entries(groups).sort(([, a], [, b]) => {
        const gaSort = v(a[0].contractInfo.sort);
        const gbSort = v(b[0].contractInfo.sort);
        if (gaSort !== gbSort) return gaSort - gbSort;

        const gaDate = a[0].contractInfo.createDate;
        const gbDate = b[0].contractInfo.createDate;
        return gaDate - gbDate;
      });

      // 3️⃣ 组装最终结果
      const result = [];
      let totalSum = 0;

      for (const [, group] of sortedGroupEntries) {
        // 组内排序：sort → createDate
        group.sort((a, b) => {
          const sa = v(a.sort);
          const sb = v(b.sort);
          if (sa !== sb) return sa - sb;
          return a.createDate - b.createDate;
        });

        // 追加组内元素
        result.push(...group);

        // 小计
        const groupSum = group.reduce(
          (sum, i) => sum + Number(i.changeAmount || 0),
          0
        );
        result.push({
          summary: true,
          changeAmount: groupSum,
          contractInfo: {},
          groupId: group[0].contractInfo.id,
        });
        totalSum += groupSum;
      }

      // 4️⃣ 合计
      result.push({
        summary: true,
        total: true,
        contractInfo: {},
        changeAmount: totalSum,
      });
      return result;
    },
    selectableRow(row) {
      return !row.summary;
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

    /**获取字典 */
    async getDictItemList() {
      const { data } = await getDictItemList("CONTRACT_TYPE");
      const { data: data1 } = await getDictItemList("CHANGE_TYPE");
      this.contractTypeList = data;
      this.changeTypeList = data1;
    },
    async getContractPage() {
      const { data, success } = await contractPage({
        current: 1,
        entity: {},
        pageSize: 999,
        size: 999,
      });
      if (!success) {
        this.$message.error("获取合同失败");
        return;
      }
      this.htxxOptions = data.records;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    exportFile() {
      if (this.multipleSelection.length === 0) return;
      const fields = this.tableColumnList.filter((x) => x.checked);

      if (fields.length === 0) {
        this.$message.error("请选择要导出的字段");
        return;
      }
      const params = {
        ids: this.multipleSelection.map((x) => x.id),
        fields: fields.map((x) => x.value),
        headers: fields.map((x) => x.name),
      };
      this.download(
        "/api/contract/change/export",
        params,
        params.ids.length > 1
          ? "合同变更.zip"
          : `${this.multipleSelection[0].contractInfo.name}.xlsx`
      );
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
<style lang="scss">
.popover-tableCol {
  .all {
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
  .checkboxList {
    max-height: 300px;
    overflow: auto;
  }
}
</style>

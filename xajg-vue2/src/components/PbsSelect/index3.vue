<template>
  <!--选择PBS弹窗-->
  <el-dialog
    title="关联培训计划选择"
    custom-class=""
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="960px"
    @closed="closedHandle"
    v-draggable
  >
    <div style="height: 60vh">
      <content-layout
        v-if="dialogShow"
        title="计划培训项列表"
        :showSearchBtns="false"
        :showPage="false"
      >
        <template slot="form">
          <el-form :model="query" :inline="true">
            <el-form-item label="计划年度:">
              <el-date-picker
                v-model="query.year"
                value-format="yyyy"
                type="year"
                placeholder="选择年"
                @change="changeYear"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </template>
        <template slot="table">
          <el-table
            ref="singleTable"
            highlight-current-row
            :data="tableData"
            style="width: 100%"
            border
            lazy
            :load="load"
            @row-click="showRow"
            @current-change="handleCurrentRowChange"
            row-key="id"
            :row-class-name="tableRowClassName"
            :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            />
            <el-table-column prop="name" label="培训名称" align="center">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="组织单位"
              width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="trainDate"
              label="计划培训时间"
              align="center"
            >
              <template slot-scope="{ row }">
                {{
                  row.trainDate ? timeFormat(row.trainDate, "YYYY-MM-DD") : ""
                }}
              </template>
            </el-table-column>
            <el-table-column prop="content" label="培训内容" align="center">
            </el-table-column>
            <el-table-column prop="trainObject" label="培训对象" align="center">
            </el-table-column>
            <el-table-column prop="trainTarget" label="培训目的" align="center">
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center">
            </el-table-column>
          </el-table>
        </template>
      </content-layout>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="childEvtHandle"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import ContentLayout from "@/components/ContentLayout/Table";
import { page3 } from "./api";
import { dateFormat } from "@/utils";
export default {
  name: "PbsSelectComp",
  components: {
    ContentLayout,
  },
  data() {
    return {
      /**当前行 */
      currentRow: {},
      /**树节点点击 */
      handleNodeClick(data) {
        console.log(data);
      },
      /**弹窗显示 */
      dialogShow: false,
      tableData: [],
      /**请求参数 */
      query: {},
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
    };
  },
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
    /**已经选中pbs信息 */
    selection: {
      type: Array,
      default: () => {
        return [];
      },
    },
    unitId: {
      type: String,
      default: "",
    },
  },
  computed: {},
  created() {
    this.getYear();
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log("visible", newValue);
        if (newValue) {
          this.load();
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    changeYear(e) {
      console.log(e, "11111");
      this.load();
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.state === 2) {
        return "warning-row";
      }
      return "";
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    getYear() {
      let year = dateFormat(new Date().getTime(), "yyyy");
      this.$set(this.query, "year", year);
      // this.query.year = year
      // console.log(this.query.year, 'year');
      // console.log(this.unitId);
      this.query.unitId = this.unitId;
    },
    handleSizeChange(val) {
      console.log(val, "val");
      this.pageParams.pageSize = val.pageSize;
      this.load();
    },
    handleCurrentChange(val) {
      console.log(val, "val");
      this.pageParams.current = val.current;
      this.load();
    },
    /**获取列表数据 */
    load(tree, treeNode, resolve) {
      // console.log("load", tree, treeNode, resolve);
      // this.pageParams.entity = this.query;
      // const params = JSON.parse(JSON.stringify(this.pageParams));
      // console.log(params);
      page3(this.query).then((data) => {
        this.tableData = data.data;
        console.log(this.tableData);
      });
    },
    showRow(row) {
      console.log(row);
      this.$refs.singleTable.setCurrentRow(row);
      if (row.state == 2) {
        this.$message.warning("此计划已被关联");
        this.$refs.singleTable.setCurrentRow();
        return;
      }
      //赋值给radio
      this.radio = this.tableData.indexOf(row);
    },
    handleCurrentRowChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow;
      //加载子级数据
      this.getCurrentRow(this.tableData.indexOf(currentRow));
    },
    getCurrentRow(val) {
      console.log(val);
    },
    /**确认时 */
    childEvtHandle() {
      this.$emit("childEvt", this.currentRow);
      this.dialogShow = false;
    },
    closedHandle() {
      this.$emit("closed");
    },
  },
};
</script>

<style scoped lang="scss">
/deep/.el-table .warning-row {
  background: #ccc;
}
</style>

<template>
  <!--选择PBS弹窗-->
  <el-dialog
    title="关联培训资料选择"
    custom-class="wbench-el-dialog"
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
        title="培训资料列表"
        :showSearchBtns="false"
        :page="pageParams"
        @pageSizeChange="handleSizeChange"
        @pageCurrentChange="handleCurrentChange"
      >
        <!-- <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="上传单位:">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="query.deptId" placeholder="请选择">
              <el-option v-for="item in departmentsList" :key="item.departId" :label="item.departName"
                :value="item.departId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template> -->
        <template slot="table">
          <el-table
            :data="tableData"
            style="width: 100%"
            border
            lazy
            :load="load"
            @row-click="showRow"
            @current-change="handleCurrentRowChange"
            highlight-current-row
            row-key="id"
            :default-sort="{ prop: 'createDate', order: 'descending' }"
            :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="center"
            />
            <el-table-column prop="name" label="资料名称" align="center">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              width="120"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.type ? getTypes(row.type) : "" }}
              </template>
            </el-table-column>
            <el-table-column
              label="上传人"
              align="center"
              prop="createUsername"
            />
            <el-table-column label="上传部门" align="center" prop="deptId">
              <template slot-scope="{ row }">
                {{ row.deptId ? getTypes1(row.deptId) : "" }}
              </template>
            </el-table-column>
            <el-table-column
              label="上传日期"
              align="center"
              sortable
              prop="createDate"
            >
              <template slot-scope="{ row }">
                {{
                  row.createDate ? timeFormat(row.createDate, "YYYY-MM-DD") : ""
                }}
              </template>
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
import { page4, list1 } from "./api";
import { dateFormat } from "@/utils";
import { getDictItemList } from "@/api/dict";
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
      query: { params: {} },
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      DitSpeciality: [],
      departmentsList: [],
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
    this.getJCXM();
    console.log(this.unitId, "ssss");
    this.query.unitId = this.unitId;
    this.getDepartmentsList(this.unitId);
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
    getTypes(val) {
      let name = "";
      this.DitSpeciality.forEach((element, index) => {
        if (val == element.dictId) {
          name = element.dictName;
        }
      });
      //
      return name;
    },
    getTypes1(val) {
      let name = "";
      this.departmentsList.forEach((element, index) => {
        if (val == element.departId) {
          name = element.departName;
        }
      });
      //
      console.log(name, "name");
      return name;
    },
    getDepartmentsList(e) {
      list1(e).then((res) => {
        if (res.success) {
          this.departmentsList = res.data;
        }
      });
    },
    /**获取字典 */
    async getJCXM() {
      const { data } = await getDictItemList("pxzllx");
      this.DitSpeciality = data;
      console.log("flowStatusOptions", data);
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.load();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.load();
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    /**获取列表数据 */
    load(tree, treeNode, resolve) {
      // console.log("load", tree, treeNode, resolve);
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      console.log(params);
      page4(params).then((data) => {
        this.tableData = data.data.records;
        console.log(this.tableData);
        this.pageParams.total = data.data.total;
      });
    },
    showRow(row) {
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
      this.$emit("childEvt1", this.currentRow);
      this.dialogShow = false;
    },
    closedHandle() {
      this.$emit("closed");
    },
  },
};
</script>

<style></style>

<template>
  <!--选择PBS弹窗-->
  <el-dialog
    title="选择工程部位（PBS）"
    v-model="dialogShow"
    custom-class="wbench-el-dialog"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    v-draggable
    width="960px"
    @closed="closedHandle"
  >
    <content-layout v-if="dialogShow" :showForm="false" :showPage="false">
      <template #table>
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
          :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
        >
          <!-- <el-table-column width="50">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index">&nbsp;</el-radio>
            </template>
          </el-table-column> -->
          <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column type prop="code" label="编码" width="300"> </el-table-column>
          <el-table-column type prop="pbsLayer" label="层级" width="120">
            <template #default="scope">
              <span v-if="scope.row.pbsLayer==='001'">建筑物</span>
              <span v-if="scope.row.pbsLayer==='002'">分部结构</span>
              <span v-if="scope.row.pbsLayer==='003'">细部结构</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </content-layout>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="childEvtHandle"> 确 定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import ContentLayout from "@/components/ContentLayout/Table";
import { list } from "./api";
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
      queryParams: { pid: 0 },
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
  },
  computed: {},
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
    /**获取列表数据 */
    load(tree, treeNode, resolve) {
      // console.log("load", tree, treeNode, resolve);
      let queryParams = {};
      if (tree) {
        queryParams.pid = tree.id;
      } else {
        queryParams.pid = 0;
      }
      list(queryParams).then((res) => {
        if (res.success) {
          if (resolve) {
            resolve(res.data);
          } else {
            this.tableData = res.data;
          }
        }
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
      this.$emit("childEvt", this.currentRow);
      this.dialogShow = false;
    },
    closedHandle() {
      this.$emit("closed");
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.divider) {
  border: 1px solid transparent !important;
}
</style>

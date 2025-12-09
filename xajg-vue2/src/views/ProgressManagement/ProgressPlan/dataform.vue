<template>
  <div class="page-leave">
    <el-row>
      <el-col :span="24">
        <div>基本信息</div>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-form
      ref="dataFormRef"
      :model="formData"
      :rules="formDataRules"
      label-width="auto"
      :disabled="readonly"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="编码" size="mini" prop="code">
            <el-input
              class="w-100pre"
              v-model="formData.code"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称" size="mini" prop="name">
            <el-input
              class="w-100pre"
              v-model="formData.name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年度" size="mini" prop="year">
            <el-date-picker
              style="width: 100%"
              v-model="formData.year"
              type="year"
              value-format="yyyy"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="标段" size="mini" prop="sectionId">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="formData.sectionId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in sectionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div>
            <div class="flex align-center justify-between">
              <div class="font-w-600">计划明细</div>
              <div>
                <el-button
                  :disabled="selectDisabled.node"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addNode('WBS节点', 'WBSjd', 'NODE')"
                  >节点</el-button
                >
                <el-button
                  :disabled="selectDisabled.node"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addNode('WBS作业', 'WBSzy', 'WORK')"
                  >作业</el-button
                >
              </div>
            </div>
            <div class="line h-1 mt-5"></div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table
        @row-click="(row) => changeHighlight(row)"
        v-if="showDialogTable"
        highlight-current-row
        :data="tableData"
        style="width: 100%"
        row-key="id"
        ref="singleTable"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="type" label="类型" width="180" align="center">
          <template slot-scope="scoped">
            <span>{{ $DictionaryParsing(types, scoped.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工程部位" prop="pbsName" align="center">
        </el-table-column>
        <el-table-column
          prop="planStartDate"
          width="150"
          label="计划开始日期"
          align="center"
        >
          <template slot-scope="scoped">
            <span>{{
              scoped.row.planStartDate
                ? $dateFormat(scoped.row.planStartDate)
                : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="planEndDate"
          width="150"
          label="计划结束日期"
          align="center"
        >
          <template slot-scope="scoped">
            <span>{{
              scoped.row.planEndDate ? $dateFormat(scoped.row.planEndDate) : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="planEndDate"
          width="150"
          label="总工期"
          align="center"
        >
          <template slot-scope="scoped">
            {{ getAllDay(scoped.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="150" align="center">
          <template slot-scope="scoped">
            <el-button
              :disabled="readonly"
              type="text"
              class="mx-10 text-0096 pointer"
              @click.stop="editNode(scoped.row)"
            >
              编辑
            </el-button>
            <el-button
              :disabled="readonly"
              type="text"
              style="color: red"
              @click.stop="handlerDel(scoped.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <nodeForm
      :tableData="toNodeData"
      @upload="updateSub"
      :title="nodoeTitle"
      ref="nodeForm"
    ></nodeForm>
  </div>
</template>
<script>
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { sectionList, update, save } from "./api";
import { dateFormat } from "@/utils";
import nodeForm from "./nodeForm.vue";
import { getDictItemList } from "@/api/dict";

export default {
  mixins: [FlowFormMixin],
  components: { nodeForm },
  data() {
    return {
      Node_TYPE: "",
      types: [],
      nodoeTitle: "",

      readonly: false, // 是否只读
      formData: {
        year: "",
      },
      // 控制节点/作业   几点下可以添加任何  作业下不能添加任何
      selectDisabled: {
        node: false,
        work: false,
      },
      formDataRules: {},
      /**施工标段 */
      sectionOptions: [],
      tableData: [],
      toNodeData: [],
      currentRow: null, //选中行
      isAdd: true, //是否新增 给发送请求使用 这里监听的是年份切换 过滤到了数据代表这个不是新增 是修改
      showDialogTable: true,
      nodeAddOredit: "", //用于判断的节点是编辑还是新增 ,true 新增   false  编辑
      /**接口地址：对应list接口 */
      url: {
        list: "/api/schedule/management/list",
      },
    };
  },
  created() {
    this.getSectionList();
    this.getTypeDit();
  },
  destroyed() {
    this.$clearStorage("ProgressPlanItem");
  },
  mounted() {
    setTimeout(() => {
      this.getFormData();
    }, 0);
  },
  watch: {
    currentRow(value) {
      // 如果当前选中行是作业 就都不能添加
      console.log("currentRow", value);
      if (value?.workType == "WORK") {
        this.selectDisabled.node = true;
        this.selectDisabled.work = true;
      } else {
        // 包括 value ==null|| NODE
        this.selectDisabled.node = false;
        this.selectDisabled.work = false;
      }
    },
    "formData.year": {
      handler(val) {
        if (val) {
          console.log("watch", val);
          let Plans = this.$getStorage("ProgressPlanItem");
          let yearData = Plans?.filter((item) => item.year == val);
          console.log("yearData", yearData);
          if (yearData?.length > 0) {
            this.isAdd = false;
            this.toNodeData = yearData;
            this.tableData = yearData[0].subDetail;
            this.formData = yearData[0];
          } else {
            this.toNodeData = [];
            this.tableData = [];
            this.$refs["dataFormRef"].resetFields();
            this.formData.year = val;
            this.isAdd = true;
          }
          console.log("切换年份之后的数据", this.formData);
        }
      },
      // deep: true,
    },
  },
  methods: {
    /**获取分类字典 */
    async getTypeDit() {
      let types = this.$getStorage("ProgressPlan_types");
      this.types = types;
      console.log("获取分类字典", types);
    },

    /**
     * 获取表单数据
     */
    getFormData() {
      console.log("获取表单数据1");
      this.getFlowRow().then((row) => {
        console.log("获取表单数据", row);
        if (row) {
          console.log("编辑", row);
          this.formData.year = row.year;
        } else {
          //新增时
          this.getYear();
        }
      });
    },
    changeHighlight(row) {
      if (this.currentRow?.id && row.id == this.currentRow.id) {
        this.$refs.singleTable.setCurrentRow(null);
        this.currentRow = null;
      } else {
        this.currentRow = row;
      }
    },

    // 当编辑或则添加完成 回调 需要知道的是
    // 新增  是节点新增  还是根目录新增
    // 编辑 不需要知道直接编辑当前节点
    updateSub(value) {
      value.workType = this.Node_TYPE;
      console.log("需要添加的子表数据", value);
      console.log("回调新增还是编辑", this.nodeAddOredit, value);
      // 更新回调 nodeAddOredit  true 新增 false 编辑
      if (this.nodeAddOredit) {
        // 没有选 就是新增根目录
        if (!this.currentRow) {
          value.id = this.generateUniqueId(16);
          this.tableData.push(value);
        } else {
          // 有选得情况下 就需要往对应的下面放数据了
          // 递归找出数据这个数据的位置 然后晒数据
          // 使用递归函数
          this.showDialogTable = false;
          // 新增 为了能呈现在表格上必须有唯一的id
          value.id = this.generateUniqueId(16);
          this.searchNodeAdd(this.tableData, value); //找出当前的
          console.log("更改后的数据", this.tableData);
          this.tableData = [...this.tableData];
          this.showDialogTable = true;
          this.$forceUpdate();
        }
      } else {
        // 编辑
        this.showDialogTable = false;
        // 新增 为了能呈现在表格上必须有唯一的id
        // value.id = this.generateUniqueId(16);
        this.searchNodeEdit(this.tableData, value); //找出当前的
        console.log("更改后的数据", this.tableData);
        this.tableData = [...this.tableData];
        this.showDialogTable = true;
        this.$forceUpdate();
      }

      this.currentRow = null;
    },
    // 产生一个16位的随机数字id
    generateUniqueId(n) {
      let num = "";
      for (let i = 0; i < n; i++) {
        num = num + Math.floor(Math.random() * 10);
      }
      return num;
    },
    // 递归出当前的节点位置 新增
    searchNodeAdd(tableData, node) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == node.pid) {
          if (tableData[i].hasOwnProperty("children")) {
            let index = tableData[i].children.length;
            this.$set(tableData[i].children, index, node);
          } else {
            tableData[i].children = [node];
          }
          return;
        }
        if (tableData[i].children) {
          this.searchNodeAdd(tableData[i].children, node);
        }
      }
    },
    // 递归出当前的节点位置 编辑
    searchNodeEdit(tableData, node) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == node.id) {
          tableData[i] = node;
          return;
        }
        if (tableData[i].children) {
          this.searchNodeEdit(tableData[i].children, node);
        }
      }
    },
    // 新增 节点 但是新增 节点也分为新增子节点 还是新增跟节点
    addNode(type, code, nodeOrwork) {
      console.log("addNode", this.currentRow);
      this.nodoeTitle = type;
      this.$nextTick(() => {
        this.nodeAddOredit = true;
        // 传递分类字典 cede
        let selectItem = this.currentRow || null;
        this.$refs.nodeForm.add(code, selectItem, null);
        this.$refs.nodeForm.dialogType = nodeOrwork;
        this.Node_TYPE = nodeOrwork;
      });
    },
    // 修改节点
    editNode(node) {
      this.nodeAddOredit = false;
      console.log("editNode", node);
      let code = node?.children?.length > 0 ? "WBSjd" : "WBSzy";
      this.nodoeTitle = node.name + "编辑";
      this.$nextTick(() => {
        // 传递分类字典 cede
        this.$refs.nodeForm.edit(node, code);
      });
    },
    // 递归成一维数组
    getTreeData(data, arr = []) {
      // 数据展开成为一维度   递归
      data.forEach((item) => {
        arr.push(item);
        if (item?.children?.length > 0) {
          let children = item?.children;
          this.getTreeData(children, arr);
        }
      });
      return arr;
    },
    // 递归出当前的节点位置 删除节点
    handlerDel(row) {
      console.log("需要删除的数据", row);
      if (row?.children?.length > 0) {
        this.$message.warning("禁止删除有子集的节点");
        return;
      }
      this.searchNodeDel(this.tableData, row); //找出当前的
      console.log("更改后的数据", this.tableData);
      this.tableData = [...this.tableData];
      this.showDialogTable = true;
      if (this.currentRow?.id && row.id == this.currentRow.id) {
        this.$refs.singleTable.setCurrentRow(null);
        this.currentRow = null;
      }
      this.$forceUpdate();
    },

    // 递归出当前的节点位置 编辑
    searchNodeDel(tableData, node) {
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id == node.id) {
          tableData.splice(i, 1);
          return;
        }
        if (tableData[i].children) {
          this.searchNodeDel(tableData[i].children, node);
        }
      }
    },

    getAllDay(row) {
      // 计算两个时间戳 相差多少天
      let start = row.planStartDate;
      let end = row.planEndDate;
      let days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return days;
    },

    getYear() {
      this.formData.year = dateFormat(new Date(), "yyyy");
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionList({}).then((res) => {
        if (res.success) {
          console.log("sectionList", res.data);
          this.sectionOptions = res.data;
        }
      });
    },

    // 递归成一维数组
    getTreeData(data, arr = []) {
      // 数据展开成为一维度   递归
      data.forEach((item) => {
        arr.push(item);
        if (item?.children?.length > 0) {
          let children = item?.children;
          this.getTreeData(children, arr);
        }
      });
      return arr;
    },
    // 递归成一维数组 并且加入baseID
    getArr(data, arr = [], baseId) {
      // 数据展开成为一维度   递归
      data.forEach((item) => {
        item.baseId = baseId;
        arr.push(item);
        if (item?.children?.length > 0) {
          this.getArr(item.children, arr, baseId);
        }
      });
      return arr;
    },
    /*接收到父级的消息处理完后返回给父级*/
    save(fields, callback) {
      console.log("save fields", this.formData, this.isAdd, fields);
      // 这里递归成一维数组 并且添加base_id等于 fields.id
      let subDetailOrign = [...this.tableData];
      let subDetail = this.getArr(subDetailOrign, [], fields.id);
      console.log("subDetailsubDetail", subDetail);

      let params = {
        ...fields,
      };
      params.subDetail = subDetail;

      console.log("params", params);
      //做业务数据的保存,修改。
      let requert = this.isAdd ? save : update;
      requert(params)
        .then((res) => {
          this.currentRow = null;
          const { success, message, data } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
            this.$message.success("新增成功");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  // .table {
  //   /deep/ .el-table__row .cell button {
  //     padding: 0 !important;
  //   }
  // }
}

.line {
  background-color: #dcdfe6;
}
</style>

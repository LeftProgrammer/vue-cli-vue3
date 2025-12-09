<template>
  <div class="section-content-page">
    <div class="px-30 pb-30 pt-30 flex flex-column h-100pre">
      <el-form ref="query" class="" :model="query" :inline="true">
        <el-row :gutter="20">
          <el-col :span="5" class="">
            <el-form-item label="计划编码、名称" size="mini" prop="name">
              <el-input v-model="query.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="年份" prop="year" size="mini">
              <el-date-picker
                v-model="query.year"
                type="year"
                value-format="yyyy"
                placeholder="请选择"
              >
              </el-date-picker
            ></el-form-item>
          </el-col>
          <el-col :span="4" class="flex justify-end">
            <el-form-item size="mini">
              <el-button type="primary" icon="el-icon-search" @click="getData"
                >查询
              </el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="reset"
                >重置
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="line h-2"></div>
          </el-col>
          <el-col :span="20">
            <div class="my-20">
              <i class="iconfont icon-menu font-14 mr-5"></i>
              <span>年度计划</span>
            </div>
          </el-col>
          <el-col :span="4" class="flex justify-end">
            <el-form-item size="mini" class="my-20">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="handelShowDialog(null, 'mine')"
                >新增</el-button
              >
              <el-button type="primary" @click="setGanttConfig"
                >甘特图
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex-1 h-100pre">
        <div class="h-100pre">
          <el-row class="h-100pre" :gutter="10">
            <el-col class="h-100pre" :span="ganttShow ? 12 : 24">
              <div class="table h-100pre">
                <!-- v-if="flowInited" -->
                <div class="flex flex-column h-100pre">
                  <el-table
                    highlight-current-row
                    @current-change="chooseCurrentRow"
                    class="flex-1"
                    ref="multipleTable"
                    :data="tableData"
                    height="100%"
                    border
                  >
                    <el-table-column label="编码" prop="code" align="center">
                      <template slot-scope="scoped">
                        <span class="text-ellipsis" :title="scoped.row.code">{{
                          scoped.row.code
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="名称"
                      width="150"
                      prop="name"
                      align="center"
                    >
                      <template slot-scope="scoped">
                        <span class="text-ellipsis" :title="scoped.row.name">{{
                          scoped.row.name
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="年份" prop="year" align="center" />

                    <el-table-column
                      label="施工标段"
                      prop="sectionId"
                      align="center"
                      width="150"
                    >
                      <template slot-scope="{ row }">
                        <span>{{ getSelectionName(row.sectionId) }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="流程状态"
                      prop="flowStatus"
                      align="center"
                    >
                      <template slot-scope="{ row }">
                        <flow-status
                          :row="row"
                          :flowName="flowName"
                        ></flow-status>
                      </template>
                    </el-table-column>

                    <el-table-column
                      width="130"
                      label="操作"
                      prop="name"
                      align="center"
                    >
                      <template #default="{ row }">
                        <div class="flex justify-center">
                          <span
                            class="text-0096 pointer"
                            @click="details(row, false)"
                            >查看</span
                          >
                          <span
                            class="mx-10 text-0096 pointer"
                            @click.stop="details(row, true)"
                            >编辑</span
                          >
                          <span
                            class="text-red pointer"
                            @click.stop="handlerDel(row)"
                            >删除</span
                          >
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="pagination-container">
                    <el-pagination
                      class="pagination"
                      :current-page="pageParams.current"
                      :page-sizes="[10, 20, 50, 100, 1000, 2000]"
                      :page-size="pageParams.size"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pageParams.total"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                    />
                  </div>
                </div>
              </div>
            </el-col>
            <el-col class="h-100pre" :span="ganttShow ? 12 : 0">
              <gantt
                v-show="ganttShow"
                ref="gantt"
                id="gantt_here"
                class="w-100pre h-100pre"
              ></gantt>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="(flowShow = false), (currentRow = null)"
    ></flow-dialog>
  </div>
</template>
<script>
import { dateFormat } from "@/utils";
import { page, remove, sectionList, list } from "./api";
import gantt from "./gantt.vue";
import { getDictItemList } from "@/api/dict";
import { FlowListMixin } from "@/mixins/FlowListMixin";

export default {
  components: { gantt },
  mixins: [FlowListMixin],
  data() {
    return {
      query: {
        year: "",
        name: "",
      },
      ganttShow: true,
      flowShow: false,
      flowInfo: {},
      tableData: [],
      allList: [],
      pageList: [],
      pageParams: {
        current: 1,
        pageSize: 20,
        total: 0,
      },
      currentRow: null,
      /**施工标段 */
      sectionOptions: [],
    };
  },
  created() {
    this.getTableData(); //这个是为了冲掉混入里面的tableData请求
    this.getData();
    this.getFlowStatus();
    this.getSectionList();
    this.getTypeDit();
    this.getAllList();
  },
  destroyed() {
    this.$clearStorage("ProgressPlanItem");
    this.$clearStorage("ProgressPlan_types");
  },

  mounted() {},
  methods: {
    getAllList() {
      list({ id: "" }).then((res) => {
        console.log("res", res);
        if (res.success) {
          this.$setStorage("ProgressPlanItem", res.data);
        }
      });
    },
    /**获取分类字典 */
    async getTypeDit() {
      let res1 = await getDictItemList("WBSjd");
      let res2 = await getDictItemList("WBSzy");
      let types = [...res1.data, ...res2.data];
      this.$setStorage("ProgressPlan_types", types);
    },
    // 施工标段解析成文字
    getSelectionName(value) {
      console.log("value", value);
      let data = this.sectionOptions.find((item) => item.id == value);
      if (data) {
        return data.name;
      }
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
    // 选中行
    chooseCurrentRow(row) {
      console.log("选中节点", row);
      if (!row) {
        //  提示 请选择行
        this.$message.warning("请选择行");
        return;
      }
      this.currentRow = row;
      let arr = this.ganttChange(row.subDetail); //只处理数据
      console.log("数据递归完毕", arr);
      this.initGnnt(arr);
    },
    reset() {
      this.$refs.query.resetFields();
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getData();
    },
    getTableData() {},
    //刷新列表数据
    childEvtHandle(data) {
      console.log("childEvtHandle", data);
      this.getData();
      this.flowShow = false;
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },
    getData() {
      let params = {
        ...this.pageParams,
        entity: this.query,
      };
      page(params).then((res) => {
        console.log("res", res);
        if (res.success && res?.data?.records.length > 0) {
          this.tableData = [...res.data.records];
          this.pageParams.total = res.data.total;
          console.log("this.tableData", this.tableData);
          let subDetail = [...res.data.records[0].subDetail];
          let arr = this.ganttChange(subDetail); //只处理数据
          console.log("数据递归完毕", subDetail, arr);
          this.$refs.multipleTable.setCurrentRow(this.tableData[0]);
          this.initGnnt(arr);
        } else {
          this.tableData = [];
          this.pageParams.total = 0;
          this.initGnnt([]);
        }
      });
    },

    initGnnt(arr) {
      this.$refs.gantt.restGanttConfig(arr);
    },

    ganttChange(data, arr = []) {
      // 数据展开成为一维度   递归
      data?.forEach((item) => {
        item.start_date = item?.planStartDate
          ? dateFormat(item.planStartDate, "yyyy-MM-DD")
          : "";

        if (item?.planEndDate) {
          item.planEndDate = Number(item.planEndDate) + 86400000;
        }
        item.end_date = item?.planEndDate
          ? dateFormat(item.planEndDate, "yyyy-MM-DD")
          : "";
        arr.push(item);
        if (item?.children?.length > 0) {
          this.ganttChange(item.children, arr);
        }
      });
      return arr;
    },
    setGanttConfig() {
      this.ganttShow = !this.ganttShow;
    },

    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.query.current = val;
      this.getTableData();
    },

    details(row, type) {
      console.log("row", row);
      //mine我的模板(初始) todo待办 done已办 wait待发 sent已发 fine办结
      let all_flowdata = this.$getStorage("all_flowdata");
      console.log("all_flowdata", all_flowdata);
      let index = null;
      let count = 0;
      let task = "";
      for (let key in all_flowdata) {
        const element = all_flowdata[key];
        count++;
        if (element.length) {
          for (let j = 0; j < element.length; j++) {
            const item = element[j];
            if (row.id == item.businessId) {
              index = count;
              task = item;
              continue;
            }
          }
        }
      }
      console.log("数据梳理", status[index], task);
      if (task) {
        this.handelShowDialog(row, type ? "wait" : "sent", task);
      }
    },

    async handlerDel(row) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });

        // let newTable = this.tableData.filter((item) => item.id !== row.id);
        // console.log("递归", newTable);
        let params = {
          ...row,
        };
        remove(params).then((res) => {
          console.log("remove", res);
          if (res.success) {
            this.$message.success("删除成功");
            this.getData();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
// /deep/ .gantt_grid_head_cell {
//   font-size: 14px;
//   color: aqua !important;
//   width: 200px !important;
// }
.line {
  background-color: #fff;
}
/deep/ .gantt_task_content {
  text-align: left !important;
}
/deep/ .gantt_task_line {
  border-radius: 10px;
  background-color: #1890ff !important;
  border: 0 !important;
  // top: 7px !important;
  // height: 20px !important;
  // line-height: 20px !important;
}

/deep/ .el-table--border,
.el-table--group {
  background-color: transparent;
}

/deep/ .el-table__row {
  background-color: transparent !important;
}
/deep/ .el-table thead {
  background-color: #fff;
  color: #333;
}
.pagination-container {
  display: flex;
  .pagination {
    margin-left: auto;
  }
}
</style>

<!-- 1、data里面的部分属性的key是不能更改的，比如id，parent，start_date、end_date、progress、open
links里面的全部属性的key是不能更改的id source target type
2、data如果type是project，那么这条数据的开始时间会取其里面所有数据的最早开始时间，结束时间会取里面所有数据的最晚开始时间，如果这条数据里面的所有数据都是空数据，那么start_date会甘特图渲染的最早时间，end_date是start_date的后一天，这样数据就会不准确？
解决方案： data里加个unscheduled属性来控制是否渲染这条数据，需要注意的是在所有涉及到日期的地方都要加，如tooltips_text 、columns、 拖拽等等
3、 dhtmlx-gantt都是下划线分割，而且api中都是这样,但在layout中min_width、max_width不生效，要用minWidth、maxWidth替换才生效。
4、排序后的数据默认从页面获取的row元素可能是不准确的，需要从dataStroe中获取。
5、甘特图在不占全屏的情况下， order_branch = true，拖拽会有限制？

作者：ygunoil
链接：https://juejin.cn/post/6930900493602390024
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。 -->

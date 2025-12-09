<template>
  <div class="page-leave">
    <table-layout
      :page="pageParams"
      :title="title"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="search"
    >
      <template slot="form">
        <el-form
          ref="query"
          class=""
          label-width="auto"
          :model="query"
          :inline="true"
        >
          <el-form-item label="编码/名称:" size="mini" prop="name">
            <el-input v-model="query.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item
            v-if="planType === 1 || planType === 2"
            :label="label + ':'"
            prop="year"
            size="mini"
          >
            <el-date-picker
              v-model="query.year"
              :type="dateType"
              :value-format="valueFormat"
              placeholder="请选择"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="标段" size="mini" prop="sectionId">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              class="w-100pre"
              v-model="query.sectionId"
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
        </el-form>
      </template>

      <template slot="opratebtns" v-if="pageType !== 'progressSelect'">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowDialog(null, 'mine')"
          >新增
        </el-button>
        <el-button type="primary" @click="setGanttConfig">甘特图</el-button>
      </template>
      <template slot="table">
        <el-row class="h-100pre" :gutter="10">
          <el-col class="h-100pre" :span="ganttShow ? 12 : 24">
            <div class="table h-100pre">
              <!-- v-if="flowInited" -->
              <div class="flex flex-column h-100pre">
                <template slot="table"></template>
                <el-table
                  @current-change="chooseCurrentRow"
                  class="flex-1"
                  ref="multipleTable"
                  :data="tableData"
                  height="100%"
                  border
                >
                  <el-table-column
                    label="序号"
                    type="index"
                    :index="getIndex"
                    width="50"
                    align="center"
                  />
                  <el-table-column
                    label="编码"
                    prop="code"
                    align="center"
                    width="auto"
                    min-width="10%"
                  >
                    <template slot-scope="scoped">
                      <el-tooltip
                        :content="scoped.row.code"
                        placement="top"
                        effect="dark"
                      >
                        <span class="text-ellipsis-clamp">
                          {{ scoped.row.code }}
                        </span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="名称"
                    width="auto"
                    min-width="10%"
                    prop="name"
                    align="center"
                  >
                    <template slot-scope="scoped">
                      <el-tooltip
                        :content="scoped.row.name"
                        placement="top"
                        effect="dark"
                      >
                        <span class="text-ellipsis-clamp">
                          {{ scoped.row.name }}
                        </span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="planType === 1 || planType === 2"
                    :label="label"
                    prop="year"
                    align="center"
                    width="auto"
                    min-width="8%"
                  />
                  <el-table-column
                    v-if="planType === 3"
                    label="版本"
                    prop="version"
                    align="center"
                    width="auto"
                    min-width="8%"
                  />
                  <el-table-column
                    label="施工标段"
                    prop="sectionId"
                    align="center"
                    width="auto"
                    min-width="20%"
                  >
                    <template slot-scope="{ row }">
                      <el-tooltip
                        :content="getSelectionName(row.sectionId)"
                        placement="top"
                        effect="dark"
                      >
                        <span class="text-ellipsis-clamp">
                          {{ getSelectionName(row.sectionId) }}
                        </span>
                      </el-tooltip>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="流程状态"
                    prop="flowStatus"
                    align="center"
                    width="auto"
                    min-width="10%"
                    v-if="pageType !== 'progressSelect'"
                  >
                    <template slot-scope="{ row }">
                      <flow-status
                        :row="row"
                        :flowName="flowName"
                      ></flow-status>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="200"
                    label="操作"
                    prop="name"
                    align="center"
                    v-if="pageType !== 'progressSelect'"
                  >
                    <template #default="{ row }">
                      <flow-button
                        ref="flowButton"
                        :editButton="'编辑'"
                        :row="row"
                        :flowName="flowName"
                        @click="handelShowDialog"
                        @delete="handlerDel(row)"
                      ></flow-button>
                    </template>
                  </el-table-column>
                </el-table>
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
      </template>
    </table-layout>
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
import TableLayout from "@/components/ContentLayout/Table";
import { FlowListMixin } from "@/mixins/FlowListMixin";

export default {
  components: { gantt, TableLayout },
  mixins: [FlowListMixin],
  props: ["pageType"],
  watch: {
    progressId: {
      handler(newValue) {
        console.log("progressId", newValue);
        if (newValue) {
          let params = {
            pageParams: {
              pageSize: 20,
              current: 1,
              total: 0,
            },
            entity: {
              id: newValue,
            },
          };
          page(params).then((res) => {
            console.log("res", res);
            if (res.success && res?.data?.records.length > 0) {
              let row = res.data.records[0];
              // console.log("viewHandle", row);
              //如果是暂存数据，将状态重置一下，改成已办
              let status = "fine";
              let task =
                row.procMatterTaskDone ||
                row.matterTaskTodo ||
                row.procMatterRun;
              console.log(row, status, task);
              // this.$emit("click", row, status, task);
              this.handelShowDialog(row, status, task);
            }
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      planType: this.$route.meta.planType, //1年度2月度3总计划
      title: "",
      label: "",
      dateType: "",
      valueFormat: "",
      progressId: this.$route.query.progressId || "",
      query: {
        year: "",
        name: "",
        flowStatus: this.pageType === "progressSelect" ? "2" : "",
        needPrem: this.pageType === "progressSelect" ? "0" : "1",
        type: this.$route.meta.planType,
      },
      ganttShow: this.pageType !== "progressSelect",
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
    if (this.planType === 1) {
      this.title = "年度计划";
      this.label = "年度";
      this.dateType = "year";
      this.valueFormat = "yyyy";
    } else if (this.planType === 2) {
      this.title = "月度计划";
      this.label = "月度";
      this.dateType = "month";
      this.valueFormat = "yyyy-MM";
    } else if (this.planType === 3) {
      this.title = "总计划";
    }
    // this.getTableData();
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
    //后端未处理 前端查询的时候将分页指定为第一页
    search() {
      this.pageParams.current = 1;
      this.getTableData();
    },
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
      // console.log("value", value);
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
          // console.log("sectionList", res.data);
          this.sectionOptions = res.data;
        }
      });
    },
    // 选中行
    chooseCurrentRow(row) {
      // console.log("$emit------selectHandle", row);

      let subDetail = [...row.subDetail];
      let arr = this.ganttChange(subDetail); //只处理数据
      this.initGnnt(arr);

      this.$emit("selectHandle", row);
    },
    reset() {
      this.$refs.query.resetFields();
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },

    //刷新列表数据
    childEvtHandle(data) {
      console.log("childEvtHandle", data);
      this.getTableData();
      this.flowShow = false;
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      const { data } = await getDictItemList("PROC_TASK_TODO_STATUS");
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },
    getTableData() {
      let params = {
        ...this.pageParams,
        entity: this.query,
      };
      page(params).then((res) => {
        console.log("res", res);
        if (res.success && res?.data?.records.length > 0) {
          this.tableData = [...res.data.records];
          this.pageParams.total = res.data.total;
          // console.log("this.tableData", this.tableData);
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
        // console.log(item?.planEndDate)
        // if (item?.planEndDate) {
        //   item.planEndDate = Number(item.planEndDate) + 86400000;
        // }
        item.end_date = item?.planEndDate
          ? dateFormat(item.planEndDate + 86400000, "yyyy-MM-DD")
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

    async handlerDel(row) {
      let params = {
        ...row,
      };
      remove(params).then((res) => {
        console.log("remove", res);
        if (res.success) {
          this.$message.success("删除成功");
          this.getTableData();
        }
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
}

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

// 处理

///deep/ .current-row .is-underline {
//  color: #fff !important;
//}

// /deep/ .el-table__body tr.current-row > td {
//   background-color: #def0fe !important;
//   color: #606266 !important;
// }

// /deep/ .el-table__body tr.current-row:hover > td {
//   background-color: #def0fe !important;
//   color: #606266 !important;
// }
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

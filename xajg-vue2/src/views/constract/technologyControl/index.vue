<template>
  <div class="page-technology-control">
    <TreeTableLayout
      :page="searchData"
      @pageSizeChange="handelPageSizeChange"
      @pageCurrentChange="handelCurrentChange"
      @query="handelSearchButtonClick"
      @reset="handelResetButtonClick"
      title="文件列表"
    >
      <template slot="form">
        <el-form :model="searchData" :inline="true">
          <el-form-item label="文件编号">
            <el-input
              v-model="searchData.code"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="标题">
            <el-input
              v-model="searchData.title"
              clearable
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="发起日期">
            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" plain icon="el-icon-download" @click="handelExport">导出</el-button>
      </template>

      <template slot="table">
        <div class="content">
          <div class="list-wrapper">
            <h4>参建单位列表</h4>
            <ul>
              <li
                v-for="item in departList"
                :key="item.corpId"
                :class="{ active: item === activeItem }"
                @click="handelListItemClick(item)"
              >
                {{ item.corpName }}
              </li>
            </ul>
          </div>

          <div class="table-wrapper">
            <el-table :data="tableData" height="100%" stripe border>
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="80"
              />
              <el-table-column
                prop="code"
                show-overflow-tooltip
                label="文件编号"
                align="center"
              />
              <el-table-column
                prop="title"
                show-overflow-tooltip
                label="标题"
                align="center"
              />
              <el-table-column prop="pbs" label="工程部位" align="center" />
              <el-table-column prop="startDate" label="发起时间" align="center">
                <template #default="{ row }">
                  {{ dateFormat(row.startDate, "YYYY-MM-DD HH:mm") }}
                </template>
              </el-table-column>
              <el-table-column prop="sendDate" label="办结时间" align="center">
                <template #default="{ row }">
                  {{ dateFormat(row.sendDate) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="操作"
                align="center"
                width="200px"
                fixed="right"
              >
                <template #default="{ row }">
                  <div class="table-btn">
                    <el-button type="text" @click="handelInspect(row)"
                      >查看</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </TreeTableLayout>
    <!-- <PostingDoc ref="PostingDoc" class="indexForm" /> -->
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import { dateFormat } from "@/utils";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import {
  getCorporateList,
  getConstructionoTechnologyPageList,
  getConstructionDetail,
} from "@/api/construct";
import FlowDialog from "@/components/FlowHandle/Dialog";

export default {
  name: "TechnologyControl",
  components: { TreeTableLayout, FlowDialog },
  computed: {},
  data() {
    return {
      searchData: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
        code: "",
        title: "",
        time: [],
      },
      departList: [],
      tableData: [],
      activeItem: {},
      flowShow: false,
      flowInfo: {},
    };
  },
  async mounted() {
    const res = await this.getCorporateList();
    if (Array.isArray(res) && res.length > 0) {
      this.handelListItemClick(res[0]);
    }
  },
  methods: {
    dateFormat,
    handelSearchButtonClick() {
      this.searchData.pageNum = 1;
      this.getConstructionoTechnologyPageList();
    },
    handelResetButtonClick() {
      const metaData = this.$options.data();
      this.searchData = metaData.searchData;
      this.searchData.corporateId = this.activeItem.corpId;
      this.getConstructionoTechnologyPageList();
    },
    async handelListItemClick(data, node, own) {
      this.activeItem = data;
      this.searchData.pageNum = 1;
      this.searchData.corporateId = data.corpId;
      this.getConstructionoTechnologyPageList();
    },
    async getCorporateList() {
      try {
        const { data, success, message } = await getCorporateList();

        if (!success) {
          this.$message.error("查询单位列表失败：" + message);
          return false;
        }
        this.departList = data;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询单位列表失败");
        return false;
      }
    },
    // 查表格数据
    async getConstructionoTechnologyPageList() {
      this.tableData = [];
      try {
        const { data, success, message } =
          await getConstructionoTechnologyPageList({
            ...this.searchData,
            startDate: (this.searchData.time || [])[0] || "",
            endDate: (this.searchData.time || [])[1] || "",
          });

        if (!success) {
          this.$message.error("查询表格数据失败：" + message);
          return false;
        }
        this.tableData = data.records;
        this.searchData.total = data.total;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("查询表格数据失败");
        return false;
      }
    },

    handelPageSizeChange(page) {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = page.pageSize;
      this.getConstructionoTechnologyPageList();
    },
    handelCurrentChange(page) {
      this.searchData.pageNum = page.current;
      this.getConstructionoTechnologyPageList();
    },
    async getConstructionDetail(id) {
      try {
        const { data, success, message } = await getConstructionDetail({
          id,
        });
        if (!success) {
          this.$message.error("获取详情失败：" + message);
          return false;
        }
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取详情失败");
        return false;
      }
    },
    async handelInspect(row) {
      const res = await this.getConstructionDetail(row.id);
      if (!res) {
        return;
      }
      const checkRow = {
        ...res,
        page: "fine",
        businessId: row.id,
        flowInfo: {
          page: "fine",
          businessId: row.id,
        },
      };
      this.flowInfo = {
        ...checkRow,
      };
      localStorage.setItem(
        "flow_data_row_" + res.flowConfigId,
        JSON.stringify(checkRow)
      );
      this.flowShow = true;
    },
    handelExport() {
      const params = {
        ...this.searchData,
        startDate: (this.searchData.time || [])[0] ? this.dateFormat((this.searchData.time || [])[0])   : "",
        endDate: (this.searchData.time || [])[1] ? this.dateFormat((this.searchData.time || [])[1])  : "",
      };
      const searchParams = new URLSearchParams(params);
      window.open(
        `/api/construction/technology/export?${searchParams}`,
        "_blank"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.page-technology-control {
  height: 100%;
  overflow: hidden;
  .content {
    width: 100%;
    display: flex;
    height: 100%;
    .list-wrapper {
      width: 267px;
      height: 100%;
      overflow: auto;
      border: #e5e5e5 1px solid;
      padding: 10px;
      h4 {
        color: #303133;
        font-size: 16px;
      }
      ul {
        margin-top: 8px;
        font-size: 14px;

        list-style: none;
        li {
          cursor: pointer;
          padding: 8px 1em;
          transition: all 0.2s ease-in-out;
          &:hover {
            background-color: #f5f7fa;
          }
          &.active {
            color: #409eff;
            background-color: #d9ecff;
          }
        }
      }
    }
    .table-wrapper {
      flex: 1;
      width: 0;
    }
  }
}
</style>

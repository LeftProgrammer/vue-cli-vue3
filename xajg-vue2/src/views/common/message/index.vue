<template>
  <!--我的消息-->
  <div class="page-list">
    <table-layout
      :page="pageParams"
      title="我的消息"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <template slot="form"> </template>
      <template slot="opratebtns">
        <el-button type="primary" @click="noticesAll"> 一键已读 </el-button>
        <el-button type="primary" @click="clearAll"> 一键清空 </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <!-- <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          /> -->
          <el-table-column label="消息标题" prop="noticeTitle" align="left" />
          <el-table-column
            label="发起人"
            prop="sendUserRealName"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            label="发布时间"
            prop="noticeDate"
            align="center"
            width="200"
          >
            <template slot-scope="{ row }">
              {{
                row.noticeDate
                  ? dateFormat(row.noticeDate, "YYYY-MM-DD HH:mm:ss")
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="已读"
            prop="readStatus"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <span
                class="iconfont"
                :class="row.readStatus ? 'icon-checked' : ''"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template #default="scope">
              <list-button
                :data="scope.row"
                :index="scope.$index"
                :btns="['view', 'delete']"
              ></list-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedHandle"
      @ok="getTableData"
    ></dataform>
  </div>
</template>

<script>
import { notices, noticesmulti, remove, removeNoticeAll } from "./api";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import { dateFormat } from "@/utils";
export default {
  name: "common-message",
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    dataform,
  },
  data() {
    return {
      pageParams: {
        pageSize: 10,
        size: 10,
        current: 1,
        total: 0,
      },
      options: [],
      tableData: [],
      query: {},

      dictList: [],
      readonly: false,

      /**组织机构选择 */
      deptShow: false,

      url: { list: "/api/system/notices" },
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    dateFormat: dateFormat,
    /**删除 */
    removeHandle(row) {
      if (!row.noticeId) {
        return;
      }
      remove(row.noticeId).then((res) => {
        if (res.success) {
          if (typeof row.$index === "number") {
            this.tableData.splice(row.$index, 1);
          } else {
            this.getTableData();
          }
          this.$message.success("删除成功");
        }
      });
    },
    /**一键清空 */
    clearAll() {
      let data = this.tableData.map((i) => i.noticeId);
      let msg = "清空通知列表失败";
      this.$confirm(`确认清空通知列表？`, "提示").then((res) => {
        removeNoticeAll({ data }).then((res) => {
          if (res.success) {
            this.getTableData();
            // 更新未读消息数量
            this.$bus.emit("noticeNotReadCount");
          } else {
            this.$message.error(msg);
          }
        });
      });
    },
    /**一键已读 */
    noticesAll() {
      let ids = this.tableData
        .filter((x) => x.readStatus === 0)
        .map((x) => x.noticeId);
      if (ids.length == 0) {
        return;
      }
      noticesmulti(ids).then((x) => {
        if (x.success) {
          this.getTableData();
          // 更新未读消息数量
          this.$bus.emit("noticeNotReadCount");
        }
      });
    },
    /**关闭时 */
    closedHandle(row) {
      this.oprateRow.dialogShow = false;
      if (
        row &&
        row.noticeId &&
        row.readStatus === 0 &&
        typeof row.$index === "number"
      ) {
        notices(row.noticeId).then((res) => {
          if (res.success) {
            row.readStatus = 1;
            this.$set(this.tableData, row.$index, { ...row });
            // 更新未读消息数量
            this.$bus.emit("noticeNotReadCount");
          }
        });
      }
      this.getTableData();
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
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
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

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
</style>

<template>
  <div class="page-list">
    <TableLayout
      :page="pageParams"
      title="我的消息"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
    >
      <template #form></template>

      <template #opratebtns>
        <el-button type="primary" @click="noticesAll">一键已读</el-button>
        <el-button type="primary" @click="clearAll">一键清空</el-button>
      </template>

      <template #table>
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column label="消息标题" prop="noticeTitle" align="left" />
          <el-table-column
            label="发起人"
            prop="sendUserRealName"
            align="center"
            width="200"
          />
          <el-table-column
            label="发布时间"
            prop="noticeDate"
            align="center"
            width="200"
          >
            <template #default="{ row }">
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
            <template #default="{ row }">
              <span
                class="iconfont"
                :class="row.readStatus ? 'icon-checked' : ''"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template #default="scope">
              <ListButton
                :data="scope.row"
                :index="scope.$index"
                :btns="['view', 'delete']"
                @view="viewHandle"
                @delete="removeHandle"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableLayout>

    <MessageDataform
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedHandle"
      @ok="getTableData"
    />
  </div>
</template>

<script>
import { notices, noticesmulti, remove, removeNoticeAll } from "./api";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table/index.vue";
import ListButton from "@/components/ListButton/index.vue";
import MessageDataform from "./dataform.vue";
import { dateFormat } from "@/utils";

export default {
  name: "CommonMessage",
  components: {
    TableLayout,
    ListButton,
    MessageDataform,
  },
  mixins: [ListMixin],
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
      deptShow: false,
      url: { list: "/api/system/notices" },
    };
  },
  methods: {
    dateFormat,
    // 查看：由 ListButton 触发，填充 oprateRow 并展示弹窗
    viewHandle(row) {
      if (this.oprateRow) {
        this.oprateRow.data = row;
        this.oprateRow.dialogShow = true;
        this.oprateRow.isView = true;
      }
    },
    // 删除单条
    removeHandle(row) {
      if (!row || !row.noticeId) return;
      remove(row.noticeId).then((res) => {
        if (res && res.success) {
          if (typeof row.$index === "number") {
            this.tableData.splice(row.$index, 1);
          } else {
            this.getTableData();
          }
          this.$message.success("删除成功");
          // 更新未读消息数量
          this.$bus && this.$bus.emit && this.$bus.emit("noticeNotReadCount");
        }
      });
    },
    // 一键清空
    clearAll() {
      const data = this.tableData.map((i) => i.noticeId).filter(Boolean);
      if (!data.length) return;
      const msg = "清空通知列表失败";
      this.$confirm("确认清空通知列表？", "提示")
        .then(() => removeNoticeAll({ data }))
        .then((res) => {
          if (res && res.success) {
            this.getTableData();
            this.$bus && this.$bus.emit && this.$bus.emit("noticeNotReadCount");
          } else if (res) {
            this.$message.error(msg);
          }
        });
    },
    // 一键已读
    noticesAll() {
      const ids = this.tableData
        .filter((x) => x.readStatus === 0)
        .map((x) => x.noticeId);
      if (!ids.length) return;
      noticesmulti(ids).then((res) => {
        if (res && res.success) {
          this.getTableData();
          this.$bus && this.$bus.emit && this.$bus.emit("noticeNotReadCount");
        }
      });
    },
    // 详情弹窗关闭
    closedHandle(row) {
      if (this.oprateRow) {
        this.oprateRow.dialogShow = false;
      }
      if (
        row &&
        row.noticeId &&
        row.readStatus === 0 &&
        typeof row.$index === "number"
      ) {
        notices(row.noticeId).then((res) => {
          if (res && res.success) {
            row.readStatus = 1;
            this.$set(this.tableData, row.$index, { ...row });
            this.$bus && this.$bus.emit && this.$bus.emit("noticeNotReadCount");
          }
        });
      }
      this.getTableData();
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
</style>

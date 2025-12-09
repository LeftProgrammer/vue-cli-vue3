<template>
  <div class="page-list">
    <table-layout
      :page="pageParams" title="用户签名列表" @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange" @query="getTableData" @reset="reset"
    >
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" @click="addHandle">
          新增
        </el-button>
      </template>
      <template slot="form">
        <el-form :inline="true" :model="query">
          <el-form-item label="用户名">
            <el-input v-model="query.userName" placeholder="请输入用户名" clearable />
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="用户名" prop="userName" width="200" />
          <el-table-column label="签名图片" prop="signImage">
            <template #default="{ row }">
              <el-image v-if="getSignImage(row.signImage)" :src="getSignImage(row.signImage)" style="height:40px" fit="contain" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createDate" align="center" width="180">
            <template #default="{ row }">{{ timeFormat(row.createDate) }}</template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template #default="{ row }">
              <list-button
                :data="row" :btns="[
                  {
                    title: '编辑',
                    disabled: false,
                    method: 'edit',
                  },
                  {
                    title: '删除',
                    disabled: false,
                    method: 'delete',
                  },
                ]" @click="view" @delete="deleteHandle" @edit="edit"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      v-if="oprateRow.dialogShow" :visible="oprateRow.dialogShow" :data="oprateRow.data"
      :title="oprateRow.title" :readonly="oprateRow.isView" @closed="closedDialog" @ok="getTableData"
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
  export default {
    name: "UserSign",
    components: {
      TableLayout,
      ListButton,
      dataform,
    },
    mixins: [ListMixin],
    data() {
      return {
        pageParams: {
          size: 20,
          current: 1,
          total: 0,
        },
        options: [],
        tableData: [],
        query: {
          entity: { userName: "" },
          page: { size: 20, current: 1 }
        },

        dictList: [],
        readonly: false,

        /**组织机构选择 */
        deptShow: false,
        url: { list: "/api/user/sign/page" },
      };
    },
    computed: {},
    created() {
      this.getTableData();
    },
    methods: {
      getSignImage(content) {
        let url = '';
        try {
          let arr = JSON.parse(content);
          let tempUrl = arr[0].url;
          try {
            let urlObj = new URL(tempUrl);
            url = urlObj.pathname + urlObj.search;
          } catch (e) {
            url = tempUrl;
          }
        } catch (error) {
          console.log(error);
        }
        console.log("url", url);
        return url;
      },
      getTableData() {
        let query = {
          entity: { userName: this.query.userName },
          size: this.pageParams.pageSize,
          current: this.pageParams.current
        };
        page(query).then((res) => {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        });
      },
      // 重置查询条件
      reset() {
        this.query.userName = "";
        this.pageParams.current = 1;
        this.pageParams.pageSize = 20;
        this.getTableData();
      },
      closedDialog() {
        this.oprateRow.dialogShow = false;
      },

      /**新增 */
      addHandle() {
        this.oprateRow.data = {};
        this.oprateRow.dialogShow = true;
        this.oprateRow.isView = false;
        this.oprateRow.title = "新增";
      },
      /** 删除*/
      deleteHandle(row) {
        remove(row.id).then((res) => {
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
      view(row, type, matter, action) {
        this.oprateRow.data = row;
        this.oprateRow.dialogShow = true;
        this.oprateRow.isView = true;
        this.oprateRow.title = "详情";
      },
      edit(val) {
        this.oprateRow.dialogShow = true;
        this.oprateRow.data = val;
        this.oprateRow.isView = false;
        this.type = val.type;
        this.enterAble = true;
        this.oprateRow.title = "编辑";
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

  // .el-col .el-input {
  //   width: 60%;
  // }

  // .lengthening .el-select {
  //   width: 93%;

  //   .el-input {
  //     width: 100%;
  //   }
  // }
</style>

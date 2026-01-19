<template>
  <div class="category">
    <table-layout :show-page="false" @query="handleQuery" @reset="reset">
      <!-- 查询表单 -->
      <template slot="form">
        <el-form :model="pageParams" :inline="true">
          <el-form-item label="项目名称:" size="mini">
            <el-input v-model="pageParams.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="所属年份:" size="mini">
            <el-date-picker
              v-model="pageParams.investmentYear"
              type="year"
              :clearable="false"
              value-format="yyyy"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" icon="el-icon-plus" @click="addHandle(1)">
          新增
        </el-button>
        <el-button @click="downloadTemplate()"> 模板下载 </el-button>
        <el-upload
          action="/api/investment/category/import"
          :show-file-list="false"
          :on-success="fileChange"
        >
          <el-button style="margin-left: 10px">导入</el-button>
        </el-upload>
      </template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          row-key="id"
          default-expand-all
        >
          <el-table-column label="序号" prop="code" width="120" align="center" />
          <el-table-column
            label="项目名称"
            align="left"
            header-align="center"
            prop="name"
            excel.sort="2"
          >
            <template slot-scope="{ row }">
              <el-link type="primary" :underline="false" @click="view(row)">{{
                row.name
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template #default="{ row }">
              <list-button
                :data="row"
                :btns="[
                  { title: '编辑', method: 'edit' },
                  { title: '删除', method: 'delete' }
                ]"
                @edit="edit"
                @delete="deleteHandle"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <dataform
      v-if="oprateRow.dialogShow"
      :type="type"
      :title="title"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      :table-data="tableData"
      @closed="closedDialog"
      @ok="getTableData"
    />
  </div>
</template>

<script>
import { list, remove } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import ListButton from "@/components/ListButton";
import TableLayout from "@/components/ContentLayout/Table";
import dataform from "./dataform";
export default {
  components: {
    ListButton,
    dataform,
    TableLayout
  },
  mixins: [ListMixin],
  data() {
    return {
      downloadPath: "/static/template/投资分类导入模版.xlsx",
      pageParams: {},
      activeName: "table",
      type: "",
      title: "",
      oprateRow: {},
      tableData: [],
      treeData: {}
    };
  },
  created() {
    this.$set(this.pageParams, "investmentYear", new Date());
  },
  mounted() {},
  methods: {
    downloadTemplate() {
      let fileName = "投资分类导入模版.xlsx";
      var link = document.createElement("a");
      link.href = this.downloadPath;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    edit(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
      this.type = "edit";
      this.title = "编辑";
    },
    view(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "详情";
    },

    reset() {
      this.pageParams = {
        investmentYear: new Date()
      };
      this.getTableData();
    },
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      const params = Object.assign({}, this.pageParams);
      if (params.investmentYear) {
        params.investmentYear = dateFormat(params.investmentYear, "YYYY");
      } else {
        params.investmentYear = dateFormat(new Date(), "YYYY");
      }
      list(params).then((data) => {
        this.tableData = this.arrayToTree(data.data);
        // this.treeData = this.tableData[0] || false
        // console.log('🚀 ~ getTableData ~  this.treeData :', this.treeData)
      });
    },
    fileChange() {
      this.getTableData();
    },
    /**
     * 将扁平数组转成树形结构（按 code 版本号排序）
     * @param {Array} list 原始数组
     * @param {Object} opt 配置项
     *        - idKey: 主键字段名，默认 'id'
     *        - pidKey: 父级 id 字段名，默认 'parentId'
     *        - sortKey: 排序字段名，默认 'code'
     *        - childrenKey: 子节点字段名，默认 'children'
     * @returns {Array} 树形结构
     */
    arrayToTree(list = [], opt = {}) {
      const {
        idKey = "id",
        pidKey = "pid",
        sortKey = "code",
        childrenKey = "children"
      } = opt;

      // 版本号比较函数（支持 1.1.2, 1.1.3 等格式）
      const compareVersion = (a, b) => {
        const codeA = a[sortKey] || "";
        const codeB = b[sortKey] || "";

        // 将版本号拆分为数字数组
        const partsA = codeA.split(".").map((num) => parseInt(num) || 0);
        const partsB = codeB.split(".").map((num) => parseInt(num) || 0);

        // 逐段比较
        const maxLen = Math.max(partsA.length, partsB.length);
        for (let i = 0; i < maxLen; i++) {
          const numA = partsA[i] || 0;
          const numB = partsB[i] || 0;
          if (numA !== numB) {
            return numA - numB;
          }
        }
        return 0;
      };

      // 1. 建立 id -> node 的映射
      const map = new Map();
      list.forEach((item) =>
        map.set(item[idKey], {
          ...item,
          label: `${item.name} ${item.user ? " : " + item.user : ""}`,
          [childrenKey]: []
        })
      );

      // 2. 组装树
      const tree = [];
      list.forEach((item) => {
        const node = map.get(item[idKey]);
        if (item[pidKey] == null || !map.has(item[pidKey])) {
          // 根节点
          tree.push(node);
        } else {
          // 子节点
          const parent = map.get(item[pidKey]);
          parent[childrenKey].push(node);
        }
      });

      // 3. 递归排序（使用版本号比较）
      function sortChildren(nodes) {
        if (!Array.isArray(nodes)) return;
        nodes.sort(compareVersion);
        nodes.forEach((n) => sortChildren(n[childrenKey]));
      }
      sortChildren(tree);

      return tree;
    },
    /* 新增 */
    addHandle(type) {
      this.type = "add";
      this.title = "新增";
      this.oprateRow.data = { type };
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
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
    }
  }
};
</script>
<style scoped lang="scss">
@import url("https://unpkg.com/vue2-org-tree@1.1.0/dist/style.css");
.category {
  height: 100%;
}
</style>

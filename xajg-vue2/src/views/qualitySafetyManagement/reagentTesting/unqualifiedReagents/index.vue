<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="search"
      @reset="reset"
      title="不合格检测台账"
    >
      <!-- <template slot="tree">
        <el-tree
          :data="typeOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </template> -->
      <template slot="form">
        <el-form :model="pageParams.entity" :inline="true">
          <el-form-item label="样品编号:">
            <el-input
              v-model="pageParams.entity.code"
              placeholder="请输入样品编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="样品名称:">
            <el-input
              v-model="pageParams.entity.name"
              placeholder="请输入样品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="报告编号:">
            <el-input
              v-model="pageParams.entity.reportCode"
              placeholder="请输入报告编号"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" border>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
            :index="getIndex"
          />
          <el-table-column label="样品编号" align="center" prop="code" />
          <el-table-column label="样品名称" align="center" prop="name" />
          <el-table-column label="检测日期" align="center" prop="testDate">
            <template slot-scope="{ row }">
              {{ row.testDate ? timeFormat(row.testDate, "YYYY-MM-DD") : "" }}
            </template>
          </el-table-column>
          <el-table-column label="报告编号" align="center" prop="reportCode" />
          <el-table-column label="报告日期" align="center" prop="reportDate">
            <template slot-scope="{ row }">
              {{
                row.reportDate ? timeFormat(row.reportDate, "YYYY-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="检测报告"
            width="180"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <el-button @click="downFile(row)" type="text" size="small">
                {{ getFileName(row.uploadFile) }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="工程名称" align="center" prop="projectName" />
          <el-table-column
            label="所属标段"
            align="center"
            prop="section"
            :formatter="sectionIdFormatter"
          />
          <el-table-column
            label="不合格项目"
            align="center"
            prop="unqualifiedProject"
            show-overflow-tooltip
          />
          <el-table-column label="闭合日期" align="center" prop="closureDate">
            <template slot-scope="{ row }">
              {{
                row.closureDate ? timeFormat(row.closureDate, "YYYY-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="复检报告编号"
            align="center"
            prop="recheckReportCode"
          />
          <el-table-column
            label="备注"
            align="center"
            prop="unqualifiedRemark"
            show-overflow-tooltip
          />
          <el-table-column label="使用部位" prop="pbsCode" align="center">
            <template slot-scope="{ row }">
              <bim-show :pbsCode="getPbsCode(row.pbsCode)"></bim-show>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="{ row }">
              <div class="flex justify-center">
                <el-link type="primary" plain @click="viewHandle(row)">
                  查看
                </el-link>
                <el-link
                  type="primary"
                  plain
                  @click="editHandle(row)"
                  style="margin-left: 10px"
                >
                  处理
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>

    <dataform
      ref="dataform"
      @childrenSure="childrenSure"
      :viewAble="oprateRow.viewAble"
      :enterAble="enterAble"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @sureson="sureson"
    ></dataform>
  </div>
</template>

<script>
import { remove, page, sectionList } from "./api";
import { getDictItemList } from "@/api/dict";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import bimShow from "@/components/Bim/Show";
import { dateFormat } from "@/utils";
import { sectionAllList } from '../reagents/api';

export default {
  name: "monitoring-point",
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    dataform,
    bimShow,
  },
  data() {
    return {
      /**施工标段 */
      sectionOptions: [],
      enterAble: true,
      // 左侧树
      typeOptions: [],
      // 树结构属性映射
      defaultProps: {
        children: "children",
        label: "dictName",
      },
      title: "",
      type: "",
      formData: {
        // representativeQuantity: "",
        section: "",
        name: "",
        id: "",
        isChange: "1",
        planId: "",
        actualDate: "",
        remark: "",
        designSupplyFileList: [],
        reportList: "",
        tableData: [],
        otherFile: "",
        testPerson: "",
        unqualifiedFile: "",
      },
      guifenAble: false,
      suNingJiAble: false,
    };
  },
  created() {
    this.getTypeOptions();
    //获取标段列表
    this.getSectionList();
  },
  methods: {
    //后端未处理 前端查询的时候将分页指定为第一页
    search() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    getFileName(fileName) {
      let name = "";
      let arr = JSON.parse(fileName);
      if (fileName && Array.isArray(arr) && arr.length > 0) {
        name = arr[0].name;
      }
      return name;
    },
    downFile(row) {
      console.log("rowddd", row);
      let arr = JSON.parse(row.uploadFile);
      if (Array.isArray(arr) && arr.length > 0) {
        this.$downFileById(arr[0]);
      }
    },
    //列表点击检测报告直接下载
    // downloadFile(row) {
    //   window.open(`/api/attachments/download?attId=${row.fileId}`, "_blank");
    // },
    getPbsCode(val) {
      let text = "*";
      console.log("getPbsName", val);
      let a = val?.split("&&&")[0];
      if (a) {
        text = a;
      }
      return text;
    },
    //接受子组件
    childrenSure(data) {
      this.oprateRow.dialogShow = data.dialogShow;
      // this.pageParams.entity.name = data.name;
      this.$nextTick(() => {
        this.getTableData();
      });
    },
    /**获取施工标段 */
    getSectionList() {
      this.sectionOptions = [];
      sectionAllList({}).then((res) => {
        if (res.success) {
          this.sectionOptions = res.data;
        }
      });
    },
    //翻译列表所属标段 id=>name
    sectionIdFormatter(row, column) {
      var value = "";
      for (var i = 0; i < this.sectionOptions.length; i++) {
        var item = this.sectionOptions[i];
        if (row.section == item.id) {
          value = item.name;
          break;
        }
      }
      return value;
    },
    viewHandle(data) {
      let val = { ...data };
      //弹窗不允许编辑
      this.enterAble = false;
      //打开弹窗
      this.oprateRow.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.dataform.formData = val;
        this.$refs.dataform.clearValidate();
        this.$refs.dataform.getCurrent(); //获取当前登陆人
      });
      this.title = "查看弹窗（" + data.name + "检测）";
    },
    editHandle(data) {
      let val = { ...data };
      //弹窗允许编辑
      this.enterAble = true;
      // this.oprateRow.data = data;
      //打开弹窗
      this.oprateRow.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.dataform.formData = val;
        this.$refs.dataform.clearValidate();
      });
      this.title = "处理弹窗（" + data.name + "检测）";
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    resultFormat(item) {
      if (item == 1) {
        return "合格";
      } else if (item == 2) {
        return "不合格";
      } else {
        return "";
      }
    },
    // 按钮权限
    getDisabledBtns(rows) {
      for (let index in rows) {
        rows[index].disabledBtns = [];
        let userId = this.$store.getters.loginInfo.userId;
        if (rows[index].createUser !== userId) {
          rows[index].disabledBtns.push("edit");
          rows[index].disabledBtns.push("delete");
        }
      }
    },
    reset() {
      if (this.pageParams.entity.type) {
        this.pageParams.current = 1;
        this.pageParams.pageSize = 20;
        const type = this.pageParams.entity.type;
        this.pageParams.entity = {
          type: type,
        };
      } else {
        this.pageParams.current = 1;
        this.pageParams.pageSize = 20;
        this.pageParams.entity = {};
      }
      this.getTableData();
    },
    /**获取字典 */
    getTypeOptions() {
      getDictItemList("bggl_bgml").then((res) => {
        // const data = ;
        this.typeOptions.push({
          dictName: "报告目录",
          children: res.data,
        });
      });
    },
    sureson() {
      this.oprateRow.dialogShow = false;
      this.getTableData();
    },
    handleNodeClick(node) {
      this.pageParams.entity = {};
      if (node.dictCode) {
        this.pageParams.entity.type = node.dictCode;
      } else {
        this.pageParams.entity.type = null;
      }
      this.getTableData();
    },
    getTableData() {
      //查询不合格切流程完成的数据
      this.pageParams.entity.testResult = 2;
      this.pageParams.entity.flowStatus = 2;
      page(this.pageParams).then((res) => {
        this.tableData = this.orderData(res.data.records);
        this.pageParams.total = res.data.total;
        // this.getDisabledBtns(this.tableData);
      });
    },
    orderData(data) {
      let arr1 = data.filter(
        (X) =>
          X.closureDate == "" ||
          X.closureDate == null ||
          X.closureDate == undefined
      );
      let arr2 = data.filter(
        (X) =>
          X.closureDate != "" &&
          X.closureDate != null &&
          X.closureDate != undefined
      );
      let result = [];
      //降序排列
      if (arr1.length > 0) {
        // arr1 = arr1.sort((a, b) => b.testDate.localeCompare(a.testDate));
        arr1 = arr1.sort((a, b) => b.testDate - a.testDate);
        arr1.forEach((element) => {
          result.push(element);
        });
      }
      if (arr2.length > 0) {
        // arr2 = arr2.sort((a, b) => b.testDate.localeCompare(a.testDate));
        arr2 = arr2.sort((a, b) => b.testDate - a.testDate);
        arr2.forEach((element) => {
          result.push(element);
        });
      }
      if (result) {
        return result;
      } else {
        return data;
      }
    },
    addHandle() {
      this.enterAble = true;
      if (!this.pageParams.entity.type) {
        this.$message.warning("请选择左侧具体的报告目录");
        return;
      } else {
        this.type = this.pageParams.entity.type;
        if (this.type == "yb") {
          this.title = "新增-月报";
        } else if (this.type == "jb") {
          this.title = "新增-季报";
        } else if (this.type == "nb") {
          this.title = "新增-年报";
        }
        this.oprateRow.data = {};
        this.oprateRow.dialogShow = true;
        this.oprateRow.isView = false;
      }
    },
    downLoad(row) {
      row.attId = row.uploadFile;
      this.$downFile(row);
    },
    getTypeDictName(id) {
      if (this.typeOptions && this.typeOptions.length > 0) {
        for (let item of this.typeOptions[0].children) {
          if (item.dictCode === id) {
            return item.dictName;
          }
        }
      } else {
        return "";
      }
    },
    view(val) {
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = val.type;
      this.enterAble = false;
      if (this.type == "yb") {
        this.title = "查看-月报";
      } else if (this.type == "jb") {
        this.title = "查看-季报";
      } else if (this.type == "nb") {
        this.title = "查看-年报";
      }
    },
    edit(val) {
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
      this.type = val.type;
      this.enterAble = true;
      if (this.type == "yb") {
        this.title = "编辑-月报";
      } else if (this.type == "jb") {
        this.title = "编辑-季报";
      } else if (this.type == "nb") {
        this.title = "编辑-年报";
      }
    },
    deleteHandle(row) {
      remove({ id: row.id }).then((res) => {
        if (res.success) {
          this.$message.success("删除成功");
          this.getTableData();
        }
      });
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

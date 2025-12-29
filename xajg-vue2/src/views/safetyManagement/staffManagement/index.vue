<template>
  <div class="page-list">
    <table-layout
      :page="pageParams"
      title="人员管理列表"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="姓名:">
            <el-input v-model="query.name" placeholder="请输入" />
          </el-form-item>

          <el-form-item label="人员类型:">
            <el-select
              ref="planRef"
              v-model="query.type"
              placeholder="请选择"
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in staffTypeList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="所属单位:">
            <el-select
              v-model="selectedUnitName"
              clearable
              popper-class="tree-select"
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option value="" label="">
                <el-tree
                  ref="unitTree"
                  :data="unitTree"
                  :props="unitTreeProps"
                  node-key="corpId"
                  highlight-current
                  :default-expand-all="true"
                  @node-click="handleUnitTreeNodeClick"
                >
                  <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span>{{ data.corpName }}</span>
                  </span>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="addHandle(), (type = 'add')"
        >
          新增
        </el-button>
        <el-button :disabled="readonly" @click="downloadTemplate()">
          模板下载
        </el-button>
        <el-button :disabled="readonly" @click="triggerFileInput()">
          导入数据
        </el-button>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            width="54"
            align="center"
          />
          <el-table-column label="姓名" prop="name" align="center" width="120">
            <template slot-scope="scope">
              <el-link type="primary" @click="view(scope.row)">{{
                scope.row.name
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            label="进退场状态"
            prop="status"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-tag
                :type="getStatusTagType(scope.row.status)"
                effect="dark"
                size="medium"
              >
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center" width="80">
            <template slot-scope="scope">
              {{ getGender(scope.row.agentCard) }}
            </template>
          </el-table-column>
          <el-table-column label="身份证号" prop="agentCard" align="center">
            <template slot-scope="scope">
              {{ maskIdCard(scope.row.agentCard) }}
            </template>
          </el-table-column>
          <el-table-column label="联系方式" prop="phone" align="center">
            <template slot-scope="scope">
              {{ maskPhone(scope.row.phone) }}
            </template>
          </el-table-column>
          <el-table-column
            label="所属单位"
            prop="unit"
            align="left"
            header-align="center"
          >
            <template slot-scope="{ row }">
              <!-- <el-tooltip
                :content="getUnitNameById(row.unit)"
                placement="top"
                effect="dark"
              > -->
              <div class="text-ellipsis">
                {{ getUnitNameById(row.unit) }}
              </div>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column label="人员类型" prop="type" align="center">
            <template slot-scope="scoped">
              <span>{{
                $DictionaryParsing(staffTypeList, scoped.row.type)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="进场日期"
            prop="workStartDate"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.workStartDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="退场日期"
            prop="workEndDate"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.workEndDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name" width="200" align="center">
            <template #default="{ row }">
              <el-link type="primary" @click="edit(row)">编辑 </el-link>
              <el-divider direction="vertical" />
              <el-link type="danger" @click="deleteHandle(row)">删除 </el-link>
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
      @closed="closedDialog"
      @ok="getTableData"
    />
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="handleFileUpload"
    >
  </div>
</template>

<script>
import { remove, page, BelongTo, batchImport } from "./api";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/Table";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import { getDictItemList } from "@/api/dict";
import * as XLSX from "xlsx";

export default {
  name: "StaffManagement",
  components: {
    TableLayout,
    ListButton,
    dataform,
  },
  mixins: [ListMixin],
  data() {
    return {
      // 进退场状态枚举
      OUTGOING_STATUS: {
        DEFAULT: 0, // 未进场
        ENTRY: 1, // 已进场
        EXIT: 2, // 已离场
      },
      downloadPath: "/static/template/人员信息导入模板.xlsx",
      type: "",
      title: "",
      DitSpeciality: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      oprateRow: {},
      options: [],
      tableData: [],
      query: {
        params: {},
      },
      date: [],
      dictList: [],
      readonly: false,
      deptShow: false,
      url: { list: "" },
      userId: "",
      belongUnit: [],
      staffTypeList: [],
      selectedUnitName: "",
      unitTree: [],
      unitTreeProps: {
        children: "children",
        label: "corpName",
        value: "corpId",
      },
    };
  },
  computed: {},
  created() {
    this.getTableData();
    this.userId = this.$getStorage("userInfo").userId;
    this.getBelongTo();
    this.getDictItemList();
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    downloadTemplate() {
      console.log("下载模板");
      let fileName = "人员信息导入模板.xlsx";
      var link = document.createElement("a");
      link.href = this.downloadPath;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handleFileUpload(event) {
      console.log("开始读取文件");
      const files = event.target.files;
      console.log(files.length);
      if (files.length === 0) return;
      const file = files[0];
      const reader = new FileReader();
      const fieldMap = {
        name: "姓名",
        age: "年龄",
        agentCard: "身份证",
        place: "籍贯",
        phone: "电话",
        type: "人员类型",
        race: "民族",
        unit: "所属单位",
      };
      reader.onload = (e) => {
        let that = this;
        const data = new Uint8Array(e.target.result);
        console.log(XLSX);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet); //加上{header:1}会把第一行作为表头
        console.log("表格原始数据", jsonData);
        let newArr = [];
        jsonData &&
          jsonData.length &&
          jsonData.forEach((item) => {
            newArr.push({
              name: item[fieldMap.name],
              age: item[fieldMap.age],
              agentCard: item[fieldMap.agentCard],
              place: item[fieldMap.place],
              phone: item[fieldMap.phone],
              type: item[fieldMap.type],
              race: item[fieldMap.race],
              unit: item[fieldMap.unit],
            });
          });

        if (newArr.length >= 1) {
          batchImport(newArr).then((res) => {
            console.log(res);
            if (res.success) {
              this.$message.success(res.message);
              this.getTableData();
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          this.$message.error("未解析到有效数据");
        }

        that.$refs.fileInput.value = ""; // 清空input方便下次继续上传
      };
      reader.readAsArrayBuffer(file);
    },
    triggerFileInput() {
      this.$nextTick(() => {
        this.$refs.fileInput.click();
      });
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    getNumber(e) {
      if (e) {
        return (e - 0).toFixed(2);
      }
    },
    edit(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.type = "edit";
      this.title = "编辑-人员管理数据";
      console.log(row);
    },
    view(row) {
      this.oprateRow.data = row;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.type = "view";
      this.title = "详情";
    },
    reset() {
      this.selectedUnitName = "";
      this.query = {};
      this.date = [];
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      if (this.date && this.date.length > 0) {
        this.query.startDate = this.date[0] + " 00:00:00";
        this.query.endDate = this.date[1] + " 23:59:59";
      }
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
    },
    /* 新增 */
    addHandle() {
      this.type = "addHandle";
      this.title = "新增";
      // this.$nextTick(()=>{
      //   this.$refs['dataform'].dialogShow=true
      // })
      console.log("addHandle");
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    /**
     * 获取进退场状态标签类型
     */
    getStatusTagType(status) {
      switch (Number(status)) {
        case this.OUTGOING_STATUS.DEFAULT:
          return "info";
        case this.OUTGOING_STATUS.ENTRY:
          return "success";
        case this.OUTGOING_STATUS.EXIT:
          return "danger";
        default:
          return "info";
      }
    },
    /**
     * 获取进退场状态文本
     */
    getStatusText(status) {
      switch (Number(status)) {
        case this.OUTGOING_STATUS.DEFAULT:
          return "未进场";
        case this.OUTGOING_STATUS.ENTRY:
          return "已进场";
        case this.OUTGOING_STATUS.EXIT:
          return "已退场";
        default:
          return "未知";
      }
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
    async handelDeleteRow(row) {
      try {
        await this.$confirm(`确认删除该条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning",
        });
        this.deletedata(row.id);
      } catch (e) {
        console.error(e);
      }
    },

    /**
     * 将扁平数组转换成树形结构
     * @param {Array} data 扁平数组数据
     * @returns {Array} 树形结构数组
     */
    buildUnitTree(data) {
      if (!Array.isArray(data)) {
        return [];
      }

      // 创建一个映射表，用于快速查找节点
      const map = {};
      data.forEach((item) => {
        map[item.corpId] = { ...item, children: [] };
      });

      // 构建树形结构
      const treeData = [];

      data.forEach((item) => {
        const currentNode = map[item.corpId];

        // 如果有父节点且父节点存在于映射表中，则添加到父节点的children中
        if (item.corpPid && map[item.corpPid]) {
          map[item.corpPid].children.push(currentNode);
        } else {
          // 没有父节点或父节点不在数据中，则作为根节点
          treeData.push(currentNode);
        }
      });

      return treeData;
    },
    // 获取当前人的所属机构
    async getBelongTo() {
      const userInfo = this.$getStorage("userInfo");
      let params = {
        userId: userInfo.userId,
      };
      try {
        const res = await BelongTo(params);
        const { data, success } = res;
        if (!success) {
          this.$message.error("获取当前人的所属机构错误");
          // 源数据
          this.belongUnit = [];
          return;
        }
        if (Array.isArray(data) && data?.length > 0) {
          // 从源数据中过滤出重复的单位
          this.unitTree = this.buildUnitTree(data);
          console.log("this.unitTree", this.unitTree);
          this.belongUnit = data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.corpId === item.corpId)
          );
          console.log("this.belongUnitSouce", this.belongUnit);
        } else {
          this.belongUnit = [];
        }
      } catch (error) {
        console.error("Error while fetching BelongTo:", error);
      }
    },

    /**获取字典 */
    async getDictItemList() {
      const { data } = await getDictItemList("STAFF_TYPE");
      this.staffTypeList = data;
      console.log("staffTypeList", data);
    },

    getUnitNameById(unitId) {
      console.log("unit", unitId);
      let item = this.belongUnit?.find((item) => item.corpId == unitId) || "";
      return item ? item.corpName : "";
    },
    getGender(agentCard) {
      if (!agentCard) {
        return "";
      }
      const idCardRegex =
        /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!idCardRegex.test(agentCard)) {
        return "";
      }
      try {
        const gender =
          parseInt(agentCard.slice(16, 17)) % 2 === 0 ? "女" : "男";
        return gender;
      } catch (error) {
        return "";
      }
    },
    // 身份证号脱敏函数
    maskIdCard(idCard) {
      if (!idCard) return "";
      return idCard.length > 10
        ? `${idCard.substring(0, 6)}********${idCard.substring(
            idCard.length - 4
          )}`
        : idCard;
    },

    // 电话号码脱敏函数
    maskPhone(phone) {
      if (!phone) return "";
      return phone.length > 7
        ? `${phone.substring(0, 3)}****${phone.substring(phone.length - 4)}`
        : phone;
    },
    /**
     * 处理单位树节点点击事件
     * @param {Object} data 节点数据
     */
    handleUnitTreeNodeClick(data, event) {
      // 如果是叶子节点 (corpLeaf === 0)，则不可选择
      // console.log("节点被点击", data);
      // if (data.corpLeaf === 0) {
      //   return;
      // }
      if (!this.pageParams.entity) {
        this.pageParams.entity = {};
      }
      this.pageParams.entity.issuanceUnit = data.corpId;
      this.selectedUnitName = data.corpName;
      this.query.unit = data.corpId;

      // 关闭下拉框
      this.$nextTick(() => {
        // 查找文档中所有打开的select
        const allVisibleSelects = document.querySelectorAll(
          ".el-select .el-input.is-focus"
        );
        for (let i = 0; i < allVisibleSelects.length; i++) {
          const select = allVisibleSelects[i].closest(".el-select").__vue__;
          if (select) {
            select.visible = false;
          }
        }
      });
    },
    /**
     * 处理下拉框显示变化
     * @param {Boolean} visible 是否显示
     * @param {String} popperClass 下拉框的类名
     */
    $visibleChange(visible, popperClass) {
      console.log("下拉框状态变化", visible, popperClass);
    },

    handleVisibleChange(visible) {
      if (visible) {
        this.$nextTick(() => {
          console.log("下拉框可见性变化", visible);
        });
      }
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
/deep/.el-range-editor--small .el-range-input {
  font-size: 12px;
}
.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}
</style>
<style scoped lang="scss">
/deep/.el-range-editor--medium .el-range-input {
  font-size: 12px;
}

/* 树形下拉选择器样式 */
.tree-select {
  .el-select-dropdown__wrap {
    max-height: 550px;
    overflow-x: hidden;
  }

  .tree-select-container {
    padding: 6px 0;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px !important;
    font-family: inherit !important;
  }

  .disabled-node {
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  .el-tree-node__content {
    height: 34px;
  }
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: #f5f7fa;
  }

  .el-tree-node__content:hover {
    background-color: #f5f7fa;
  }

  .el-tree {
    font-size: 14px !important;
    font-family: inherit !important;
  }

  .el-scrollbar {
    height: auto !important;
    max-height: 550px;
  }

  .el-select-dropdown__item {
    height: auto;
    padding: 0;
    font-size: 14px !important;
    font-family: inherit !important;
  }
}
</style>

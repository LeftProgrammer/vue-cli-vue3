<template>
  <div>
    <el-form ref="form" :model="query" label-width="auto" inline>
      <el-form-item label="计划月度">
        <el-date-picker v-model="query.month" :value-format="'yyyy-MM'" type="month" placeholder="选择月" />
      </el-form-item>
      <el-form-item label="分类:">
        <el-select ref="flowStateRef" v-model="query.classify" placeholder="请选择" clearable @visible-change="$visibleChange($event, 'el-popper')">
          <el-option v-for="item in designClassify" :key="item.id" :label="item.dictName" :value="item.dictCode" />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="my-10">
      <i class="iconfont icon-menu font-14 mr-5"></i>
      <span>计划任务列表</span>
    </div>

    <el-table ref="multipleTable" :data="pagetableData" highlight-current-row :border="true" @current-change="handleCurrentChange">
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="分类" prop="classify" align="center">
        <template #default="{ row }">
          <span>{{ $DictionaryParsing(designClassify, row.classify) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务项名称" prop="size" align="center">
        <template #default="{ row }">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" prop="type" align="center">
        <template #default="{ row }">
          <span>{{ $DictionaryParsing(ditProfession, row.profession) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程部位" prop="type" align="center">
        <template #default="{ row }">
          <bimShow :pbsCode="row.projectPbs || row.pbsCode"></bimShow>
        </template>
      </el-table-column>
      <el-table-column label="计划供应日期" prop="type" align="center">
        <template #default="{ row }">
          <span>{{ timeFormat(row.planTime, 'yyyy-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否现场需解决事项" prop="type" align="center">
        <template #default="{ row }">
          <span :class="row.isScene == 1 ? 'iconfont icon-checked' : ''"></span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="type" align="center">
        <template #default="{ row }">
          <span>{{ row.chargeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="type" align="center">
        <template #default="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { detailAll } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import bimShow from "@/components/Bim/Show";

export default {
  components: { bimShow },
  props: {
    title: {
      type: String,
      default: "标题",
    },
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      query: {
        month: "",
        classify: "",
      },
      designClassify: [],
      ditProfession: [],
      pagetableData: [],
      chooseId: "",
      currentRow: null,
    };
  },
  watch: {
    "query.month": {
      handler() {
        this.getDetailAll();
      },
      deep: true,
    },
    "query.classify": {
      handler() {
        this.getDetailAll();
      },
      deep: true,
    },
  },
  created() {
    this.getDESIGNCLASSIFY();
    this.getFlowPROFESSION();
  },
  methods: {
    getPbsName(val) {
      let text = "*";
      let a = val?.split("&&&")[1];
      if (a) {
        text = a;
      }
      return text;
    },

    handleCurrentChange(val) {
      this.currentRow = val;
      if (this.currentRow) {
        this.currentRow.month = this.query.month;
      }
    },

    toDay() {
      let date = new Date().getTime();
      let toDay = dateFormat(date, "yyyy-MM");
      this.query.month = toDay;
    },

    timeFormat(time, type) {
      if (time) {
        return dateFormat(time, type || "YYYY-MM");
      }
      return "";
    },

    async getDESIGNCLASSIFY() {
      const { data } = await getDictItemList("DESIGN_CLASSIFY");
      this.designClassify = data;
    },

    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.ditProfession = data;
    },

    getDetailAll() {
      this.query.type = this.type;
      detailAll(this.query)
        .then((result) => {
          if (result.success) {
            this.pagetableData = result.data;
          } else {
            this.$message.error(result.message);
            this.pagetableData = [];
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table {
  .el-table__body tr.current-row > td {
    color: #606266;
    background-color: #b5eaff;
  }

  .el-table__body tr.current-row:hover > td {
    background-color: #b5eaff !important;
    color: #606266 !important;
  }
}

/deep/ .el-radio__label {
  display: none;
}
</style>

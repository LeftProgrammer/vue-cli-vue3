<template>
  <div>
    <!--查询条件 -->
    <el-form :from="query" label-width="auto" ref="form" inline>
      <el-form-item label="计划月度">
        <el-date-picker
          :value-format="'yyyy-MM'"
          v-model="query.month"
          type="month"
          placeholder="选择月"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="分类:">
        <el-select @visible-change="$visibleChange($event, 'el-popper')"
          ref="flowStateRef"
          v-model="query.classify"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in designClassify"
            :key="item.id"
            :label="item.dictName"
            :value="item.dictCode"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 列表页 -->
    <div class="my-10">
      <i class="iconfont icon-menu font-14 mr-5"></i>
      <span>计划任务列表</span>
    </div>

    <el-table
      ref="multipleTable"
      :data="pagetableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      :border="true"
    >
      <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center"
      />
      <el-table-column label="分类" prop="classify" align="center">
        <template slot-scope="{ row }">
          <span>{{ $DictionaryParsing(designClassify, row.classify) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务项名称" prop="size" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" prop="type" align="center">
        <template slot-scope="{ row }">
          <span>{{ $DictionaryParsing(ditProfession, row.profession) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工程部位" prop="type" align="center">
        <template slot-scope="{ row }">
          <bimShow :pbsCode="row.projectPbs || row.pbsCode"></bimShow>
        </template>
      </el-table-column>
      <el-table-column label="计划供应日期" prop="type" align="center">
        <template slot-scope="{ row }">
          <span> {{ timeFormat(row.planTime, "yyyy-MM-DD") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否现场需解决事项" prop="type" align="center">
        <template slot-scope="{ row }">
          <span :class="row.isScene == 1 ? 'iconfont icon-checked' : ''"></span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" prop="type" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.chargeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="type" align="center">
        <template slot-scope="{ row }">
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
  components: {bimShow},
  props: {
    // 表格标题
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
  created() {
    this.getDESIGNCLASSIFY();
    this.getFlowPROFESSION();
  },
  watch: {
    "query.month": {
      handler(newVal, oldVal) {
        this.getDetailAll();
      },
      deep: true,
    },
    "query.classify": {
      handler(newVal, oldVal) {
        this.getDetailAll();
      },
      deep: true,
    },
  },
  mounted() {},
  //
  methods: {
    getPbsName(val) {
      let text = "*";
      console.log("getPbsName", val);
      let a = val?.split("&&&")[1];
      if (a) {
        text = a;
      }
      return text;
    },

    handleCurrentChange(val) {
      this.currentRow = val;
      this.currentRow.month = this.query.month;
    },

    toDay() {
      let date = new Date().getTime();
      let toDay = dateFormat(date, "yyyy-MM");
      console.log("toDay", toDay);
      this.query.month = toDay;
    },

    timeFormat(time, type) {
      if (time) {
        return dateFormat(time, type || "YYYY-MM");
      } else {
        return "";
      }
    },
    /**获取分类字典 */
    async getDESIGNCLASSIFY() {
      const { data } = await getDictItemList("DESIGN_CLASSIFY");
      this.designClassify = data;
      // console.log("获取分类字典", data);
    },
    /**获取流程状态字典 */
    async getFlowPROFESSION() {
      const { data } = await getDictItemList("DESIGN_PROFESSION");
      this.ditProfession = data;
      // console.log("flowStatusOptions", data);
    },
    getDetailAll() {
      console.log("query", this.query);
      this.query.type = this.type;
      detailAll(this.query)
        .then((result) => {
          console.log("请求月度计划", result);
          if (result.success) {
            // this.pagetableData = result.data.filter((item) => item.select);
            this.pagetableData = result.data;
          } else {
            this.$message.error(result.message);
            this.pagetableData = [];
          }
        })
        .catch((err) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-table {
  //.el-table__header {
  //  background-color: #1298fa;
  //  border-radius: 4px;
  //  overflow: hidden;
  //  .el-table__cell {
  //    text-align: center;
  //    .cell {
  //      color: #fff;
  //      text-align: center;
  //    }
  //  }
  //}
  .el-table__body tr.current-row > td {
    color:  #606266 ;
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

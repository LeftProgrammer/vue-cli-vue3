<template>
  <div class="page-leave">
    <table-layout
      :page="pageParams"
      title="关联会议纪要"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      @query="getMeetingList"
    >
      <template slot="form">
        <!--查询条件 -->
        <el-form :from="query" label-width="auto" ref="form" class="flex">
          <el-form-item label="文件编号">
            <el-input placeholder="请输入" v-model="query.code" />
          </el-form-item>
          <el-form-item label="标题" class="ml-8">
            <el-input placeholder="请输入" v-model="query.title" />
          </el-form-item>
          <el-form-item label="文种" class="ml-8">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="query.type">
              <el-option
                v-for="item in ditWenZhong"
                :label="item.dictName"
                :key="item.dictCode"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns"><span></span></template>>
      <template slot="table">
        <el-table
          highlight-current-row
          ref="multipleTable"
          :data="pagetableData"
          :border="true"
          height="300px"
          @current-change="handleCurrent"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="文件编号" prop="code" align="center">
            <template slot-scope="{ row }">
              <span>{{ getCode(row.code) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title" align="center">
          </el-table-column>
          <el-table-column label="文种" prop="type" align="center">
            <template slot-scope="{ row }">
              <span>{{ $DictionaryParsing(ditWenZhong, row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发文部门" prop="department" align="center">
          </el-table-column>
          <el-table-column label="收文单位" prop="sendUnits" align="center">
            <template slot-scope="{ row }">
              <span class="text-ellipsis" :title="getUnitName(row.sendUnits)">
                {{ getUnitName(row.sendUnits) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column sortable label="发文日期" prop="type" align="center">
            <template slot-scope="{ row }">
              <span>
                {{ row.createDate ? timeFormat(row.createDate) : "" }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
  </div>
</template>
<script>
import { getMeetingList, corporates } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import TableLayout from "@/components/ContentLayout/Table";
export default {
  components: { TableLayout },
  props: {
    // 表格标题
    title: {
      type: String,
      default: "标题"
    }
  },
  data() {
    return {
      currentRow: null,
      daterangeDate: "",
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      query: {
        name: "",
        code: ""
      },
      designClassify: [],
      ditProfession: [],
      pagetableData: [],
      ditWenZhong: [],
      chooseId: "",
      receiveUnitList: []
    };
  },
  created() {
    this.getDESIGNCLASSIFY();
    this.getFlowPROFESSION();
    this.getDitWWENZHONG(); //文种字典
    this.getUnitList();
  },
  mounted() {
    this.getMeetingList();
    this.init();
  },
  methods: {
    getCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\|/, "-【");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\|/, "】-");

      return outputString;
    },
    retCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\-【/, "|");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\】-/, "|");

      return outputString;
    },
    // 选中事件触发
    handleSelectionChange(val) {
      console.log("选中事件触发", val);
      this.currentRow = val;
    },
    handleSizeChange(val) {
      this.pageParams = val;
      this.getMeetingList();
    },
    handleCurrentChange(val) {
      this.pageParams = val;
      this.getMeetingList();
    },
    init() {
      this.currentRow = null;
    },
    toDay() {
      let date = new Date().getTime();
      let toDay = dateFormat(date, "yyyy-MM");
      console.log("toDay", toDay);
      this.query.month = toDay;
    },
    handleCurrent(val) {
      console.log("handleCurrent", val);
      this.currentRow = val;
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**重置表格数据 */
    reset() {
      this.query = {};
      this.query.current = 1;
      this.query.pageSize = 20;
      this.daterangeDate = [];
      this.getMeetingList();
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
    },
    async getDitWWENZHONG() {
      const { data } = await getDictItemList("wz");
      this.ditWenZhong = data;
    },
    getMeetingList() {
      //获取当前操作人的所属单位
      let current = this.$getStorage("userInfo");
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          unitType: 1,
          documentType: 2,
          flowStatus: 2
        }
      };
      if (current) {
        params.entity.unit = current.corpId;
      }
      // 因为存在下的的code 是 | 所以需要转化成 -【】-
      if (params?.entity?.code) {
        params.entity.code = this.retCode(params.entity.code);
      }
      console.log("查询参数", params);
      getMeetingList(params).then((result) => {
        console.log("res", result);
        if (result.success && result.data.records.length >= 0) {
          const { records, total } = result.data;
          this.pagetableData = records;
          this.pageParams.total = total;
        } else {
          this.$message.error(result.message);
          this.pagetableData = [];
        }
      });
    },
    // 根据单位id 获取名称
    getUnitName(unitIds) {
      if (!unitIds) return;
      let arr = unitIds.split(",");
      let names = [];
      this.receiveUnitList.forEach((x) => {
        if (arr.includes(x.corpId)) {
          names.push(x.corpName);
        }
      });
      return names.join(",") || unitIds;
    },
    // 收文单位
    async getUnitList() {
      const { data, success } = await corporates();
      console.log("单位列表", success, data);
      if (success) {
        this.receiveUnitList = data
          .filter((item) => {
            return item.corpLeaf !== 0;
          })
          .sort((a, b) => {
            return a.corpSort - b.corpSort;
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .current-row .el-link--inner {
  color: #fff;
}
</style>

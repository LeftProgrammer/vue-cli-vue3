<template>
  <div style="height: 100%">
    <table-layout>
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="图纸名称:" size="mini">
            <el-input v-model="query.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="图纸编号:" size="mini">
            <el-input v-model="query.code" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="专业:" size="mini">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="professionRef"
              v-model="query.profession"
              placeholder="请选择专业"
              clearable
            >
              <el-option
                v-for="item in designProfessionOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工程部位:" size="mini">
            <el-input v-model="query.pbs" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="交底状态:" size="mini">
            <!-- <el-select @visible-change="$visibleChange($event, 'el-popper')"
            ref="professionRef"
            v-model="query.profession"
            placeholder="请选择专业"
            clearable
          >
            <el-option
              v-for="item in designProfessionOptions"
              :key="item.id"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select> -->
          </el-form-item>

          <el-form-item label="变更状态:" size="mini">
            <!-- <el-select @visible-change="$visibleChange($event, 'el-popper')"
            ref="professionRef"
            v-model="query.profession"
            placeholder="请选择专业"
            clearable
          >
            <el-option
              v-for="item in designProfessionOptions"
              :key="item.id"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select> -->
          </el-form-item>

          <el-form-item size="mini">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="reset(true)"
            >
              清空
            </el-button>
          </el-form-item>
          <el-form-item size="mini">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getTableData(true)"
            >
              搜索
            </el-button>
          </el-form-item>
          <el-form-item size="mini">
            <el-button type="primary" @click="handelShowDialog(null, 'mine')"
              >新增</el-button
            >
          </el-form-item>
        </el-form>
      </template>
      <template slot="table">
        <el-table ref="multipleTable" :data="tableData" height="100%" border>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center"
          />
          <el-table-column label="图纸编号" prop="code" align="center" />
          <el-table-column
            label="图纸名称"
            prop="name"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="专业"
            prop="profession"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              <span>
                {{ getDictName(designProfessionOptions, row.profession) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="版本"
            prop="version"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            label="工程部位"
            prop="pbsCode"
            align="center"
            width="180"
          >
          </el-table-column>
          <el-table-column
            label="供图日期"
            prop="createDate"
            align="center"
            width="120"
          >
            <template slot-scope="{ row }">
              {{
                row.createDate ? timeFormat(row.createDate, "YYYY-MM-DD") : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="图纸发放状态"
            prop="drawingStatus"
            align="center"
          >
          </el-table-column>
          <el-table-column label="交底状态" prop="explainStatus" align="center">
          </el-table-column>
          <el-table-column label="变更状态" prop="changeStatus" align="center">
          </el-table-column>
          <el-table-column label="操作" prop="name" width="150" align="center">
            <template #default="{ row }">
              <el-link type="primary" @click="clickHandle(row)">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="pagination">
        <el-pagination
          :current-page="pageParams.current"
          :page-sizes="[10, 20, 50, 100, 1000, 2000]"
          :page-size="pageParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
    </table-layout>
    <design-drawing-form
      v-if="designDrawingVisible"
      :visible="designDrawingVisible"
      :row="formData"
      @closed="designDrawingVisible = false"
    ></design-drawing-form>
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import DesignDrawingForm from "./designDrawingForm.vue";
import { page } from "../api";
import { ListMixin } from "@/mixins/ListMixin";
export default {
  name: "design-center-ledger-designDrawing",
  mixins: [ListMixin],
  components: {
    TableLayout,
    DesignDrawingForm,
  },
  data() {
    return {
      /**查询条件 */
      query: {},
      /** 设计专业字典*/
      designProfessionCode: "DESIGN_PROFESSION",
      /**设计专业 */
      designProfessionOptions: [],
      /**列表数据 */
      tableData: [],
      /**设计图纸供应台账弹窗显示 */
      designDrawingVisible: false,
      //设计图纸数据
      formData: {},
    };
  },
  created() {
    this.getDictItemList(this.designProfessionCode);
  },
  methods: {
    /**获取专业 */
    getDictName(options, code) {
      if (options && options.length > 0) {
        let option = options.find((x) => x.dictCode === code);
        if (option) {
          return option.dictName;
        }
      }
      return "";
    },
    /**重置表格数据 */
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    //查看数据
    clickHandle(row) {
      console.log("clickHandle", row);
      this.designDrawingVisible = true;
      this.formData = row;
    },
    // 查询表格数据
    getTableData() {
      this.tableData = [];
      this.query.type = this.type;
      this.pageParams.entity = this.query;
      page(this.pageParams).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        }
      });
    },
    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designClassifyCode) {
        if (
          !this.designClassifyOptions ||
          this.designClassifyOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designClassifyOptions = items;
            callback && callback();
          });
        } else {
          callback && callback();
        }
      }

      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          this.getDictItems(code).then((items) => {
            this.designProfessionOptions = items;
          });
        } else {
        }
      }
    },
  },
  props: {
    /**供应类型1/2/3  设计图纸/设计报告/科研报告 */
    type: {
      type: String,
      default: "1",
    },
  },
};
</script>

<style></style>

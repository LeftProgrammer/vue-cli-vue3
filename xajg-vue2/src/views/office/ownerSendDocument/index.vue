<template>
  <div class="page-leave">
    <table-layout
      :page="pageParams"
      title="业主发文列表"
      @query="handleQuery"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="文件编号:" size="mini">
            <el-input
              v-model="query.code"
              placeholder="请输入编号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="标题:" size="mini">
            <el-input
              v-model="query.title"
              placeholder="请输入标题"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="文种:" size="mini">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              v-model="query.type"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in wzCodeOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="收文单位:" prop="type">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="query.unit" clearable>
              <el-option
                v-for="item in receiveUnitList"
                :label="item.corpName"
                :key="item.corpId"
                :value="item.corpId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="流程状态:" size="mini">
            <el-select @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              style="width: 100%"
              v-model="query.sendStatus"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in isSendOption"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发文日期:" size="mini">
            <el-date-picker
              clearable
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="拟稿部门:" prop="type">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="query.department" clearable>
              <el-option
                v-for="item in OwnUnitDepart"
                :label="item.departName"
                :key="item.departName"
                :value="item.departName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <el-button type="primary" @click="syncOa" :disabled="oaLoading">
          <i class="el-icon-refresh" :class="oaLoading ? 'oa-loading' : ''"></i>
          同步OA
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handelShowNewForm"
        >
          新增
        </el-button>
      </template>
      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            label="序号"
            type="index"
            :index="getIndex"
            :width="$calculateWidth(50)"
            align="center"
          />
          <el-table-column
            label="文件编号"
            prop="code"
            header-align="center"
            align="left"
            :width="$calculateWidth(240)"
            excel.handler="excelHandleCode"
            excel.sort="1"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getCode(row.code)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getCode(row.code) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="标题"
            prop="title"
            header-align="center"
            align="left"
            :min-width="$calculateWidth(240)"
            excel.sort="2"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="scope.row.title"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ scope.row.title }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="文种"
            prop="type"
            align="center"
            :width="$calculateWidth(80)"
            excel.dictType="wz"
            excel.sort="3"
          >
            <template slot-scope="scope">
              <el-tooltip
                :content="$DictionaryParsing(wzCodeOptions, scope.row.type)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ $DictionaryParsing(wzCodeOptions, scope.row.type) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            label="发文日期"
            prop="sendDate"
            align="center"
            :width="$calculateWidth(180)"
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
            excel.sort="4"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.createDate ? timeFormat(row.createDate) : ''"
                placement="top"
                effect="dark"
              >
                <div
                  class="text-ellipsis-clamp"
                  :title="row.createDate ? timeFormat(row.createDate) : ''"
                >
                  {{ row.createDate ? timeFormat(row.createDate) : "" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="拟稿部门"
            prop="department"
            align="center"
            :width="$calculateWidth(80)"
          ></el-table-column>
          <el-table-column
            label="收文单位"
            prop="sendUnits"
            align="center"
            :width="$calculateWidth(300)"
            excel.handler="excelHandleCovert"
            excel.args="unit"
            excel.sort="5"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getUnitName(row.sendUnits)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getUnitName(row.sendUnits) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="工程部位"
            prop="pbsCode"
            align="center"
            :width="$calculateWidth(200)"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
            excel.sort="6"
          >
            <template slot-scope="scope">
              <bim-show :pbsCode="scope.row.pbsCode"></bim-show>
            </template>
          </el-table-column>
          <el-table-column
            label="流程状态"
            prop="sendStatus"
            align="center"
            :width="$calculateWidth(100)"
            excel.readConverterExp="0=未提交,1=待签收,2=已完成"
            excel.sort="7"
          >
            <template slot-scope="{ row }">
              <span> {{ getStatus(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="收文状态"
            prop="signStatus"
            align="center"
            :width="$calculateWidth(100)"
            excel.readConverterExp="0=待签收,1=部分签收,2=已签收,3=已拒签,4=√已退回,5已完成"
            excel.sort="8"
          >
            <template slot-scope="{ row }">
              <!-- <span
                class="iconfont"
                :class="
                  row.sendStatus == 1 && row.signStatus == 2
                    ? 'icon-checked'
                    : ''
                "
              >

              </span> -->

              <span
                class="font-12"
                :style="{
                  color:
                    row.signStatus == 3 || row.signStatus == 4 ? 'red' : '',
                }"
                >{{ getSignStatus(row) }}</span
              >
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="{ row }">
              <div class="flex justify-center">
                <list-button
                  :editHandleText="'办理'"
                  :data="row"
                  @view="view"
                  @delete="deleteHandle"
                  @edit="edit"
                  :btns="['edit', 'delete', 'view']"
                  :disabledBtns="row.sendStatus === 2?['delete']:[]"
                ></list-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </table-layout>
    <dataForm ref="form" />
    <newForm ref="newForm" @submitOk="submitOk" class="indexForm" />
  </div>
</template>

<script>
import TableLayout from "@/components/ContentLayout/Table";
import { page, corporates, remove, syncOaData } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import enums from "@/config/enums";
import dataForm from "./dataForm.vue";
import newForm from "./newForm.vue";
import { getDepartmentsByUnit } from "@/views/office/SendDocument/api";
import bimShow from "@/components/Bim/Show";
export default {
  name: "design-center-ownerSendDoc",
  components: { TableLayout, dataForm, newForm, bimShow },
  computed: {
    exportParams() {
      const { documentType, unitType } = this.$route.meta;
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query,
          startDate: this.startTimeAndEndTime?.[0] || "",
          endDate: this.startTimeAndEndTime?.[1] || "",
          unitType,
          documentType,
        },
      };

      if (params?.entity?.code) {
        params.entity.code = this.retCode(params.entity.code);
        let stringWithoutSpaces = params.entity.code.replace(/\s/g, "");
        if (
          stringWithoutSpaces.charAt(stringWithoutSpaces.length - 1) == "号"
        ) {
          params.entity.code = stringWithoutSpaces.slice(0, -1);
        }
      }

      return params;
    },
  },
  data() {
    return {
      formData: {
        createDate: "",
      },
      startTimeAndEndTime: [],
      designProfessionOptions: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {},
      isSendOption: [
        {
          label: "未提交",
          value: 0,
        },
        {
          label: "待签收",
          value: 1,
        },
        {
          label: "已完成",
          value: 2,
        },
      ],
      wzCode: "wz", //文种
      wzCodeOptions: [],
      receiveUnitList: [], //收文单位
      OwnUnitDepart: [], //业主单位下的部门
      oaLoading: false,
    };
  },
  created() {
    this.getUnit();
    this.getDictItemList(this.designProfessionCode);
    this.getDictItemList(this.wzCode);
    this.getFlowStatus();
    this.getTableData();
  },

  methods: {
    async getOwnUnitDepart() {
      // console.log("从当前数据中过滤出业主单位", this.receiveUnitList);
      // 找出业主单位  从当前数据中过滤出业主单位
      let manergeUnit = this.receiveUnitList.find((x) => x.corpType == "yzdw");
      console.log("业主单位", manergeUnit);

      if (manergeUnit) {
        // 处理业主单位
        // 获取业主单位下的部门
        const { success, data } = await getDepartmentsByUnit(
          manergeUnit.corpId
        );
        if (success && data && Array.isArray(data)) {
          // 过滤掉配置文件的单位
          console.log("获取业主单位下的部门", data);
          this.OwnUnitDepart = data;
        }
      }
    },
    async syncOa() {
      this.oaLoading = true;
      let res = await syncOaData();
      console.log(res);
      this.oaLoading = false;
      this.$message.success("oa同步完成");
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/synthesis/oa/export";
      exportParams.filename = "业主发文";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
    },
    // 流程状态
    getStatus(row) {
      if (row.sendStatus == 2) {
        return "已完成";
      } else if (row.sendStatus == 0) {
        return "未提交";
      } else {
        return "流转中";
      }
    },
    getSignStatus(row) {
      // 一个住送单位 可以拒签  多单位不能拒签 只能是部分签收  和
      let status = row.signStatus;
      // 拒签的情况下  组合是 signStatus3   sendStatus 1
      let result = "";
      switch (status) {
        case 0:
          result = " 待签收";
          break;
        case 1:
          result = "部分签收";
          break;
        case 2:
          result = "已签收";
          break;
        case 3:
          result = "已拒签";
          break;
        case 4:
          result = "√已退回";
          break;
        case 5:
          result = "已签收";
          break;
        default:
          result = "";
          break;
      }
      return result;
    },
    getCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\|/, "-〔");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\|/, "〕-");

      return outputString + "\n" + "号";
    },
    //同步oa
    addDoc(row) {
      this.$refs.form.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.form.add(row);
      });
    },
    // 查看
    view(row) {
      console.log("view", row);
      this.$refs.newForm.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.newForm.edit({ ...row }, true);
      });
    },
    edit(row) {
      console.log("edit", row);
      this.$refs.newForm.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.newForm.edit({ ...row }, false);
      });
    },
    async deleteHandle(row) {
      try {
        console.log("deleteHandle", row);

        if (!row || !row.id) {
          throw new Error("Invalid data for deletion.");
        }

        const params = { id: row.id };
        const res = await remove(params);

        if (res.success) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getTableData();
        } else {
          throw new Error("Deletion failed. Server response: " + res.message);
        }
      } catch (error) {
        console.error("Error deleting data:", error.message);
        this.$message({
          message: "删除失败：" + error.message,
          type: "error",
        });
      }
    },
    // 新增 成功 回调
    submitOk() {
      this.reset();
    },
    // 新增 发文
    handelShowNewForm() {
      this.$refs.newForm.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.newForm.add();
      });
    },
    // 查询  分页需要为第一页
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
    },
    handleSizeChange(val) {
      console.log("aaa", val);
      this.pageParams = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log("aaa", val);
      this.pageParams = val;
      this.getTableData();
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
    async getUnit() {
      let res = await corporates();
      this.receiveUnitList = res.data
        .filter((item) => {
          return item.corpLeaf !== 0;
        })
        .sort((a, b) => {
          return a.corpSort - b.corpSort;
        });
      console.log("获取单位", this.receiveUnitList);
      await this.getOwnUnitDepart();
    },
    getTypeText(value) {
      let text = "*";
      let a = this.designProfessionOptions.find(
        (item) => item.dictCode == value
      );
      if (a) {
        text = a.dictName;
      }
      return text;
    },
    /**获取流程状态字典 */
    async getFlowStatus() {
      let data = [];
      let options = enums.FLOW_STATUS_ENUM;
      for (const key in options) {
        data.push({
          id: options[key].value,
          dictCode: options[key].value,
          dictName: options[key].name,
        });
      }
      this.flowStatusOptions = data;
      // console.log("flowStatusOptions", data);
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    retCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\-〔/, "|");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\〕-/, "|");

      return outputString;
    },
    // 查询表格数据
    async getTableData() {
      try {
        const { documentType, unitType } = this.$route.meta;
        let params = {
          ...this.pageParams,
          entity: {
            ...this.query,
            startDate: this.startTimeAndEndTime?.[0] || "",
            endDate: this.startTimeAndEndTime?.[1] || "",
            unitType,
            documentType,
          },
        };

        // 因为存在下的的code 是 | 所以需要转化成 -【】-
        if (params?.entity?.code) {
          params.entity.code = this.retCode(params.entity.code);
          // 判断最后一个字是不是 号 字  如果是 删除这个号字
          let stringWithoutSpaces = params.entity.code.replace(/\s/g, "");
          if (
            stringWithoutSpaces.charAt(stringWithoutSpaces.length - 1) == "号"
          ) {
            params.entity.code = stringWithoutSpaces.slice(0, -1);
          }
        }

        const res = await page(params);

        console.log("查询数据", res);
        const { success, data } = res;
        if (success) {
          this.tableData = data.records || [];
          this.pageParams.total = data.total || 0;
        } else {
          this.tableData = [];
          this.pageParams.total = 0;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error as needed
      }
    },

    /**获取字典 */
    getDictItemList(code, callback) {
      if (code === this.designProfessionCode) {
        if (
          !this.designProfessionOptions ||
          this.designProfessionOptions.length == 0
        ) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.designProfessionOptions = res.data;
            }
          });
        } else {
        }
      }
      if (code === this.wzCode) {
        if (!this.wzCodeOptions || this.wzCodeOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.wzCodeOptions = res.data;
            }
          });
        } else {
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;
}

/deep/ .el-range-editor--mini.el-input__inner {
  height: inherit !important;
}
/deep/ .el-date-editor .el-range-separator {
  line-height: 32px !important;
}

/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}

/deep/ .table-content .table .table-cnotent .el-table .el-table__body-wrapper {
  height: calc(100% - 54px) !important;
}

/* 定义一个旋转动画 */
@keyframes rotate-animation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 应用动画到图标元素 */
.oa-loading {
  animation: rotate-animation 1.5s linear infinite;
}
</style>

<template>
  <div class="page-leave">
    <treeTableLayout
      :page="pageParams"
      :title="title"
      :show-export-btn="true"
      @query="handleQuery"
      @reset="reset"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @initExportParams="initExportParams"
    >
      <template slot="opratebtns">
        <el-button type="primary" :disabled="oaLoading" @click="syncOa">
          <i class="el-icon-refresh" :class="oaLoading ? 'oa-loading' : ''" />
          同步OA
        </el-button>
      </template>
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="文件编号:" size="mini">
            <el-input
              v-model="query.code"
              placeholder="请输入编号"
              clearable
            />
          </el-form-item>
          <el-form-item label="标题:" size="mini">
            <el-input
              v-model="query.title"
              placeholder="请输入标题"
              clearable
            />
          </el-form-item>
          <el-form-item label="文种:" size="mini">
            <el-select
              ref="flowStateRef"
              v-model="query.type"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in wzCodeOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="已上报:" size="mini">
            <el-select
              ref="flowStateRef"
              v-model="query.sendStatus"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in sendOaOption"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="来文日期:" size="mini">
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            />
          </el-form-item>
          <el-form-item label="收文状态:" size="mini">
            <el-select
              v-model="query.signStatus"
              placeholder="请选择"
              clearable
              @visible-change="$visibleChange($event, 'el-popper')"
            >
              <el-option
                v-for="item in signStatusOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template slot="tree">
        <el-tree
          ref="tree"
          node-key="corpId"
          default-expand-all
          :data="treeData"
          :props="defaultProps"
          highlight-current
          :current-node-key="'1'"
          @node-click="handleNodeClick"
        />
      </template>
      <!-- v-if="flowInited || rows.length === 0" -->
      <template #table>
        <!-- v-if="flowInited" -->
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
            header-align="center"
            prop="code"
            align="left"
            :width="$calculateWidth(200)"
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
            header-align="center"
            prop="title"
            align="left"
            excel.sort="2"
            :min-width="$calculateWidth(250)"
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
            excel.dictType="wz"
            excel.sort="3"
            :width="$calculateWidth(80)"
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
            label="来文单位"
            prop="unit"
            align="center"
            excel.handler="excelHandleCovert"
            excel.args="unit"
            excel.sort="4"
            :width="$calculateWidth(200)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getUnitName(row.unit)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getUnitName(row.unit) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>

          <!-- <el-table-column
            label="来文部门"
            prop="department"
            align="center"
            width="auto"
            min-width="10%"
          >
          </el-table-column> -->
          <el-table-column
            label="来文日期"
            prop="createDate"
            align="center"
            sortable
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
            excel.sort="5"
            :width="$calculateWidth(110)"
          >
            <template slot-scope="{ row }">
              {{ row.createDate ? timeFormat(row.createDate) : "" }}
            </template>
          </el-table-column>
          <el-table-column
            label="工程部位"
            prop="pbsCode"
            align="center"
            :width="$calculateWidth(150)"
            excel.handler="excelHandleCovert"
            excel.args="pbs"
            excel.sort="6"
          >
            <template slot-scope="scope">
              <bim-show :pbs-code="scope.row.pbsCode" />
            </template>
          </el-table-column>
          <el-table-column
            label="收文状态"
            prop="signStatus"
            align="center"
            :width="$calculateWidth(80)"
            excel.readConverterExp="0=待签收,1=部分签收,2=已签收,3=已拒签,4=√已退回,5=已完成"
            excel.sort="7"
          >
            <template slot-scope="{ row }">
              <span
                class="iconfont"
                :class="
                  row.sendStatus == 1 && row.signStatus == 2
                    ? 'icon-checked'
                    : ''
                "
              >
                <span
                  class="font-12"
                  :style="{
                    color:
                      row.signStatus == 3 || row.signStatus == 4 ? 'red' : '',
                  }"
                >{{ getSignStatus(row) }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="已上报"
            prop="sendStatus"
            align="center"
            :width="$calculateWidth(80)"
            excel.readConverterExp="0=未上报,1=已上报,2=已退回"
            excel.sort="8"
          >
            <template slot-scope="{ row }">
              <span>{{
                row.sendStatus == 1
                  ? "已上报"
                  : row.sendStatus == 2
                    ? "已退回"
                    : "未上报"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="left" width="200">
            <template #default="{ row }">
              <div class="flex justify-center align-center">
                <template v-if="showEdit(row)">
                  <el-link type="primary" @click="reply(row)">回复</el-link>
                  <el-divider direction="vertical" />
                </template>
                <el-button type="text" @click="details(row, 'view')">查看</el-button>
                <template v-if="isSystem">
                  <el-divider direction="vertical" />
                  <el-link type="danger" plain @click="deleteHandle(row)">
                    管理员删除
                  </el-link>
                </template>
                <template v-if="!isSystem && !isMdgAdmin">
                  <el-button
                    :disabled="
                      row.signStatus == 3 ||
                        row.signStatus == 4 ||
                        row.signStatus == 5
                    "
                    type="text"
                    @click="details(row, 'edit')"
                  >办理</el-button>
                  <el-button
                    :disabled="
                      row.sendStatus == 1 || row.sending ? true : false
                    "
                    type="text"
                    @click="reportOa(row)"
                  ><i v-if="row.sending" class="el-icon-loading" />上报OA</el-button>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTableLayout>
    <components :is="componentsName" ref="dataform" @close="close" />
    <!-- <dataform ref="dataform" @close="close" /> -->
  </div>
</template>

<script>
import treeTableLayout from "@/components/ContentLayout/TreeTable";
import ReceiveForm from "@/views/office/ownerReceiveDocument/dataform.vue";
import sendForm from "@/views/office/ownerSendDocument/newForm.vue";
import { page, unitList, remove, syncOaData, reportOasw } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import bimShow from "@/components/Bim/Show";
import { ListMixin } from "@/mixins/ListMixin";
export default {
  components: { treeTableLayout, bimShow, ReceiveForm, sendForm },
  mixins: [ListMixin],
  data() {
    return {
      componentsName: "ReceiveForm",
      formData: {
        createDate: "",
      },
      dialogShow: false,
      startTimeAndEndTime: [],
      designProfessionOptions: [],
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {},
      treeData: [],
      defaultProps: {
        children: "children",
        label: "corpName",
      },
      unitOptions: [],
      wzCode: "wz",
      wzCodeOptions: [],
      title: "",
      signStatusOptions: [
        {
          label: "待签收",
          value: 0,
        },
        {
          label: "部分签收",
          value: 1,
        },
        {
          label: "已签收",
          value: 2,
        },
        {
          label: "已拒签",
          value: 3,
        },
        {
          label: "已退回",
          value: 4,
        },
        {
          label: "已完成",
          value: 5,
        },
      ],
      sendOaOption: [
        {
          label: "未上报",
          value: 0,
        },
        {
          label: "已上报",
          value: 1,
        },
        {
          label: "已退回",
          value: 2,
        },
      ],
      oaLoading: false,
    };
  },
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
      return params;
    },
  },
  created() {
    console.log("获取配置信息", this.$route);
    const { title } = this.$route.meta;
    this.title = title;
    this.getUnitList();
    this.getDictItemList(this.designProfessionCode);
    this.getDictItemList(this.wzCode);
  },

  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    async reply(row) {
      // 存下当前的发文的id
      this.$setStorage("reply", {
        id: row.id,
        name: row.title,
      });
      this.componentsName = "sendForm";
      this.$nextTick(() => {
        this.$refs.dataform.dialogShow = true;
        this.$refs.dataform.add();
      });
    },
    showEdit(row) {
      // 如果角色包含管理员 就不能回复
      let role = this.$getStorage("userInfo").roles;
      console.log("role", role);
      if (role && role.includes("manager:system")) {
        return false;
      }
      let bool = false;
      if (row.signStatus == 2 || row.signStatus == 5) {
        bool = true;
      } else {
        bool = false;
      }
      return bool;
    },
    async syncOa() {
      this.oaLoading = true;
      let res = await syncOaData();
      console.log(res);
      this.oaLoading = false;
      this.$message.success("oa同步完成");
    },
    async reportOa(row) {
      console.log("上报OA", row);
      let rowData = this.tableData.find((item) => item.id === row.id);
      this.$set(rowData, "sending", true);
      let res = await reportOasw(row);
      console.log(res);
      this.$set(rowData, "sending", false);
      this.$message.success("上报OA完成");
      this.getTableData();
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/synthesis/manage/export";
      exportParams.filename = this.title;
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    close() {
      this.getUnitList();
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
          result = "待签收";
          break;
      }
      return result;
    },
    deleteHandle(row) {
      this.$confirm("确认删除吗?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          remove({
            id: row.id,
          }).then((res) => {
            if (!res.success) {
              return this.$message.error("删除失败：" + res.message);
            }
            this.$message.success("删除成功");
            this.getTableData();
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
    },
    // 根据单位id 获取名称
    getUnitName(unitIds) {
      if (!unitIds) return;
      let arr = unitIds.split(",");
      let names = [];
      this.unitOptions.forEach((x) => {
        if (arr.includes(x.corpId)) {
          names.push(x.corpName);
        }
      });
      return names.join(",") || unitIds;
    },
    getCode(code) {
      // 匹配第一个| 替换成 【  第二个替换成 】

      // 匹配第一个｜并替换为-【
      let outputString = code.replace(/\|/, "-〔");

      // 匹配第二个｜并替换为】-
      outputString = outputString.replace(/\|/, "〕-");

      return outputString + "\n" + "号";
    },
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = "";
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
    details(row, type) {
      console.log("details", row);
      this.$refs.dataform.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.dataform.formDisabled = true;
        this.$refs.dataform.formPageType = type;
        this.$refs.dataform.getFormData({ ...row });
      });
    },
    arrayToTree(arr, idProp, parentIdProp) {
      const map = {};
      const result = [];

      arr.forEach((item) => {
        map[item[idProp]] = { ...item, children: [] };
      });

      arr.forEach((item) => {
        if (item[parentIdProp] && map[item[parentIdProp]]) {
          map[item[parentIdProp]].children.push(map[item[idProp]]);
        } else {
          result.push(map[item[idProp]]);
        }
      });

      return result;
    },
    async getUnitList() {
      const { data, success } = await unitList();
      console.log("单位列表", success, data);
      if (success) {
        this.unitOptions = data.filter((item) => {
          return item.corpLeaf !== 0;
        });
        let { corpId } = this.$getStorage("userInfo");
        let filterData = data.filter((item) => item.corpId != corpId);
        filterData = filterData.sort((a, b) => {
          return a.corpSort - b.corpSort;
        });
        this.treeData = this.arrayToTree(filterData, "corpId", "corpPid");
        this.query.unit = "";
        this.flowName = "";
        this.getTableData();
        this.flowName = "施工单位收文流程";
      }
    },
    handleNodeClick(data) {
      console.log("点击树节点", data);
      if (data.corpPid == "0") {
        this.query.unit = "";
      } else {
        this.query.unit = data.corpId;
      }

      this.getTableData();
      // this.getFlow("施工单位收文流程");
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
    getTableData() {
      this.tableData = [];

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
      page(params).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
        } else {
          this.tableData = [];
          this.pageParams.total = 0;
        }
      });
    },

    edit(row, page, task) {
      this.$setStorage("design_row", row);
      this.handelShowDialog(row, page, task);
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
        }
      }
      if (code === this.wzCode) {
        if (!this.wzCodeOptions || this.wzCodeOptions.length == 0) {
          getDictItemList(code).then((res) => {
            if (res.success) {
              this.wzCodeOptions = res.data;
            }
          });
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
/deep/ .el-dialog__wrapper {
  // overflow: hidden;
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
/deep/ button.el-button.el-button--medium {
  // background-color: #0096ff;
  min-width: auto;
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

<template>
  <div class="page-leave">
    <treeTableLayout
      :page="pageParams"
      :title="title"
      @query="getTableData"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @reset="reset"
      :showExportBtn="showExportBtn"
      @initExportParams="initExportParams"
    >
      <template slot="opratebtns"><span></span></template>
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
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
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
          <!-- v-if="showFlowStatus" -->
          <el-form-item label="流程状态:" size="mini">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              ref="flowStateRef"
              style="width: 100%"
              v-model="query.flowStatus"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in flowStatusOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.dictCode"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="来文日期:" size="mini">
            <el-date-picker
              v-model="startTimeAndEndTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 230px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收文状态:" size="mini">
            <el-select
              @visible-change="$visibleChange($event, 'el-popper')"
              v-model="query.signStatus"
              placeholder="请选择"
              clearable
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
      <!-- <template slot="opratebtns"> </template> -->
      <template slot="tree"
        ><el-tree
          default-expand-all
          ref="tree"
          node-key="corpId"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          highlight-current
          :current-node-key="'1'"
        ></el-tree>
      </template>

      <template slot="table">
        <!-- v-if="flowInited" -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          :row-key="(row) => row.id"
          @select="handleRowClick"
          @select-all="selectAll"
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            v-if="showChoose"
            type="selection"
            :width="$calculateWidth(60)"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            v-else
            label="序号"
            type="index"
            :width="$calculateWidth(60)"
            align="center"
            :index="getIndex"
          />
          <el-table-column
            label="文件编号"
            header-align="center"
            prop="code"
            align="left"
            excel.handler="excelHandleCode"
            excel.sort="1"
            :width="$calculateWidth(150)"
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
            :min-width="$calculateWidth(140)"
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
            :width="$calculateWidth(170)"
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
            width="100"
            prop="department"
            align="center"
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
            :width="$calculateWidth(120)"
            prop="pbsCode"
            align="center"
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
            prop="flowStatus"
            align="center"
            :width="$calculateWidth(80)"
            excel.readConverterExp="0=未提交,1=流转中,2=已完成,3=流转中"
            excel.sort="7"
          >
            <template slot-scope="scope">
              <flow-status :row="scope.row" :flowName="flowName"></flow-status>
            </template>
          </el-table-column>
          <el-table-column
            label="流程完成时间"
            prop="updateDate"
            align="center"
            excel.dateFormat="yyyy-MM-dd HH:mm:ss"
            excel.sort="8"
            :width="$calculateWidth(120)"
          >
            <template slot-scope="{ row }">
              {{
                row.flowStatus == 2
                  ? timeFormat(row.updateDate, "YYYY-MM-DD")
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="收文状态"
            prop="signStatus"
            align="center"
            :width="$calculateWidth(80)"
            excel.readConverterExp="0=待签收,1=部分签收,2=已签收,3=已拒签,4=√已退回,5=已签收"
            excel.sort="9"
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
                  >{{ getSignStatus(row) }}</span
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showNode"
            label="当前节点"
            prop="flowName"
            align="center"
            :width="$calculateWidth(180)"
            excel.sort="10"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.flowName" placement="top" effect="dark">
                <span class="text-ellipsis-clamp">
                  {{ row.flowName }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            v-if="showOperate"
            label="操作"
            align="center"
            width="200"
          >
            <template #default="{ row }">
              <div>
                <flow-button
                  :btns="['view', 'deal', 'press']"
                  :row="row"
                  :flowName="flowName"
                  @click="handelShowDialog"
                  @delete="deletedata"
                  ><template slot="button" v-if="showEdit(row)">
                    <el-link type="primary" @click="reply(row)">回复</el-link>
                    <el-divider direction="vertical"></el-divider>
                  </template>
                </flow-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </treeTableLayout>
    <flow-dialog
      :visible="flowShow"
      :flowInfo="flowInfo"
      @childEvt="childEvtHandle"
      @closed="flowShow = false"
    ></flow-dialog>
  </div>
</template>

<script>
import treeTableLayout from "@/components/ContentLayout/TreeTable";
import { page, unitList, sign, del } from "./api";
import { getDictItemList } from "@/api/dict";
import { dateFormat } from "@/utils";
import enums from "@/config/enums";
import { FlowListMixin } from "@/mixins/FlowListMixin";
import bimShow from "@/components/Bim/Show";
export default {
  components: { treeTableLayout, bimShow },
  mixins: [FlowListMixin],
  props: {
    unityTitle: {
      type: String,
      default: "",
    },
    // 关联收发文会用到
    documentType: {
      default: 1,
      type: Number,
    },
    // 是否可以选择
    showChoose: {
      type: Boolean,
      default: false,
    },
    // 是否展示节点
    showNode: {
      type: Boolean,
      default: true,
    },
    // 是否展示操作
    showOperate: {
      type: Boolean,
      default: true,
    },
    // 是否展示流程状态
    showFlowStatus: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否展示导出按钮
     */
    showExportBtn: {
      type: Boolean,
      default: true,
    },
    selectedRowIds: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      flowStatusOptions: [],
      startTimeAndEndTime: [],
      designProfessionOptions: [],
      pageParams: {
        size: 20,
        current: 1,
        total: 0,
      },
      tableData: [],
      query: {},
      formData: {
        createDate: "",
      },
      flowShow: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "corpName",
      },
      unitOptions: [],
      wzCode: "wz",
      wzCodeOptions: [],
      title: "",
      currentRow: [],
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
    };
  },
  watch: {
    unityTitle: {
      handler(newValue) {
        if (newValue) {
          this.title = newValue;
        }
      },
      deep: true,
      immediate: true,
    },
    title: {
      handler() {
        if (this.unityTitle) {
          this.title = this.unityTitle;
        }
      },
    },
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
  mounted() {
    // 做签收监听
    window.addEventListener( 'message', this.signListener, false);
  },
  destroyed() {
    window.removeEventListener('message', this.signListener, false, null);
  },
  methods: {
    signListener(event){
      // 处理接收到的消息
      if (Object.prototype.hasOwnProperty.call(event.data, "flowShow")) {
        console.log("处理接收到的消息", event.data);
        this.flowShow = event.data.flowShow;
        this.getUnitList();
      }
    },
    // 回复
    async reply(row) {
      // pathForFlowInfo
      let Object = {
        // let unitType  监理 设计 施工 业主 第三方  type 1 2 3 4 5
        1: "/office/supervisionSendDoc",
        2: "/office/designSendDoc",
        3: "/office/constructionSendDoc",
        4: "/office/ownerSendDoc",
        5: "/office/thirdPartySendDoc",
      };
      // 业主单位单独处理
      await this.getFlowData(Object[row.unitType]);
      // 存下当前的发文的id
      this.$setStorage("reply", {
        id: row.id,
        name: row.title,
      });
      this.$nextTick(() => {
        this.handelShowDialog(null, "mine");
      });
    },
    showEdit(row) {
      let role = this.$getStorage("userInfo").roles;
      console.log("role", role);
      if (role && role.includes("manager:system")) {
        return false;
      }
      // 流程节点到自己的代办能办理  或者 自己创建的待发能办理
      let bool = false;
      if (row.signStatus == 2 || row.signStatus == 5) {
        bool = true;
      } else {
        bool = false;
      }
      return bool;
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
    //表格序号
    getIndex(index) {
      let curpage = this.pageParams.current; //单前页码，具体看组件取值
      let limitpage = this.pageParams.pageSize; //每页条数，具体是组件取值
      return index + 1 + (curpage - 1) * limitpage;
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
    selectAll(val) {
      if (val.length !== 0) {
        val.forEach(x => {
          if (this.currentRow.findIndex(x1 => x1.id === x.id) === -1) {
            this.currentRow.push(x);
          }
        });
      } else {
        this.tableData.forEach(x => {
          let index = this.currentRow.findIndex(x1 => x1.id === x.id);
          if (index > -1) {
            this.currentRow.splice(index, 1);
          }
        })
      }
      console.log(this.currentRow)
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
    setSign(row) {
      this.$confirm("确认签收吗?", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.$emit("click", this.row, this.status, this.task);
          const { documentType } = this.$route.meta;
          let params = {
            id: row.id,
            code: row.code,
            documentType: documentType,
          };
          sign(params).then((res) => {
            if (res.success) {
              this.$message.success("签收成功");
              this.getTableData();
            } else {
              this.$message.error("签收失败");
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
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
    // 选中当前行
    handleRowClick(row) {
      this.tableData.forEach(x=>{
        let rowIndex = row.findIndex(x1=>x1.id===x.id);
        let currentIndex = this.currentRow.findIndex(x2=>x2.id===x.id);
        if(rowIndex>-1){
          if(currentIndex===-1){
            this.currentRow.push(x);
          }
        }else{
          if(currentIndex>-1){
            this.currentRow.splice(currentIndex, 1);
          }
        }
      })
      console.log("选中行", this.currentRow);
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
    },

    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    reset() {
      this.query = {};
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.startTimeAndEndTime = [];
      this.getTableData();
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
      //此列表可能作为设计单位单位
      let documentType = this.$route.meta.documentType || 1;
      let unitType = this.$route.meta?.unitType || 2;
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

      if (this.documentType) {
        params.entity.documentType = this.documentType;
      }
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
      // 如果是可以选  说明是当成组件   这时候 需要已完成的数据 (发文 关联收文)
      // if (this.showChoose) {
      //   params.entity.flowStatus = 2;
      // }
      page(params).then((res) => {
        if (res.success) {
          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;
          this.setTableRowSelection();
        } else {
          this.tableData = [];
          this.pageParams.total = 0;
        }
      });
    },
    setTableRowSelection() {
      this.$nextTick(()=>{
        console.log("setTableRowSelection",this.selectedRowIds,this.tableData)
        if (this.selectedRowIds) {
          this.tableData.forEach(row => {
            console.log(this.selectedRowIds.indexOf(row.id))
            if (this.selectedRowIds.indexOf(row.id) > -1) {
              this.$refs.multipleTable.toggleRowSelection(row,true);
            }else{
              this.$refs.multipleTable.toggleRowSelection(row,false);
            }
          })
        }
      })

    },
    deletedata(row) {
      console.log("----------", row.id);
      if (
        row.createUser == this.$getStorage("userInfo").userId ||
        this.isSystem
      ) {
        del({ id: row.id }).then((res) => {
          if (!res.success) {
            return this.$message.error("删除失败：" + res.message);
          }
          this.$message.success("删除成功");
          this.getTableData();
        });
        // remove(params).then((res) => {
        //   if (!res.success) {
        //     return this.$message.error("删除失败：" + res.message);
        //   }
        //   this.$message.success("删除成功");
        // });
      } else {
        this.$message.error("您没有删除权限");
      }
    },
    /**获取字典 */
    getDictItemList(code) {
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
</style>

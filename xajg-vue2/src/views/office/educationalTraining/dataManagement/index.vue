<template>
  <div class="page-list">
    <treeTableLayout
      :page="pageParams"
      @pageSizeChange="handleSizeChange"
      @pageCurrentChange="handleCurrentChange"
      @query="handleQuery"
      @reset="reset"
      title="文件列表"
      :showExportBtn="true"
      @initExportParams="initExportParams"
    >
      <template slot="form">
        <el-form :model="query" :inline="true">
          <el-form-item label="资料名称:" class="ml-20">
            <el-input
              v-model="query.name"
              placeholder="请输入内容"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="类型:" prop="type" class="ml-20">
            <el-select @visible-change="$visibleChange($event, 'el-popper')" v-model="query.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in DitSpeciality"
                :key="item.dictId"
                :label="item.dictName"
                :value="item.dictId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传日期:" class="ml-20">
            <el-date-picker
              v-model="date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
      <template slot="opratebtns">
        <i
          class="el-icon-s-unfold fz-32"
          :class="[acitve == 1 ? 'active' : '']"
          @click="acitve = 1"
        ></i>
        <i
          class="el-icon-menu fz-32"
          :class="[acitve == 2 ? 'active' : '']"
          @click="acitve = 2"
        ></i>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="addHandle(), (type = 'add')"
        >
          新增
        </el-button>
      </template>
      <template slot="tree">
        <el-tree
          :data="typeOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          ref="tree"
          node-key="corpId"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        />
      </template>

      <template slot="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          border
          v-if="acitve == 1"
          @header-dragend="handleHeaderDragEnd"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            :index="getIndex"
            :width="$calculateWidth(50)"
          />
          <el-table-column
            label="资料名称"
            align="center"
            prop="name"
            :min-width="$calculateWidth(350)"
          >
            <template slot-scope="{ row }">
              <el-tooltip :content="row.name" placement="top" effect="dark">
                <div
                  class="text-ellipsis-clamp text-0096 pointer"
                  @click="downLoad(row)"
                >
                  {{ row.name }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            align="center"
            prop="type"
            :width="$calculateWidth(200)"
            excel.dictType="pxzllx"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.type ? getTypes(row.type) : ''"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ row.type ? getTypes(row.type) : "" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="上传人"
            align="center"
            prop="createUsername"
            :width="$calculateWidth(100)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="row.createUsername"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">{{ row.createUsername }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="上传单位"
            align="center"
            prop="unitId"
            excel.handler="excelHandleCovert"
            excel.args="unit"
            :width="$calculateWidth(300)"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                :content="getUnitNameById(row.unitId)"
                placement="top"
                effect="dark"
              >
                <div class="text-ellipsis-clamp">
                  {{ getUnitNameById(row.unitId) }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="上传日期"
            align="center"
            prop="upDate"
            excel.dateFormat="yyyy-MM-dd"
            :width="$calculateWidth(200)"
          >
            <template slot-scope="{ row }">
              {{ row.upDate ? timeFormat(row.upDate, "YYYY-MM-DD") : "" }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template #default="{ row }">
              <list-button
                :data="row"
                @delete="deleteHandle"
                @view="view"
                @edit="edit"
              ></list-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="card-box" type="flex" v-if="acitve == 2">
          <el-col
            style="flex: 0 0 calc((100% - 50px) / 5)"
            v-for="o in tableData"
            :key="o.id"
          >
            <el-card :body-style="{ padding: '0px' }">
              <div style="background-color: #d9e7f4">
                <img
                  :src="
                    o.coverUrl
                      ? getMinioUrl(o.coverUrl)
                      : require('@/assets/img/system/noImage.png')
                  "
                  class="image"
                  @click="handlePriview(o.uploadFile)"
                />
              </div>
              <div style="padding: 14px" class="card-content">
                <div class="card-name">{{ o.name }}</div>
                <div>类型： {{ o.type ? getTypes(o.type) : "" }}</div>
                <div>
                  上传时间：
                  {{
                    o.createDate ? timeFormat(o.createDate, "YYYY-MM-DD") : ""
                  }}
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </treeTableLayout>
    <dataform
      :treeNode="treeNode"
      :type="type"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="oprateRow.dialogShow = false"
      @ok="getTableData"
    >
    </dataform>
    <el-dialog :visible.sync="imgShow" width="540px" v-draggable>
      <div style="width: 500px; height: 500px" class="flex justify-center">
        <img width="100%" height="100%" :src="imgUrl" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, remove, BelongTo, page, list, unitList } from "./api";
import { getCorporatesTree, getDictItemList, buildTree } from "@/api/dict";
import enums from "@/config/enums";
import { dateFormat } from "@/utils";
import { ListMixin } from "@/mixins/ListMixin";
import TreeTableLayout from "@/components/ContentLayout/TreeTable";
import ListButton from "@/components/ListButton";
import dataform from "./dataform";
import {
  ntkoFilePreview as ntkoPreview,
  getNtkoInstalled,
  getNtkoVersion,
  getMinioUrl,
  getNtkoSignParams,
  getNtkoExe,
} from "@/utils/ntko";
export default {
  name: "monitoring-point",
  mixins: [ListMixin],
  components: {
    TreeTableLayout,
    ListButton,
    dataform,
  },
  data() {
    return {
      baseUrl: "",
      acitve: 1,
      imgShow: false,
      imgUrl: "",
      treeNode: {}, //点击树节点传递给子组件使用
      type: "",
      title: "培训资料列表",
      DitSpeciality: [],
      defaultProps: {
        children: "children",
        label: "corpName",
      },
      pageParams: {
        pageSize: 20,
        current: 1,
        total: 0,
      },
      oprateRow: {},
      options: [],
      tableData: [],
      query: {
        unitId: null,
      },
      dictList: [],
      readonly: false,
      date: [],
      /**组织机构选择 */
      deptShow: false,
      typeDictMap: [],
      typeOptions: [],
      departmentsList: [],
      url: { list: "" },
      //第一次进入页面
      once: true,
      userId: "",
      corpId: "",
      belongUnit: [],
      excludeOptionNames: [],
    };
  },
  computed: {
    exportParams() {
      if (this.date && this.date.length > 0) {
        this.query.startDate = this.date[0] + " 00:00:00";
        this.query.endDate = this.date[1] + " 23:59:59";
      }
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      return params;
    },
  },
  created() {
    this.getUnitList();
    this.baseUrl = window.location.origin;
    this.getTypeDictMap();
    this.getJCXM();
    this.userId = this.$getStorage("userInfo").userId;
    // this.corpId = this.$getStorage("userInfo").corpId;
    // 获取用户归属单位
    this.getBelongTo();
    this.getTableData();
    this.getDepartmentsList();
  },
  methods: {
    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    /**初始化导出Excel参数 */
    initExportParams(exportParams) {
      exportParams.url = "/api/synthesis/profile-manage/export";
      exportParams.filename = "培训资料";
      exportParams.params = this.exportParams;
      exportParams.params.entity.columns = exportParams.columns;
    },
    handleHeaderDragEnd() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    isMyUnit(row) {
      // 判断当前的数据的创建人是不是在登录人的归属单位
      // debugger
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

    // url  替换成mino
    getMinioUrl(url) {
      if (!url) {
        return "";
      }
      return getMinioUrl(url);
    },
    // 获取所有的单位
    async getUnitList() {
      const { data, success } = await unitList();
      if (!success) {
        this.$message.error("获取单位失败");
        return;
      }
      this.unitList = data.filter((item) => {
        return item.corpLeaf !== 0;
      });
      console.log("请求 单位 ", this.unitList);
    },
    getUnitNameById(unitId) {
      let item = this.unitList?.find((item) => item.corpId == unitId) || "";
      return item ? item.corpName : "";
    },
    // 文件预览
    handlePriview(a) {
      let file = JSON.parse(a)[0];
      this.$previewFileById(file);
    },

    getDepartmentsList() {
      list().then((res) => {
        if (res.success) {
          this.departmentsList = res.data;
        }
      });
    },
    /* 获取字典 */
    async getTypeDictMap() {
      const { data } = await getCorporatesTree();
      let sortData = data;
      if (data && Array.isArray(data) && data.length > 0) {
        data[0].children?.sort((a, b) => {
          return a.corpSort - b.corpSort;
        }) || [];
      }
      //获取字典
      this.excludeOptionNames = [];
      const gldwmc = await getDictItemList("gldwmc");
      for (let i = 0; i < gldwmc.data.length; i++) {
        this.excludeOptionNames.push(gldwmc.data[i].dictName);
      }
      sortData[0].children = sortData[0].children.filter(item => !this.excludeOptionNames.includes(item.corpName));
      this.typeDictMap = sortData;
      this.typeOptions = sortData;
    },
    getTypeDictName(id) {
      for (let item of this.typeDictMap) {
        if (item.dictId === id) {
          return item.dictName;
        }
      }
    },
    getTypes(val) {
      let name = "";
      this.DitSpeciality.forEach((element, index) => {
        if (val == element.dictId) {
          name = element.dictName;
        }
      });
      //
      return name;
    },
    getTypes1(val) {
      let name = "";
      this.departmentsList.forEach((element, index) => {
        if (val == element.departId) {
          name = element.departName;
        }
      });
      return name;
    },
    downLoad(row) {
      console.log("rowddd", row);

      try {
        const files = JSON.parse(row.uploadFile);

        if (Array.isArray(files) && files.length > 0) {
          const firstFile = files[0];
          this.$previewFileById(firstFile);
        } else {
          console.warn("No files available for preview.");
        }
      } catch (error) {
        console.error("Error parsing uploadFile JSON:", error);
        // 处理 JSON 解析错误
      }
    },
    edit(row) {
      this.type = "edit";
      this.title = "编辑-培训资料";
    },
    view(row) {
      this.type = "view";
      this.title = "查看-培训资料";
    },
    /**获取字典 */
    async getJCXM() {
      const { data } = await getDictItemList("pxzllx");
      this.DitSpeciality = data;
      console.log("flowStatusOptions", data);
    },
    reset() {
      this.query = {
        unitId: this.treeNode.corpId || "",
      };
      this.date = [];
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.getTableData();
    },
    // 查询表格数据
    getTableData() {
      // if (this.query.unitId == null || this.query.unitId.length < 5) {
      //   this.$message.warning("请选择左侧单位");
      //   return;
      // }
      // debugger
      // if (this.once) return;
      if (this.date && this.date.length > 0) {
        this.query.startDate = this.date[0] + " 00:00:00";
        this.query.endDate = this.date[1] + " 23:59:59";
      }
      this.pageParams.entity = this.query;
      const params = JSON.parse(JSON.stringify(this.pageParams));
      page(params).then((data) => {
        console.log("获取page数据", data);
        this.tableData = data?.data?.records?.map((item) => {
          if (item.coverImg && JSON.parse(item.coverImg).length > 0) {
            item.coverUrl = JSON.parse(item.coverImg)[0].url;
          }
          return item;
        });
        this.pageParams.total = data.data.total;
      });
    },
    // 节点单击事件
    handleNodeClick(node) {
      this.once = false;
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.treeNode = node;
      this.query = {
        unitId: node.corpId,
      };
      this.getTableData();
    },
    /**新增 */
    addHandle() {
      this.title = "新增-培训资料";
      // if (this.query.unitId == null) {
      //   this.$message.warning("请选择左侧单位");
      //   return;
      // }
      this.oprateRow.data = null;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
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

    handleSizeChange(val) {
      this.pageParams = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams = val;
      this.getTableData();
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
  //width: 60%;
}

/deep/.splitter-paneR {
  background-color: #fff;
  overflow: hidden;
}

/deep/.el-range-editor--small .el-range-input {
  font-size: 12px;
}

/deep/.table-btns {
  display: flex;
  align-items: center;

  .fz-32 {
    font-size: 32px;
    margin-right: 12px;
    cursor: pointer;
    transition: all ease 0.5s;
  }

  .fz-32:hover {
    color: #409eff;
  }

  .active {
    color: #409eff;
  }
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

.card-box {
  padding-right: 0px;
  flex-wrap: wrap;

  .el-col {
    margin-bottom: 10px;
    margin-right: 10px;

    .el-card__body {
      .image {
        width: 100%;
        height: 180px;
        display: block;
      }

      .card-content {
        width: 100%;
        display: grid;

        .card-name {
          width: 100%;
          font-weight: bold;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        > div {
          padding-bottom: 6px;
          margin-bottom: 8px;
          border-bottom: 1px solid #b3b3b3;
        }
      }
    }
  }
}
</style>
<style scoped lang="scss">
/deep/.el-range-editor--medium .el-range-input {
  font-size: 12px;
}
</style>

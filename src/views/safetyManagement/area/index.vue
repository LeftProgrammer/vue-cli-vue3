<template>
  <div class="page-list">
    <el-row :gutter="12">
      <el-col :span="12">
        <TableLayout
          :page="pageParams"
          @pageSizeChange="handleSizeChange"
          @pageCurrentChange="handleCurrentChange"
          @query="getTableData"
          title="危险区域维护"
          @reset="reset"
        >
          <template #form>
            <el-form :model="pageParams.entity" :inline="true">
              <el-form-item label="危险类别:">
                <el-select
                  v-model="pageParams.entity.type"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option label="低风险区域" value="1"> </el-option>
                  <el-option label="一般危险区域" value="2"> </el-option>
                  <el-option label="较大风险区域" value="3"> </el-option>
                  <el-option label="重大风险区域" value="4"> </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
          <template #opratebtns>
            <el-button type="primary" @click="addHandle()">新增</el-button>
          </template>
          <template #table="{ getIndex }">
            <el-table ref="multipleTable" :data="tableData" border>
              <el-table-column
                label="序号"
                type="index"
                :index="getIndex"
                width="50"
                align="center"
              />
              <el-table-column
                label="危险区域"
                align="left"
                header-align="center"
                prop="area"
              >
                <template #default="{ row }">
                  <el-link
                    type="primary"
                    :underline="false"
                    @click="view(row)"
                    >{{ row.name }}</el-link
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="危险类别"
                align="center"
                width="150"
                prop="type"
              >
                <template #default="{ row }">
                  <el-tag :color="getTypeColor(row.type)" effect="dark">
                    {{ row.type ? getTypeName(row.type) : "" }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="是否启用"
                align="center"
                width="120"
                prop="type"
              >
                <template #default="{ row }">
                  <el-switch
                    :model-value="row.enable == 1"
                    active-color="#014ACB"
                    inactive-color="#F53F3F"
                    @change="(val) => enableChange(row, val)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template #default="{ row }">
                  <ListButton
                    :data="row"
                    :btns="[
                      {
                        title: '编辑',
                        method: 'edit'
                      },
                      {
                        title: '删除',
                        method: 'delete'
                      },
                      {
                        title: '查看区域',
                        method: 'viewPoint'
                      }
                    ]"
                    @delete="deleteHandle"
                    @edit="edit"
                    @viewPoint="viewPoint"
                  ></ListButton>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </TableLayout>
      </el-col>
      <el-col :span="12">
        <BimEngine ref="bimDom" />
      </el-col>
    </el-row>

    <DataForm
      v-if="oprateRow.dialogShow"
      :title="title"
      :visible="oprateRow.dialogShow"
      :data="oprateRow"
      :readonly="oprateRow.isView"
      @sureson="sureson"
    ></DataForm>
  </div>
</template>

<script>
import { remove, page, update } from "./api";
import { ListMixin } from "@/mixins/ListMixin";
import TableLayout from "@/components/ContentLayout/TreeTable/index.vue";
import ListButton from "@/components/ListButton/index.vue";
import DataForm from "./dataform.vue";
import BimEngine from "@/components/BimEngine/index.vue";

export default {
  name: "SafeArea",
  components: {
    TableLayout,
    ListButton,
    DataForm,
    BimEngine,
  },
  mixins: [ListMixin],
  data() {
    return {
      title: "",
      type: "",
      prevId: "",
    };
  },
  computed: {
    exportParams() {
      let params = {
        ...this.pageParams,
        entity: {
          ...(this.pageParams.entity || {}),
        },
      };
      return params;
    },
  },
  created() {},
  mounted() {
    this.$nextTick(async () => {
      try {
        // 清理可能存在的无效 sessionStorage 数据
        const secretKey = sessionStorage.getItem("BIM_SECRETKEY");
        if (secretKey === 'null' || secretKey === 'undefined' || secretKey === '') {
          sessionStorage.removeItem("BIM_SECRETKEY");
        }
        
        if (this.$refs.bimDom && this.$refs.bimDom.InitEngine) {
          await this.$refs.bimDom.InitEngine();
        }
      } catch (e) {
        console.error('BIM引擎初始化失败:', e);
        
        // 如果是 JSON 解析错误，清理 sessionStorage 后重试
        if (e.message && e.message.includes('JSON')) {
          console.log('检测到 JSON 解析错误，清理缓存后重试...');
          sessionStorage.removeItem("BIM_SECRETKEY");
          
          setTimeout(async () => {
            try {
              if (this.$refs.bimDom && this.$refs.bimDom.InitEngine) {
                await this.$refs.bimDom.InitEngine();
              }
            } catch (retryError) {
              console.error('BIM引擎重试失败:', retryError);
              this.$message && this.$message.error('BIM 引擎初始化失败，请刷新页面重试');
            }
          }, 1000);
        } else {
          this.$message && this.$message.error('BIM 引擎初始化失败: ' + e.message);
        }
      }
    });
  },
  methods: {
    getTypeColor(val) {
      const typeColor = new Map();
      typeColor.set("1", "#2D76FF");
      typeColor.set("2", "#F6C233");
      typeColor.set("3", "#FF793F");
      typeColor.set("4", "#FC1919");
      return typeColor.get(val) ? typeColor.get(val) : "#2D76FF";
    },
    getTypeName(val) {
      //1:未验评、2:验评中、3:已验评
      const type = new Map();
      type.set("1", "低风险区域");
      type.set("2", "一般风险区域");
      type.set("3", "较大风险区域");
      type.set("4", "重大风险区域");
      return type.get(val) ? type.get(val) : "---";
    },

    query() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      this.pageParams.size = val.pageSize;
      this.getTableData();
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
      this.pageParams.current = 1;
      this.pageParams.pageSize = 20;
      this.pageParams.size = 20;
      this.pageParams.entity = {};
      this.getTableData();
    },
    sureson() {
      this.oprateRow.dialogShow = false;
      this.getTableData();
    },
    getTableData() {
      page(this.pageParams).then((res) => {
        this.tableData = res.data.records;
        this.pageParams.total = res.data.total;
        this.getDisabledBtns(this.tableData);
      });
    },
    addHandle() {
      this.title = "新增";
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    view(val) {
      this.oprateRow.data = val;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = true;
      this.title = "详情";
    },
    edit(val) {
      this.oprateRow.data = val;
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
      this.title = "编辑";
    },
    deleteHandle(row) {
      remove({ id: row.id }).then((res) => {
        if (res.success) {
          this.$message.success("删除成功");
          this.getTableData();
        }
      });
    },
    /**
     * @description 查看危险区域
     * @param row
     */
    viewPoint(row) {
      if (!row.area) {
        this.$message.info("未划分危险区域");
        return;
      }

      const cesium = window.Cesium;
      if (!cesium) {
        this.$message.error("Cesium 未加载");
        return;
      }

      if (!this.$refs.bimDom || !this.$refs.bimDom.api) {
        this.$message.error("BIM 引擎未初始化");
        return;
      }

      this.$refs.bimDom.api.Public.removeShape(this.prevId);
      this.prevId = row.id;
      this.$refs.bimDom.api.Public.drawShape(JSON.parse(row.area), {
        id: row.id,
        color: cesium.Color.fromCssColorString(
          row.type == 1
            ? "#2D76FF"
            : row.type == 2
              ? "#F6C233"
              : row.type == 3
                ? "#FF793F"
                : "#FC1919"
        ),
        classificationType: cesium.ClassificationType.BOTH,
        drawMode: "polygon",
      });
      this.$refs.bimDom.api.Public.zoomToShape(row.id, {
        time: 1,
      });
    },
    enableChange(row, val) {
      const id = row && row.id;
      const oldEnable = row && row.enable;
      const nextEnable = val ? 1 : 0;

      if (!id) {
        return;
      }

      row.enable = nextEnable;
      update({ id, enable: nextEnable })
        .then((res) => {
          if (res && res.success === false) {
            row.enable = oldEnable;
            this.$message.error(res.message || "更新失败");
            return;
          }
          this.getTableData();
        })
        .catch(() => {
          row.enable = oldEnable;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.page-list {
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
}
</style>

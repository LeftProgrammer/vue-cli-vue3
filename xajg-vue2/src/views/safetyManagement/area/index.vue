<template>
  <div class="page-list">
    <el-row>
      <el-col :span="12">
        <table-layout
          :page="pageParams"
          @pageSizeChange="handleSizeChange"
          @pageCurrentChange="handleCurrentChange"
          @query="handleQuery"
          @reset="reset"
          title="危险区域维护"
        >
          <template slot="form">
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
          <template slot="opratebtns">
            <el-button type="primary" icon="el-icon-plus" @click="addHandle()">
              新增
            </el-button>
          </template>
          <template slot="table">
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
                <template slot-scope="{ row }">
                  <el-link
                    type="primary"
                    @click="view(row)"
                    :underline="false"
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
                <template slot-scope="{ row }">
                  <el-tag :color="getTypeColor(row.type)" effect="dark">
                    {{ row.type ? getTypeName(row.type) : '' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="是否启用"
                align="center"
                width="120"
                prop="type"
              >
                <template slot-scope="{ row }">
                  <el-switch
                    :value="row.enable == 1"
                    active-color="#014ACB"
                    inactive-color="#F53F3F"
                    @change="enableChange(row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template #default="{ row }">
                  <list-button
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
                  ></list-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </table-layout>
      </el-col>
      <el-col :span="12">
        <BimEngine ref="bimDom" />
      </el-col>
    </el-row>

    <dataform
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow"
      :readonly="oprateRow.isView"
      @sureson="sureson"
    ></dataform>
  </div>
</template>

<script>
import { remove, page, update } from './api'
import { ListMixin } from '@/mixins/ListMixin'
import TableLayout from '@/components/ContentLayout/TreeTable'
import ListButton from '@/components/ListButton'
import dataform from './dataform'
import ContentLayout from '@/components/ContentLayout/TreeTable'
import BimEngine from '@/components/BimEngine'

export default {
  name: 'safeArea',
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    dataform,
    ContentLayout,
    BimEngine
  },
  data() {
    return {
      title: '',
      type: '',
      prevId: ''
    }
  },
  computed: {
    exportParams() {
      let params = {
        ...this.pageParams,
        entity: {
          ...this.query
        }
      }
      return params
    }
  },
  created() {},
  mounted() {
    this.$refs.bimDom.InitEngine()
  },
  methods: {
    getTypeColor(val) {
      const typeColor = new Map()
      typeColor.set('1', '#2D76FF')
      typeColor.set('2', '#F6C233')
      typeColor.set('3', '#FF793F')
      typeColor.set('4', '#FC1919')
      return typeColor.get(val) ? typeColor.get(val) : '#2D76FF'
    },
    getTypeName(val) {
      //1:未验评、2:验评中、3:已验评
      const type = new Map()
      type.set('1', '低风险区域')
      type.set('2', '一般风险区域')
      type.set('3', '较大风险区域')
      type.set('4', '重大风险区域')
      return type.get(val) ? type.get(val) : '---'
    },

    handleQuery() {
      this.pageParams.current = 1;
      this.getTableData();
    },
    query() {
      this.pageParams.current = 1
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current
      this.getTableData()
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize
      this.getTableData()
    },
    // 按钮权限
    getDisabledBtns(rows) {
      for (let index in rows) {
        rows[index].disabledBtns = []
        let userId = this.$store.getters.loginInfo.userId
        if (rows[index].createUser !== userId) {
          rows[index].disabledBtns.push('edit')
          rows[index].disabledBtns.push('delete')
        }
      }
    },
    reset() {
      this.pageParams.current = 1
      this.pageParams.pageSize = 20
      this.pageParams.entity = {}
      this.getTableData()
    },
    // /**获取字典 */
    // async getTypeOptions() {
    //   let res = await getDictItemTree("hsbg_bgml_sjg");
    //   const { success, data } = res;
    //   if (success) {
    //     this.typeOptions = data || [];
    //   } else {
    //     this.typeOptions = [];
    //   }
    // },
    sureson() {
      this.oprateRow.dialogShow = false
      this.getTableData()
    },
    getTableData() {
      page(this.pageParams).then((res) => {
        this.tableData = res.data.records
        this.pageParams.total = res.data.total
        this.getDisabledBtns(this.tableData)
      })
    },
    addHandle() {
      this.title = '新增'
      this.oprateRow.data = {}
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = false
    },
    view(val) {
      this.oprateRow.data = val
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = true
      this.title = '详情'
    },
    edit(val) {
      this.oprateRow.data = val
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = false
      this.title = '编辑'
    },
    deleteHandle(row) {
      remove({ id: row.id }).then((res) => {
        if (res.success) {
          this.$message.success('删除成功')
          this.getTableData()
        }
      })
    },
    /**
     * @description 查看危险区域
     * @param row
     */
    viewPoint(row) {
      // this.$refs.bimDom.api.Model.original(this.$refs.bimDom.bimconfig.id);
      if (!row.area) {
        this.$message.info('未划分危险区域')
        return
      }
      this.$refs.bimDom.api.Public.removeShape(this.prevId)
      this.prevId = row.id
      this.$refs.bimDom.api.Public.drawShape(JSON.parse(row.area), {
        id: row.id,
        color: Cesium.Color.fromCssColorString(
          row.type == 1
            ? '#2D76FF'
            : row.type == 2
            ? '#F6C233'
            : row.type == 3
            ? '#FF793F'
            : '#FC1919'
        ),
        classificationType: Cesium.ClassificationType.BOTH,
        drawMode: 'polygon'
      })
      this.$refs.bimDom.api.Public.zoomToShape(row.id, {
        time: 1
      })
    },
    enableChange({ id, enable }) {
      update({ id, enable: enable == 0 ? 1 : 0 }).then((res) => {
        this.getTableData()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
}
</style>

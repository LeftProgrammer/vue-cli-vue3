<template>
  <div class="page-list">
    <div class="all">
      <div>
        <el-tabs v-model="pointType" @tab-click="tabsHandleClick">
          <el-tab-pane label="雨量监测" name="yljc"></el-tab-pane>
          <el-tab-pane label="气象监测" name="qxjc"></el-tab-pane>
          <el-tab-pane label="泥位监测" name="nwjc"></el-tab-pane>
          <!--          <el-tab-pane label="风速监测" name="fsjc"></el-tab-pane>-->
        </el-tabs>
      </div>
      <table-layout
        :page="pageParams"
        @pageSizeChange="handleSizeChange"
        @pageCurrentChange="handleCurrentChange"
        @query="getTableData"
        @reset="reset"
        :showSearchBtn="false"
        title="监测记录台账"
      >
        <template slot="form">
          <el-form :model="query" :inline="true">
            <el-form-item label="监测点:">
              <!-- <dict
              :code="pointTypeList"
              :props="dictProps"
              v-model="query.pointCode"
              @change="changeHandle"
            ></dict> -->
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                         v-model="query.pointCode"
                         clearable
                         @change="changeHandle"
              >
                <el-option
                  v-for="item in pointTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                  :props="dictProps"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预警状态:">
              <el-select @visible-change="$visibleChange($event, 'el-popper')"
                         v-model="query.warningStatus"
                         clearable
                         @change="statusChangeHandle"
              >
                <el-option
                  v-for="item in warningStatusList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template slot="opratebtns">
          <!-- <el-button
          icon="el-icon-plus"
          type="primary"
          @click="addHandle(), (type = 'add')"
        >
          新增
        </el-button> -->
          <div></div>
        </template>
        <template v-slot:table="{ getIndex }">
          <el-table ref="multipleTable" :data="tableData" height="100%" border :cell-class-name="isWarning">
            <el-table-column
              label="序号"
              type="index"
              :index="getIndex"
              width="80"
              align="center"
            />
            <el-table-column label="监测点" prop="pointName" align="center"/>
            <el-table-column
              :label="monitorNameMap[pointType]"
              prop="monitorValue"
              align="center"
            >
              <template slot-scope="{ row }">
                <!--                <div :class="isWarning(row.warningField,'MONITOR_VALUE')?'is_warning':''">-->
                {{
                  monitorNameMap[pointType] === '雨量(mm)' ? Number(row.monitorValue).toFixed(2) : row.monitorValue
                }}
                <!--                </div>-->
              </template>
            </el-table-column>
            <el-table-column
              v-if="pointType === 'qxjc'"
              label="风向数值（°）"
              prop="windDirection"
              align="center"
            />
            <el-table-column
              v-if="pointType === 'qxjc'"
              label="风力（级）"
              prop="windScale"
              align="center"
            />
            <el-table-column
              v-if="pointType === 'qxjc'"
              label="风速（m/s）"
              prop="windSpeed"
              align="center"
            />
            <el-table-column
              label="监测时间"
              prop="monitorTime"
              align="center"
              width="180"
            >
              <template slot-scope="{ row }">
                {{
                  row.monitorTime
                    ? timeFormat(row.monitorTime, 'YYYY-MM-DD HH:mm:ss')
                    : ''
                }}
              </template>
            </el-table-column>
            <!--            <el-table-column-->
            <!--              label="更新时间"-->
            <!--              prop="createDate"-->
            <!--              align="center"-->
            <!--              width="180"-->
            <!--            >-->
            <!--              <template slot-scope="{ row }">-->
            <!--                {{-->
            <!--                  row.createDate-->
            <!--                    ? timeFormat(row.createDate, "YYYY-MM-DD HH:mm:ss")-->
            <!--                    : ""-->
            <!--                }}-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column
              label="操作"
              prop="name"
              width="200"
              align="center"
            >
              <template #default="{ row }">
                <div class="flex justify-center">
                  <el-link
                    v-if="row.warningStatus==='1' && showConfirm()"
                    @click="handelConfirmRow(row)"
                    type="primary"
                    center
                    style="margin-right: 20px"
                  >
                    确认
                  </el-link>
                  <el-link
                    :disabled="!isSystem"
                    @click="handelDeleteRow(row)"
                    type="danger"
                    plain
                    center
                  >
                    删除
                  </el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </table-layout>
    </div>
    <dataform
      :type="type"
      :title="title"
      v-if="oprateRow.dialogShow"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
      @ok="getTableData"
    >
    </dataform>
  </div>
</template>

<script>
import { confirmWarning, page, remove } from './api';
import { dateFormat } from '@/utils';
import { ListMixin } from '@/mixins/ListMixin';
import TableLayout from '@/components/ContentLayout/Table';
import ListButton from '@/components/ListButton';
import Dict from '@/components/Dict';
import dataform from './dataform';

import { list as getPointList } from '../device/api';

export default {
  name: 'monitor-data-index',
  mixins: [ListMixin],
  components: {
    TableLayout,
    ListButton,
    Dict,
    dataform
  },
  data() {
    return {
      pointType: 'yljc',
      type: '',
      title: '',
      DitSpeciality: [],
      pageParams: {
        size: 20,
        current: 1,
        total: 0
      },
      oprateRow: {},
      options: [],
      tableData: [],
      query: {
        params: {},
        pointCode: '',
        warningStatus: ''
      },
      date: [],
      dictList: [],
      readonly: false,

      url: { list: '' },
      userId: '',

      dictProps: {
        key: 'id',
        label: 'name',
        value: 'code'
      },
      pointTypeList: [],
      warningStatusList: [{
        value: '0',
        name: '未预警'
      }, {
        value: '1',
        name: '预警中'
      }, {
        value: '2',
        name: '已确认'
      }],
      monitorNameMap: {
        yljc: '雨量(mm)',
        qxjc: '雨量(mm)',
        nwjc: '泥水位涨幅(m)',
        fsjc: '风速(m/s)'
      }
    };
  },
  computed: {},
  created() {
    if (this.$route.query.pageType === 'fromNotify') {
      this.query.warningStatus = '1';
      this.pointType = this.$route.query.pointType;
    }
    this.tabsHandleClick();
    this.userId = this.$getStorage('userInfo').userId;
  },
  methods: {
    showConfirm() {
      let currentUser = this.$getStorage('userInfo');
      return currentUser.roles.includes('jcyjczry');
    },
    isWarning({ row, column }) {
      let field = column.property ? column.property.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase() : '';
      return (field && row.warningField && row.warningField.includes(field)) ? 'is_warning' : '';
    },
    closedDialog() {
      this.oprateRow.dialogShow = false;
    },
    tabsHandleClick() {
      this.query.pointCode = '';
      let data = {};
      if (this.pointType === '') {
        data = {};
      } else {
        data = { pointType: this.pointType };
      }
      getPointList(data).then((res) => {
        if (res.success) {
          this.pointTypeList = res.data.sort((a, b) => {
            return b.createDate - a.createDate;
          });
          const codes = this.pointTypeList.map((obj) => obj.code).join(',');
          this.getTableData(codes + '');
        }
      });
    },
    /**选择监测点 */
    changeHandle(code, item) {
      this.getTableData();
    },
    /** 预警状态修改*/
    statusChangeHandle(code, item) {
      if (this.query.pointCode) {
        this.getTableData();
      } else {
        const codes = this.pointTypeList.map((obj) => obj.code).join(',');
        this.getTableData(codes + '');
      }
    },
    dateChange(e) {
      console.log(e);
      if (e == null) {
        this.query = {};
      }
    },
    edit(row) {
      this.type = 'edit';
      this.title = '编辑-监测点';
      console.log(row);
    },
    view(row) {
      this.type = 'view';
      this.title = '查看-监测点';
      console.log(this.type);
    },
    reset() {
      this.query = {
        params: {},
        pointCode: ''
      };
      this.date = [];
      this.pageParams.current = 1;
      // this.query.current = 1;
      // this.query.pageSize = 20;
      this.tabsHandleClick();
    },
    // 查询表格数据
    getTableData(pointCode) {
      this.pageParams.entity = this.query;
      this.pageParams.orderProperties = [
        {
          property: 'monitorTime',
          asc: false
        }
      ];
      const params = JSON.parse(JSON.stringify(this.pageParams));
      if (typeof pointCode === 'string') {
        params.entity.pointCode = pointCode;
      }
      page(params).then((data) => {
        console.log(data);
        this.tableData = data.data.records;
        this.pageParams.total = data.data.total;
      });
    },
    /* 新增 */
    addHandle() {
      this.title = '新增-监测点';
      this.oprateRow.data = {};
      this.oprateRow.dialogShow = true;
      this.oprateRow.isView = false;
    },
    /** 删除*/
    deleteHandle(row) {
      remove({
        id: row.id
      }).then((res) => {
        if (!res.success) {
          return this.$message.error('删除失败：' + res.message);
        }
        this.$message.success('删除成功');
        const codes = this.pointTypeList.map((obj) => obj.code).join(',');
        this.getTableData(codes);
      });
    },

    timeFormat(time, type) {
      return dateFormat(time, type || 'YYYY-MM-DD HH:mm:ss');
    },

    handleSizeChange(val) {
      this.pageParams.pageSize = val.pageSize;
      const codes = this.pointTypeList.map((obj) => obj.code).join(',');
      this.getTableData(codes);
    },
    handleCurrentChange(val) {
      this.pageParams.current = val.current;
      const codes = this.pointTypeList.map((obj) => obj.code).join(',');
      this.getTableData(codes);
    },
    async handelDeleteRow(row) {
      try {
        await this.$confirm(`确认删除该条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        });
        this.deleteHandle(row);
      } catch (e) {
        console.error(e);
      }
    },
    async handelConfirmRow(row) {
      try {
        await this.$confirm(`是否确认该预警消息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        });
        confirmWarning({
          id: row.id
        }).then((res) => {
          if (!res.success) {
            return this.$message.error('确认失败：' + res.message);
          }
          this.$message.success('确认成功');
          const codes = this.pointTypeList.map((obj) => obj.code).join(',');
          this.getTableData(codes);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page-list {
  width: 100%;
  height: 100%;
  padding: 15px;
}

.el-col .el-input {
  width: 60%;
}

/deep/ .el-range-editor--small .el-range-input {
  font-size: 12px;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

::v-deep {
  .all {
    height: 100%;

    .table-content {
      height: calc(100% - 45px - 45px);
    }
  }
}

::v-deep .is_warning {
  background: red;
  color: #fff;
}
</style>

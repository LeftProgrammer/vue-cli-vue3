<template>
  <el-row class="table">
    <el-card class="box-card" shadow="never" v-for="(row, index) in tableData" :key="row.id">
      <div slot="header" class="clearfix">
        <div>{{ title + (index + 1) }}</div>
        <!-- <div class="control" @click="deleteHandle(index)">
            <i class="reduce el-icon-delete">
            </i>
        </div> -->
      </div>
      <el-row :gutter="20" style="margin-top: 18px">
        <el-col v-for="(column) in columns" :key="column.prop" :span="24">
          <el-form-item :label="column.label" :prop="column.prop">
            <el-input v-if="!column.slotName" v-model="row[column.prop]" disabled>
            </el-input>
            <slot :name="column.slotName" :row="row"></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
export default {
  name: 'ContentLayout-Table',
  data() {
    return {
      pageParams: {
        pageSize: 20,
        size: 20,
        current: 1,
        total: 0
      },

      drawer: false,

      /**搜索栏展开按钮是否展示 */
      showSearchOpenBtn: false,
      /**搜索栏展开 */
      searchOpen: false,

      tableContentDom: null,
      tableDom: null,
      searchFormDom: null,

      eleid: 'table_' + new Date().getTime(),

      componentContainer: null
    };
  },
  props: {
    tableData: {
      default: () => [],
      type: Array
    },
    columns: {
      default: () => [],
      type: Array
    },
    /**
     * 列表名称
     */
    title: {
      type: String,
      default: '数据'
    }
  },
  methods: {
    deleteHandle(index) {
      this.$emit('deleteRowHandle', index);
    }
  },
  watch: {},
  mounted() {

  },
  computed: {
    userInfo() {
      return this.$getStorage('userInfo');
    },
    /**
     * 超级管理账号，只有查看权限；无其他权限
     */
    isMdgAdmin() {
      return this.userInfo?.username === 'mdgglj';
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-bottom: 1rem;
  border-radius: 7px;
  border: 1px solid #c3c6cc;

  .control {
    float: right;
    margin: 3px 10px;

    .reduce {
      background-color: #e6a23c;
      display: inline-block;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      color: #fff;
    }
  }

  /deep/ .el-card__header {
    padding: 10px 10px 10px 20px;
    margin: 0 -10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;

    .clearfix {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .clearfix:after {
      display: none;
    }
  }

  /deep/ .el-card__body {
    padding: 10px;
  }

  ::v-deep .el-input-number .el-input__inner {
    text-align: left !important;
  }
}

</style>

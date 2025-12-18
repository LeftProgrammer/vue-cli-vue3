<template>
  <el-row class="table">
    <el-card
      v-for="(row, index) in tableData"
      :key="(row && (row.id || row._id)) || index"
      class="box-card"
      shadow="never"
    >
      <template #header>
        <div class="clearfix">
          <div>{{ title + (index + 1) }}</div>
        </div>
      </template>

      <el-row :gutter="20" style="margin-top: 18px">
        <el-col v-for="column in columns" :key="column.prop || column.label" :span="24">
          <el-form-item :label="column.label" :prop="column.prop">
            <el-input v-if="!column.slotName" v-model="row[column.prop]" disabled />
            <slot v-else :name="column.slotName" :row="row" :index="index"></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
export default {
  name: "AppH5Table",
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "数据",
    },
  },
  emits: ["deleteRowHandle"],
  methods: {
    deleteHandle(index) {
      this.$emit("deleteRowHandle", index);
    },
  },
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

  ::v-deep(.el-card__header) {
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

  ::v-deep(.el-card__body) {
    padding: 10px;
  }

  ::v-deep(.el-input-number .el-input__inner) {
    text-align: left !important;
  }
}
</style>

<template>
  <div>
    <el-dialog
      title="日报"
      :visible.sync="dialogShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="40%"
      v-draggable
      @closed="closedHandle"
    >
      <el-table :data="data" style="width: 100%" border  max-height="500">
        <el-table-column prop="reportDate" label="日期" width="180" align="center"> </el-table-column>
        <el-table-column prop="reportNum" label="当天完成量" width="180" align="center"> </el-table-column>
        <el-table-column prop="remark" label="填报说明"> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedHandle"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { FormMixin } from "@/mixins/FormMixin";
export default {
  name: "dataform",
  mixins: [FormMixin],
  props: {
    data: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      dialogShow: false,
      formData: {}
    };
  },
  computed: {},
  watch: {
    visible: {
      handler(newValue) {
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    closedHandle() {
      this.$emit("sureson");
      this.dialogShow = false;
    },
  }
};
</script>

<style scoped lang="scss">
.page-leave {
  width: 100%;
  height: 100%;
  padding: 15px;

  .table {
    /deep/ .el-table__row .cell button {
      padding: 0 !important;
    }
  }

  .pagination {
    padding: 0 20px;
  }
}
.subTabeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-col .el-input {
  width: 60%;
}

.lengthening .el-select {
  width: 93%;

  .el-input {
    width: 100%;
  }
}

::v-deep {
  .el-col .el-input {
    width: 100%;
  }
}
/deep/ .el-input-group__append {
  border: 1px solid #0096ff;
  color: #0096ff;
  cursor: pointer;
}
</style>

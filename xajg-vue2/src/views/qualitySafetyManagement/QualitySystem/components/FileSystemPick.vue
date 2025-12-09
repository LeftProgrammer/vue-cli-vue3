<template>
  <div>
    <el-input
      placeholder="请选择"
      :class="readonly ? 'disabledBtn' : 'defaultBtn'"
      :value="title || relatedReceivingName"
      disabled
    >
      <template slot="append">
        <el-button @click="choose" type="primary">选择</el-button>
      </template>
    </el-input>
    <!--选择弹窗-->
    <el-dialog
      title="关联文件"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="960px"
      v-draggable
      @closed="closedHandle"
    >
      <content-layout v-if="dialogShow" :showForm="false" :showPage="false">
        <template slot="table">
          <div>
            <el-form
              :model="searchParams.entity"
              class="page-measure-system-form"
              inline
              @keydown.native.enter="getSynthesisManagePage"
            >
              <el-form-item>
                <el-radio-group
                  v-model="searchParams.entity.documentType"
                  class="mb-10"
                  @input="handelDocumentTypeChange"
                >
                  <el-radio-button :label="1">收文</el-radio-button>
                  <el-radio-button :label="2">发文</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="标题:">
                <el-input
                  v-model="searchParams.entity.title"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="文件编号:">
                <el-input
                  v-model="searchParams.entity.code"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  class="page-measure-system-button"
                  size="small"
                  @click="getSynthesisManagePage"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
          </div>

          <el-table
            :data="tableData"
            style="width: 100%"
            height="400"
            border
            @current-change="handleCurrentRowChange"
            highlight-current-row
            row-key="id"
          >
            <el-table-column
              prop="title"
              label="标题"
              :className="'text-left'"
              width="500"
            />
            <el-table-column prop="code" label="编码" />
          </el-table>
          <el-pagination
            class="text-right mt-10"
            :current-page.sync="searchParams.current"
            layout="total, prev, pager, next, jumper"
            :total="searchParams.total"
            @current-change="getSynthesisManagePage"
          />
        </template>
      </content-layout>
      <div slot="footer" class="dialog-footer" v-if="!readonly">
        <el-button type="primary" @click="confirmHandle"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ContentLayout from "@/components/ContentLayout/Table";
import { defineComponent } from "vue";
// import { list, get, getByCode } from "./api";
import { getSynthesisManagePage, getSynthesisOaPage } from "@/api/quality";
const FileSystemPick = defineComponent({
  name: "FileSystemPick",
  components: {
    ContentLayout,
  },
  model: {
    prop: "relatedReceiving",
    event: "change",
  },
  data() {
    return {
      currentRow: {},
      /**弹窗显示 */
      dialogShow: false,
      tableData: [],
      /**请求参数 */
      searchParams: {
        pageSize: 10,
        current: 1,
        total: 0,
        entity: {
          documentType: 1,
          unitType: 4,
          flowStatus: 2,
          title: "",
          code: "",
        },
      },
    };
  },
  props: {
    /**已经选中对应的code信息 */
    relatedReceiving: {
      type: String,
      default: "",
    },
    relatedReceivingName: {
      type: String,
      default: "",
    },
    unitType: {
      type: String,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    /**pbs名称 */
    title() {
      let name = this.currentRow?.title || this.currentRow?.name;
      if (!name) {
        return "";
      }
      // 去掉第一个斜杠
      let result = name.replace(/^\//, "");

      // 将后续的斜杠替换为连字符 "-"
      result = result.replace(/\//g, "-");
      return result;
    },
  },
  watch: {
    dialogShow: {
      handler(newValue) {
        if (newValue) {
          //   this.load();
          this.searchParams = this.$options.data().searchParams;
          this.getSynthesisManagePage();
        } else {
        }
      },
      immediate: true,
      deep: true,
    },
    // relatedReceiving: {
    //   handler(newValue) {
    //     if (newValue) {
    //       this.getPbs();
    //     } else {
    //       this.pbs = {};
    //     }
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    //通过relatedReceiving请求当前信息
    getCurrent() {
      this.currentRow = {};
      if (this.relatedReceiving) {
      }
    },
    handelDocumentTypeChange(val) {
      this.searchParams = this.$options.data().searchParams;
      this.searchParams.entity.documentType = val;
      this.tableData = [];
      this.getSynthesisManagePage();
    },
    async getSynthesisManagePage() {
      try {
        const submitData = structuredClone(this.searchParams);
        const unitTypeDict = {
          yzdw: 4,
          sjdw: 2,
          jldw: 1,
          sgdw: 3,
          dsfdw: 5,
        };
        submitData.entity.unitType = unitTypeDict[this.unitType] || 4;
        // 业主发文有专用接口，其他情况则是另外一个接口
        const request =
          submitData.entity.unitType === 4 &&
          submitData.entity.documentType === 2
            ? getSynthesisOaPage
            : getSynthesisManagePage;

        const { data, success, message } = await request(submitData);
        if (!success) {
          this.$message.error("获取列表失败：" + message);
          return false;
        }
        this.searchParams.total = data.total;
        this.tableData = data.records;
        return data;
      } catch (err) {
        console.error(err);
        this.$message.error("获取列表失败");
        return false;
      }
    },
    handleCurrentRowChange(currentRow) {
      this.currentRow = currentRow;
    },
    /**确认时 */
    confirmHandle() {
      this.dialogShow = false;
      this.$emit("change", this.currentRow.id, this.currentRow);
    },
    closedHandle() {
      this.$emit("closed");
    },
    //选择
    choose() {
      if (this.disabled || this.readonly) {
        this.$message.warning("当前为只读模式，无法选择");
        return;
      }
      this.dialogShow = true;
    },
  },
  mounted() {},
});
export default FileSystemPick;
</script>

<style scoped lang="scss">
.choosebtn {
  height: 100%;
  width: 100%;
  display: block;
}

.disabledBtn {
  /deep/ .el-input-group__append {
    border: 1px solid #dcdfe6 !important;
    color: grey !important;
    cursor: not-allowed;
    font-size: 14px;
    .el-button {
      border: 0px solid #dcdfe6 !important;
    }
    .el-button:hover {
      border: 0px solid #dcdfe6 !important;
      background: none !important;
      color: grey !important;
      cursor: not-allowed;
      border-radius: 0;
    }
  }
}

.defaultBtn {
  /deep/ .el-input-group__append {
    border: 1px solid #0096ff !important;
    color: #0096ff !important;
    cursor: pointer;
  }
}

/deep/.text-left {
  text-align: left !important;
}
.wbench-el-dialog .page-measure-system-button {
  padding: 11px 20px !important;
}
.wbench-el-dialog
  .el-dialog__body
  .el-form.page-measure-system-form
  .el-form-item__content
  :not(.el-input__validateIcon):not(
    .el-range__close-icon
  ).el-icon-circle-close {
  position: unset !important;
}
</style>

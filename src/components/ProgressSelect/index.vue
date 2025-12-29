<template>
  <div>
    <span v-if="office">
      <el-input
        placeholder="请选择"
        v-model="progressName"
        disabled
        @click="toViewDetail"
        :class="readonly ? 'disabledBtn' : 'defaultBtn'"
      >
        <template #append>
          <div @click="choose" class="choosebtn">选择</div>
        </template>
      </el-input>
    </span>
    <span v-else>
      <el-link
        v-show="readonly || disabled"
        @click="toViewDetail"
        style="color: rgb(99, 176, 255)"
        >{{ progressName }}</el-link
      >
      <el-input
        v-show="!readonly && !disabled"
        placeholder="请选择"
        v-model="progressName"
        disabled
        @click="toViewDetail"
        :class="readonly ? 'disabledBtn' : 'defaultBtn'"
      >
        <template #append>
          <div @click="choose" class="choosebtn">选择</div>
        </template>
      </el-input>
    </span>
    <!--选择PBS弹窗-->
    <el-dialog
      v-draggable
      title="选择关联进度计划"
      custom-class="wbench-el-dialog"
      v-model="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      width="80%"
      @closed="closedHandle"
    >
      <!-- 如果 PlanRecord 组件存在则使用，否则显示提示 -->
      <PlanRecord
        v-if="hasPlanRecord"
        style="height: 600px"
        :pageType="'supervisionSendDoc'"
        @selectHandle="selectHandle"
        :showExportBtn="showExportBtn"
      ></PlanRecord>
      <div v-else style="padding: 20px; text-align: center;">
        <el-alert
          title="PlanRecord 组件未找到"
          type="warning"
          description="请确保已迁移 PlanRecord 组件到 Vue3 项目中"
          show-icon
        />
      </div>
      <template #footer>
        <div class="dialog-footer" v-if="!readonly">
          <el-button type="primary" @click="confirmHandle"> 确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { page } from "@/views/progress/ProgressPlan/api";

// 动态导入 PlanRecord 组件
let PlanRecord = null;
let hasPlanRecord = false;
try {
  PlanRecord = require("@/views/progress/PlanRecord/index.vue").default;
  hasPlanRecord = true;
} catch (e) {
  console.warn("PlanRecord 组件未找到，请先迁移该组件");
}

export default {
  name: "ProgressSelectComp",
  components: {
    ...(PlanRecord ? { PlanRecord } : {}),
  },
  emits: ['update:modelValue', 'update:progressId', 'change', 'closed'],
  props: {
    /** Vue3 默认 v-model */
    modelValue: {
      type: String,
      default: "",
    },
    /**已经选中progress对应的id信息 */
    progressId: {
      type: String,
      default: "",
    },
    /**显示弹窗 */
    readonly: {
      type: Boolean,
      default: false,
    },
    office: {
      type: Boolean,
      default: false,
    },
    toprogressName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showExportBtn: false,
      progressName: "",
      /**弹窗显示 */
      dialogShow: false,
      tableData: [],
      /**请求参数 */
      queryParams: { pid: 0 },
      currentRow: {},
      /**form组件 */
      formVue: null,
      /**组件是否可用 */
      disabled: false,
      hasPlanRecord: hasPlanRecord,
    };
  },
  computed: {
    effectiveProgressId() {
      return this.modelValue !== undefined && this.modelValue !== null && this.modelValue !== "" ? this.modelValue : this.progressId;
    }
  },
  watch: {
    toprogressName: {
      handler(newValue) {
        if (newValue) {
          this.progressName = newValue;
        }
      },
      deep: true,
      immediate: true,
    },
    readonly: {
      handler(newValue) {
        this.getIsDisabled();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    selectHandle(row) {
      this.currentRow = row;
    },
    /**确认时 */
    confirmHandle() {
      this.dialogShow = false;
      this.progressName =
        this.currentRow.name + "(" + this.currentRow.code + ")";
      console.log("this.progressName", this.progressName);
      this.$emit("update:modelValue", this.currentRow.id);
      this.$emit("update:progressId", this.currentRow.id);
      this.$emit("change", this.currentRow.id);
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
    /**
     * 获取父元素实例
     */
    getParent() {
      let parent = this.$parent;
      if (!parent) {
        return null;
      }
      let el = parent.$el || {};
      let classList = el.classList;
      let tagName = el.tagName || "";
      while (
        !(classList && classList.contains("el-form")) ||
        tagName.toLocaleLowerCase() !== "form"
      ) {
        parent = parent.$parent;

        if (!parent) return null;

        el = parent.$el || {};
        classList = el.classList;
        tagName = el.tagName || "";
      }
      this.formVue = parent;
      return parent;
    },
    /**
     * 获取disabled
     */
    getIsDisabled() {
      let formVue = this.getParent();
      if (formVue && formVue.disabled !== false) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    toViewDetail() {
      if (this.effectiveProgressId) {
        let params = {
          pageParams: {
            pageSize: 20,
            current: 1,
            total: 0,
          },
          entity: {
            id: this.effectiveProgressId,
          },
        };
        page(params).then((res) => {
          console.log("res", res);
          if (res.success && res?.data?.records.length > 0) {
            // 能访问，有权限
            window.open(
              window.location.origin +
                process.env.BASE_URL +
                "#/progress/ProgressPlan?permCode=ProgressPlan&name=%E8%BF%9B%E5%BA%A6%E8%AE%A1%E5%88%92&progressId=" +
                this.effectiveProgressId,
              "_blank"
            );
          } else {
            // 无访问权限
            this.$message.warning("当前账号无访问权限");
          }
        });
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.choosebtn {
  height: 100%;
  width: 100%;
  display: block;
}

.readonly {
  :deep(.el-input-group__append) {
    color: grey;
    border-color: #e4e7ed;
  }
}

:deep(.table) {
  height: calc(100% - 50px - 40px) !important;
}

:deep(.table-cnotent) {
  height: calc(100% - 40px - -14px) !important;
}

.disabledBtn {
  :deep(.el-input-group__append) {
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
  :deep(.el-input-group__append) {
    border: 1px solid #0096ff !important;
    color: #0096ff !important;
    cursor: pointer;
  }
}
</style>

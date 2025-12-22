<template>
  <div>
    <el-input placeholder="请选择" :model-value="valueText" disabled>
      <template #append>
        <el-link
          class="choosebtn"
          type="primary"
          :underline="false"
          @click="choose"
          >选择</el-link>
      </template>
    </el-input>

    <el-dialog
      v-model="dialogShow"
      title="三维模型视图"
      model-class="wbench-el-dialog"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      fullscreen
      @closed="closedHandle"
    >
      <BimEngine
        v-if="dialogShow"
        ref="bimEngine"
        @inited="bimInited"
        @clickMap="pickHandle"
      />
    </el-dialog>
  </div>
</template>

<script>
import BimEngine from "@/components/BimEngine/index.vue";
import { bimconfig } from "@/config/bimconfig";

export default {
  name: "BimShowComp",
  components: {
    BimEngine,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    bimCode: {
      type: String,
      default: "",
    },
    cid: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    modelCode: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "update:bimCode", "change", "closed"],
  data() {
    return {
      dialogShow: false,
      bimconfig: bimconfig.find((x) => x.use) || {},
    };
  },
  computed: {
    valueText() {
      return this.modelValue || this.bimCode;
    },
  },
  methods: {
    choose() {
      this.dialogShow = true;
      this.$nextTick(() => {
        if (this.modelCode) {
          this.$refs.bimEngine.InitEngine(this.modelCode);
        } else {
          this.$refs.bimEngine.InitEngine();
        }
      });
    },
    bimInited() {
      if (!this.valueText) {
        return;
      }
      const bimCodes = this.valueText
        .split(/[,#]/)
        .map((x) => x.trim())
        .filter(Boolean);
      if (bimCodes.length > 0) {
        this.$nextTick(() => {
          this.$refs.bimEngine.setColor(bimCodes);
        });
      }
    },
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    pickHandle(feature) {
      if (this.readonly) {
        return;
      }
      if (!feature || !feature.id) {
        return;
      }
      const value = feature.id;
      this.$emit("update:modelValue", value);
      this.$emit("update:bimCode", value);
      this.$emit("change", value);
    },
  },
};
</script>

<style scoped lang="scss">
.choosebtn {
  height: 100%;
  width: 100%;
  cursor: pointer;
  display: block;
}

:deep(.el-dialog__body) {
  height: calc(100% - 45px);
}
</style>

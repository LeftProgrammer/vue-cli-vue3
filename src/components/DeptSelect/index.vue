<template>
  <el-dialog
    v-model="dialogShow"
    v-draggable
    title="选择工程部位（PBS）"
    custom-class="wbench-el-dialog"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="960px"
    @closed="closedHandle"
  >
    <DepSelect :single="single" @childEvt="childEvtHandle" />
  </el-dialog>
</template>

<script>
import DepSelect from "@/components/DepSelect/index.vue";

export default {
  name: "ExeDepModal",
  components: {
    DepSelect,
  },
  props: {
    single: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: undefined,
    },
  },
  emits: ["update:visible", "update:modelValue", "childEvt", "close"],
  data() {
    return {
      dialogShow: false,
    };
  },
  watch: {
    visible: {
      handler(newValue) {
        if (this.modelValue !== undefined) {
          return;
        }
        this.dialogShow = newValue;
      },
      immediate: true,
      deep: true,
    },
    modelValue: {
      handler(newValue) {
        if (newValue === undefined) {
          return;
        }
        this.dialogShow = newValue;
      },
      immediate: true,
    },
    dialogShow: {
      handler(newValue) {
        if (this.modelValue !== undefined) {
          this.$emit("update:modelValue", newValue);
        }
        this.$emit("update:visible", newValue);
      },
    },
  },
  methods: {
    closedHandle() {
      this.dialogShow = false;
      this.$emit("update:visible", false);
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
    childEvtHandle(payload) {
      this.$emit("childEvt", payload);
      if (payload && payload.type === "save") {
        this.dialogShow = false;
      }
      if (payload && payload.type === "close") {
        this.dialogShow = false;
      }
    },
  },
};
</script>

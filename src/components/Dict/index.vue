<template>
  <div class="dict-content" :class="{ readonly: readonly }">
    <el-select
      v-if="!readonly"
      v-model="curValue"
      :placeholder="'请选择'"
      :disabled="readonly"
      :multiple="multiple"
      clearable
      @change="selectChange"
      @visible-change="$visibleChange($event, 'el-popper')"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.dictName"
        :value="item.dictCode"
      />
    </el-select>
    <span v-else>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "DictIndex",
  props: {
    code: {
      type: [String, Function],
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    fun: {
      type: Function,
      default: () => {},
    },
    props: {
      type: Object,
      default: () => {
        return {
          key: "id",
          label: "dictName",
          value: "dictCode",
        };
      },
    },
  },
  emits: ["change", "update:modelValue"],
  data() {
    return {
      options: [],
      curValue: null,
      label: "",
    };
  },
  watch: {
    code: {
      handler(newValue) {
        if (newValue) {
          this.getDictItems(newValue);
        } else {
          this.options = [];
        }
      },
      immediate: true,
      deep: true,
    },
    value: {
      handler(newValue) {
        if (this.modelValue !== undefined) {
          return;
        }
        if (newValue) {
          this.getLabel();
        } else {
          this.curValue = null;
          this.label = "";
        }
      },
      immediate: true,
      deep: true,
    },
    modelValue: {
      handler(newValue) {
        if (newValue === undefined) {
          return;
        }
        if (newValue) {
          this.getLabel();
        } else {
          this.curValue = null;
          this.label = "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    selectChange(val) {
      if (!val) {
        this.$emit("change", null, null);
        this.$emit("update:modelValue", null);
        return;
      }
      const option = this.options.find((x) => x.dictCode === val);
      this.$emit("change", val, option);
      this.$emit("update:modelValue", val);
    },
    getDictItems(code) {
      this.options = [];
      if (!code) {
        return;
      }

      let getFun;
      if (typeof code === "string") {
        getFun = () => this.$store.dispatch("dict/get", code);
      }
      if (typeof code === "function") {
        getFun = code;
      }
      if (!getFun) {
        return;
      }

      getFun().then((items) => {
        if (Array.isArray(items)) {
          void 0;
        } else {
          if (items && items.success) {
            items = items.data;
            if (this.props) {
              items = items.map((x) => {
                return {
                  id: x[this.props.key],
                  dictCode: x[this.props.value],
                  dictName: x[this.props.label],
                };
              });
            }
          }
        }
        this.options = items || [];
        this.label = "";
        this.getLabel();
      });
    },
    getLabel() {
      const currentValue = this.modelValue !== undefined ? this.modelValue : this.value;
      if (!currentValue) {
        return;
      }
      this.curValue = currentValue;
      if (currentValue && this.options && this.options.length > 0) {
        const option = this.options.find((x) => x.dictCode === currentValue);
        if (option) {
          this.label = option.dictName;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dict-content {
  height: 100%;
  width: 100%;

  ::v-deep(.el-select) {
    width: 100%;
  }
}
</style>

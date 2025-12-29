<template>
  <div class="wrapper">
    <el-input
      :model-value="username"
      :placeholder="placeholder"
      readonly
      :disabled="inputDisabled"
      @click="showPerson()"
    >
      <template #suffix>
        <i
          v-show="username && !inputDisabled"
          class="el-icon-circle-close pointer"
          @click.stop="onClear()"
        />
      </template>
    </el-input>
    <user-select
      v-model:show="personnelShow"
      :users="computedPersons"
      :multi-enable="multiple"
      @user-checked="onUserChecked"
      @onRenderCheckedList="onRenderCheckedList"
    />
  </div>
</template>

<script>
import UserSelect from "@/components/newUserSelect/index.vue";

export default {
  name: "UserSelectInput",
  components: {
    UserSelect,
  },
  inject: {
    elForm: {
      default: "",
    },
  },
  emits: ['update:modelValue', 'input', 'change'],
  props: {
    /** Vue3 默认 v-model */
    modelValue: {
      type: [String, Array],
      default: undefined,
    },
    /** Vue2 兼容 */
    value: {
      type: [String, Array],
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    // 仅在初始化的时候使用的值, 多用于回显后端传回用户名
    userName: {
      type: String,
      default: "",
    },
  },
  watch: {
    userName: {
      handler: function (val) {
        if (val) {
          this.username = val;
        }
      },
      immediate: true,
    },
    effectiveValue(val) {
      if (this.multiple && Array.isArray(val) && val.length === 0) {
        this.username = "";
      } else if (!val) {
        this.username = "";
      }
    },
  },
  data() {
    return {
      personnelShow: false,
      username: "",
    };
  },
  computed: {
    effectiveValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
    computedPersons() {
      if (Array.isArray(this.effectiveValue)) {
        return [...this.effectiveValue];
      } else {
        return this.effectiveValue ? [this.effectiveValue] : [];
      }
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
  },
  methods: {
    showPerson() {
      if (!this.disabled) {
        this.personnelShow = true;
      }
    },
    onUserChecked(data) {
      this.username = data.text || "";
      if (this.multiple) {
        this.$emit("update:modelValue", data.valueText.split(","));
        this.$emit("input", data.valueText.split(","));
        this.$emit("change", data.valueText.split(","));
      } else {
        this.$emit("update:modelValue", data.valueText);
        this.$emit("input", data.valueText);
        this.$emit("change", data.valueText);
      }
    },
    onClear() {
      if (this.multiple) {
        this.$emit("update:modelValue", []);
        this.$emit("input", []);
        this.$emit("change", []);
      } else {
        this.$emit("update:modelValue", "");
        this.$emit("input", "");
        this.$emit("change", "");
      }
      this.username = "";
    },
    onRenderCheckedList(data) {
      if (Array.isArray(data)) {
        this.username = data.map((item) => item.realName).join();
      } else {
        this.username = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  width: 100%;
}
.el-input {
  :deep(.el-input__inner) {
    cursor: pointer;
  }
  &:hover .pointer {
    display: unset;
  }
  .pointer {
    display: none;
  }
}
</style>

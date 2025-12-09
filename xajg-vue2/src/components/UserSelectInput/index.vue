<template>
  <div class="wrapper">
    <el-input
      :value="username"
      :placeholder="placeholder"
      readonly
      :disabled="inputDisabled"
      @click.native="showPerson()"
    >
      <i
        v-show="username && !inputDisabled"
        slot="suffix"
        class="el-icon-circle-close pointer"
        @click.stop="onClear()"
      />
    </el-input>
    <user-select
      :show.sync="personnelShow"
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
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Array],
      default: () => {
        if (this?.multiple) {
          return [];
        }
        return "";
      },
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
    value(val) {
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
    computedPersons() {
      if (Array.isArray(this.value)) {
        return [...this.value];
      } else {
        return this.value ? [this.value] : [];
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
        this.$emit("input", data.valueText.split(","));
        this.$emit("change", data.valueText.split(","));
      } else {
        this.$emit("input", data.valueText);
        this.$emit("change", data.valueText);
      }
    },
    onClear() {
      if (this.multiple) {
        this.$emit("input", []);
        this.$emit("change", []);
      } else {
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
  /deep/ .el-input__inner {
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

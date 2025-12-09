<template>
  <!--字典使用-->
  <div class="dict-content" :class="{ readonly: readonly }">
    <el-select @visible-change="$visibleChange($event, 'el-popper')"
      :placeholder="'请选择'"
      :disabled="readonly"
      clearable
      v-model="curValue"
      v-if="!readonly"
      @change="selectChange"
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
  name: "Dict-Index",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    /**字典code */
    code: {
      type: String | Function,
      default: "",
    },
    /** 选中的值*/
    value: {
      type: String,
      default: "",
    },
    /**是否多选 */
    multiple: {
      type: Boolean,
      default: false,
    },
    /**显示弹窗 */
    readonly: {
      type: Boolean,
      default: false,
    },
    /**获取数据项的fun */
    fun: {
      type: Function,
      default: () => {},
    },
    /**获取数据项的fun */
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
  created() {},
  mounted() {},
  components: {},
  computed: {},
  data() {
    return {
      options: [],
      curValue: null,
      label: "",
    };
  },
  methods: {
    /**选中修改时 */
    selectChange(val) {
      if (!val) {
        this.$emit("change", null, null);
      }
      let option = this.options.find((x) => x.dictCode === val);
      this.$emit("change", val, option);
    },
    /**获取字典items */
    getDictItems(code) {
      // console.log("getDictItems", code);
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

      getFun().then((items) => {
        if (Array.isArray(items)) {
        } else {
          if (items.success) {
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
        this.options = items;
        this.label = "";
        this.getLabel();
      });
    },
    /**获取label */
    getLabel() {
      if (!this.value) {
        return;
      }
      this.curValue = this.value;
      if (this.value && this.options && this.options.length > 0) {
        let option = this.options.find((x) => x.dictCode === this.value);
        if (option) {
          this.label = option.dictName;
        }
      }
    },
  },
  watch: {
    code: {
      handler(newValue) {
        // console.log("code", newValue);
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
  },
};
</script>
<style lang="scss" scoped>
.dict-content {
  height: 100%;
  width: 100%;

  ::v-deep .el-select {
    width: 100%;
  }
}
</style>

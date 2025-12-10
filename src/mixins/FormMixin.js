import { dateFormat } from "@/utils";
import { BaseMixin } from "@/mixins/BaseMixin";

export const FormMixin = {
  mixins: [BaseMixin],
  data() {
    return {
      // form 表单对应的 ref 名称
      dataFormRef: "dataFormRef",
    };
  },
  methods: {
    // 获取字典（带简单缓存控制）
    getDictItemList(dictObj, callback) {
      if (!dictObj) {
        if (typeof callback === "function") callback();
        return;
      }
      if (!dictObj.options || dictObj.options.length === 0) {
        this.getDictItems(dictObj.code).then((items) => {
          dictObj.options = items || [];
          if (typeof callback === "function") callback();
        });
      } else if (typeof callback === "function") {
        callback();
      }
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },
    // 保存前做简单校验
    beforeSubmit(name) {
      const refName = name || this.dataFormRef;
      let result = true;
      if (!this.$refs || !this.$refs[refName]) return result;
      this.$refs[refName].validate((valid) => {
        if (!valid) {
          result = false;
        }
      });
      return result;
    },
  },
  props: {
    // 弹窗是否可见
    visible: {
      type: Boolean,
      default: false,
    },
    // 当前行数据
    data: {
      type: Object,
      default: () => ({}),
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false,
    },
  },
};

import { BaseMixin } from "@/mixins/BaseMixin";
import { mapGetters } from "vuex";
import { dateFormat } from "@/utils";
import { page } from "@/api/common";

export const FormMixin = {
  mixins: [BaseMixin],
  components: {},
  data() {
    return {
      /**form表单对应的ref */
      dataFormRef: "dataFormRef",
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**获取字典 */
    getDictItemList(dictObj, callback) {
      if (!dictObj.options || dictObj.options.length == 0) {
        this.getDictItems(dictObj.code).then((items) => {
          dictObj.options = items;
          console.log(
            "this.professionDict",
            this.professionDict,
            this.formData.profession
          );
          callback && callback();
        });
      } else {
        callback && callback();
      }
    },
    timeFormat(time, type) {
      return dateFormat(time, type || "YYYY-MM-DD HH:mm:ss");
    },

    /**保存前做数据验证 */
    beforeSubmit(name) {
      name = name || this.dataFormRef;
      let res = true;
      this.$refs[name].validate((valid) => {
        if (!valid) {
          res = false;
          return false;
        }
      });
      return res;
    },
  },
  computed: {},
  destroyed() {},
  watch: {},
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
    /**已经选中列表数据信息 */
    data: {
      type: Object,
      default: () => {},
    },
    /**是否只读 */
    readonly: {
      type: Boolean,
      default: false,
    },
  },
};

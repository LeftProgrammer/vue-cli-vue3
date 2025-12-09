import { BaseMixin } from "@/mixins/BaseMixin";
import { mapGetters } from "vuex";
import { dateFormat } from "@/utils";
import { page, remove } from "@/api/common";

export const ListenerWindowWidthMixin = {
  components: {},
  data() {
    return {
    };
  },
  created() {},
  mounted() {
    let thiss = this;
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if(resizeTimer){
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(function(){
        const w = document.documentElement.clientWidth;
        const h = document.documentElement.clientHeight;
        console.log('页面大小发生了变化', `宽度：${w}`, `高度：${h}`);
        thiss.changeToFixedValue(w);
      },100)
    });
  },
  methods: {},
  computed: {},
  destroyed() {},
  watch: {
    dialogShow:{
      handler(newValue, oldValue) {
        if (newValue) {
          const w = document.documentElement.clientWidth;
          this.changeToFixedValue(w);
        }
      },
      deep: true,
      immediate: true,
    }
  },
};

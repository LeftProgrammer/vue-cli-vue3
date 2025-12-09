<template>
  <div>
    <el-input placeholder="请选择" v-model="bimCode" disabled>
      <template slot="append">
        <div @click="choose" class="choosebtn">选择</div>
      </template>
    </el-input>
    <!--BIM显示弹窗-->
    <el-dialog
      title="三维模型视图"
      custom-class="wbench-el-dialog"
      :visible.sync="dialogShow"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      fullscreen
      @closed="closedHandle"
    >
      <bim-engine
        ref="bimEngine"
        v-if="dialogShow"
        :cid="cid || bimconfig.id"
        @inited="bimInited"
        @pick="pickHandle"
      ></bim-engine>
    </el-dialog>
  </div>
</template>

<script>
import BimEngine from "@/components/BimEngine/index";
import { bimconfig } from "@/config/bimconfig";
// import { list } from "./api";
export default {
  name: "BimShowComp",
  model: {
    prop: "bimCode",
    event: "change",
  },
  components: {
    BimEngine,
  },
  data() {
    return {
      /**当前行 */
      currentRow: {},
      /**弹窗显示 */
      dialogShow: false,
      /**请求参数 */
      queryParams: { pid: 0 },

      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {},
    };
  },
  props: {
    /**已经选中pbs对应的bim构件信息 */
    bimCode: {
      type: String,
      default: "",
    },
    /**已经选中pbs信息 */
    cid: {
      type: String,
      default: "",
    },
    /**是否只读 */
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  watch: {
    // bimCode: {
    //   handler(newValue) {},
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    //模型加载后
    bimInited() {
      if (this.bimCode) {
        let bimCodes = this.bimCode.split(",");
        if (Array.isArray(bimCodes) && bimCodes.length > 0) {
          console.log("bimCodes", bimCodes);
          // setTimeout(() => {
          //   this.$refs.bimEngine.setColor(bimCodes);
          // }, 1000);

          this.$nextTick(() => {
            //设置bim高亮显示
            this.$refs.bimEngine.setColor(bimCodes);
          });
        }
      }
    },
    //选择
    choose() {
      this.dialogShow = true;
    },
    closedHandle() {
      this.dialogShow = false;
      this.$emit("closed");
    },
    pickHandle(feature) {
      if (this.readonly) {
        return;
      }
      this.$emit("change", feature.id);
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

::v-deep .el-dialog__body {
  height: calc(100% - 45px);
}
</style>

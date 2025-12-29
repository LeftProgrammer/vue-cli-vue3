<template>
  <div>
    <!-- <el-tooltip :content="pbsName" placement="top" effect="dark"> -->
    <el-link
      v-if="isClick"
      class="text-ellipsis"
      type="primary"
      :underline="false"
      @click="show"
      >{{ pbsName }}
    </el-link>
    <div v-else class="text-ellipsis">{{ pbsName }}</div>
    <!-- </el-tooltip> -->
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
      <bim-engine :cid="bimconfig.id" ref="bimEngine" @inited="bimInited"></bim-engine>
    </el-dialog>
  </div>
</template>

<script>
import BimEngine from "@/components/BimEngine/index";
import { bimconfig } from "@/config/bimconfig";
import { list, get, getByCode } from "@/components/PbsSelect/api";
import makeRequest from "./requestPromise";
// import { list } from "./api";
export default {
  name: "BimShowComp",
  components: {
    BimEngine
  },
  data() {
    return {
      /**当前行 */
      pbs: null,
      /**弹窗显示 */
      dialogShow: false,
      /**请求参数 */
      queryParams: { pid: 0 },

      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {}
    };
  },
  props: {
    /**已经选中pbs对应的bim构件信息 */
    pbsId: {
      type: String,
      default: ""
    },
    /**已经选中pbs对应的bim构件信息 */
    pbsCode: {
      type: String,
      default: ""
    },
    isClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /**pbs名称 */
    pbsName() {
      let name = this.pbs?.pathName || this.pbs?.name;
      if (!name) {
        return "";
      }
      // 去掉第一个斜杠
      let result = name.replace(/^\//, "");

      // 将后续的斜杠替换为连字符 "-"
      result = result.replace(/\//g, "-");
      return result;
    }
  },
  watch: {
    pbsId: {
      handler(newValue) {
        // console.log("pbsId", newValue, this.readonly);
        if (newValue) {
          this.getPbs();
        }
      },
      immediate: true,
      deep: true
    },
    pbsCode: {
      handler(newValue) {
        // console.log("pbsId", newValue, this.readonly);
        if (newValue) {
          this.getPbs();
        } else {
          this.pbs = {};
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    show() {
      this.$emit("click");
      return;
      this.dialogShow = true;
    },
    //模型加载后
    bimInited() {
      if (this.pbs) {
        this.bimHandle(this.pbs.bimCode);
      }
    },
    /**模型处理 */
    bimHandle(bimCode) {
      if (bimCode) {
        //通过code进行渲染
        this.$refs.bimEngine.render(bimCode);
      } else {
        //设置bim高亮显示
        this.$refs.bimEngine.setColor([]);
      }
    },
    //通过pbsId请求pbs
    getPbs() {
      // if (this.pbs) {
      //   return;
      // }
      // console.log("pbsId,.pbsCode,", this.pbsId, this.pbsCode);
      if (this.pbsId) {
        // 也要优化
        get(this.pbsId).then((res) => {
          if (res.success) {
            this.pbs = res.data;
          }
        });
      } else {
        // 这里 是为了兼容之前的老版本
        // 因为之前的版本pbacode 是pbscode 跟pbaname使用&&& 拼接起来的
        // 先判断是不是包含有 &&&   说明是老版本   就按照&&&  切割 然后取第一个
        let pbsCode = this.pbsCode;
        if (pbsCode.indexOf("&&&") > -1) {
          pbsCode = pbsCode.split("&&&")[0];
        }
        if (pbsCode) {
          // makeRequest(pbsCode).then((responseData) => {
          //   this.pbs =responseData;
          // });
          getByCode(pbsCode).then((res) => {
            if (res.success) {
              this.pbs = res.data;
            }
          });
        }
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
      // this.$emit("change", feature.id);
    }
  }
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

::v-deep .splitter-pane {
  .el-table {
    height: 100%;

    .el-table__body-wrapper {
      height: calc(100% - 40px);
      overflow-y: auto;
    }
  }
}
</style>

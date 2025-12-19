<template>
  <div>
    <el-input
      :model-value="positionText"
      placeholder="请选择"
      :class="readonly ? 'disabledBtn' : 'defaultBtn'"
      disabled
    >
      <template #append>
        <div @click="choose">
          <i class="el-icon-arrow-right" />
        </div>
      </template>
    </el-input>
    <!--BIM显示弹窗-->
    <el-dialog
      title="三维模型视图"
      custom-class="bim-select-dialog wbench-el-dialog"
      v-model="dialogShow"
      :destroy-on-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      fullscreen
      @closed="closedHandle"
    >
      <div class="actionBox" v-if="api">
        <el-switch
          v-model="terrain"
          active-text="开启Gis场景"
          inactive-text="关闭Gis场景"
          @change="terrainChange"
        />
        <el-switch
          v-model="waterSurface"
          active-text="开启水面效果"
          inactive-text="关闭水面效果"
          @change="waterSurfaceChange"
        />
      </div>
      <BimEngine
        ref="bimEngine"
        :coorType="type == 'point' ? '0' : '1'"
        @getpos="getpos"
        @LoadComplete="LoadComplete"
        @rightClick="rightClick"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="closedHandle"> 取 消 </el-button>
          <el-button v-show="!readonly" type="primary" @click="confirmHandle">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import BimEngine from "@/components/BimEngine/index.vue";
import { bimconfig } from '@/config/bimconfig'
import { findByModelCode } from '@/components/BimEngine/api/index'
export default {
  name: 'BimSelectComp',
  components: {
    BimEngine
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    /**已经选中pbs对应的bim构件信息 */
    position: {
      type: String,
      default: ''
    },
    /**是否只读 */
    readonly: {
      type: Boolean,
      default: false
    },
    locationDesc: {
      type: String,
      default: ''
    },
    type: {
      // point 点 cover 面
      type: String,
      default: 'point'
    },
    coverState: {
      type: String,
      default: '1'
    }
  },
  emits: ["update:modelValue", "update:position", "change", "closed"],
  data() {
    return {
      /**弹窗显示 */
      dialogShow: false,
      /**是否点击确认 */
      isConfirm: false,
      /**请求参数 */

      /**bim相关参数 */
      bimconfig: bimconfig.find((x) => x.use) || {},

      /**左侧列表选中项 */
      //默认原始传入的值
      //是否虚化了
      initedModelAlpha: {},

      pin: false,
      shiftRecordNode: {
        start: '',
        end: ''
      },
      engine: null,
      api: null,
      pos: [],
      coverPos: [],
      terrain: true,
      waterSurface: true,
    }
  },
  computed: {
    positionText() {
      return this.modelValue || this.position;
    },
  },
  watch: {
    dialogShow: {
      handler(newValue, oldValue) { },
      immediate: true,
      deep: true
    }
  },
  mounted() { },
  beforeUnmount() { },
  methods: {
    //选择
    choose() {
      this.dialogShow = true
      this.$nextTick(() => {
        this.$refs.bimEngine.InitEngine()
      })
      if (this.type == 'cover' && this.positionText) {
        this.coverPos = JSON.parse(this.positionText)
      }
    },
    //关闭时
    closedHandle() {
      if (!this.isConfirm) {
        this.dialogShow = false
        this.pos = []
        this.coverPos = []
        this.api.Label.remove('0')
        this.$emit('closed')
      }
    } /**确定时 */,
    confirmHandle() {
      this.dialogShow = false
      this.isConfirm = true
      let value = "";
      if (this.type == 'point') {
        value = JSON.stringify(this.pos)
      } else {
        value = JSON.stringify(this.coverPos)
      }
      this.$emit("update:modelValue", value);
      this.$emit("update:position", value);
      this.$emit('change', value)
    },
    // 模型加载完成后
    LoadComplete(api) {
      this.api = api
      this.$message.success('模型加载完成')
      if (this.positionText) {
        if (this.type == 'point') this.getpos()
        else if (this.type == 'cover') this.rightClick()
      }
    },
    //模型加载后
    bimInited() { },
    terrainChange() {
      this.api.Public.setGisState(this.terrain)
    },
    waterSurfaceChange() {
      findByModelCode({ modelCode: 'bigScene' }).then(res => {
        const modelId = res.data[0].modelId
        this.api.Feature.setVisible("2039950456624#2039950454432", this.waterSurface, modelId);
      })
    },
    /**
     * @description 获取点击位置
     */
    getpos(pos) {
      if (!this.api) {
        this.$message.info('模型未加载完成，请稍后再试')
      }
      if (this.type == 'point') {
        const label = this.api.Label.getBalloonById('lablePos')
        if (label) this.api.Label.removeBalloon('lablePos')
        this.pos = pos || this.positionText
        var opt = {
          axisType: 1,
          id: 'lablePos',
          position: pos || JSON.parse(this.positionText),
          displayRange: [0, 100000],
          maxDistance: 100000,
          text: JSON.stringify(pos) || this.positionText
        }
        this.api.Label.addBalloon(opt)
      } else {
        this.api.Public.drawPoint(pos, {
          id: new Date().getTime(),
          axisType: 1,
          size: 10
        })
        this.coverPos.push(pos)
      }
    },
    rightClick() {
      if (this.coverPos.length < 3) this.$message.info('至少选中3个点')
      else {
        const Cesium = window.Cesium;
        if (!Cesium) {
          this.$message && this.$message.error('Cesium 未加载')
          return
        }
        this.api.Public.drawShape(
          this.coverPos.length > 0 ? this.coverPos : JSON.parse(this.positionText),
          {
            id: new Date().getTime(),
            color: Cesium.Color.fromCssColorString(
              this.coverState === '1'
                ? '#014ACB'
                : this.coverState === '2'
                  ? '#00B42A'
                  : this.coverState === '3'
                    ? '#FF7D00'
                    : '#F53F3F'
            ),
            classificationType: Cesium.ClassificationType.BOTH,
            drawMode: 'polygon'
          }
        )
      }
    },
    /**
     * @description 获取面
     */
    getCover() { }
  }
}
</script>

<style scoped lang="scss">
.choosebtn {
  height: 100%;
  width: 100%;
  display: block;
}

.disabledBtn {
  :deep(.el-input-group__append) {
    border: 1px solid #dcdfe6 !important;
    color: grey !important;
    font-size: 14px;

    :deep(.el-button) {
      width: 34px;
      border: 0px solid #dcdfe6 !important;
    }

    .el-button:hover {
      border: 0px solid #dcdfe6 !important;
      background: none !important;
      color: grey !important;
      cursor: not-allowed;
      border-radius: 0;
    }
  }
}

.defaultBtn {
  :deep(.el-input-group__append) {
    background-color: #fff;
    padding: 0;

    >div {
      cursor: pointer;
      height: 100%;
      padding: 0 20px;
      text-align: center;
    }
  }
}

:deep(.text-left) {
  text-align: left !important;
}
</style>
<style lang="scss">
.bim-select-dialog {
  .el-dialog__body {
    height: calc(100% - 55px - 67px);

    .actionBox {
      position: absolute;
      top: 100px;
      right: 120px;
      z-index: 100;
    }
  }
}
</style>

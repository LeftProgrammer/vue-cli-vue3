<template>
  <div ref="wrap">
    <ul class="ul" v-if="showList">
      <li v-for="(item, index) in modelList" :key="index">
        <div class="title">
          <span @click="LocationModel(item)">
            {{ item.docName }}
          </span>
          <!-- <el-switch v-model="item.enable" @change="changeEnable(item, index)">
          </el-switch> -->
        </div>
        <i class="el-icon-rank" @click="startOffset(item)" />
      </li>
    </ul>
    <el-form
      v-else
      ref="formFolder"
      :model="formFolder"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="东西(偏移值)" prop="xValue">
        <el-input-number
          v-model="formFolder.xValue"
          controls-position="right"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="南北(偏移值)">
        <el-input-number
          v-model="formFolder.yValue"
          controls-position="right"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="高度(偏移值)">
        <el-input-number
          v-model="formFolder.zValue"
          controls-position="right"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="旋转角度">
        <el-input-number
          v-model="formFolder.rotateValue"
          controls-position="right"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    sceneInfo: {
      type: Object,
      default: null,
    },
    modelList: {
      type: Array,
      default: () => [],
    },
    updateConfig: {
      type: Function,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      formFolder: {},
      modelOffset: [],
      rules: {},
      argument: {},
      showList: true,
      activeModelId: "",
    };
  },
  computed: {},
  mounted() {
    try {
      this.argument = JSON.parse(this.sceneInfo.argument);
      this.modelOffset = this.argument.modelOffset || {};
    } catch (error) {}
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  },
  methods: {
    startOffset(item) {
      this.showList = false;
      this.activeModelId = item.id;
      const offset = Object.assign(
        {},
        this.modelOffset[item.id] || {
          xValue: 0,
          yValue: 0,
          zValue: 0,
          rotateValue: 0,
        }
      );
      this.formFolder = offset;
      this.LocationModel(item);
    },
    handleChange() {
      api.Model.clearRotation(this.activeModelId);
      api.Model.clearOffset(this.activeModelId);
      api.Model.rotate(this.formFolder.rotateValue || 0, this.activeModelId);
      api.Model.offset(
        this.formFolder.xValue || 0,
        this.formFolder.yValue || 0,
        this.formFolder.zValue || 0,
        this.activeModelId
      );
    },
    LocationModel(data) {
      api.Model.location(data.id);
    },
    /**
     * @description 保存
     * @param e
     */
    save(e) {
      const that = this;
      e.preventDefault();
      that.$refs.formFolder.validate((valid) => {
        if (valid) {
          that.confirmLoading = true;
          this.modelOffset[this.activeModelId] = this.formFolder;
          this.$set(this.argument, "modelOffset", this.modelOffset);
          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success("创建成功");
              that.$refs.formFolder.resetFields(); //清空表单
              that.confirmLoading = false;
              that.showList = true;
            }
          );
        }
      });
    },
    handleCancel() {
      const that = this;
      this.formFolder = this.modelOffset[this.activeModelId] || {
        xValue: 0,
        yValue: 0,
        zValue: 0,
        rotateValue: 0,
      };
      this.handleChange();
      that.$refs.formFolder.resetFields(); //清空表单
      this.activeModelId = "";
      that.showList = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 16px;
}
.ul {
  list-style: none;
  width: 100%;
  li {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 10px;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      span {
        margin-right: 16px;
        cursor: pointer;
      }
    }
    i {
      cursor: pointer;
      font-size: 16px;
      color: #000;
    }
  }
}
</style>

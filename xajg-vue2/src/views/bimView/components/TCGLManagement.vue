<template>
  <div ref="wrap">
    <el-button ghost @click="add" class="add-btn" v-if="showList">
      创建图层
    </el-button>
    <ul class="ul" v-if="showList">
      <li v-for="(item, index) in layerList" :key="index">
        <div class="title">
          <span>
            {{ item.name }}
          </span>
        </div>
      </li>
    </ul>
    <el-form
      v-else
      ref="formFolder"
      :model="formFolder"
      :rules="rules"
      label-width="70px"
    >
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入" v-model="formFolder.name" />
      </el-form-item>
      <el-form-item label="模型">
        <el-select v-model="formFolder.layer" multiple placeholder="请选择">
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.docName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="code">
        <el-input placeholder="请输入" v-model="formFolder.code" />
      </el-form-item>
      <el-form-item label="默认加载">
        <el-switch v-model="formFolder.defaultShow" />
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
      rules: {},
      argument: {},
      layerList: [],
      showList: true,
    };
  },
  computed: {},
  mounted() {
    try {
      this.argument = JSON.parse(this.sceneInfo.argument);
      this.layerList = this.argument.layerList || [];
    } catch (error) {}
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  },
  methods: {
    add() {
      this.showList = false;
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
          this.$set(
            this.argument,
            "layerList",
            this.layerList.concat([this.formFolder])
          );
          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success("创建成功");
              that.$refs.formFolder.resetFields(); //清空表单
              that.confirmLoading = false;
              that.layerList = JSON.parse(res.data.argument).layerList;
              that.showList = true;
            }
          );
        }
      });
    },
    handleCancel() {
      const that = this;
      that.$refs.formFolder.resetFields(); //清空表单
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

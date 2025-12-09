<template>
  <div ref="wrap">
    <ul class="ul">
      <li v-for="(item, index) in list" :key="index">
        <div class="title">
          <span>
            {{ item.name }}
          </span>
        </div>
        <el-tooltip effect="dark" content="是否默认加载" placement="left">
          <el-switch v-model="item.defaultShow"> </el-switch>
        </el-tooltip>
      </li>
    </ul>
    <div style="text-align: right">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
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
      list: [],
      showList: true,
    };
  },
  computed: {},
  mounted() {
    try {
      this.argument = JSON.parse(this.sceneInfo.argument);
      this.list =
        this.argument.modelList ||
        this.modelList.map((x) => {
          return {
            name: x.docName,
            docType: x.docType,
            id: x.id,
            suffix: x.suffix,
            matrix: x.matrix,
            modelName: x.name,
            defaultShow: true,
          };
        });
    } catch (error) {
      this.list = this.modelList.map((x) => {
        return {
          name: x.docName,
          docType: x.docType,
          id: x.id,
          suffix: x.suffix,
          matrix: x.matrix,
          modelName: x.name,
          defaultShow: true,
        };
      });
    }
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
      that.confirmLoading = true;
      this.$set(this.argument, "modelList", this.list);
      this.updateConfig({ argument: JSON.stringify(this.argument) }, (res) => {
        that.$message.success("创建成功");
        that.confirmLoading = false;
      });
    },
    handleCancel() {},
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

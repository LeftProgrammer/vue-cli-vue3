<template>
  <div ref="wrap">
    <el-button ghost @click="CreateViewpoint" style="margin-bottom: 16px">
      创建视点
    </el-button>
    <ul class="viewpointUl" v-if="showList">
      <li v-for="(item, index) in viewPointList" :key="index">
        <div class="title">
          <span @click="ZoomViewpoint(item)">
            {{ item.name }}
          </span>
          <el-switch v-model="item.enable" @change="changeEnable(item, index)">
          </el-switch>
        </div>
        <i class="el-icon-delete" @click="DelViewpoint(index)"></i>
      </li>
    </ul>

    <el-form
      v-else
      ref="formFolder"
      :model="formFolder"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入" v-model="formFolder.name" />
      </el-form-item>
      <el-form-item label="ID" prop="id">
        <el-input placeholder="请输入" v-model="formFolder.id" />
      </el-form-item>
      <el-form-item label="视角" prop="viewPoint">
        <el-input placeholder="请输入" v-model="formFolder.viewPoint" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="SaveViewpoint">确 定</el-button>
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
    updateConfig: {
      type: Function,
    },
  },
  data() {
    return {
      showList: true,
      confirmLoading: false,
      formFolder: {},
      thumbnail: undefined,
      viewPointList: [],
      pagination: { current: 1, pageSize: 1000 },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
      },
      argument: {},
    };
  },
  computed: {},
  mounted() {
    try {
      this.argument = JSON.parse(this.sceneInfo.argument);
      this.viewPointList = this.argument.viewPointList || [];
    } catch (error) {}
  },
  methods: {
    CreateViewpoint() {
      const that = this;
      that.showList = false;
      const { heading, pitch, position } = api.Camera.getViewPort();
      this.formFolder = Object.assign(
        {},
        {
          id: `viewPoint${new Date().getTime()}`,
          name: "",
          enable: true,
          viewPoint: JSON.stringify({
            position,
            pitch,
            heading,
          }),
        }
      );
    },
    /**
     * @description 删除视点
     * @param index
     */
    DelViewpoint(index) {
      const that = this;
      this.$confirm("此操作将永久删除该视点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.viewPointList.splice(index, 1);
          this.argument.viewPointList = this.viewPointList;

          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success("视点删除成功");
            }
          );
        })
        .catch(() => {});
    },
    /**
     * @description 是否启用
     */
    changeEnable(item, index) {
      const that = this;
      this.argument.viewPointList = this.viewPointList;

      this.updateConfig({ argument: JSON.stringify(this.argument) }, (res) => {
        that.$message.success("修改成功");
        that.viewPointList = JSON.parse(res.data.argument).viewPointList;
      });
    },
    /**
     * @description 创建视点
     * @param e
     */
    SaveViewpoint(e) {
      const that = this;
      e.preventDefault();
      that.$refs.formFolder.validate((valid) => {
        if (valid) {
          const params = {};
          this.formFolder.viewPoint = JSON.parse(this.formFolder.viewPoint);
          this.$set(
            this.argument,
            "viewPointList",
            this.viewPointList.concat([this.formFolder])
          );
          params.argument = JSON.stringify(this.argument);
          this.updateConfig(params, (res) => {
            that.$message.success("视点创建成功");
            that.$refs.formFolder.resetFields(); //清空表单
            that.showList = true;
            that.viewPointList = JSON.parse(res.data.argument).viewPointList;
          });
        }
      });
    },
    handleCancel() {
      const that = this;
      that.showList = true;
    },

    ZoomViewpoint(item) {
      let viewpoint = item.viewPoint;
      api.Camera.flyToViewPort(
        viewpoint.position,
        viewpoint.heading,
        viewpoint.pitch
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.thumbnail-style {
  width: 100%;
}

.viewpointUl {
  list-style: none;
  margin-top: 16px;
  width: 100%;
  li {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 20px;
    .title {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        margin-right: 16px;
        cursor: pointer;
      }
    }
    i {
      cursor: pointer;
    }
  }
}
</style>

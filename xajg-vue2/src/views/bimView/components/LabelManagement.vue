<template>
  <div ref="wrap">
    <el-button ghost @click="CreateLabel" style="margin-bottom:16px">创建标签</el-button>
    <ul class="ul" v-if="showList">
      <li v-for="(item, index) in labelList" :key="index">
        <div class="title">
          <span @click="ZoomLabel(item)">
            {{ item.name }}
          </span>
          <el-switch v-model="item.enable" @change="changeEnable(item, index)">
          </el-switch>
        </div>
        <i class="el-icon-delete" @click="DelLabel(index)"></i>
      </li>
    </ul>

    <el-form
      v-else
      ref="formFolder"
      :model="formFolder"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入" v-model="formFolder.name" />
      </el-form-item>
      <el-form-item label="位置">
        <el-input placeholder="请输入" v-model="formFolder.position" readonly />
      </el-form-item>
      <el-form-item label="ID">
        <el-input placeholder="请输入" v-model="formFolder.id" readonly />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="SaveLabel">确 定</el-button>
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
      visible: false,
      confirmLoading: false,
      formFolder: {},
      labelList: [],
      pagination: { current: 1, pageSize: 1000 },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }],
      },
      argument: {},
      showList: true,
    };
  },
  computed: {},
  mounted() {
    try {
      this.argument = JSON.parse(this.sceneInfo.argument);
      this.labelList = this.argument.labelList || [];
      this.addBalloon();
    } catch (error) {}
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
    api.Label.removeBalloon(0);
  },
  methods: {
    CreateLabel() {
      const that = this;
      that.$message.info("请点击要创建标签的位置并调整视角！");
      api.Public.event("LEFT_CLICK", function (click) {
        api.Public.pickupCoordinate(click.position, (data) => {
          that.showList = false;
          that.$set(
            that.formFolder,
            "id",
            `default_label_${new Date().getTime()}`
          );
          const { heading, pitch, position } = api.Camera.getViewPort();
          that.$set(that.formFolder, "viewPoint", {
            position,
            pitch,
            heading,
          });
          that.$set(that.formFolder, "position", data);
        });
      });
    },
    /**
     * @description 删除视点
     * @param index
     */
    DelLabel(index) {
      const that = this;
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const label = this.labelList[index];
          this.labelList.splice(index, 1);
          this.argument.labelList = this.labelList;
          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success("视点删除成功");
              that.addBalloon(label);
            }
          );
        })
        .catch(() => {});
    },
    /**
     * @description 创建视点
     * @param e
     */
    SaveLabel(e) {
      const that = this;
      e.preventDefault();
      that.$refs.formFolder.validate((valid) => {
        if (valid) {
          this.$set(
            this.argument,
            "labelList",
            this.labelList.concat([
              {
                ...this.formFolder,
                enable: true,
              },
            ])
          );

          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success("标签创建成功");
              that.$refs.formFolder.resetFields(); //清空表单
              that.showList = true;
              that.labelList = JSON.parse(res.data.argument).labelList;
              that.addBalloon();
            }
          );
        }
      });
    },
    /**
     * @description 是否启用
     */
    changeEnable(item, index) {
      const that = this;
      this.argument.labelList = this.labelList;
      this.updateConfig({ argument: JSON.stringify(this.argument) }, (res) => {
        that.$message.success("标签修改成功");
        that.labelList = JSON.parse(res.data.argument).labelList;
        that.addBalloon(item.enable ? "" : item);
      });
    },
    handleCancel() {
      const that = this;
      that.showList = true;
    },
    /**
     * @description 添加标签
     */
    addBalloon(label) {
      if (label) {
        api.Label.removeBalloon(label.id);
      } else {
        this.labelList.forEach((x) => {
          const label = api.Label.getBalloonById(x.id);
          if (!label && x.enable) {
            const opt = {
              axisType: 1,
              id: x.id,
              position: x.position,
              maxDistance: 20000,
              displayRange: [0, 20000],
              text: x.name,
            };
            api.Label.addBalloon(opt);
          }
        });
      }
    },
    ZoomLabel(item) {
      let viewpoint = item.viewPoint;
      api.Camera.setViewPort(
        viewpoint.position,
        viewpoint.heading,
        viewpoint.pitch
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.ul {
  list-style: none;
  margin-top: 16px;
  width: 100%;
  li {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 10px;
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
      font-size: 16px;
    }
  }
}
</style>

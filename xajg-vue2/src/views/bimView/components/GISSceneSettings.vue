<template>
  <div ref="wrap">
    <ul class="ul">
      <li v-for="(item, index) in GISSettingList" :key="index">
        <div class="title">
          <span>
            {{ item.name }}
          </span>
          <el-switch
            v-model="GISSetting[item.code]"
            @change="changeEnable(item)"
          >
          </el-switch>
        </div>
      </li>
    </ul>
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
      formFolder: {
      },
      thumbnail: undefined,
      GISSettingList: [
        { name: "Gis场景", enable: false, code: "openearth" },
        { name: "地形", enable: false, code: "openterrain" },
      ],
      pagination: { current: 1, pageSize: 1000 },
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "change" }],
      },
      GISSetting: {},
      creatPosition: [],
    };
  },
  computed: {},
  mounted() {
    this.GISSettingList.forEach((x) => {
      this.$set(this.GISSetting, x.code, this.sceneInfo[x.code] === 1);
    });
  },
  destroyed() {},
  methods: {
    /**
     * @description 创建视点
     * @param e
     */
    SaveLabel(e) {
      const that = this;
      e.preventDefault();
      that.$refs.formFolder.validate((valid) => {
        if (valid) {
          that.confirmLoading = true;
          this.$set(
            this.argument,
            "labelList",
            this.labelList.concat([
              {
                name: this.formFolder.title,
                position: this.creatPosition,
                enable: true,
                id: `default_label_${new Date().getTime()}`,
              },
            ])
          );

          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success("标签创建成功");
              that.$refs.formFolder.resetFields(); //清空表单
              that.confirmLoading = false;
              that.visible = false;
              that.labelList = JSON.parse(res.data.argument).labelList;
              that.addBalloon();
            }
          );
        }
      });
    },
    /**
     * @description
     */
    changeEnable(item) {
      const that = this;
      switch (item.code) {
        case "openearth":
          api.Public.setGisState(this.GISSetting.openearth);
          break;
        case "openterrain":
          api.Public.setTerrainState(this.GISSetting.openterrain);
          break;
      }
      const params = {};
      params[item.code] = this.GISSetting[item.code] ? 1 : 0;
      this.updateConfig(params, (res) => {
        that.$message.success("修改成功");
      });
    },
    handleCancel() {
      const that = this;
      that.visible = false;
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

<template>
  <div ref="wrap">
    <el-button ghost @click="add" class="add-btn" v-if="showList"
      >创建裁剪</el-button
    >
    <ul class="ul" v-if="showList">
      <li v-for="(item, index) in CJList" :key="index">
        <div class="title">
          <span @click="addEarthCutPart(item)">
            {{ item.name }}
          </span>
          <el-switch v-model="item.enable" @change="changeEnable(item, index)">
          </el-switch>
        </div>
        <i class="el-icon-delete" @click="del(index)"></i>
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
      <el-form-item label="ID">
        <el-input placeholder="请输入" v-model="formFolder.id" />
      </el-form-item>
      <!-- <el-form-item label="压平高度">
        <el-input-number
          controls-position="right"
          v-model="formFolder.height"
          :step-strictly="true"
        ></el-input-number>
      </el-form-item> -->
      <el-form-item label="位置">
        <el-input
          placeholder="请输入"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="formFolder.position"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button @click="addEarthCutPart">压平</el-button>
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
    updateConfig: {
      type: Function,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      formFolder: {},
      CJList: [],
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
      this.CJList = this.argument.CJList || [];
    } catch (error) {}
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  },
  methods: {
    add() {
      const that = this;
      this.showList = false;
      // that.$set(that.formFolder, "height", 0);
      that.$set(that.formFolder, "id", `CJ_${new Date().getTime()}`);
      that.$set(that.formFolder, "position", []);
      that.$message.info("请点击选择要裁剪的区域，不能少与三个点！");
      api.Public.event("LEFT_CLICK", (click) => {
        api.Public.pickupCoordinate(click.position, (data) => {
          const position = that.formFolder.position || [];
          position.push(data);
          that.$set(that.formFolder, "position", position);
        });
      });
    },
    addEarthCutPart(data) {
      const conifg = data || this.formFolder;
      var opt = {
        id: conifg.id,
        positions: conifg.position,
        // autoFlatten: false,
        // height: conifg.height,
      };
      api.Public.addEarthCutPart(opt);
    },
    /**
     * @description 删除视点
     * @param index
     */
    del(index) {
      const that = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.CJList.splice(index, 1);
          this.argument.CJList = this.CJList;
          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success("删除成功");
            }
          );
        })
        .catch(() => {});
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
            "CJList",
            this.CJList.concat([
              {
                ...this.formFolder,
                enable: true,
              },
            ])
          );

          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success("创建成功");
              that.$refs.formFolder.resetFields(); //清空表单
              that.confirmLoading = false;
              that.showList = true;
              that.CJList = JSON.parse(res.data.argument).CJList;
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
      this.argument.YPList = this.YPList;
      this.updateConfig({ argument: JSON.stringify(this.argument) }, (res) => {
        that.$message.success("标签修改成功");
        that.YPList = JSON.parse(res.data.argument).YPList;
      });
    },
    handleCancel() {
      const that = this;
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

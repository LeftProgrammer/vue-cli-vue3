<template>
  <div ref="wrap">
    <el-button ghost @click="add" class="add-btn" v-if="showList"> 创建压平 </el-button>
    <ul class="ul" v-if="showList">
      <li v-for="(item, index) in YPList" :key="index">
        <div class="title">
          <span @click="addEarthFlatten(item)">
            {{ item.name }}
          </span>
          <el-switch v-model="item.enable" @change="changeEnable(item, index)" />
        </div>
        <div class="action">
          <i class="el-icon-edit" @click="edit(item)" />
          <i class="el-icon-delete" @click="del(index)" />
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
      <el-form-item label="ID">
        <el-input placeholder="请输入" v-model="formFolder.id" />
      </el-form-item>
      <el-form-item label="压平高度">
        <el-input-number
          v-model="formFolder.height"
          controls-position="right"
          :step-strictly="true"
        />
      </el-form-item>
      <div style="height: 300px; overflow: auto">
        <div
          v-for="(item, index) in formFolder.position"
          :key="index"
          style="overflow: hidden; white-space: nowrap"
          @click="delPos(index)"
        >
          {{ index }}、{{ item }}
        </div>
      </div>
      <el-form-item>
        <el-button @click="handleCancel">取 消</el-button>
        <!-- <el-button @click="addEarthFlatten">压平</el-button> -->
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
      default: null
    },
    updateConfig: {
      type: Function
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      formFolder: {},
      YPList: [],
      pagination: { current: 1, pageSize: 1000 },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "change" }]
      },
      argument: {},
      showList: true,
      editId: ""
    };
  },
  computed: {},
  mounted() {
    try {
      this.argument = JSON.parse(this.sceneInfo.argument);
      this.YPList = this.argument.YPList || [];
    } catch (error) {}
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  },
  watch: {
    "formFolder.position": {
      handler(newVal, oldVal) {
        api.Public.removeEarthFlatten(this.formFolder.id);
        if (newVal.length >= 3) {
          this.$nextTick(() => {
            var opt = {
              id: this.formFolder.id,
              positions: newVal,
              height: 0
            };
            api.Public.addEarthFlatten(opt);
          });
        }
      },
      immediate: true // 可选：立即触发一次
    }
  },
  methods: {
    add() {
      this.editId = "";
      const that = this;
      this.showList = false;
      that.$set(that.formFolder, "height", 0);
      that.$set(that.formFolder, "id", `YP_${new Date().getTime()}`);
      that.$set(that.formFolder, "position", []);
      that.$message.info("请点击选择要压平的区域，不能少与三个点！");
      api.Public.event("LEFT_CLICK", (click) => {
        api.Public.pickupCoordinate(click.position, (data) => {
          const position = that.formFolder.position || [];
          position.push(data);
          that.$set(that.formFolder, "position", position);
        });
      });
    },
    edit(data) {
      this.editId = data.id;
      const that = this;
      this.showList = false;
      Object.assign(this.formFolder, data);
      api.Public.event("LEFT_CLICK", (click) => {
        api.Public.pickupCoordinate(click.position, (data) => {
          const position = that.formFolder.position || [];
          position.push(data);
          that.$set(that.formFolder, "position", position);
        });
      });
    },
    addEarthFlatten(data) {
      const conifg = data || this.formFolder;
      var opt = {
        id: conifg.id,
        positions: conifg.position,
        autoFlatten: false,
        height: conifg.height
      };
      api.Public.addEarthFlatten(opt);
    },
    delPos(index) {
      this.formFolder.position.splice(index, 1);
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
        type: "warning"
      })
        .then(() => {
          this.YPList.splice(index, 1);
          this.argument.YPList = this.YPList;
          this.updateConfig({ argument: JSON.stringify(this.argument) }, (res) => {
            that.$message.success("删除成功");
          });
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
          if (this.editId) {
            this.YPList[
              this.YPList.findIndex((item) => item.id === this.editId)
            ] = this.formFolder;
          } else {
            this.YPList.push({
              ...this.formFolder,
              enable: true
            });
          }
          this.$set(this.argument, "YPList", this.YPList);
          this.updateConfig({ argument: JSON.stringify(this.argument) }, (res) => {
            that.$message.success("创建成功");
            that.$refs.formFolder.resetFields(); //清空表单
            that.confirmLoading = false;
            that.showList = true;
            that.YPList = JSON.parse(res.data.argument).YPList;
          });
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
    }
  }
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
    .action {
      i {
        cursor: pointer;
        font-size: 16px;
        margin: 0 8px;
      }
    }
  }
}
</style>

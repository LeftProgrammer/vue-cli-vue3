<template>
  <div ref="wrap">
    <el-button ghost @click="add" class="add-btn" v-if="showList"
      >创建水面</el-button
    >
    <ul class="ul" v-if="showList">
      <li v-for="(item, index) in SMList" :key="index">
        <div class="title">
          <span @click="addWaterRipple(item)">
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
      <el-form-item label="顶部高度" prop="height">
        <el-input-number
          v-model="formFolder.height"
          controls-position="right"
          :precision="2"
        />
      </el-form-item>
      <el-form-item label="底部高度" prop="bottomHeight">
        <el-input-number
          v-model="formFolder.bottomHeight"
          :precision="2"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="position">
        <el-input v-model="formFolder.position" type="textarea" :rows="2" />
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
      SMList: [],
      pagination: { current: 1, pageSize: 1000 },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        height: [{ required: true, message: '请输入名称', trigger: 'change' }],
        bottomHeight: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ]
      },
      argument: {},
      showList: true
    }
  },
  computed: {},
  mounted() {
    try {
      this.argument = JSON.parse(this.sceneInfo.argument)
      this.SMList = this.argument.SMList || []
    } catch (error) {}
  },
  destroyed() {
    api.Public.clearHandler()
    api.Feature.clearSelectColor()
  },
  watch: {
    'formFolder.position': {
      handler(newVal, oldVal) {
        var WaterRippleRadar = api.Plugin.initWaterRipple()
        WaterRippleRadar.removeWaterRipple(this.formFolder.id)
        WaterRippleRadar.addWaterRipple(
          this.formFolder.id,
          this.formFolder.position,
          this.formFolder.height,
          this.formFolder.bottomHeight,
          [0.2, 0.3, 0.6, 1.0]
        )
      },
      immediate: true // 可选：立即触发一次
    }
  },
  methods: {
    add() {
      const that = this
      this.showList = false
      that.$set(that.formFolder, 'height', 0.1)
      that.$set(that.formFolder, 'bottomHeight ', 0.01)
      that.$set(that.formFolder, 'id', `SM_${new Date().getTime()}`)
      that.$set(that.formFolder, 'position', [])
      that.$message.info('请点击选择要水面区域，不能少与三个点！')
      api.Public.event('LEFT_CLICK', (click) => {
        api.Public.pickupCoordinate(click.position, (data) => {
          var degrees0 = api.Public.radiansToDegrees(data[0])
          var degrees1 = api.Public.radiansToDegrees(data[1])
          const position = that.formFolder.position || []
          position.push(degrees0)
          position.push(degrees1)
          that.$set(that.formFolder, 'position', position)
        })
      })
    },
    addWaterRipple(data) {
      console.log('🚀 ~ addWaterRipple ~ data:', data)
      var WaterRippleRadar = api.Plugin.initWaterRipple()
      const conifg = data || this.formFolder
      WaterRippleRadar.addWaterRipple(
        conifg.id,
        conifg.position,
        conifg.height,
        conifg.bottomHeight,
        [0.2, 0.3, 0.6, 1.0]
      )
    },
    delPos(index) {
      this.formFolder.position.splice(index, 1)
    },
    /**
     * @description 删除视点
     * @param index
     */
    del(index) {
      const that = this
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.SMList.splice(index, 1)
          this.argument.SMList = this.SMList
          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success('删除成功')
            }
          )
        })
        .catch(() => {})
    },
    /**
     * @description 保存
     * @param e
     */
    save(e) {
      const that = this
      e.preventDefault()
      that.$refs.formFolder.validate((valid) => {
        if (valid) {
          that.confirmLoading = true
          this.$set(
            this.argument,
            'SMList',
            this.SMList.concat([
              {
                ...this.formFolder,
                enable: true
              }
            ])
          )

          this.updateConfig(
            { argument: JSON.stringify(this.argument) },
            (res) => {
              that.$message.success('创建成功')
              that.$refs.formFolder.resetFields() //清空表单
              that.confirmLoading = false
              that.showList = true
              that.SMList = JSON.parse(res.data.argument).SMList
            }
          )
        }
      })
    },
    /**
     * @description 是否启用
     */
    changeEnable(item, index) {
      const that = this
      this.argument.SMList = this.SMList
      this.updateConfig({ argument: JSON.stringify(this.argument) }, (res) => {
        that.$message.success('标签修改成功')
        that.SMList = JSON.parse(res.data.argument).SMList
      })
    },
    handleCancel() {
      const that = this
      that.showList = true
    }
  }
}
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

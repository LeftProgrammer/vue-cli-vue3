<template>
  <el-dialog
    v-draggable
    :title="title"
    :visible.sync="dialogShow"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    width="50%"
    @closed="closedHandle"
  >
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="120px"
        :disabled="readonly"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级:" prop="pid">
              <el-cascader
                v-model="formData.pid"
                style="width: 100%"
                :options="tableData"
                :props="{
                  multiple: false,
                  emitPath: false,
                  checkStrictly: true,
                  label: 'name',
                  value: 'id'
                }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'项目名称:'" prop="name">
              <el-input v-model="formData.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'编码:'" prop="code">
              <el-input v-model="formData.code" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属年份:" prop="investmentYear">
              <el-date-picker
                v-model="formData.investmentYear"
                style="width: 100%"
                type="year"
                value-format="yyyy"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ type == 'view' ? '关闭' : '取消' }}
      </el-button>
      <el-button v-if="type != 'view'" type="primary" @click="childEvtHandle">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, update } from './api'
import { FormMixin } from '@/mixins/FormMixin'

export default {
  name: 'Dataform',
  mixins: [FormMixin],
  props: {
    /**显示弹窗 */
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      dialogShow: false,
      formData: {
        id: null
      },

      formDataRules: {
        // pid: [{ required: true, message: '请选择', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        code: [{ required: true, message: '请输入', trigger: 'blur' }],
        investmentYear: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          const newData = { ...this.data }
          this.formData = newData
        }
        this.dialogShow = newValue
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    closedHandle() {
      this.dialogShow = false
      this.$emit('closed')
    },

    childEvtHandle() {
      // 做业务数据的保存,修改。
      this.$refs['dataFormRef'].validate((valid) => {
        if (valid) {
          if (this.type === 'view') {
            this.dialogShow = false
            return
          }
          const fields = {
            ...this.formData
          }
          delete fields.type
          if (this.type === 'add') {
            save(fields)
              .then((res) => {
                const { success, message } = res
                if (!success) {
                  return this.$message.error('保存失败：' + message)
                } else {
                  this.$message.success('新增成功')
                  this.$emit('ok')
                }
                this.closedHandle()
              })
              .catch((err) => {
                console.error(err)
                this.$message.error('新增失败')
              })
          } else {
            save(fields)
              .then((res) => {
                const { success, message } = res
                if (!success) {
                  return this.$message.error('保存失败：' + message)
                } else {
                  this.$message.success('更新成功')
                  this.$emit('ok')
                }
                this.closedHandle()
              })
              .catch((err) => {
                console.error(err)
                this.$message.error('更新失败')
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>

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
            <el-form-item :label="'职位名称:'" prop="name">
              <el-input v-model="formData.name" placeholder="请输入" maxlength="255" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顺序号:" prop="sort">
              <el-input-number
                v-model="formData.sort"
                :controls="false"
                :step-strictly="true"
                :step="1"
                placeholder="请输入顺序号"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员:" prop="user">
              <el-input
                v-model="formData.user"
                placeholder="请输入"
                show-word-limit
                type="textarea"
                :rows="4"
                maxlength="5000"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col v-if="formData.type === 2" :span="12">
            <el-form-item label="联系方式:" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入" />
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="职责:" prop="responsibility">
              <el-input
                v-model="formData.responsibility"
                placeholder="请输入"
                show-word-limit
                type="textarea"
                :rows="2"
                maxlength="5000"
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
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log('visible', newValue)
        if (newValue) {
          const newData = { ...this.data }
          this.formData = newData
          // if (this.type !== 'add') {
          // }
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
    userChange(value, item) {
      this.$set(this.formData, 'user', item.realName || '')
      this.$set(this.formData, 'phone', item.mobile || '')
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
                  this.$emit('ok')
                }
                this.closedHandle()
              })
              .catch((err) => {
                console.error(err)
                this.$message.error('新增失败')
              })
          } else {
            update(fields)
              .then((res) => {
                const { success, message } = res
                if (!success) {
                  return this.$message.error('保存失败：' + message)
                } else {
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

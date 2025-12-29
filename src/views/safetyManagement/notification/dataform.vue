<template>
  <div style="padding: 10px">
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通告名称" prop="name">
              <el-input
                v-model="formData.name"
                :disabled="isEdit"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起日期" prop="releaseDate">
              <el-date-picker
                v-model="formData.releaseDate"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
                :disabled="isEdit"
                type="date"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="对应处室负责人" prop="emergencyEventManage">
              <user
                v-model="formData.emergencyEventManage"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('professionalManagement')" :span="12">
            <el-form-item label="专业分管副总" prop="professionalManagement">
              <user
                v-model="formData.professionalManagement"
                :readonly="flowDisabled('professionalManagement')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('needReview')" :span="12">
            <el-form-item label="是否需要复核" prop="needReview">
              <el-switch
                v-model="formData.needReview"
                :disabled="flowDisabled('needReview')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('generalManager')" :span="12">
            <el-form-item label="总经理" prop="generalManager">
              <user
                v-model="formData.generalManager"
                :readonly="flowDisabled('generalManager')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-bottom: 16px">
          <DefaultTitle title="通告内容">
            <div v-if="!formData.id">
              <el-button style="margin-right: 10px" @click="customButton">保存模版
              </el-button>
              <el-dropdown :hide-on-click="false" trigger="click">
                <el-button>
                  应用模板<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in templateList"
                      :key="item.id"
                      :command="item.id"
                    >
                      <div>
                        <span @click="useTemplate(item.id)">
                          {{ item.name }}
                        </span>
                        <el-icon
                          style="margin: 0 10px"
                          @click="deleteTemplate(item.id)"
                        >
                          <Delete />
                        </el-icon>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </DefaultTitle>
        </div>
        <div style="border: 1px solid #ccc; margin-bottom: 16px">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :default-config="toolbarConfig"
            :mode="mode"
          />
          <Editor
            v-model="formData.content"
            style="height: 500px; overflow-y: hidden"
            :default-config="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
          />
        </div>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { save, listTemplate, saveTemplate, deleteTemplate } from './api'
import { FlowFormMixin } from '@/mixins/FlowFormMixin'
import { dateFormat } from '@/utils'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { ArrowDown, Delete } from '@element-plus/icons-vue'

export default {
  name: 'DataForm',
  components: { Editor, Toolbar, ArrowDown, Delete },
  mixins: [FlowFormMixin],
  data() {
    return {
      formData: {},
      formDataRules: {
        releaseDate: [{ required: true, message: '请选择', trigger: 'change' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        emergencyEventManage: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        professionalManagement: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        needReview: [{ required: true, message: '请选择', trigger: 'change' }],
        generalManager: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      loading: false,
      url: {
        list: '/api/safe/notification/page'
      },
      dialogVisible: false,
      tableData: [],
      editor: null,
      toolbarConfig: {
        excludeKeys: [
          'emotion',
          'codeBlock',
          'insertLink',
          'insertTable',
          'group-video',
          'group-image'
        ]
      },
      editorConfig: { placeholder: '请添加公告内容' },
      mode: 'default',
      templateList: []
    }
  },
  computed: {
    userInfo() {
      return this.$getStorage('userInfo')
    },
    isEdit() {
      if (this.formData.flowStatus == 2 || this.flowInfo?.page == 'fine') {
        return Boolean(true)
      } else {
        return Boolean(false)
      }
    },
    flowDisabled() {
      return (field) => {
        let disabled = true
        switch (field) {
          case 'emergencyEventManage':
            disabled = this.flowInfo?.page != 'todo' || this.formData.id
            break
          case 'professionalManagement':
            disabled = !(
              this.flowInfo?.page == 'todo' &&
              this.formData.matterTaskTodo?.procTaskName == '处室负责人'
            )
            break
          case 'generalManager':
            disabled =
              this.flowInfo?.page != 'todo' ||
              this.formData.matterTaskTodo?.procTaskName == '总经理'
            break
          case 'needReview':
            disabled = !(
              this.flowInfo?.page == 'todo' &&
              this.formData.matterTaskTodo?.procTaskName == '专业分管副总'
            )
            break
        }
        return Boolean(disabled)
      }
    },
    flowShow() {
      return (field) => {
        let show = true
        switch (field) {
          case 'emergencyEventManage':
            break
          case 'professionalManagement':
            show = this.formData.id
            break
          case 'generalManager':
            show = this.formData.needReview
            break
          case 'needReview':
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != '处室负责人')
            break
        }
        return Boolean(show)
      }
    }
  },
  mounted() {},
  beforeUnmount() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy()
  },
  methods: {
    customButton() {
      this.$prompt('请输入模版名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (val) => {
          if (!val) return '请输入模版名称'
        }
      }).then(({ value }) => {
        saveTemplate({ name: value, content: this.formData.content }).then(
          (res) => {
            this.getTemplateList()
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          }
        )
      })
    },
    useTemplate(id) {
      const html = this.templateList.find((x) => x.id === id).content
      this.formData.content = html
    },
    deleteTemplate(id) {
      this.$confirm('确定删除模版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTemplate({ id }).then((res) => {
          this.getTemplateList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    onCreated(editor) {
      this.editor = Object.seal(editor)
      console.log(this.editor.getConfig(), 'toolbar')
    },
    handlerUserChange(filed, value, record) {
      this.formData[filed] = record.realName
      console.log('formdata', this.formData)
    },
    getTemplateList() {
      listTemplate().then((res) => {
        this.templateList = res.data
      })
    },
    async getFormData() {
      const row = await this.getFlowRow()
      this.getTemplateList()
      if (row) {
        this.formData = row
        if (typeof this.formData.needReview === 'number') {
          this.formData.needReview = this.formData.needReview === 1
        }
      } else {
        this.formData.releaseDate = new Date()
      }
    },
    save(fields, callback, event) {
      const isMaintenance = event.data.btnKey === 'maintenance'
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: 'maintenance'
          },
          event.origin
        )
        return
      }
      fields.releaseDate = dateFormat(fields.releaseDate, "YYYY-MM-DD")
      if (!fields.createUsername) {
        fields.createUsername = this.userInfo.realName
      }
      if (typeof fields.needReview === 'boolean') {
        fields.needReview = fields.needReview ? 1 : 2
      }
      save(fields)
        .then((res) => {
          const { success, message } = res
          if (!success) {
            return this.$message.error('新增失败：' + message)
          } else {
            callback && callback()
          }
        })
        .catch((err) => {
          console.error(err)
          this.$message.error('新增失败')
        })
    },
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey
      if (btnKey === 'submit') return
      let extData = {}
      extData['emergencyEventManage'] = {
        type: 'user',
        value: this.formData.emergencyEventManage
      }
      this.sendFlowJson = extData
      console.log('this.sendFlowJson', this.sendFlowJson)
    },
    async beforeSubmitButton() {
      let extData = {}
      extData['professionalManagement'] = {
        type: 'user',
        value: this.formData.professionalManagement
      }
      extData['generalManager'] = {
        type: 'user',
        value: this.formData.generalManager
      }
      extData['needReview'] = {
        type: 'int',
        value: this.formData.needReview ? 1 : 2
      }
      this.sendFlowJson = extData
    },
    closedDialog() {
      this.oprateRow.dialogShow = false
    },
    deleteRow(index) {
      this.tableData.splice(index, 1)
      this.multipleSelection.splice(index, 1)
    },
    handelAdd() {
      this.dialogVisible = false
      this.tableData = JSON.parse(JSON.stringify(this.multipleSelection))
    }
  }
}
</script>

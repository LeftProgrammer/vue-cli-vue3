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
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :disabled="isEdit"
                type="date"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="通告类型" prop="type">
              <el-select
                v-model="formData.type"
                class="w-100pre"
                :disabled="isEdit"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in notificationTypeList"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.dictCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
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
                  应用模板<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in templateList"
                    :key="item.id"
                    :command="item.id"
                  >
                    <div>
                      <span @click="useTemplate(item.id)">
                        {{ item.name }}
                      </span>
                      <i
                        class="el-icon-delete"
                        style="margin: 0 10px"
                        @click="deleteTemplate(item.id)"
                      />
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
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
import { save, page, listTemplate, saveTemplate, deleteTemplate } from './api'
import { FlowFormMixin } from '@/mixins/FlowFormMixin'
import { dateFormat } from '@/utils'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IToolbarConfig } from '@wangeditor/editor'
export default {
  name: 'DataForm',
  components: { Editor, Toolbar },
  mixins: [FlowFormMixin],
  data() {
    return {
      formData: {},
      formDataRules: {
        releaseDate: [{ required: true, message: '请选择', trigger: 'change' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
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
      //正在加载
      loading: false,
      url: {
        list: '/api/safe/notification/page'
      },
      dialogVisible: false,
      tableData: [],
      notificationTypeList: [],
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
      mode: 'default', // or 'simple'
      templateList: []
    }
  },
  computed: {
    /**当前登录用户 */
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
    // 审批字段的禁用
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
    // 审批字段的显示
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
  mounted() {
    // // 模拟 ajax 请求，异步渲染编辑器
    // setTimeout(() => {
    //   this.html = '<p>请添加公告内容</p>'
    // }, 1500)
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
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
      this.$set(this.formData, 'content', html)
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
    /**获取字典 */
    // async getDictItemList() {
    //   const notificationType = await getDictItemList('notification_type')
    //   this.notificationTypeList = notificationType.data
    // },

    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      console.log(this.editor.getConfig(), 'toolbar')
    },
    handlerUserChange(filed, value, record) {
      this.$set(this.formData, filed, record.realName)
      console.log('formdata', this.formData)
    },
    getTemplateList() {
      listTemplate().then((res) => {
        this.templateList = res.data
      })
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow()
      this.getTemplateList()
      if (row) {
        this.formData = row
        if (typeof this.formData.needReview === 'number') {
          this.$set(this.formData, 'needReview', this.formData.needReview === 1)
        }
      } else {
        this.$set(this.formData, 'releaseDate', new Date())
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
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
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

<style src="@wangeditor/editor/dist/css/style.css"></style>

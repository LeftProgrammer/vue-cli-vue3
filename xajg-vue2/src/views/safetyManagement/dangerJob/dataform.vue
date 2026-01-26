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
            <el-form-item label="施工单位" prop="constructionUnit">
              <el-select
                v-model="formData.constructionUnit"
                class="w-100pre"
                placeholder="请选择"
                :disabled="readonly"
                @visible-change="$visibleChange($event, 'el-popper')"
              >
                <el-option
                  v-for="item in unitList"
                  :key="item.corpId"
                  :label="item.corpName"
                  :value="item.corpId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业负责人" prop="operationManager">
              <user v-model="formData.operationManager" :readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险作业名称" prop="operationName">
              <el-input
                v-model="formData.operationName"
                placeholder="请输入"
                :disabled="readonly"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危险作业时间" prop="date">
              <el-date-picker
                v-model="formData.date"
                style="width: 100%"
                :disabled="readonly"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="危险作业区域" prop="operationArea">
              <el-input
                v-model="formData.operationArea"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                :disabled="readonly"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="危险作业内容" prop="operationContent">
              <el-input
                v-model="formData.operationContent"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                :disabled="readonly"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="管控措施" prop="controlMeasures">
              <el-input
                v-model="formData.controlMeasures"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                :disabled="readonly"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="施工生产经理"
              prop="constructionProductionManager"
            >
              <user
                v-model="formData.constructionProductionManager"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('supervisor')" :span="12">
            <el-form-item label="监理员" prop="supervisor">
              <user
                v-model="formData.supervisor"
                :readonly="flowDisabled('supervisor')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('professionalSupervisoryEngineer')" :span="12">
            <el-form-item
              label="专业监理工程师"
              prop="professionalSupervisoryEngineer"
            >
              <user
                v-model="formData.professionalSupervisoryEngineer"
                :readonly="flowDisabled('professionalSupervisoryEngineer')"
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
          <el-col v-if="flowShow('safetySupervisionEngineer')" :span="12">
            <el-form-item
              label="安全监理工程师"
              prop="safetySupervisionEngineer"
            >
              <user
                v-model="formData.safetySupervisionEngineer"
                :readonly="flowDisabled('safetySupervisionEngineer')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="flowShow('ticketFace')" :span="24">
            <el-form-item label="危险作业票面" prop="ticketFace">
              <uploadFile
                v-model="formData.ticketFace"
                accept=".png,.jpg,.jpeg"
                :limit="5"
                :max-size="50"
                :readonly="flowDisabled('ticketFace')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件" prop="uploadFile">
              <uploadFile
                v-model="formData.uploadFile"
                accept=".png,.jpg,.jpeg"
                :limit="5"
                :max-size="50"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          "
        >
          <DefaultTitle title="特种作业人员" />
          <el-button
            v-if="!formData.id"
            type="primary"
            @click="dialogVisible = true"
          >新增</el-button>
        </div>
        <el-table ref="multipleTable" border :data="tableData" height="300">
          <el-table-column
            label="姓名"
            fixed="left"
            prop="name"
            align="center"
          />
          <el-table-column label="电话" prop="phone" align="center" />
          <el-table-column
            label="操作"
            prop="name"
            width="250"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!formData.id"
                type="text"
                @click.native.prevent="deleteRow(scope.$index)"
              >
                删除
              </el-button>
              <el-button type="text" @click="viewStaff(scope.row)">
                查看证书
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-row>
    <el-dialog
      title="添加特种作业人员"
      :visible.sync="dialogVisible"
      width="45%"
    >
      <el-form :inline="true" :model="staffQuery" style="margin-bottom: 12px">
        <el-form-item label="姓名">
          <el-input v-model="staffQuery.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="filterStaff">查询</el-button>
          <el-button icon="el-icon-refresh-left" @click="resetStaff">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="staffData"
        style="width: 100%"
        height="300"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="电话" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handelAdd">确 定</el-button>
      </span>
    </el-dialog>
    <dataform
      v-if="oprateRow.dialogShow"
      type="view"
      title="详情"
      :visible="oprateRow.dialogShow"
      :data="oprateRow.data"
      :readonly="oprateRow.isView"
      @closed="closedDialog"
    />
  </div>
</template>

<script>
import { save, getSection, unitAllList } from './api'
import { FlowFormMixin } from '@/mixins/FlowFormMixin'
import { dateFormat } from '@/utils'
import { page } from '@/views/safetyManagement/staffManagement/api'
import dataform from '@/views/safetyManagement/staffManagement/dataform'
export default {
  name: 'DataForm',
  components: { dataform },
  mixins: [FlowFormMixin],
  data() {
    return {
      isFormApp: false,
      formData: {},
      formDataRules: {
        constructionUnit: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        safetySupervisionEngineer: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        professionalSupervisoryEngineer: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        date: [{ required: true, message: '请选择', trigger: 'change' }],
        needReview: [{ required: true, message: '请选择', trigger: 'change' }],
        ticketFace: [
          { required: true, message: '请上传危险作业票', trigger: 'change' }
        ],
        supervisor: [{ required: true, message: '请选择', trigger: 'change' }],
        constructionProductionManager: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        operationName: [{ required: true, message: '请输入', trigger: 'blur' }],
        operationArea: [{ required: true, message: '请输入', trigger: 'blur' }],
        operationContent: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      //正在加载
      loading: false,
      url: {
        list: '/api/safe/dangerJob/page'
      },
      dialogVisible: false,
      tableData: [],
      staffData: [],
      staffDataAll: [],
      staffQuery: { name: '' },
      multipleSelection: [],
      oprateRow: {
        dialogShow: false
      },
      unitList: []
    }
  },
  computed: {
    // 审批字段的禁用
    flowDisabled() {
      return (field) => {
        let disabled = true
        switch (field) {
          case 'supervisor':
            disabled =
              this.flowInfo?.page != 'todo' ||
              this.formData.matterTaskTodo?.procTaskName != '施工生产经理'
            break
          case 'needReview':
            disabled =
              this.flowInfo?.page != 'todo' ||
              this.formData.matterTaskTodo?.procTaskName != '专业监理工程师'
            break
          case 'safetySupervisionEngineer':
            disabled =
              this.flowInfo?.page != 'todo' ||
              this.formData.matterTaskTodo?.procTaskName != '专业监理工程师'
            break
          case 'professionalSupervisoryEngineer':
            disabled =
              this.flowInfo?.page != 'todo' ||
              this.formData.matterTaskTodo?.procTaskName != '监理员'
            break
          case 'ticketFace':
            disabled = this.flowInfo?.page != 'todo'
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
          case 'supervisor':
            show =
              this.formData.id &&
              (this.formData.matterTaskTodo?.procTaskName ||
                this.formData.flowStatus == 2)
            break
          case 'needReview':
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.id &&
                this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != '施工生产经理' &&
                this.formData.matterTaskTodo?.procTaskName != '监理员')
            break
          case 'safetySupervisionEngineer':
            show =
              (this.formData.flowStatus == 2 && this.formData.needReview) ||
              (this.formData.id &&
                this.formData.needReview &&
                this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != '施工生产经理' &&
                this.formData.matterTaskTodo?.procTaskName != '监理员')
            break
          case 'professionalSupervisoryEngineer':
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.id &&
                this.formData.matterTaskTodo?.procTaskName &&
                this.formData.matterTaskTodo?.procTaskName != '施工生产经理')
            break
          case 'ticketFace':
            show =
              this.formData.flowStatus == 2 ||
              (this.formData.id &&
                this.formData.matterTaskTodo?.procTaskName &&
                ((this.formData.matterTaskTodo?.procTaskName ==
                  '专业监理工程师' &&
                  !this.formData.needReview) ||
                  (this.formData.matterTaskTodo?.procTaskName ==
                    '安全监理工程师' &&
                    this.formData.needReview)))
            break
        }
        return Boolean(show)
      }
    },
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage('userInfo')
    }
  },
  created() {
    this.getUnit()
  },
  mounted() {},
  // 页面离开时触发
  beforeDestroy() {
    if (this.fromapp) {
      const titleElement = document.getElementById('dynamicTitle')
      // 设置动态标题
      titleElement.textContent = '雄安调蓄工程建设管理系统'
    }
  },
  methods: {
    viewStaff(row) {
      console.log(row, '-------')
      this.oprateRow.data = row
      this.oprateRow.dialogShow = true
      this.oprateRow.isView = true
    },
    closedDialog() {
      this.oprateRow.dialogShow = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteRow(index) {
      this.tableData.splice(index, 1)
      this.multipleSelection.splice(index, 1)
    },
    handelAdd() {
      this.dialogVisible = false
      this.tableData = JSON.parse(JSON.stringify(this.multipleSelection))
    },
    // 获取所有的单位
    async getUnit() {
      try {
        const result = await unitAllList()
        const { data, success } = result
        if (!success) {
          this.$message.error('获取单位列表失败')
          return
        }
        this.unitList = data
          .filter((x) => x.corpPid)
          .sort((a, b) => {
            return a.corpSort - b.corpSort
          })
      } catch (err) {
        console.log('err', err)
      }
    },
    /**
     * @description 选中用户 回显部门
     * @param filed
     * @param value
     * @param record
     */
    handlerUserChange(filed, value, record) {
      this.$set(this.formData, filed, record.departName)
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      let btnKey = eventData?.btnKey
      if (btnKey === 'submit') return
      let extData = {}
      extData['constructionProductionManager'] = {
        type: 'user',
        value: this.formData.constructionProductionManager
      }
      this.sendFlowJson = extData
      console.log('this.sendFlowJson', this.sendFlowJson)
    },
    async beforeSubmitButton() {
      let extData = {}
      extData['supervisor'] = {
        type: 'user',
        value: this.formData.supervisor
      }
      extData['professionalSupervisoryEngineer'] = {
        type: 'user',
        value: this.formData.professionalSupervisoryEngineer
      }
      extData['safetySupervisionEngineer'] = {
        type: 'user',
        value: this.formData.safetySupervisionEngineer
      }
      extData['needReview'] = {
        type: 'int',
        value: this.formData.needReview ? 1 : 2
      }
      console.log('this.sendFlowJson', JSON.stringify(extData))
      this.sendFlowJson = extData
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
      fields.startTime = dateFormat(fields.date[0], 'YYYY-MM-DD HH')
      fields.endTime = dateFormat(fields.date[1], 'YYYY-MM-DD HH')
      delete fields.date
      if (this.tableData.length > 0) {
        fields.staffIds = this.tableData.map((x) => x.id).join(',')
      }
      fields.needReview = fields.needReview ? 1 : 2
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
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow()
      if (row) {
        // Object.assign(this.formData, row);
        this.tableData = row.staffInfoVoList || []
        this.multipleSelection = row.staffInfoVoList
        this.formData = row
        this.formData.needReview = this.formData.needReview == 1 ? true : false
        this.formData.date = [
          new Date(row.startTime + ':00:00'),
          new Date(row.endTime + ':00:00')
        ]
        console.log(this.formData)
      } else {
        page({
          current: 1,
          entity: {
            params: {
              type: 'tzry',
              state: '2'
            }
          },
          pageSize: 999,
          size: 999
        }).then((res) => {
          this.staffDataAll = res.data.records || []
          this.staffData = [...this.staffDataAll]
        })
      }
    },
    filterStaff() {
      const name = (this.staffQuery.name || '').trim()
      this.staffData = this.staffDataAll.filter((x) => {
        const okName = name ? String(x.name || '').includes(name) : true
        return okName
      })
    },
    resetStaff() {
      this.staffQuery = { name: '' }
      this.staffData = [...this.staffDataAll]
    },
    async getSectionList(corporateId) {
      try {
        const { data, success, message } = await getSection({
          corpId: corporateId
        })

        if (!success) {
          this.$message.error('查询标段失败：' + message)
          return false
        }
        this.sectionList = data
        return data
      } catch (err) {
        console.error(err)
        this.$message.error('查询标段失败')
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
// 单独处理  上传样式

/deep/.custom-disabled {
  .upload-demo {
    display: none;
  }
}

/deep/ .taskname {
  .el-form-item__content {
    top: 8px !important;

    .el-input__count {
      height: 25px;
      line-height: 25px;
      bottom: 3px;
      // background: transparent;
      // bottom: -3px;
    }
  }
}

/deep/ .taskname .cell {
  // overflow: auto;
  overflow: visible;
  display: flex;
  justify-content: center;
}

/deep/ .el-table {
  th.required.taskname {
    .cell::before {
      content: '*';
      width: 5px;
      height: 0px;
      margin-top: 2px;
      color: #ff4d51;
    }
  }
}

/deep/ .file-list {
  margin-top: 3px !important;

  .icon {
    background-color: transparent !important;
    margin-right: 5px;
  }
}

::v-deep .el-divider--horizontal {
  margin: 18px 0;
}

::v-deep .el-table__row {
  .el-form-item__content {
    margin-left: 0px !important;
  }
}

/deep/ .el-form-item__content {
  // min-width: auto !important;
  line-height: 34px !important;
}
</style>

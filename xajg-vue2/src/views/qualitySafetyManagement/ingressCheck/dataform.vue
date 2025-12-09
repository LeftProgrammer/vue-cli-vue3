<template>
  <div style="padding: 10px">
    <el-row>
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="formDataRules"
        :disabled="readonly"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文件类型" prop="type">
              <el-select
                v-model="formData.type"
                placeholder="请选择文件类型"
                style="width: 100%"
              >
                <el-option
                  label="原材料/中间产品进场报验单"
                  value="material"
                ></el-option>
                <el-option
                  label="施工设备进场报验单"
                  value="equipment"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-date-picker
                v-model="formData.year"
                :disabled="readonly"
                type="year"
                style="width: 100%"
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段" prop="sectionId">
              <el-select
                class="w-100pre"
                v-model="formData.sectionId"
                clearable
                placeholder="请选择"
                @change="changeSection"
              >
                <el-option
                  v-for="item in sectionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报验结果" prop="testResults">
              <el-select
                v-model="formData.testResults"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="不合格" value="bhg"></el-option>
                <el-option label="合格" value="hg"></el-option>
                <el-option label="优良" value="yl"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程编号" prop="code">
              <el-input v-model="formData.code" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="正文附件:" prop="mainAttachment">
              <uploadFile
                :readonly="readonly"
                v-model="formData.mainAttachment"
                :limit="1"
                :multiline="false"
              >
              </uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他附件:" prop="otherAttachment">
              <uploadFile
                :readonly="readonly"
                v-model="formData.otherAttachment"
                :limit="1"
                :multiline="false"
              >
              </uploadFile>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进场时间" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                :disabled="readonly"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.type == 'equipment'">
            <el-form-item label="设备用途" prop="equipmentPurpose">
              拟用于<el-input
                v-model="formData.equipmentPurpose"
                placeholder="请输入设备用途"
                show-word-limit
                maxlength="50"
              />的施工
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.type == 'material'">
            <el-form-item label="拟用部位" prop="intendedSite">
              <el-cascader
                style="width: 100%"
                v-model="formData.intendedSite1"
                :options="intendedSiteOptions"
                :props="intendedSiteProps"
                :show-all-levels="false"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写人" prop="initiator ">
              <user v-model="formData.initiator" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="formData.phone" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写部门" prop="unitName">
              <el-input v-model="formData.unitName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起日期" prop="initiationDate">
              <el-date-picker
                v-model="formData.initiationDate"
                disabled
                type="date"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="质量监理工程师"
              prop="qualitySupervisionEngineer"
            >
              <user
                v-model="formData.qualitySupervisionEngineer"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!--    原材料/中间产品进场报验单-->
        <el-row
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="width: 50%; color: #000">
            {{
              formData.type == 'equipment'
                ? '施工设备进场报验单'
                : '原材料/中间产品进场报验单'
            }}
          </div>
          <div style="width: 50%; text-align: right">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addDetailBtn()"
              :disabled="readonly"
            >
              添加
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteDetailBtn()"
              :disabled="readonly"
            >
              删除
            </el-button>
          </div>
        </el-row>
        <el-divider></el-divider>

        <el-row class="table" v-if="formData.type == 'material'">
          <el-table
            ref="multipleTable1"
            border
            :data="tableData"
            style="max-height: 50vh; overflow: auto"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="序号"
              type="selection"
              width="80"
              align="center"
            />
            <el-table-column
              label="原材料单号"
              prop="materialCode"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.materialCode" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="原材料/中间产品名称"
              prop="materialName"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.materialName" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="原材料/中间产品来源"
              prop="materialSource"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.materialSource" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="原材料/中间产品规格"
              prop="materialSpec"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.materialSpec" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="用途"
              prop="purpose"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.purpose" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="本批原材料/中间产品数量"
              prop="materialQuantity"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input
                    v-model="row.materialQuantity"
                    placeholder="请输入"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              prop="unit"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.unit" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="试样来源"
              prop="sampleSource"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.sampleSource" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="取样地点"
              prop="sampleLocation"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.sampleLocation" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="取样日期"
              prop="sampleDate"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-date-picker
                  v-model="row.sampleDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              label="试验日期"
              prop="testDate"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-date-picker
                  v-model="row.testDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              label="试验结果"
              prop="testResult"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.testResult" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="质检负责人"
              prop="inspectorName"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.inspectorName" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="table" v-if="formData.type == 'equipment'">
          <el-table
            ref="multipleTable2"
            border
            :data="tableEquipmentData"
            style="max-height: 50vh; overflow: auto"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="序号"
              type="selection"
              width="80"
              align="center"
            />
            <el-table-column
              label="设备名称"
              prop="equipmentName"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.equipmentName" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="规格型号"
              prop="equipmentSpec"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.equipmentSpec" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              prop="equipmentQuantity"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input
                    v-model="row.equipmentQuantity"
                    placeholder="请输入"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="进场时间"
              prop="startDate"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-date-picker
                  v-model="row.startDate"
                  type="datetime"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              label="完好状况"
              prop="conditions"
              align="center"
              width="200"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.conditions" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="设备权属"
              prop="ownership"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.ownership" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="生产能力"
              prop="capacity"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.capacity" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              prop="remark"
              align="center"
              width="150"
            >
              <template slot-scope="{ row }">
                <el-form-item>
                  <el-input v-model="row.remark" placeholder="请输入" />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { save, getSection, getArchiveFileCatalogueManagerTree } from './api'
import { FlowFormMixin } from '@/mixins/FlowFormMixin'
import { getDictItemTree } from '@/api/dict'
import TreeSelect from '@/components/TreeSelect/index.vue'

export default {
  name: 'dataform',
  mixins: [FlowFormMixin],
  components: { TreeSelect },
  data() {
    return {
      intendedSiteOptions: [],
      intendedSiteProps: {
        value: 'code',
        label: 'nodeName',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
        multiple: true
      },
      formData: {
        type: 'material'
      },
      formDataRules: {
        testResults: [{ required: true, message: '请选择', trigger: 'change' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        year: [{ required: true, message: '请选择', trigger: 'change' }],
        name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入流程编号', trigger: 'blur' }],
        startDate: [
          { required: true, message: '请选择进场时间', trigger: 'change' }
        ],
        equipmentPurpose: [
          { required: true, message: '请输入设备用途', trigger: 'blur' }
        ],
        intendedSite: [
          { validator: this.validateIntendedSite, required: true }
        ],
        qualitySupervisionEngineer: [
          {
            required: true,
            message: '请选择质量监理工程师',
            trigger: 'change'
          }
        ],
        // constructionLeader: [
        //   {required: true, message: '请选择施工分部负责人', trigger: 'change'}
        // ],
        // supervisionDepartment: [
        //   {required: true, message: '请选择监理部', trigger: 'change'}
        // ],
        sectionId: [
          { required: true, message: '请选择标段', trigger: 'change' }
        ]
      },
      //正在加载
      loading: false,
      attachmentList: [],
      url: {
        list: '/api/quality/check/page'
      },
      tableData: [],
      tableEquipmentData: [],
      multipleSelection: [],
      sectionList: []
      // testResults: [],
    }
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage('userInfo')
    }
  },
  mounted() {
    this.getDictItemList()
    this.getSectionList()

    // this.initIntendedSiteOptions();
  },
  methods: {
    initSection() {
      if (this.formData.sectionId) {
        this.changeSection(this.formData.sectionId)
      }
    },
    changeSection(sectionId) {
      this.initIntendedSiteOptions(sectionId)
    },
    async initIntendedSiteOptions(sectionId) {
      let params = {}
      params.sectionIds = sectionId
      const res = await this.getArchiveFileCatalogueManagerTree(params)
    },

    async getArchiveFileCatalogueManagerTree(params) {
      try {
        const { data, success, message } =
          await getArchiveFileCatalogueManagerTree(params)
        if (!success) {
          this.$message.error('获取目录树失败：' + message)
          return false
        }
        this.intendedSiteOptions = data[0].children
        return data
      } catch (err) {
        console.error(err)
        this.$message.error('获取目录树失败')
        return false
      }
    },
    /**获取字典 */
    async getDictItemList() {
      const attachments = await getDictItemTree('ATTACHMENT_TYPE')
      this.attachmentList = attachments.data
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      console.log('🚀 ~ beforeSend ~ eventData:', eventData)
      let extData = {}
      extData['qualitySupervisionEngineer'] = {
        type: 'user',
        value: this.formData.qualitySupervisionEngineer
      }
      this.sendFlowJson = extData
      console.log('this.sendFlowJson', this.sendFlowJson)
    },
    save(fields, callback, event) {
      if (this.formData.fileList && this.formData.fileList.length > 0) {
        fields.fileList = JSON.stringify(this.formData.fileList)
      }
      if (
        this.formData.intendedSite1 &&
        this.formData.intendedSite1.length > 0
      ) {
        fields.intendedSite1 = JSON.stringify(this.formData.intendedSite1)
      }
      if (this.tableData && this.tableData.length > 0) {
        fields.detailVos = this.tableData
      }
      if (this.tableEquipmentData && this.tableEquipmentData.length > 0) {
        fields.equipmentVos = this.tableEquipmentData
      }
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
        this.formData = row
        this.formData.intendedSite1 = JSON.parse(this.formData.intendedSite1)
        if (row.detailVos) {
          this.tableData = row.detailVos
        }
        this.initSection()
        console.log('🚀 ~ getFormData ~ this.formData:', row)
      } else {
        console.log('this.userInfo', this.userInfo)
        this.$set(this.formData, 'initiator', this.userInfo.userId)
        this.$set(this.formData, 'unitName', this.userInfo.corpName)
        this.$set(this.formData, 'phone', this.userInfo.mobile)
        this.$set(this.formData, 'initiationDate', new Date())
      }
    },
    getAttachmnetType(code) {
      const findNode = (nodes, code) => {
        for (const node of nodes) {
          if (node.dictCode === code) {
            return node
          }
          if (node.children && node.children.length > 0) {
            const foundNode = findNode(node.children, code)
            if (foundNode) {
              return foundNode
            }
          }
        }
        return ''
      }
      return findNode(this.attachmentList, code)
    },
    onNodeSelectEvent(selected) {
      console.log('selected', selected)
      console.log('selected', this.formData)
      if (selected) {
        this.formData.type = selected.meta.dictCode
      }
    },
    addDetailBtn() {
      if (this.formData.type == 'material') {
        this.tableData.push({})
      } else if (this.formData.type == 'equipment') {
        this.tableEquipmentData.push({})
      }
    },
    async deleteDetailBtn() {
      await this.$confirm(`确认删除数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
      // 删除选中的数据
      this.multipleSelection.forEach((selectedItem) => {
        if (this.formData.type == 'material') {
          const index = this.tableData.indexOf(selectedItem)
          if (index > -1) {
            this.tableData.splice(index, 1)
          }
        } else if (this.formData.type == 'equipment') {
          const index = this.tableEquipmentData.indexOf(selectedItem)
          if (index > -1) {
            this.tableEquipmentData.splice(index, 1)
          }
        }
      })
      // 清空选中的数据
      this.multipleSelection = []
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    validateIntendedSite(rule, value, callback) {
      if (!this.formData.intendedSite1) {
        callback(new Error('请输入拟用部位'))
      } else {
        callback()
      }
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

/deep/ .custom-disabled {
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

<template>
  <div class="side-frame">
    <a-card :bordered="false">
      <a-layout-sider class="model-tree-box model-closing-box">
        <a-tree :tree-data="modelClosingTree"
                @check="onCheckTree"
                v-model="checkedItems"
                :selectedKeys="selectedKeys"
                :expandedKeys="expandedKeys"
                :autoExpandParent="true"
                @expand="onExpand"
                @select="onSeTree"
                checkable
                class="model-tree" />
      </a-layout-sider>
    </a-card>
    <a-card :bordered="false" class="side-frame-btn">
      <a-button type="primary" @click="CreatModelClosing">保存</a-button>
    </a-card>
    <a-modal v-model="createModelClosing" class="form-box" title="合模" :maskClosable="false" :width="400" ok-text="确认" cancel-text="取消" @cancel="handleCancel" @ok="onClosingSubmit">
      <a-form-model ref="ruleViewForm" :model="closingForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" :destroyOnClose="true">
        <a-form-model-item ref="name" label="合模名称" prop="name">
          <a-input v-model="closingForm.name" />
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-input v-model="closingForm.desc" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>

</template>
<script>
import { getDocTree } from '@/components/BimEngine/api/document'
import { setModelClosingData } from '@/components/BimEngine/api/engine'
export default {
  props: {
    projectMessage: {
      type: Object,
      default: undefined,
    },
    addModelFun: {
      type: Function,
    },
    delModelFun:{
      type: Function
    },
    modelList: {
      type: Array,
    },
    changeProject: {
      type: Function,
    },
  },
  data() {
    return {
      modelClosingTree: [],
      checkedItems: [], //用于清除选中状态
      createModelClosing: false,
      closingForm: {
        name: '',
        desc: '',
      },
      rules: {
        name: [{ required: true, message: '请填写合模名称', trigger: 'change' }],
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      selectedKeys: [],
      expandedKeys: [],
    }
  },
  async mounted() {
    await this.GetModelClosingTrees()
  },
  methods: {
    async GetModelClosingTrees() {
      //获取
      const that = this
      const res = await getDocTree(that.projectMessage.projectId, undefined, true)
      that.searchOption(res)
      that.modelClosingTree = res
      this.expandedKeys.push(res[0].key)
      this.selectedKeys.push(res[0].key)
      for (let i = 0; i < that.projectMessage.modelList.length; i++) {
        that.checkedItems.push(that.projectMessage.modelList[i].id)
      }
    },
    searchOption(arr) {
      //首先循环arr最外层数据
      for (let s = 0; s < arr.length; s++) {
        //如果匹配到了arr最外层中的我需要修改的数据
        //如果是修改，利用Object.assign()组合符合arr数据格式的对象，并进行修改
        if (!arr[s].isModel) {
          arr[s].disableCheckbox = true
        }
        if (arr[s].children && arr[s].children.length > 0) {
          // 递归条件
          this.searchOption(arr[s].children)
        } else {
          continue
        }
      }
    },
    onCheckTree(checkedKeys, e) {
      //复选框事件
      const that = this
      if (e.checked) {
        const item = {
          name: e.node.dataRef.modelName,
          id: e.node.dataRef.key,
          docName: e.node.dataRef.title,
        }
        that.addModelFun(item)
        that.modelList.push(item)
        that.$emit('update:modelList', item)
      } else {
        that.delModelFun(e.node.dataRef.key)
        const delmodelLists = that.modelList
        delmodelLists.forEach((element, index) => {
          if (element.id == e.node.dataRef.key) {
            delmodelLists.splice(index, 1)
          }
        })
        that.$emit('update:modelList', delmodelLists)
      }
    },
    onExpand(expandedKeys, e) {
      if (e.expanded) {
        if (expandedKeys.length > 0) {
          expandedKeys.splice(0, expandedKeys.length - 1)
        }
        this.expandedKeys = expandedKeys
        this.selectedKeys = expandedKeys
      } else {
        const key = e.node.dataRef.children
          .map((obj, index) => {
            if (expandedKeys.indexOf(obj.key) > -1) {
              return obj.key
            }
            return ''
          })
          .filter((v, index) => v !== '')
        //index  是点击收起节点的下级展开节点
        const index = expandedKeys.indexOf(key[0]) //因为展开的时候会收起兄弟节点  所以这里应该只有一个
        if (index > -1) {
          expandedKeys.splice(0, index + 1) //从0开始  删除到点击的下一级已展开节点
        }
        this.expandedKeys = expandedKeys
        this.selectedKeys = expandedKeys
      }
    },
    onSeTree(selectedKeys, e) {
      e.node.onExpand()
      const that = this
      if (e.node.dataRef.isModel) {
        //是否为模型节点
        const index = that.checkedItems.indexOf(e.node.dataRef.key)
        if (index == -1) {
          that.checkedItems.push(e.node.dataRef.key)
          e.checked = true
          that.onCheckTree(selectedKeys, e)
        } else {
          that.checkedItems.splice(index, 1)
          e.checked = false
          that.onCheckTree(selectedKeys, e)
        }
      }
    },
    CreatModelClosing() {
      const that = this
      that.closingForm = {
        name: '',
        desc: '',
      }
      that.createModelClosing = true
    },
    handleCancel() {
      const that = this
      that.createModelClosing = true
      that.$emit('update:visible', false)
    },
    onClosingSubmit() {
      //合模提交
      const that = this
      if (that.modelList.length <= 1) {
        that.createModelClosing = false
        return that.$message.warning({ content: '请至少选择两个模型文件', top: `50%`, duration: 2, maxCount: 1 })
      }
      const list = []
      for (let i = 0; i < that.modelList.length; i++) {
        list.push({
          docId: that.modelList[i].id,
          matrix: '',
        })
      }
      const position = that.$api.Camera.GetCamera()
      setModelClosingData({
        projectId: that.projectMessage.projectId,
        combineName: that.closingForm.name,
        camera: JSON.stringify(position),
        remark: that.closingForm.desc,
        combineDetails: list,
      }).then((res) => {
        that.changeProject({
          clampingID: res.id,
          projectMessage: {
            docName: res.combineName,
            camera: JSON.parse(res.camera),
            id: res.id,
          },
        })
        that.createModelClosing = false
      })
    },
    resetClosingForm() {
      this.createModelClosing = false
    },
  },
}
</script>
<style lang="scss" scoped>
.model-closing-box {
  background: transparent;
  .model-tree {
    color: #fff;
    /deep/.ant-tree-node-content-wrapper {
      color: #fff;
    }
    /deep/.ant-tree-checkbox-disabled {
      display: none;
    }
  }
}

</style>

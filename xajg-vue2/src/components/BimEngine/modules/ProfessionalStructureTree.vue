<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card :bordered="false">
      <a-layout-sider class="model-tree-box">
        <a-tree checkable class="model-tree" :tree-data="modelTrees" :load-data="onLoadData"
          :replace-fields="replaceFields" @check="onCheckTree" v-model="checkedKeys" :selectedKeys="selectedKeys"
          @select="onSelect" />
      </a-layout-sider>
    </a-card>
  </div>
</template>
<script>
import { getProfessionalStructureTree, getProfessionalStructureIdList } from '@/components/BimEngine/api/document'
export default {
  props: {
    projectMessage: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      modelTrees: [],
      replaceFields: {
        title: 'name',
        key: 'glid',
        value: 'glid',
      },
      visibleList: [], //结构树显示构件列表
      checkedKeys: [], //用于清除选中状态
      selectedKeys: [],
    }
  },
  mounted() {
    const that = this
    const date = that.projectMessage.modelList
    for (let i = 0; i < date.length; i++) {
      that.modelTrees.push({
        name: date[i].docName,
        id: date[i].id,
        children: [],
        glid: date[i].id,
        modelName: date[i].name,
        level: 0,
        modelId: date[i].id,
      })
      that.checkedKeys.push(date[i].id)
    }
  },
  methods: {
    onLoadData(treeNode) {
      const that = this;
      return new Promise((resolve) => {
        getProfessionalStructureTree({
          Pid: treeNode.dataRef.glid == treeNode.dataRef.modelId ? 0 : treeNode.dataRef.glid,
          LightweightName: that.projectMessage.modelName,
        }).then((res) => {
          if (res && res.datas.length > 0) {
            for (let i = 0; i < res.datas.length; i++) {
              if (res.datas[i].externalId != '0') {
                res.datas[i].isLeaf = true
                res.datas[i].name = res.datas[i].externalId
              }
              res.datas[i].modelId = treeNode.dataRef.modelId
              res.datas[i].modelName = that.projectMessage.modelName
            }
            treeNode.dataRef.children = res.datas
          }
          that.modelTrees = [...that.modelTrees]
        })
        resolve()
      })
    },
    async onCheckTree(checkedKeys, e) {
      const checkNode = e.node.dataRef
      const checked = e.checked
      const that = this
      // api.Model.SetModelVisible(checkNode.modelId, false)
      if (checkNode.glid == checkNode.modelId) { //模型级别
        if (checked) {
          api.Model.OriginalModel(checkNode.modelId)
          api.Feature.setVisible('', true, checkNode.modelId, true)
        } else {
          api.Feature.setVisible('', true, checkNode.modelId, false)
        }
        that.visibleList = []
      } else if (checkNode.externalId != '0') {  //构件级别
        if (checked) {
          api.Feature.setVisible(checkNode.glid, true, checkNode.modelId)
        } else {
          api.Feature.setVisible(checkNode.glid, false, checkNode.modelId)
        }
      } else { //结构
        const res = await getProfessionalStructureIdList({ Pid: e.node.dataRef.glid, LightweightName: e.node.dataRef.modelName })
        let list = (res.datas.split(",")).join("#")
        if (checked) {
          api.Feature.setVisible(list, true, checkNode.modelId)
        } else {
          api.Feature.setVisible(list, false, checkNode.modelId)
        }
      }
      // api.Public.Event('RIGHT_CLICK', function (click) {
      //   api.Model.OriginalModel(checkNode.modelId)
      //   api.Model.SetModelVisible(checkNode.modelId, true)
      //   that.checkedKeys = [] //清除选中
      //   that.visibleList = []  //清楚隐藏构件
      // })
    },
    filterModelTrees(items) {
      items.forEach((item) => {
        if (item.children.length === 0) {
          if (item.equipments.length > 0 || item.parts.length > 0) {
            item.children = [...item.equipments, ...item.parts]
          } else {
            delete item.children
          }
          delete item.equipments
          delete item.parts
          item.disabled = item.status !== 3
        } else {
          delete item.equipments
          delete item.parts
          this.filterModelTrees(item.children)
        }
      })
      return items
    },
    MergeArray(arr1, arr2) {
      var _arr = new Array()
      for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i])
      }
      for (var i = 0; i < arr2.length; i++) {
        var flag = true
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i] == arr1[j]) {
            flag = false
            break
          }
        }
        if (flag) {
          _arr.push(arr2[i])
        }
      }
      return _arr
    },
    DelArray(array1, array2) {
      var result = []
      for (var i = 0; i < array1.length; i++) {
        var k = 0
        for (var j = 0; j < array2.length; j++) {
          if (array1[i] != array2[j]) {
            k++
            if (k == array2.length) {
              result.push(array1[i])
            }
          }
        }
      }
      return result
    },
    onSelect(selectedKeys) {
      if (selectedKeys.length > 0)
        api.Feature.zoomTo(this.projectMessage.id + '^' + selectedKeys[0], this.projectMessage.id, true, 1)
    }
  },
}
</script>

<style lang="scss">
.model-tree-box {
  background: transparent;

  .model-tree.ant-tree {
    color: #fff;

    li .ant-tree-node-content-wrapper {
      color: #fff;
    }

    .ant-tree-checkbox-inner {
      background: transparent;
    }

    >li {
      >.ant-tree-checkbox {
        // display: none;
      }
    }

    li .ant-tree-node-content-wrapper:hover {
      background-color: rgba(5, 160, 129, 0.5);
    }
  }
}

.tips-box {
  position: fixed;
  bottom: 30px;
  right: 20px;
  padding: 10px 20px;
  background: #001529cc;
  border-radius: 6px;
}

.model-tree-box .model-tree.ant-tree li .ant-tree-node-content-wrapper {
  width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

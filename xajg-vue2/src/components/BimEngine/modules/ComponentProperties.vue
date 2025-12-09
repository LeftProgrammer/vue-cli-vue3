<template>
  <div class="side-frame" @contextmenu.prevent="">
    <a-card size="small" :bordered="false">
      <a-tabs v-model="tab" size="small" :animated="false" @change="PropertyChange">
        <a-tab-pane v-for="value in attributeType" :key="value.key" :tab="value.tab">
          <a-table class="property-box" :columns="columns" v-if="choose && attributeList.length > 0"
            :data-source="tableList" bordered :rowKey="
              (record, index) => {
                return index
              }
            " :pagination="false">
          </a-table>
          <span v-else>{{ attributeInformation }}</span>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import { getFeatureProperty } from '@/components/BimEngine/api//document'
const columns = [
  {
    dataIndex: 'propertyName',
    key: 'propertyName',
    customRender: (text, row, index) => {
      const obj = {
        children: text,
        attrs: {},
      }
      if (row.index == 'space') {
        obj.attrs.colSpan = 2
      }
      return obj
    },
    ellipsis: true,
  },
  {
    dataIndex: 'value',
    key: 'value',
    customRender: (value, row, index) => {
      const obj = {
        children: value,
        attrs: {},
      }
      if (row.index == 'space') {
        obj.attrs.colSpan = 0
      }
      return obj
    },
    ellipsis: true,
  },
]
export default {
  name: 'ComponentProperties',
  data() {
    return {
      attributeList: [],
      tableList: [],
      typeList: [],
      tab: 'properties',
      choose: false,
      columns,
      attributeType: [
        {
          key: 'properties',
          tab: '属性',
        },
        {
          key: 'type',
          tab: '类型',
        },
      ],
      attributeInformation: '点击查询构件~',
    }
  },
  props: {
    store: {
      type: Object,
      default: null,
    },
    projectMessage: {
      type: Object,
      default: null,
    },
  },
  async mounted() {
    await this.GetComponentProperties()
  },
  methods: {
    GetComponentProperties() {
      const that = this
      that.$message.info('请点击拾取需要查询属性的构件');
      api.Public.event("LEFT_CLICK", function (click) {
        that.choose = false
        that.tableList = []
        that.typeList = []
        api.Feature.getByEvent(click.position, function (json) {
          if (json) {
            that.DataFiltering(json.id)
            that.attributeInformation = '查询中，请稍候~'
          }
        })
      });
    },
    async DataFiltering(id) {
      const that = this
      that.attributeList = []
      that.tab = 'properties'
      const gild = id.split('^')
      let modelName = ''
      that.projectMessage.modelList.forEach((item) => {
        if (item.id == gild[0]) {
          modelName = item.name
          return modelName
        }
      })
      if (!modelName || !gild[1]) {
        return false
      }
      const res = await getFeatureProperty({ ExternalId: gild[1], LightweightName: modelName })
      let propertiesList = res.datas
      if (propertiesList.length == 0) {
        that.attributeInformation = '暂无数据~'
        return
      }
      const type = []
      let typeName = ''
      for (let i = 0; i < propertiesList.length; i++) {
        var propertySetName = propertiesList[i].propertySetName
        delete propertiesList[i].children
        if (type.indexOf(propertiesList[i].propertyTypeName) == -1) {
          propertiesList[i].propertyName = propertiesList[i].propertyname
          that.attributeList.push({
            type: propertiesList[i].propertyTypeName,
            content: [{ propertyName: propertiesList[i].propertySetName, index: 'space' }, propertiesList[i]],
            setName: [propertiesList[i].propertySetName],
          })
          typeName = propertySetName
          type.push(propertiesList[i].propertyTypeName)
        } else {
          var typeIndex = type.indexOf(propertiesList[i].propertyTypeName)
          if (propertySetName == typeName) {
            propertiesList[i].propertyName = propertiesList[i].propertyname
            that.attributeList[typeIndex].content.push(propertiesList[i])
          } else {
            that.attributeList[typeIndex].content.push({ propertyName: propertiesList[i].propertySetName, index: 'space' })
            propertiesList[i].propertyName = propertiesList[i].propertyname
            that.attributeList[typeIndex].content.push(propertiesList[i])
            typeName = propertySetName
          }
        }
      }
      that.choose = true
      that.tableList = that.attributeList[0].content
    },
    PropertyChange(activeKey) {
      const that = this
      // that.attributeList = [];
      if (activeKey == 'properties') {
        if (that.attributeList[0] && that.attributeList[0].content.length > 0) {
          that.tableList = that.attributeList[0].content
        } else {
          that.attributeInformation = '暂无数据~'
        }
      } else {
        if (that.attributeList[1] && that.attributeList[1].content.length > 0) {
          that.tableList = that.attributeList[1].content
        } else {
          that.attributeInformation = '暂无数据~'
        }
      }
    },
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>
<style lang="scss" scoped>
.ant-card {
  box-shadow: none;
}

/deep/.ant-table-tbody>tr>td {
  overflow-x: auto;
  text-overflow: clip;

  &::-webkit-scrollbar {
    //整体样式
    height: 2px;
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    //滑动滑块条样式
    border-radius: 1px;
    box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.2);
    background: #ffffff;
  }

  &::-webkit-scrollbar-track {
    //轨道的样式
    box-shadow: 0;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>

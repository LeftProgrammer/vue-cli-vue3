<template>
  <a-modal title="图层结构" :width="420" :visible="visible" :footer="null" class="layer-model" @cancel="CancelSetting">
    <a-table size="middle" bordered :columns="columns" :data-source="modelList" :rowKey="(record) => record.id"
      :pagination="false">
      <template slot="suffix" slot-scope="text">
        {{ (text.split(".")[1]).toUpperCase() }}
      </template>
      <template slot="docSize" slot-scope="text">
        {{ (text / 1024 / 1024).toFixed(2) }}MB
      </template>
      <template slot="renderStatus" slot-scope="text, record">
        <a-space>
          <a-switch v-model="visibleState" checked-children="显示" un-checked-children="隐藏"
            @change="VisibleModel($event, record)" />
          <a-icon type="environment" :style="{ fontSize: '16px' }" @click="LocationModel(record)" />
        </a-space>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: '模型名称',
    align: 'center',
    dataIndex: 'docName',
  },
  {
    title: '建模工具',
    align: 'center',
    dataIndex: 'suffix',
    ellipsis: true,
    scopedSlots: { customRender: 'suffix' },
  },
  {
    title: '模型大小',
    align: 'center',
    dataIndex: 'docSize',
    scopedSlots: { customRender: 'docSize' },
  },
  {
    title: '加载状态',
    width: '120px',
    dataIndex: 'status',
    align: 'center',
    scopedSlots: { customRender: 'renderStatus' },
  },
]
export default {
  props: {
    layerVisible: {
      type: Boolean,
      required: true,
    },
    projectMessage: {
      type: Object,
      default: undefined,
    }
  },
  data() {
    return {
      visible: this.layerVisible,
      columns,
      modelList: [],
      visibleState: true
    }
  },
  mounted() {
    const that = this;
    that.projectMessage.visible = true
    that.modelList.push(that.projectMessage)
  },
  methods: {
    LocationModel(data) {
      const that = this;
      api.Model.location(data.id)
    },
    VisibleModel(checked, data) {
      const that = this;
      api.Model.setVisible(data.id, checked);
      // that.modelList.forEach(item => {
      //   if (item.id == data.id) {
      //     item.visible = checked ? '1' : '0'
      //   }
      // });
      // console.log(that.modelList)
    },
    CancelSetting() {
      this.visible = false;
      this.$emit('update:layerVisible', this.visible)
    }
  },
  destroyed() {
    api.Public.clearHandler();
    api.Feature.clearSelectColor();
  }
}
</script>

<style lang="scss" scoped>
/deep/.ant-modal-body {
  padding: 0;

  .ant-table table {
    color: #fff;
    border: 1px solid rgba(232, 232, 232, 0.35);

    .ant-table-thead>tr>th {
      background: #05a081;
      color: #fff;
      border-right: 1px solid rgba(232, 232, 232, 0.35);
      border-bottom: 1px solid rgba(232, 232, 232, 0.35);
    }

    .ant-table-tbody>tr>td {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid rgba(232, 232, 232, 0.35);
      border-bottom: 1px solid rgba(232, 232, 232, 0.35);
    }
  }

  .ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
    background: transparent;
  }
}
</style>
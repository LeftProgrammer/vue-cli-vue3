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
            <el-form-item label="批件类型" prop="type">
              <TreeSelect v-model="formData.type" filterable :tree-options="attachmentList" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程部位" prop="pbsCode">
              <pbs-select v-model="formData.pbsCode" :readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标段" prop="sectionId">
              <el-select
                v-model="formData.sectionId"
                :disabled="readonly"
                class="w-100pre"
                placeholder="请选择"
                @visible-change="$visibleChange($event, 'el-popper')"
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
            <el-form-item label="发起人" prop="initiator ">
              <user
                v-model="formData.initiator"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起日期" prop="initiationDate">
              <el-date-picker
                v-model="formData.initiationDate"
                :disabled="readonly"
                type="date"
                style="width: 100%"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批人" prop="approver">
              <user
                v-model="formData.approver"
                :readonly="readonly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                :disabled="readonly"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="pt-20">
      <uploadFileTable
        v-model="formData.fileList"
        :readonly="readonly"
        :max-size="500"
        :limit="500"
      />
    </div>
  </div>
</template>

<script>
import { save, getSection } from "./api";
import { FlowFormMixin } from "@/mixins/FlowFormMixin";
import { getDictItemTree } from "@/api/dict";
import { dateFormat } from "@/utils";
import TreeSelect from "@/components/TreeSelect/index.vue";

export default {
  name: "Dataform",
  components: { TreeSelect },
  mixins: [FlowFormMixin],
  data() {
    return {
      sectionList: [],
      formData: {},
      formDataRules: {
        name: [
          { required: true, message: '请输入流程名称', trigger: 'blur' }
        ],
        sectionId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入流程编号', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择批件类型', trigger: 'change' }
        ],
        pbsCode: [
          { required: true, message: '请选择工程部位', trigger: 'change' }
        ],
        approver: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ],
      },
      //正在加载
      loading: false,
      attachmentList: [],
      url: {
        list: "/api/design/apply/page"
      },
    };
  },
  computed: {
    /**当前登录用户 */
    userInfo() {
      return this.$getStorage("userInfo");
    },
  },
  mounted() {
    this.getSection();
    this.getDictItemList();
  },
  methods: {
    async getSection() {
      // 获取标段
      const { data } = await getSection({});
      this.sectionList = data;
    },
    /**获取字典 */
    async getDictItemList() {
      const attachments = await getDictItemTree("ATTACHMENT_TYPE")
      this.attachmentList = attachments.data;
    },
    //发送前事件,mixin中进行调用:发送前转pdf并上传文件
    async beforeSend(eventData) {
      console.log("🚀 ~ beforeSend ~ eventData:", eventData);
      let extData = {};
      extData["approver"] = {
        type: "user",
        value: this.formData.approver
      };
      this.sendFlowJson = extData;
      console.log("this.sendFlowJson", this.sendFlowJson);
    },
    save(fields, callback, event) {
      this.formData.rectifyDate = dateFormat(this.formData.rectifyDate, "YYYY-MM-DD");
      if (this.formData.fileList && this.formData.fileList.length > 0) {
        fields.fileList = JSON.stringify(this.formData.fileList);
      }
      const isMaintenance = event.data.btnKey === "maintenance";
      if (isMaintenance) {
        this.sendMessage(
          {
            btnKey: event.data.btnKey,
            data: fields,
            type: "maintenance"
          },
          event.origin
        );
        return;
      }
      save(fields)
        .then((res) => {
          const { success, message } = res;
          if (!success) {
            return this.$message.error("新增失败：" + message);
          } else {
            callback && callback();
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("新增失败");
        });
    },
    /**
     * 获取表单数据
     */
    async getFormData() {
      const row = await this.getFlowRow();
      if (row) {
        this.formData = row;
        if (this.formData.fileList && this.formData.fileList.length > 0) {
          this.formData.fileList = JSON.parse(row.fileList)
        }
        console.log("🚀 ~ getFormData ~ this.formData:", this.formData);
      } else {
        this.$set(this.formData, "initiator", this.userInfo.userId);
      }
    },
    getAttachmnetType(code) {
      const findNode = (nodes, code) => {
        for (const node of nodes) {
          if (node.dictCode === code) {
            return node;
          }
          if (node.children && node.children.length > 0) {
            const foundNode = findNode(node.children, code);
            if (foundNode) {
              return foundNode;
            }
          }
        }
        return "";
      };
      return findNode(this.attachmentList, code);
    },
  }
};
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
      content: "*";
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

<template>
  <!--选择PBS弹窗-->
  <el-dialog
    v-draggable :visible.sync="dialogShow" :destroy-on-close="true" :close-on-press-escape="false"
    :close-on-click-modal="false" append-to-body width="960px" :title="title" @closed="closedHandle"
  >
    <!-- <el-row>
      <el-col :span="24">
        <div>合同标段</div>
        <el-divider></el-divider>
      </el-col>
    </el-row> -->
    <el-row>
      <el-form ref="dataFormRef" :model="formData" :rules="formDataRules" label-width="100px" :disabled="readonly">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="userId">
              <user v-model="formData.userId" :multiple="false" :readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签名图片" prop="signImage">
              <uploadFile
                v-model="formData.signImage" :readonly="readonly" :limit="1" :max-size="500"
                accept=".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx,.rtf.mp4,.flv,.flvx,.mvb,ppt,.xls,.xlsx,.pptx"
              />
              <!-- <upload-file
                :multiple="false"
                :limit="1"
                list-type="picture-card"
                accept="image/*"
                :readonly="readonly"
                @addFile="onAddImage"
                @deleteFile="onDeleteImage"
              /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="formData.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 4 }"
                placeholder="请输入备注" width="100%" maxlength="1000" show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogShow = false">
        {{ readonly ? "关闭" : "取消" }}
      </el-button>
      <el-button v-if="!readonly" type="primary" @click="childEvtHandle">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { save } from "./api";

  import { FormMixin } from '@/mixins/FormMixin'

  export default {
    name: "UserSignForm",
    mixins: [FormMixin],

    props: {
      visible: { type: Boolean, default: false },
      data: { type: Object, default: () => ({}) },
      readonly: { type: Boolean, default: false },
      title: { type: String, default: "新增" }
    },
    data() {
      return {
        dialogShow: false,
        formData: {
          id: null,
          userId: null,
          signImage: "",
          remark: ""
        },
        formDataRules: {
          userId: [{ required: true, message: "请选择用户", trigger: "change" }],
          signImage: [{ required: true, message: "请上传签名图片", trigger: "change" }]
        }
      };
    },
    watch: {
      visible: {
        handler(newValue) {
          if (newValue) {
            this.formData = {
              id: this.data.id || null,
              userId: this.data.userId || null,
              signImage: this.data.signImage || "",
              remark: this.data.remark || ""
            };
          }
          this.dialogShow = newValue;
        },
        immediate: true
      }
    },
    methods: {
      closedHandle() {
        this.dialogShow = false;
        this.$emit("closed");
      },
      onAddImage(fileInfo) {
        // 组件返回 {name,url,fileSize,fileId,blobType}
        this.formData.signImage = fileInfo?.url || "";
      },
      onDeleteImage() {
        this.formData.signImage = "";
      },
      childEvtHandle() {
        this.$refs.dataFormRef.validate((valid) => {
          if (!valid) return;
          const payload = { ...this.formData };
          save(payload)
            .then((res) => {
              const { success, message } = res;
              if (!success) {
                return this.$message.error("保存失败：" + message);
              }
              this.$emit("ok");
              this.closedHandle();
            })
            .catch(() => {
              this.$message.error("保存失败");
            });
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  .page-leave {
    width: 100%;
    height: 100%;
    padding: 15px;

    .table {
      /deep/ .el-table__row .cell button {
        padding: 0 !important;
      }
    }

    .pagination {
      padding: 0 20px;
    }
  }

  .subTabeHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-col .el-input {
    width: 60%;
  }

  .lengthening .el-select {
    width: 93%;

    .el-input {
      width: 100%;
    }
  }

  ::v-deep {
    .el-col .el-input {
      width: 100%;
    }
  }
</style>

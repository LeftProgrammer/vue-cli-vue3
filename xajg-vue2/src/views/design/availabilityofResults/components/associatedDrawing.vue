<template>
  <div
    v-load="loading"
    class="Organize-User"
    :class="{
      readonly: formDisabled
    }"
  >
    <div class="choose-dev" v-if="pageType === '1' || pageType === '2'">
      <div class="tags text" v-if="tagName.length == 0">请选择</div>
      <div class="tags" v-else>
        <el-tag
          v-for="(name, i) in tagName"
          :key="i"
          class="pointer"
          @click="handleClickTag(i)"
        >
          <span class="text-0096" style="text-decoration: underline">
            {{ name }}
          </span>
        </el-tag>
      </div>
      <div class="choosebtn" @click="handleChoose">
        <i class="el-icon-arrow-right" />
      </div>
    </div>
    <div class="choose-dev" v-else>
      <div class="tags text" v-if="tagCode.length == 0">请选择</div>
      <div class="tags" v-else>
        <el-tag
          v-for="(code, i) in tagCode"
          :key="i"
          class="pointer"
          @click="handleClickTag(i)"
        >
          <span class="text-0096" style="text-decoration: underline">
            {{ code }}
          </span>
        </el-tag>
      </div>
      <div class="choosebtn" @click="handleChoose">
        <i class="el-icon-arrow-right" />
      </div>
    </div>
    <el-dialog
      :title="title"
      :append-to-body="false"
      width="90%"
      :visible.sync="dialogShow"
      @close="dialogShowClose"
      v-draggable
      top="3%"
      class="receipt-dialog"
      :destroy-on-close="false"
    >
      <!-- 列表 -->
      <associatedDrawingsList
        :unityTitle="unityTitle"
        :documentType="1"
        :fromPageType="pageType"
        ref="associatedDrawingsList"
        :showNode="showNode"
        :showOperate="showOperate"
        :showChoose="showChoose"
        :showFlowStatus="showFlowStatus"
        class="RelatedReceivingDocuments"
        :showExportBtn="false"
      ></associatedDrawingsList>
      <div slot="footer" class="">
        <el-button type="primary" @click="confirmHandle"> 确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情  详情也会包含这个整个组件 -->
    <newForm
      :level="2"
      :ref="`${randomNumber}_newFormdialog`"
      :diaTitle="'关联收文'"
      :showModal="showModal"
      @submitOk="submitOk"
    />
  </div>
</template>
<script>
import associatedDrawingsList from "@/views/design/availabilityofResults/index.vue";
import newForm from "@/views/office/ownerSendDocument/newForm.vue";
import { getDocById } from "@/views/office/SendDocument/api";
import { fromApp } from "@/utils";
export default {
  name: "SendDocument-RelatedReceivingDocuments",
  components: {
    associatedDrawingsList,
    newForm
  },
  props: {
    pageType: {
      default: "",
      type: String
    },
    formDisabled: {
      default: false,
      type: Boolean
    },
    appformDisabled: {
      default: false,
      type: Boolean
    },
    showModal: {
      default: true,
      type: Boolean
    },
    codes: {
      default: "",
      type: String
    },
    names: {
      default: "",
      type: String
    },
    ids: {
      default: "",
      type: String
    },
    multiple: {
      default: true,
      type: Boolean
    },
    title: {
      default: "请选择",
      type: String
    }
  },
  data() {
    return {
      randomNumber: "",
      randomNumber2: new Date().getTime(),
      loading: false,
      tagName: [], //名字
      tagCode: [], //编号
      Ids: [], //收文id
      dialogShow: false,
      showNode: false,
      showOperate: false,
      showChoose: true,
      showFlowStatus: false,
      isFromApp: false,
      unityTitle: ""
    };
  },
  watch: {
    codes: {
      handler(val) {
        if (this.multiple && val) {
          console.log("codes", val);
          this.tagCode = val?.split(",") || [];
        } else {
          this.tagCode = [val];
        }
      },
      deep: true,
      immediate: true
    },
    names: {
      handler(val) {
        if (this.multiple && val) {
          console.log("names", val);
          this.tagName = val?.split(",") || [];
        } else {
          this.tagName = [val];
        }
      },
      deep: true,
      immediate: true
    },
    ids: {
      handler(val) {
        if (this.multiple && val) {
          console.log("ids", val);
          this.Ids = val?.split(",") || [];
        } else {
          this.Ids = [val];
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.isFromApp = fromApp();
    console.log("变更图纸pageType", this.pageType);
  },
  methods: {
    clearSelection() {
      // 清空选项目
      // this.$refs[`${this.date}_RelatedReceivingDocuments`].clearSelection();
    },
    // 新增 成功 回调
    submitOk() {
      // this.reset();
    },
    // 查看详情
    async handleClickTag(i) {
      if (this.isFromApp) {
        return;
      }
      // this.$router.push({path:'/#/designChanges/changeApply?permCode=design-change&name=设计变更',meta:{formData:this.formData}})
      console.log("父级", this.pageType);
      let url = "";
      if (!this.pageType) {
        this.$message.warning("当前页面类型不允许查看详情！");
        return;
      }
      // 区分是不是施工标段 3是设计变更
      if (this.pageType.indexOf("3") > -1) {
        if (this.pageType.indexOf("1") > -1) {
          url = `/#/design/hydroStandard?permCode=design-hydroStandard&name=成果供应-水电标&baseId=${this.Ids[i]}&dialog=true`;
        } else {
          url = `/#/design/campsiteMarker?permCode=design-campsiteMarker&name=成果供应-营地标&baseId=${this.Ids[i]}&dialog=true`;
        }
      } else {
        if (this.$route.path == "/diy/design/constructionSection") {
          // parentData
          if (this.pageType == "1") {
            url = `/#/design/hydroStandard?permCode=design-hydroStandard&name=成果供应-水电标&baseId=${this.Ids[i]}&dialog=true`;
          } else {
            url = `/#/design/campsiteMarker?permCode=design-campsiteMarker&name=成果供应-营地标&baseId=${this.Ids[i]}&dialog=true`;
          }
        } else {
          console.log("saaaaaaaa", this.$router, this.$route);
          url = `/#/design/${this.$route.meta.auth}?permCode=${this.$route.meta.permCode}&name=${this.$route.meta.title}&baseId=${this.Ids[i]}&dialog=true`;
        }
      }
      console.log("11111", url);
      window.open(url);
      return;
    },
    appendClass() {
      return this.formDisabled ? "append-notshow" : "append-show";
    },
    handleChoose() {
      if (this.formDisabled) {
        return;
      }
      this.dialogShow = true;
      this.$nextTick(() => {
        this.$refs.associatedDrawingsList.fromPage = "hydroStandardForm";
        this.$refs.associatedDrawingsList.multiple = this.multiple;
        this.$refs.associatedDrawingsList.customRequest();
      });
    },
    dialogShowClose() {
      this.dialogShow = false;
    },

    confirmHandle() {
      // 单选是对象   多选是数组
      if (this.multiple) {
        let currentRow = [...this.$refs.associatedDrawingsList.currentRow];
        let ids = [];
        let names = [];
        let codes = [];
        let pageTypes = [];
        if (currentRow) {
          ids = currentRow.map((x) => x.id);
          names = currentRow.map((x) => x.name);
          codes = currentRow.map((x) => x.code);
          pageTypes = currentRow.map((x) => x.pageType);
        }
        this.$emit("confirm", {
          id: ids.toString(),
          name: names.toString(),
          code: codes.toString(),
          pageType: pageTypes.toString()
        });
      } else {
        let currentRow = { ...this.$refs.associatedDrawingsList.currentRow };
        console.log("associatedDrawing单选", currentRow.pageType);
        this.$emit("confirm", {
          id: currentRow.id,
          name: currentRow.name,
          code: currentRow.code,
          pageType: currentRow.pageType
        });
      }
      this.$nextTick(() => {
        this.$refs.associatedDrawingsList.fromPage = "";
        this.dialogShowClose();
        this.$forceUpdate();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.RelatedReceivingDocuments {
  height: 800px !important;
}
/deep/ .el-dialog__wrapper {
  overflow: hidden;
}

.Organize-User {
  ::v-deep .el-input-group__append {
    background-color: #f5f7fa;
    color: #1298fa;
    border: 1px solid #1298fa;
  }

  ::v-deep .choose-dev {
    height: 36px;
    background-color: #f5f7fa;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tags {
      width: calc(100% - 60px);
      height: 100%;
      color: #bbbdc3;
      overflow-y: auto;
      text-align: left;

      .el-tag {
        margin-left: 5px;
        color: #606266;
      }
    }
    .text {
      text-indent: 15px;
    }
  }

  .choosebtn {
    height: 100%;
    display: flex;
    justify-content: center;
    width: 70px;
    align-items: center;
    cursor: pointer;
    border-left:1px solid #dcdfe6;
    border-top-left-radius: 0px;
    border-top-right-radius: 4px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 4px;
  }

  &.readonly {
    ::v-deep .el-input-group__append {
      color: grey;
      border-color: #e4e7ed;
    }
    .choosebtn {
      cursor: default;
      color: grey;
      border-color: #e4e7ed;
      border-top: none;
      border-right: none;
      border-bottom: none;
    }
  }
}

.user-main {
  height: 460px;

  .user-table {
    height: calc(100% - 80px);
  }

  .user-choosed {
    height: 80px;
    display: flex;
    position: absolute;
    z-index: 1;
    width: calc(100% - 40px);
    border: 1px solid #eee;
    border-radius: 3px;
    background: #fff;

    .total {
      text-indent: 10px;
      line-height: 40px;
      width: 100px;
    }

    .choose-user {
      display: flex;
      overflow-y: auto;
      flex-wrap: wrap;
      width: calc(100% - 100px);

      .choose-user-item {
        margin: 5px;
      }
    }
  }
}

.single.user-main {
  .user-table {
    height: calc(100% - 40px);
  }
  .user-choosed {
    height: 40px;
  }
  .choose-user {
    height: 100%;
  }
}

.user-form {
  height: 100%;
}

.input-hidden {
  display: none;
}
// .tags-etx {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

/deep/ .el-tag--medium {
  line-height: 26px;
}

/deep/.el-tag {
  background-color: transparent;
  border-color: transparent;
}

.receipt-dialog {
  /deep/.el-dialog {
    height: 88%;

    .el-dialog__body {
      height: calc(100% - 65px - 65px);

      .RelatedReceivingDocuments {
        // height: calc(100% - 46px) !important;
      }
    }
  }
}
</style>

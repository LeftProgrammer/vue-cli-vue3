<template>
  <div
    v-load="loading"
    class="Organize-User"
    :class="{
      readonly: formDisabled
    }"
  >
    <div class="choose-dev">
      <div class="tags text" v-if="relatedReceivingName.length == 0">
        请选择
      </div>
      <div class="tags" v-else>
        <el-tag
          v-for="(name, i) in relatedReceivingName"
          :key="i"
          class="pointer"

        >
          <span class="text-0096" style="text-decoration: underline" @click="handleClickTag(i)">
            {{ name }}
          </span>
          <i v-if="name && !formDisabled" class="el-icon-circle-close el-icon--right" @click="handleDeleteTag(i)"></i>
        </el-tag>
      </div>
      <div class="choosebtn" @click="handleRelatedReceivingClick">选择</div>
    </div>
    <el-dialog
      title="关联收文"
      width="90%"
      :modal="false"
      :visible.sync="dialogShow"
      @close="dialogShowClose"
      v-draggable
      top="3%"
      class="receipt-dialog"
    >
      <!-- 列表 -->
      <RelatedReceivingList
        :unityTitle="unityTitle"
        :documentType="1"
        :ref="`${randomNumber2}_RelatedReceivingDocuments`"
        :selectedRowIds="relatedIds"
        :showNode="showNode"
        :showOperate="showOperate"
        :showChoose="showChoose"
        :showFlowStatus="showFlowStatus"
        class="RelatedReceivingDocuments"
        :showExportBtn="false"
      ></RelatedReceivingList>
      <div slot="footer" class="">
        <el-button type="primary" @click="confirmHandle"> 确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情  详情也会包含这个整个组件   disabledDeep这里只能true 因为不允许往下继续点击了 -->
    <testnewform
      :level="2"
      :ref="`${randomNumber}testnewform`"
      :diaTitle="'关联收文'"
      :showModal="showModal"
      @submitOk="submitOk"
      :disabledDeep="true"
    />
  </div>
</template>
<script>
import RelatedReceivingList from "@/views/office/ReceiveDocument/index.vue";
import { getDocById } from "@/views/office/SendDocument/api";

export default {
  name: "SendDocument-RelatedReceivingDocuments",
  components: {
    RelatedReceivingList,
    testnewform: () => import("@/views/office/ownerSendDocument/newForm.vue")
  },
  props: {
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

    titles: {
      default: "",
      type: String
    },
    relatedIds: {
      default: "",
      type: String
    },
    level: {
      default: 1,
      type: Number
    }
  },
  data() {
    return {
      randomNumber: "",
      randomNumber2: new Date().getTime(),
      loading: false,
      relatedReceivingName: [], //名字
      Ids: [], //收文id
      dialogShow: false,
      showNode: false,
      showOperate: false,
      showChoose: true,
      showFlowStatus: false,
      unityTitle: "",
      showtestnewform: false
    };
  },
  watch: {
    titles: {
      handler(val) {
        this.relatedReceivingName = val?.split(",") || [];
      },
      deep: true,
      immediate: true
    },
    relatedIds: {
      handler(val) {
        let ids = [];
        if (val) {
          ids = val.split(",");
        }
        this.Ids = ids;
      },
      deep: true,
      immediate: true
    },
    dialogShow: {
      handler(val) {
        if (val) {
          let thiss = this;

          let init = function () {
            let ref = thiss.$refs[`${thiss.randomNumber2}_RelatedReceivingDocuments`]
            ref.setTableRowSelection();
            let selectCurrent = [];
            for (let i = 0; i < thiss.Ids.length; i++) {
              selectCurrent.push({
                id: thiss.Ids[i],
                title: thiss.relatedReceivingName[i]
              })
            }
            ref.currentRow = selectCurrent

            if (thiss.Ids.length == 0) {
              ref.reset();
            }
          }

          if (this.$refs[`${this.randomNumber2}_RelatedReceivingDocuments`]) {
            init()
          } else {
            this.$nextTick(() => {
              init()
            })
          }
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    // 新增 成功 回调
    submitOk() {
      // this.reset();
    },
    async handleDeleteTag(i) {
      console.log("业主发文点击收文11", i, this.Ids[i], this.relatedReceivingName[i]);
      this.Ids = this.Ids.filter((x, index) => index !== i);
      this.relatedReceivingName = this.relatedReceivingName.filter((x, index) => index !== i);
      // this.relatedIds =  this.Ids.join(",");
      // this.titles =  this.relatedReceivingName.join(",");
      this.$emit("relatedConfirm", {
        ids: this.Ids.join(",").toString(),
        titles: this.relatedReceivingName.join(",").toString()
      });
    },
    // 查看详情
    async handleClickTag(i) {
      console.log("业主发文点击收文", i);
      // 设置随机10位数随机数给randomNumber
      this.randomNumber = Math.floor(Math.random() * 10000000000);
      console.log(
        this.randomNumber,
        "发文id",
        this.Ids,
        i,
        this.Ids[i],
        "newFormdialog",
        `${this.randomNumber}testnewform`
      );
      if (!this.Ids[i]) {
        this.$message.error("请先选择相关单据");
        return;
      }
      // 请求当前id 得数据
      let params = {
        id: this.Ids[i]
      };
      const { success, data } = await getDocById(params);
      let formData = data[0];
      console.log("datadatadata", data);
      if (!success) {
        this.$message.error("获取关联收文数据错误");
        return;
      }
      this.showtestnewform = true;

      //确保这个组件被加载完成 定义一个定时器，每隔一段时间检查一次组件是否已经渲染完成
      let interval = setInterval(() => {
        const newFormRef = this.$refs[`${this.randomNumber}testnewform`];
        if (newFormRef) {
          console.log(
            "this.$refs[`${this.randomNumber}testnewform`]",
            this.$refs[`${this.randomNumber}testnewform`]
          );
          this.$refs[`${this.randomNumber}testnewform`].dialogShow = true;
          this.$refs[`${this.randomNumber}testnewform`].edit(
            { ...formData },
            true
          );
          clearInterval(interval); // 清除定时器
        }
      }, 100);
    },
    appendClass() {
      return this.formDisabled ? "append-notshow" : "append-show";
    },
    handleRelatedReceivingClick() {
      if (this.formDisabled) {
        return;
      }
      let { documentType, unitType } = this.$route.meta;
      if (!unitType) {
        unitType = 2;
      }
      console.log("documentType", documentType, unitType);
      // 监理 设计 施工 业主 第三方  type 1 2 3 4 5
      let obj = {
        1: "监理",
        2: "设计",
        3: "施工",
        4: "业主",
        5: "第三方"
      };
      this.unityTitle = obj[unitType] + "收文";

      if (!this.appformDisabled) {
        // let interval1 = setInterval(() => {
        //   const relatedReceivingDocuments = this.$refs[`${this.randomNumber2}_RelatedReceivingDocuments`];
        //   if (relatedReceivingDocuments) {
        //     this.$refs[`${this.randomNumber2}_RelatedReceivingDocuments`].reset();
        //     clearInterval(interval1); // 清除定时器
        //   }
        // }, 100);
        // if(this.$refs[`${this.randomNumber2}_RelatedReceivingDocuments`]){
        //   this.$refs[`${this.randomNumber2}_RelatedReceivingDocuments`].setTableRowSelection();
        // } else {
        //   this.$nextTick(() => {
        //     this.$refs[`${this.randomNumber2}_RelatedReceivingDocuments`].setTableRowSelection();
        //   })
        // }
        // setTimeout(()=>this.dialogShow = true,1000);
        this.dialogShow = true;
      }
    },
    dialogShowClose() {
      this.dialogShow = false;
    },

    confirmHandle() {
      // 获取 选中的行
      let currentRow =
        this.$refs[`${this.randomNumber2}_RelatedReceivingDocuments`]
          .currentRow;
      let ids = [];
      let titles = [];
      if (currentRow && Array.isArray(currentRow)) {
        currentRow.forEach((item) => {
          ids.push(item.id);
          titles.push(item.title);
        });
      } else {
        ids = [];
        titles = [];
      }
      this.relatedReceivingName = titles;
      this.Ids = ids;
      console.log("this.relatedReceivingName", this.relatedReceivingName);
      this.$emit("relatedConfirm", {
        ids: ids.toString(),
        titles: titles.toString()
      });
      this.dialogShow = false;
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
    border: 1px solid #0096ff;
    color: #1298fa;
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

/deep/ .el-tag {
  background-color: transparent;
  border-color: transparent;
}

.receipt-dialog {
  /deep/ .el-dialog {
    height: 78%;

    .el-dialog__body {
      height: calc(100% - 65px - 65px);

      .RelatedReceivingDocuments {
        // height: calc(100% - 46px) !important;
      }
    }
  }
}
</style>

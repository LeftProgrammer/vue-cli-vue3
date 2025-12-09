<template>
  <div>
    <!--流程的流程处理表单-->
    <el-dialog
      title="流程处理表单" custom-class="wbench-el-dialog flow-dialog" :visible.sync="flowShow"
      :destroy-on-close="true" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body center
      fullscreen :before-close="beforeClosedDialog" @closed="closedHandle"
    >
      <SzgcProcessGetor
        v-if="flowShow" ref="SzgcProcessGetor" :top-show="false" :page="flowInfo.page"
        :data-all="flowInfo" @childEvt="childEvtHandle"
      />
    </el-dialog>

    <el-image
      v-if="showImage" id="imPre" ref="imageRef" style="width: 0; height: 0" :src="url"
      :preview-src-list="srcList" draggable="false"
    />
  </div>
</template>
<script>
  import { getMinioUrl } from '@/utils/ntko'
  import { SzgcProcessGetor } from "@szgc/wbench";
  import { alllogs, getSignMapByIdList } from "@/api/flow";
  export default {
    name: "FlowHandle",
    components: {
      SzgcProcessGetor,
    },
    props: {
      /**流程弹窗 */
      visible: {
        type: Boolean,
        default: false,
      },
      /**流程弹窗信息 */
      flowInfo: {
        type: Object,
        default: () => {
          return {
            /**业务id */
            businessId: "",
            /**状态 */
            status: false,
            /**办理 */
            page: "",
            /**任务id */
            taskId: "",
            procTaskId: "",
          };
        },
      },
    },
    data() {
      return {
        srcList: [],
        url: "",
        /**流程弹窗显示 */
        flowShow: false,
        showImage: false,
      };
    },
    computed: {},
    watch: {
      visible(newValue) {
        console.log("flowInfo", this.flowInfo);
        // 更新待办数量
        this.$bus.emit("updateTodoNum");
        this.flowShow = newValue;
        setTimeout(() => {
          this.$nextTick(() => {
            alllogs(this.flowInfo.businessId).then((res) => {
              const data = res.data;
              const userIdList = data.map(item => item.createUserId);
              getSignMapByIdList(userIdList).then((mapRes) => {
                const signMap = mapRes?.data || {};
                const doms = document.getElementsByClassName("el-timeline-item") || [];
                for (let i = 0; i < doms.length; i++) {
                  const element = doms[i];
                  const el_card__body = element.querySelector(".el-card__body");
                  if (!el_card__body) continue;
                  const ImgDiv = document.createElement("div");
                  ImgDiv.style.textAlign = "right";
                  ImgDiv.style.paddingRight = "1em";
                  const Img = document.createElement("img");
                  const uid = data[i]?.createUserId;
                  const key = uid != null ? String(uid).trim() : "";
                  const src = key ? (signMap[key] ?? signMap[uid]) : "";
                  console.log("signMap", signMap, uid, src);
                  if (!src) continue;
                  let imgSrc = src;
                  try {
                    const urlObj = new URL(src);
                    imgSrc = urlObj.pathname + urlObj.search;
                  } catch (e) {
                  }
                  Img.src = imgSrc;
                  Img.width = 100;
                  Img.height = 45;
                  ImgDiv.appendChild(Img);
                  el_card__body.appendChild(ImgDiv);
                }
              });
            });
          });
        }, 1000);
      },
      flowInfo(newvalue) { },
    },
    created() {
      // 监听来自 iframe 的消息  做iframe图片预览
      window.addEventListener("message", (event) => {
        if (event.data.action === "moveImage") {
          this.showImage = true;
          this.url = this.getMinioUrl(event.data.file.url);
          this.srcList = [this.getMinioUrl(event.data.file.url)];
          this.$nextTick(() => {
            this.$refs.imageRef.clickHandler();
            setTimeout(() => {
              let dom = document.getElementById("imPre");
              dom.addEventListener("mousemove", function (event) {
                event.preventDefault(); // 阻止拖拽事件
              });
            }, 1000);
          });
        }
      });
    },
    mounted() { },
    methods: {
      beforeClosedDialog(done) {
        //有值代表的是的成果供应弹窗查看
        if (this.$route.query?.dialog) {
          window.close();
        }
        this.$clearStorage("resultsType");
        // 如果是当前数据  总计划、年度计划、月度计划  菜单就弹窗提示
        // 获取当前的路由
        let noticePath = [
          "/progress/TotalPlan",
          "/progress/ProgressPlan",
          "/progress/MonthPlan",
        ];
        let route = this.$route.path;
        console.log("route", route);
        let localStorage = this.$getStorage("flow_page_type");
        console.log("localStorage", localStorage);
        if (
          noticePath.includes(route) &&
          (localStorage === "wait" || localStorage === "mine")
        ) {
          this.$confirm("请保存数据！", "提示", {
            cancelButtonText: "返回填写页面",
            confirmButtonText: "退出",
            type: "warning",
          })
            .then((_) => {
              console.log("关闭", _);
              done();
            })
            .catch((_) => { });
        } else {
          done();
        }
      },
      // url替换成mino
      getMinioUrl(url) {
        return getMinioUrl(url);
      },

      childEvtHandle(data) {
        // console.log("childEvtHandle", data);
        this.$emit("childEvt", data);
      },
      closedHandle() {
        // 清除  reply
        this.$clearStorage("reply");
        this.$emit("closed");
      },
    },
  };
</script>
<style lang="scss" scoped>
  ::v-deep .wbench-el-dialog.is-fullscreen {
    .el-dialog__body {
      height: calc(100% - 57px);
    }
  }

  ::v-deep .wbench-form-header .right-content {
    width: calc(100% - 140px);
  }

  ::v-deep .wbench-form-header .right-content .right-btn.btn-special {
    color: #014acb;
    border-color: #014acb;
    background-color: #fff;
  }

  ::v-deep .flow-dialog {
    min-width: 1800px;
    min-height: 900px;
  }

  .wbench-link {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  ::v-deep .el-message-box__btns {
    display: flex;
    justify-content: space-between;
  }

  ::v-deep .el-button--warning {
    order: 1;
    /* 使确认按钮显示在左侧 */
  }

  // 平台反应 催办按钮 是固定写死的不是配置的 只能我们前端自己想办法处理

  /deep/ button.el-button:has(i.el-icon-bell) {
    display: none !important;
  }
</style>

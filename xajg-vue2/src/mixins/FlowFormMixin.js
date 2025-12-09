import enums from "@/config/enums";
import flow from "@/utils/flow";
import { BaseMixin } from "@/mixins/BaseMixin";
// import json from "/public/static/const-config.json";

export const FlowFormMixin = {
  mixins: [BaseMixin],
  data() {
    return {
      /**流程对应关系 */
      flowPackageOptions: [], //FLOW_PACKAGE_DICT

      /**流程名称 */
      flowName: "",
      /**流程id */
      flowId: "",

      /** 表单是否只读*/
      readonly: false,

      /**业务数据id */
      businessId: "",

      /**form表单对应的ref */
      dataFormRef: "dataFormRef",

      /**form组件 */
      formVue: null,

      /**流程节点权限后缀，通过流程设计器节点属性：可见，可写，必填的设置，映射对应的参数 */
      NodeAuth: "_NodeAuths",

      /**传递流程的审批人从表单到流程引擎中 */
      sendFlowJson: null,
      url: {
        list: "",
      },
      /**流程节点信息 */
      flowAuths: {},
      /**流程按钮信息 */
      postMessageData: {},
      // // 签章书签与节点映射信息
      // signMarkBooksMap: null,
      iframeEvent: "",

      // 列表传递过来的任务明细
      flowDetail: null,

      //流程状态信息
      flowInfo: null,
    };
  },
  created() {
    window.addEventListener("message", this.getMessage, false);
    // this.getFlowPackageOptions();
    if (this.fromapp && this.fromAppForm) {
      //this.readonly = true;
    }
    //pc端获取数据接口，app端通过父级流程数据后再获取
    if (!this.fromapp || this.fromAppForm) {
      this.getFlowData();
    } else {
      //发送消息获取流程数据
      this.sendMessage(
        {
          action: "get-flow-detail",
        },
        window.parent.origin
      );
    }
    // this.getNtkoSignConfig();
  },
  mounted() {
    // app查看页面，页面元素禁用
    this.readonly = this.$route.query.pageType === "appView";
  },
  methods: {
    /**获取流程信息 */
    getFlowData() {
      // 在某些情况下是不需求获取流程信息的，比如：移动端查看页面
      // 判断stopMixinGetFlowData存在  并且 是个函数
      if (
        this.stopMixinGetFlowData &&
        typeof this.stopMixinGetFlowData === "function"
      ) {
        // 如果返回的是 false 就return 否则继续
        if (!this.stopMixinGetFlowData()) return;
      }
      let path = this.$route.path;
      if (path.indexOf("/apph5/") === 0) {
        path = this.$route.meta?.formpath || path;
      }
      //分别对应：列表打开form，和待办入口打开form
      flow.getFlowData(path).then((flowinfo) => {
        if (flowinfo) {
          let { flowName, flowId } = flowinfo;
          this.flowName = flowName;
          this.flowId = flowId;
        } else {
          console.error("字典流程包配置中缺失内容", val, this.permCode);
        }
      });
    },
    /**获取url的参数 */
    getQueryString(url, name) {
      const urlString = url.replaceAll("#/", ""); //'http://localhost:8087/design/center/plan?permCode=design-center-plan';
      const urlObj = new URL(urlString);
      return urlObj.searchParams.get(name);
    },
    /**获取流程状态字典 */
    getFlowPackageOptions() {
      this.getDictItems("FLOW_PACKAGE_DICT").then((data) => {
        this.flowPackageOptions = data;
      });
    },
    /*向父级发送消息*/
    sendMessage(data, origin) {
      if (window.parent) {
        // console.log("sendMessage：data", data, "origin", origin);
        window.parent.postMessage(data, origin);
      }
    },
    /**保存前做数据验证 */
    beforeSubmit(name) {
      console.log("保存前做数据验证");
      name = name || "dataFormRef";
      let res = true;
      this.$refs[name].validate((valid) => {
        console.log("校验", name, valid);
        res = valid;
        return valid;
      });
      return res;
    },
    /**关闭移动端父级弹窗 */
    closeAppPopup() {
      if (this.fromapp) {
        this.sendMessage(
          {
            action: "close-popup",
          },
          window.parent.origin
        );
      }
    },
    /*接收到父级的消息处理完后返回给父级*/
    async getMessage(event) {
      // console.log("getMessage", event);
      if (this.fromapp) {
        if (
          event.data &&
          event.data.type === "szgc-wbench-iframe" &&
          event.data.action === "get-flow-detail"
        ) {
          /**获取app父级列表传递的任务数据 */
          this.flowDetail = event.data.data;
          this.flowDetail.page = event.data.page;
          this.getFlowData();
          return;
        }
      }

      this.iframeEvent = event;
      if (!event.data.btnKey && !event.data.page) {
        return;
      }

      // 如果是发送  就先判断当前是收文  确认签收或者拒签 才能继续
      if (
        event.data.btnKey == "send" &&
        this.pageType?.documentType == 1 &&
        this.formData.signStatus == 0
      ) {
        this.$message.warning("请先确认签收或者拒签！");
        return;
      }
      // 自由流程使用 onlineEdit_NodeAuths.read来判断 , 自由流程中，点击“退回”按钮增加提示语，“确认要提交，提交后流程退回至发起人，请谨慎操作！”
      // 退回操作
      if (event.data.btnKey == "return") {
        this.closeAppPopup();
        let confirmRes = await this.$confirm(
          `确认要提交，提交后流程退回至发起人，请谨慎操作！`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning",
            customClass: "confirmWinClass", //弹窗样式
          }
        ).catch(() => {}); // 添加错误捕获;
        if (!confirmRes) {
          return;
        }
      }
      console.log("getMessage：event", event);
      this.postMessageData = event.data;
      this.businessId = event.data.businessId || this.$route.query.businessId;
      //做业务数据的保存,修改。
      if (this.save) {
        // 如果是退回就不需要校验
        if (event.data.btnKey !== "return" && event.data.optKey != "disagree") {
          if (!this.beforeSubmit(this.dataFormRef)) {
            console.log("beforeSubmit 返回 false");
            return;
          }
          // 页面其他form校验判断  this.customValidate
          if (
            this.custumValidate &&
            typeof this.custumValidate === "function"
          ) {
            let bool = await this.custumValidate();
            console.log("自定义校验", bool);
            if (!bool) return;
          }
        }
        // 在流程中  提交事件
        // 1. 找盖章节点
        // 2. 请求已签的接口 李
        // 做判断是否继续下去
        //在必填字段校验完毕之后触发 办理任务时，进行提醒
        if (
          event.data.btnKey === "submit" ||
          event.data.btnKey == "send" ||
          event.data.btnKey == "maintenance"
        ) {
          this.closeAppPopup();
          if (this.fromapp) {
            this.sendMessage(
              {
                action: "close-popup",
              },
              window.parent.origin
            );
          }

          let confirmRes = await this.$confirm(
            `确认要提交，提交后不可修改?`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              closeOnClickModal: false,
              type: "warning",
              customClass: "confirmWinClass", //弹窗样式
            }
          ).catch(() => {}); // 添加错误捕获;
          if (!confirmRes) {
            return;
          }
        }
      }
      // 发送操作
      if (event.data.btnKey == "send" || event.data.btnKey == "maintenance") {
        if (typeof this.beforeSend === "function") {
          let res = await this.beforeSend(event.data);
          if (res === false) {
            return;
          }
        }
      }
      // 提交操作
      if (event.data.btnKey == "submit") {
        if (typeof this.beforeSubmitButton === "function") {
          let res = await this.beforeSubmitButton(event.data);
          if (res === false) {
            return;
          }
        }
        if (typeof this.beforeCustomizationSubmit === "function") {
          let res = await this.beforeCustomizationSubmit();
          if (res === false) {
            return;
          }
        }
      }
      let fields = Object.assign(this.formData, {});
      fields.id = this.businessId;

      if (event.data.page === "mine" || event.data.page === "wait") {
        if (event.data.btnKey === "save") {
          fields.flowStatus = enums.FLOW_STATUS_ENUM.SAVE.value;
        }
        if (event.data.btnKey === "send") {
          fields.flowStatus = enums.FLOW_STATUS_ENUM.SENT.value;
        }
      }
      // return;

      await this.save(
        fields,
        () => {
          let data = fields;
          this.formData = Object.assign(this.formData, data);

          fields = {
            bm: {
              type: "date",
              value: "",
            },
          };
          if (this.sendFlowJson) {
            for (let k in this.sendFlowJson) {
              if (data[k]) {
                this.sendFlowJson[k].value = data[k];
              }
            }
            fields = Object.assign(fields, this.sendFlowJson);
          }
          this.sendMessage(
            {
              businessId: this.businessId,
              type: event.data.type,
              page: event.data.page,
              btnKey: event.data.btnKey,
              data: fields,
              message: "数据已接收",
            },
            event.origin
          );
        },
        event
      );
    },
    //通过permCode获取按钮权限
    getMenuButtonItems(menus, permCode) {
      if (!permCode) {
        return null;
      }
      if (menus.length === 0) {
        return [];
      }
      let item = menus.find((x) => x.permCode === permCode);
      if (item && item.children && item.children.length) {
        return item.children.filter((x) => x.permType === 2);
      } else {
        let childs = [];
        for (let i = 0; i < menus.length; i++) {
          const menu = menus[i];
          if (menu.children && menu.children.length > 0) {
            childs.push(...menu.children);
          }
        }
        return this.getMenuButtonItems(childs, permCode);
      }
    },
    /**获取字典数据 */
    getDictItems(code) {
      return this.$store.dispatch("dict/get", code);
    },
    /**获取flowRow数据 */
    // pageParams请求page   接口有时候会带参数进来  一般情况下不带参数
    // 收发文 共用的一个接口  传入的unitype 不一样 所以需要传入参数
    getFlowRow(pageParams = {}) {
      // 从app过来
      this.businessId = this.$route.query.businessId;
      return new Promise((resolve, reject) => {
        let row = localStorage.getItem(this.storageKey);
        if (row) {
          //从列表过来的
          try {
            row = { ...JSON.parse(row) };
            const flowInfo = row.flowInfo;
            this.flowInfo = flowInfo;
            if (row.id === this.businessId && flowInfo) {
              this.readonly = !(
                flowInfo.page === "wait" ||
                flowInfo.page === "mine" ||
                this.fromAppForm
              );
              this.getTodoRead(flowInfo).then((res) => {
                // row.matterTaskTodo.todoInfo = res;
                if (res && res.auths) {
                  let auths = res.auths;
                  // 将节点信息保存 因为自定义的其他字段不一定就是在row 里面,如果用row里面得某一个字段来判断(是不是自由流程),可读性不高
                  this.flowAuths = { ...auths };
                  for (let key in row) {
                    let _auth = null;
                    if (key && auths[key]) {
                      _auth = auths[key];
                    }
                    row[key + this.NodeAuth] = _auth;
                  }
                }
                resolve(row);
              });
            }
          } catch (error) {
            reject(error);
          }
        } else if (this.businessId) {
          //从待办过来的 或者app进来的    this.$route.query.appUrlList 代表的是app进来的
          // if (this.$route.query.appUrlList) {
          //   this.url.list = this.$route.query.appUrlList;
          // }
          if (this.url.list) {
            // 兼容之前传递的是list 页面
            // typeof this.url.list == 'String'
            let apiType = this.url.list.includes("/page") ? "page" : "list"; //区分是list 接口 还是page 接口
            if (typeof this.url.list === "string") {
              let request = "";
              if (this.url?.list && apiType === "page") {
                request = flow.getBusinessPage;
              } else {
                request = flow.getBusinessList;
              }
              request(this.url.list, { id: this.businessId, ...pageParams })
                .then((res) => {
                  const { success, data } = res;
                  if (success) {
                    // 判断data的类型  data 是素组 就是list 的  是对象 就是page
                    if (data && Array.isArray(data)) {
                      // 后端返回 有就是数组套对象  没有就返回的是[]
                      row = data[0];
                    } else {
                      if (!data?.records || data?.records?.length == 0) {
                        resolve(null);
                      } else {
                        if (data?.records?.length === 1) {
                          row = data.records[0];
                        } else {
                          console.error("请修改page接口");
                          resolve(null);
                        }
                      }
                    }
                    //从app流程列表过来
                    if (this.flowDetail) {
                      let flowInfo = this.flowDetail;
                      this.flowInfo = flowInfo;
                      this.readonly = !(
                        flowInfo.page === "wait" || flowInfo.page === "mine"
                      );
                      // 将节点信息保存 因为自定义的其他字段不一定就是在row 里面,如果用row里面得某一个字段来判断(是不是自由流程),可读性不高
                      //代办才显示权限字段
                      if (flowInfo.page === "todo") {
                        let auths = this.flowDetail.auths || {};
                        this.flowAuths = { ...auths };
                        for (let key in row) {
                          let _auth = null;
                          if (key && auths[key]) {
                            _auth = auths[key];
                          }
                          row[key + this.NodeAuth] = _auth;
                        }
                      }
                      resolve(row);
                    } else {
                      let storageRow = localStorage.getItem(
                        this.storageTaskKey
                      );
                      if (storageRow) {
                        try {
                          storageRow = { ...JSON.parse(storageRow) };
                          let flowInfo = storageRow.flowInfo;
                          this.flowInfo = flowInfo;
                          if (
                            flowInfo &&
                            flowInfo.businessId === this.businessId
                          ) {
                            this.readonly = !(
                              flowInfo.page === "wait" ||
                              flowInfo.page === "mine"
                            );
                            // console.log(
                            //   "flowInfo2",
                            //   flowInfo,
                            //   this.readonly,
                            //   this.storageTaskKey,
                            //   this.storageKey
                            // );
                            this.getTodoRead(flowInfo).then((res) => {
                              // row.matterTaskTodo.todoInfo = res;
                              if (res && res.auths) {
                                let auths = res.auths;
                                // 将节点信息保存 因为自定义的其他字段不一定就是在row 里面,如果用row里面得某一个字段来判断(是不是自由流程),可读性不高
                                this.flowAuths = { ...auths };
                                for (let key in row) {
                                  let _auth = null;
                                  if (key && auths[key]) {
                                    _auth = auths[key];
                                  }
                                  row[key + this.NodeAuth] = _auth;
                                }
                              }
                              resolve(row);
                            });
                          } else {
                            resolve(row);
                          }
                        } catch (error) {
                          reject(error);
                        }
                      } else {
                        this.flowInfo = {
                          page: "mine",
                          status: false,
                        };
                        resolve(row);
                      }
                    }
                  } else {
                    resolve(null);
                  }
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              console.error("请传递正确的list/page 接口");
              resolve(null);
            }
          } else {
            console.error("请在dataform中填写 list/page 接口");
            resolve(null);
          }
        } else {
          reject("Parameter 'businessId' is missing");
        }
      });
    },
    /**
     * 获取todo-read，待办任务的参数数据
     */
    getTodoRead(flowInfo) {
      return new Promise((resolve, reject) => {
        typeof flowInfo === "string" && (flowInfo = JSON.parse(flowInfo));
        if (
          flowInfo &&
          flowInfo.page === "todo" &&
          flowInfo.businessId &&
          flowInfo.procTaskId
        ) {
          flow
            .todoread(flowInfo.businessId, flowInfo.procTaskId)
            .then((res) => {
              if (res.success && res.data) {
                resolve(res.data);
              } else {
                reject("todoread 查询返回失败，消息：" + res.message);
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          resolve(null);
        }
      });
    },
    /**
     * 获取流程节点当前字段是否可以写
     * @param {*} fieldName 字段名称
     * @param {*} type 权限类型：可读 read，required 必填，可写 write
     * @returns
     */
    getNodeAuth(fieldName, type = "write") {
      let fieldAuth = this.formData[fieldName + this.NodeAuth];
      if (fieldAuth && fieldAuth[type]) {
        return true;
      }
      return false;
    },
  },
  computed: {
    /**是否开始节点 */
    isStartNode() {
      return this.flowInfo?.page === "mine" || this.flowInfo?.page === "wait";
    },
    /** 从app的业务中心-综合办公的收发文列表过来的：fromAppForm = 1，只读 */
    fromAppForm() {
      return this.$route.query.fromappform == 1;
    },
    /**数据传递key */
    storageKey() {
      return "flow_data_row_" + this.flowId;
    },
    /**流程数据传递key */
    storageTaskKey() {
      return "flow_task_row_" + this.businessId + "_v2";
    },
    /**获取path */
    permCode() {
      let code = null;
      if (window.parent) {
        let url = window.parent.location.href;
        code = this.getQueryString(url, "permCode");
      }
      return code;
    },
  },
  watch: {
    /**流程包字典数据处理 */
    flowPackageOptions(val) {
      if (val) {
        // console.log("flowPackageOptions", val);
        //分别对应：列表打开form，和待办入口打开form
        let flowinfo = flow.getFlowInfo(val, {
          path: this.$route.path,
        });
        if (flowinfo) {
          let { flowName, flowId } = flowinfo;
          this.flowName = flowName;
          this.flowId = flowId;
        } else {
          console.error("字典流程包配置中缺失内容", val, this.permCode);
        }
      }
    },
    /**flowId 变化时设置数据 */
    flowId(val) {
      if (val) {
        if (typeof this.getFormData === "function") this.getFormData();
      }
    },
    /**readonly 变化时设置数据 */
    readonly(val) {
      let el = this.$el;
      if (el && el.classList) {
        el.classList.add("flow-form-page");
        if (val) {
          if (!el.classList.contains("is-disabled")) {
            el.classList.add("is-disabled");
          }
        }
      }
    },
  },
  destroyed() {
    window.removeEventListener("message", this.getMessage);
  },
};

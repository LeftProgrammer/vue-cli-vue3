import enums from "@/config/enums";
import flow from "@/utils/flow";
import { BaseMixin } from "@/mixins/BaseMixin";

export const FlowFormMixin = {
  mixins: [BaseMixin],
  data() {
    return {
      flowPackageOptions: [],
      flowName: "",
      flowId: "",
      readonly: false,
      businessId: "",
      dataFormRef: "dataFormRef",
      formVue: null,
      NodeAuth: "_NodeAuths",
      sendFlowJson: null,
      url: {
        list: "",
      },
      flowAuths: {},
      postMessageData: {},
      iframeEvent: "",
      flowDetail: null,
      flowInfo: null,
    };
  },
  created() {
    window.addEventListener("message", this.getMessage, false);

    if (!this.fromapp || this.fromAppForm) {
      this.getFlowData();
    } else {
      this.sendMessage(
        {
          action: "get-flow-detail",
        },
        window.parent.origin
      );
    }
  },
  mounted() {
    this.readonly = this.$route && this.$route.query && this.$route.query.pageType === "appView";
  },
  unmounted() {
    window.removeEventListener("message", this.getMessage, false);
  },
  methods: {
    getFlowData() {
      if (this.stopMixinGetFlowData && typeof this.stopMixinGetFlowData === "function") {
        if (!this.stopMixinGetFlowData()) return;
      }

      let path = (this.$route && this.$route.path) || "";
      if (path.indexOf("/apph5/") === 0) {
        path = (this.$route && this.$route.meta && this.$route.meta.formpath) || path;
      }

      flow
        .getFlowData(path)
        .then((flowinfo) => {
          if (flowinfo) {
            const { flowName, flowId } = flowinfo;
            this.flowName = flowName;
            this.flowId = flowId;
          }
        })
        .catch(() => {});
    },

    getQueryString(url, name) {
      if (!url || !name) return null;
      try {
        const urlString = url.replaceAll("#/", "");
        const urlObj = new URL(urlString);
        return urlObj.searchParams.get(name);
      } catch (e) {
        void e;
        return null;
      }
    },

    getFlowPackageOptions() {
      this.getDictItems("FLOW_PACKAGE_DICT").then((data) => {
        this.flowPackageOptions = data || [];
      });
    },

    getMenuButtonItems(menus, permCode) {
      if (!permCode) {
        return null;
      }
      if (!menus || menus.length === 0) {
        return [];
      }
      const item = menus.find((x) => x.permCode === permCode);
      if (item && item.children && item.children.length) {
        return item.children.filter((x) => x.permType === 2);
      }
      const children = [];
      menus.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          children.push(...menu.children);
        }
      });
      return this.getMenuButtonItems(children, permCode);
    },

    getDictItems(code) {
      if (!code || !this.$store) return Promise.resolve([]);
      return this.$store.dispatch("dict/get", code);
    },

    sendMessage(data, origin) {
      if (window.parent) {
        window.parent.postMessage(data, origin);
      }
    },

    beforeSubmit(name) {
      const refName = name || "dataFormRef";
      let res = true;
      if (!this.$refs || !this.$refs[refName] || !this.$refs[refName].validate) {
        return res;
      }
      this.$refs[refName].validate((valid) => {
        res = valid;
        return valid;
      });
      return res;
    },

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

    getFlowRow(pageParams = {}) {
      const route = this.$route || {};
      const query = route.query || {};
      this.businessId = query.businessId;

      return new Promise((resolve, reject) => {
        let row = localStorage.getItem(this.storageKey);

        if (row) {
          try {
            row = { ...JSON.parse(row) };
            const flowInfo = row.flowInfo;
            this.flowInfo = flowInfo;

            if (row.id === this.businessId && flowInfo) {
              this.readonly = !(flowInfo.page === "wait" || flowInfo.page === "mine" || this.fromAppForm);
              this.getTodoRead(flowInfo)
                .then((res) => {
                  if (res && res.auths) {
                    const auths = res.auths;
                    this.flowAuths = { ...auths };
                    for (const key in row) {
                      let _auth = null;
                      if (key && auths[key]) {
                        _auth = auths[key];
                      }
                      row[key + this.NodeAuth] = _auth;
                    }
                  }
                  resolve(row);
                })
                .catch(reject);
              return;
            }

            resolve(row);
            return;
          } catch (e) {
            reject(e);
            return;
          }
        }

        if (!this.businessId) {
          reject("Parameter 'businessId' is missing");
          return;
        }

        if (!this.url || !this.url.list) {
          resolve(null);
          return;
        }

        const apiType = typeof this.url.list === "string" && this.url.list.includes("/page") ? "page" : "list";
        if (typeof this.url.list !== "string") {
          resolve(null);
          return;
        }

        const requestFn = apiType === "page" ? flow.getBusinessPage : flow.getBusinessList;
        requestFn(this.url.list, { id: this.businessId, ...pageParams })
          .then((res) => {
            const { success, data } = res || {};
            if (!success) {
              resolve(null);
              return;
            }

            if (data && Array.isArray(data)) {
              row = data[0];
            } else if (data && data.records && data.records.length) {
              if (data.records.length === 1) {
                row = data.records[0];
              } else {
                resolve(null);
                return;
              }
            } else {
              resolve(null);
              return;
            }

            if (this.flowDetail) {
              const flowInfo = this.flowDetail;
              this.flowInfo = flowInfo;
              this.readonly = !(flowInfo.page === "wait" || flowInfo.page === "mine");

              if (flowInfo.page === "todo") {
                const auths = this.flowDetail.auths || {};
                this.flowAuths = { ...auths };
                for (const key in row) {
                  let _auth = null;
                  if (key && auths[key]) {
                    _auth = auths[key];
                  }
                  row[key + this.NodeAuth] = _auth;
                }
              }

              resolve(row);
              return;
            }

            let storageRow = localStorage.getItem(this.storageTaskKey);
            if (storageRow) {
              try {
                storageRow = { ...JSON.parse(storageRow) };
                const flowInfo = storageRow.flowInfo;
                this.flowInfo = flowInfo;

                if (flowInfo && flowInfo.businessId === this.businessId) {
                  this.readonly = !(flowInfo.page === "wait" || flowInfo.page === "mine");
                  this.getTodoRead(flowInfo)
                    .then((todoReadRes) => {
                      if (todoReadRes && todoReadRes.auths) {
                        const auths = todoReadRes.auths;
                        this.flowAuths = { ...auths };
                        for (const key in row) {
                          let _auth = null;
                          if (key && auths[key]) {
                            _auth = auths[key];
                          }
                          row[key + this.NodeAuth] = _auth;
                        }
                      }
                      resolve(row);
                    })
                    .catch(() => resolve(row));
                  return;
                }

                resolve(row);
                return;
              } catch (e) {
                reject(e);
                return;
              }
            }

            this.flowInfo = {
              page: "mine",
              status: false,
            };
            resolve(row);
          })
          .catch(reject);
      });
    },

    getTodoRead(flowInfo) {
      return new Promise((resolve, reject) => {
        if (typeof flowInfo === "string") {
          try {
            flowInfo = JSON.parse(flowInfo);
          } catch (e) {
            resolve(null);
            return;
          }
        }

        if (flowInfo && flowInfo.page === "todo" && flowInfo.businessId && flowInfo.procTaskId) {
          flow
            .todoread(flowInfo.businessId, flowInfo.procTaskId)
            .then((res) => {
              if (res && res.success && res.data) {
                resolve(res.data);
              } else {
                reject("todoread 查询返回失败，消息：" + ((res && res.message) || ""));
              }
            })
            .catch(reject);
        } else {
          resolve(null);
        }
      });
    },

    getNodeAuth(fieldName, type = "write") {
      if (!this.formData) return false;
      const fieldAuth = this.formData[fieldName + this.NodeAuth];
      if (fieldAuth && fieldAuth[type]) {
        return true;
      }
      return false;
    },

    async getMessage(event) {
      if (this.fromapp) {
        if (
          event.data &&
          event.data.type === "szgc-wbench-iframe" &&
          event.data.action === "get-flow-detail"
        ) {
          this.flowDetail = event.data.data;
          this.flowDetail.page = event.data.page;
          this.getFlowData();
          return;
        }
      }

      this.iframeEvent = event;
      if (!event.data || (!event.data.btnKey && !event.data.page)) {
        return;
      }

      if (
        event.data.btnKey === "send" &&
        this.pageType &&
        this.pageType.documentType === 1 &&
        this.formData &&
        this.formData.signStatus === 0
      ) {
        this.$message && this.$message.warning && this.$message.warning("请先确认签收或者拒签！");
        return;
      }

      if (event.data.btnKey === "return") {
        this.closeAppPopup();
        const confirmRes = await this.$confirm(
          `确认要提交，提交后流程退回至发起人，请谨慎操作！`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning",
            customClass: "confirmWinClass",
          }
        ).catch(() => {});
        if (!confirmRes) return;
      }

      this.postMessageData = event.data;
      this.businessId = event.data.businessId || (this.$route && this.$route.query && this.$route.query.businessId);

      if (this.save) {
        if (event.data.btnKey !== "return" && event.data.optKey !== "disagree") {
          if (!this.beforeSubmit(this.dataFormRef)) {
            return;
          }
          if (this.custumValidate && typeof this.custumValidate === "function") {
            const bool = await this.custumValidate();
            if (!bool) return;
          }
        }

        if (
          event.data.btnKey === "submit" ||
          event.data.btnKey === "send" ||
          event.data.btnKey === "maintenance"
        ) {
          this.closeAppPopup();
          const confirmRes = await this.$confirm(`确认要提交，提交后不可修改?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning",
            customClass: "confirmWinClass",
          }).catch(() => {});
          if (!confirmRes) return;
        }
      }

      if (event.data.btnKey === "send" || event.data.btnKey === "maintenance") {
        if (typeof this.beforeSend === "function") {
          const res = await this.beforeSend(event.data);
          if (res === false) {
            return;
          }
        }
      }

      if (event.data.btnKey === "submit") {
        if (typeof this.beforeSubmitButton === "function") {
          const res = await this.beforeSubmitButton(event.data);
          if (res === false) {
            return;
          }
        }
        if (typeof this.beforeCustomizationSubmit === "function") {
          const res = await this.beforeCustomizationSubmit();
          if (res === false) {
            return;
          }
        }
      }

      if (!this.save || typeof this.save !== "function") {
        return;
      }

      if (!this.formData) {
        await this.save(event.data);
        return;
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

      await this.save(
        fields,
        () => {
          const data = fields;
          this.formData = Object.assign(this.formData, data);

          let retFields = {
            bm: {
              type: "date",
              value: "",
            },
          };
          if (this.sendFlowJson) {
            for (const k in this.sendFlowJson) {
              if (data[k]) {
                this.sendFlowJson[k].value = data[k];
              }
            }
            retFields = Object.assign(retFields, this.sendFlowJson);
          }

          this.sendMessage(
            {
              businessId: this.businessId,
              type: event.data.type,
              page: event.data.page,
              btnKey: event.data.btnKey,
              data: retFields,
              message: "数据已接收",
            },
            event.origin
          );
        },
        event
      );
    },

    getFlowPageStatus(taskStatus) {
      return (enums && enums.FLOW_PAGE_ENUM && enums.FLOW_PAGE_ENUM[taskStatus]) || "mine";
    },
  },
  computed: {
    isStartNode() {
      return this.flowInfo && (this.flowInfo.page === "mine" || this.flowInfo.page === "wait");
    },
    fromAppForm() {
      const route = this.$route || {};
      const query = route.query || {};
      // eslint-disable-next-line eqeqeq
      return query.fromappform == 1;
    },
    storageKey() {
      return "flow_data_row_" + this.flowId;
    },
    storageTaskKey() {
      return "flow_task_row_" + this.businessId + "_v2";
    },
    permCode() {
      let code = null;
      try {
        if (window.parent) {
          const url = window.parent.location.href;
          code = this.getQueryString(url, "permCode");
        }
      } catch (e) {
        void e;
      }
      return code;
    },
  },
  watch: {
    flowPackageOptions(val) {
      if (!val) return;
      const route = this.$route || {};
      const path = route.path;
      const flowinfo = flow.getFlowInfo(val, { path });
      if (flowinfo) {
        const { flowName, flowId } = flowinfo;
        this.flowName = flowName;
        this.flowId = flowId;
      }
    },
    flowId(val) {
      if (val) {
        if (typeof this.getFormData === "function") this.getFormData();
      }
    },
    readonly(val) {
      const el = this.$el;
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
};

import { MeasurementType } from "./Measurement";
import { Notification } from "element-ui";
import ViewpointManagement from "../components/ViewpointManagement.vue";
import LabelManagement from "../components/LabelManagement.vue";
import GISSceneSettings from "../components/GISSceneSettings.vue";
import YPGLManagement from "../components/YPGLManagement.vue";
import CJGLManagement from "../components/CJGLManagement.vue";
import MXPYManagement from "../components/MXPYManagement.vue";
import TCGLManagement from "../components/TCGLManagement.vue";
import MXJZManagement from "../components/MXJZManagement.vue";
import SMGLManagement from "../components/SMGLManagement.vue";
import { updateModelConfig } from "../api.js";
export default {
    data() {
        return {
            sceneInfo: {}, //场景信息
        };
    },
    components: {
        ViewpointManagement,
        LabelManagement,
        GISSceneSettings,
        YPGLManagement,
        MXPYManagement,
        TCGLManagement,
        MXJZManagement,
        CJGLManagement,
    },
    methods: {
        /**
         * @description 动态调用方法
         * @param {string} method
         */
        FunctionChoose(type, sceneInfo) {
            this.sceneInfo = sceneInfo;
            const that = this;
            if (type.method) {
                MeasurementType({
                        id: type.id,
                    },
                    that,
                    sceneInfo
                );
                return;
            }
            that.ClearEvent();
            switch (type.id) {
                case "ViewpointManagement": //视点管理
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            ViewpointManagement sceneInfo = { that.sceneInfo }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
                case "LabelManagement": //视点管理
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            LabelManagement sceneInfo = { that.sceneInfo }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
                case "GISSceneSettings": //GIS场景设置
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            GISSceneSettings sceneInfo = { that.sceneInfo }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
                case "YPGL": //压平管理
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            YPGLManagement sceneInfo = { that.sceneInfo }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
                case "CJGL": //裁剪管理
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            CJGLManagement sceneInfo = { that.sceneInfo }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
                case "MXPY": //模型偏移
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            MXPYManagement sceneInfo = { that.sceneInfo }
                            modelList = { this.modelList }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
                case "TCGL": //图层管理
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            TCGLManagement sceneInfo = { that.sceneInfo }
                            modelList = { this.modelList }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
                case "MXJZ": //图层管理
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            MXJZManagement sceneInfo = { that.sceneInfo }
                            modelList = { this.modelList }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
                case "SMGL": //水面管理
                    that.NotificationPopup({
                        title: type.name,
                        id: type.id,
                        message: ( <
                            SMGLManagement sceneInfo = { that.sceneInfo }
                            modelList = { this.modelList }
                            updateConfig = {
                                (data, callback) => {
                                    that.updateConfig(data, callback);
                                }
                            }
                            />
                        ),
                    });
                    break;
            }
        },
        NotificationPopup(parameter) {
            const that = this;
            Notification({
                key: "EngineKey",
                title: parameter.title,
                dangerouslyUseHTMLString: true,
                message: parameter.message,
                // description: parameter.description,
                customClass: "engine-notification " + (parameter.tips ? parameter.tips : ""),
                duration: null,
                placement: parameter.placement ? parameter.placement : "topRight",
                style: {
                    width: parameter.width ? parameter.width : "280px",
                    marginRight: `20px`,
                },
            });
        },
        updateConfig(param, callback) {
            updateModelConfig({
                modelId: this.sceneInfo.modelId,
                ...param,
            }).then((res) => {
                if (res.success) {
                    this.getBimConfig();
                    callback && callback(res);
                }
            });
        },
        ClearEvent() {
            const that = this;
            Notification.closeAll();
            that.api.Public.clearHandler();
            that.api.Feature.clearSelectColor();
            that.api.Feature.cancelBoxSelect();
            // that.projectMessage.modelList.forEach((item) => {
            //   that.api.Model.original(item.id);
            // });
        },
    },
};
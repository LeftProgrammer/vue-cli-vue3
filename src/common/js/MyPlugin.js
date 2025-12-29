// MyPlugin.js 创建插件文件 - Vue3 版本
import uploadFile from '@/components/upload/uploadFile.vue'
import uploadFileTable from '@/components/upload/uploadFileTable.vue'
import pbsSelect from '@/components/PbsSelect/index.vue'
import User from "@/components/Organize/User/index.vue";
import Unit from "@/components/Organize/Unit/index.vue";
import ListButton from "@/components/ListButton";
import VideoPlay from "@/components/VideoPlay";
import UniTable from "@/components/UniTable";
import DefaultTitle from "@/components/DefaultTitle";

const MyPlugin = {
  install(app) {
    // Vue3 中使用 app.component 注册全局组件
    app.component('uploadFile', uploadFile);
    app.component('uploadFileTable', uploadFileTable);
    app.component('pbsSelect', pbsSelect);
    app.component('user', User);
    app.component('unit', Unit);
    app.component('ListButton', ListButton);
    app.component('VideoPlay', VideoPlay);
    app.component('uniTable', UniTable);
    app.component('DefaultTitle', DefaultTitle);
  }
};

export default MyPlugin;

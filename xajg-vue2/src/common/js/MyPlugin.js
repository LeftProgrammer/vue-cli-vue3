// MyPlugin.js 创建插件文件
import uploadFile from '@/components/upload/uploadFile.vue'
import uploadFileTable from '@/components/upload/uploadFileTable.vue'
import pbsSelect from '@/components/PbsSelect/index.vue'
import User from "@/components/Organize/User/index.vue";
import Unit from "@/components/Organize/Unit/index.vue";
import ListButton from "@/components/ListButton";
import VideoPlay from "@/components/VideoPlay"; // 视频播放组件
import UniTable from "@/components/UniTable"; // 视频播放组件
import DefaultTitle from "@/components/DefaultTitle";


// import VuePreview from 'vue-preview';
const MyPlugin = {
    install(Vue) {
        // 在这里注册全局组件
        Vue.component('uploadFile', uploadFile);
        Vue.component('uploadFileTable', uploadFileTable);
        Vue.component('pbsSelect', pbsSelect);
        Vue.component('user', User);
        Vue.component('unit', Unit);
        Vue.component('ListButton', ListButton);
        Vue.component('VideoPlay', VideoPlay);
        Vue.component('uniTable', UniTable);
        Vue.component('DefaultTitle', DefaultTitle);
        // Vue.component('VuePreview', VuePreview);
    }
};

export default MyPlugin;
<template>
    <div class="handling-notes">
        <div class="ml-16 flex align-center h-35 rounded-4 px-10" style="border: 1px solid #0096ff">
            <span class="pointer">雄安调蓄处理笺 </span>
            <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
                <span class="ml-20 pointer" @click="priviewOrsavePdf('priview')">
                    <i class="el-icon-view" />
                </span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下载" placement="bottom">
                <span class="ml-15 pointer" @click="priviewOrsavePdf('save')">
                    <i class="el-icon-download" />
                </span>
            </el-tooltip>
        </div>

        <htmlToPdftemplate ref="htmlToPdftemplate" documentType="SendDocument"></htmlToPdftemplate>
    </div>
</template>

<script>
import htmlToPdftemplate from "@/views/office/SendDocument/components/htmlToPdftemplate.vue";
export default {
    props: {
        data: {
            default: Object,
            type: {},
        },
    },
    components: {
        htmlToPdftemplate,
    },
    methods: {

        // 将 vue 文件  转换成  pdf 然后生成 blob 在本地预览
        priviewOrsavePdf(type) {
            let data = this.data || {};
            this.$refs.htmlToPdftemplate.priviewOrsavePdf(type, data);
        },
    }
}
</script>

<style scoped lang="scss">
.handling-notes {
    width: 240px;
    height: 35px;
}
</style>

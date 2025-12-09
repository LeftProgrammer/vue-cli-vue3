<template>
    <div>
        <el-dialog v-draggable title="修改密码" :visible.sync="changePass" width="650px" :modal-append-to-body="true"
            :before-close="cancelEditPasswd" :close-on-click-modal="false" :show-close="showClose">
            <password-info ref="formPass" />
        </el-dialog>
    </div>
</template>

<script>
import PasswordInfo from "@/views/Password/index";
import heatbeat from "@/utils/heatbeat";
export default {
    name: "ChangePassword",
    components: {
        PasswordInfo,
    },
    data() {
        return {
            showClose: false,
            changePass: false,
        };
    },
    methods: {
        cancelEditPasswd(done) {
            // if (process.env.NODE_ENV === "development") {
            //   done();
            // }
            if (this.changePass) {
                this.$message.warning("请先修改密码!");
                return false;
            }
        },
    },
    created() {
        this.$store.dispatch("user/getInfo").then((res) => {
            const flag = res.needUpdatePassword;
            if (flag === 2) {
                // 首次登陆修改密码
                this.changePass = true;
                // //修改密码时，暂停心跳
                // heatbeat.clear();
            }
        });
    },
    beforeRouteEnter(to, from, next) {
        // 
        // console.log("to, from,", to, from);
        next((vm) => {
            // 浏览器直接输入地址  from地址为 "/"
            if (from.path === "/login" || from.path === "/") {
                vm.showClose = false;
            } else {
                vm.showClose = true;
            }
        });
    },
    props: {

    },
    computed: {

    },
};
</script>

<style scoped>
.svg-icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>

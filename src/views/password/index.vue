<template>
  <div class="password-page">
    <div class="main">
      <el-card class="password-card" header="修改密码">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="80px"
            >
              <el-form-item label="账号">
                <el-input :value="loginInfo && loginInfo.username" disabled />
              </el-form-item>
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input
                  v-model="form.oldPassword"
                  type="password"
                  placeholder="请输入旧密码"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="form.newPassword"
                  type="password"
                  placeholder="8-50 位，需包含数字、大小写字母和特殊字符"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="重复密码" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="10" class="password-rule">
            <div>1. 密码必须包含数字</div>
            <div>2. 密码必须包含字母（同时包含大、小写字母）</div>
            <div>3. 密码必须包含特殊字符</div>
            <div>4. 密码长度范围为 8 位到 50 位</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getLoginPublicKey, resetUserPassword } from "@/api/user";
import JSEncrypt from "jsencrypt";
import { ElMessage } from "element-plus";

export default {
  name: "PasswordPage",
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            validator: this.validateNewPassword,
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            validator: this.validateConfirmPassword,
            trigger: "blur",
          },
        ],
      },
      pubKey: "",
    };
  },
  computed: {
    ...mapGetters(["loginInfo"]),
  },
  async created() {
    await this.fetchLoginPublicKey();
  },
  methods: {
    async fetchLoginPublicKey() {
      try {
        const res = await getLoginPublicKey();
        if (res && res.success) {
          this.pubKey = res.data || "";
        }
      } catch (e) {
        // 忽略获取公钥失败，后端可按明文处理
      }
    },
    encrypt(password) {
      if (!password) return "";
      if (!this.pubKey) return password;
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(this.pubKey);
      return encryptor.encrypt(password) || "";
    },
    validateNewPassword(rule, value, callback) {
      if (!value) {
        callback(new Error("新密码不能为空"));
        return;
      }
      if (value.length < 8 || value.length > 50) {
        callback(new Error("密码长度必须在 8 到 50 位之间"));
        return;
      }
      if (!/[0-9]/.test(value)) {
        callback(new Error("密码必须包含数字"));
        return;
      }
      if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
        callback(new Error("密码必须包含大写和小写字母"));
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        callback(new Error("密码必须包含特殊字符"));
        return;
      }
      callback();
    },
    validateConfirmPassword(rule, value, callback) {
      if (!value) {
        callback(new Error("请再次输入新密码"));
        return;
      }
      if (value !== this.form.newPassword) {
        callback(new Error("两次密码输入不一致"));
        return;
      }
      callback();
    },
    handleSubmit() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        try {
          const payload = {
            encryptOldPassword: this.encrypt(this.form.oldPassword),
            encryptNewPassword: this.encrypt(this.form.newPassword),
          };
          const res = await resetUserPassword(payload);
          if (!res || !res.success) {
            ElMessage.error(
              (res && res.message) || "修改密码失败，请稍后重试",
            );
            return;
          }
          ElMessage.success("修改密码成功，请重新登录");
          await this.$store.dispatch("user/logout");
          this.$router.push({ path: "/login" });
        } catch (e) {
          ElMessage.error("修改密码失败，请稍后重试");
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.password-page {
  display: flex;
  justify-content: center;
  padding: 40px 0;

  .main {
    width: 700px;
  }

  .password-card {
    .password-rule {
      line-height: 24px;
      padding-top: 16px;
    }
  }
}
</style>

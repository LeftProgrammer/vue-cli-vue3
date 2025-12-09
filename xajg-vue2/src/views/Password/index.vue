<template>
  <div class="apply-page">
    <div class="main">
      <div class="apply-form my-20">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
              <el-form-item label="账号" required>
                <el-input :value="loginInfo.username" disabled placeholder="当前账号"/>
              </el-form-item>
              <el-form-item label="旧密码" prop="p0" :style="{ margin: '20px 0' }">
                <el-input v-model="form.p0" placeholder="输入旧密码" :type="p0type">
                  <i v-if="p0type === 'password'" @click="p0type = 'text'" slot="suffix"
                     class="iconfont icon-passwordNotView"
                  ></i>
                  <i v-else @click="p0type = 'password'" slot="suffix" class="iconfont icon-passwordView"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="p1" :style="{ margin: '25px 0' }" :type="p1type">
                <el-input v-model="form.p1" :type="p1type" placeholder="请输入新密码">
                  <i v-if="p1type === 'password'" @click="p1type = 'text'" slot="suffix"
                     class="iconfont icon-passwordNotView"
                  ></i>
                  <i v-else @click="p1type = 'password'" slot="suffix" class="iconfont icon-passwordView"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="重复密码" prop="p2" :style="{ margin: '25px 0' }">
                <el-input v-model="form.p2" :type="p2type" placeholder="请输入新密码">
                  <i v-if="p2type === 'password'" @click="p2type = 'text'" slot="suffix"
                     class="iconfont icon-passwordNotView"
                  ></i>
                  <i v-else @click="p2type = 'password'" slot="suffix" class="iconfont icon-passwordView"></i>
                </el-input>
              </el-form-item>
              <el-form-item class="footer">
                <!--            <el-button type="info" size="medium" @click="goBack"-->
                <!--              >返回</el-button-->
                <!--            >-->
                <!--            <el-button size="medium" @click="reset">重置</el-button>-->
                <el-button type="primary" style="float: right" size="minmedium" @click="submit">提交
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <div class="password-rule">
              <div>1.密码必须包含数字</div>
              <div>2.密码必须包含字母（同时包含大、小写字母）</div>
              <div>3.密码必须包含特殊字符</div>
              <div>4.密码长度范围为8位到50位</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getLoginPublicKey, resetUserPassword } from "@/api/user";
import { getUser } from "./api";
import JSEncrypt from "@/utils/jsencrypt.min.js";
import { getPasswordRule } from "@/api/common";
import {
  checkPasswordForLength,
  checkPasswordForLetter,
  checkPasswordForDigital,
  checkPasswordForSpecialCharacter
} from "@/utils/validate";

export default {
  name: "Password",
  data() {
    return {
      p0type: 'password',
      p1type: 'password',
      p2type: 'password',
      form: {
        p0: "",
        p1: "",
        p2: ""
      },
      rules: {
        p0: {
          required: true,
          validator: this.pwdValidatorP0
        },
        p1: {
          required: true,
          validator: this.pwdValidatorP1
        },
        p2: {
          required: true,
          validator: this.pwdValidator
        }
      },
      pubKey: ""
    };
  },
  computed: {
    ...mapGetters(["loginInfo"])
  },
  created() {
    this.getLoginPublicKey();
  },
  methods: {
    // ===========================测试后端接口===================================================================================
    async testUser() {
      let param = {
        entity: {
          userName: "前端"
        },
        current: 1,
        pageSize: 10
      };
      let res = await getUser(param);
      console.log("返回数据", res);
    },
    // ==============================================================================================================
    getFormData() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve({
              ...this.form
            });
          } else {
            resolve(false);
          }
        });
      });
    },

    async submit() {
      // 触发校验
      this.$refs.form.validate(async (valid) => {
        // console.log('触发校验触发校验触发校验', valid)
        if (valid) {
          const { success, message } = await resetUserPassword({
            encryptOldPassword: this.encrypt(this.form.p0),
            encryptNewPassword: this.encrypt(this.form.p1)
          });
          // console.log("resetUserPassword 2", success, message)
          if (!success) {
            return this.$message.error("修改密码失败：" + message);
          } else {
            this.$message.success("修改密码成功");
            //清除保存的登录信息
            this.clerCuruserStorage();
            await this.$store.dispatch("user/logout");
            this.$router.push(`/login?redirect=${this.$route.query.redirect}`);
            // location.reload()
          }
        }
      });
    },
    clerCuruserStorage() {
      let logininfo = this.$getStorage("userInfo");
      let loacalUserList = JSON.parse(
        JSON.stringify(this.$getStorage("userList"))
      );
      // 判断当前的账号是不是 列表中
      let index = loacalUserList?.findIndex(
        (item) => item.username === logininfo.username
      );
      if (index >= 0) {
        loacalUserList.splice(index, 1);
      }
      this.$setStorage("userList", loacalUserList);
      //清除cookie
      this.clearCookie("szgc-mdg-sid");
    },
    // 设置cookie
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
      console.warn(cname + "=" + cvalue + "; " + expires)
    },
    // 清除cookie
    clearCookie(name) {
      this.setCookie(name, "", -1);
    },
    //
    async submit1() {
      const formData = await this.getFormData();
      if (!formData) return;
      const res = await getPasswordRule();
      if (res) {
        if (res.data.minLength && res.data.maxLength) {
          const flag = checkPasswordForLength(
            formData.p1,
            res.data.minLength,
            res.data.maxLength
          );
          if (!flag) {
            return this.$message.error(
              "密码长度请保持在" +
              res.data.minLength +
              "~" +
              res.data.maxLength +
              "位"
            );
          }
        }
        if (res.data.letter) {
          const flag = checkPasswordForLetter(
            formData.p1,
            res.data.letterLowCase,
            res.data.letterUpCase
          );
          if (!flag) {
            if (res.data.letterUpCase && res.data.letterLowCase) {
              return this.$message.error("密码中须包含大小写字母！");
            }
            if (res.data.letterLowCase) {
              return this.$message.error("密码中须包含小写字母！");
            }
            if (res.data.letterUpCase) {
              return this.$message.error("密码中须包含大写字母！");
            }
            return this.$message.error("密码中须包含字母！");
          }
        }
        if (res.data.digital) {
          const flag = checkPasswordForDigital(formData.p1);
          if (!flag) {
            return this.$message.error("密码中须包含数字！");
          }
        }
        if (res.data.specialCharacter) {
          const flag = checkPasswordForSpecialCharacter(formData.p1);
          if (!flag) {
            return this.$message.error("密码中须包含特殊字符！");
          }
        }
        console.log(formData.p0);
        try {
          const { success, message } = await resetUserPassword({
            encryptOldPassword: this.encrypt(formData.p0),
            encryptNewPassword: this.encrypt(formData.p1)
          });
          console.log("resetUserPassword", success, message)
          if (!success) {
            return this.$message.error("修改密码失败：" + message);
          }
          this.$message.success("修改密码成功");
          //清除保存的登录信息
          this.clerCuruserStorage();
          await this.$store.dispatch("user/logout");
          this.$router.push(`/login?redirect=${this.$route.query.redirect}`);
          // location.reload()
        } catch (error) {
          this.$message.error("修改密码失败");
        }
      }
    },

    reset() {
      this.form = {
        p0: "",
        p1: "",
        p2: ""
      };

      this.$refs.form.resetFields();
    },
    pwdValidatorP0(rule, value, callback) {
      if (!value) {
        callback(new Error('旧密码不能为空'));
      } else {
        callback();
      }
      ;
    },

    pwdValidatorP1(rule, value, callback) {
      if (!value) {
        callback(new Error('密码不能为空'));
      } else if (value.length < 8 || value.length > 50) {
        callback(new Error('密码长度必须在8到50个字符之间'));
      } else if (!/[0-9]/.test(value)) {
        callback(new Error('密码必须包含至少一个数字'));
      } else if (!/[a-z]/.test(value)) {
        callback(new Error('密码必须包含至少一个小写字母'));
      } else if (!/[A-Z]/.test(value)) {
        callback(new Error('密码必须包含至少一个大写字母'));
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        callback(new Error('密码必须包含至少一个特殊字符'));
      } else {
        callback();
      }
      ;
    },
    pwdValidator(rule, value, callback) {
      if (this.form.p1 !== this.form.p2) {
        return callback(new Error("两次密码输入不一致"));
      }
      ;
      return callback();
    },
    goBack() {
      this.$router.replace(this.$route.query.redirect);
    },
    encrypt(str) {
      //加密前获取公钥
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.pubKey);
      return encrypt.encrypt(str);
    },
    getLoginPublicKey() {
      try {
        console.log("获取公钥");
        getLoginPublicKey().then((res) => {
          if (!res.success) {
            return this.$message.error("获取公钥失败: + res.message");
          }
          this.pubKey = res.data;
        });
      } catch (error) {
        this.$message.error("获取公钥失败: + error");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.password-rule > div {
  line-height: 24px;
}

i {
  color: #44A0FF;
}

.apply-page {
  text-align: center;

  .main {
    width: 600px;
    margin: 0 auto;
    text-align: initial;

    .back {
      font-size: 18px;
      color: #666;
      padding-top: 20px;

      em {
        cursor: pointer;

        * {
          vertical-align: middle;
        }
      }
    }

    .title {
      font-size: 26px;
      color: #333;
      font-weight: bold;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #ddd;
    }

    .apply-form {
      width: 600px;
      padding-top: 10px;

      .el-form-item.footer {
        padding-top: 10px;
        // .el-button {
        //   width: 190px;
        //   height: 52px;
        // }
      }
    }
  }
}

::v-deep input[type="password"]::-webkit-text-security {
  appearance: none;
}

::v-deep input[type="password"]::-moz-password-field {
  appearance: none;
}

::v-deep input[type="password"]::-ms-reveal {
  display: none;
}

::v-deep input[type="password"]::-ms-clear {
  display: none;
}
</style>

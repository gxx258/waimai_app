<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a
            href="javascript:;"
            :class="{ on: loginWay }"
            @click="loginWay = true"
            >短信登录</a
          >
          <a
            href="javascript:;"
            :class="{ on: !loginWay }"
            @click="loginWay = false"
            >密码登录</a
          >
        </div>
      </div>

      <div class="login_content">
        <form>
          <div :class="{ on: loginWay }">
            <section class="login_message">
              <input
                type="tel"
                maxlength="11"
                placeholder="手机号"
                v-model="phone"
              />
              <button
                :disabled="!rightPhone"
                class="get_verification"
                :class="{ right_phone: rightPhone }"
                @click.prevent="getCode"
              >
                {{ computeTime ? `已发送(${computeTime}s)` : "发送验证码" }}
              </button>
            </section>
            <section class="login_verification">
              <input
                type="tel"
                maxlength="8"
                placeholder="验证码"
                v-model="code"
              />
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{ on: !loginWay }">
            <section>
              <section class="login_message">
                <input
                  type="tel"
                  maxlength="11"
                  v-model="name"
                  placeholder="手机/邮箱/用户名"
                />
              </section>
              <section class="login_verification">
                <input
                  type="text"
                  maxlength="8"
                  placeholder="密码"
                  v-model="pwd"
                  v-if="showPwd"
                />
                <input
                  type="password"
                  maxlength="8"
                  placeholder="密码"
                  v-model="pwd"
                  v-else
                />
                <div
                  class="switch_button"
                  @click="showPwd = !showPwd"
                  :class="showPwd ? 'on' : 'off'"
                >
                  <div class="switch_circle" :class="{ right: showPwd }"></div>
                  <span class="switch_text">{{ showPwd ? "abc" : "..." }}</span>
                </div>
              </section>
              <section class="login_message">
                <input
                  type="text"
                  maxlength="11"
                  placeholder="验证码"
                  v-model="captcha"
                />
                <img
                  class="get_verification"
                  src="http://localhost:4000/captcha"
                  alt="captcha"
                  ref="captcha"
                  @click="getCaptcha"
                />
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>

        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <!-- 第一种 -->
      <!-- <router-link to="/profile" class="go_back">
             <i class="iconfont icon-jiantou2"></i>
        </router-link> -->

      <!-- 第二种 -->

      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip :alertText="alertText" v-show="showAlert" @closeTip="closeTip" />
  </section>
</template>

<script>
import AlertTip from "../../components/AlertTip/AlertTip";
import { reqPwdLogin, reqSendCode, reqSmsLogin } from "../../api/index";
export default {
  data() {
    return {
      loginWay: true, //true 代表短信登陆，false代表密码登陆
      phone: "",
      computeTime: 0,
      showPwd: false,
      code: "",
      alertText: "",
      showAlert: false,
      pwd: "",
      name: "",
      captcha: "",
    };
  },
  components: {
    AlertTip,
  },
  computed: {
    rightPhone() {
      return /^1\d{10}$/.test(this.phone);
    },
  },
  methods: {
    async getCode() {
      // 如果当前没有计时
      if (!this.computeTime) {
        // 启动倒计时
        this.computeTime = 30;
        this.intervalId = setInterval(() => {
          this.computeTime--;
          if (this.computeTime <= 0) {
            // 停止计时
            clearInterval(this.intervalId);
          }
        }, 1000);
      }

      // 发送ajax请求(向指定手机号发送验证码信息)
      const result = await reqSendCode(this.phone);
      // 信息错误时
      if (result.code === 1) {
        //显示提示
        this.show(result.msg);
        //停止计时
        if (this.computeTime) {
          this.computeTime = 0;
          clearInterval(this.intervalId);
        }
      }
    },
    show(alertText) {
      (this.showAlert = true), (this.alertText = alertText);
    },

    async login() {
      if (this.loginWay) {
        //短信登陆
        const { rightPhone, phone, code } = this;
        if (!rightPhone) {
          this.show("请输入正确的手机号");
          return;
        } else if (!/^\d{6}$/.test(code)) {
          this.show("请输入正确的验证码");
          return;
        }
         const result = {
          code:0,
          msg:"请重新数额u",
          data:{
            phone:'19802146294'
          }
         }
        // const result = await reqSmsLogin(phone, code);
        console.log(result);
        if (result.code === 0) {
          //将数据保存到vuex中
          const user = result.data;
          this.$store.dispatch("recordUser", user);
          //跳转页面
          this.$router.replace("/profile");
        } else {
          const msg = result.msg;
          this.show(msg);
        }
      } else {
        //密码登陆
        const { pwd, name, captcha } = this;
        console.log(name);
        if (!name) {
          this.show("请输入正确的用户名");
          this.getCaptcha();
          return;
        } else if (!pwd) {
          this.show("请输入正确的密码");
          this.getCaptcha();
          return;
        } else if (!captcha) {
          this.show("请输入正确的图形验证码");
          this.getCaptcha();
          return;
        }
        // 发送ajax请求(密码登陆)
        // const result = await reqPwdLogin({name, pwd, captcha})
        const result = {
          code: 0,
          msg: "",
          data: {
            name: "abc",
          },
        };

        // console.log(result);

        //不管正确与否都清除数据
        if (this.computeTime) {
          this.computeTime = 0;
          clearInterval(this.intervalId);
        }

        if (result.code === 0) {
          //将数据保存到vuex中
          const user = result.data;
          this.$store.dispatch("recordUser", user);
          //跳转页面
          this.$router.replace("/profile");
        } else {
          this.getCaptcha();
          const msg = result.msg;
          this.show(msg);
        }
      }
    },
    closeTip() {
      this.showAlert = false;
      this.alertText = "";
    },
    getCaptcha() {
      // 每次点击获取不同的captcha
      this.$refs.captcha.src =
        "http://localhost:4000/captcha?time=" + Date.now();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../commom/stylus/mixins.styl';

.loginContainer {
  width: 100%;
  height: 100%;
  background: #fff;

  .loginInner {
    padding-top: 60px;
    width: 80%;
    margin: 0 auto;

    .login_header {
      .login_logo {
        font-size: 40px;
        font-weight: bold;
        color: #02a774;
        text-align: center;
      }

      .login_header_title {
        padding-top: 40px;
        text-align: center;

        >a {
          color: #333;
          font-size: 14px;
          padding-bottom: 4px;

          &:first-child {
            margin-right: 40px;
          }

          &.on {
            color: #02a774;
            font-weight: 700;
            border-bottom: 2px solid #02a774;
          }
        }
      }
    }

    .login_content {
      >form {
        >div {
          display: none;

          &.on {
            display: block;
          }

          input {
            width: 100%;
            height: 100%;
            padding-left: 10px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            outline: 0;
            font: 400 14px Arial;

            &:focus {
              border: 1px solid #02a774;
            }
          }

          .login_message {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;

            .get_verification {
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);
              border: 0;
              color: #ccc;
              font-size: 14px;
              background: transparent;

              &.right_phone {
                color: black;
              }
            }
          }

          .login_verification {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;

            .switch_button {
              font-size: 12px;
              border: 1px solid #ddd;
              border-radius: 8px;
              transition: background-color 0.3s, border-color 0.3s;
              padding: 0 6px;
              width: 30px;
              height: 16px;
              line-height: 16px;
              color: #fff;
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);

              &.off {
                background: #fff;

                .switch_text {
                  float: right;
                  color: #ddd;
                }
              }

              &.on {
                background: #02a774;
              }

              >.switch_circle {
                position: absolute;
                top: -1px;
                left: -1px;
                width: 16px;
                height: 16px;
                border: 1px solid #ddd;
                border-radius: 50%;
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                transition: transform 0.3s;

                &.right {
                  transform: translateX(30px);
                }
              }
            }
          }

          .login_hint {
            margin-top: 12px;
            color: #999;
            font-size: 14px;
            line-height: 20px;

            >a {
              color: #02a774;
            }
          }
        }

        .login_submit {
          display: block;
          width: 100%;
          height: 42px;
          margin-top: 30px;
          border-radius: 4px;
          background: #4cd96f;
          color: #fff;
          text-align: center;
          font-size: 16px;
          line-height: 42px;
          border: 0;
        }
      }

      .about_us {
        display: block;
        font-size: 12px;
        margin-top: 20px;
        text-align: center;
        color: #999;
      }
    }

    .go_back {
      position: absolute;
      top: 5px;
      left: 5px;
      width: 30px;
      height: 30px;

      >.iconfont {
        font-size: 20px;
        color: #999;
      }
    }
  }
}
</style>
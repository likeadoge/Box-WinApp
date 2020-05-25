<template>
  <div class="container">
    <div class="top">
        <div class="header">
          <!--<a href="/">-->
            <!--<img src="~@/assets/logo.svg" class="logo" alt="logo">-->
            <!--<span class="title">DMBox</span>-->
          <!--</a>-->
          <img src="~@/assets/bg_logo2.png" class="logo" alt="logo">
          <span class="title">京州市天然气有限公司综合办公平台</span>
        </div>
        <!--<div class="desc">-->
          <!--DMBox 是中国最具影响力的 企业级 快速开发平台-->
        <!--</div>-->
      </div>

    <div class="login-wrap">
      <a-form-model :from="form" class="user-layout-login" ref="formLogin" id="formLogin">
        <a-form-item class="login-input">
          <a-input
            class="input-bg"
            size="large"
            type="text"
            placeholder="请输入帐户名"
            v-model="form.username"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>

        <a-form-item class="login-input">
          <a-input
            class="input-bg"
            size="large"
            type="password"
            autocomplete="false"
            placeholder="密码 / 123456"
            v-model="form.password"
            :loading="loginBtn"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>

        <a-form-item class="login-sure">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            @click.stop.prevent="()=>submit()"
          >确定</a-button>
        </a-form-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loginBtn: false,
      nodeVer: process.version,
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions(["Login"]),
    submit() {
      this.Login(this.form);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login-wrap {
  position: absolute;
  top: 78%;
  height: 40px;
  padding: 10px;
  margin: 0 20% 0;
  width: 60%;
}
.login-wrap .login-input {
  width: 40%;
  margin-right: 18px;
  height: 38px;
  float: left;
  line-height: 38px;
}
.login-wrap .login-sure {
  width: 14% !important;
  margin-top: 0;
  float: left;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}

.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>

<style lang="scss" scoped>

 @font-face { font-family: '方正正中黑简体'; src: url('~@/assets/font/方正中黑简体.TTF'); }
  
.container {
  width: 100%;
  height: 100%;
 background: #f0f2f5 url(~@/assets/bg.png) no-repeat fixed 0 0 /100% 102%;
  position: relative;

  a {
    text-decoration: none;
  }

  .top {
    text-align: center;

    .header {
      padding-top: 4%;

      .badge {
        position: absolute;
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
        margin-left: -12px;
        margin-top: -10px;
        opacity: 0.8;
      }

      .logo {
        display: block;
        height: 228px;
        margin: 0 auto;
        border-style: none;
      }

      .title {
        font-size: 56px;
        color: #00a2fc;
        font-family: "方正正中黑简体";
        font-weight: 600;
        text-shadow: 0px -5px 6px #fff, -5px 0px 6px #fff, 5px 0px 6px #fff,
          1px 5px 6px #fff, 1px 7px 7px rgba(0, 63, 109, 0.6);
        position: relative;
        display: block;
        /*margin-top: 2px;*/
      }
    }
    .desc {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }

  .main {
    margin: 0 auto;
  }

  .footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;

    .links {
      margin-bottom: 8px;
      font-size: 14px;
      a {
        color: rgba(0, 0, 0, 0.45);
        transition: all 0.3s;
        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }
}
</style>

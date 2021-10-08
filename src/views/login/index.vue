<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >

      <el-card class="box-card" style="">
        <div slot="header" class="clearfix">
          <div class="title-container">
            <h2 class="title">郏县教育局报账系统</h2>
          </div>
        </div>
        <div class="text item">
          <el-form-item prop="username">
            <el-row>
              <el-col :span="2">
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
              </el-col>
              <el-col :span="22">
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入账号"
                  name="username"
                  type="text"
                  tabindex="1"
                  autocomplete="on"
                />
              </el-col>
            </el-row>
            <!-- <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        /> -->
          </el-form-item>

          <el-form-item prop="password">
            <el-row>
              <el-col :span="2">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
              </el-col>
              <el-col :span="22">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="请输入密码"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
              </el-col>
            </el-row>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;padding:10px 0;font-size:14px"
            @click.native.prevent="handleLogin"
          >登 录
          </el-button>
        </div>
      </el-card>

    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business
      simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能少于5位'))
      } else {
        callback()
      }
    }
    return {
      value1: '',
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', validator: validateUsername }
        ],
        password: [
          { required: true, message: '请输入密码', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  computed: {
    ...mapGetters(['companyGroup'])
    /* ...mapGetters(['companyGroup']),
    companyGroupOptions() {
      return this.getTreeData(this.companyGroup)
    } */
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.getCurrentMonthLast()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录
    handleLogin() {
      this.loading = true
      this.$store
        .dispatch('user/login', this.loginForm)
        .then(() => {
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 获取设置登录日期为当前日期
    getCurrentMonthLast() {
      var date = new Date()
      var month = parseInt(date.getMonth() + 1)
      var day = date.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      this.loginForm.date = date.getFullYear() + '-' + month + '-' + day
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100% !important;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      width: 100% !important;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  /* 隐藏默认背景加入背景图片 */
  /* min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden; */
  width: 100%;
  height: 100%;
  background-image: url("../../assets/login_bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 150px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    margin-left: 50%;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 10px 5px 6px 11px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: $light_gray;
      margin: 0px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
<style type="text/css" scoped>
.login-container .el-card{
    background-color:#2d3a4b;
    border-color:#606266
}
.login-container .el-card .el-card__header{
    border-bottom: 1px solid #889aa4;
}
.login-container .el-form-item__error{
    color: #1890ff;
}
</style>

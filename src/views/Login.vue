<template>
  <div class="login-body">
    <el-card v-loading="loading"
             :body-style="{ padding: '0px' }"
             class="box-card">
      <el-image :src="picUrl"
                class="img"></el-image>
      <div class="login-box">
        <h1>登录</h1>
        <el-form ref="form"
                 :model="form"
                 :rules="rules">
          <el-form-item prop="name"
                        @keyup.enter.native="onSubmit('form')">
            <el-input name="name"
                      autocomplete="on"
                      autofocus="autofocus"
                      type="text"
                      v-model="form.name"
                      placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="pwd"
                        @keyup.enter.native="onSubmit('form')">
            <el-input name="pwd"
                      type="password"
                      show-password
                      v-model="form.pwd"
                      placeholder="密码"></el-input>
          </el-form-item>
          <el-button type="primary"
                     @click="onSubmit('form')">登录</el-button>
          <el-button type="warning"
                     @click="toRegister()">注册</el-button>
        </el-form>

      </div>
    </el-card>

  </div>
</template>
<script>

export default {
  data () {
    // add by axiang [20190609] 添加判断是否为管理员逻辑
    var validateUsername = (rule, value, callback) => {
      var reg = /^\w+$/
      if (!reg.test(value)) callback(new Error('请输入字母、数字或者下划线'))
      else callback()
    }
    return {
      loading: false,
      picUrl: require('../assets/image/login.jpg'),
      form: {
        name: '',
        pwd: ''
      },
      datas: [],
      rules: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'change'
          },
          { validator: validateUsername, trigger: 'change' }
        ],
        pwd: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    onSubmit (formName) {
      this.logger.d('点击登录按钮')

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.userLogin()
        } else {
          return false
        }
      })
    },
    async userLogin () {
      this.loading = true
      let params = new URLSearchParams()
      params.append('username', this.form.name)
      params.append('password', this.form.pwd)
      let dataGetLogin = await this.$http.post('/user/login', params)
        .catch(() => {
          this.loading = false
        })
      if (dataGetLogin.code !== 10000) {
        this.$message.error(dataGetLogin.msg)
        this.loading = false
      } else {
        let username = dataGetLogin.datas[0]
        let token = dataGetLogin.datas[1]
        let avatarUrl = dataGetLogin.datas[2].avatarUrl
        this.$store.commit('setUsername', username)
        this.$store.commit('setToken', token)
        this.$store.commit('setAvatarUrl', avatarUrl)
        this.$store.commit('setIsLogin', true)
        this.$notify.success({
          title: '登录成功',
          duration: 5000,
          position: 'top-left',
          // dangerouslyUseHTMLString: true,
          offset: 40,
          showClose: false,
          message: '欢迎回来，亲爱的 ' + username + ' !'
        })
        this.checkIsClockIn()
        this.checkUnReadMsgCount()
        this.loading = false
        this.$router.push({ path: '/' })
      }
    },
    async checkIsClockIn () {
      // add by axiang [20190613] 判断用户当天签到状态
      let username = this.$store.getters.getUsername
      let params = new URLSearchParams()
      params.append('username', username)
      let dataGetTodayClockIn = await this.$http.get('/check_in/is_checked', params)
      if (dataGetTodayClockIn.code === 10000) {
        this.$store.commit('setIsClockIn', false)
      } else {
        this.$store.commit('setIsClockIn', true)
      }
    },
    async checkUnReadMsgCount () {
      let username = this.$store.getters.getUsername
      let params = new URLSearchParams()
      params.append('username', username)
      let dataUnReadMsgCount = await this.$http.get('/user_message/unread/count', params)
      let unReadMsgCount = dataUnReadMsgCount.datas[0]
      this.$store.commit('setUnReadMsgCount', unReadMsgCount)
    },
    toRegister () {
      this.$router.push({ name: 'Register' })
    }
  }
}
</script>

<style scoped>
.login-body {
  width: 90%;
  margin: auto;
  min-height: 500px;
}

.box-card {
  width: 850px;
  margin: auto;
  margin-top: 40px;
}

.login-box {
  width: 400px;
  height: 100%;
  float: left;
  margin: 20px;
}

h1 {
  letter-spacing: 10px;
  font-size: 40px;
  color: #5d478b;
}

.img {
  float: left;
  background-image: url('../assets/image/login.jpg');
  background-size: cover;
  width: 380px;
  height: 380px;
}

.el-button {
  float: right;
  margin-left: 20px;
}

/* .l-captcha {
  height: 100px;
  width: 100px;
} */
</style>

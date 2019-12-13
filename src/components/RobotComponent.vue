<template>
  <div>
    <div v-if="!this.shutdown">
      <div class="customerservice-body">
        <el-popover :content="message"
                    width="200"
                    trigger="manual"
                    placement="right-start"
                    v-model="visiable">
          <!--FIXME: 原则上推荐使用element的组件而不用原生的内容，但是element的el-image组件在vue-cli4搭建的环境下会有bug
          BUG现象：图片上加上@click后，点击完图片会导致滚动条消失
          BUG原因：可能是element的el-image组件的渲染问题，或者是require('picUrl')这种写法引用图片的写法问题
            -->
          <!-- <el-image slot="reference"
                  class="service-img"
                  :src="urlService">
          <div slot="error"
               class="image-slot"
               @click="openDialog()">
            <i class="el-icon-picture-outline">加载失败</i>
          </div>
        </el-image> -->
          <img class="service-img"
               slot="reference"
               :src="urlService"
               @click="openDialog()" />
          <el-button v-if="isTalking"
                     type="warning"
                     slot="reference"
                     size="mini"
                     @click="this.stopTalking">别跳了，给👴爪巴</el-button>
          <el-button v-else
                     type="warning"
                     slot="reference"
                     size="mini"
                     @click="this.startTalking">“我生气了”</el-button>
        </el-popover>
      </div>
      <el-dialog title="智能教练敢敢"
                 width="60%"
                 :visible.sync="dialogVisible"
                 top="5vh">
        <!-- <iframe id="content"
              :src="this.src"
              width="100%"
              height="400px"
              frameborder="0"
              name="智能客服"
              scrolling="yes">
      </iframe> -->
        <h1>没钱没时间开发，敢敢裂开了 :(<br />
          氪金才能使我变聪明！
        </h1>
      </el-dialog>
    </div>
    <div v-else>
      <el-tooltip class="item"
                  effect="dark"
                  content="呼叫敢敢"
                  placement="top">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-chat-dot-round"
                   class="fixed-button"
                   @click="bringBack()"
                   circle></el-button>
      </el-tooltip>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      shutdown: false,
      isTalking: true,
      visiable: false,
      dialogVisible: false,
      time: '',
      src: '',
      // urlService: require('../assets/image/icon/robot.gif'),
      urlService: 'https://i.loli.net/2019/12/13/TnkKVyBZjA8aLc7.gif',
      message: '我是假机器人，我叫敢敢',
      commonMessage: [
        '听说包工头是个憨憨，所以给我起名叫敢敢',
        '我的智能是假的啦，没钱做开发 :)',
        '听说你代码写的不错，来给我当包身工吧'
      ],
      notLoginMessages: [
        '今天敲代码了嘛？还不快登录我去做题？',
        '包工头喊你敲代码了，登录了就能看到！',
        '登录就送价值9999999金币的大礼包（并没有）',
        '我是个心碎了的憨憨，我叫敢敢'],
      notClockInMessages: [
        '今天还没签到，快快签到啦',
        '听说签到了会拿到几块AC币，真好',
        '今天有多少人做题了呢，敢敢还不知道呢？帮敢敢看下嘛',
        '我是个心碎了的憨憨，我叫敢敢']

    }
  },
  mounted () {
    let _this = this
    this.time = setInterval(function () { _this.changeMessage() }, 6000)
  },
  methods: {
    bringBack () {
      this.shutdown = false
      this.startTalking()
    },
    openDialog () {
      this.dialogVisible = true
      // TODO: 服务挂了，暂时停用智能教练
      // let name = this.$route.name
      // if (name === 'Home') {
      //   this.src = 'http://39.100.235.47:8888/index.html?token=%7B%22to%22%3A%22%23demohelp%22%2C%22from%22%3A%22carol%22%2C%22type%22%3A%22kefu%22%7D&msg=%22home%22&mode=kefu&res=fwh5_desktop'
      // } else if (name === 'Contest' || name === 'ContestInfo') {
      //   this.src = 'http://39.100.235.47:8888/index.html?token=%7B%22to%22%3A%22%23demohelp%22%2C%22from%22%3A%22carol%22%2C%22type%22%3A%22kefu%22%7D&msg=%22rangegame%22&mode=kefu&res=fwh5_desktop'
      // } else if (name === 'Problem') {
      //   this.src = 'http://39.100.235.47:8888/index.html?token=%7B%22to%22%3A%22%23demohelp%22%2C%22from%22%3A%22carol%22%2C%22type%22%3A%22kefu%22%7D&msg=%22subject%22&mode=kefu&res=fwh5_desktop'
      // }
      // document.getElementById('content').src = this.src
    },
    changeMessage () {
      if (!this.$store.getters.getIsLogin) {
        let max = this.notLoginMessages.length - 1
        let min = 0
        this.message = this.notLoginMessages[Math.floor((Math.random() * (max - min + 1) + min))]
      } else if (!this.$store.getters.getIsClockIn) {
        let max = this.notClockInMessages.length - 1
        let min = 0
        this.message = this.notClockInMessages[Math.floor((Math.random() * (max - min + 1) + min))]
      } else {
        let max = this.commonMessage.length - 1
        let min = 0
        this.message = this.commonMessage[Math.floor((Math.random() * (max - min + 1) + min))]
      }
      this.visiable = !this.visiable
      setTimeout(() => {
        this.visiable = !this.visiable
      }, 3000)
    },
    stopTalking () {
      this.urlService = require('../assets/image/icon/robot_angry.jpg')
      this.message = '我才不爬，你能把我咋地？哼'
      this.visiable = true
      this.isTalking = false
      if (this.time) {
        clearInterval(this.time)
      }
      setTimeout(() => {
        this.message = '嘤嘤嘤，我爬了，想我的时候点左边的按钮叫我'
      }, 3000)
      setTimeout(() => {
        // this.visiable = false
        this.shutdown = true
      }, 6000)
    },
    startTalking () {
      this.message = '算你识相，哼'
      this.urlService = require('../assets/image/icon/robot.gif')
      this.visiable = true
      this.isTalking = true
      let _this = this
      this.time = setInterval(function () { _this.changeMessage() }, 6000)
    }
  },
  beforeDestroy () {
    if (this.time) {
      clearInterval(this.time)
    }
  }

}
</script>

<style scoped>
.customerservice-body {
  position: fixed;
  display: inline-block;
  z-index: 100;
  left: 10px;
  bottom: 30px;
  width: 150px;
  height: 180px;
}

.fixed-button {
  position: fixed;
  display: inline-block;
  left: 10px;
  bottom: 30px;
}

.service-img {
  cursor: pointer;
  width: 100%;
  height: 90%;
}
</style>

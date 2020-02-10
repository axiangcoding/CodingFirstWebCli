<template>
  <div>
    <div v-if="!this.shutdown">
      <div class="customerservice-body">
        <el-popover id="bot-dialog"
                    width="180"
                    trigger="manual"
                    placement="right-start"
                    v-model="visiable">
          <div v-html="message"></div>
          <div slot="reference">
            <img class="service-img"
                 :src="urlService"
                 @click="openDialog()" />
            <el-button v-if="isTalking"
                       type="warning"
                       size="mini"
                       @click="this.stopTalking">别跳了，给👴爪巴</el-button>
            <el-button v-else
                       type="warning"
                       size="mini"
                       @click="this.startTalking">“我生气了”</el-button>
          </div>

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
      urlService: 'https://i.loli.net/2019/12/13/TnkKVyBZjA8aLc7.gif',
      message: '我是假机器人，我叫敢敢'
      // commonMessage: [
      //   '听说包工头是个憨憨，所以给我起名叫敢敢',
      //   '我的智能是假的啦，没钱做开发 :)',
      //   '听说你代码写的不错，来给我当包身工吧'
      // ],
      // notLoginMessages: [
      //   '今天敲代码了嘛？还不快登录我去做题？',
      //   '包工头喊你敲代码了，登录了就能看到！',
      //   '登录就送价值9999999金币的大礼包（并没有）',
      //   '我是个心碎了的憨憨，我叫敢敢'],
      // notClockInMessages: [
      //   '今天还没签到，快快签到啦',
      //   '听说签到了会拿到几块AC币，真好',
      //   '今天有多少人做题了呢，敢敢还不知道呢？帮敢敢看下嘛',
      //   '我是个心碎了的憨憨，我叫敢敢']
    }
  },
  mounted () {
    let _this = this
    this.time = setInterval(function () { _this.changeMessage() }, 6000)
  },
  watch: {
    '$route': 'changePage'
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
      // if (!this.$store.getters.getIsLogin) {
      //   let max = this.notLoginMessages.length - 1
      //   let min = 0
      //   this.message = this.notLoginMessages[Math.floor((Math.random() * (max - min + 1) + min))]
      // } else if (!this.$store.getters.getIsClockIn) {
      //   let max = this.notClockInMessages.length - 1
      //   let min = 0
      //   this.message = this.notClockInMessages[Math.floor((Math.random() * (max - min + 1) + min))]
      // } else {
      //   let max = this.commonMessage.length - 1
      //   let min = 0
      //   this.message = this.commonMessage[Math.floor((Math.random() * (max - min + 1) + min))]
      // }
      // this.visiable = !this.visiable
      // setTimeout(() => {
      //   this.visiable = !this.visiable
      // }, 3000)
    },
    changePage () {
      // 如果有计时切换消息则取消，重新设定
      if (this.time) {
        clearInterval(this.time)
      }
      switch (this.$route.name) {
        case 'Index':
          this.message = '欢迎来到<strong>一码当先在线编程系统</strong>，我是假机器人敢敢，我偶尔会冒泡说两句话哦。'
          break
        case 'Status':
          this.message = '你所提交的每一道题都在这里有记录哦，包括在我们的网站上提交的<strong>其他网站题目</strong>'
          break
        case 'Contest':
          if (this.$route.query.kind === '0') {
            this.message = '积极参加比赛可以检验你平时刷题的水平哦，我们开放了 <strong>练习赛</strong> 给你熟悉熟悉我们的编程环境'
          } else if (this.$route.query.kind === '1') {
            this.message = '多参加<strong>积分赛</strong>你会变得更强！'
          } else if (this.$route.query.kind === '2') {
            this.message = '何不如在 <strong>趣味赛</strong> 中玩点花样？'
          } else if (this.$route.query.kind === '3') {
            this.message = '<strong>正式赛</strong> 里有奖品拿？你猜'
          } else if (this.$route.query.kind === '5') {
            this.message = '闲得无聊的比赛管理员可能会在 <strong>DIY赛</strong> 里搞事，可以来围观一下'
          } else {
            this.message = ''
          }
          break
        case 'MainRank':
          this.message = '来看看本站<strong>食物链顶端</strong>的男人和女人吧！！！'
          break
        case 'HonorRank':
          this.message = '为学校增光添彩，为本站做出贡献的个人、小队将会在这里有<strong>一席之地</strong>！'
          break
        case 'Challenge':
          this.message = '全村人最喜欢的<strong>挑战模式</strong>！'
          break
        case 'Discuss':
          this.message = '只要你不是祖安人，我们都是好朋友 XD'
          break
        case 'Mall':
          this.message = '花点ACB给自己买点小玩意吧（吃的也有，小心长胖）'
          break
        // case 'Index':
        //   this.message = ''
        //   break
        // case 'Index':
        //   this.message = ''
        //   break
        // case 'Index':
        //   this.message = ''
        //   break
        // case 'Index':
        //   this.message = ''
        //   break
        // case 'Index':
        //   this.message = ''
        //   break
        case 'LocalProblem':
          this.message = '<strong>什么是本地题库？</strong><br/>本地题库指的是所有题目数据及评测样例均保存在本地服务器中'
          break
        case 'VJudgeProblem':
          this.message = '<strong>什么是Virtual Judge题库？</strong><br/>Virtual Judge题库指的是我们从Virtual Judge平台中获取题目，所有内容均为公开数据'
          break
        default:
          this.message = '好无聊啊，我什么时候才能变聪明起来'
          break
      }
      this.visiable = true
      this.time = setInterval(() => {
        this.visiable = false
      }, 6000)
    },
    stopTalking () {
      if (this.time) {
        clearInterval(this.time)
      }
      this.message = '嘤嘤嘤，我爬了，想我的时候点左边的按钮叫我'
      this.urlService = require('../assets/image/icon/robot_angry.jpg')
      setTimeout(() => {
        this.visiable = true
        this.isTalking = false
        this.shutdown = true
      }, 2500)
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

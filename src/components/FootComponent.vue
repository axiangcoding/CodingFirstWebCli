<template>
  <div class="foot-box">
    <h1 class="title-span">
      一码当先 Online Judge<span class="version-span"> v{{ version }}测试</span>
    </h1>
    <div class="link-box">
      <el-link @click="goReportBug">BUG反馈</el-link> | <el-link>FAQ</el-link> |
      <el-link>开发团队</el-link> | <el-link>加入我们</el-link> |
      <el-link>闽ICP备xxxxxxxx号-1</el-link>
    </div>
    <span class="power-span">Power by ©515项目组-FJUTOJ</span>
    <BugReport :dialogVisible="showBugReport"
               @visiable="changeVisiable"></BugReport>
  </div>
</template>

<script>
import BugReport from './BugReportComponent'
export default {
  components: {
    BugReport
  },
  data () {
    return {
      version: '',
      showBugReport: false,
      date: new Date().toLocaleString('chinese', { hour12: false })
    }
  },
  mounted () {
    this.getVersion()
    let _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date().toLocaleString('chinese', { hour12: false }) // 修改数据date
    }, 1000)
  },
  methods: {
    goReportBug () {
      this.showBugReport = true
    },
    changeVisiable (val) {
      this.showBugReport = false
    },
    async getVersion () {
      let params = new URLSearchParams()
      params.append('name', 'version')
      let dataVersion = await this.$http.get('/system/info/get', params)
      this.version = dataVersion.datas[0].value
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer) // 在vue实例销毁钱，清除定时器
    }
  }
}
</script>

<style scoped>
.foot-box {
  margin: 0;
  width: 100%;
  font-family: '微软雅黑', '宋体', 'Arial Narrow', Helvetica, sans-serif;
  font-size: 15px;
}

.title-span {
  margin: 4px;
}

.version-span {
  font-size: 14px;
}

.link-box {
  margin-bottom: 10px;
  padding: 0px;
}

.power-span {
  margin: 5px;
}
</style>

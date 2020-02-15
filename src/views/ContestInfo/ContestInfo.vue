<template>
  <div class="contestinfo-body">
    <h1>{{contestInfo.title}}</h1>
    <el-tabs type="border-card"
             v-model="activeTab">
      <el-tab-pane label="主页"
                   name="1">
        <div class="detail-box">
          比赛时间：
          {{formatterDate(this.contestInfo.beginTime)}}
          -
          {{formatterDate(this.contestInfo.endTime)}}
          <br />
          比赛状态：
          <span :class="switchStatusClass(this.contestInfo.status)">{{this.contestInfo.status}}</span>
          <br />
          比赛说明：
          <el-card>
            <span v-html="this.contestInfo.description?this.contestInfo.description:'无'"></span>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="题目列表"
                   name="2"
                   style="padding:0px;margin:0px;">
        <!-- A~Z的按钮 -->
        <el-button v-for="item in ProblemList"
                   :key="item.problemId"
                   @click="switchProblem(item.problemId)"
                   type="info"
                   plain>{{String.fromCharCode(item.problemOrder + 65)}}</el-button>
        <el-divider></el-divider>
        <ContestSubmitComponent v-if="this.showSubmit && this.ProblemList.length"
                                :readOnly="this.contestInfo.status!=='正在进行'"
                                :pid="selectedPid"
                                :cid="String(this.$route.query.cid)"
                                @toPane="switchTabPane"></ContestSubmitComponent>
      </el-tab-pane>
      <el-tab-pane label="在线评测"
                   name="3">
        <ContestStatusComponent v-if="this.contestInfo.statusReadOut === 1"
                                :cid="this.contestId"
                                :contestInfo="this.contestInfo"></ContestStatusComponent>
        <span class="detail-red-font"
              v-else>本场比赛不允许查看评测记录</span>
      </el-tab-pane>
      <el-tab-pane label="实时排名"
                   name="4">
        <!-- TODO: 滚版 -->
        <div v-if="this.contestInfo.showBorderList === 1">

        </div>
        <span class="detail-red-font"
              v-else>本场比赛不允许查看实时排名</span>
      </el-tab-pane>
      <el-tab-pane label="在线讨论"
                   name="5">
        <!-- 在线聊天 -->
        <ContestOnlineDiscussComponent></ContestOnlineDiscussComponent>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import ContestProblemComponent from '../views/ContestInfo/ContestProblemComponent'
import ContestSubmitComponent from './ContestSubmitComponent'
import ContestStatusComponent from './ContestStatusComponent'
import ContestOnlineDiscussComponent from './ContestOnlineDiscussComponent'
import formatterDate from '../../utils/formatterDate'

export default {
  data () {
    return {
      contestId: '',
      contestInfo: '',
      selectedPid: '1',
      ProblemList: [],
      activeTab: '1',
      showSubmit: false,
      showStatus: false
    }
  },
  components: {
    // ContestProblemComponent,
    ContestSubmitComponent,
    ContestStatusComponent,
    ContestOnlineDiscussComponent
  },
  created () {
    this.contestId = String(this.$route.query.cid)
    this.showStatus = true
  },
  mounted () {
    this.getContest()
    this.getProblemList()
  },
  methods: {
    async getContest () {
      let params = new URLSearchParams()
      params.append('contestId', this.contestId)
      params.append('username', this.$store.getters.getUsername)
      let dataContest = await this.$http
        .get('/contest/info', params)
        .catch(() => {
        })
      this.contestInfo = dataContest.datas[0]
      let currentTime = new Date()
      if (currentTime < new Date(this.contestInfo.beginTime)) {
        this.contestInfo.status = '未开始'
      } else if (currentTime < new Date(this.contestInfo.endTime)) {
        this.contestInfo.status = '正在进行'
      } else {
        this.contestInfo.status = '已结束'
      }
    },
    async getProblemList () {
      this.contestId = String(this.$route.query.cid)
      let params = new URLSearchParams()
      params.append('contestId', this.contestId)
      let dataProblemList = await this.$http
        .get('/contest/problem/list', params)
        .catch(() => {
        })
      this.ProblemList = dataProblemList.datas[0]

      this.selectedPid = String(this.ProblemList[0].problemId)
      this.showSubmit = true
    },
    switchProblem (pid) {
      this.selectedPid = String(pid)
    },
    switchTabPane (val) {
      this.activeTab = val
    },
    switchStatusClass (val) {
      if (val === '正在进行') {
        return 'detail-green-font'
      } else if (val === '已结束') {
        return 'detail-red-font'
      } else {
        return 'detail-blue-font'
      }
    },
    formatterDate (val) {
      return formatterDate(val)
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$confirm('正在离开本页面，本页面内所有未保存数据都会丢失', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next()
    }).catch(() => {
      // 如果取消跳转地址栏回退到之前位置
      window.history.go(1)
    })
  }
}
</script>

<style scoped>
.contestinfo-body {
  width: 90%;
  margin: auto;
  min-height: 800px;
  margin-bottom: 20px;
}

.detail-box {
  width: 80%;
  text-align: left;
  line-height: 40px;
  margin: auto;
  font-size: 18px;
}

.detail-font {
  font-size: 18px;
}

.detail-green-font {
  font-size: 18px;
  color: green;
  font-weight: bold;
}

.detail-blue-font {
  font-size: 18px;
  color: blue;
  font-weight: bold;
}

.detail-red-font {
  font-size: 18px;
  color: red;
  font-weight: bold;
}
</style>>

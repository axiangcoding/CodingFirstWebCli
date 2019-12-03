<template>
  <!-- TODO: add by axiang [20190702] 增加更多可视化的图表之类的内容 -->
  <div class="view-body">
    <el-card class="head-card">
      <el-row :gutter="0">
        <el-col :span="5">
          <div><span>评测结果: </span>
            <el-tag
              :type="this.switchResultColor(this.judgeStatus.result)"
              size="medium"
            >{{this.judgeStatus.result?this.judgeStatus.result:'-'}}</el-tag>
          </div>
        </el-col>
        <el-col :span="4">
          <div><span>评测ID: </span>
            <el-tag
              type="primary"
              size="medium"
            >{{this.judgeStatus.id?this.judgeStatus.id:'-'}}</el-tag>
          </div>
        </el-col>
        <el-col :span="4">
          <div><span>题目ID: </span>
            <el-tag
              type="primary"
              size="medium"
            >{{this.judgeStatus.problemId?this.judgeStatus.problemId:'-'}}</el-tag>
          </div>
        </el-col>
        <el-col :span="4">
          <div><span>编程语言: </span>
            <el-tag
              type="primary"
              size="medium"
            >{{this.judgeStatus.language?this.judgeStatus.language:'-'}}</el-tag>
          </div>
        </el-col>
        <el-col :span="4">
          <div><span>提交人: </span>
            <el-tag
              type="primary"
              size="medium"
            >{{this.judgeStatus.nick?this.judgeStatus.nick:'-'}}</el-tag>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="head-card">评测详情：
      <pre>{{this.judgeResult?this.judgeResult.info:'无'}}</pre>
    </el-card>
    <div class="code-box">
      <aceEditor
        class="code-editor"
        :language="this.languge"
        :readOnly="true"
        :value="this.judgeStatus.code"
      ></aceEditor>
    </div>
  </div>
</template>
<script>
import aceEditor from '@/components/AceEditor'
export default {
  components: {
    aceEditor
  },
  data () {
    return {
      judgeStatus: '',
      judgeResult: ''
    }
  },
  mounted () {
    if (this.$store.getters.getIsLogin) {
      this.getJudgeDetails()
    } else {
      this.$notify({
        title: '提示',
        message: '登录后才能查看哦',
        type: 'warning',
        offset: 100,
        duration: 3000
      })
    }
  },
  methods: {
    async getJudgeDetails () {
      let params = new URLSearchParams()
      let pidTmp = this.$route.query.id
      params.append('judgeId', pidTmp)
      params.append('username', this.$store.getters.getUsername)
      let dataStatus = await this.$http.get('/judge_result/info/get', params)
      this.judgeResult = dataStatus.datas[0]
      this.judgeStatus = dataStatus.datas[1]
    },
    switchResultColor (str) {
      if (typeof str === 'undefined') {
        return 'danger'
      }
      if (str === 'Accepted' || str === 'Score 100') {
        return 'success'
      } else if (str === 'Presentation Error') {
        return 'warning'
      } else if (str === 'Pending...' || str === 'Judging...') {
        return 'info'
      } else if (str === 'Submit Error' || str.substring(0, 5) === 'Score') {
        return ''
      } else {
        return 'danger'
      }
    }
  }
}
</script>
<style scoped>
.view-body {
  float: left;
  width: 100%;
  margin: 0;
  margin-bottom: 15px;
  padding: 0;
  min-height: 100px;
}

.head-card {
  width: 86%;
  display: block;
  margin-left: 7%;
  margin-right: 7%;
  margin-bottom: 20px;
  margin-top: 20px;
  padding: 0;
  background-color: #eeeeee;
}

.el-tag {
  font-size: 15px;
}

.code-box {
  width: 86%;
  margin: auto;
  min-height: 100px;
}
</style>

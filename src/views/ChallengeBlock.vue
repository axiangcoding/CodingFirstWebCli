<template>
  <div class="block-box">
    <el-card
      :body-style="{ padding: '0px' }"
      class="box-card"
    >
      <div slot="header">
        <span>挑战模式&nbsp;&nbsp;</span>
        <span>模块：【{{this.blockDetail.name}}】</span>
      </div>
      <div class="block-description">
        <el-collapse
          id="challenge-block"
          v-model="defopen"
        >
          <el-collapse-item name="1">
            <template slot="title">
              <div>模块说明</div>
            </template>
            <div
              class="des-detail"
              v-html="this.blockDetail.des"
            >{{this.blockDetail.des}}</div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <div>模块类型</div>
            </template>
            <div class="des-detail">{{this.blockDetail.type}}</div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <div>开启条件</div>
            </template>
            <div
              class="des-detail"
              v-html="this.blockDetail.condition"
            >{{this.blockDetail.condition}}</div>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title">
              <div>我的状态</div>
            </template>
            <div class="des-detail">
              <div class="solving-progress">
                完成进度：( {{this.blockDetail.getScore}} 分/ {{this.blockDetail.totalScore}} 分 )：
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="this.percent"
                  :color="this.customColorMethod(this.percent)"
                ></el-progress>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template slot="title">
              <div>题目列表</div>
            </template>
            <div class="des-problem-list">
              <div class="search-input">
                <!-- TODO: 现在的html结构有问题，没办法放按钮在同一排，需要在栏目外层加一个div -->
                <!-- TODO: 功能还没做 -->
                <!-- <el-input
                  placeholder="请输入标题"
                  size="mini"
                >
                  <template slot="prepend">查找题目：</template>
                  <template slot="append">
                    <el-button icon="el-icon-search"></el-button>
                  </template>
                </el-input> -->
              </div>
              <el-divider></el-divider>
              <el-pagination
                class="bar-pagination"
                layout="total, prev, pager, next, jumper"
                :total="this.totalCol"
                :page-size="this.pageSize"
                @current-change="getList"
                :current-page="this.currentPage"
              ></el-pagination>

              <el-table
                style="width:100%;"
                :data="this.tableData"
                v-loading="this.loading"
              >
                <el-table-column
                  label="是否解决"
                  min-width="10%"
                >
                  <template slot-scope="scope">
                    <div :class="scope.row.isSolved==='✔'?'success-row':scope.row.isSolved==='？'?'warning-row':'error-row'">{{scope.row.isSolved}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  type="index"
                  :index="indexChange"
                  min-width="10%"
                ></el-table-column>
                <el-table-column
                  prop="problemId"
                  label="题号"
                  min-width="10%"
                ></el-table-column>
                <el-table-column
                  prop="title"
                  label="题目标题"
                  min-width="50%"
                >
                  <template slot-scope="scope">
                    <el-link
                      type="primary"
                      @click="toSubmit(scope.row.problemId)"
                    >{{scope.row.title}}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="积分"
                  min-width="20%"
                >
                  <template slot-scope="scope">
                    <div :class="scope.row.solved === '✔'?'row-solved':scope.row.solved===''?'row-not-submit':'row-solving'">{{scope.row.score}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rewardAcb"
                  label="奖励ACB"
                  min-width="10%"
                ></el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      totalCol: 0,
      defopen: ['1', '2', '3', '4', '5'],
      blockDetail: {
        id: '',
        name: '未找到',
        des: '',
        type: '',
        condition: '',
        totalScore: 0,
        getScore: 0
      },
      pageSize: 10,
      currentPage: 1,
      percent: 0,
      loading: true
    }
  },
  mounted () {
    // add by axiang [20190701] 依次进行以下步骤填充界面
    if (this.$store.getters.getIsLogin) {
      this.getBlockDetail(this.$route.query.id)
      this.getBlockProblems(this.currentPage)
    } else {
      this.$notify({
        title: '提示',
        message: '登录后才能查看',
        type: 'warning',
        offset: 100,
        duration: 3000
      })
      this.loading = false
    }
  },
  methods: {
    indexChange (index) {
      return (this.currentPage - 1) * 10 + index + 1
    },
    getList (val) {
      this.currentPage = val
      this.getBlockProblems()
    },
    // add by axiang [20190701] 根据进度条的进度来改变颜色，现在的颜色不合适，找机会替换掉
    customColorMethod (percent) {
      if (percent < 30) {
        return '#909399'
      } else if (percent < 100) {
        return '#e6a23c'
      } else {
        return '#67c23a'
      }
    },
    toSubmit (pid) {
      this.$router.push({ path: '/Submit', query: { pid: pid } })
    },
    async getBlockDetail (blockId) {
      let params = new URLSearchParams()
      params.append('blockId', blockId)
      params.append('username', this.$store.getters.getUsername)
      let dataBlockDetail = await this.$http.get('/challenge_block/detail', params)
      if (dataBlockDetail.code === 10000) {
        let dataBlockTemp = dataBlockDetail.datas[0]
        this.blockDetail.getScore = dataBlockTemp.getScore
        this.blockDetail.id = dataBlockTemp.id
        this.blockDetail.name = dataBlockTemp.name
        this.blockDetail.des = dataBlockTemp.description
        this.blockDetail.type = dataBlockTemp.blockType
        this.blockDetail.totalScore = dataBlockTemp.totalScore
        let res = ''
        let dataPreCondition = dataBlockDetail.datas[1]
        if (typeof dataPreCondition === 'undefined') {
          res = '无条件解锁<br>'
        } else {
          for (let i = 0; i < dataPreCondition.length; i++) {
            res += `在模块【${dataPreCondition[i].name}】中获得【${dataPreCondition[i].num} 分】<br>`
          }
        }
        this.blockDetail.condition = res
      } else {
        this.$message({ message: '获取本模块详情失败！ ', type: 'error' })
      }
      this.percent = parseFloat(
        (
          (this.blockDetail.getScore / this.blockDetail.totalScore) *
          100
        ).toFixed(2)
      )
    },

    async getBlockProblems () {
      this.loading = true
      let params = new URLSearchParams()
      params.append('username', this.$store.getters.getUsername)
      params.append('blockId', this.$route.query.id)
      params.append('pageNum', this.currentPage)
      params.append('pageSize', this.pageSize)
      let dataBlockProblems = await this.$http
        .get('/challenge_block/problem', params)
      if (dataBlockProblems.code === 10000) {
        this.tableData = dataBlockProblems.datas[0]
        this.totalCol = dataBlockProblems.datas[1]
        // 对是否解答进行处理，把数字替换为'✔'，'✘'和null
        // for (let i = 0; i < this.tableData.length; i++) {
        //   let showSolvedIcon = ''
        //   if (this.tableData[i].solved === 1) {
        //     showSolvedIcon = '✔'
        //   } else if (this.tableData[i].solved === 0) {
        //     showSolvedIcon = '?'
        //   } else {
        //     showSolvedIcon = '✘'
        //   }
        //   this.tableData[i].solved = showSolvedIcon
        // }
      } else if (dataBlockProblems.code === 10001) {
        this.$message({ message: '本模块没有题目！', type: 'warning' })
      } else {
        this.$message({ message: '获取题目失败！', type: 'error' })
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 70%;
  height: 100%;
  min-height: 800px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
}

.block-head {
  background-color: #f5f5f5;
  height: 35px;
  width: 100%;
  margin: 0;
  border-bottom: 1px solid #eeeeee;
  padding: 10px 15px;
  display: block;
}

.block-description {
  min-height: 300px;
  width: 100%;
  height: auto;
}

.des-detail {
  font-size: 16px;
  text-align: left;
  padding-left: 80px;
  padding-right: 80px;
}

.des-detail-problem-table {
  margin: 0;
}

.des-problem-list {
  margin: 0;
}

.solving-progress {
  width: 40%;
}

.table-function-menu {
  width: 100%;
}

.bar-pagination {
  margin-left: 20px;
  float: left;
}

.search-input {
  width: 320px;
}

.success-row {
  color: green;
  font-weight: bold;
}

.error-row {
  color: red;
  font-weight: bold;
}

.warning-row {
  color: blue;
  font-weight: bold;
}
</style>

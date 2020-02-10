<template>
  <div class="problem-body">
    <div class="function-bar">
      <el-checkbox class="bar-search-item"
                   v-model="myCollection">我的收藏</el-checkbox>
      <el-input v-model="searchTitle"
                class="bar-search-item-input"
                size="mini"
                placeholder="请输入标题">
        <template slot="prepend">标题</template>
      </el-input>
      <el-select v-model="searchTag"
                 class="bar-search-item-select"
                 size="mini"
                 placeholder="请选择标签">
        <el-option v-for="item in problemTags"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id"></el-option>
      </el-select>
      <el-button size="mini"
                 class="bar-search-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="handleSelect()">筛选</el-button>
      <el-button size="mini"
                 class="bar-search-item"
                 type="info"
                 icon="el-icon-s-grid"
                 @click="handleBackToAll">查看全部</el-button>
    </div>
    <el-pagination layout="total, prev, pager, next, jumper"
                   :current-page="this.currentPage"
                   @current-change="switchPage"
                   :total="this.total"
                   :page-size="this.pageSize"></el-pagination>
    <el-table :data="this.tableData"
              v-loading="loading">
      <el-table-column label="是否解决"
                       min-width="20%">
        <template slot-scope="scope">
          <span :class="scope.row.isSolved==='✔'?'success-row':scope.row.isSolved==='？'?'warning-row':'error-row'">{{scope.row.isSolved}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="problemId"
                       label="#"
                       min-width="20%"></el-table-column>
      <el-table-column prop="Title"
                       label="题目标题"
                       min-width="80%">
        <template slot-scope="scope">
          <el-link type="primary"
                   @click="toSubmit(scope.row.problemId)">{{scope.row.title}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="ratio"
                       label="通过率（通过人数/总提交数）"
                       min-width="50%"></el-table-column>
      <el-table-column label="题目难度"
                       min-width="20%">
        <template slot-scope="scope">
          <el-tag :type="scope.row.difficult==='简单'?'success': scope.row.difficult==='中等'? 'warning':'danger'"
                  effect="dark"> {{scope.row.difficult}} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="题目来源"
                       prop="belongToOj"
                       min-width="20%"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
      myCollection: false,
      searchTitle: '',
      searchTag: '',
      problemTags: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [],
      isSearch: false,
      loading: false
    }
  },
  mounted () {
    this.getProlem()
    this.getProblemTags()
  },
  methods: {
    switchPage (val) {
      this.currentPage = val
      this.getProlem()
    },
    handleSelect () {
      this.currentPage = 1
      this.getProlem()
    },
    handleBackToAll () {
      this.currentPage = 1
      this.myCollection = false
      this.searchTitle = ''
      this.searchTag = ''
      this.getProlem()
    },
    toSubmit (pid) {
      this.$router.push({ path: '/Submit', query: { pid: pid } })
    },
    // add by axiang [20190714] 船新升级版逻辑，将筛选逻辑放在后端去做
    async getProlem () {
      this.loading = true
      let params = new URLSearchParams()
      params.append('pageNum', this.currentPage)
      params.append('pageSize', this.pageSize)
      params.append('tagId', this.searchTag)
      params.append('title', this.searchTitle)
      params.append('username', this.$store.getters.getUsername)
      params.append('isStar', this.myCollection)
      let dataProblemsByPage = await this.$http
        .get('/problem/list/get', params)
        .catch(() => {
          this.loading = false
        })
      if (dataProblemsByPage.code !== 10000) {
        this.$message.error('题目获取失败！')
      }
      this.tableData = dataProblemsByPage.datas[0]
      this.total = dataProblemsByPage.datas[1]
      this.getProblemTagRecords()
      this.loading = false
    },
    // 获取用户解答状态
    async getProblemSovle () {
      let params = new URLSearchParams()
      params.append('username', this.$store.getters.getUsername)
      let dataProblemSolve = await this.$http.get('/problem/getProblemSolve', params)
      let dataTempSolve = dataProblemSolve.datas[0]
      for (let i = 0; i < dataTempSolve.length; i++) {
        this.problemSolveMap.set(dataTempSolve[i].pid, dataTempSolve[i].solved)
      }
    },
    async getProblemTags () {
      let params = new URLSearchParams()
      let dataProblemTags = await this.$http
        .get('/problem_tag/get', params)
      let dataTempTags = dataProblemTags.datas[0]
      if (typeof dataTempTags === 'undefined') {
        return
      }
      dataTempTags.unshift({
        id: '',
        name: '-'
      })
      this.problemTags = dataTempTags
    },
    async getProblemTagRecords () {
      // let params = new URLSearchParams()
      // let dataProblemTags = await this.$http
      //   .get('/problemTag/getAllProblemTagRecord', params)
      // let dataTempTags = dataProblemTags.datas[0]
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'Submit') {
      from.meta.keepAlive = true
    } else {
      from.meta.keepAlive = false
    }
    next()
  }
}
</script>

<style scoped>
.problem-body {
  width: 100%;
  min-height: 700px;
  padding-top: 0;
  margin: 0;
  margin-bottom: 20px;
  font-family: 微软雅黑, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.function-bar {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eeeeee;
}

.bar-search-item-input {
  float: left;
  width: 250px;
  margin-right: 20px;
}

.bar-search-item-select {
  float: left;
  width: 200px;
  margin-right: 20px;
}

.bar-search-item {
  float: left;
  margin-right: 20px;
}

.search-button {
  float: left;
}

.el-pagination {
  float: left;
}

.success-row {
  font-weight: bold;
  color: green;
}

.error-row {
  font-weight: bold;
  color: red;
}

.warning-row {
  font-weight: bold;
  color: blue;
}
</style>

<template>
  <div class="problem-body">
    <el-card class="box-card">
      <div slot="header">
        <div v-if="this.$route.name === 'LocalProblem'">本地题库</div>
        <div v-else>Virtual Judge题库</div>
      </div>

      <LocalProblemComponent v-if="this.$route.name === 'LocalProblem'"></LocalProblemComponent>
      <VJProblemComponent v-else></VJProblemComponent>
    </el-card>
  </div>
</template>

<script>
import LocalProblemComponent from './LocalProblemComponent'
import VJProblemComponent from './VJProblemComponent'

export default {
  components: {
    LocalProblemComponent,
    VJProblemComponent
  },
  data () {
    return {

    }
  },
  created () {
  },
  mounted () {

  },
  beforeDestroy () {

  },
  methods: {
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

.box-card {
  width: 80%;
  height: 100%;
  min-height: 500px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
}
</style>

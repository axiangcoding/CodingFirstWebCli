import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import http from './api/http'
import logger from './utils/logger'
import VueHighlightJS from 'vue-highlightjs'
import ace from 'ace-builds'
import './assets/css/global.css'
import './assets/css/elcard.css'
import './assets/css/elcollapse.css'
import './assets/css/rank.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueHighlightJS)
Vue.use(ace)

Vue.prototype.$http = http
Vue.prototype.logger = logger

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

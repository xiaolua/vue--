// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import elementUi from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'


// 引入插件 element-tree-grid
import TreeGrid  from 'element-tree-grid'

// 富文本框
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)


// 引入 axios 
import myaxios from './assets/js/myaxios.js'
// 调用axios
Vue.use(myaxios)

// 定义一个全局组件
Vue.component(TreeGrid.name,TreeGrid)

// 在这里还要引入全局样式
import './assets/css/index.css'
Vue.use(elementUi)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
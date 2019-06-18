// import Vue from 'vue'
import Router from 'vue-router'
// 引入userElement组件
// 原来的方式
// import loginElement from '../components/login/loginElement.vue'
// import Home from '../components/Home.vue'
// import User from '../components/user/user.vue'
// import Mian from '../components/user/main.vue'
// import Rights from '../components/rights/rights.vue'
// import Role from '../components/role/role.vue'
// import productList from '../components/product/productList.vue'
// import goodsAdd from '../components/product/goodsAdd.vue'
// import categories from '../components/categories/categories.vue'
// import Reports from '../components/Reports/Reports.vue'

// 使用懒加载
var   loginElement =()=>  import ('../components/login/loginElement.vue' )
var   Home =()=>  import ('../components/Home.vue' )
var   User =()=>  import ('../components/user/user.vue' )
var   Mian =()=>  import ('../components/user/main.vue' )
var   Rights =()=>  import ('../components/rights/rights.vue' )
var   Role =()=>  import ('../components/role/role.vue' )
var   productList =()=>  import ('../components/product/productList.vue' )
var   goodsAdd =()=>  import ('../components/product/goodsAdd.vue' )
var   categories =()=>  import ('../components/categories/categories.vue' )
var   Reports =()=>  import ('../components/Reports/Reports.vue' )


import mymoment from '../assets/js/mymoment'
import {Message} from 'element-ui'
Vue.use(Router)
Vue.use(mymoment)

 let router =  new Router({
  mode: 'history',
  // 把哈希/#去掉
  routes: [
    // 当请求根目录的时候 重定向到home页面中
    {path: '/',redirect: '/home'},            
    // {path:'/',redirect:{name:'home'}},//重定向的第二种
    {path: '/login',name:'login',component: loginElement},
    {//下面的user是home页面的子路由
      path: '/home',name:'home',component: Home,
      children:[
      {path:'/users',name:'users',component:User},//用户列表
      {path:'/main',name:'main',component:Mian},//首页main
      {path:'/rights',name:'rights',component:Rights},//权限列表
      {path:'/roles',name:'roles',component:Role},//角色列表
      {path:'/goods',name:'goods',component:productList},//商品列表
      {path:'/goods/add',name:'goodsAdd',component:goodsAdd},//商品列表的新增商品
      {path:'/categories',name:'categories',component:categories},//商品分类
      {path:'/reports',name:'reports',component:Reports},//数据报表
      ]
    },
  ]
})

router.beforeEach(function(to,from,next){
  if(to.path != '/login'){ // 如果去的路径不是登陆 是其他的路径 那么就判断他是否有token
    let token = window.localStorage.getItem('token')
    if(!token){//如果router不存在 那么就让他跳回登陆页
      Message({
        type:'error',
        message:'您还没有登陆呢！'
      })
      router.push('/login')
      return
    }
    next()//有token就执行下一步
  }
  next()//是登陆就执行下一步
})

export default router

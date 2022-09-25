import store from '@/store'
import { Notify, Toast } from 'vant';
import { createRouter, createWebHistory } from 'vue-router'

const Home = ()=> import('../views/home/Home.vue')
const Category = ()=> import('../views/category/Category.vue')
const Detail = ()=> import('../views/detail/Detail.vue')
const Profile = ()=> import('../views/profile/Profile.vue')
const ShopCart = ()=> import('../views/shopcart/ShopCart.vue')
const Register = ()=> import('../views/profile/Register.vue')
const Login = ()=> import('../views/profile/Login.vue')
const AddressEdit = ()=> import('../views/profile/AddressEdit.vue')
const AddressList = ()=> import('../views/profile/AddressList.vue')
const CreateOrder = ()=> import('../views/order/CreateOrder.vue')
const order = ()=> import('../views/order/order.vue')
const orderDetail = ()=> import('../views/order/orderDetail.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title:'图书兄弟'
    }
  },
  {
    path: '/category',
    name: 'category',
    component: Category,
    meta: {
      title:'图书兄弟-商品分类'
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: Detail,
    meta: {
      title:'图书兄弟-商品详情'
    }
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    component: ShopCart,
    meta: {
      title:'图书兄弟-购物车',
      isAuthRequired:true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      title:'图书兄弟-个人中心',
      isAuthRequired:true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title:'图书兄弟-用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title:'图书兄弟-用户登录'
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: {
      title:'图书兄弟-编辑地址'
    }
  },
  {
    path: '/addresslist',
    name: 'AddressList',
    component: AddressList,
    meta: {
      title:'图书兄弟-地址管理'
    }
  },
  {
    path: '/createorder',
    name: 'CreateOrder',
    component: CreateOrder,
    meta: {
      title:'图书兄弟-订单预览'
    }
  },
  {
    path: '/order',
    name: 'order',
    component: order,
    meta: {
      title:'图书兄弟-订单列表'
    }
  },
  {
    path: '/orderdetail',
    name: 'orderDetail',
    component: orderDetail,
    meta: {
      title:'图书兄弟-订单详情'
    }
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to,from,next)=>{
  //如果没有登陆，在这里跳转登录
  if(to.meta.isAuthRequired && store.state.user.isLogin === false ){
    Notify('您还没有登录，请先登录')
    return next('/login');
  }else{
    next();
  }
  document.title = to.meta.title
})

export default router

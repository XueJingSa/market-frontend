// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // 需要显示 NavHeader 的父路由
  {
    path: '/',
    component: () => import('@/components/NavHeader.vue'), // 父组件容器
    // redirect: '/login', //调试时我注释掉一下
    redirect: '/home',
    children: [
      // 首页
      {
        path: 'home',
        name: 'HomePage',
        component: () => import('@/views/HomePage.vue')
      },
      // 购物车页
      {
        path: 'cart',
        name: 'ShoppingCart',
        component: () => import('@/views/ShoppingCart.vue'),
        meta: { requiresAuth: true }
      },
      // 我的信息中心
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/UserProfile.vue'),
        meta: { requiresAuth: true }
      },
      // 显示一下这个页面暂时
      {
        path: '/checkout',
        name: 'CheckoutPage',
        component: () => import('@/views/CheckoutPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/search',
        name: 'SearchResults',
        component: () => import('@/views/SearchResults.vue')
      },
      {
        path: '/login',
        name: 'LoginRegister',
        component: () => import('@/views/LoginRegister.vue')
      },
      
    ]
  },

  // 不需要 NavHeader 的独立路由
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: () => import('@/views/SearchResults.vue')
  },
  {
    path: '/checkout',
    name: 'CheckoutPage',
    component: () => import('@/views/CheckoutPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'MyOrders',
    component: () => import('@/views/MyOrders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'LoginRegister',
    component: () => import('@/views/LoginRegister.vue')
  },
  // {
  //   path: '/adminProduct',
  //   name: 'AdminProduct',
  //   component: () => import('@/views/AdminProductManagement.vue')
  // },
  {
    path: '/admin',
    component: () => import('@/components/AdminNavHeader.vue'), // 父组件容器
    redirect: '/adminProduct',
    children: [
      {
        path: '/adminProduct',
        name: 'AdminProduct',
        component: () => import('@/views/AdminProductManagement.vue')
      },
      {
        path: '/adminOrder',
        name: 'AdminOrder',
        component: () => import('@/views/AdminOrderManagement.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})



export default router
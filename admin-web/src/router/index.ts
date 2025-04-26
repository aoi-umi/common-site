import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
export const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   // redirect: '/menuMgt',
  // },
  // {
  //   path: '/signIn',
  //   component: () => import('../views/sign-in'),
  //   meta: {
  //     name: 'signIn',
  //     text: '登录',
  //   },
  // },
  // {
  //   path: '/sysMgt',
  //   component: () => import('../views/sys-mgt'),
  //   meta: {
  //     name: 'sysMgt',
  //     text: '系统管理',
  //   },
  // },
  {
    path: '/menuMgt',
    component: () => import('../views/menu-mgt'),
    meta: {
      name: 'menuMgt',
      text: '菜单管理',
    },
  },
  // {
  //   path: '/authorityMgt',
  //   component: () => import('../views/authority-mgt'),
  //   meta: {
  //     name: 'authorityMgt',
  //     text: '权限管理',
  //   },
  // },
  // {
  //   path: '/roleMgt',
  //   component: () => import('../views/role-mgt'),
  //   meta: {
  //     name: 'roleMgt',
  //     text: '角色管理',
  //   },
  // },
  // {
  //   path: '/apiMgt',
  //   component: () => import('../views/api-mgt'),
  //   meta: {
  //     name: 'apiMgt',
  //     text: 'api管理',
  //   },
  // },
  // {
  //   path: '/adminUser/:id',
  //   component: () =>
  //     import('../views/admin-user').then((t) => t.AdminUserDetail),
  //   meta: {
  //     name: 'adminUserDetail',
  //     text: '用户',
  //   },
  // },
  // {
  //   path: '/adminUserMgt',
  //   component: () => import('../views/admin-user-mgt'),
  //   meta: {
  //     name: 'adminUserMgt',
  //     text: '管理端用户管理',
  //   },
  // },
  {
    path: '/:path(.*)',
    component: () => import('../views/error'),
    meta: {
      name: 'error',
      text: '错误页',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

export default router

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const route = {
  path: '/dashboard',
  component: Layout,
  redirect: '/dashboard/index',
  name: 'dashboard',
  meta: {
    title: '个人工作台',
    icon: 'icon-gongzuotai1'
  },
  children: [
    {
      path: '/index',
      component: () => import('@/views/workbench/index.vue'),
      name: 'dashboard-index',
      meta: {
        /**隐藏侧边菜单栏 */
        hiddenSidebar: false
      }
    },
    {
      path: '/customTable',
      component: () => import('@/views/customtable/index.vue'),
      name: 'customTable'
    }
  ]
}
export default route

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import Empty from '@/layout/empty.vue'
const route = {
  path: '/system',
  component: Layout,
  redirect: '/system/wbs',
  name: 'system',
  meta: {
    title: '系统管理',
    icon: 'icon-shezhi',
    auth: 'system'
  },
  children: [
    {
      path: 'config',
      component: Empty,
      name: 'system-config',
      meta: { title: '系统配置', auth: 'system' }
    },
    {
      path: 'user',
      component: Empty,
      name: 'system-user',
      meta: { title: '用户管理', auth: 'system' }
    },
    {
      path: 'auth',
      component: Empty,
      name: 'system-auth',
      meta: { title: '权限管理', auth: 'system' }
    },
    {
      path: 'log',
      component: Empty,
      name: 'system-log',
      meta: { title: '系统日志', auth: 'system' }
    },
    {
      path: 'corp',
      component: Empty,
      name: 'system-corp',
      meta: { title: '机构管理', auth: 'system' }
    },
    {
      path: 'config',
      component: Empty,
      name: 'system-config',
      meta: { title: '系统配置', auth: 'system' }
    }
  ]
}
export default route

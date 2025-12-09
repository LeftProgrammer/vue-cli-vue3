/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import Empty from '@/layout/empty.vue'

const route = {
  path: '/analysis',
  component: Layout,
  redirect: '/analysis/overview',
  name: 'analysis',
  meta: {
    title: '综合分析',
    icon: 'icon-chaxun1'
  },
  children: [
    {
      path: 'overview',
      component: Empty,
      name: 'analysis-index',
      redirect: '/analysis/overview/general',
      meta: { title: '项目信息总览', auth: 'build' },
      children: [
        {
          path: 'general',
          component: () => import('@/views/Analysis/General/index.vue'),
          name: 'analysis-overview-general',
          meta: { title: '项目概览', auth: 'build' }
        },
        {
          path: 'monitor',
          component: () => import('@/views/Analysis/Monitor/index.vue'),
          name: 'analysis-overview-monitor',
          meta: { title: '安全隐患监控', auth: 'build' }
        }
      ]
    },
    {
      path: 'investment',
      component: () => import('@/views/Analysis/index.vue'),
      name: 'analysis-investment',
      meta: { title: '投资综合查询', auth: 'build' }
    },
    {
      path: 'progress',
      component: () => import('@/views/Analysis/index.vue'),
      name: 'analysis-progress',
      meta: { title: '进度综合查询', auth: 'build' }
    },
    {
      path: 'safe',
      component: () => import('@/views/Analysis/index.vue'),
      name: 'analysis-safe',
      meta: { title: '安全综合查询', auth: 'build' }
    },
    {
      path: 'quality',
      component: () => import('@/views/Analysis/index.vue'),
      name: 'analysis-quality',
      meta: { title: '质量综合查询', auth: 'build' }
    },
    {
      path: 'design',
      component: () => import('@/views/Analysis/index.vue'),
      name: 'analysis-design',
      meta: { title: '设计综合查询', auth: 'build' }
    },
    {
      path: 'contract',
      component: () => import('@/views/Analysis/index.vue'),
      name: 'analysis-contract',
      meta: { title: '合同综合查询', auth: 'build' }
    },
    {
      path: 'material',
      component: () => import('@/views/Analysis/index.vue'),
      name: 'analysis-material',
      meta: { title: '物资综合查询', auth: 'build' }
    }
  ]
}
export default route

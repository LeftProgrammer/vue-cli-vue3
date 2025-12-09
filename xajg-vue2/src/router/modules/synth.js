/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import Empty from '@/layout/empty.vue'

// import Null from '@/layout/null.vue'

const route = {
  path: '/synth',
  component: Layout,
  redirect: '/synth/video',
  name: 'synth',
  meta: {
    title: '综合管理',
    icon: 'icon-zongheguanli',
    auth: 'synth'
  },
  children: [
    {
      path: 'notice',
      component: Empty,
      name: 'synth-notice',
      meta: {
        title: '新闻公告'
      },
      children: [
      ]
    }
  ]
}
export default route

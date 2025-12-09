/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
import Empty from '@/layout/empty.vue'
import Build from '@/views/bussiness/Build/index.vue'

// import Temp from '@/views/bussiness/temp.vue'

const route = {
  path: '/build',
  component: Layout,
  redirect: '/build/design',
  name: 'build',
  meta: {
    title: '工程建造',
    icon: 'icon-eng',
    auth: 'build'
  },
  children: [
    {
      path: 'device',
      component: Empty,
      name: 'build-device',
      meta: { title: '设备管理', auth: 'build' },
      redirect: '/build/device/build',
      children: [
        {
          path: 'build',
          component: Build,
          name: 'build-device-build',
          meta: { title: '智能监造', auth: 'build' }
        },
        {
          path: 'acceptance',
          component: Build,
          name: 'build-device-acceptance',
          meta: { title: '出厂验收', auth: 'build' }
        },
        {
          path: 'Logistics',
          component: Build,
          name: 'build-device-Logistics',
          meta: { title: '物流监控', auth: 'build' }
        },
        {
          path: 'entry',
          component: Build,
          name: 'build-device-entry',
          meta: { title: '智能入库', auth: 'build' }
        },
        {
          path: 'monitor',
          component: Build,
          name: 'build-device-monitor',
          meta: { title: '安装监控', auth: 'build' }
        }
      ]
    }

  ]
}
export default route

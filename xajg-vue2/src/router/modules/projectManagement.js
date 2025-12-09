/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout'
// import Empty from '@/layout/empty.vue'
// import Temp from '@/views/bussiness/temp.vue'

const route = {
  path: '/projectManagement',
  component: Layout,
  redirect: '/projectManagement/scheme',
  name: 'projectManagement',
  meta: {
    title: '项目管理',
    icon: 'icon-eng',
    auth: 'pm-design-xqjh'
  },
  children: [
  ]
}
export default route

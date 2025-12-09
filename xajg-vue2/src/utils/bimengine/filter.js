import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function(value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('dateFomart', function(value, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (!value) return ''
  return moment(value).format(pattern)
})

Vue.filter('byteToMB', function(data, fixed = 2) {
  return (data / 1024 / 1024).toFixed(fixed)
})
